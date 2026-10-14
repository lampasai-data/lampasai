-- Feedback and help requests sent by signed-in users from the top bar
-- (lightbulb = review / idea / problem, question mark = help request).
--
-- Safe for existing users: purely additive (one new table, three functions).
-- No existing table, policy, purchase or access rule is touched. The browser
-- can only add a message through submit_feedback() (validated, and limited to
-- 5 a day per person); only the admin can read the messages or mark them done.
create table if not exists public.user_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('review', 'idea', 'problem', 'help')),
  rating smallint check (rating between 1 and 5),
  message text not null,
  page text,
  created_at timestamptz not null default now(),
  handled_at timestamptz
);
create index if not exists user_feedback_created_idx on public.user_feedback (created_at desc);
alter table public.user_feedback enable row level security;

drop policy if exists "admin reads feedback" on public.user_feedback;
create policy "admin reads feedback"
  on public.user_feedback for select
  using (auth.jwt() ->> 'email' = 'mbairo.allatessem@gmail.com');
revoke insert, update, delete, truncate on public.user_feedback from anon, authenticated;

-- Returns {"status": "ok" | "invalid" | "rate_limited"}.
create or replace function public.submit_feedback(
  p_kind text, p_rating int, p_message text, p_page text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_message text := btrim(coalesce(p_message, ''));
  v_is_admin boolean := (auth.jwt() ->> 'email') = 'mbairo.allatessem@gmail.com';
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;
  if p_kind not in ('review', 'idea', 'problem', 'help')
     or length(v_message) < 3 or length(v_message) > 2000
     or (p_rating is not null and (p_rating < 1 or p_rating > 5)) then
    return jsonb_build_object('status', 'invalid');
  end if;
  if not v_is_admin and (
    select count(*) from public.user_feedback
    where user_id = auth.uid() and created_at > now() - interval '24 hours'
  ) >= 5 then
    return jsonb_build_object('status', 'rate_limited');
  end if;

  insert into public.user_feedback (user_id, kind, rating, message, page)
  values (auth.uid(), p_kind, p_rating, v_message, left(p_page, 200));
  return jsonb_build_object('status', 'ok');
end;
$$;
revoke all on function public.submit_feedback(text, int, text, text) from public, anon;
grant execute on function public.submit_feedback(text, int, text, text) to authenticated;

-- Marks a message as dealt with (or back to open).
create or replace function public.admin_set_feedback_handled(p_id uuid, p_handled boolean)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if coalesce(auth.jwt() ->> 'email', '') <> 'mbairo.allatessem@gmail.com' then
    raise exception 'Forbidden';
  end if;
  update public.user_feedback
     set handled_at = case when p_handled then now() else null end
   where id = p_id;
  if not found then
    raise exception 'Message not found';
  end if;
end;
$$;
revoke all on function public.admin_set_feedback_handled(uuid, boolean) from public, anon;
grant execute on function public.admin_set_feedback_handled(uuid, boolean) to authenticated;
