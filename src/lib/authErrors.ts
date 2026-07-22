export function mapAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("invalid login credentials")) {
    return "Email ou mot de passe incorrect.";
  }
  if (lower.includes("user already registered") || lower.includes("already registered")) {
    return "Un compte existe déjà avec cet email. Essaie de te connecter.";
  }
  if (lower.includes("email not confirmed")) {
    return "Confirme ton email avant de te connecter (vérifie ta boîte mail).";
  }
  if (lower.includes("password should be at least")) {
    return "Le mot de passe est trop court.";
  }
  if (lower.includes("rate limit")) {
    return "Trop de tentatives, réessaie dans quelques minutes.";
  }

  return "Une erreur est survenue. Réessaie dans un instant.";
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return "8 caractères minimum.";
  if (!/[a-z]/.test(password)) return "Ajoute au moins une minuscule.";
  if (!/[A-Z]/.test(password)) return "Ajoute au moins une majuscule.";
  if (!/[0-9]/.test(password)) return "Ajoute au moins un chiffre.";
  return null;
}
