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

interface Profile {
  id: string;
  email: string | null;
  plan: "free" | "pro";
  free_questions_used: number;
}

interface AuthState {
  ready: boolean;
  user: User | null;
  profile: Profile | null;
  passwordRecovery: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<string | null>;
  signUpWithEmail: (email: string, password: string) => Promise<string | null>;
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

  async function loadProfile(userId: string) {
    if (!supabase) return;
    const { data } = await supabase
      .from("profiles")
      .select("id, email, plan, free_questions_used")
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
        // fires this event — used to route the user to a "set new password" screen.
        if (event === "PASSWORD_RECOVERY") setPasswordRecovery(true);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

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

  async function signUpWithEmail(email: string, password: string) {
    if (!supabase) return "Supabase n'est pas configuré.";
    const passwordError = validatePassword(password);
    if (passwordError) return passwordError;
    const { error } = await supabase.auth.signUp({ email, password });
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
