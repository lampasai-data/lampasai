import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n";
import { localize } from "../lib/i18nText";
import {
  createCheckoutSession,
  getPurchasedCertificationIds,
  listCertifications,
  type CertificationSummary,
} from "../lib/quizData";

const CERT_PRICE_EUR = 9.99;

export default function UpgradeModal() {
  const { user, upgradeModalOpen, upgradeModalPreselect, closeUpgradeModal } = useAuth();
  const { lang, t } = useLanguage();
  const [certs, setCerts] = useState<CertificationSummary[]>([]);
  const [purchasedIds, setPurchasedIds] = useState<Map<string, string>>(new Map());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!upgradeModalOpen || !user) return;
    setError(null);
    Promise.all([listCertifications(), getPurchasedCertificationIds(user.id)]).then(
      ([allCerts, purchased]) => {
        setCerts(allCerts);
        setPurchasedIds(purchased);
        const preselected = allCerts.find(
          (c) => c.slug === upgradeModalPreselect && !purchased.has(c.id)
        );
        setSelected(preselected ? new Set([preselected.id]) : new Set());
      }
    );
  }, [upgradeModalOpen, user, upgradeModalPreselect]);

  useEffect(() => {
    if (!upgradeModalOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeUpgradeModal();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [upgradeModalOpen, closeUpgradeModal]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleCheckout() {
    setError(null);
    setLoading(true);
    try {
      const origin = window.location.origin;
      const url = await createCheckoutSession(
        Array.from(selected),
        `${origin}/formations?checkout=success`,
        `${origin}/formations?checkout=cancelled`
      );
      window.location.href = url;
    } catch {
      setError(t.formations.upgradeModalError);
      setLoading(false);
    }
  }

  const availableCerts = certs.filter((c) => !purchasedIds.has(c.id));
  const total = (selected.size * CERT_PRICE_EUR).toFixed(2).replace(".", ",");

  return (
    <AnimatePresence>
      {upgradeModalOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeUpgradeModal}
        >
          <motion.div
            className="relative w-full max-w-md rounded-2xl border border-black/8 bg-white p-7 shadow-sm"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Fermer"
              onClick={closeUpgradeModal}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-ink shadow-sm transition hover:bg-black/[0.03]"
            >
              ✕
            </button>

            <h3 className="pr-8 font-display text-lg font-medium text-ink">
              {t.formations.upgradeModalTitle}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {t.formations.upgradeModalDesc}
            </p>

            {availableCerts.length === 0 ? (
              <p className="mt-6 rounded-xl border border-teal/25 bg-teal/5 p-4 text-sm text-teal-dark">
                {t.formations.upgradeModalEmpty}
              </p>
            ) : (
              <div className="mt-5 flex flex-col gap-2">
                {availableCerts.map((cert) => (
                  <label
                    key={cert.id}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                      selected.has(cert.id)
                        ? "border-teal/50 bg-teal/[0.06]"
                        : "border-black/10 hover:border-teal/30"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selected.has(cert.id)}
                        onChange={() => toggle(cert.id)}
                        className="h-4 w-4 accent-teal"
                      />
                      <span className="text-ink">{localize(cert.name, lang)}</span>
                    </span>
                    <span className="shrink-0 font-medium text-muted">9,99 €</span>
                  </label>
                ))}
              </div>
            )}

            {selected.size > 0 && (
              <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4 text-sm">
                <span className="text-muted">{t.formations.upgradeModalTotal}</span>
                <span className="font-display text-lg font-semibold text-ink">{total} €</span>
              </div>
            )}

            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

            {availableCerts.length > 0 && (
              <button
                type="button"
                onClick={handleCheckout}
                disabled={selected.size === 0 || loading}
                className="brand-gradient mt-6 w-full rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? t.formations.upgradeModalLoading : t.formations.upgradeModalSubmit}
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
