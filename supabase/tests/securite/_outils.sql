-- ─────────────────────────────────────────────────────────────
-- Outils communs de la suite de tests de securite (scripts/test-securite.mjs).
--
-- Le runner assemble : BEGIN + ce fichier + un test + _bilan.sql. Tout se passe
-- dans UNE transaction que _bilan.sql annule toujours (RAISE) : les donnees de
-- test ne sont jamais ecrites en base, les requetes pg_net en file (e-mails)
-- partent avec l'annulation.
--
-- Les fonctions sont creees dans pg_temp, par postgres. Elles changent de role
-- elles-memes (SET LOCAL ROLE authenticated / anon) pour executer une requete
-- comme le ferait le site ou un appel API direct, puis reviennent a postgres.
-- ─────────────────────────────────────────────────────────────

CREATE TEMP TABLE t_resultats (n serial, label text, ok boolean, detail text) ON COMMIT DROP;

-- Adresse de l'administrateur : lue dans am_i_admin() (la source de verite en
-- base), jamais ecrite ici.
CREATE FUNCTION pg_temp.t_admin_email() RETURNS text LANGUAGE sql AS $$
  SELECT (regexp_match(pg_get_functiondef('public.am_i_admin'::regproc), '= ''([^'']+@[^'']+)'''))[1];
$$;

-- Compte auth + profil (cree par le declencheur handle_new_user).
CREATE FUNCTION pg_temp.t_membre(p_prenom text DEFAULT 'Test')
RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE v_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (id, email, aud, role, raw_user_meta_data)
  VALUES (v_id, 'test-' || v_id || '@lampasai.test', 'authenticated', 'authenticated',
          jsonb_build_object('first_name', p_prenom));
  RETURN v_id;
END $$;

-- Ecrit une ligne sans declencher les gardes (mise en place d'un scenario).
CREATE FUNCTION pg_temp.t_forcer(p_sql text)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  SET LOCAL session_replication_role = replica;
  EXECUTE p_sql;
  SET LOCAL session_replication_role = origin;
END $$;

-- ── Execution comme un membre / l'administrateur / l'anonyme ─────────────────

-- Execute p_sql avec le role et le jeton simules. Renvoie NULL si tout passe,
-- sinon le message d'erreur. p_uid NULL : serveur (postgres), comme un cron.
CREATE FUNCTION pg_temp.t_exec(p_uid uuid, p_sql text, p_email text DEFAULT NULL)
RETURNS text LANGUAGE plpgsql AS $$
DECLARE v_msg text;
BEGIN
  PERFORM set_config('request.jwt.claims',
    CASE WHEN p_uid IS NULL THEN '' ELSE json_build_object('role', 'authenticated', 'sub', p_uid, 'email', p_email)::text END, true);
  BEGIN
    IF p_uid IS NOT NULL THEN EXECUTE 'SET LOCAL ROLE authenticated'; END IF;
    EXECUTE p_sql;
    IF p_uid IS NOT NULL THEN EXECUTE 'RESET ROLE'; END IF;
    RETURN NULL;
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_msg = MESSAGE_TEXT;
    RETURN v_msg;
  END;
END $$;

-- Valeur (texte) renvoyee par p_sql, executee comme p_uid. Erreur => 'ERREUR: ...'.
CREATE FUNCTION pg_temp.t_valeur(p_uid uuid, p_sql text, p_email text DEFAULT NULL)
RETURNS text LANGUAGE plpgsql AS $$
DECLARE v text;
BEGIN
  PERFORM set_config('request.jwt.claims', json_build_object('role', 'authenticated', 'sub', p_uid, 'email', p_email)::text, true);
  BEGIN
    EXECUTE 'SET LOCAL ROLE authenticated';
    EXECUTE p_sql INTO v;
    EXECUTE 'RESET ROLE';
    RETURN coalesce(v, '');
  EXCEPTION WHEN OTHERS THEN
    RETURN 'ERREUR: ' || SQLERRM;
  END;
END $$;

-- Idem pour l'ANONYME (cle publique du site, sans session).
CREATE FUNCTION pg_temp.t_anon(p_sql text)
RETURNS text LANGUAGE plpgsql AS $$
DECLARE v text;
BEGIN
  PERFORM set_config('request.jwt.claims', '', true);
  BEGIN
    EXECUTE 'SET LOCAL ROLE anon';
    EXECUTE p_sql INTO v;
    EXECUTE 'RESET ROLE';
    RETURN coalesce(v, '');
  EXCEPTION WHEN OTHERS THEN
    RETURN 'ERREUR: ' || SQLERRM;
  END;
END $$;

-- ── Assertions ───────────────────────────────────────────────

CREATE FUNCTION pg_temp.t_attendu(p_label text, p_ok boolean, p_detail text DEFAULT NULL)
RETURNS void LANGUAGE sql AS $$
  INSERT INTO t_resultats (label, ok, detail) VALUES (p_label, coalesce(p_ok, false), p_detail);
$$;

-- Doit etre refuse, et pour la bonne raison (p_motif : motif ILIKE attendu).
CREATE FUNCTION pg_temp.t_refuse(p_label text, p_uid uuid, p_sql text, p_motif text, p_email text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE v_err text := pg_temp.t_exec(p_uid, p_sql, p_email);
BEGIN
  IF v_err IS NULL THEN
    PERFORM pg_temp.t_attendu(p_label, false, 'accepte alors qu''il devait etre refuse');
  ELSE
    PERFORM pg_temp.t_attendu(p_label, v_err ILIKE '%' || p_motif || '%', 'refuse pour une autre raison : ' || v_err);
  END IF;
END $$;

-- Doit passer.
CREATE FUNCTION pg_temp.t_passe(p_label text, p_uid uuid, p_sql text, p_email text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE v_err text := pg_temp.t_exec(p_uid, p_sql, p_email);
BEGIN
  PERFORM pg_temp.t_attendu(p_label, v_err IS NULL, 'refuse a tort : ' || v_err);
END $$;

-- Nombre de lignes qu'une requete (SELECT ...) laisse voir a p_uid ; '0' attendu quand la RLS filtre.
CREATE FUNCTION pg_temp.t_vues(p_uid uuid, p_from_where text, p_email text DEFAULT NULL)
RETURNS text LANGUAGE sql AS $$
  SELECT pg_temp.t_valeur(p_uid, 'SELECT count(*) FROM ' || p_from_where, p_email);
$$;

-- Nombre de lignes qu'un UPDATE/DELETE atteint reellement ('0' = la RLS l'a bloque en silence).
CREATE FUNCTION pg_temp.t_touchees(p_uid uuid, p_dml text, p_email text DEFAULT NULL)
RETURNS text LANGUAGE sql AS $$
  SELECT pg_temp.t_valeur(p_uid, 'WITH x AS (' || p_dml || ' RETURNING 1) SELECT count(*) FROM x', p_email);
$$;
