-- Switches the public leaderboard preview from a cumulative monthly total
-- to the single best session this month - a genuine "top score" (one
-- attempt's result) rather than points added up across several runs.

drop function if exists public.get_certification_leaderboard_preview(uuid);

create function public.get_certification_leaderboard_preview(p_certification_id uuid)
returns table (top_points bigint, top_ratio numeric, total_sessions bigint)
language sql
security definer set search_path = public
stable
as $$
  with best_session as (
    select
      er.correct_count * 10 as points,
      er.correct_count::numeric / nullif(er.total_count, 0) as ratio
    from public.exam_results er
    where er.certification_id = p_certification_id
      and er.completed_at >= date_trunc('month', now())
    order by er.correct_count desc, (er.correct_count::numeric / nullif(er.total_count, 0)) desc
    limit 1
  )
  select
    (select points from best_session),
    (select ratio from best_session),
    (
      select count(*) from public.exam_results er
      where er.certification_id = p_certification_id
        and er.completed_at >= date_trunc('month', now())
    );
$$;

revoke all on function public.get_certification_leaderboard_preview(uuid) from public;
grant execute on function public.get_certification_leaderboard_preview(uuid) to anon, authenticated;
