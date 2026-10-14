// Signed unsubscribe links for promotional e-mails. The token is an
// HMAC-SHA256 of the user id: the link works without logging in (unsubscribing
// has to be easy) but nobody can unsubscribe someone else by guessing an id.
// The HMAC key is the project's service role key - server-side only, so no
// extra secret has to be provisioned.
async function sign(userId: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(userId));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Link in the mail body: opens a small page on the site that asks for a
// confirmation (so link scanners cannot unsubscribe anyone by prefetching).
export async function unsubscribePageUrl(siteUrl: string, userId: string): Promise<string> {
  return `${siteUrl}/unsubscribe?u=${userId}&t=${await sign(userId)}`;
}

// URL for the List-Unsubscribe header (RFC 8058 one-click POST).
export async function unsubscribeApiUrl(supabaseUrl: string, userId: string): Promise<string> {
  return `${supabaseUrl}/functions/v1/email-unsubscribe?u=${userId}&t=${await sign(userId)}`;
}

export async function isValidToken(userId: string, token: string): Promise<boolean> {
  const expected = await sign(userId);
  if (expected.length !== token.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  return diff === 0;
}
