import Stripe from "npm:stripe@22";
import { createClient } from "npm:@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2026-06-24.dahlia",
});
const cryptoProvider = Stripe.createSubtleCryptoProvider();

const CERT_PRICE_CENTS = 499;
const THREE_MONTHS_MS = 1000 * 60 * 60 * 24 * 30 * 3;

Deno.serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");
  const body = await req.text();

  if (!signature) {
    return new Response("Missing Stripe-Signature header", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!,
      undefined,
      cryptoProvider
    );
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    const certificationIds = session.metadata?.certification_ids
      ? (JSON.parse(session.metadata.certification_ids) as string[])
      : [];

    if (userId && certificationIds.length > 0) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const expiresAt = new Date(Date.now() + THREE_MONTHS_MS).toISOString();

      const { error } = await supabase.from("certification_purchases").upsert(
        certificationIds.map((certificationId) => ({
          user_id: userId,
          certification_id: certificationId,
          stripe_checkout_session_id: session.id,
          amount_cents: CERT_PRICE_CENTS,
          status: "paid",
          expires_at: expiresAt,
        })),
        { onConflict: "user_id,certification_id,stripe_checkout_session_id" }
      );

      if (error) console.error("Failed to record purchase", error);
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
