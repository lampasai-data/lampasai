import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { isSupabaseConfigured } from "../lib/supabase";
import googleLogo from "../assets/google-logo.png";

type Mode = "signin" | "signup" | "forgot";

export default function AuthPanel({
  title = "Crée ton compte pour continuer",
  subtitle = "Tu as terminé les questions gratuites. Connecte-toi pour poursuivre ton entraînement.",
}: {
  title?: string;
  subtitle?: string;
}) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, sendPasswordReset } =
    useAuth();
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [sentConfirmation, setSentConfirmation] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function handleGoogle() {
    setError(null);
    setLoadingGoogle(true);
    await signInWithGoogle();
    setLoadingGoogle(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoadingEmail(true);

    if (mode === "forgot") {
      const err = await sendPasswordReset(email);
      setLoadingEmail(false);
      if (err) setError(err);
      else setResetSent(true);
      return;
    }

    const fn = mode === "signin" ? signInWithEmail : signUpWithEmail;
    const err = await fn(email, password);
    setLoadingEmail(false);
    if (err) setError(err);
    else if (mode === "signup") setSentConfirmation(true);
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-6 text-sm text-amber-200">
        L'authentification n'est pas encore configurée sur ce site (variables
        Supabase manquantes). Reviens un peu plus tard.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-7">
      <h3 className="font-display text-lg font-medium text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/55">{subtitle}</p>

      {mode !== "forgot" && (
        <>
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loadingGoogle}
            className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:opacity-60"
          >
            <img src={googleLogo} alt="" className="h-4 w-4" />
            {loadingGoogle ? "Redirection..." : "Continuer avec Google"}
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-white/40">
            <span className="h-px flex-1 bg-white/10" />
            ou par email
            <span className="h-px flex-1 bg-white/10" />
          </div>
        </>
      )}

      {resetSent ? (
        <p className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-200">
          Un email avec un lien de réinitialisation vient d'être envoyé.
        </p>
      ) : sentConfirmation ? (
        <p className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-200">
          Vérifie ta boîte mail pour confirmer ton inscription.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-violet-400/50 focus:outline-none"
          />
          {mode !== "forgot" && (
            <input
              type="password"
              required
              minLength={8}
              placeholder="Mot de passe (8+ car., maj., min., chiffre)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-violet-400/50 focus:outline-none"
            />
          )}
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loadingEmail}
            className="mt-1 rounded-full bg-violet-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-400 disabled:opacity-60"
          >
            {loadingEmail
              ? "..."
              : mode === "signin"
                ? "Se connecter"
                : mode === "signup"
                  ? "Créer mon compte"
                  : "Envoyer le lien"}
          </button>

          {mode === "signin" && (
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode("forgot");
              }}
              className="text-xs text-white/50 hover:text-white"
            >
              Mot de passe oublié ?
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setError(null);
              setMode(mode === "signin" ? "signup" : "signin");
            }}
            className="text-xs text-white/50 hover:text-white"
          >
            {mode === "forgot"
              ? "Retour à la connexion"
              : mode === "signin"
                ? "Pas encore de compte ? Inscris-toi"
                : "Déjà un compte ? Connecte-toi"}
          </button>
        </form>
      )}
    </div>
  );
}
