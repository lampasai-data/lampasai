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
  const [firstName, setFirstName] = useState("");
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

    const err =
      mode === "signin"
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password, firstName);
    setLoadingEmail(false);
    if (err) setError(err);
    else if (mode === "signup") setSentConfirmation(true);
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="rounded-2xl border border-amber/30 bg-amber/10 p-6 text-sm text-amber">
        L'authentification n'est pas encore configurée sur ce site (variables
        Supabase manquantes). Reviens un peu plus tard.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-black/8 bg-white p-7 shadow-sm">
      <h3 className="font-display text-lg font-medium text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p>

      {mode !== "forgot" && (
        <>
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loadingGoogle}
            className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-ink transition hover:bg-black/[0.02] disabled:opacity-60"
          >
            <img src={googleLogo} alt="" className="h-4 w-4" />
            {loadingGoogle ? "Redirection..." : "Continuer avec Google"}
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted">
            <span className="h-px flex-1 bg-black/10" />
            ou par email
            <span className="h-px flex-1 bg-black/10" />
          </div>
        </>
      )}

      {resetSent ? (
        <p className="rounded-xl border border-green/30 bg-green/10 p-4 text-sm text-green">
          Un email avec un lien de réinitialisation vient d'être envoyé.
        </p>
      ) : sentConfirmation ? (
        <p className="rounded-xl border border-green/30 bg-green/10 p-4 text-sm text-green">
          Vérifie ta boîte mail pour confirmer ton inscription.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === "signup" && (
            <input
              type="text"
              required
              placeholder="Prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-teal focus:outline-none"
            />
          )}
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-teal focus:outline-none"
          />
          {mode !== "forgot" && (
            <input
              type="password"
              required
              minLength={8}
              placeholder="Mot de passe (8+ car., maj., min., chiffre)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-teal focus:outline-none"
            />
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loadingEmail}
            className="brand-gradient mt-1 rounded-full px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
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
              className="text-xs text-muted hover:text-ink"
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
            className="text-xs text-muted hover:text-ink"
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
