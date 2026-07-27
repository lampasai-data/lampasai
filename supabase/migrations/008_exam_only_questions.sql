alter table public.quiz_questions
  add column if not exists exam_only boolean not null default false;
