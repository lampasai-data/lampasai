-- Support questions with more than one correct answer ("select two" style).
alter table public.quiz_questions
  add column if not exists correct_indexes integer[];

update public.quiz_questions
  set correct_indexes = array[correct_index]
  where correct_indexes is null;

alter table public.quiz_questions
  alter column correct_indexes set not null;

alter table public.quiz_questions
  drop column if exists correct_index;
