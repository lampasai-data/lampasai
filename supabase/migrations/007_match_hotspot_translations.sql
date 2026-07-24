-- English translations for the "match" and "hotspot" question types, needed
-- to extend bilingual coverage beyond the initial "choice" question batch.
alter table public.quiz_questions
  add column if not exists pool_en jsonb,
  add column if not exists targets_en jsonb,
  add column if not exists blanks_en jsonb;
