-- Supprimer un compte qui avait utilisé un voucher échouait toujours.
--
-- La migration 016 a passé exam_voucher_redemptions.user_id en ON DELETE SET
-- NULL (pour garder la trace de l'utilisation et le décompte du voucher quand
-- le compte disparaît), mais la colonne est restée NOT NULL : à la suppression
-- du compte, Postgres tente de mettre user_id à NULL, refuse, et toute la
-- suppression est annulée ("N suppressions ont échoué" dans l'admin).
--
-- On autorise donc NULL. La ligne reste (le voucher garde sa place utilisée,
-- redeemed_by_email conserve qui l'a utilisé) ; la contrainte unique
-- (voucher_id, user_id) ignore les NULL, donc plusieurs comptes supprimés
-- d'un même voucher ne se bloquent pas entre eux.

alter table public.exam_voucher_redemptions
  alter column user_id drop not null;
