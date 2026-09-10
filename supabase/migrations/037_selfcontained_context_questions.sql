-- Makes the 15 "Same context as the previous question" items self-contained.
--
-- These are Microsoft-style "does this solution meet the goal?" series: one
-- scenario evaluated by several successive items. Transcribed as-is, each
-- follow-up opened with "Même contexte (...)" and relied on the reader having
-- just seen the parent question. In this app that never holds:
--   * buildRunQueue shuffles, so "the previous question" isn't what the user
--     just answered;
--   * the parent can be drawn after the child, or not at all - a free run
--     takes 20 of 234, and an exam run takes whatever the slider allows.
-- So the context was frequently missing outright, with no navigation able to
-- recover it.
--
-- The rewrite only replaces the "Same context (...)" opening with the parent's
-- scenario paragraph. Each item's own proposed solution and closing question
-- are kept verbatim: the closing clause varies between items ("...meet the
-- goal of reducing the model size") and is what the recorded answer was
-- authored against, so touching it would invalidate the correction.
-- Both languages are rewritten; question_en is populated for all 234 rows.


-- power-bi

update public.quiz_questions set question = 'Dans Power Query, une colonne IoT GUID et une colonne IoT ID sont uniques par ligne. Vous devez analyser les événements IoT par heure et par jour de l''année, tout en améliorant la performance du jeu de données. Solution proposée : supprimer la colonne IoT GUID et conserver uniquement IoT ID. Cette solution répond-elle à l''objectif de réduire la taille du modèle ?', question_en = 'In Power Query, an IoT GUID column and an IoT ID column are unique per row. You need to analyze IoT events by hour and by day of the year, while improving dataset performance. Proposed solution: remove the IoT GUID column and keep only IoT ID. Does this solution meet the goal of reducing the model size?'
where id = 'fd7b4f92-9abc-4d5e-977a-432de74b0f91';  -- item 4

update public.quiz_questions set question = 'Dans Power Query, une colonne IoT GUID et une colonne IoT ID sont uniques par ligne. Vous devez analyser les événements IoT par heure et par jour de l''année, tout en améliorant la performance du jeu de données. Solution proposée : changer le type de données de la colonne IoT DateTime en Date (au lieu de Date/Heure). Cette solution permet-elle d''analyser les événements par heure et par jour de l''année ?', question_en = 'In Power Query, an IoT GUID column and an IoT ID column are unique per row. You need to analyze IoT events by hour and by day of the year, while improving dataset performance. Proposed solution: change the data type of the IoT DateTime column to Date (instead of Date/Time). Does this solution allow analyzing events by hour and by day of the year?'
where id = '536ed0ea-19cc-4a0a-8613-45fe06e77250';  -- item 5

update public.quiz_questions set question = 'Vous êtes en train de modéliser des données par lots à partir d''une grande table SQL Server Order (plus de 100 millions d''enregistrements). Pendant le développement, vous devez importer un échantillon des données. Solution proposée : vous ajoutez une clause WHERE à l''instruction SQL de la source. Cette solution répond-elle à l''objectif d''importer un échantillon de données ?', question_en = 'You are modeling data in batches from a large SQL Server Order table (more than 100 million records). During development, you need to import a sample of the data. Proposed solution: you add a WHERE clause to the source''s SQL statement. Does this solution meet the goal of importing a sample of the data?'
where id = '05474514-86bd-4884-9f56-15a7f88be9bf';  -- item 23

update public.quiz_questions set question = 'Vous avez un rapport qui importe une table Date et une table Sales depuis une base Azure SQL. La table Sales possède trois clés étrangères de date : Due Date, Order Date et Delivery Date. Vous devez permettre l''analyse des ventes dans le temps selon les trois clés. Solution proposée : depuis Power Query Editor, vous renommez la requête Date en Due Date, puis vous la référencez deux fois pour créer les requêtes Order Date et Delivery Date (trois tables de dates distinctes). Cette solution répond-elle à l''objectif ?', question_en = 'You have a report that imports a Date table and a Sales table from an Azure SQL database. The Sales table has three date foreign keys: Due Date, Order Date, and Delivery Date. You need to enable analyzing sales over time using all three keys. Proposed solution: from Power Query Editor, you rename the Date query to Due Date, then reference it twice to create the Order Date and Delivery Date queries (three separate date tables). Does this solution meet the goal?'
where id = '811d2691-85c9-441b-985e-409c0672bdcf';  -- item 25

update public.quiz_questions set question = 'Vous avez un rapport qui importe une table Date et une table Sales depuis une base Azure SQL. La table Sales possède trois clés étrangères de date : Due Date, Order Date et Delivery Date. Vous devez permettre l''analyse des ventes dans le temps selon les trois clés. Solution proposée : vous créez des mesures DAX qui utilisent la fonction USERELATIONSHIP pour filtrer les ventes selon la relation active entre Sales et Date. Cette solution répond-elle à l''objectif ?', question_en = 'You have a report that imports a Date table and a Sales table from an Azure SQL database. The Sales table has three date foreign keys: Due Date, Order Date, and Delivery Date. You need to enable analyzing sales over time using all three keys. Proposed solution: you create DAX measures that use the USERELATIONSHIP function to filter sales based on the active relationship between Sales and Date. Does this solution meet the goal?'
where id = '073cde4f-9a32-4fce-83c0-ae2bcf7a6970';  -- item 26

update public.quiz_questions set question = 'Vous avez cinq rapports et deux tableaux de bord dans un espace de travail. Vous devez accorder à tous les utilisateurs de l''organisation un accès en lecture à un tableau de bord et trois rapports spécifiques. Solution proposée : activer « Inclus dans l''application » (included in app) pour tous les éléments de l''espace de travail. Cette solution répond-elle à l''objectif de ne partager qu''un tableau de bord et trois rapports précis ?', question_en = 'You have five reports and two dashboards in a workspace. You need to grant all users in the organization read access to one dashboard and three specific reports. Proposed solution: enable "included in app" for all items in the workspace. Does this solution meet the goal of sharing only one dashboard and three specific reports?'
where id = 'dc83933b-be86-4c4e-8196-71b701b0ea22';  -- item 31

update public.quiz_questions set question = 'Vous avez cinq rapports et deux tableaux de bord dans un espace de travail. Vous devez accorder à tous les utilisateurs de l''organisation un accès en lecture à un tableau de bord et trois rapports spécifiques. Solution proposée : attribuer à tous les utilisateurs le rôle Visualiseur (Viewer) sur l''espace de travail entier. Cette solution répond-elle à l''objectif de ne partager qu''un tableau de bord et trois rapports précis ?', question_en = 'You have five reports and two dashboards in a workspace. You need to grant all users in the organization read access to one dashboard and three specific reports. Proposed solution: assign all users the Viewer role on the entire workspace. Does this solution meet the goal of sharing only one dashboard and three specific reports?'
where id = '17d54ebf-8e4a-4048-a6fe-7ddc64905174';  -- item 32

update public.quiz_questions set question = 'Vous modélisez avec Power BI. Une grande table SQL Server « Order » dépasse 100 millions d''enregistrements ; pendant le développement, vous devez importer un échantillon. Solution : vous écrivez une expression DAX utilisant la fonction FILTER. Cela répond-il à l''objectif ?', question_en = 'You model data with Power BI. A large SQL Server table "Order" exceeds 100 million records; during development you must import a sample. Solution: you add a report-level filter based on order date. Does this meet the goal?'
where id = '3f3d695e-2855-4329-a81a-1dfaa955bb35';  -- item 84

update public.quiz_questions set question = 'Vous modélisez avec Power BI. Une grande table SQL Server « Order » dépasse 100 millions d''enregistrements ; pendant le développement, vous devez importer un échantillon. Solution : vous ajoutez une clause WHERE à l''instruction SQL. Cela répond-il à l''objectif ?', question_en = 'You model data with Power BI. A large SQL Server table "Order" exceeds 100 million records; during development you must import a sample. Solution: you add a report-level filter based on order date. Does this meet the goal?'
where id = '782fe64d-bb2c-4df5-8dab-75022818d769';  -- item 85

update public.quiz_questions set question = 'Vous modélisez avec Power BI. Une grande table SQL Server « Order » dépasse 100 millions d''enregistrements ; pendant le développement, vous devez importer un échantillon. Solution : vous ajoutez un filtre au niveau du rapport basé sur la date de commande. Cela répond-il à l''objectif ?', question_en = 'You model data with Power BI. A large SQL Server table "Order" exceeds 100 million records; during development you must import a sample. Solution: you add a report-level filter based on order date. Does this meet the goal?'
where id = '04d566c4-4de5-4ee5-81d2-35726924491d';  -- item 87

update public.quiz_questions set question = 'Un rapport importe une table de dates et une table de ventes ayant trois clés de dates : Due Date, Order Date, Delivery Date. Vous devez analyser les ventes selon chacune. Solution : dans Power Query, vous renommez la requête de dates en « Due Date » puis la référencez deux fois pour créer Order Date et Delivery Date. Cela répond-il à l''objectif ?', question_en = 'A report imports a date table and a sales table with three date keys: Due Date, Order Date, Delivery Date. You must analyze sales by each. Solution: you create measures using USERELATIONSHIP to filter sales on the active relationship. Does this meet the goal?'
where id = '00aecfc1-859e-4111-852c-18847d5c71cd';  -- item 89

update public.quiz_questions set question = 'Un rapport importe une table de dates et une table de ventes ayant trois clés de dates : Due Date, Order Date, Delivery Date. Vous devez analyser les ventes selon chacune. Solution : dans le volet Champs, vous renommez la table de dates en « Due Date » et créez Order Date et Delivery Date comme tables calculées via DAX. Cela répond-il à l''objectif ?', question_en = 'A report imports a date table and a sales table with three date keys: Due Date, Order Date, Delivery Date. You must analyze sales by each. Solution: in the Fields pane, you rename the date table to "Due Date" and create Order Date and Delivery Date as DAX calculated tables. Does this meet the goal?'
where id = '2d7de937-357d-45d9-99e3-584b6f62f767';  -- item 90

update public.quiz_questions set question = 'Un rapport importe une table de dates et une table de ventes ayant trois clés de dates : Due Date, Order Date, Delivery Date. Vous devez analyser les ventes selon chacune. Une seule relation active est définie entre les deux tables. Solution : vous créez des mesures utilisant USERELATIONSHIP pour filtrer les ventes sur la relation active entre ventes et dates. Cela répond-il à l''objectif ?', question_en = 'A report imports a date table and a sales table with three date keys: Due Date, Order Date, Delivery Date. You must analyze sales by each. Only one relationship between the two tables is active. Solution: you create measures using USERELATIONSHIP to filter sales on the active relationship. Does this meet the goal?'
where id = '14c2e7fc-7509-4c9f-a101-c7dfff74e854';  -- item 92

update public.quiz_questions set question = 'Un histogramme à barres a Salary en valeur et Employee en axe. Vous devez créer une ligne de référence indiquant les employés au-dessus du salaire médian. Solution : vous créez une ligne de moyenne à partir de la mesure Salary. Cela répond-il à l''objectif ?', question_en = 'A bar chart has Salary as value and Employee as axis. You must add a reference line showing employees above the median salary. Solution: you create a percentile line using the Salary measure and set the percentile to 50%. Does this meet the goal?'
where id = '0608f350-94a7-4ebb-9cbd-984a7b6dc43e';  -- item 106

update public.quiz_questions set question = 'Un histogramme à barres a Salary en valeur et Employee en axe. Vous devez créer une ligne de référence indiquant les employés au-dessus du salaire médian. Solution : vous créez une ligne de percentile à partir de la mesure Salary et réglez le percentile à 50 %. Cela répond-il à l''objectif ?', question_en = 'A bar chart has Salary as value and Employee as axis. You must add a reference line showing employees above the median salary. Solution: you create a percentile line using the Salary measure and set the percentile to 50%. Does this meet the goal?'
where id = '8b1ac6dd-a2f5-49d9-ae40-566deaac47c9';  -- item 107
