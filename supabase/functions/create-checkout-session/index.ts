import Stripe from "npm:stripe@22";
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/admin.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2026-06-24.dahlia",
});

const CERT_PRICE_CENTS = 499; // 4,99 €, matches src/i18n.tsx t.formations.offerPrice

function randomSuffix() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  return Array.from({ length: 8 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join(
    ""
  );
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
          unit_amount: CERT_PRICE_CENTS,
        },
        quantity: 1,
      })),
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        certification_ids: JSON.stringify(certificationIds),
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
