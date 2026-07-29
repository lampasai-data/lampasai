-- Adds a stable external reference so the SnowPro Core JSON import script
-- can upsert idempotently (re-running it updates existing rows by source id
-- instead of duplicating them).
alter table public.quiz_questions
  add column if not exists source_ref text unique;

-- Moves every currently-free Snowflake question to the exam-only pool: the
-- 20 new free questions imported from the JSON source replace them as the
-- free tier's question bank. Scoped to the Snowflake certification only.
update public.quiz_questions
set exam_only = true
where certification_id = (select id from public.certifications where slug = 'snowflake')
  and exam_only = false;
