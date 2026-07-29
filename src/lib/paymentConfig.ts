// Single switch to move the whole app between payment providers. Stripe's
// code (create-checkout-session, stripe-webhook) stays deployed and intact
// for when it's needed again later - this flag just decides which one the
// UI links out to.
export const ENABLE_GUMROAD = true;

const GUMROAD_SELLER = "lampasai";

// Mirrors GUMROAD_PERMALINK_POWERBI / GUMROAD_PERMALINK_SNOWFLAKE set on the
// gumroad-webhook Edge Function. Permalinks aren't secret (they're part of
// the public product URL), so it's fine to duplicate them here for the
// frontend to build links with.
const GUMROAD_PERMALINKS: Record<string, string> = {
  "power-bi": "vozwxp",
  snowflake: "aistwa",
};

// wanted=true skips the product page and opens the checkout overlay
// directly (documented Gumroad behavior). The email param is added on a
// best-effort basis to reduce matching mismatches - Gumroad's own prefill
// support for it hasn't been independently confirmed, so it's not something
// to rely on; the pending-purchase reconciliation flow is the real safety
// net if it doesn't take effect.
export function buildGumroadCheckoutUrl(slug: string, email?: string | null): string | null {
  const permalink = GUMROAD_PERMALINKS[slug];
  if (!permalink) return null;
  const params = new URLSearchParams({ wanted: "true" });
  if (email) params.set("email", email);
  return `https://${GUMROAD_SELLER}.gumroad.com/l/${permalink}?${params.toString()}`;
}
