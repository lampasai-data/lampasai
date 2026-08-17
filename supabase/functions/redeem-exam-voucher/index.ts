import { createServiceClient } from "../_shared/gumroadMatch.ts";
import { corsHeaders } from "../_shared/admin.ts";

const ERROR_MESSAGES: Record<string, string> = {
  not_found: "Code invalide.",
  expired: "Ce code a expiré.",
  exhausted: "Ce code a atteint son nombre maximal d'utilisations.",
  already_redeemed_by_user: "Tu as déjà utilisé ce code.",
  wrong_certification: "Ce code ne correspond pas à la certification sélectionnée.",
};

// Redeems an exam voucher for the calling (authenticated) user. The
// claim_exam_voucher Postgres function does everything atomically in one
// transaction: claims a slot on the code (single-use or multi-use), checks
// expiry/certification match/prior redemption, and grants 30 days of
// exam-mode access via a certification_purchases row (source='voucher',
// pdf_allowed=false - no PDF export, unlike a real purchase). Either the
// whole redemption succeeds or none of it is committed.
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

  if (userError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { code, certificationId } = await req.json();
  const normalizedCode = typeof code === "string" ? code.trim().toUpperCase() : "";
  if (!normalizedCode) {
    return new Response(JSON.stringify({ error: "code is required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: claimRows, error: claimError } = await supabase.rpc("claim_exam_voucher", {
    p_code: normalizedCode,
    p_user_id: user.id,
    p_certification_id: certificationId ?? null,
  });

  if (claimError) {
    return new Response(JSON.stringify({ error: claimError.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const claim = claimRows?.[0];
  if (!claim || claim.error_code) {
    const message = ERROR_MESSAGES[claim?.error_code ?? "not_found"] ?? "Code invalide.";
    return new Response(JSON.stringify({ error: message }), {
      status: 409,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({ certificationId: claim.certification_id, expiresAt: claim.expires_at }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
