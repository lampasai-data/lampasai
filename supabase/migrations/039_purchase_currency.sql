-- Records the currency of each purchase next to amount_cents.
--
-- Why: the Gumroad `price` we stored for the first sale was 559 while the
-- buyer actually paid 4.99 EUR - Gumroad's `price` is not in the buyer's
-- currency (most likely USD cents), and the admin hardcoded "EUR" on top of
-- it. From now on the Gumroad functions store the real amount and its
-- currency.
--
-- Safe for existing buyers: purely additive, nullable, no default, no change
-- to any existing row, policy or access rule. NULL means "legacy row,
-- currency never recorded" (Stripe rows, which are always EUR, and the first
-- Gumroad sale).
--
-- ORDER MATTERS: apply this migration BEFORE deploying the updated
-- gumroad-webhook / gumroad-reconcile / admin-trigger-reconcile /
-- admin-link-gumroad-purchase / reconcile-pending-purchases functions. They
-- insert into this column; deployed first, those inserts would fail.
alter table public.certification_purchases
  add column if not exists currency text;

alter table public.pending_gumroad_purchases
  add column if not exists currency text;

alter table public.certification_purchases
  drop constraint if exists certification_purchases_currency_check;
alter table public.certification_purchases
  add constraint certification_purchases_currency_check
  check (currency is null or currency ~ '^[a-z]{3}$');

alter table public.pending_gumroad_purchases
  drop constraint if exists pending_gumroad_purchases_currency_check;
alter table public.pending_gumroad_purchases
  add constraint pending_gumroad_purchases_currency_check
  check (currency is null or currency ~ '^[a-z]{3}$');
