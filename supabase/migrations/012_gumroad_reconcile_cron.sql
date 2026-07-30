-- Documents (and makes reproducible) the pg_cron job that was previously
-- set up directly against this project via SQL and never committed to a
-- migration - the 6h safety-net sweep for missed Gumroad webhook pings
-- (see supabase/functions/gumroad-reconcile). Named so re-running this
-- migration replaces the existing job instead of creating a duplicate.
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

select cron.schedule(
  'gumroad-reconcile-sweep',
  '0 */6 * * *',
  $$
  select net.http_post(
    url := 'https://kklgxcehotrxsczvyles.supabase.co/functions/v1/gumroad-reconcile',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'X-Reconcile-Secret', (select decrypted_secret from vault.decrypted_secrets where name = 'gumroad_reconcile_secret')
    ),
    body := '{}'::jsonb
  );
  $$
);
