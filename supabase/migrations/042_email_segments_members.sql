-- Two more e-mail segments (access ending within 48h, voucher expired and not
-- converted) and a function that lists WHO a segment targets (ids only; the
-- admin already reads profiles) so the composer can show and pick people.
-- Additive: replaces one function and adds another; no table or policy change.
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
           min(cp.expires_at) filter (where cp.status = 'paid' and cp.expires_at > now()) as active_exp,
           max(cp.expires_at) filter (where cp.status = 'paid' and cp.expires_at > now()) as max_active_exp,
           max(cp.expires_at) filter (where cp.status = 'paid') as last_exp
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
    -- Any access (paid or voucher) that ends within 48 hours.
    when 'expiring_48h' then greatest(paid.active_exp, vouch.max_active_exp) < now() + interval '48 hours'
    -- Voucher ended in the last 30 days, never bought: the best people to win back.
    when 'voucher_expired' then vouch.last_exp is not null
         and vouch.last_exp <= now()
         and vouch.last_exp > now() - interval '30 days'
         and not coalesce(paid.has_paid, false)
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


create or replace function public.admin_email_segment_members(p_segment text, p_ids uuid[], p_type text)
returns table (user_id uuid)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
begin
  if (auth.jwt() ->> 'email') is distinct from 'mbairo.allatessem@gmail.com' then
    raise exception 'Admin only';
  end if;
  return query select s.user_id from public.fn_email_segment(p_segment, p_ids, p_type) s;
end;
$$;
revoke all on function public.admin_email_segment_members(text, uuid[], text) from public, anon;
grant execute on function public.admin_email_segment_members(text, uuid[], text) to authenticated;
