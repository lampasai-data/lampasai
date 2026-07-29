import { useState, type FormEvent } from "react";
import { useAuth, HAS_LOGGED_IN_KEY, markGoogleAuthIntent } from "../context/AuthContext";
import { isSupabaseConfigured } from "../lib/supabase";
import { ALREADY_REGISTERED_MESSAGE } from "../lib/authErrors";
import googleLogo from "../assets/google-logo.png";

type Mode = "signin" | "signup" | "forgot";

export default function AuthPanel({
  title,
  subtitle,
}: {
  title?: string;
  subtitle?: string;
}) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, sendPasswordReset } =
    useAuth();
  const [mode, setMode] = useState<Mode>(() =>
    localStorage.getItem(HAS_LOGGED_IN_KEY) ? "signin" : "signup"
  );
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
    markGoogleAuthIntent(mode === "signup" ? "signup" : "signin");
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

  const defaultTitle =
    mode === "signin"
      ? "Bon retour !"
      : mode === "forgot"
        ? "Mot de passe oublié ?"
        : "Crée ton compte pour continuer";
  const defaultSubtitle =
    mode === "signin"
      ? "Connecte-toi pour continuer ton entraînement."
      : mode === "forgot"
        ? "On t'envoie un lien de réinitialisation par email."
        : "Tu as terminé les questions gratuites. Connecte-toi pour poursuivre ton entraînement.";

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-black/8 bg-white p-7 shadow-sm">
      <h3 className="font-display text-lg font-medium text-ink">{title ?? defaultTitle}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle ?? defaultSubtitle}</p>

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
          {error && error === ALREADY_REGISTERED_MESSAGE ? (
            <p className="text-sm text-red-500">
              Un compte existe déjà avec cet email.{" "}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setPassword("");
                  setMode("signin");
                }}
                className="font-medium text-teal-dark underline-offset-2 hover:underline"
              >
                Se connecter
              </button>
            </p>
          ) : (
            error && <p className="text-sm text-red-500">{error}</p>
          )}
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
              className="text-sm font-medium text-teal-dark underline-offset-2 hover:underline"
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
            className="text-sm text-muted"
          >
            {mode === "forgot" ? (
              <span className="font-medium text-teal-dark underline-offset-2 hover:underline">
                Retour à la connexion
              </span>
            ) : mode === "signin" ? (
              <>
                Pas encore de compte ?{" "}
                <span className="font-medium text-teal-dark underline-offset-2 hover:underline">
                  Inscris-toi
                </span>
              </>
            ) : (
              <>
                Déjà un compte ?{" "}
                <span className="font-medium text-teal-dark underline-offset-2 hover:underline">
                  Connecte-toi
                </span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
