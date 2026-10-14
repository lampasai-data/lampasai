import { createServiceClient, logGumroadEvent, runReconcileSweep } from "../_shared/gumroadMatch.ts";
import { corsHeaders, jsonResponse, requireAdmin } from "../_shared/admin.ts";
import { logAdminAction } from "../_shared/audit.ts";

// Lets the admin force an immediate Gumroad sales sweep from /admin/gumroad
// instead of waiting for the 6h cron. Same sweep logic as gumroad-reconcile,
// just authenticated with the admin's Supabase JWT instead of the cron's
// shared secret.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createServiceClient();
  const auth = await requireAdmin(supabase, req);
  if ("response" in auth) return auth.response;

  let result: { total: number; processed: number; skipped: number };
  try {
    result = await runReconcileSweep(supabase, "[admin-triggered] ", true);
  } catch (err) {
    console.error("Failed to fetch Gumroad sales", err);
    return jsonResponse({ error: "Failed to fetch Gumroad sales" }, 502);
  }

  // Same rule as the cron sweep: log only when something was really recorded.
  // The admin already gets the counts back in the response.
  if (result.processed > 0) {
    await logGumroadEvent(supabase, {
      payload: { reconcile_run: true, triggered_by: "admin", total_sales_seen: result.total },
      verification_result: "reconcile-admin",
      match_result: `processed:${result.processed},skipped:${result.skipped}`,
    });
  }

  await logAdminAction(supabase, auth.user.email, {
    action: "gumroad_reconcile",
    targetType: "gumroad",
    detail: { total: result.total, processed: result.processed, skipped: result.skipped },
  });

  return jsonResponse(result);
});
