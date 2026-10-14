-- Structure : RLS partout, pas de regle d'ecriture ouverte, fonctions privilegiees cadrees.
-- Toute difference avec les listes fermees ci-dessous est a RELIRE, pas a corriger
-- en reflexe : soit on ferme (REVOKE / RLS), soit on ajoute ici apres verification.
DO $$
DECLARE v text;
BEGIN
  -- 1. RLS activee sur chaque table du schema public (une table creee plus tard sans RLS saute ici).
  SELECT string_agg(c.relname, ', ' ORDER BY c.relname) INTO v FROM pg_class c
   WHERE c.relnamespace = 'public'::regnamespace AND c.relkind IN ('r', 'p') AND NOT c.relrowsecurity;
  PERFORM pg_temp.t_attendu('RLS activee sur toutes les tables', v IS NULL, 'sans RLS : ' || v);

  -- 2. Une table avec RLS mais sans aucune regle est fermee a tous : voulu seulement pour la liste ci-dessous.
  SELECT string_agg(c.relname, ', ' ORDER BY c.relname) INTO v FROM pg_class c
   WHERE c.relnamespace = 'public'::regnamespace AND c.relkind IN ('r', 'p')
     AND NOT EXISTS (SELECT 1 FROM pg_policies p WHERE p.schemaname = 'public' AND p.tablename = c.relname)
     AND c.relname <> ALL (ARRAY['rate_limit_events']);
  PERFORM pg_temp.t_attendu('toute table a des regles (sauf celles volontairement fermees)', v IS NULL, 'sans regle : ' || v);

  -- 3. Aucune regle d'ecriture sans condition (USING / WITH CHECK = true).
  SELECT string_agg(p.tablename || '.' || p.policyname, ', ') INTO v FROM pg_policies p
   WHERE p.schemaname = 'public' AND p.cmd IN ('INSERT', 'UPDATE', 'DELETE', 'ALL')
     AND (coalesce(p.qual, 'true') = 'true' AND coalesce(p.with_check, 'true') = 'true');
  PERFORM pg_temp.t_attendu('aucune regle d''ecriture ouverte a tous', v IS NULL, v);

  -- 4. Lecture sans condition : liste fermee (donnees publiques par conception).
  SELECT string_agg(p.tablename || '.' || p.policyname, ', ') INTO v FROM pg_policies p
   WHERE p.schemaname = 'public' AND p.cmd IN ('SELECT', 'ALL') AND p.qual = 'true'
     AND p.tablename <> ALL (ARRAY['certifications', 'certification_prices']);
  PERFORM pg_temp.t_attendu('lecture ouverte a tous : seulement certifications et prix', v IS NULL, v);

  -- 5. Regles reservees a l'admin : jamais d'adresse en dur dans une nouvelle regle autre que le schema actuel.
  --    (Les regles actuelles comparent le jeton ; on verifie qu'aucune regle admin ne lit user_metadata,
  --    modifiable par l'utilisateur lui-meme.)
  SELECT string_agg(p.tablename || '.' || p.policyname, ', ') INTO v FROM pg_policies p
   WHERE p.schemaname = 'public' AND (coalesce(p.qual, '') || coalesce(p.with_check, '')) ILIKE '%user_metadata%';
  PERFORM pg_temp.t_attendu('aucune regle ne se fie a user_metadata (modifiable par l''utilisateur)', v IS NULL, v);

  -- 6. Fonctions SECURITY DEFINER : search_path fixe (sinon detournement par un schema de l'appelant).
  SELECT string_agg(p.oid::regprocedure::text, ', ') INTO v FROM pg_proc p
   WHERE p.pronamespace = 'public'::regnamespace AND p.prokind = 'f' AND p.prosecdef
     AND NOT EXISTS (SELECT 1 FROM unnest(coalesce(p.proconfig, '{}')) c WHERE c LIKE 'search_path=%');
  PERFORM pg_temp.t_attendu('fonctions SECURITY DEFINER avec search_path fixe', v IS NULL, v);

  -- 7. Fonctions appelables par l'anonyme : liste fermee.
  SELECT string_agg(p.oid::regprocedure::text, ', ' ORDER BY p.proname) INTO v FROM pg_proc p
   WHERE p.pronamespace = 'public'::regnamespace AND p.prokind = 'f' AND has_function_privilege('anon', p.oid, 'EXECUTE')
     AND p.proname <> ALL (ARRAY['get_certification_leaderboard_preview',
                                 'handle_new_user', 'fn_audit_log_immutable', 'trg_audit_email_campaigns', 'trg_audit_email_templates']);
  PERFORM pg_temp.t_attendu('aucune nouvelle fonction appelable par l''anonyme', v IS NULL, v);

  -- 8. Fonctions reservees au serveur (service_role) : jamais appelables depuis le site.
  SELECT string_agg(p.proname, ', ') INTO v FROM pg_proc p
   WHERE p.pronamespace = 'public'::regnamespace AND p.proname = ANY (ARRAY[
     'claim_exam_voucher', 'fn_audit', 'fn_email_recipients', 'fn_email_segment', 'record_and_count_rate_limit', 'security_scan'])
     AND (has_function_privilege('anon', p.oid, 'EXECUTE') OR has_function_privilege('authenticated', p.oid, 'EXECUTE'));
  PERFORM pg_temp.t_attendu('fonctions serveur fermees au site (vouchers, journal, limites, scan)', v IS NULL, v);

  -- 9. Fonctions appelables par un membre connecte : liste fermee (une nouvelle fonction est a relire).
  SELECT string_agg(p.oid::regprocedure::text, ', ' ORDER BY p.proname) INTO v FROM pg_proc p
   WHERE p.pronamespace = 'public'::regnamespace AND p.prokind = 'f' AND has_function_privilege('authenticated', p.oid, 'EXECUTE')
     AND p.proname <> ALL (ARRAY[
       'admin_archive_security_signals', 'admin_count_email_recipients', 'admin_delete_exam_vouchers',
       'admin_delete_security_signals', 'admin_email_segment_members', 'admin_handle_security_signal',
       'admin_handle_security_signals', 'admin_run_security_scan', 'admin_set_certification_price',
       'admin_set_feedback_handled', 'admin_user_activity', 'admin_user_last_sign_in', 'am_i_admin',
       'get_certification_leaderboard_preview', 'get_certification_period_leaderboard', 'get_my_attempt_summary',
       'set_my_language', 'submit_feedback', 'update_my_avatar', 'update_my_first_name',
       'handle_new_user', 'fn_audit_log_immutable', 'trg_audit_email_campaigns', 'trg_audit_email_templates']);
  PERFORM pg_temp.t_attendu('aucune nouvelle fonction appelable par un membre connecte', v IS NULL, v);

  -- 10. Le journal d'audit est immuable (pas de modification ni suppression, meme pour l'admin).
  PERFORM pg_temp.t_attendu('journal d''audit : declencheur d''immuabilite present',
    EXISTS (SELECT 1 FROM pg_trigger t WHERE t.tgrelid = 'public.admin_audit_log'::regclass AND t.tgname = 'admin_audit_log_no_change'), NULL);
END $$;
