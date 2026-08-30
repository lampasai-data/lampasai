export type AuthLang = "fr" | "en";

// Exported so AuthPanel can detect this specific case and render a clickable
// "Se connecter" link instead of (or alongside) the plain error text.
export function getAlreadyRegisteredMessage(lang: AuthLang): string {
  return lang === "en"
    ? "An account already exists with this email. Try signing in."
    : "Un compte existe déjà avec cet email. Essaie de te connecter.";
}

// Same rendering treatment as getAlreadyRegisteredMessage (clickable "Se
// connecter" link), for the Google-sign-in-from-register-panel case.
export function getGoogleAccountAlreadyExistsMessage(lang: AuthLang): string {
  return lang === "en"
    ? "An account already exists with this Google address."
    : "Un compte existe déjà avec cette adresse Google.";
}

export function mapAuthError(message: string, lang: AuthLang = "fr"): string {
  const lower = message.toLowerCase();

  if (lower.includes("invalid login credentials")) {
    return lang === "en" ? "Incorrect email or password." : "Email ou mot de passe incorrect.";
  }
  if (lower.includes("user already registered") || lower.includes("already registered")) {
    return getAlreadyRegisteredMessage(lang);
  }
  if (lower.includes("email not confirmed")) {
    return lang === "en"
      ? "Confirm your email before signing in (check your inbox)."
      : "Confirme ton email avant de te connecter (vérifie ta boîte mail).";
  }
  if (lower.includes("password should be at least")) {
    return lang === "en" ? "Password is too short." : "Le mot de passe est trop court.";
  }
  if (lower.includes("rate limit")) {
    return lang === "en"
      ? "Too many attempts, try again in a few minutes."
      : "Trop de tentatives, réessaie dans quelques minutes.";
  }

  return lang === "en"
    ? "Something went wrong. Try again in a moment."
    : "Une erreur est survenue. Réessaie dans un instant.";
}

export function validatePassword(password: string, lang: AuthLang = "fr"): string | null {
  if (password.length < 8) {
    return lang === "en" ? "8 characters minimum." : "8 caractères minimum.";
  }
  if (!/[a-z]/.test(password)) {
    return lang === "en" ? "Add at least one lowercase letter." : "Ajoute au moins une minuscule.";
  }
  if (!/[A-Z]/.test(password)) {
    return lang === "en" ? "Add at least one uppercase letter." : "Ajoute au moins une majuscule.";
  }
  if (!/[0-9]/.test(password)) {
    return lang === "en" ? "Add at least one digit." : "Ajoute au moins un chiffre.";
  }
  return null;
}
