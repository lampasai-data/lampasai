-- E-mail the team when a user sends an opinion or a help request.
-- After each insert into user_feedback, pg_net calls the notify-feedback Edge
-- Function with the message id. The call is asynchronous: it never slows down
-- or fails the user's submission (if the mail cannot go out, the message is
-- still in the admin Feedback page).
--
-- The shared secret lives in Vault (name 'feedback_notify_secret') and in the
-- function's FEEDBACK_NOTIFY_SECRET env var; it is created outside this file
-- so it never lands in git.

create or replace function public.fn_user_feedback_notify()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_secret text;
begin
  select decrypted_secret into v_secret from vault.decrypted_secrets where name = 'feedback_notify_secret';
  if v_secret is null then
    return new;
  end if;

  perform net.http_post(
    url := 'https://kklgxcehotrxsczvyles.supabase.co/functions/v1/notify-feedback',
    headers := jsonb_build_object('Content-Type', 'application/json', 'X-Feedback-Secret', v_secret),
    body := jsonb_build_object('id', new.id)
  );
  return new;
exception when others then
  -- Never let a notification problem block the message itself.
  return new;
end;
$$;
revoke all on function public.fn_user_feedback_notify() from public, anon, authenticated;

drop trigger if exists trg_user_feedback_notify on public.user_feedback;
create trigger trg_user_feedback_notify
  after insert on public.user_feedback
  for each row execute function public.fn_user_feedback_notify();
