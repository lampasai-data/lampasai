-- Adds each user's average success rate over the whole period, alongside the
-- cumulative points (volume) and the last session ratio (current form).
--
-- Ranking still goes by points. Average is deliberately NOT the sort key:
-- ranking by an average rewards stopping while ahead - one short flawless run
-- would outrank hundreds of hard questions - which is the opposite of what a
-- revision app wants. It does serve as the tie-break, so at equal effort the
-- more accurate player comes out on top.

drop function if exists public.get_certification_period_leaderboard(uuid, text);

create function public.get_certification_period_leaderboard(
  p_certification_id uuid,
  p_period text default 'month'
)
returns table (
  rank bigint,
  first_name text,
  points bigint,
  session_count bigint,
  avg_ratio numeric,
  last_ratio numeric,
  is_you boolean
)
language sql
security definer set search_path = public
stable
as $$
  with scoped as (
    select er.user_id, er.correct_count, er.total_count, er.completed_at, er.id
    from public.exam_results er
    where er.certification_id = p_certification_id
      and er.completed_at >= date_trunc(
        case when p_period = 'week' then 'week' else 'month' end,
        now()
      )
  ),
  agg as (
    select
      user_id,
      sum(correct_count) * 10 as points,
      count(*) as session_count,
      -- Weighted by question count, not an average of per-session ratios: a
      -- 200-question run should carry more weight than a 20-question one.
      sum(correct_count)::numeric / nullif(sum(total_count), 0) as avg_ratio,
      max(completed_at) as last_completed
    from scoped
    group by user_id
  ),
  -- Most recent run in the period, per user. id breaks ties when two runs
  -- share a completed_at timestamp, so the pick stays deterministic.
  latest as (
    select distinct on (user_id)
      user_id,
      correct_count::numeric / nullif(total_count, 0) as ratio
    from scoped
    order by user_id, completed_at desc, id desc
  )
  select
    row_number() over (
      order by agg.points desc, agg.avg_ratio desc nulls last, agg.last_completed asc
    ) as rank,
    coalesce(p.first_name, 'Anonyme') as first_name,
    agg.points,
    agg.session_count,
    agg.avg_ratio,
    latest.ratio as last_ratio,
    agg.user_id = auth.uid() as is_you
  from agg
  join public.profiles p on p.id = agg.user_id
  join latest on latest.user_id = agg.user_id
  order by rank
  limit 500;
$$;

revoke all on function public.get_certification_period_leaderboard(uuid, text) from public, anon;
grant execute on function public.get_certification_period_leaderboard(uuid, text) to authenticated;
