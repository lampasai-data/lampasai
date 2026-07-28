import { createServiceClient, logGumroadEvent, runReconcileSweep } from "../_shared/gumroadMatch.ts";

// Lets the admin force an immediate Gumroad sales sweep from /admin/gumroad
// instead of waiting for the 6h cron. Same sweep logic as gumroad-reconcile,
// just authenticated with the admin's Supabase JWT instead of the cron's
// shared secret.
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

  let result: { total: number; processed: number; skipped: number };
  try {
    result = await runReconcileSweep(supabase, "[admin-triggered] ");
  } catch (err) {
    console.error("Failed to fetch Gumroad sales", err);
    return new Response(JSON.stringify({ error: "Failed to fetch Gumroad sales" }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  await logGumroadEvent(supabase, {
    payload: { reconcile_run: true, triggered_by: "admin", total_sales_seen: result.total },
    verification_result: "reconcile-admin",
    match_result: `processed:${result.processed},skipped:${result.skipped}`,
  });

  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
