-- Garde des resultats d'examen (49) : un score impossible n'est pas enregistre et ouvre un signal.
DO $$
DECLARE
  a uuid := pg_temp.t_membre('Alice');
  b uuid := pg_temp.t_membre('Bob');
  cert uuid; banque int; v text;
BEGIN
  SELECT id INTO cert FROM certifications ORDER BY slug LIMIT 1;
  SELECT count(*) INTO banque FROM quiz_questions WHERE certification_id = cert;

  PERFORM pg_temp.t_passe('un score honnete est enregistre', a,
    format('INSERT INTO exam_results (user_id, certification_id, correct_count, total_count, points) VALUES (%L, %L, 1, 2, 0)', a, cert));
  PERFORM pg_temp.t_attendu('... et visible', pg_temp.t_vues(a, 'exam_results') = '1', pg_temp.t_vues(a, 'exam_results'));

  v := pg_temp.t_touchees(a, format('INSERT INTO exam_results (user_id, certification_id, correct_count, total_count, points) VALUES (%L, %L, 5, 2, 0)', a, cert));
  PERFORM pg_temp.t_attendu('plus de bonnes reponses que de questions : rejete', v = '0', v);
  v := pg_temp.t_touchees(a, format('INSERT INTO exam_results (user_id, certification_id, correct_count, total_count, points) VALUES (%L, %L, 1, %s, 0)', a, cert, banque + 50));
  PERFORM pg_temp.t_attendu('plus de questions que la banque : rejete', v = '0', v);
  v := pg_temp.t_touchees(a, format('INSERT INTO exam_results (user_id, certification_id, correct_count, total_count, points) VALUES (%L, %L, 1, 2, 999999)', a, cert));
  PERFORM pg_temp.t_attendu('points au-dessus du maximum : rejete', v = '0', v);
  PERFORM pg_temp.t_attendu('les rejets ouvrent un signal de securite',
    (SELECT count(*) FROM security_signals WHERE type = 'exam_score_rejected' AND details ->> 'user_id' = a::text) >= 1, NULL);
  PERFORM pg_temp.t_refuse('inserer un resultat au nom d''un autre est refuse', b,
    format('INSERT INTO exam_results (user_id, certification_id, correct_count, total_count, points) VALUES (%L, %L, 1, 1, 0)', a, cert), 'caller');
END $$;
