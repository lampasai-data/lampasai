import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { formatMoney } from "./money";

// Price shown when nothing better is known (table missing, read failed, a
// certification without a row): the price the site always displayed before it
// became editable, so a failed read never leaves a visitor without a price.
export const DEFAULT_PRICE_CENTS = 499;

export type CertPrices = Record<string, number>; // certification slug -> cents

let cache: CertPrices | null = null;
let inflight: Promise<CertPrices> | null = null;
const listeners = new Set<() => void>();

async function fetchPrices(): Promise<CertPrices> {
  if (!supabase) return {};
  const { data, error } = await supabase
    .from("certification_prices")
    .select("price_cents, certifications(slug)");
  if (error || !data) return {};
  const prices: CertPrices = {};
  for (const row of data) {
    const rel = row.certifications as unknown as { slug: string } | { slug: string }[] | null;
    const slug = Array.isArray(rel) ? rel[0]?.slug : rel?.slug;
    if (slug) prices[slug] = row.price_cents as number;
  }
  return prices;
}

export function loadCertPrices(force = false): Promise<CertPrices> {
  if (cache && !force) return Promise.resolve(cache);
  if (!inflight || force) {
    inflight = fetchPrices().then((prices) => {
      cache = prices;
      inflight = null;
      listeners.forEach((l) => l());
      return prices;
    });
  }
  return inflight;
}

// Called by the admin after a change, so every mounted price updates at once.
export const refreshCertPrices = () => loadCertPrices(true);

// `ready` is false only until the first read settles. Components that print a
// price should wait for it rather than flash the default and then correct it.
export function useCertPrices(lang: "fr" | "en") {
  const [, bump] = useState(0);
  useEffect(() => {
    const l = () => bump((n) => n + 1);
    listeners.add(l);
    if (!cache) void loadCertPrices();
    return () => {
      listeners.delete(l);
    };
  }, []);

  const locale = lang === "fr" ? "fr-FR" : "en-US";
  const cents = (slug: string) => cache?.[slug] ?? DEFAULT_PRICE_CENTS;
  return {
    ready: cache !== null,
    cents,
    price: (slug: string) => formatMoney(cents(slug), "eur", locale),
  };
}
