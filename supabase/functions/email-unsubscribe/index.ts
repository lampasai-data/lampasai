import { createServiceClient } from "../_shared/gumroadMatch.ts";
import { corsHeaders, jsonResponse } from "../_shared/admin.ts";
import { isValidToken } from "../_shared/unsubscribe.ts";

// "Stop receiving our offers" for promotional e-mails. No JWT (the click comes
// from a mailbox): the signed token is the authorisation. Called either by the
// site's /unsubscribe page (JSON body {u, t}) or directly by mail clients
// through the List-Unsubscribe header (POST with u and t in the query string).
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const url = new URL(req.url);
  let u = url.searchParams.get("u") ?? "";
  let t = url.searchParams.get("t") ?? "";
  if (!u || !t) {
    try {
      const body = await req.json();
      u = String(body?.u ?? "");
      t = String(body?.t ?? "");
    } catch {
      // not JSON (one-click form post): the query string already had what it had
    }
  }

  if (!UUID.test(u) || !t || !(await isValidToken(u, t))) {
    return jsonResponse({ error: "invalid_link" }, 400);
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("email_unsubscribes")
    .upsert({ user_id: u }, { onConflict: "user_id", ignoreDuplicates: true });
  if (error) return jsonResponse({ error: "failed" }, 500);

  return jsonResponse({ ok: true });
});
