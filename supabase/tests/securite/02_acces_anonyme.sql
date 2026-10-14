-- Acces anonyme : la cle anon est embarquee dans le site, donc publique.
-- RLS et GRANT sont deux verrous distincts : ici on verifie ce que l'anonyme VOIT et PEUT ECRIRE,
-- avec de vraies donnees dans la transaction pour qu'un « 0 » prouve quelque chose.
DO $$
DECLARE
  u uuid := pg_temp.t_membre('Alice');
  cert uuid; q uuid; t text; v text;
BEGIN
  SELECT id INTO cert FROM certifications ORDER BY slug LIMIT 1;
  SELECT id INTO q FROM quiz_questions WHERE certification_id = cert AND NOT exam_only LIMIT 1;
  PERFORM pg_temp.t_forcer(format($q$
    INSERT INTO attempts (user_id, question_id, is_correct) VALUES (%L, %L, true);
    INSERT INTO exam_results (user_id, certification_id, correct_count, total_count) VALUES (%L, %L, 1, 1);
    INSERT INTO certification_purchases (user_id, certification_id, amount_cents, expires_at)
      VALUES (%L, %L, 499, now() + interval '30 days');
    INSERT INTO user_feedback (user_id, kind, message) VALUES (%L, 'idea', 'test securite');
  $q$, u, q, u, cert, u, cert, u));

  -- 1. Tables privees : l'anonyme n'y voit rien (0 ligne, ou refus).
  FOREACH t IN ARRAY ARRAY['profiles', 'attempts', 'exam_results', 'certification_purchases', 'exam_vouchers',
      'exam_voucher_redemptions', 'user_feedback', 'security_signals', 'security_state', 'admin_audit_log',
      'admin_deleted_accounts', 'admin_email_campaigns', 'admin_email_templates', 'email_unsubscribes',
      'gumroad_webhook_logs', 'pending_gumroad_purchases', 'profile_name_history', 'certification_price_changes',
      'rate_limit_events'] LOOP
    v := pg_temp.t_anon('SELECT count(*) FROM public.' || quote_ident(t));
    PERFORM pg_temp.t_attendu('anonyme : ' || t || ' invisible', v = '0' OR v LIKE 'ERREUR%', 'voit ' || v || ' ligne(s)');
  END LOOP;

  -- 2. Questions d'examen (payantes) : jamais visibles sans compte.
  v := pg_temp.t_anon('SELECT count(*) FROM public.quiz_questions WHERE exam_only');
  PERFORM pg_temp.t_attendu('anonyme : questions d''examen invisibles', v = '0' OR v LIKE 'ERREUR%', 'voit ' || v);
  v := pg_temp.t_anon('SELECT count(*) FROM public.quiz_questions WHERE NOT exam_only');
  PERFORM pg_temp.t_attendu('anonyme : questions gratuites lisibles (le site en a besoin)', v ~ '^[1-9]', 'voit ' || v);

  -- 3. Ecritures : l'anonyme ne modifie rien, ne cree rien.
  FOREACH t IN ARRAY ARRAY['profiles', 'attempts', 'exam_results', 'certification_purchases', 'certification_prices',
      'certifications', 'quiz_questions', 'exam_vouchers'] LOOP
    v := pg_temp.t_anon('WITH x AS (UPDATE public.' || quote_ident(t) || ' SET id = id RETURNING 1) SELECT count(*) FROM x');
    IF t = 'certification_prices' THEN
      v := pg_temp.t_anon('WITH x AS (UPDATE public.certification_prices SET price_cents = 100 RETURNING 1) SELECT count(*) FROM x');
    END IF;
    PERFORM pg_temp.t_attendu('anonyme : modification de ' || t || ' sans effet', v = '0' OR v LIKE 'ERREUR%', 'a modifie ' || v);
    v := pg_temp.t_anon('WITH x AS (DELETE FROM public.' || quote_ident(t) || ' RETURNING 1) SELECT count(*) FROM x');
    PERFORM pg_temp.t_attendu('anonyme : suppression dans ' || t || ' sans effet', v = '0' OR v LIKE 'ERREUR%', 'a supprime ' || v);
  END LOOP;
  v := pg_temp.t_anon(format('WITH x AS (INSERT INTO public.attempts (user_id, question_id, is_correct) VALUES (%L, %L, true) RETURNING 1) SELECT count(*) FROM x', u, q));
  PERFORM pg_temp.t_attendu('anonyme : ne peut pas inserer de reponse', v LIKE 'ERREUR%', 'insere : ' || v);
  v := pg_temp.t_anon(format('WITH x AS (INSERT INTO public.certification_purchases (user_id, certification_id, amount_cents, expires_at) VALUES (%L, %L, 1, now() + interval ''1 year'') RETURNING 1) SELECT count(*) FROM x', u, cert));
  PERFORM pg_temp.t_attendu('anonyme : ne peut pas creer d''achat', v LIKE 'ERREUR%', 'insere : ' || v);

  -- 4. Fonctions d'admin et de compte : refusees a l'anonyme.
  FOREACH t IN ARRAY ARRAY['SELECT public.am_i_admin()', 'SELECT public.admin_run_security_scan()',
      'SELECT public.get_my_attempt_summary(''UTC'')', 'SELECT public.admin_user_activity()',
      'SELECT public.submit_feedback(''idea'', 5, ''bonjour'', NULL)'] LOOP
    v := pg_temp.t_anon(t);
    PERFORM pg_temp.t_attendu('anonyme : ' || t || ' refuse', v LIKE 'ERREUR%permission denied%', v);
  END LOOP;
END $$;
