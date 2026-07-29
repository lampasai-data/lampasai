import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Landing page for Supabase's signup confirmation link (see emailRedirectTo
// in AuthContext.signUpWithEmail). Email security scanners (Gmail/Outlook/
// corporate antivirus) often pre-click links in emails before the user does,
// which burns the one-time confirmation token - the account still ends up
// confirmed either way, but the user's own click then hits an "already used/
// expired" error from Supabase. This page explains that instead of leaving
// the user on a bare, unexplained page.
export default function EmailConfirmed() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"checking" | "success" | "already-used">("checking");

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const search = new URLSearchParams(window.location.search);
    const errorCode = hash.get("error_code") ?? search.get("error_code");
    const hasError = Boolean(errorCode || hash.get("error") || search.get("error"));

    if (hasError) {
      setStatus("already-used");
    } else if (hash.get("access_token")) {
      setStatus("success");
    }
    // If neither an error nor an access_token is present yet, stay in
    // "checking" until the auth state settles below.
  }, []);

  useEffect(() => {
    if (status === "checking" && ready && user) setStatus("success");
  }, [status, ready, user]);

  return (
    <section className="mx-auto max-w-md px-6 py-24 text-center">
      <div className="rounded-2xl border border-black/8 bg-white p-8 shadow-sm">
        {status === "checking" && (
          <p className="text-sm text-muted">Vérification en cours…</p>
        )}

        {status === "success" && (
          <>
            <h1 className="font-display text-lg font-semibold text-ink">
              Email confirmé 🎉
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Ton compte est validé et tu es connecté.
            </p>
            <button
              type="button"
              onClick={() => navigate("/formations")}
              className="brand-gradient mt-6 rounded-full px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Accéder à mon espace
            </button>
          </>
        )}

        {status === "already-used" && (
          <>
            <h1 className="font-display text-lg font-semibold text-ink">
              Ce lien a déjà été utilisé
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              C'est souvent dû à ta messagerie qui ouvre les liens
              automatiquement pour vérifier qu'ils sont sûrs, avant même que
              tu ne cliques. Bonne nouvelle : ton compte est presque
              certainement déjà validé — connecte-toi directement.
            </p>
            <button
              type="button"
              onClick={() => navigate("/formations")}
              className="brand-gradient mt-6 rounded-full px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Me connecter
            </button>
          </>
        )}
      </div>
    </section>
  );
}
