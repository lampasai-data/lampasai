-- Suppression en masse de vouchers depuis /admin/vouchers.
--
-- Seuls les vouchers qui ne peuvent plus servir sont supprimables : épuisés
-- (toutes les utilisations consommées) ou expirés. Un voucher encore
-- disponible peut avoir été distribué, il n'est jamais supprimé ici, même
-- s'il figure dans la liste envoyée.
--
-- Les accès déjà accordés par un voucher vivent dans certification_purchases
-- (source = 'voucher') : ils ne sont pas touchés. Ce qui disparaît avec le
-- voucher, c'est son historique d'utilisation (exam_voucher_redemptions,
-- supprimé en cascade).

create or replace function public.admin_delete_exam_vouchers(p_ids uuid[])
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deleted integer;
begin
  if (auth.jwt() ->> 'email') is distinct from 'mbairo.allatessem@gmail.com' then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  with gone as (
    delete from public.exam_vouchers v
    where v.id = any (p_ids)
      and (
        (v.expires_at is not null and v.expires_at <= now())
        or (select count(*) from public.exam_voucher_redemptions r where r.voucher_id = v.id) >= v.max_redemptions
      )
    returning 1
  )
  select count(*) into v_deleted from gone;

  return v_deleted;
end;
$$;

revoke all on function public.admin_delete_exam_vouchers(uuid[]) from public, anon;
grant execute on function public.admin_delete_exam_vouchers(uuid[]) to authenticated;
