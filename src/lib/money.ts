// A purchase row with currency = null is a legacy row from before currencies
// were recorded: Stripe sales (always EUR) and the first Gumroad sale.
export const DEFAULT_CURRENCY = "eur";

export const currencyOf = (currency: string | null | undefined) => (currency ?? DEFAULT_CURRENCY).toLowerCase();

export function formatMoney(cents: number, currency: string | null | undefined, locale: string) {
  // narrowSymbol: "$" rather than "$US" in French (and "€" stays "€").
  return (cents / 100).toLocaleString(locale, {
    style: "currency",
    currency: currencyOf(currency).toUpperCase(),
    currencyDisplay: "narrowSymbol",
  });
}

// Sums amounts per currency: euros and dollars must never be added together.
export function sumByCurrency<T extends { amount_cents: number; currency: string | null }>(rows: T[]) {
  const totals = new Map<string, number>();
  for (const r of rows) {
    const c = currencyOf(r.currency);
    totals.set(c, (totals.get(c) ?? 0) + r.amount_cents);
  }
  return totals;
}

// Share of a sale taken by the platform (0.27 = 27%).
export const feeRateOf = (fees: { priceUsdCents: number; feeUsdCents: number } | undefined) =>
  fees ? fees.feeUsdCents / fees.priceUsdCents : undefined;

// Euro estimate of what is kept: the real amount minus the platform's share.
export const netCents = (amountCents: number, feeRate: number | undefined) =>
  Math.round(amountCents * (1 - (feeRate ?? 0)));
