// Sign in with Google without going through the Supabase project's own domain.
//
// The browser is sent to Google's regular full-page account chooser (the wide
// desktop one) with `redirect_uri` set to this site, so the page reads
// "Accéder à l'application lampasai.com". Google sends the person back here
// with an ID token in the URL fragment, which is handed to Supabase
// (signInWithIdToken). No pop-up, no Google script, no server of ours involved.
//
// Needs, in the Google Cloud web client: this site's root as an authorized
// redirect URI (https://lampasai.com/ and http://localhost:5173/).
import { supabase } from "./supabase";

// Public identifier, not a secret: the web client Supabase's Google provider uses.
export const GOOGLE_WEB_CLIENT_ID =
  "25529673636-33uke9nfpf9g21li3opvr7u67oiib78q.apps.googleusercontent.com";

const FLOW_KEY = "lampasai_google_flow";
// Marks a callback that already failed once, so a failure falls back to the
// Supabase redirect a single time instead of looping.
const FALLBACK_KEY = "lampasai_google_fallback";

interface Flow {
  state: string;
  nonce: string; // raw; Google gets its SHA-256
  path: string;
}

const hex = (bytes: Uint8Array) => Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

async function sha256Hex(value: string) {
  return hex(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value))));
}

export async function startGoogleSignIn(): Promise<void> {
  const flow: Flow = {
    state: hex(crypto.getRandomValues(new Uint8Array(16))),
    nonce: hex(crypto.getRandomValues(new Uint8Array(32))),
    path: window.location.pathname + window.location.search,
  };
  sessionStorage.setItem(FLOW_KEY, JSON.stringify(flow));
  const params = new URLSearchParams({
    client_id: GOOGLE_WEB_CLIENT_ID,
    redirect_uri: window.location.origin + "/",
    response_type: "id_token",
    scope: "openid email profile",
    nonce: await sha256Hex(flow.nonce),
    state: flow.state,
    prompt: "select_account",
  });
  window.location.assign(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}

/**
 * On every page load: if Google just sent the person back with an ID token,
 * finish the sign-in. Returns the path to go back to (null when this load is
 * not a Google callback). `onFailure` is called when the exchange fails.
 */
export async function completeGoogleSignIn(onFailure: () => void): Promise<string | null> {
  const hash = window.location.hash;
  if (!hash.includes("id_token=") && !hash.includes("error=")) return null;
  const params = new URLSearchParams(hash.slice(1));
  const raw = sessionStorage.getItem(FLOW_KEY);
  // Strip the token from the address bar whatever happens next.
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
  if (!raw || !supabase) return null;
  sessionStorage.removeItem(FLOW_KEY);
  const flow = JSON.parse(raw) as Flow;

  const idToken = params.get("id_token");
  if (!idToken || params.get("state") !== flow.state) {
    // Cancelled on Google's page, or a callback this browser did not start.
    return params.get("error") ? flow.path : null;
  }
  const { error } = await supabase.auth.signInWithIdToken({ provider: "google", token: idToken, nonce: flow.nonce });
  if (error) {
    console.error("Google ID-token sign-in failed", error);
    onFailure();
  }
  return flow.path;
}

export const googleFallbackUsed = () => sessionStorage.getItem(FALLBACK_KEY) === "1";
export const markGoogleFallbackUsed = () => sessionStorage.setItem(FALLBACK_KEY, "1");
export const clearGoogleFallback = () => sessionStorage.removeItem(FALLBACK_KEY);
