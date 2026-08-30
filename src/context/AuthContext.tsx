import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { mapAuthError, validatePassword } from "../lib/authErrors";
import { useLanguage } from "../i18n";

const PENDING_UPGRADE_KEY = "lampasai_pending_upgrade_slug";
export const HAS_LOGGED_IN_KEY = "lampasai_has_logged_in_before";

// Google OAuth always creates the account server-side before we get a
// chance to react (the redirect already comes back with a live session).
// We can't stop that first step, but we can undo it: this remembers whether
// the click happened from "Connexion" or "Inscription" across the full-page
// OAuth redirect, so a sign-in attempt that turns out to have just created a
// brand-new account can be reverted (delete-orphan-oauth-user) and reported
// as "no account found, sign up first" instead of silently letting the user
// into an empty new account. Same pattern as the Wonjo app.
const GOOGLE_AUTH_INTENT_KEY = "lampasai_google_auth_intent";

export function markGoogleAuthIntent(mode: "signin" | "signup") {
  sessionStorage.setItem(GOOGLE_AUTH_INTENT_KEY, mode);
}

interface Profile {
  id: string;
  email: string | null;
  first_name: string | null;
  plan: "free" | "pro";
  free_questions_used: number;
}

interface AuthState {
  ready: boolean;
  user: User | null;
  profile: Profile | null;
  passwordRecovery: boolean;
  authModalOpen: boolean;
  openAuthModal: () => void;
  openAuthModalForUpgrade: (preselectSlug: string) => void;
  closeAuthModal: () => void;
  upgradeModalOpen: boolean;
  upgradeModalPreselect: string | null;
  upgradeModalOpenVoucher: boolean;
  openUpgradeModal: (preselectSlug?: string, openVoucher?: boolean) => void;
  closeUpgradeModal: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<string | null>;
  signUpWithEmail: (email: string, password: string, firstName?: string) => Promise<string | null>;
  sendPasswordReset: (email: string) => Promise<string | null>;
  updatePassword: (password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  googleAccountNotFound: boolean;
  dismissGoogleAccountNotFound: () => void;
  googleAccountAlreadyExists: boolean;
  dismissGoogleAccountAlreadyExists: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { lang, t } = useLanguage();
  const [ready, setReady] = useState(!isSupabaseConfigured);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeModalPreselect, setUpgradeModalPreselect] = useState<string | null>(null);
  const [upgradeModalOpenVoucher, setUpgradeModalOpenVoucher] = useState(false);
  const [googleAccountNotFound, setGoogleAccountNotFound] = useState(false);
  const [googleAccountAlreadyExists, setGoogleAccountAlreadyExists] = useState(false);
  // Supabase fires the session change more than once for a single sign-in
  // (getSession() resolving separately from onAuthStateChange, sometimes an
  // extra INITIAL_SESSION event) - each firing re-runs the effect below with
  // a new session object. Without this guard, a second firing can read the
  // Google-auth-intent flag as already consumed and fall through to the
  // "normal login" branch while the first firing's async block-and-sign-out
  // is still in flight, racing it and silently letting the user in.
  const handledSessionUserIdRef = useRef<string | null>(null);

  async function loadProfile(userId: string) {
    if (!supabase) return;
    const { data } = await supabase
      .from("profiles")
      .select("id, email, first_name, plan, free_questions_used")
      .eq("id", userId)
      .single();
    if (data) setProfile(data as Profile);
  }

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
      if (data.session) loadProfile(data.session.user.id);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        if (newSession) loadProfile(newSession.user.id);
        else setProfile(null);
        // Supabase parses the recovery link's URL fragment automatically and
        // fires this event - used to route the user to a "set new password" screen.
        if (event === "PASSWORD_RECOVERY") setPasswordRecovery(true);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session || !supabase) {
      // Reset on sign-out so a later, genuinely new sign-in by the same
      // user isn't mistaken for a re-fire of the previous one.
      handledSessionUserIdRef.current = null;
      return;
    }

    if (handledSessionUserIdRef.current === session.user.id) return;
    handledSessionUserIdRef.current = session.user.id;

    const storedAuthIntent = sessionStorage.getItem(GOOGLE_AUTH_INTENT_KEY);
    sessionStorage.removeItem(GOOGLE_AUTH_INTENT_KEY);
    // Only ever act on the flag for an actual Google session. Without this,
    // a Google attempt that gets abandoned mid-flow (cancelled, closed,
    // navigated away) leaves the flag sitting in sessionStorage, and it would
    // otherwise get wrongly applied to the next login - even an unrelated
    // plain email/password one - and sign the user right back out.
    const authIntent =
      session.user.app_metadata?.provider === "google" ? storedAuthIntent : null;

    if (authIntent === "signin" || authIntent === "signup") {
      const createdAt = new Date(session.user.created_at).getTime();
      const lastSignInAt = session.user.last_sign_in_at
        ? new Date(session.user.last_sign_in_at).getTime()
        : createdAt;
      // A brand-new account's first sign-in timestamp lands within a few
      // seconds of its creation timestamp - a returning user's won't.
      const isBrandNew = Math.abs(lastSignInAt - createdAt) < 10000;

      if (authIntent === "signin" && isBrandNew) {
        const accessToken = session.access_token;
        supabase
          .functions.invoke("delete-orphan-oauth-user", {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          .catch((err) => console.error("Failed to delete orphan OAuth user", err))
          .finally(async () => {
            await supabase!.auth.signOut();
            setGoogleAccountNotFound(true);
            setAuthModalOpen(true);
          });
        return;
      }

      // Mirror case: clicked "Continuer avec Google" from the register panel,
      // but this Google identity already had an account before today - nothing
      // to delete (it's a legitimate existing account), just refuse to silently
      // log them in from the signup panel and point them at "Connexion" instead.
      if (authIntent === "signup" && !isBrandNew) {
        supabase.auth.signOut().then(() => {
          setGoogleAccountAlreadyExists(true);
          setAuthModalOpen(true);
        });
        return;
      }
    }

    setAuthModalOpen(false);
    // Remembered so the auth panel can default to "sign in" instead of
    // "sign up" for a browser that has already logged in before.
    localStorage.setItem(HAS_LOGGED_IN_KEY, "1");
    // Every login AND signup fires a session here - catch up any Gumroad
    // purchase that arrived before this account existed, or under an email
    // that only now matches. Fire-and-forget: never blocks the UI, and a
    // failure here just means it's retried on the next login (or caught by
    // the scheduled reconcile sweep / the manual admin catch-up page).
    supabase.functions.invoke("reconcile-pending-purchases").catch((err) => {
      console.error("Failed to reconcile pending Gumroad purchases", err);
    });
    // Google sign-in does a full page redirect, which wipes all in-memory
    // state - sessionStorage is what actually survives to re-open the
    // upgrade modal once the session comes back.
    const pending = sessionStorage.getItem(PENDING_UPGRADE_KEY);
    if (pending) {
      sessionStorage.removeItem(PENDING_UPGRADE_KEY);
      setUpgradeModalPreselect(pending);
      setUpgradeModalOpenVoucher(false);
      setUpgradeModalOpen(true);
    }
  }, [session]);

  function openAuthModal() {
    setAuthModalOpen(true);
  }

  // Opens the sign-in/sign-up modal; once the user is authenticated, the
  // upgrade modal opens automatically with this certification preselected.
  function openAuthModalForUpgrade(preselectSlug: string) {
    sessionStorage.setItem(PENDING_UPGRADE_KEY, preselectSlug);
    setAuthModalOpen(true);
  }

  function closeAuthModal() {
    setAuthModalOpen(false);
  }

  function openUpgradeModal(preselectSlug?: string, openVoucher = false) {
    setUpgradeModalPreselect(preselectSlug ?? null);
    setUpgradeModalOpenVoucher(openVoucher);
    setUpgradeModalOpen(true);
  }

  function closeUpgradeModal() {
    setUpgradeModalOpen(false);
  }

  async function signInWithGoogle() {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.href },
    });
  }

  async function signInWithEmail(email: string, password: string) {
    if (!supabase) return t.auth.notConfigured;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? mapAuthError(error.message, lang) : null;
  }

  async function signUpWithEmail(email: string, password: string, firstName?: string) {
    if (!supabase) return t.auth.notConfigured;
    const passwordError = validatePassword(password, lang);
    if (passwordError) return passwordError;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName || null },
        // Without this, Supabase's confirmation link redirects to the bare
        // site_url with no page able to explain what happened - especially
        // when a mail scanner has already consumed the one-time link before
        // the user's own click (account still gets confirmed either way,
        // but the user's click then hits an "already used" error).
        emailRedirectTo: `${window.location.origin}/email-confirmed`,
      },
    });
    if (error) return mapAuthError(error.message, lang);
    // Supabase's anti-enumeration behavior: signing up with an email that
    // already has an account returns success with no error, but an empty
    // identities array - no confirmation email is actually sent. Without
    // this check the user would be told to "check their inbox" for an email
    // that never went out.
    if (data.user && data.user.identities?.length === 0) {
      return mapAuthError("User already registered", lang);
    }
    return null;
  }

  async function sendPasswordReset(email: string) {
    if (!supabase) return t.auth.notConfigured;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return error ? mapAuthError(error.message, lang) : null;
  }

  async function updatePassword(password: string) {
    if (!supabase) return t.auth.notConfigured;
    const passwordError = validatePassword(password, lang);
    if (passwordError) return passwordError;
    const { error } = await supabase.auth.updateUser({ password });
    if (!error) setPasswordRecovery(false);
    return error ? mapAuthError(error.message, lang) : null;
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  async function refreshProfile() {
    if (session) await loadProfile(session.user.id);
  }

  function dismissGoogleAccountNotFound() {
    setGoogleAccountNotFound(false);
  }

  function dismissGoogleAccountAlreadyExists() {
    setGoogleAccountAlreadyExists(false);
  }

  return (
    <AuthContext.Provider
      value={{
        ready,
        user: session?.user ?? null,
        profile,
        passwordRecovery,
        authModalOpen,
        openAuthModal,
        openAuthModalForUpgrade,
        closeAuthModal,
        upgradeModalOpen,
        upgradeModalPreselect,
        upgradeModalOpenVoucher,
        openUpgradeModal,
        closeUpgradeModal,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        sendPasswordReset,
        updatePassword,
        signOut,
        refreshProfile,
        googleAccountNotFound,
        dismissGoogleAccountNotFound,
        googleAccountAlreadyExists,
        dismissGoogleAccountAlreadyExists,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
