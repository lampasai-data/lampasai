import { createServiceClient, logGumroadEvent } from "../_shared/gumroadMatch.ts";

// Manual catch-up: links a pending_gumroad_purchases row to an existing
// account by email, for the cases the automatic email match never resolves
// (typo'd email at checkout, a different address than the account, etc.).
// Restricted to a single hardcoded admin account - mirrors the RLS policies
// on pending_gumroad_purchases / gumroad_webhook_logs.
const ADMIN_EMAIL = "mbairo.allatessem@gmail.com";

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

  if (userError || !user || user.email?.toLowerCase() !== ADMIN_EMAIL) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { pendingPurchaseId, targetEmail } = await req.json();
  if (!pendingPurchaseId || !targetEmail) {
    return new Response(
      JSON.stringify({ error: "pendingPurchaseId and targetEmail are required" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const { data: pending, error: pendingError } = await supabase
    .from("pending_gumroad_purchases")
    .select("id, certification_id, gumroad_sale_id, amount_cents, expires_at, resolved_at")
    .eq("id", pendingPurchaseId)
    .single();

  if (pendingError || !pending) {
    return new Response(JSON.stringify({ error: "Pending purchase not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (pending.resolved_at) {
    return new Response(JSON.stringify({ error: "Already resolved" }), {
      status: 409,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: matchedProfile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .ilike("email", targetEmail.toLowerCase().trim())
    .maybeSingle();

  if (profileError || !matchedProfile) {
    return new Response(JSON.stringify({ error: "No account found for that email" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { error: insertError } = await supabase.from("certification_purchases").insert({
    user_id: matchedProfile.id,
    certification_id: pending.certification_id,
    source: "gumroad",
    gumroad_sale_id: pending.gumroad_sale_id,
    amount_cents: pending.amount_cents,
    status: "paid",
    expires_at: pending.expires_at,
  });

  if (insertError) {
    await logGumroadEvent(supabase, {
      payload: { admin_manual_link: true, admin_email: ADMIN_EMAIL, target_email: targetEmail },
      verification_result: "admin-manual-link",
      match_result: "error:insert_failed",
      gumroad_sale_id: pending.gumroad_sale_id,
      error_message: insertError.message,
    });
    return new Response(JSON.stringify({ error: insertError.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  await supabase
    .from("pending_gumroad_purchases")
    .update({ resolved_at: new Date().toISOString(), resolved_user_id: matchedProfile.id })
    .eq("id", pending.id);

  await logGumroadEvent(supabase, {
    payload: { admin_manual_link: true, admin_email: ADMIN_EMAIL, target_email: targetEmail },
    verification_result: "admin-manual-link",
    match_result: `matched:${matchedProfile.id}`,
    gumroad_sale_id: pending.gumroad_sale_id,
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
