-- Cycle de vie des signaux de sécurité : à traiter -> traité -> retiré -> supprimé.
--
-- "Retiré" (archived_at) sort le signal de l'historique sans le détruire ;
-- "supprimé" n'est possible que depuis les retirés. Un signal ouvert n'est
-- jamais supprimable, et chaque suppression est inscrite au journal d'audit
-- (nombre et types), qui lui est immuable.

alter table public.security_signals
  add column if not exists archived_at timestamptz,
  add column if not exists archived_by text;

create or replace function public.admin_handle_security_signals(p_ids uuid[], p_note text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := coalesce(auth.jwt() ->> 'email', '');
  v_count integer;
begin
  if v_email <> 'mbairo.allatessem@gmail.com' then
    raise exception 'Forbidden';
  end if;
  if length(trim(coalesce(p_note, ''))) < 3 then
    raise exception 'A note is required';
  end if;

  with done as (
    update public.security_signals
    set handled_at = now(), handled_by = v_email, note = trim(p_note)
    where id = any (p_ids) and handled_at is null
    returning 1
  )
  select count(*) into v_count from done;

  if v_count > 0 then
    perform public.fn_audit('security_signals_handled', 'security_signal', null, null,
      jsonb_build_object('count', v_count));
  end if;
  return v_count;
end;
$$;

create or replace function public.admin_archive_security_signals(p_ids uuid[], p_archive boolean)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := coalesce(auth.jwt() ->> 'email', '');
  v_count integer;
begin
  if v_email <> 'mbairo.allatessem@gmail.com' then
    raise exception 'Forbidden';
  end if;

  with done as (
    update public.security_signals
    set archived_at = case when p_archive then now() else null end,
        archived_by = case when p_archive then v_email else null end
    where id = any (p_ids)
      and handled_at is not null
      and (archived_at is null) = p_archive
    returning 1
  )
  select count(*) into v_count from done;

  if v_count > 0 then
    perform public.fn_audit(
      case when p_archive then 'security_signals_archived' else 'security_signals_restored' end,
      'security_signal', null, null, jsonb_build_object('count', v_count));
  end if;
  return v_count;
end;
$$;

create or replace function public.admin_delete_security_signals(p_ids uuid[])
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
  v_types jsonb;
begin
  if coalesce(auth.jwt() ->> 'email', '') <> 'mbairo.allatessem@gmail.com' then
    raise exception 'Forbidden';
  end if;

  with gone as (
    delete from public.security_signals
    where id = any (p_ids) and archived_at is not null
    returning type
  )
  select count(*), coalesce(jsonb_agg(distinct type), '[]'::jsonb) into v_count, v_types from gone;

  if v_count > 0 then
    perform public.fn_audit('security_signals_deleted', 'security_signal', null, null,
      jsonb_build_object('count', v_count, 'types', v_types));
  end if;
  return v_count;
end;
$$;

revoke all on function public.admin_handle_security_signals(uuid[], text) from public, anon;
revoke all on function public.admin_archive_security_signals(uuid[], boolean) from public, anon;
revoke all on function public.admin_delete_security_signals(uuid[]) from public, anon;
grant execute on function public.admin_handle_security_signals(uuid[], text) to authenticated;
grant execute on function public.admin_archive_security_signals(uuid[], boolean) to authenticated;
grant execute on function public.admin_delete_security_signals(uuid[]) to authenticated;
