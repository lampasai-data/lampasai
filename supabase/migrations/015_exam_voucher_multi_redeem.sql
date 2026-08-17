-- Exam vouchers: support codes redeemable by several users (max_redemptions
-- > 1), not just single-use. Replaces the single redeemed_by/redeemed_at
-- pair on exam_vouchers with a redemptions table, since a voucher can now
-- have many redeemers.

alter table public.exam_vouchers
  add column if not exists max_redemptions integer not null default 1;
alter table public.exam_vouchers
  drop constraint if exists exam_vouchers_max_redemptions_check;
alter table public.exam_vouchers
  add constraint exam_vouchers_max_redemptions_check check (max_redemptions > 0);

create table if not exists public.exam_voucher_redemptions (
  id uuid primary key default gen_random_uuid(),
  voucher_id uuid not null references public.exam_vouchers (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  redeemed_at timestamptz not null default now(),
  unique (voucher_id, user_id)
);

create index if not exists exam_voucher_redemptions_voucher_id_idx
  on public.exam_voucher_redemptions (voucher_id);

-- Backfill the single redemption each pre-existing voucher already recorded
-- on itself, before dropping those columns below.
insert into public.exam_voucher_redemptions (voucher_id, user_id, redeemed_at)
select id, redeemed_by, redeemed_at
from public.exam_vouchers
where redeemed_by is not null
on conflict do nothing;

alter table public.exam_vouchers drop column if exists redeemed_by;
alter table public.exam_vouchers drop column if exists redeemed_at;

alter table public.exam_voucher_redemptions enable row level security;
drop policy if exists "admin reads exam voucher redemptions" on public.exam_voucher_redemptions;
create policy "admin reads exam voucher redemptions"
  on public.exam_voucher_redemptions for select
  using (auth.jwt() ->> 'email' = 'mbairo.allatessem@gmail.com');

-- Atomic claim: locks the voucher row, checks it isn't expired or already
-- at its redemption cap, and that this user hasn't already used it, then
-- records the redemption - all inside one transaction so a multi-use code
-- redeemed concurrently by several users right up to its cap can't be
-- over-claimed. security definer since it's only ever called by the
-- service-role redeem-exam-voucher Edge Function, never directly by users.
create or replace function public.claim_exam_voucher(
  p_code text,
  p_user_id uuid,
  p_certification_id uuid default null
)
returns table (certification_id uuid, error_code text)
language plpgsql
security definer set search_path = public
as $$
declare
  v_voucher record;
  v_count integer;
begin
  select * into v_voucher
  from public.exam_vouchers
  where code = p_code
  for update;

  if not found then
    return query select null::uuid, 'not_found'::text;
    return;
  end if;

  if p_certification_id is not null and v_voucher.certification_id <> p_certification_id then
    return query select null::uuid, 'wrong_certification'::text;
    return;
  end if;

  if v_voucher.expires_at is not null and v_voucher.expires_at <= now() then
    return query select null::uuid, 'expired'::text;
    return;
  end if;

  if exists (
    select 1 from public.exam_voucher_redemptions
    where voucher_id = v_voucher.id and user_id = p_user_id
  ) then
    return query select null::uuid, 'already_redeemed_by_user'::text;
    return;
  end if;

  select count(*) into v_count
  from public.exam_voucher_redemptions
  where voucher_id = v_voucher.id;

  if v_count >= v_voucher.max_redemptions then
    return query select null::uuid, 'exhausted'::text;
    return;
  end if;

  insert into public.exam_voucher_redemptions (voucher_id, user_id)
  values (v_voucher.id, p_user_id);

  return query select v_voucher.certification_id, null::text;
end;
$$;

revoke all on function public.claim_exam_voucher(text, uuid, uuid) from public, anon, authenticated;
grant execute on function public.claim_exam_voucher(text, uuid, uuid) to service_role;
