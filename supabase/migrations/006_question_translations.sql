-- English translations for a curated subset of questions per certification.
-- Nullable: falls back to the French text when absent (see quizData.ts).
-- is_free marks the fixed pool the free quota draws from, so free-tier users
-- always get a fully bilingual set instead of a random draw from the whole
-- (still French-only) bank.
alter table public.quiz_questions
  add column if not exists question_en text,
  add column if not exists options_en jsonb,
  add column if not exists explanation_en text,
  add column if not exists is_free boolean not null default false;
