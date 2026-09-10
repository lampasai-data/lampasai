-- Tags each question with the exam domain ("rubrique") it belongs to, so the
-- quiz can show which block a question comes from, break a finished run's
-- score down per domain, and let a user revise one domain at a time.
--
-- The valid keys per certification live in TypeScript
-- (src/data/certificationDomains.ts, SkillDomain.key) rather than in a lookup
-- table or a check constraint: the labels are already there, localized and
-- weighted, and keeping one source of truth avoids the two drifting apart.
-- The trade-off is that nothing here rejects an unknown key - findDomain()
-- resolves an unrecognized or null value to "no badge", so a mistyped key
-- degrades to a missing badge rather than a broken question.
--
-- Nullable on purpose: an untagged question is still drawn in every run, it
-- simply carries no rubric.
alter table public.quiz_questions
  add column if not exists domain text;

-- Supports "how many questions in this rubric" counts and the per-domain
-- revision filter, both of which always scope by certification first.
create index if not exists quiz_questions_certification_domain_idx
  on public.quiz_questions (certification_id, domain);
