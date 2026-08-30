-- Lets the leaderboard be viewed for the current week or the current month,
-- instead of only the month. Replaces
-- get_certification_monthly_leaderboard with a period-parameterized
-- version.

drop function if exists public.get_certification_monthly_leaderboard(uuid);

-- p_period must be 'week' or 'month' (validated, defaults to 'month' on any
-- other value so a bad client input can't be used to probe arbitrary
-- date_trunc fields).
create function public.get_certification_period_leaderboard(
  p_certification_id uuid,
  p_period text default 'month'
)
returns table (rank bigint, first_name text, points bigint, session_count bigint, is_you boolean)
language sql
security definer set search_path = public
stable
as $$
  select
    row_number() over (order by agg.points desc, agg.last_completed asc) as rank,
    coalesce(p.first_name, 'Anonyme') as first_name,
    agg.points,
    agg.session_count,
    agg.user_id = auth.uid() as is_you
  from (
    select
      er.user_id,
      sum(er.correct_count) * 10 as points,
      count(*) as session_count,
      max(er.completed_at) as last_completed
    from public.exam_results er
    where er.certification_id = p_certification_id
      and er.completed_at >= date_trunc(
        case when p_period = 'week' then 'week' else 'month' end,
        now()
      )
    group by er.user_id
  ) agg
  join public.profiles p on p.id = agg.user_id
  order by rank
  limit 500;
$$;

revoke all on function public.get_certification_period_leaderboard(uuid, text) from public, anon;
grant execute on function public.get_certification_period_leaderboard(uuid, text) to authenticated;
