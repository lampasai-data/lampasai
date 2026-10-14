import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";
import { sendPurchaseReceipt } from "./purchaseReceipt.ts";

const RECEIPT_MAX_SALE_AGE_MS = 1000 * 60 * 60 * 48;

export const THREE_MONTHS_MS = 1000 * 60 * 60 * 24 * 30 * 3;

// Gumroad has no per-certification "product catalog" API of its own from
// our side - map each Gumroad product permalink to a certification slug by
// hand. Extend this when a new certification is sold on Gumroad.
export const PERMALINK_TO_CERT_SLUG: Record<string, string> = {
  [Deno.env.get("GUMROAD_PERMALINK_POWERBI") ?? "lampasai-powerbi"]: "power-bi",
  [Deno.env.get("GUMROAD_PERMALINK_SNOWFLAKE") ?? "lampasai-snowflake"]: "snowflake",
};

export interface GumroadSale {
  id: string;
  email: string;
  product_permalink: string;
  price: number;
  // When the sale happened (ISO), used to only e-mail a confirmation for a
  // recent sale and never for old ones picked up by a full history sweep.
  created_at?: string;
  refunded: boolean;
  disputed: boolean;
  chargebacked: boolean;
  // `price` (and `gumroad_fee`) are in USD cents whatever the buyer paid:
  // a 4.99 EUR sale came back as 559, and Gumroad's own analytics show it as
  // $5.59. The fields below are what the sales API is expected to expose for
  // the amount in the buyer's currency; their exact shape is not verified
  // against a live response yet (see resolveSaleAmount and the api_sale field
  // logged on every verified sale).
  currency?: string;
  currency_symbol?: string;
  formatted_total_price?: string;
  amount_refundable_in_currency?: string | number;
}

const SYMBOL_TO_CURRENCY: Record<string, string> = { "€": "eur", $: "usd", "£": "gbp" };

// Real amount (in cents of the buyer's currency) and its currency for a
// verified sale. When the expected fields are missing it falls back to
// Gumroad's raw `price`, which is known to be USD cents, so the amount is at
// least labelled correctly instead of being passed off as euros. A sale is
// never lost over this - the amount_source flag lands in gumroad_webhook_logs
// to make the fallback visible.
export function resolveSaleAmount(sale: GumroadSale): {
  amountCents: number;
  currency: string;
  source: "api_currency_amount" | "price_fallback";
} {
  const refundable =
    sale.amount_refundable_in_currency != null
      ? Math.round(parseFloat(String(sale.amount_refundable_in_currency)) * 100)
      : NaN;

  const symbol = sale.currency_symbol ?? sale.formatted_total_price?.trim().charAt(0);
  const fromSymbol = symbol ? SYMBOL_TO_CURRENCY[symbol] : undefined;
  const fromCode = /^[a-z]{3}$/i.test(sale.currency ?? "") ? sale.currency!.toLowerCase() : undefined;
  const currency = fromSymbol ?? fromCode;

  if (Number.isFinite(refundable) && refundable >= 0 && currency) {
    return { amountCents: refundable, currency, source: "api_currency_amount" };
  }
  return { amountCents: sale.price, currency: "usd", source: "price_fallback" };
}

export function createServiceClient(): SupabaseClient {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
}

// Gumroad pings carry partial card data (card[bin], card[visual],
// card[expiry_month], ...). None of it is used, so it never reaches the logs:
// any key starting with "card", at any depth (the ping and api_sale), is dropped.
function stripCardData(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripCardData);
  if (typeof value !== "object" || value === null) return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !/^card/i.test(key))
      .map(([key, v]) => [key, stripCardData(v)])
  );
}

export async function logGumroadEvent(
  supabase: SupabaseClient,
  fields: {
    payload: unknown;
    verification_result: string;
    match_result: string;
    gumroad_sale_id?: string;
    error_message?: string;
  }
) {
  const { error } = await supabase
    .from("gumroad_webhook_logs")
    .insert({ ...fields, payload: stripCardData(fields.payload) });
  if (error) console.error("Failed to write gumroad_webhook_logs row", error);
}

// Given an already-verified Gumroad sale (confirmed via the Gumroad API,
// never trusted from a raw, unauthenticated POST body), records it as a
// certification purchase (if the buyer's email matches an existing account)
// or as a pending purchase to reconcile later. Always logs the outcome.
// Returns false if the sale was already processed (idempotency short-circuit
// left to the caller, since the two callers check it differently).
export async function recordVerifiedSale(
  supabase: SupabaseClient,
  sale: GumroadSale,
  payload: unknown,
  logPrefix = ""
): Promise<void> {
  const { amountCents, currency, source: amountSource } = resolveSaleAmount(sale);
  // Diagnostic: keep what the API really returned next to the ping, so the
  // amount/currency mapping can be checked against reality after any sale.
  payload = {
    ...(typeof payload === "object" && payload !== null ? payload : {}),
    api_sale: sale,
    amount_source: amountSource,
  };

  if (sale.refunded || sale.disputed || sale.chargebacked) {
    await logGumroadEvent(supabase, {
      payload,
      verification_result: "verified",
      match_result: "not_processed",
      gumroad_sale_id: sale.id,
      error_message: `${logPrefix}Sale is refunded/disputed/chargebacked`,
    });
    return;
  }

  const certSlug = PERMALINK_TO_CERT_SLUG[sale.product_permalink];
  if (!certSlug) {
    await logGumroadEvent(supabase, {
      payload,
      verification_result: "verified",
      match_result: "error:unknown_product",
      gumroad_sale_id: sale.id,
      error_message: `${logPrefix}No certification mapped for permalink "${sale.product_permalink}"`,
    });
    return;
  }

  const { data: cert } = await supabase
    .from("certifications")
    .select("id")
    .eq("slug", certSlug)
    .single();

  if (!cert) {
    await logGumroadEvent(supabase, {
      payload,
      verification_result: "verified",
      match_result: "error:certification_not_found",
      gumroad_sale_id: sale.id,
      error_message: `${logPrefix}certifications row not found for slug "${certSlug}"`,
    });
    return;
  }

  const expiresAt = new Date(Date.now() + THREE_MONTHS_MS).toISOString();
  const email = sale.email.toLowerCase().trim();

  const { data: matchedProfile } = await supabase
    .from("profiles")
    .select("id")
    // Exact match: with ilike, "_" in the buyer's address is a wildcard and
    // could pick someone else's account. Profile e-mails are lower-cased.
    .eq("email", email)
    .maybeSingle();

  if (matchedProfile) {
    const { error } = await supabase.from("certification_purchases").insert({
      user_id: matchedProfile.id,
      certification_id: cert.id,
      source: "gumroad",
      gumroad_sale_id: sale.id,
      amount_cents: amountCents,
      currency,
      status: "paid",
      expires_at: expiresAt,
    });

    // 23505 = unique_violation on gumroad_sale_id: the sale was already
    // recorded (e.g. a race or a transient read failure upstream). The
    // access already exists, so this is a harmless duplicate, not a failure.
    const isDuplicate = error?.code === "23505";

    // Confirmation e-mail only for a sale that is genuinely new and recent:
    // not a duplicate, and not an old sale found by a full history sweep.
    const saleAgeMs = sale.created_at ? Date.now() - new Date(sale.created_at).getTime() : Infinity;
    if (!error && saleAgeMs < RECEIPT_MAX_SALE_AGE_MS) {
      await sendPurchaseReceipt(supabase, {
        userId: matchedProfile.id,
        certificationId: cert.id,
        amountCents,
        currency,
        expiresAt,
        purchasedAt: sale.created_at,
      });
    }

    await logGumroadEvent(supabase, {
      payload,
      verification_result: "verified",
      match_result: isDuplicate
        ? "duplicate"
        : error
          ? "error:insert_failed"
          : `matched:${matchedProfile.id}`,
      gumroad_sale_id: sale.id,
      error_message: isDuplicate ? undefined : error?.message,
    });
  } else {
    const { error } = await supabase.from("pending_gumroad_purchases").insert({
      email,
      certification_id: cert.id,
      gumroad_sale_id: sale.id,
      amount_cents: amountCents,
      currency,
      expires_at: expiresAt,
    });

    await logGumroadEvent(supabase, {
      payload,
      verification_result: "verified",
      match_result: error ? "error:pending_insert_failed" : "pending",
      gumroad_sale_id: sale.id,
      error_message: error?.message,
    });
  }
}

// True if this sale_id has already been turned into a real or pending
// purchase - guards both the webhook and the reconcile job against
// reprocessing the same sale.
export async function saleAlreadyProcessed(
  supabase: SupabaseClient,
  saleId: string
): Promise<boolean> {
  const [purchase, pending] = await Promise.all([
    supabase.from("certification_purchases").select("id").eq("gumroad_sale_id", saleId).maybeSingle(),
    supabase.from("pending_gumroad_purchases").select("id").eq("gumroad_sale_id", saleId).maybeSingle(),
  ]);
  // A failed read must not look like "not processed yet" - that would make
  // the caller try to insert a sale that already exists.
  if (purchase.error || pending.error) {
    throw new Error(`Idempotency check failed: ${(purchase.error ?? pending.error)!.message}`);
  }
  return Boolean(purchase.data || pending.data);
}

const RECONCILE_LOOKBACK_DAYS = 14;

interface GumroadSalesPage {
  success: boolean;
  sales: GumroadSale[];
  next_page_url?: string | null;
}

// full=true omits the "after" cutoff entirely, so Gumroad returns the
// buyer's complete sales history instead of just the recent window - used
// for the admin's manual "reconcile everything now" button.
async function fetchRecentSales(full = false): Promise<GumroadSale[]> {
  const accessToken = Deno.env.get("GUMROAD_ACCESS_TOKEN")!;
  const afterParam = full
    ? ""
    : `&after=${new Date(Date.now() - RECONCILE_LOOKBACK_DAYS * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10)}`; // Gumroad expects YYYY-MM-DD

  const sales: GumroadSale[] = [];
  let url: string | null = `https://api.gumroad.com/v2/sales?access_token=${accessToken}${afterParam}`;

  // Gumroad paginates via next_page_url; follow it until exhausted. Capped
  // to avoid a runaway loop if Gumroad's response shape ever changes.
  for (let page = 0; url && page < 50; page++) {
    const res = await fetch(url);
    const data = (await res.json()) as GumroadSalesPage;
    if (!data.success) break;
    sales.push(...data.sales);
    url = data.next_page_url ?? null;
  }

  return sales;
}

// Shared by the cron-triggered gumroad-reconcile and the admin "reconcile
// now" button - sweeps Gumroad sales and processes any that weren't already
// recorded (e.g. a lost webhook ping). The cron sweep only looks back
// RECONCILE_LOOKBACK_DAYS; the admin button passes full=true to sweep the
// entire sales history in one go.
export async function runReconcileSweep(
  supabase: SupabaseClient,
  logPrefix = "[reconcile] ",
  full = false
): Promise<{ total: number; processed: number; skipped: number }> {
  const sales = await fetchRecentSales(full);

  let processed = 0;
  let skipped = 0;

  for (const sale of sales) {
    if (await saleAlreadyProcessed(supabase, sale.id)) {
      skipped++;
      continue;
    }
    await recordVerifiedSale(supabase, sale, { reconcile: true, sale_id: sale.id }, logPrefix);
    processed++;
  }

  return { total: sales.length, processed, skipped };
}
