import { createServiceClient } from "../_shared/gumroadMatch.ts";
import { ADMIN_EMAIL, corsHeaders, jsonResponse } from "../_shared/admin.ts";
import { logAdminAction } from "../_shared/audit.ts";

// A signed-in person deletes THEIR OWN account (profile page). Deleting the
// auth user cascades to the profile, answers, exam results and purchase rows,
// so it is permanent; the typed confirmation word is checked here, not only in
// the page. Only the caller's own account can be targeted: the id comes from
// the verified JWT, never from the request body. The admin account is refused.
//
// What is kept: a minimal trace with no personal data (admin_deleted_accounts:
// ids, counts, dates) and a line in the admin journal. No e-mail, no name.
const CONFIRM_WORDS = ["SUPPRIMER", "DELETE"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const supabase = createServiceClient();

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return jsonResponse({ error: "Missing Authorization header" }, 401);
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
  if (userError || !user) return jsonResponse({ error: "Unauthorized" }, 401);
  if (user.email?.toLowerCase() === ADMIN_EMAIL) return jsonResponse({ error: "admin_account" }, 403);

  let confirm = "";
  try {
    confirm = String((await req.json())?.confirm ?? "");
  } catch {
    // no body: refused below
  }
  if (!CONFIRM_WORDS.includes(confirm)) return jsonResponse({ error: "confirmation_required" }, 400);

  const [attempts, exams, purchases, profile] = await Promise.all([
    supabase.from("attempts").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("exam_results").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("certification_purchases").select("source, status").eq("user_id", user.id),
    supabase.from("profiles").select("created_at").eq("id", user.id).maybeSingle(),
  ]);
  const own = purchases.data ?? [];

  const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
  if (deleteError) return jsonResponse({ error: "delete_failed" }, 500);

  await supabase.from("admin_deleted_accounts").insert({
    user_id: user.id,
    account_created_at: profile.data?.created_at ?? null,
    had_voucher: own.some((p) => p.source === "voucher"),
    answers: attempts.count ?? 0,
    exams: exams.count ?? 0,
  });
  await supabase.storage.from("avatars").remove([`${user.id}/avatar.jpg`]);
  await logAdminAction(supabase, "user", {
    action: "account_self_deleted",
    targetType: "account",
    targetId: user.id,
    detail: {
      answers: attempts.count ?? 0,
      exams: exams.count ?? 0,
      had_paid_purchase: own.some((p) => p.source !== "voucher"),
    },
  });

  return jsonResponse({ ok: true });
});
