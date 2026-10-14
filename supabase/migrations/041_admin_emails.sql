-- E-mails sent from the admin area: sent history, reusable templates,
-- unsubscribe list, and recipient segments.
--
-- Two kinds of message (same split as the Wonjo back office):
--   * 'service'   - information tied to the account; no unsubscribe link, the
--                   unsubscribe list is ignored.
--   * 'promotion' - commercial offer; every mail carries an unsubscribe link
--                   and unsubscribed people are excluded from every send.
--
-- Safe for existing users: purely additive (new tables and functions). No
-- existing table, policy or access rule is changed. Recipient addresses are
-- only readable by the service role (the send function); the browser only
-- ever gets counts.
create table if not exists public.email_unsubscribes (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.email_unsubscribes enable row level security;

drop policy if exists "admin reads email unsubscribes" on public.email_unsubscribes;
create policy "admin reads email unsubscribes"
  on public.email_unsubscribes for select
  using (auth.jwt() ->> 'email' = 'mbairo.allatessem@gmail.com');

create table if not exists public.admin_email_templates (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'other',
  name text not null,
  subject text not null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  trashed_at timestamptz
);
alter table public.admin_email_templates enable row level security;

drop policy if exists "admin manages email templates" on public.admin_email_templates;
create policy "admin manages email templates"
  on public.admin_email_templates for all
  using (auth.jwt() ->> 'email' = 'mbairo.allatessem@gmail.com')
  with check (auth.jwt() ->> 'email' = 'mbairo.allatessem@gmail.com');

create table if not exists public.admin_email_campaigns (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('service', 'promotion')),
  subject text not null,
  message text not null,
  cta_label text,
  cta_url text,
  segment text not null,
  recipients int not null default 0,
  sent int not null default 0,
  failed int not null default 0,
  created_at timestamptz not null default now(),
  trashed_at timestamptz
);
alter table public.admin_email_campaigns enable row level security;

-- Rows are inserted by the send function (service role). The admin can read
-- them, trash/restore them (update) and delete them for good.
drop policy if exists "admin reads email campaigns" on public.admin_email_campaigns;
create policy "admin reads email campaigns"
  on public.admin_email_campaigns for select
  using (auth.jwt() ->> 'email' = 'mbairo.allatessem@gmail.com');

drop policy if exists "admin updates email campaigns" on public.admin_email_campaigns;
create policy "admin updates email campaigns"
  on public.admin_email_campaigns for update
  using (auth.jwt() ->> 'email' = 'mbairo.allatessem@gmail.com');

drop policy if exists "admin deletes email campaigns" on public.admin_email_campaigns;
create policy "admin deletes email campaigns"
  on public.admin_email_campaigns for delete
  using (auth.jwt() ->> 'email' = 'mbairo.allatessem@gmail.com');

-- Who a segment targets. Mirrors the alert definitions of the admin
-- dashboard (src/lib/adminAlerts.ts) so a segment count matches its alert.
-- The admin's own account is left out unless picked by hand.
create or replace function public.fn_email_segment(p_segment text, p_ids uuid[], p_type text)
returns table (user_id uuid, email text, first_name text)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  with base as (
    select p.id, p.email, p.first_name, p.created_at
    from public.profiles p
    where p.email is not null and p.email <> ''
      and (p_segment = 'selection' or lower(p.email) <> 'mbairo.allatessem@gmail.com')
      and (p_type <> 'promotion'
           or not exists (select 1 from public.email_unsubscribes e where e.user_id = p.id))
  ),
  paid as (
    select cp.user_id,
           bool_or(cp.status = 'paid') as has_paid,
           bool_or(cp.status = 'paid' and cp.expires_at > now()) as active,
           max(cp.expires_at) filter (where cp.status = 'paid') as last_exp,
           max(cp.expires_at) filter (where cp.status = 'paid' and cp.expires_at > now()) as active_exp,
           max(cp.created_at) filter (where cp.status = 'paid' and cp.expires_at > now()) as newest_active
    from public.certification_purchases cp
    where cp.source <> 'voucher'
    group by cp.user_id
  ),
  vouch as (
    select cp.user_id,
           min(cp.expires_at) filter (where cp.status = 'paid' and cp.expires_at > now()) as active_exp
    from public.certification_purchases cp
    where cp.source = 'voucher'
    group by cp.user_id
  ),
  ans as (select a.user_id, max(a.answered_at) as last_at from public.attempts a group by a.user_id),
  ex as (select e.user_id, max(e.completed_at) as last_at from public.exam_results e group by e.user_id),
  anyp as (select distinct cp.user_id from public.certification_purchases cp)
  select b.id, b.email, b.first_name
  from base b
  left join paid on paid.user_id = b.id
  left join vouch on vouch.user_id = b.id
  left join ans on ans.user_id = b.id
  left join ex on ex.user_id = b.id
  left join anyp on anyp.user_id = b.id
  where case p_segment
    when 'selection' then b.id = any (coalesce(p_ids, '{}'))
    when 'all' then true
    when 'paying' then coalesce(paid.active, false)
    when 'voucher_active' then vouch.active_exp is not null
    when 'voucher_expiring' then vouch.active_exp is not null
         and vouch.active_exp < now() + interval '7 days'
         and not coalesce(paid.active, false)
    when 'access_expiring' then coalesce(paid.active, false)
         and paid.active_exp < now() + interval '14 days'
    when 'paid_inactive' then coalesce(paid.active, false)
         and paid.newest_active < now() - interval '3 days'
         and coalesce(greatest(ans.last_at, ex.last_at), '-infinity'::timestamptz) < now() - interval '7 days'
    when 'recently_expired' then coalesce(paid.has_paid, false)
         and not coalesce(paid.active, false)
         and paid.last_exp > now() - interval '30 days'
    when 'hot_leads' then not coalesce(paid.has_paid, false)
         and coalesce(greatest(ans.last_at, ex.last_at), '-infinity'::timestamptz) > now() - interval '14 days'
    when 'dormant' then anyp.user_id is null
         and ans.last_at is null and ex.last_at is null
         and b.created_at < now() - interval '3 days'
    else false
  end;
$$;
revoke all on function public.fn_email_segment(text, uuid[], text) from public, anon, authenticated;
grant execute on function public.fn_email_segment(text, uuid[], text) to service_role;

-- Counts only (never addresses) for the composer's live "n recipients".
create or replace function public.admin_count_email_recipients(p_segment text, p_ids uuid[], p_type text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
begin
  if (auth.jwt() ->> 'email') is distinct from 'mbairo.allatessem@gmail.com' then
    raise exception 'Admin only';
  end if;
  return jsonb_build_object(
    'recipients', (select count(*) from public.fn_email_segment(p_segment, p_ids, p_type)),
    'unsubscribed_excluded', case when p_type = 'promotion'
      then (select count(*) from public.fn_email_segment(p_segment, p_ids, 'service') s
            where exists (select 1 from public.email_unsubscribes e where e.user_id = s.user_id))
      else 0 end
  );
end;
$$;
revoke all on function public.admin_count_email_recipients(text, uuid[], text) from public, anon;
grant execute on function public.admin_count_email_recipients(text, uuid[], text) to authenticated;
