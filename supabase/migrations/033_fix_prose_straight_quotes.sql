-- A handful of questions/explanations use a straight ASCII double quote (")
-- to quote a plain-language word or phrase (e.g. "central"/"périphérique",
-- an error message, "Partitions scanned"), which renders as the same
-- symmetric glyph on both sides in the UI - unlike a real opening/closing
-- pair, so it reads as a typo. The house style (see migration 032) is
-- French guillemets « » for this. Left untouched: every straight quote that
-- is actually part of a DAX/SQL code fragment (e.g. [Status]="A",
-- City[State Province] = "Kentucky", FORMAT(...,"MMM YYYY")) - those render
-- in monospace as code (see INLINE_CODE_RE / looksLikeCode in the app) and
-- must keep their literal quote syntax.

-- "Classe ces éléments d'un schéma en étoile..."
update public.quiz_questions
set question = replace(replace(question, '"central"', '« central »'), '"périphérique"', '« périphérique »')
where id = '89567c0a-ee6a-492a-8d5b-d439d9096bc2';

-- "Un modèle Power BI contient une table Stores..." - only the plain-prose
-- quotes (Status = "A" has no brackets here, so it's not styled as code);
-- the bracketed [Status]="A" / [Store Name] in the explanation stay as-is.
update public.quiz_questions
set question = replace(replace(question, '"A"', '« A »'), '"Inactive - "', '« Inactive - »'),
    explanation = replace(explanation, '"Inactive - "', '« Inactive - »')
where id = 'e4e0bf92-f148-4cff-acd7-80c5d946ead3';

-- "Un secret API_INTEGRATION_SECRET..." - quoted Snowflake error message.
update public.quiz_questions
set question = replace(question, '"does not exist or operation not authorized"', '« does not exist or operation not authorized »')
where id = '654c7317-634e-4447-983f-059c29e786bf';

-- "Le Query Profile affiche..."
update public.quiz_questions
set explanation = replace(replace(explanation, '"Partitions scanned"', '« Partitions scanned »'), '"Partitions total"', '« Partitions total »')
where id = '6c088234-7ca9-4f20-a5a0-bb76b29ea108';

-- "FORMAT sur la vraie colonne de date..." - already mixes « Jan 2021 » with
-- a straight-quoted "MMM YYYY" in the same sentence; make it consistent.
update public.quiz_questions
set explanation = replace(explanation, '"MMM YYYY"', '« MMM YYYY »')
where id = '5e433f55-26f5-4625-afb1-29ce99f0b60f';
