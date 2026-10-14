-- Exam results come straight from the browser (the quiz is graded client
-- side), and the only rule so far was "you write under your own id". A user
-- could therefore insert any score through the API and take the top of the
-- leaderboard (checked: 999 999 points was accepted and ranked first).
--
-- This guard checks every new row against what a real run can produce:
--   - correct answers <= questions in the run <= questions in the bank;
--   - points <= the best possible score for that many questions (5 points
--     per correct sub-answer - pick, placed item, match, blank - on the
--     questions with the most sub-answers; same rule as CertificationQuiz);
--   - at most 50 runs a day per certification (19 is the highest real day);
--   - the completion date is the server's, so a run cannot be dated into a
--     later month to stay on a future leaderboard.
-- A row that fails is dropped without an error (the user sees nothing, the
-- run simply does not count) and opens an "exam_score_rejected" signal in
-- the admin Security tab, one per person and per day.
--
-- Existing rows are not touched. Replayed against the 101 rows in prod: all
-- pass except one from 2026-08-31, scored under the former 10-points-per-
-- question rule (changed on 2026-09-02).

create or replace function public.fn_exam_result_guard()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_bank int;
  v_max_points bigint;
  v_today int;
  v_reason text;
begin
  -- Writing under someone else's id is refused by the insert policy anyway;
  -- stop here so such a row cannot open a signal in that person's name.
  if auth.uid() is not null and new.user_id is distinct from auth.uid() then
    raise exception 'exam result must belong to the caller' using errcode = '42501';
  end if;

  new.completed_at := now();

  with sub as (
    select greatest(1,
      coalesce(cardinality(correct_indexes), 0),
      coalesce(cardinality(correct_order), 0),
      coalesce(case when jsonb_typeof(targets) = 'array' then jsonb_array_length(targets) end, 0),
      coalesce(case when jsonb_typeof(targets_en) = 'array' then jsonb_array_length(targets_en) end, 0),
      coalesce(case when jsonb_typeof(blanks) = 'array' then jsonb_array_length(blanks) end, 0),
      coalesce(case when jsonb_typeof(blanks_en) = 'array' then jsonb_array_length(blanks_en) end, 0)
    ) as n
    from public.quiz_questions
    where certification_id = new.certification_id
  )
  select (select count(*) from sub),
         5 * (select coalesce(sum(n), 0) from (select n from sub order by n desc limit new.total_count) best)
  into v_bank, v_max_points;

  select count(*) into v_today
  from public.exam_results
  where user_id = new.user_id
    and certification_id = new.certification_id
    and completed_at > now() - interval '24 hours';

  v_reason := case
    when new.correct_count > new.total_count then 'correct_over_total'
    when new.total_count > v_bank then 'more_questions_than_bank'
    when new.points > v_max_points then 'points_over_max'
    when v_today >= 50 then 'too_many_today'
  end;

  if v_reason is null then
    return new;
  end if;

  insert into public.security_signals (type, severity, dedupe_key, details)
  values (
    'exam_score_rejected',
    'to_check',
    new.user_id::text || ':' || to_char(now(), 'YYYY-MM-DD'),
    jsonb_build_object(
      'user_id', new.user_id,
      'email', (select email from public.profiles where id = new.user_id),
      'certification', (select slug from public.certifications where id = new.certification_id),
      'reason', v_reason,
      'correct_count', new.correct_count,
      'total_count', new.total_count,
      'points', new.points,
      'max_points', v_max_points,
      'attempts', 1
    )
  )
  on conflict (type, dedupe_key) where handled_at is null
  do update set details = excluded.details || jsonb_build_object(
    'attempts', coalesce((security_signals.details ->> 'attempts')::int, 1) + 1
  );

  return null;
end;
$$;
revoke all on function public.fn_exam_result_guard() from public, anon, authenticated;

drop trigger if exists trg_exam_result_guard on public.exam_results;
create trigger trg_exam_result_guard
  before insert on public.exam_results
  for each row execute function public.fn_exam_result_guard();
