-- Public, fully anonymized preview of a certification's monthly leaderboard
-- for logged-out visitors on the marketing page (Formations.tsx): just the
-- top score, no name, no rank list - a teaser to encourage signing up, never
-- an identity leak. The full first-name leaderboard stays authenticated-only
-- (get_certification_period_leaderboard).
create function public.get_certification_leaderboard_preview(p_certification_id uuid)
returns table (top_points bigint, total_sessions bigint)
language sql
security definer set search_path = public
stable
as $$
  select
    (
      select sum(er.correct_count) * 10
      from public.exam_results er
      where er.certification_id = p_certification_id
        and er.completed_at >= date_trunc('month', now())
      group by er.user_id
      order by sum(er.correct_count) desc
      limit 1
    ) as top_points,
    (
      select count(*)
      from public.exam_results er
      where er.certification_id = p_certification_id
        and er.completed_at >= date_trunc('month', now())
    ) as total_sessions;
$$;

revoke all on function public.get_certification_leaderboard_preview(uuid) from public;
grant execute on function public.get_certification_leaderboard_preview(uuid) to anon, authenticated;
