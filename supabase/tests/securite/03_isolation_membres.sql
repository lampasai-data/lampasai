-- Isolation entre membres + protections de l'acces payant : un membre ne lit que ses lignes,
-- ne s'accorde pas d'acces, ne change ni son plan ni ses achats ni les prix.
DO $$
DECLARE
  a uuid := pg_temp.t_membre('Alice');
  b uuid := pg_temp.t_membre('Bob');
  cert uuid; q uuid; v text;
BEGIN
  SELECT id INTO cert FROM certifications ORDER BY slug LIMIT 1;
  SELECT id INTO q FROM quiz_questions WHERE certification_id = cert AND NOT exam_only LIMIT 1;
  PERFORM pg_temp.t_forcer(format($q$
    INSERT INTO attempts (user_id, question_id, is_correct) VALUES (%L, %L, true);
    INSERT INTO exam_results (user_id, certification_id, correct_count, total_count) VALUES (%L, %L, 1, 1);
    INSERT INTO certification_purchases (user_id, certification_id, amount_cents, expires_at)
      VALUES (%L, %L, 499, now() + interval '30 days');
    INSERT INTO user_feedback (user_id, kind, message) VALUES (%L, 'idea', 'test securite');
  $q$, a, q, a, cert, a, cert, a));

  -- 1. Lecture : Alice voit ses lignes, Bob n'en voit aucune d'Alice.
  PERFORM pg_temp.t_attendu('Alice lit ses reponses', pg_temp.t_vues(a, 'attempts') = '1', pg_temp.t_vues(a, 'attempts'));
  PERFORM pg_temp.t_attendu('Bob ne lit pas les reponses d''Alice', pg_temp.t_vues(b, 'attempts') = '0', pg_temp.t_vues(b, 'attempts'));
  PERFORM pg_temp.t_attendu('Alice lit ses resultats d''examen', pg_temp.t_vues(a, 'exam_results') = '1', pg_temp.t_vues(a, 'exam_results'));
  PERFORM pg_temp.t_attendu('Bob ne lit pas les resultats d''Alice', pg_temp.t_vues(b, 'exam_results') = '0', pg_temp.t_vues(b, 'exam_results'));
  PERFORM pg_temp.t_attendu('Alice lit ses achats', pg_temp.t_vues(a, 'certification_purchases') = '1', pg_temp.t_vues(a, 'certification_purchases'));
  PERFORM pg_temp.t_attendu('Bob ne lit pas les achats d''Alice', pg_temp.t_vues(b, 'certification_purchases') = '0', pg_temp.t_vues(b, 'certification_purchases'));
  PERFORM pg_temp.t_attendu('Bob ne lit que son propre profil', pg_temp.t_vues(b, 'profiles') = '1', pg_temp.t_vues(b, 'profiles'));
  PERFORM pg_temp.t_attendu('Alice ne lit pas les messages de retour (meme les siens)', pg_temp.t_vues(a, 'user_feedback') = '0', pg_temp.t_vues(a, 'user_feedback'));

  -- 2. Tables d'administration : fermees a un membre.
  PERFORM pg_temp.t_attendu('membre : vouchers invisibles', pg_temp.t_vues(b, 'exam_vouchers') = '0', NULL);
  PERFORM pg_temp.t_attendu('membre : journal admin invisible', pg_temp.t_vues(b, 'admin_audit_log') = '0', NULL);
  PERFORM pg_temp.t_attendu('membre : signaux de securite invisibles', pg_temp.t_vues(b, 'security_signals') = '0', NULL);
  PERFORM pg_temp.t_attendu('membre : journaux Gumroad invisibles', pg_temp.t_vues(b, 'gumroad_webhook_logs') = '0', NULL);
  PERFORM pg_temp.t_attendu('membre : achats en attente invisibles', pg_temp.t_vues(b, 'pending_gumroad_purchases') = '0', NULL);
  PERFORM pg_temp.t_attendu('membre : campagnes e-mail invisibles', pg_temp.t_vues(b, 'admin_email_campaigns') = '0', NULL);
  PERFORM pg_temp.t_attendu('membre : historique des prix invisible', pg_temp.t_vues(b, 'certification_price_changes') = '0', NULL);

  -- 3. Ecriture : Bob ne peut rien ecrire au nom d'Alice, ni se donner un acces.
  PERFORM pg_temp.t_refuse('Bob ne peut pas inserer de reponse au nom d''Alice', b,
    format('INSERT INTO attempts (user_id, question_id, is_correct) VALUES (%L, %L, true)', a, q), 'row-level security');
  PERFORM pg_temp.t_passe('Bob peut enregistrer ses propres reponses', b,
    format('INSERT INTO attempts (user_id, question_id, is_correct) VALUES (%L, %L, true)', b, q));
  PERFORM pg_temp.t_refuse('Bob ne peut pas se creer un achat', b,
    format('INSERT INTO certification_purchases (user_id, certification_id, amount_cents, expires_at) VALUES (%L, %L, 0, now() + interval ''10 years'')', b, cert), 'row-level security');
  PERFORM pg_temp.t_attendu('Alice ne peut pas prolonger son achat',
    pg_temp.t_touchees(a, 'UPDATE certification_purchases SET expires_at = now() + interval ''10 years''') = '0', NULL);
  PERFORM pg_temp.t_attendu('Alice ne peut pas supprimer son achat',
    pg_temp.t_touchees(a, 'DELETE FROM certification_purchases') = '0', NULL);
  PERFORM pg_temp.t_attendu('Alice ne peut pas passer en plan pro',
    pg_temp.t_touchees(a, 'UPDATE profiles SET plan = ''pro''') = '0', NULL);
  PERFORM pg_temp.t_attendu('Alice ne peut pas effacer son quota gratuit',
    pg_temp.t_touchees(a, 'UPDATE profiles SET free_questions_used = 0') = '0', NULL);
  PERFORM pg_temp.t_attendu('le plan d''Alice est inchange', (SELECT plan FROM profiles WHERE id = a) = 'free', NULL);
  PERFORM pg_temp.t_attendu('Bob ne modifie pas le profil d''Alice',
    pg_temp.t_touchees(b, format('UPDATE profiles SET first_name = ''X'' WHERE id = %L', a)) = '0', NULL);
  PERFORM pg_temp.t_attendu('Bob ne modifie pas les reponses d''Alice',
    pg_temp.t_touchees(b, format('UPDATE attempts SET is_correct = false WHERE user_id = %L', a)) = '0', NULL);
  PERFORM pg_temp.t_attendu('Alice ne modifie pas ses resultats d''examen',
    pg_temp.t_touchees(a, 'UPDATE exam_results SET correct_count = total_count') = '0', NULL);
  PERFORM pg_temp.t_refuse('un membre ne cree pas de voucher', b,
    format('INSERT INTO exam_vouchers (code, certification_id, created_by) VALUES (''X'', %L, ''b'')', cert), 'row-level security');
  PERFORM pg_temp.t_attendu('un membre ne change pas un prix',
    pg_temp.t_touchees(b, 'UPDATE certification_prices SET price_cents = 100') = '0', NULL);
  PERFORM pg_temp.t_attendu('un membre ne change pas une certification',
    pg_temp.t_touchees(b, 'UPDATE certifications SET name = ''x''') = '0', NULL);
  PERFORM pg_temp.t_attendu('un membre ne change pas une question',
    pg_temp.t_touchees(b, 'UPDATE quiz_questions SET exam_only = false') = '0', NULL);
  PERFORM pg_temp.t_refuse('un membre ne lit pas le journal des limites en ecrivant dedans', b,
    'INSERT INTO rate_limit_events (bucket) VALUES (''x'')', 'row-level security');

  -- 4. Le prenom ne passe que par la fonction cadree (pas de lien dans un prenom).
  PERFORM pg_temp.t_valeur(b, 'SELECT public.update_my_first_name(''http://x.com'')');
  PERFORM pg_temp.t_attendu('prenom avec lien non enregistre',
    coalesce((SELECT first_name FROM profiles WHERE id = b), '') NOT LIKE '%http%', NULL);
  PERFORM pg_temp.t_attendu('image de profil hors du stockage Lampas refusee',
    pg_temp.t_valeur(b, 'SELECT public.update_my_avatar(''https://evil.example/x.png'')') LIKE 'ERREUR%', NULL);
END $$;
