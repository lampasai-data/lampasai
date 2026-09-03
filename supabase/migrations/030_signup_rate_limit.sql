-- signup-with-custom-email is, by necessity, an unauthenticated endpoint
-- (it's the signup flow itself) that creates a real auth user and sends a
-- Resend email on every call, with no throttle at all - a scripted caller
-- could mass-create accounts and burn Resend's send quota. This gives it a
-- simple, generic sliding-window rate limiter, keyed by caller IP, that any
-- future unauthenticated Edge Function can reuse with its own bucket name.

create table if not exists public.rate_limit_events (
  id bigint generated always as identity primary key,
  bucket text not null,
  created_at timestamptz not null default now()
);

create index if not exists rate_limit_events_bucket_created_at_idx
  on public.rate_limit_events (bucket, created_at);

alter table public.rate_limit_events enable row level security;
-- No policies at all - only ever touched via the security definer function
-- below, called with the service-role key from Edge Functions.

-- Records one attempt for p_bucket and returns how many attempts that
-- bucket has had within the trailing p_window, pruning its own older rows
-- as it goes so the table doesn't grow unbounded.
create function public.record_and_count_rate_limit(p_bucket text, p_window interval)
returns bigint
language plpgsql
security definer set search_path = public
as $$
declare
  v_count bigint;
begin
  delete from public.rate_limit_events
  where bucket = p_bucket and created_at < now() - p_window;

  insert into public.rate_limit_events (bucket) values (p_bucket);

  select count(*) into v_count
  from public.rate_limit_events
  where bucket = p_bucket and created_at >= now() - p_window;

  return v_count;
end;
$$;

revoke all on function public.record_and_count_rate_limit(text, interval) from public, anon, authenticated;
grant execute on function public.record_and_count_rate_limit(text, interval) to service_role;
