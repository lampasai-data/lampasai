-- Bilan d'un fichier de test : TOUJOURS une exception, pour que la
-- transaction soit annulee (aucune donnee de test ne reste en base).
-- Le runner lit TEST_OK / TEST_ECHEC dans le message.
DO $$
DECLARE v_total int; v_ko text;
BEGIN
  SELECT count(*), string_agg('  - ' || label || ' : ' || coalesce(detail, ''), E'\n' ORDER BY n) FILTER (WHERE NOT ok)
    INTO v_total, v_ko FROM t_resultats;
  IF v_ko IS NULL THEN
    RAISE EXCEPTION 'TEST_OK %', v_total;
  END IF;
  RAISE EXCEPTION E'TEST_ECHEC\n%', v_ko;
END $$;
