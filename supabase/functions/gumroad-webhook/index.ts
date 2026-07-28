import {
  createServiceClient,
  logGumroadEvent,
  recordVerifiedSale,
  saleAlreadyProcessed,
  type GumroadSale,
} from "../_shared/gumroadMatch.ts";

interface GumroadSaleVerification {
  success: boolean;
  sale?: GumroadSale;
}

async function verifySale(saleId: string): Promise<GumroadSaleVerification> {
  const accessToken = Deno.env.get("GUMROAD_ACCESS_TOKEN")!;
  const res = await fetch(
    `https://api.gumroad.com/v2/sales/${encodeURIComponent(saleId)}?access_token=${accessToken}`
  );
  return (await res.json()) as GumroadSaleVerification;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const supabase = createServiceClient();

  // Gumroad pings are application/x-www-form-urlencoded, not JSON.
  const form = await req.formData();
  const payload = Object.fromEntries(form.entries());
  const saleId = payload.sale_id as string | undefined;

  if (!saleId) {
    await logGumroadEvent(supabase, {
      payload,
      verification_result: "skipped",
      match_result: "error:missing_sale_id",
      error_message: "Ping payload had no sale_id",
    });
    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Idempotency: Gumroad can resend the same ping.
  if (await saleAlreadyProcessed(supabase, saleId)) {
    await logGumroadEvent(supabase, {
      payload,
      verification_result: "skipped",
      match_result: "duplicate",
      gumroad_sale_id: saleId,
    });
    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Gumroad pings aren't cryptographically signed, so the raw POST body
  // can't be trusted on its own - call back the Gumroad API with our
  // access token to confirm the sale is real before granting anything.
  let verification: GumroadSaleVerification;
  try {
    verification = await verifySale(saleId);
  } catch (err) {
    await logGumroadEvent(supabase, {
      payload,
      verification_result: "error",
      match_result: "not_processed",
      gumroad_sale_id: saleId,
      error_message: `Gumroad API call failed: ${String(err)}`,
    });
    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!verification.success || !verification.sale) {
    await logGumroadEvent(supabase, {
      payload,
      verification_result: "failed",
      match_result: "not_processed",
      gumroad_sale_id: saleId,
      error_message: "Gumroad API returned success:false for this sale_id",
    });
    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  await recordVerifiedSale(supabase, verification.sale, payload);

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
