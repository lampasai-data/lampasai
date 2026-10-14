-- Voucher access length chosen per code. Until now every redemption granted
-- 30 days (hard-coded in claim_exam_voucher); the admin can now create, say,
-- 7-day trial codes. exam_vouchers.expires_at is unchanged: it is still the
-- last day the code can be redeemed, not the length of the access.
--
-- Existing codes get 30 (the column default), so they behave exactly as
-- before, and access already granted (certification_purchases) is untouched.

alter table public.exam_vouchers
  add column if not exists access_days integer not null default 30
  check (access_days between 1 and 365);

create or replace function public.claim_exam_voucher(p_code text, p_user_id uuid, p_certification_id uuid default null::uuid)
returns table(certification_id uuid, error_code text, expires_at timestamp with time zone)
language plpgsql
security definer
set search_path to 'public'
as $function$
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
  v_expires_at := now() + make_interval(days => coalesce(v_voucher.access_days, 30));

  insert into public.exam_voucher_redemptions (voucher_id, user_id, redeemed_by_email)
  values (v_voucher.id, p_user_id, v_email);

  insert into public.certification_purchases
    (user_id, certification_id, source, amount_cents, status, pdf_allowed, expires_at)
  values
    (p_user_id, v_voucher.certification_id, 'voucher', 0, 'paid', false, v_expires_at);

  return query select v_voucher.certification_id, null::text, v_expires_at;
end;
$function$;
