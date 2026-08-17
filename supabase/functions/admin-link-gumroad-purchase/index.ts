import { createServiceClient, logGumroadEvent } from "../_shared/gumroadMatch.ts";
import { ADMIN_EMAIL, corsHeaders, jsonResponse, requireAdmin } from "../_shared/admin.ts";

// Manual catch-up: links a pending_gumroad_purchases row to an existing
// account by email, for the cases the automatic email match never resolves
// (typo'd email at checkout, a different address than the account, etc.).
// Restricted to a single hardcoded admin account - mirrors the RLS policies
// on pending_gumroad_purchases / gumroad_webhook_logs.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createServiceClient();
  const auth = await requireAdmin(supabase, req);
  if ("response" in auth) return auth.response;

  const { pendingPurchaseId, targetEmail } = await req.json();
  if (!pendingPurchaseId || !targetEmail) {
    return jsonResponse({ error: "pendingPurchaseId and targetEmail are required" }, 400);
  }

  const { data: pending, error: pendingError } = await supabase
    .from("pending_gumroad_purchases")
    .select("id, certification_id, gumroad_sale_id, amount_cents, expires_at, resolved_at")
    .eq("id", pendingPurchaseId)
    .single();

  if (pendingError || !pending) {
    return jsonResponse({ error: "Pending purchase not found" }, 404);
  }
  if (pending.resolved_at) {
    return jsonResponse({ error: "Already resolved" }, 409);
  }

  const { data: matchedProfile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .ilike("email", targetEmail.toLowerCase().trim())
    .maybeSingle();

  if (profileError || !matchedProfile) {
    return jsonResponse({ error: "No account found for that email" }, 404);
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
    return jsonResponse({ error: insertError.message }, 500);
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

  return jsonResponse({ success: true });
});
