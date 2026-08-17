import { createServiceClient } from "../_shared/gumroadMatch.ts";
import { generateVoucherCode } from "../_shared/examVouchers.ts";
import { ADMIN_EMAIL, corsHeaders, jsonResponse, requireAdmin } from "../_shared/admin.ts";

// Admin-only: generates a voucher code (single-use by default, or
// redeemable by several users via maxRedemptions) that later unlocks exam
// mode for one certification (via redeem-exam-voucher), without granting
// PDF export. Restricted to the hardcoded admin account, same as the other
// admin Edge Functions.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createServiceClient();
  const auth = await requireAdmin(supabase, req);
  if ("response" in auth) return auth.response;

  const { certificationId, expiresAt, maxRedemptions } = await req.json();
  if (!certificationId) {
    return jsonResponse({ error: "certificationId is required" }, 400);
  }
  const normalizedMaxRedemptions =
    typeof maxRedemptions === "number" && Number.isInteger(maxRedemptions) && maxRedemptions > 0
      ? maxRedemptions
      : 1;

  const { data: cert } = await supabase
    .from("certifications")
    .select("id")
    .eq("id", certificationId)
    .maybeSingle();

  if (!cert) {
    return jsonResponse({ error: "Certification not found" }, 404);
  }

  // Retry on the (astronomically unlikely) chance of a code collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateVoucherCode();
    const { data, error } = await supabase
      .from("exam_vouchers")
      .insert({
        code,
        certification_id: certificationId,
        created_by: ADMIN_EMAIL,
        expires_at: expiresAt ?? null,
        max_redemptions: normalizedMaxRedemptions,
      })
      .select("id, code, certification_id, expires_at, created_at, max_redemptions")
      .single();

    if (!error) {
      return jsonResponse({ voucher: data });
    }
    if (!error.message.includes("duplicate")) {
      return jsonResponse({ error: error.message }, 500);
    }
  }

  return jsonResponse({ error: "Could not generate a unique code, try again" }, 500);
});
