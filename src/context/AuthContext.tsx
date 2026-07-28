import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { mapAuthError, validatePassword } from "../lib/authErrors";

const PENDING_UPGRADE_KEY = "lampasai_pending_upgrade_slug";
export const HAS_LOGGED_IN_KEY = "lampasai_has_logged_in_before";

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
  openUpgradeModal: (preselectSlug?: string) => void;
  closeUpgradeModal: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<string | null>;
  signUpWithEmail: (email: string, password: string, firstName?: string) => Promise<string | null>;
  sendPasswordReset: (email: string) => Promise<string | null>;
  updatePassword: (password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!isSupabaseConfigured);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeModalPreselect, setUpgradeModalPreselect] = useState<string | null>(null);

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
    if (!session || !supabase) return;
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

  function openUpgradeModal(preselectSlug?: string) {
    setUpgradeModalPreselect(preselectSlug ?? null);
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
    if (!supabase) return "Supabase n'est pas configuré.";
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? mapAuthError(error.message) : null;
  }

  async function signUpWithEmail(email: string, password: string, firstName?: string) {
    if (!supabase) return "Supabase n'est pas configuré.";
    const passwordError = validatePassword(password);
    if (passwordError) return passwordError;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { first_name: firstName || null } },
    });
    return error ? mapAuthError(error.message) : null;
  }

  async function sendPasswordReset(email: string) {
    if (!supabase) return "Supabase n'est pas configuré.";
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return error ? mapAuthError(error.message) : null;
  }

  async function updatePassword(password: string) {
    if (!supabase) return "Supabase n'est pas configuré.";
    const passwordError = validatePassword(password);
    if (passwordError) return passwordError;
    const { error } = await supabase.auth.updateUser({ password });
    if (!error) setPasswordRecovery(false);
    return error ? mapAuthError(error.message) : null;
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  async function refreshProfile() {
    if (session) await loadProfile(session.user.id);
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
        openUpgradeModal,
        closeUpgradeModal,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        sendPasswordReset,
        updatePassword,
        signOut,
        refreshProfile,
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
