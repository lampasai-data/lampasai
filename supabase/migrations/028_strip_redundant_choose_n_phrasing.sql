-- Some Snowflake multi-select questions had "(Choisissez N)" / "(choisir N
-- réponses)" (and the English "(Choose N)" / "(choose N)") baked directly
-- into the question text. The quiz UI already renders a dynamic
-- "Sélectionne N" / "Select N" badge for any multi-select question (see
-- CertificationQuiz.tsx's isMulti hint), so those questions showed the
-- instruction twice. Strip the redundant text, leaving the dynamic badge as
-- the single source of truth.

update public.quiz_questions
set
  question = trim(
    regexp_replace(
      regexp_replace(question, '^\(Choisissez \d+\)\s*', ''),
      '\s*\(choisir (deux|trois|quatre|\d+) réponses?\)\s*$',
      ''
    )
  ),
  question_en = trim(
    regexp_replace(
      regexp_replace(question_en, '^\(Choose \d+\)\s*', ''),
      '\s*\(choose (two|three|four|\d+)\)\s*$',
      ''
    )
  )
where array_length(correct_indexes, 1) > 1
  and (
    question ~* '\(choisissez \d+\)'
    or question ~* '\(choisir .* réponses?\)'
    or question_en ~* '\(choose \d+\)'
  );
