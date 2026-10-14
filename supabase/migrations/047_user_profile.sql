-- User profile: change one's first name (at most once a week) and set a
-- profile picture.
--
-- Safe for existing users: purely additive. No existing policy, purchase,
-- plan or access rule is touched, and NO general update policy is opened on
-- `profiles` (that would let anyone write their own `plan`). The browser can
-- only go through the two narrow functions below, each of which can change
-- one thing about the caller's own profile and nothing else.
--
--   profiles.first_name_changed_at   when the name was last changed by the user
--   profile_name_history             old/new name of every change (admin only)
--   update_my_first_name(text)       the weekly-limited name change
--   update_my_avatar(text)           sets / clears profiles.avatar_url
--   storage bucket "avatars"         public pictures, one file per user, in a
--                                    folder named after the user's id

alter table public.profiles add column if not exists first_name_changed_at timestamptz;

create table if not exists public.profile_name_history (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  old_name text,
  new_name text not null,
  changed_at timestamptz not null default now()
);
alter table public.profile_name_history enable row level security;

drop policy if exists "admin reads name history" on public.profile_name_history;
create policy "admin reads name history"
  on public.profile_name_history for select
  using (auth.jwt() ->> 'email' = 'mbairo.allatessem@gmail.com');
revoke insert, update, delete, truncate on public.profile_name_history from anon, authenticated;

-- Returns {"status": "ok" | "unchanged" | "invalid" | "rate_limited", "next_change_at": ...}.
-- The admin account is not limited, so the feature can be tested.
create or replace function public.update_my_first_name(p_first_name text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_name text := btrim(regexp_replace(coalesce(p_first_name, ''), '\s+', ' ', 'g'));
  v_old text;
  v_changed_at timestamptz;
  v_is_admin boolean := (auth.jwt() ->> 'email') = 'mbairo.allatessem@gmail.com';
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;
  -- 1 to 40 characters; no link, address or markup in a first name.
  if length(v_name) < 1 or length(v_name) > 40
     or v_name ~* '(https?:|www\.|@|<|>)' then
    return jsonb_build_object('status', 'invalid');
  end if;

  select first_name, first_name_changed_at into v_old, v_changed_at
  from public.profiles where id = auth.uid() for update;

  if v_old is not distinct from v_name then
    return jsonb_build_object('status', 'unchanged');
  end if;
  if not v_is_admin and v_changed_at is not null and v_changed_at > now() - interval '7 days' then
    return jsonb_build_object('status', 'rate_limited', 'next_change_at', v_changed_at + interval '7 days');
  end if;

  update public.profiles set first_name = v_name, first_name_changed_at = now() where id = auth.uid();
  insert into public.profile_name_history (user_id, old_name, new_name) values (auth.uid(), v_old, v_name);
  return jsonb_build_object('status', 'ok', 'next_change_at', now() + interval '7 days');
end;
$$;
revoke all on function public.update_my_first_name(text) from public, anon;
grant execute on function public.update_my_first_name(text) to authenticated;

-- The picture URL must point at the caller's own folder of the avatars bucket.
create or replace function public.update_my_avatar(p_url text)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;
  if p_url is not null and p_url not like
     'https://kklgxcehotrxsczvyles.supabase.co/storage/v1/object/public/avatars/' || auth.uid()::text || '/%' then
    raise exception 'Invalid picture address';
  end if;
  update public.profiles set avatar_url = p_url where id = auth.uid();
end;
$$;
revoke all on function public.update_my_avatar(text) from public, anon;
grant execute on function public.update_my_avatar(text) to authenticated;

-- Pictures: public to read (they are shown in the interface), but a user can
-- only write inside their own folder, JPEG only, 256 KB at most.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 262144, array['image/jpeg'])
on conflict (id) do nothing;

drop policy if exists "users add own avatar" on storage.objects;
create policy "users add own avatar" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "users read own avatar" on storage.objects;
create policy "users read own avatar" on storage.objects for select to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "users replace own avatar" on storage.objects;
create policy "users replace own avatar" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "users delete own avatar" on storage.objects;
create policy "users delete own avatar" on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
