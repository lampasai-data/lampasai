import { useAuth } from "../context/AuthContext";

export default function ProUpsell({
  certName,
  certSlug,
}: {
  certName: string;
  certSlug: string;
}) {
  const { openUpgradeModal } = useAuth();

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-teal/25 bg-teal/5 p-7 text-center">
      <span className="text-xs font-medium uppercase tracking-widest text-teal-dark">
        Mode Pro
      </span>
      <h3 className="mt-3 font-display text-xl font-medium text-ink">
        Tu as terminé tes 20 questions gratuites
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Passe en mode Pro pour continuer à t'entraîner sans limite sur la
        certification {certName} pendant toute la durée de ta préparation.
      </p>
      <button
        type="button"
        onClick={() => openUpgradeModal(certSlug)}
        className="brand-gradient mt-6 inline-block rounded-full px-7 py-3.5 text-sm font-medium text-white transition hover:opacity-90"
      >
        Passer en mode Pro (9,99 € / 3 mois)
      </button>
    </div>
  );
}
