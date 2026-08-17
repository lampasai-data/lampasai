import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";

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
  refunded: boolean;
  disputed: boolean;
  chargebacked: boolean;
}

export function createServiceClient(): SupabaseClient {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
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
  const { error } = await supabase.from("gumroad_webhook_logs").insert(fields);
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
    .ilike("email", email)
    .maybeSingle();

  if (matchedProfile) {
    const { error } = await supabase.from("certification_purchases").insert({
      user_id: matchedProfile.id,
      certification_id: cert.id,
      source: "gumroad",
      gumroad_sale_id: sale.id,
      amount_cents: sale.price,
      status: "paid",
      expires_at: expiresAt,
    });

    await logGumroadEvent(supabase, {
      payload,
      verification_result: "verified",
      match_result: error ? "error:insert_failed" : `matched:${matchedProfile.id}`,
      gumroad_sale_id: sale.id,
      error_message: error?.message,
    });
  } else {
    const { error } = await supabase.from("pending_gumroad_purchases").insert({
      email,
      certification_id: cert.id,
      gumroad_sale_id: sale.id,
      amount_cents: sale.price,
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
  const [{ data: existingPurchase }, { data: existingPending }] = await Promise.all([
    supabase.from("certification_purchases").select("id").eq("gumroad_sale_id", saleId).maybeSingle(),
    supabase.from("pending_gumroad_purchases").select("id").eq("gumroad_sale_id", saleId).maybeSingle(),
  ]);
  return Boolean(existingPurchase || existingPending);
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
