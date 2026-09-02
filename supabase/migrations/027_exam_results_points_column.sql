-- The client now scores exam runs per correct sub-answer (5 pts each,
-- credited proportionally on multi-pick/order/match/hotspot questions)
-- instead of a flat 10 pts per fully-correct question. exam_results only
-- ever stored correct_count/total_count (plain question counts, still
-- needed for the % ratio shown on the leaderboard), so it can't reconstruct
-- that finer-grained total - store the actual points earned per session
-- and have the leaderboard functions sum that directly instead of
-- re-deriving it as correct_count * 10.

alter table public.exam_results
  add column if not exists points integer not null default 0 check (points >= 0);

-- Backfill existing rows with the old flat formula - the closest available
-- approximation, since the original per-sub-answer breakdown wasn't kept.
update public.exam_results set points = correct_count * 10 where points = 0;

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
    select er.user_id, er.correct_count, er.total_count, er.points, er.completed_at, er.id
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
      sum(points) as points,
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

drop function if exists public.get_certification_leaderboard_preview(uuid);

create function public.get_certification_leaderboard_preview(p_certification_id uuid)
returns table (top_points bigint, top_ratio numeric, total_sessions bigint)
language sql
security definer set search_path = public
stable
as $$
  with per_user as (
    select
      user_id,
      sum(points) as points,
      sum(correct_count)::numeric / nullif(sum(total_count), 0) as ratio
    from public.exam_results
    where certification_id = p_certification_id
      and completed_at >= date_trunc('month', now())
    group by user_id
  ),
  top_scorer as (
    select points, ratio from per_user order by points desc limit 1
  )
  select
    (select points from top_scorer),
    (select ratio from top_scorer),
    (
      select count(*) from public.exam_results
      where certification_id = p_certification_id
        and completed_at >= date_trunc('month', now())
    );
$$;

revoke all on function public.get_certification_leaderboard_preview(uuid) from public;
grant execute on function public.get_certification_leaderboard_preview(uuid) to anon, authenticated;
