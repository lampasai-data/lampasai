import { useState } from "react";

export type DisplayCurrency = "eur" | "usd";
const CURRENCY_KEY = "lampasai-admin-currency";

// The dashboard overview can switch between euros and Gumroad's dollars (what
// its balance and payouts are in); everything else is shown in euros. The
// choice is remembered per browser, storage being optional.
export function useDisplayCurrency() {
  const [currency, setCurrency] = useState<DisplayCurrency>(() => {
    try {
      return localStorage.getItem(CURRENCY_KEY) === "usd" ? "usd" : "eur";
    } catch {
      return "eur";
    }
  });
  function choose(next: DisplayCurrency) {
    setCurrency(next);
    try {
      localStorage.setItem(CURRENCY_KEY, next);
    } catch {
      // ignore - the choice just won't persist
    }
  }
  return [currency, choose] as const;
}
