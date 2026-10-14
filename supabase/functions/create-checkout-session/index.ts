import Stripe from "npm:stripe@22";
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/admin.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2026-06-24.dahlia",
});

// Fallback only: the price comes from certification_prices (edited in the admin).
const DEFAULT_PRICE_CENTS = 499;

function randomSuffix() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  return Array.from({ length: 8 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join(
    ""
  );
}

const OWN_SITE_HOSTS = new Set(["lampasai.com", "www.lampasai.com", "localhost", "127.0.0.1"]);

function isOwnSiteUrl(value: unknown): boolean {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    if (!OWN_SITE_HOSTS.has(url.hostname)) return false;
    return url.protocol === "https:" || url.hostname === "localhost" || url.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const jwt = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(jwt);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { certificationIds, successUrl, cancelUrl } = await req.json();
    // Stripe sends the buyer to these addresses: only our own site, so a
    // checkout link cannot be crafted to land on someone else's page.
    if (!isOwnSiteUrl(successUrl) || !isOwnSiteUrl(cancelUrl)) {
      return new Response(JSON.stringify({ error: "Invalid return url" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!Array.isArray(certificationIds) || certificationIds.length === 0) {
      return new Response(JSON.stringify({ error: "certificationIds is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: certifications, error: certsError } = await supabase
      .from("certifications")
      .select("id, name")
      .in("id", certificationIds);

    if (certsError || !certifications || certifications.length !== certificationIds.length) {
      return new Response(JSON.stringify({ error: "Invalid certification ids" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: priceRows } = await supabase
      .from("certification_prices")
      .select("certification_id, price_cents")
      .in("certification_id", certificationIds);
    const priceOf = (id: string) =>
      priceRows?.find((r) => r.certification_id === id)?.price_cents ?? DEFAULT_PRICE_CENTS;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // Restrict to Card + Klarna (+ Apple Pay, which rides along with "card").
      // Without this, Stripe auto-enables every method configured on the
      // account (Bancontact, MB WAY, Link, Amazon Pay, ...).
      payment_method_types: ["card", "klarna", "paypal"],
      integration_identifier: `lampasai-cert-${randomSuffix()}`,
      // This account has Stripe Managed Payments enabled by default, which
      // requires a tax code per product unless explicitly disabled here.
      managed_payments: { enabled: false },
      line_items: certifications.map((c) => ({
        price_data: {
          currency: "eur",
          product_data: { name: `${c.name} - accès illimité 3 mois` },
          unit_amount: priceOf(c.id),
        },
        quantity: 1,
      })),
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        certification_ids: JSON.stringify(certificationIds),
        // What each line was charged, for the webhook to record as-is.
        price_cents: JSON.stringify(Object.fromEntries(certificationIds.map((id: string) => [id, priceOf(id)]))),
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
