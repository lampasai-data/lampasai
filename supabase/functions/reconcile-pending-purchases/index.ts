import { createServiceClient, logGumroadEvent } from "../_shared/gumroadMatch.ts";

// Called by the frontend right after every login AND every signup (both fire
// a Supabase auth session), so a Gumroad purchase made with a different-but-
// now-matching email, or made before the account even existed, gets applied
// as soon as the corresponding account is available - not just at signup.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createServiceClient();
  const jwt = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(jwt);

  if (userError || !user || !user.email) {
    return new Response(JSON.stringify({ error: "Invalid session" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const email = user.email.toLowerCase().trim();

  const { data: pendingRows, error: pendingError } = await supabase
    .from("pending_gumroad_purchases")
    .select("id, certification_id, gumroad_sale_id, amount_cents, expires_at")
    .ilike("email", email)
    .is("resolved_at", null);

  if (pendingError) {
    return new Response(JSON.stringify({ error: pendingError.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let reconciled = 0;

  for (const row of pendingRows ?? []) {
    const { error: insertError } = await supabase.from("certification_purchases").insert({
      user_id: user.id,
      certification_id: row.certification_id,
      source: "gumroad",
      gumroad_sale_id: row.gumroad_sale_id,
      amount_cents: row.amount_cents,
      status: "paid",
      expires_at: row.expires_at,
    });

    // A unique-constraint conflict on gumroad_sale_id means this sale was
    // already reconciled by a concurrent call - not a real failure.
    const alreadyExists = insertError?.code === "23505";

    if (insertError && !alreadyExists) {
      await logGumroadEvent(supabase, {
        payload: { reconcile_login: true, user_id: user.id, email },
        verification_result: "reconcile-login",
        match_result: "error:insert_failed",
        gumroad_sale_id: row.gumroad_sale_id,
        error_message: insertError.message,
      });
      continue;
    }

    await supabase
      .from("pending_gumroad_purchases")
      .update({ resolved_at: new Date().toISOString(), resolved_user_id: user.id })
      .eq("id", row.id);

    await logGumroadEvent(supabase, {
      payload: { reconcile_login: true, user_id: user.id, email },
      verification_result: "reconcile-login",
      match_result: `matched:${user.id}`,
      gumroad_sale_id: row.gumroad_sale_id,
    });

    if (!alreadyExists) reconciled++;
  }

  return new Response(JSON.stringify({ reconciled }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
