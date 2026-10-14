-- Fonctions d'administration : refusees a un membre ordinaire, ouvertes a l'administrateur.
-- Les « admin_* » sont appelables par tout membre connecte (REST) : c'est leur garde interne qui protege.
DO $$
DECLARE
  m uuid := pg_temp.t_membre('Membre');
  adm uuid := pg_temp.t_membre('Admin');
  email text := pg_temp.t_admin_email();
  cert uuid; prix int; appel text;
BEGIN
  PERFORM pg_temp.t_attendu('adresse admin lue dans am_i_admin()', email LIKE '%@%', email);
  SELECT id INTO cert FROM certifications ORDER BY slug LIMIT 1;
  SELECT price_cents INTO prix FROM certification_prices WHERE certification_id = cert;

  -- 1. Un membre est refuse par la garde de chaque fonction (message d'erreur) ...
  FOREACH appel IN ARRAY ARRAY[
    'SELECT public.admin_run_security_scan()',
    format('SELECT public.admin_set_certification_price(%L, 100, %s)', cert, prix),
    'SELECT public.admin_handle_security_signal(gen_random_uuid(), ''note ok'')',
    'SELECT public.admin_handle_security_signals(ARRAY[gen_random_uuid()], ''note ok'')',
    'SELECT public.admin_archive_security_signals(ARRAY[gen_random_uuid()], true)',
    'SELECT public.admin_delete_security_signals(ARRAY[gen_random_uuid()])',
    'SELECT public.admin_delete_exam_vouchers(ARRAY[gen_random_uuid()])',
    'SELECT public.admin_set_feedback_handled(gen_random_uuid(), true)',
    'SELECT public.admin_count_email_recipients(''all'', NULL, ''service'')',
    'SELECT * FROM public.admin_email_segment_members(''all'', NULL, ''service'')'
  ] LOOP
    PERFORM pg_temp.t_attendu('membre refuse : ' || left(appel, 60),
      pg_temp.t_valeur(m, appel) ~* 'ERREUR.*(forbidden|admin only)', pg_temp.t_valeur(m, appel));
  END LOOP;

  -- 2. ... ou ne renvoie rien (fonctions de lecture).
  PERFORM pg_temp.t_attendu('membre : admin_user_activity() vide',
    pg_temp.t_valeur(m, 'SELECT count(*) FROM public.admin_user_activity()') = '0', NULL);
  PERFORM pg_temp.t_attendu('membre : admin_user_last_sign_in() vide',
    pg_temp.t_valeur(m, 'SELECT count(*) FROM public.admin_user_last_sign_in()') = '0', NULL);
  PERFORM pg_temp.t_attendu('membre : am_i_admin() = false', pg_temp.t_valeur(m, 'SELECT public.am_i_admin()') = 'false', NULL);

  -- 3. Un membre ne se fait pas passer pour l'admin en changeant ses metadonnees (jeton seul compte).
  PERFORM pg_temp.t_attendu('membre avec metadonnees admin : toujours refuse',
    pg_temp.t_valeur(m, 'SELECT public.admin_run_security_scan()') ~* 'forbidden', NULL);

  -- 4. L'administrateur (jeton portant son adresse) passe les gardes.
  PERFORM pg_temp.t_attendu('admin : am_i_admin() = true', pg_temp.t_valeur(adm, 'SELECT public.am_i_admin()', email) = 'true', NULL);
  PERFORM pg_temp.t_passe('admin : lecture de l''activite', adm, 'SELECT count(*) FROM public.admin_user_activity()', email);
  PERFORM pg_temp.t_passe('admin : compte des destinataires', adm, 'SELECT public.admin_count_email_recipients(''all'', NULL, ''service'')', email);
  PERFORM pg_temp.t_attendu('admin : lit les profils', pg_temp.t_vues(adm, 'profiles', email) ~ '^[1-9]', NULL);
  PERFORM pg_temp.t_attendu('admin : lit les achats (tableau de ventes)', pg_temp.t_vues(adm, 'certification_purchases', email) ~ '^[0-9]+$', NULL);

  -- 5. Prix : bornes et verrou optimiste respectes, meme pour l'admin.
  PERFORM pg_temp.t_refuse('prix sous 1 EUR refuse', adm, format('SELECT public.admin_set_certification_price(%L, 50, %s)', cert, prix), 'price_out_of_range', email);
  PERFORM pg_temp.t_refuse('prix modifie entre-temps refuse', adm, format('SELECT public.admin_set_certification_price(%L, 500, %s)', cert, prix + 1), 'price_changed_meanwhile', email);
  PERFORM pg_temp.t_passe('prix modifiable par l''admin (puis annule par le test)', adm, format('SELECT public.admin_set_certification_price(%L, %s, %s)', cert, prix + 100, prix), email);
  PERFORM pg_temp.t_attendu('le changement de prix est journalise',
    (SELECT count(*) FROM certification_price_changes WHERE certification_id = cert AND new_price_cents = prix + 100) = 1, NULL);

  -- 6. Le journal d'audit ne se modifie ni ne se supprime, meme en postgres.
  INSERT INTO public.admin_audit_log (actor, action) VALUES ('test', 'test_securite');
  PERFORM pg_temp.t_attendu('journal d''audit : modification refusee',
    pg_temp.t_exec(NULL, 'UPDATE public.admin_audit_log SET action = ''x'' WHERE actor = ''test''') IS NOT NULL, NULL);
  PERFORM pg_temp.t_attendu('journal d''audit : suppression refusee',
    pg_temp.t_exec(NULL, 'DELETE FROM public.admin_audit_log WHERE actor = ''test''') IS NOT NULL, NULL);
END $$;
