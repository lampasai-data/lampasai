-- Snowflake had no free questions at all (172 rows, every one exam_only), while
-- Power BI has 20. That gap wasn't visible in the app because loadQuestions
-- falls back to the bundled TypeScript bank whenever the database returns zero
-- rows (src/lib/quizData.ts) - so anonymous and free users were served a frozen
-- 61-question copy that migrations 028-033 never reached, and their attempts
-- were silently rejected (the fallback's ids are "sf-qN" strings, not uuids).
--
-- This aligns Snowflake with Power BI: 20 questions become free. They stay in
-- the exam pool - exam runs draw the whole bank, free/training runs draw only
-- the non-exam_only rows (see buildRunQueue in CertificationQuiz.tsx).
--
-- The 20 are spread across the five rubrics in proportion to the official exam
-- weights (architecture 6, performance 4, governance 4, loading 4,
-- collaboration 2) and spaced evenly through the bank rather than taken from
-- its opening, so the free sample represents the whole. All are plain "choice"
-- questions: a first taste shouldn't open on a drag-and-drop or a multi-blank
-- dropdown.
--
-- Run after 035, which assigns the domains this selection is balanced on.

update public.quiz_questions set exam_only = false
where certification_id = '747091af-26ae-425f-9246-505e416d9eb3' and id in (
  '9d7cc3da-0d3e-40a9-8c61-971be7bba652',
  '009c7594-4b08-4fc3-b165-4fae05460d6e',
  'dc8c5bc0-3b1f-450e-bcf1-0b802e7b3e02',
  'dfa0ee13-b7af-4f45-ac49-f0c8a52a85cd',
  '7a823b3a-7d11-4696-91ab-0a404ed61b9b',
  '1c0a5b26-db41-43e5-858d-b7b3e32a58e3',
  '5642d53b-8d1e-4eb6-81cd-d4c90ecaaddf',
  'e9df1b4a-4de6-4966-9b8d-1bcd6aeb3f01',
  'be5626ba-75d3-4743-8208-089f3a7dfbc8',
  '61440340-889d-4610-bcee-7d1a7e7d98ea',
  'ebe75289-bde1-473a-9f05-60640dcdf6dd',
  '350362a2-431f-40fe-8fc7-f4648edcd08c',
  'f5e05be1-bc79-408d-a27c-1c72e62cd7db',
  'c6556fed-2d52-46fa-bd50-c9ef0930c7e9',
  'e434e292-e9c0-4142-84bf-783ac4420f4d',
  '4380c466-ca48-48ec-a265-174a3c3c7eb8',
  'ab52d629-250b-454e-aef7-2145becf89ef',
  '132bcd9a-fa94-4872-9d5d-c9cde8e893ab',
  '685de7b5-280b-45ce-b0db-00ef97ab452d',
  'a35c69f7-52df-40b5-8074-8ef28b6f13ce'
);  -- 20 questions
