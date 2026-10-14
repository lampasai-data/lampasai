-- Acces payant : les questions d'examen ne sont lisibles que par un achat PAYE et NON EXPIRE de
-- CETTE certification (ou un plan pro). Le test des clients payants : ils doivent, eux, voir leurs questions.
DO $$
DECLARE
  libre uuid := pg_temp.t_membre('Libre');
  paye uuid := pg_temp.t_membre('Paye');
  expire uuid := pg_temp.t_membre('Expire');
  rembourse uuid := pg_temp.t_membre('Rembourse');
  pro uuid := pg_temp.t_membre('Pro');
  c1 uuid; c2 uuid; n1 text; n2 text;
BEGIN
  SELECT id INTO c1 FROM certifications ORDER BY slug LIMIT 1;
  SELECT id INTO c2 FROM certifications ORDER BY slug DESC LIMIT 1;
  PERFORM pg_temp.t_attendu('deux certifications presentes pour ce test', c1 <> c2, NULL);
  PERFORM pg_temp.t_forcer(format($q$
    INSERT INTO certification_purchases (user_id, certification_id, amount_cents, status, expires_at)
      VALUES (%L, %L, 499, 'paid', now() + interval '10 days'),
             (%L, %L, 499, 'paid', now() - interval '1 day'),
             (%L, %L, 499, 'refunded', now() + interval '10 days');
    UPDATE profiles SET plan = 'pro' WHERE id = %L;
  $q$, paye, c1, expire, c1, rembourse, c1, pro));

  n1 := format('quiz_questions WHERE exam_only AND certification_id = %L', c1);
  n2 := format('quiz_questions WHERE exam_only AND certification_id = %L', c2);

  PERFORM pg_temp.t_attendu('sans achat : aucune question d''examen', pg_temp.t_vues(libre, n1) = '0' AND pg_temp.t_vues(libre, n2) = '0', NULL);
  PERFORM pg_temp.t_attendu('achat paye : questions d''examen de SA certification', pg_temp.t_vues(paye, n1) ~ '^[1-9]', pg_temp.t_vues(paye, n1));
  PERFORM pg_temp.t_attendu('achat paye : rien pour l''autre certification', pg_temp.t_vues(paye, n2) = '0', pg_temp.t_vues(paye, n2));
  PERFORM pg_temp.t_attendu('achat expire : plus de questions d''examen', pg_temp.t_vues(expire, n1) = '0', pg_temp.t_vues(expire, n1));
  PERFORM pg_temp.t_attendu('achat rembourse : plus de questions d''examen', pg_temp.t_vues(rembourse, n1) = '0', pg_temp.t_vues(rembourse, n1));
  PERFORM pg_temp.t_attendu('plan pro : questions d''examen des deux certifications',
    pg_temp.t_vues(pro, n1) ~ '^[1-9]' AND pg_temp.t_vues(pro, n2) ~ '^[1-9]', NULL);
  PERFORM pg_temp.t_attendu('tout le monde garde les questions gratuites',
    pg_temp.t_vues(libre, 'quiz_questions WHERE NOT exam_only') ~ '^[1-9]', NULL);

  -- Les prix sont lisibles par tous (affichage), mais ne sont modifiables que via la fonction admin.
  PERFORM pg_temp.t_attendu('les prix sont lisibles', pg_temp.t_vues(libre, 'certification_prices') ~ '^[1-9]', NULL);
END $$;
