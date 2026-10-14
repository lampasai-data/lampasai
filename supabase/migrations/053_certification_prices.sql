-- Prix de vente des certifications, modifiables depuis /admin/vouchers
-- (sous-onglet "Tarification"). Le site lit ces prix pour tout ce qu'il
-- affiche ; le montant réellement facturé reste celui du produit Gumroad, à
-- aligner à la main dans le dashboard Gumroad.
--
-- Sans effet à la livraison : chaque certification est initialisée à 4,99 €,
-- le prix affiché jusqu'ici. Le site retombe aussi sur 4,99 € si la lecture
-- échoue, donc aucun accès ni aucun prix ne disparaît.

create table if not exists public.certification_prices (
  certification_id uuid primary key references public.certifications (id) on delete cascade,
  price_cents integer not null check (price_cents between 100 and 9900),
  currency text not null default 'eur' check (currency = 'eur'),
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists public.certification_price_changes (
  id uuid primary key default gen_random_uuid(),
  certification_id uuid not null references public.certifications (id) on delete cascade,
  old_price_cents integer,
  new_price_cents integer not null,
  changed_by text not null,
  changed_at timestamptz not null default now()
);

insert into public.certification_prices (certification_id, price_cents)
select id, 499 from public.certifications
on conflict (certification_id) do nothing;

alter table public.certification_prices enable row level security;
alter table public.certification_price_changes enable row level security;

-- Le prix est public (page de tarification visible sans compte). Aucune
-- politique d'écriture : seule la fonction ci-dessous peut modifier.
drop policy if exists "certification prices are publicly readable" on public.certification_prices;
create policy "certification prices are publicly readable"
  on public.certification_prices for select
  using (true);

drop policy if exists "admin reads price changes" on public.certification_price_changes;
create policy "admin reads price changes"
  on public.certification_price_changes for select
  using (auth.jwt() ->> 'email' = 'mbairo.allatessem@gmail.com');

-- p_expected_cents : le prix que l'admin avait sous les yeux. S'il a changé
-- entre-temps (autre onglet, autre session), on refuse plutôt que d'écraser.
create or replace function public.admin_set_certification_price(
  p_certification_id uuid,
  p_price_cents integer,
  p_expected_cents integer
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := auth.jwt() ->> 'email';
  v_current integer;
begin
  if v_email is distinct from 'mbairo.allatessem@gmail.com' then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if p_price_cents is null or p_price_cents < 100 or p_price_cents > 9900 then
    raise exception 'price_out_of_range';
  end if;

  select price_cents into v_current
  from public.certification_prices
  where certification_id = p_certification_id
  for update;

  if v_current is distinct from p_expected_cents then
    raise exception 'price_changed_meanwhile';
  end if;
  if v_current = p_price_cents then
    return;
  end if;

  insert into public.certification_prices (certification_id, price_cents, updated_at, updated_by)
  values (p_certification_id, p_price_cents, now(), v_email)
  on conflict (certification_id) do update
    set price_cents = excluded.price_cents,
        updated_at = excluded.updated_at,
        updated_by = excluded.updated_by;

  insert into public.certification_price_changes (certification_id, old_price_cents, new_price_cents, changed_by)
  values (p_certification_id, v_current, p_price_cents, v_email);
end;
$$;

revoke all on function public.admin_set_certification_price(uuid, integer, integer) from public, anon;
grant execute on function public.admin_set_certification_price(uuid, integer, integer) to authenticated;
