import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/admin.ts";

// Called right after a Google sign-in turns out to have auto-created a
// brand-new account when the user actually intended to log into an existing
// one (see AuthContext.tsx). Deletes that just-created orphan account so the
// user can be told "no account found, sign up first" instead of silently
// landing in a blank new account. Mirrors the pattern used in the Wonjo app.

// Only ever delete accounts created within this window - an extra
// server-side guardrail so a misuse or bug in the caller can never reach an
// established account, even though the caller can only ever act on their
// own token.
const MAX_ACCOUNT_AGE_MS = 60_000;

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

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const jwt = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(jwt);

  if (userError || !user) {
    return new Response(JSON.stringify({ error: "Invalid session" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const isGoogleAccount = user.app_metadata?.provider === "google";
  const ageMs = Date.now() - new Date(user.created_at).getTime();

  if (!isGoogleAccount || ageMs > MAX_ACCOUNT_AGE_MS) {
    return new Response(
      JSON.stringify({ error: "Refusing to delete: not a fresh Google account" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
  if (deleteError) {
    return new Response(JSON.stringify({ error: deleteError.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
