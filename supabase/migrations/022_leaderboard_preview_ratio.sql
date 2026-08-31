-- Adds the top scorer's success ratio (% correct) to the public leaderboard
-- preview, alongside their points - the marketing teaser wants to say both
-- "1700 pts" and "85% de réussite" for the same top performer.

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
      sum(correct_count) * 10 as points,
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
