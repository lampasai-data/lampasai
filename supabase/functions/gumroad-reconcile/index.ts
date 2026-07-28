import { createServiceClient, logGumroadEvent, runReconcileSweep } from "../_shared/gumroadMatch.ts";

// Safety-net sweep over recent Gumroad sales, in case a webhook ping never
// arrived (Gumroad delivery failure, function cold-start error, etc.).
// Triggered on a schedule (pg_cron -> pg_net), authenticated with a shared
// secret since it isn't a Supabase-JWT-protected call. For an admin-
// triggered "reconcile now" button, see admin-trigger-reconcile instead.
Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const secret = req.headers.get("X-Reconcile-Secret");
  if (!secret || secret !== Deno.env.get("GUMROAD_RECONCILE_SECRET")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createServiceClient();

  let result: { total: number; processed: number; skipped: number };
  try {
    result = await runReconcileSweep(supabase);
  } catch (err) {
    console.error("Failed to fetch Gumroad sales", err);
    return new Response(JSON.stringify({ error: "Failed to fetch Gumroad sales" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  await logGumroadEvent(supabase, {
    payload: { reconcile_run: true, total_sales_seen: result.total },
    verification_result: "reconcile",
    match_result: `processed:${result.processed},skipped:${result.skipped}`,
  });

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
  });
});
