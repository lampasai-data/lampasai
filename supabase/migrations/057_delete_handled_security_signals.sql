-- Un signal traité peut être supprimé directement, sans passer par "retiré".
-- Un signal encore ouvert reste non supprimable.
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
    where id = any (p_ids) and handled_at is not null
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
