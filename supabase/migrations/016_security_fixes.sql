-- Fixes from a full-codebase audit (2026-08-17).

-- 1. CRITICAL: the profiles update policy had no WITH CHECK, so any signed
--    in user could set profiles.plan = 'pro' themselves via a direct
--    client call (e.g. supabase.from('profiles').update({plan:'pro'})),
--    bypassing Stripe/Gumroad/vouchers entirely - plan='pro' is read
--    directly by the quiz_questions RLS policy and by the app's isPro
--    checks. Nothing in the app ever legitimately updates profiles from
--    the client (writes go through the handle_new_user trigger or
--    service-role Edge Functions), so the fix is to remove client update
--    rights on profiles entirely rather than try to carve out a safe
--    WITH CHECK.
drop policy if exists "users update own profile" on public.profiles;

-- 2. Money columns had no non-negative constraint - a malformed webhook
--    payload could write a negative amount undetected.
alter table public.certification_purchases
  drop constraint if exists certification_purchases_amount_cents_check;
alter table public.certification_purchases
  add constraint certification_purchases_amount_cents_check check (amount_cents >= 0);

alter table public.pending_gumroad_purchases
  drop constraint if exists pending_gumroad_purchases_amount_cents_check;
alter table public.pending_gumroad_purchases
  add constraint pending_gumroad_purchases_amount_cents_check check (amount_cents >= 0);

-- 3. exam_voucher_redemptions.user_id was ON DELETE CASCADE: deleting an
--    auth user silently freed up their slot on a capped voucher (delete +
--    recreate the account -> re-redeem an already-maxed-out code) and
--    erased the admin's audit trail of who used it. Switch to SET NULL and
--    snapshot the redeemer's email at redemption time, so the audit trail
--    and the redemption count both survive account deletion.
alter table public.exam_voucher_redemptions
  add column if not exists redeemed_by_email text;

update public.exam_voucher_redemptions r
set redeemed_by_email = p.email
from public.profiles p
where p.id = r.user_id and r.redeemed_by_email is null;

alter table public.exam_voucher_redemptions
  drop constraint if exists exam_voucher_redemptions_user_id_fkey;
alter table public.exam_voucher_redemptions
  add constraint exam_voucher_redemptions_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete set null;

-- 4. Fold the certification_purchases insert into the same transaction as
--    the voucher claim. Previously redeem-exam-voucher did this as a
--    second, separate round-trip after the RPC call - if it failed
--    (network blip, transient error), the voucher slot was already
--    permanently claimed with the user granted nothing, no rollback. Now
--    claim_exam_voucher does both atomically: either the whole redemption
--    succeeds, or none of it is committed.
-- Return shape changed (added expires_at) - CREATE OR REPLACE can't alter a
-- function's output columns, so the old signature must be dropped first.
drop function if exists public.claim_exam_voucher(text, uuid, uuid);

create function public.claim_exam_voucher(
  p_code text,
  p_user_id uuid,
  p_certification_id uuid default null
)
returns table (certification_id uuid, error_code text, expires_at timestamptz)
language plpgsql
security definer set search_path = public
as $$
declare
  v_voucher record;
  v_count integer;
  v_email text;
  v_expires_at timestamptz;
begin
  select * into v_voucher
  from public.exam_vouchers
  where code = p_code
  for update;

  if not found then
    return query select null::uuid, 'not_found'::text, null::timestamptz;
    return;
  end if;

  if p_certification_id is not null and v_voucher.certification_id <> p_certification_id then
    return query select null::uuid, 'wrong_certification'::text, null::timestamptz;
    return;
  end if;

  if v_voucher.expires_at is not null and v_voucher.expires_at <= now() then
    return query select null::uuid, 'expired'::text, null::timestamptz;
    return;
  end if;

  if exists (
    select 1 from public.exam_voucher_redemptions
    where voucher_id = v_voucher.id and user_id = p_user_id
  ) then
    return query select null::uuid, 'already_redeemed_by_user'::text, null::timestamptz;
    return;
  end if;

  select count(*) into v_count
  from public.exam_voucher_redemptions
  where voucher_id = v_voucher.id;

  if v_count >= v_voucher.max_redemptions then
    return query select null::uuid, 'exhausted'::text, null::timestamptz;
    return;
  end if;

  select email into v_email from public.profiles where id = p_user_id;
  v_expires_at := now() + interval '30 days';

  insert into public.exam_voucher_redemptions (voucher_id, user_id, redeemed_by_email)
  values (v_voucher.id, p_user_id, v_email);

  insert into public.certification_purchases
    (user_id, certification_id, source, amount_cents, status, pdf_allowed, expires_at)
  values
    (p_user_id, v_voucher.certification_id, 'voucher', 0, 'paid', false, v_expires_at);

  return query select v_voucher.certification_id, null::text, v_expires_at;
end;
$$;

revoke all on function public.claim_exam_voucher(text, uuid, uuid) from public, anon, authenticated;
grant execute on function public.claim_exam_voucher(text, uuid, uuid) to service_role;
