import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

export const ADMIN_EMAIL = "mbairo.allatessem@gmail.com";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Verifies the request's Bearer JWT belongs to the hardcoded admin account.
// Returns the authenticated admin user on success, or a Response to return
// immediately if the check failed (missing header / invalid session / not
// the admin) - callers do `if ("response" in auth) return auth.response;`.
export async function requireAdmin(
  supabase: SupabaseClient,
  req: Request
): Promise<{ user: { id: string; email: string } } | { response: Response }> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return { response: jsonResponse({ error: "Missing Authorization header" }, 401) };
  }

  const jwt = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(jwt);

  if (error || !user || user.email?.toLowerCase() !== ADMIN_EMAIL) {
    return { response: jsonResponse({ error: "Forbidden" }, 403) };
  }

  return { user: { id: user.id, email: user.email! } };
}
