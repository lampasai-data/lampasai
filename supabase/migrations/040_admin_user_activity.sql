-- Per-user practice activity for the admin dashboard (activation, retention,
-- cohorts), computed from `attempts` without opening that table to the admin:
-- the function returns only totals, and only for the admin account.
--
-- Safe for existing users: purely additive (a new function). No table, policy
-- or access rule changes; ordinary users cannot read anything through it
-- (it returns no rows unless the caller's JWT email is the admin's).
create or replace function public.admin_user_activity()
returns table (
  user_id uuid,
  first_answer_at timestamptz,
  last_answer_at timestamptz,
  answers bigint,
  correct bigint,
  active_days date[]
)
language sql
stable
security definer
set search_path = public
as $$
  select
    t.user_id,
    min(t.answered_at),
    max(t.answered_at),
    count(*),
    count(*) filter (where t.is_correct),
    array_agg(distinct t.d order by t.d)
  from (
    select user_id, answered_at, is_correct, (answered_at at time zone 'UTC')::date as d
    from public.attempts
  ) t
  where (auth.jwt() ->> 'email') = 'mbairo.allatessem@gmail.com'
  group by t.user_id;
$$;

revoke all on function public.admin_user_activity() from public, anon;
grant execute on function public.admin_user_activity() to authenticated;
