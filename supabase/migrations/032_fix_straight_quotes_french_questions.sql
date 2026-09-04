-- 3 French questions used a straight ASCII apostrophe ('PII', 'PII_EMAIL')
-- to set off a quoted tag value, inconsistent with the rest of the bank
-- (24 questions already use French guillemets « » for this). English is
-- untouched - straight/curly quotes are the normal English convention,
-- guillemets are French-specific.

update public.quiz_questions
set question = replace(replace(question, '''PII_EMAIL''', '« PII_EMAIL »'), '''PII''', '« PII »')
where id in (
  '13d8fdcb-64fc-4f50-874a-19c8e8f3c79d',
  'c7afdf77-bc91-477e-9c24-27556a11a782',
  '6a575e70-df7d-4392-b489-5424568381ed'
);
