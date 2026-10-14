-- Le tableau de bord relisait tout l'historique de réponses de la personne
-- (deux fois : progression de la dernière session, puis statistiques) pour
-- calculer quelques totaux dans le navigateur. Ce calcul se fait désormais
-- ici : une seule réponse, de la taille d'un résumé, quel que soit le nombre
-- de réponses passées.
--
-- p_tz : fuseau du navigateur ; les "jours d'activité" (série de jours
-- consécutifs) sont des jours civils de la personne, pas du serveur.

create index if not exists attempts_user_answered_idx
  on public.attempts (user_id, answered_at);
create index if not exists exam_results_cert_completed_idx
  on public.exam_results (certification_id, completed_at);

create or replace function public.get_my_attempt_summary(p_tz text default 'UTC')
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  with tz as (
    select case when exists (select 1 from pg_timezone_names where name = p_tz) then p_tz else 'UTC' end as name
  ),
  a as (
    select at.is_correct,
           at.answered_at,
           q.domain,
           c.slug,
           to_char(at.answered_at at time zone (select name from tz), 'YYYY-MM-DD') as day
    from public.attempts at
    left join public.quiz_questions q on q.id = at.question_id
    left join public.certifications c on c.id = q.certification_id
    where at.user_id = auth.uid()
  ),
  -- A new run starts after a gap of more than 20 minutes (same rule the
  -- dashboard has always used for "last session").
  flagged as (
    select slug, is_correct, answered_at,
           case when answered_at - lag(answered_at) over (partition by slug order by answered_at) > interval '20 minutes'
                then 1 else 0 end as is_new
    from a
    where slug is not null
  ),
  runs as (
    select slug, is_correct,
           sum(is_new) over (partition by slug order by answered_at rows between unbounded preceding and current row) as run_no
    from flagged
  ),
  last_run as (
    select slug,
           count(*) filter (where run_no = (select max(r2.run_no) from runs r2 where r2.slug = runs.slug)) as answered,
           count(*) filter (where run_no = (select max(r2.run_no) from runs r2 where r2.slug = runs.slug) and is_correct) as correct
    from runs
    group by slug
  ),
  per_cert as (
    select slug,
           count(*) as answered,
           count(*) filter (where is_correct) as correct,
           array_agg(distinct day order by day) as days
    from a
    where slug is not null
    group by slug
  ),
  per_domain as (
    select slug, domain, count(*) as answered, count(*) filter (where is_correct) as correct
    from a
    where slug is not null and domain is not null
    group by slug, domain
  )
  select jsonb_build_object(
    'answered_total', (select count(*) from a),
    'correct_total', (select count(*) filter (where is_correct) from a),
    'days', coalesce((select jsonb_agg(d order by d) from (select distinct day as d from a) x), '[]'::jsonb),
    'certs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'slug', pc.slug,
        'answered', pc.answered,
        'correct', pc.correct,
        'days', to_jsonb(pc.days),
        'last_run_answered', coalesce(lr.answered, 0),
        'last_run_correct', coalesce(lr.correct, 0),
        'domains', coalesce((
          select jsonb_agg(jsonb_build_object('key', pd.domain, 'answered', pd.answered, 'correct', pd.correct))
          from per_domain pd where pd.slug = pc.slug
        ), '[]'::jsonb)
      ))
      from per_cert pc left join last_run lr on lr.slug = pc.slug
    ), '[]'::jsonb)
  );
$$;

revoke all on function public.get_my_attempt_summary(text) from public, anon;
grant execute on function public.get_my_attempt_summary(text) to authenticated;
