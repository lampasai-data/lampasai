-- Language of each user (fr / en) so e-mails can be sent in the language they
-- actually use on the site, plus bilingual e-mail templates and campaigns.
--
-- The site only kept the chosen language in the visitor's browser. From now on
-- it tells the server through set_my_language() at sign-up/sign-in and on every
-- language change. Existing accounts stay NULL until they next visit (NULL is
-- treated as French everywhere).
--
-- Safe for existing users: purely additive (nullable columns, new functions).
-- No existing policy, access rule or function is changed.
alter table public.profiles
  add column if not exists language text;
alter table public.profiles
  drop constraint if exists profiles_language_check;
alter table public.profiles
  add constraint profiles_language_check check (language is null or language in ('fr', 'en'));

-- A user may only set THEIR OWN language, and only to a supported value.
create or replace function public.set_my_language(p_language text)
returns void
language sql
security definer
set search_path = public, pg_temp
as $$
  update public.profiles
     set language = p_language
   where id = auth.uid()
     and p_language in ('fr', 'en')
     and language is distinct from p_language;
$$;
revoke all on function public.set_my_language(text) from public, anon;
grant execute on function public.set_my_language(text) to authenticated;

-- Bilingual content: the English version is optional (French is the fallback).
alter table public.admin_email_templates
  add column if not exists subject_en text,
  add column if not exists body_en text;
alter table public.admin_email_campaigns
  add column if not exists subject_en text,
  add column if not exists message_en text,
  add column if not exists cta_label_en text,
  add column if not exists language_filter text;

-- Recipients of a segment WITH their language (NULL = French), optionally
-- narrowed to one language. Used by the send function (service role only).
create or replace function public.fn_email_recipients(
  p_segment text, p_ids uuid[], p_type text, p_language text default null
)
returns table (user_id uuid, email text, first_name text, language text)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select s.user_id, s.email, s.first_name, coalesce(pr.language, 'fr')
  from public.fn_email_segment(p_segment, p_ids, p_type) s
  join public.profiles pr on pr.id = s.user_id
  where p_language is null or coalesce(pr.language, 'fr') = p_language;
$$;
revoke all on function public.fn_email_recipients(text, uuid[], text, text) from public, anon, authenticated;
grant execute on function public.fn_email_recipients(text, uuid[], text, text) to service_role;

-- Counts for the composer, with the French / English split.
create or replace function public.admin_count_email_recipients(
  p_segment text, p_ids uuid[], p_type text, p_language text
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
begin
  if (auth.jwt() ->> 'email') is distinct from 'mbairo.allatessem@gmail.com' then
    raise exception 'Admin only';
  end if;
  return jsonb_build_object(
    'recipients', (select count(*) from public.fn_email_recipients(p_segment, p_ids, p_type, p_language)),
    'fr', (select count(*) from public.fn_email_recipients(p_segment, p_ids, p_type, p_language) r where r.language = 'fr'),
    'en', (select count(*) from public.fn_email_recipients(p_segment, p_ids, p_type, p_language) r where r.language = 'en'),
    'unsubscribed_excluded', case when p_type = 'promotion'
      then (select count(*) from public.fn_email_recipients(p_segment, p_ids, 'service', p_language) s
            where exists (select 1 from public.email_unsubscribes e where e.user_id = s.user_id))
      else 0 end
  );
end;
$$;
revoke all on function public.admin_count_email_recipients(text, uuid[], text, text) from public, anon;
grant execute on function public.admin_count_email_recipients(text, uuid[], text, text) to authenticated;

create or replace function public.admin_email_segment_members(
  p_segment text, p_ids uuid[], p_type text, p_language text
)
returns table (user_id uuid)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
begin
  if (auth.jwt() ->> 'email') is distinct from 'mbairo.allatessem@gmail.com' then
    raise exception 'Admin only';
  end if;
  return query select r.user_id from public.fn_email_recipients(p_segment, p_ids, p_type, p_language) r;
end;
$$;
revoke all on function public.admin_email_segment_members(text, uuid[], text, text) from public, anon;
grant execute on function public.admin_email_segment_members(text, uuid[], text, text) to authenticated;
