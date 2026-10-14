-- Admin "Audit" area: an action journal and an hourly security check.
-- Same idea as the Audit page of the Wonjo back office (journal + security).
--
-- Safe for existing users: purely additive (new tables and functions). No
-- existing table, column, policy or access rule is changed, and no purchase,
-- profile or access row is read-for-write or touched. The only existing
-- objects that gain something are two admin e-mail tables, which get a
-- trigger that WRITES A LOG LINE (it never alters or blocks their rows).
--
-- 1. admin_audit_log   - append-only journal of what the admin did.
--                        Nobody can edit or erase a line, not even the admin.
--                        Keeps no personal data: no e-mail addresses of
--                        customers, only counts, ids and labels.
-- 2. security_signals  - findings of security_scan(), run every hour by
--                        pg_cron (and on demand from the page). It only
--                        READS the database and writes its own two tables.
-- 3. security_state    - small key/value store (config snapshot, last scan).

-- ---------------------------------------------------------------------------
-- 1. Action journal
-- ---------------------------------------------------------------------------
create table if not exists public.admin_audit_log (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  actor text not null,
  action text not null,
  target_type text,
  target_id text,
  target_label text,
  detail jsonb not null default '{}'::jsonb
);
create index if not exists admin_audit_log_created_at_idx on public.admin_audit_log (created_at desc);
alter table public.admin_audit_log enable row level security;

drop policy if exists "admin reads audit log" on public.admin_audit_log;
create policy "admin reads audit log"
  on public.admin_audit_log for select
  using (auth.jwt() ->> 'email' = 'mbairo.allatessem@gmail.com');

-- No insert/update/delete policy: lines are written by the Edge Functions
-- (service role) and by the triggers below, never by the browser.
revoke insert, update, delete, truncate on public.admin_audit_log from anon, authenticated;

create or replace function public.fn_audit_log_immutable()
returns trigger
language plpgsql
as $$
begin
  raise exception 'admin_audit_log is append-only';
end;
$$;

drop trigger if exists admin_audit_log_no_change on public.admin_audit_log;
create trigger admin_audit_log_no_change
  before update or delete on public.admin_audit_log
  for each row execute function public.fn_audit_log_immutable();

drop trigger if exists admin_audit_log_no_truncate on public.admin_audit_log;
create trigger admin_audit_log_no_truncate
  before truncate on public.admin_audit_log
  for each statement execute function public.fn_audit_log_immutable();

-- Internal writer used by the triggers and the admin functions below.
create or replace function public.fn_audit(
  p_action text,
  p_target_type text default null,
  p_target_id text default null,
  p_target_label text default null,
  p_detail jsonb default '{}'::jsonb
)
returns void
language sql
security definer
set search_path = public, pg_temp
as $$
  insert into public.admin_audit_log (actor, action, target_type, target_id, target_label, detail)
  values (coalesce(auth.jwt() ->> 'email', 'system'), p_action, p_target_type, p_target_id, p_target_label,
          coalesce(p_detail, '{}'::jsonb));
$$;
revoke all on function public.fn_audit(text, text, text, text, jsonb) from public, anon, authenticated;

-- E-mail templates: created / edited / trashed / restored / deleted.
create or replace function public.trg_audit_email_templates()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'INSERT' then
    perform public.fn_audit('template_created', 'email_template', new.id::text, new.name,
      jsonb_build_object('category', new.category));
  elsif tg_op = 'DELETE' then
    perform public.fn_audit('template_deleted', 'email_template', old.id::text, old.name, '{}'::jsonb);
  elsif old.trashed_at is null and new.trashed_at is not null then
    perform public.fn_audit('template_trashed', 'email_template', new.id::text, new.name, '{}'::jsonb);
  elsif old.trashed_at is not null and new.trashed_at is null then
    perform public.fn_audit('template_restored', 'email_template', new.id::text, new.name, '{}'::jsonb);
  elsif (old.name, old.subject, old.body, old.category) is distinct from (new.name, new.subject, new.body, new.category) then
    perform public.fn_audit('template_updated', 'email_template', new.id::text, new.name,
      jsonb_build_object('category', new.category));
  end if;
  return null;
end;
$$;

drop trigger if exists audit_email_templates on public.admin_email_templates;
create trigger audit_email_templates
  after insert or update or delete on public.admin_email_templates
  for each row execute function public.trg_audit_email_templates();

-- Sent campaigns: moved to the trash / restored / deleted for good. (The send
-- itself is logged by the admin-send-email function.)
create or replace function public.trg_audit_email_campaigns()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'DELETE' then
    perform public.fn_audit('campaign_deleted', 'email_campaign', old.id::text, old.subject,
      jsonb_build_object('recipients', old.recipients));
  elsif old.trashed_at is null and new.trashed_at is not null then
    perform public.fn_audit('campaign_trashed', 'email_campaign', new.id::text, new.subject, '{}'::jsonb);
  elsif old.trashed_at is not null and new.trashed_at is null then
    perform public.fn_audit('campaign_restored', 'email_campaign', new.id::text, new.subject, '{}'::jsonb);
  end if;
  return null;
end;
$$;

drop trigger if exists audit_email_campaigns on public.admin_email_campaigns;
create trigger audit_email_campaigns
  after update or delete on public.admin_email_campaigns
  for each row execute function public.trg_audit_email_campaigns();

-- ---------------------------------------------------------------------------
-- 2. Security signals
-- ---------------------------------------------------------------------------
create table if not exists public.security_signals (
  id uuid primary key default gen_random_uuid(),
  detected_at timestamptz not null default now(),
  type text not null,
  severity text not null check (severity in ('alert', 'to_check', 'to_watch')),
  dedupe_key text not null default '',
  details jsonb not null default '{}'::jsonb,
  -- handled_at set + handled_by null = closed by itself (the situation went
  -- back to normal); handled_by = the admin who dealt with it.
  handled_at timestamptz,
  handled_by text,
  note text
);
-- One open signal per (type, key): a scan never stacks duplicates.
create unique index if not exists security_signals_open_uniq
  on public.security_signals (type, dedupe_key) where handled_at is null;
create index if not exists security_signals_detected_idx on public.security_signals (detected_at desc);
alter table public.security_signals enable row level security;

drop policy if exists "admin reads security signals" on public.security_signals;
create policy "admin reads security signals"
  on public.security_signals for select
  using (auth.jwt() ->> 'email' = 'mbairo.allatessem@gmail.com');
revoke insert, update, delete, truncate on public.security_signals from anon, authenticated;

create table if not exists public.security_state (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.security_state enable row level security;

drop policy if exists "admin reads security state" on public.security_state;
create policy "admin reads security state"
  on public.security_state for select
  using (auth.jwt() ->> 'email' = 'mbairo.allatessem@gmail.com');
revoke insert, update, delete, truncate on public.security_state from anon, authenticated;

-- The hourly check. Read-only on everything except its own tables.
--   rls_off               table of the public schema without row level security
--   access_without_payment paid Gumroad/Stripe access with no sale/session id
--   gumroad_unverified    Gumroad pings Gumroad itself did not confirm (24 h)
--   signup_burst          many accounts created within one hour
--   voucher_burst         one voucher redeemed many times within one hour
--   config_changed        policies, functions, grants or cron jobs changed
--                         since the previous scan (normal after a migration)
create or replace function public.security_scan()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_findings jsonb := '[]'::jsonb;
  v_auto constant text[] := array['rls_off', 'access_without_payment', 'gumroad_unverified', 'signup_burst', 'voucher_burst'];
  v_count int;
  v_last timestamptz;
  v_snapshot jsonb;
  v_previous jsonb;
  v_added jsonb;
  v_removed jsonb;
  v_opened int := 0;
  v_closed int := 0;
  f record;
  r record;
begin
  -- Tables without row level security.
  for r in
    select c.relname
    from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind in ('r', 'p') and not c.relrowsecurity
  loop
    v_findings := v_findings || jsonb_build_array(jsonb_build_object(
      'type', 'rls_off', 'severity', 'alert', 'key', r.relname,
      'details', jsonb_build_object('table', r.relname)));
  end loop;

  -- Paid access that no real payment backs.
  for r in
    select id, user_id, source, created_at
    from public.certification_purchases
    where status = 'paid'
      and ((source = 'gumroad' and gumroad_sale_id is null)
        or (source = 'stripe' and stripe_checkout_session_id is null))
  loop
    v_findings := v_findings || jsonb_build_array(jsonb_build_object(
      'type', 'access_without_payment', 'severity', 'alert', 'key', r.id::text,
      'details', jsonb_build_object('purchase_id', r.id, 'user_id', r.user_id, 'source', r.source, 'since', r.created_at)));
  end loop;

  -- Gumroad pings that failed verification in the last 24 hours.
  select count(*), max(received_at) into v_count, v_last
  from public.gumroad_webhook_logs
  where verification_result = 'failed' and received_at > now() - interval '24 hours';
  if v_count > 0 then
    v_findings := v_findings || jsonb_build_array(jsonb_build_object(
      'type', 'gumroad_unverified', 'severity', 'to_check', 'key', 'last-24h',
      'details', jsonb_build_object('count', v_count, 'last_at', v_last)));
  end if;

  -- Account creation burst.
  select count(*) into v_count from public.profiles where created_at > now() - interval '1 hour';
  if v_count >= 10 then
    v_findings := v_findings || jsonb_build_array(jsonb_build_object(
      'type', 'signup_burst', 'severity', 'to_watch', 'key', to_char(now(), 'YYYY-MM-DD'),
      'details', jsonb_build_object('accounts_1h', v_count)));
  end if;

  -- One voucher redeemed many times within an hour.
  for r in
    select v.id, v.certification_id, count(*) as n
    from public.exam_voucher_redemptions x join public.exam_vouchers v on v.id = x.voucher_id
    where x.redeemed_at > now() - interval '1 hour'
    group by v.id, v.certification_id
    having count(*) >= 8
  loop
    v_findings := v_findings || jsonb_build_array(jsonb_build_object(
      'type', 'voucher_burst', 'severity', 'to_watch', 'key', r.id::text || to_char(now(), 'YYYY-MM-DD'),
      'details', jsonb_build_object('voucher_id', r.id, 'redemptions_1h', r.n)));
  end loop;

  -- Configuration snapshot: row level security rules, functions (with who may
  -- run them), and scheduled jobs.
  select coalesce(jsonb_agg(item order by item), '[]'::jsonb) into v_snapshot
  from (
    select format('policy %s.%s "%s" [%s] #%s', schemaname, tablename, policyname, cmd,
                  left(md5(coalesce(qual, '') || '|' || coalesce(with_check, '')), 8)) as item
    from pg_policies where schemaname = 'public'
    union all
    select format('function %s(%s)%s run-by:%s%s #%s', p.proname, pg_get_function_identity_arguments(p.oid),
                  case when p.prosecdef then ' security-definer' else '' end,
                  case when has_function_privilege('anon', p.oid, 'execute') then 'anon,' else '' end
                    || case when has_function_privilege('authenticated', p.oid, 'execute') then 'signed-in' else 'no-one' end,
                  '', left(md5(p.prosrc), 8))
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.prokind = 'f'
    union all
    select format('cron %s "%s" #%s', jobname, schedule, left(md5(command), 8))
    from cron.job
  ) s;

  select value into v_previous from public.security_state where key = 'config_snapshot';
  if v_previous is not null and v_previous <> v_snapshot then
    select coalesce(jsonb_agg(x), '[]'::jsonb) into v_added
    from (select jsonb_array_elements_text(v_snapshot) as x
          except select jsonb_array_elements_text(v_previous)) d;
    select coalesce(jsonb_agg(x), '[]'::jsonb) into v_removed
    from (select jsonb_array_elements_text(v_previous) as x
          except select jsonb_array_elements_text(v_snapshot)) d;
    v_findings := v_findings || jsonb_build_array(jsonb_build_object(
      'type', 'config_changed', 'severity', 'to_check', 'key', left(md5(v_snapshot::text), 12),
      'details', jsonb_build_object(
        'added', (select coalesce(jsonb_agg(value), '[]'::jsonb) from (select value from jsonb_array_elements_text(v_added) limit 40) l),
        'removed', (select coalesce(jsonb_agg(value), '[]'::jsonb) from (select value from jsonb_array_elements_text(v_removed) limit 40) l),
        'nb_added', jsonb_array_length(v_added),
        'nb_removed', jsonb_array_length(v_removed))));
  end if;
  insert into public.security_state (key, value, updated_at) values ('config_snapshot', v_snapshot, now())
  on conflict (key) do update set value = excluded.value, updated_at = now();

  -- Open what is new. A signal an admin already handled for the same
  -- (type, key) is accepted for good and never comes back.
  for f in
    select * from jsonb_to_recordset(v_findings) as x(type text, severity text, key text, details jsonb)
  loop
    if exists (
      select 1 from public.security_signals s
      where s.type = f.type and s.dedupe_key = f.key and s.handled_at is null
    ) then
      update public.security_signals set details = f.details
      where type = f.type and dedupe_key = f.key and handled_at is null;
    elsif not exists (
      select 1 from public.security_signals s
      where s.type = f.type and s.dedupe_key = f.key and s.handled_by is not null
    ) then
      insert into public.security_signals (type, severity, dedupe_key, details)
      values (f.type, f.severity, f.key, f.details);
      v_opened := v_opened + 1;
    end if;
  end loop;

  -- Close by themselves the signals whose situation is back to normal.
  update public.security_signals s
  set handled_at = now()
  where s.handled_at is null
    and s.type = any (v_auto)
    and not exists (
      select 1 from jsonb_to_recordset(v_findings) as x(type text, key text)
      where x.type = s.type and x.key = s.dedupe_key
    );
  get diagnostics v_closed = row_count;

  insert into public.security_state (key, value, updated_at)
  values ('last_scan', jsonb_build_object('at', now(), 'opened', v_opened, 'closed', v_closed), now())
  on conflict (key) do update set value = excluded.value, updated_at = now();

  return jsonb_build_object('opened', v_opened, 'closed', v_closed);
end;
$$;
revoke all on function public.security_scan() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. What the admin page may call
-- ---------------------------------------------------------------------------
create or replace function public.admin_run_security_scan()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_result jsonb;
begin
  if coalesce(auth.jwt() ->> 'email', '') <> 'mbairo.allatessem@gmail.com' then
    raise exception 'Forbidden';
  end if;
  v_result := public.security_scan();
  perform public.fn_audit('security_scan_run', 'security', null, null, v_result);
  return v_result;
end;
$$;
revoke all on function public.admin_run_security_scan() from public, anon;
grant execute on function public.admin_run_security_scan() to authenticated;

create or replace function public.admin_handle_security_signal(p_id uuid, p_note text)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_signal public.security_signals;
begin
  if coalesce(auth.jwt() ->> 'email', '') <> 'mbairo.allatessem@gmail.com' then
    raise exception 'Forbidden';
  end if;
  if length(trim(coalesce(p_note, ''))) < 3 then
    raise exception 'A note is required';
  end if;
  update public.security_signals
  set handled_at = now(), handled_by = auth.jwt() ->> 'email', note = trim(p_note)
  where id = p_id and handled_at is null
  returning * into v_signal;
  if not found then
    raise exception 'Signal not found or already handled';
  end if;
  perform public.fn_audit('security_signal_handled', 'security_signal', p_id::text, v_signal.type,
    jsonb_build_object('severity', v_signal.severity));
end;
$$;
revoke all on function public.admin_handle_security_signal(uuid, text) from public, anon;
grant execute on function public.admin_handle_security_signal(uuid, text) to authenticated;

-- Hourly, a few minutes past the hour (the other jobs run on the hour).
select cron.schedule('security-scan', '7 * * * *', $$ select public.security_scan(); $$);

-- First run: records the configuration as it is today (the baseline the next
-- scans are compared with) and opens a signal for anything already wrong.
select public.security_scan();
