import { useEffect, useRef, useState, type FormEvent } from "react";
import { useAuth, HAS_LOGGED_IN_KEY, markGoogleAuthIntent } from "../context/AuthContext";
import { isSupabaseConfigured } from "../lib/supabase";
import {
  ALREADY_REGISTERED_MESSAGE,
  GOOGLE_ACCOUNT_ALREADY_EXISTS_MESSAGE,
} from "../lib/authErrors";
import googleLogo from "../assets/google-logo.png";

type Mode = "signin" | "signup" | "forgot";

// Same lightweight anti-bot pattern as Contact.tsx / TrainingRequestForm.tsx
// (honeypot + time-trap) - only gated on "signup", since that's the one mode
// that actually creates a new account (a bot's real target); gating login
// the same way would risk false positives on fast password-manager autofill.
const MIN_SIGNUP_DELAY_MS = 2500;

export default function AuthPanel({
  title,
  subtitle,
}: {
  title?: string;
  subtitle?: string;
}) {
  const {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    googleAccountNotFound,
    dismissGoogleAccountNotFound,
    googleAccountAlreadyExists,
    dismissGoogleAccountAlreadyExists,
  } = useAuth();
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
  const [tooFast, setTooFast] = useState(false);
  const mountedAt = useRef(Date.now());

  // Set by AuthContext when a Google sign-in attempt just turned out to have
  // auto-created (and then deleted again) a brand-new account - steer the
  // user toward actually signing up instead.
  useEffect(() => {
    if (!googleAccountNotFound) return;
    setMode("signup");
    setError(
      "Aucun compte n'existe avec cette adresse Google. Crée ton compte ci-dessous."
    );
    dismissGoogleAccountNotFound();
  }, [googleAccountNotFound, dismissGoogleAccountNotFound]);

  // Set by AuthContext when a Google sign-in attempt from the register panel
  // resolved to an account that already existed - stays on the register
  // panel and shows a clickable link to switch to sign-in, same treatment as
  // the "email already registered" case below. This always fires after a
  // full-page reload (the OAuth redirect), where the panel's initial mode is
  // freshly recomputed from HAS_LOGGED_IN_KEY and can default back to
  // "signin" even though the user was on "Inscription" - force it back.
  useEffect(() => {
    if (!googleAccountAlreadyExists) return;
    setMode("signup");
    setError(GOOGLE_ACCOUNT_ALREADY_EXISTS_MESSAGE);
    dismissGoogleAccountAlreadyExists();
  }, [googleAccountAlreadyExists, dismissGoogleAccountAlreadyExists]);

  async function handleGoogle() {
    setError(null);
    setLoadingGoogle(true);
    markGoogleAuthIntent(mode === "signup" ? "signup" : "signin");
    await signInWithGoogle();
    setLoadingGoogle(false);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setTooFast(false);

    if (mode === "signup") {
      const data = new FormData(e.currentTarget);
      // Honeypot: a field only bots fill in (hidden from real users via CSS).
      if (data.get("company_website")) return;
      // Time-trap: a real human takes at least a couple of seconds to fill
      // the signup form; a bot submitting instantly gets silently blocked.
      if (Date.now() - mountedAt.current < MIN_SIGNUP_DELAY_MS) {
        setTooFast(true);
        return;
      }
    }

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
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
              <label htmlFor="auth_company_website">Company website</label>
              <input
                id="auth_company_website"
                name="company_website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
          )}
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
          {tooFast && (
            <p className="text-sm text-amber">
              Un instant... prends le temps de vérifier tes informations avant de valider.
            </p>
          )}
          {error &&
          (error === ALREADY_REGISTERED_MESSAGE ||
            error === GOOGLE_ACCOUNT_ALREADY_EXISTS_MESSAGE) ? (
            <p className="text-sm text-red-500">
              {error}{" "}
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
