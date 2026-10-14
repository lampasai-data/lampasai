import { createServiceClient } from "../_shared/gumroadMatch.ts";
import { ADMIN_EMAIL, corsHeaders, jsonResponse, requireAdmin } from "../_shared/admin.ts";
import { logAdminAction } from "../_shared/audit.ts";

// Deletes inactive accounts picked in the admin Users table. Deleting an auth
// user cascades to its profile, answers, exam results and purchase rows, so
// this is permanent - and the rules below are the real safety net (the page
// only mirrors them):
//   * never the admin account;
//   * never an account with a paid or refunded purchase (a financial record
//     that would be erased with it);
//   * never an account with an access that is still active (voucher or paid).
// A dry run reports what would happen without touching anything; the real run
// needs `confirm: true` and re-checks every account itself.
const MAX_IDS = 100;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Reason = "not_found" | "admin" | "paid_purchase" | "active_access";

interface Verdict {
  id: string;
  deletable: boolean;
  reasons: Reason[];
  answers: number;
  exams: number;
  hadVoucher: boolean;
  accountCreatedAt: string | null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const supabase = createServiceClient();
  const auth = await requireAdmin(supabase, req);
  if ("response" in auth) return auth.response;

  const body = (await req.json()) as { ids?: unknown; dry_run?: boolean; confirm?: boolean };
  const ids = Array.isArray(body.ids) ? [...new Set(body.ids.map(String))] : [];
  if (ids.length === 0 || ids.length > MAX_IDS || !ids.every((id) => UUID.test(id))) {
    return jsonResponse({ error: `Provide between 1 and ${MAX_IDS} valid account ids` }, 400);
  }
  const dryRun = body.dry_run !== false; // anything but an explicit real run is a dry run
  if (!dryRun && body.confirm !== true) return jsonResponse({ error: "confirm is required" }, 400);

  const [profiles, purchases, attempts, exams] = await Promise.all([
    supabase.from("profiles").select("id, email, created_at").in("id", ids),
    supabase.from("certification_purchases").select("user_id, source, status, expires_at").in("user_id", ids),
    supabase.from("attempts").select("user_id").in("user_id", ids).limit(200000),
    supabase.from("exam_results").select("user_id").in("user_id", ids).limit(200000),
  ]);
  const failedRead = [profiles, purchases, attempts, exams].find((r) => r.error);
  if (failedRead?.error) return jsonResponse({ error: failedRead.error.message }, 500);

  const countBy = (rows: { user_id: string }[] | null) => {
    const m = new Map<string, number>();
    for (const r of rows ?? []) m.set(r.user_id, (m.get(r.user_id) ?? 0) + 1);
    return m;
  };
  const answersBy = countBy(attempts.data);
  const examsBy = countBy(exams.data);
  const now = Date.now();

  const verdicts: Verdict[] = ids.map((id) => {
    const profile = (profiles.data ?? []).find((p) => p.id === id);
    const own = (purchases.data ?? []).filter((p) => p.user_id === id);
    const reasons: Reason[] = [];
    if (!profile) reasons.push("not_found");
    else if ((profile.email ?? "").toLowerCase() === ADMIN_EMAIL) reasons.push("admin");
    if (own.some((p) => p.source !== "voucher")) reasons.push("paid_purchase");
    if (own.some((p) => p.status === "paid" && new Date(p.expires_at).getTime() > now)) reasons.push("active_access");
    return {
      id,
      deletable: reasons.length === 0,
      reasons,
      answers: answersBy.get(id) ?? 0,
      exams: examsBy.get(id) ?? 0,
      hadVoucher: own.some((p) => p.source === "voucher"),
      accountCreatedAt: profile?.created_at ?? null,
    };
  });

  if (dryRun) return jsonResponse({ dry_run: true, results: verdicts });

  const deleted: string[] = [];
  const failed: { id: string; error: string }[] = [];
  for (const v of verdicts.filter((x) => x.deletable)) {
    const { error } = await supabase.auth.admin.deleteUser(v.id);
    if (error) {
      failed.push({ id: v.id, error: error.message });
      continue;
    }
    deleted.push(v.id);
    // Their profile picture goes with them (a failure here only leaves an
    // unreferenced file behind).
    await supabase.storage.from("avatars").remove([`${v.id}/avatar.jpg`]);
    await supabase.from("admin_deleted_accounts").insert({
      user_id: v.id,
      account_created_at: v.accountCreatedAt,
      had_voucher: v.hadVoucher,
      answers: v.answers,
      exams: v.exams,
    });
  }

  // Ids only: no e-mail or name is kept for a deleted account.
  await logAdminAction(supabase, auth.user.email, {
    action: "accounts_deleted",
    targetType: "account",
    targetLabel: `${deleted.length} / ${verdicts.length}`,
    detail: {
      asked: verdicts.length,
      deleted: deleted.length,
      skipped: verdicts.filter((v) => !v.deletable).length,
      failed: failed.length,
      ids: deleted,
    },
  });

  return jsonResponse({
    dry_run: false,
    deleted,
    failed,
    skipped: verdicts.filter((v) => !v.deletable).map((v) => ({ id: v.id, reasons: v.reasons })),
  });
});
