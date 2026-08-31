-- Reminds a user by email when their paid/voucher access to a certification
-- is about to expire, at J-7 and J-1. Guard columns (*_sent_at) make each
-- reminder send-once, matching the pattern already used for the Gumroad
-- reconcile sweep (see 012_gumroad_reconcile_cron.sql).

alter table public.certification_purchases
  add column if not exists reminder_7d_sent_at timestamptz,
  add column if not exists reminder_1d_sent_at timestamptz;

create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

-- Daily sweep; the Edge Function itself decides who's actually at J-7/J-1
-- and skips anyone already notified for that milestone.
select cron.schedule(
  'expiry-reminder-sweep',
  '0 8 * * *',
  $$
  select net.http_post(
    url := 'https://kklgxcehotrxsczvyles.supabase.co/functions/v1/send-expiry-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'X-Reminder-Secret', (select decrypted_secret from vault.decrypted_secrets where name = 'expiry_reminder_secret')
    ),
    body := '{}'::jsonb
  );
  $$
);
