-- Replaces the best-score-ever leaderboard with a monthly points
-- leaderboard: everyone resets to zero each calendar month, ranked by
-- points earned from exam-mode sessions completed this month - rewards
-- regular practice over a single lucky run, and gives a moving target
-- instead of a lifetime high score nobody can catch up to.

drop function if exists public.get_certification_leaderboard(uuid);

-- Points multiplier (10 per correct answer) must match POINTS_PER_CORRECT
-- in src/pages/CertificationQuiz.tsx.
create function public.get_certification_monthly_leaderboard(p_certification_id uuid)
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
      and er.completed_at >= date_trunc('month', now())
    group by er.user_id
  ) agg
  join public.profiles p on p.id = agg.user_id
  order by rank
  limit 500;
$$;

revoke all on function public.get_certification_monthly_leaderboard(uuid) from public, anon;
grant execute on function public.get_certification_monthly_leaderboard(uuid) to authenticated;
