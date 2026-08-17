-- Support non-"choice" question types (order / match / hotspot), previously
-- only available via the local fallback data files. Adds the columns needed
-- to store each type's shape; "options"/"correct_indexes" become nullable
-- since they only apply to "choice" (and "options" to "order").
alter table public.quiz_questions
  add column if not exists type text not null default 'choice'
    check (type in ('choice', 'order', 'match', 'hotspot')),
  add column if not exists correct_order integer[],
  add column if not exists pool jsonb, -- "match": shared pool of draggable items, array of strings
  add column if not exists targets jsonb, -- "match": [{ label: string, correctPoolIndex: number }]
  add column if not exists blanks jsonb; -- "hotspot": [{ label?: string, options: string[], correctIndex: number }]

alter table public.quiz_questions
  alter column options drop not null,
  alter column correct_indexes drop not null;

alter table public.quiz_questions
  drop constraint if exists quiz_questions_type_shape;
alter table public.quiz_questions
  add constraint quiz_questions_type_shape check (
    (type = 'choice' and options is not null and correct_indexes is not null)
    or (type = 'order' and options is not null and correct_order is not null)
    or (type = 'match' and pool is not null and targets is not null)
    or (type = 'hotspot' and blanks is not null)
  );
