-- One question's French options mixed a lowercase, ungrammatical "le "
-- prefix ("le Automatic Clustering", "le Search Optimization Service") with
-- a capitalized "Les " on a third and no article at all on the other two -
-- inconsistent within a single question's answer list. The English options
-- for the same row already have no article on any option ("Automatic
-- Clustering", "Virtual Warehouses", ...), so that's the reference style:
-- drop the stray leading articles from the French options to match.

update public.quiz_questions
set options = '["Automatic Clustering", "Virtual Warehouses", "Snowpipe", "Time Travel", "Search Optimization Service"]'::jsonb
where id = '4eba22a4-3b09-4740-8618-3a728de1e35e';
