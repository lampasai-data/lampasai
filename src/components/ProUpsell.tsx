import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n";

export default function ProUpsell({
  certName,
  certSlug,
}: {
  certName: string;
  certSlug: string;
}) {
  const { openUpgradeModal } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-teal/25 bg-teal/5 p-7 text-center">
      <span className="text-xs font-medium uppercase tracking-widest text-teal-dark">
        {t.auth.proUpsellBadge}
      </span>
      <h3 className="mt-3 font-display text-xl font-medium text-ink">
        {t.auth.proUpsellTitle}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {t.auth.proUpsellDesc(certName)}
      </p>
      <button
        type="button"
        onClick={() => openUpgradeModal(certSlug)}
        className="brand-gradient mt-6 inline-block rounded-full px-7 py-3.5 text-sm font-medium text-white transition hover:opacity-90"
      >
        {t.auth.proUpsellCta}
      </button>
    </div>
  );
}
