import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n";
import { localize } from "../lib/i18nText";
import {
  createCheckoutSession,
  getPurchasedCertificationIds,
  listCertifications,
  redeemExamVoucher,
  type CertificationSummary,
  type PurchasedCertificationAccess,
} from "../lib/quizData";
import {
  ENABLE_GUMROAD,
  PENDING_GUMROAD_PURCHASE_KEY,
  buildGumroadCheckoutUrl,
} from "../lib/paymentConfig";

const CERT_PRICE_EUR = 9.99;

export default function UpgradeModal() {
  const { user, upgradeModalOpen, upgradeModalPreselect, upgradeModalOpenVoucher, closeUpgradeModal } =
    useAuth();
  const { lang, t } = useLanguage();
  const [certs, setCerts] = useState<CertificationSummary[]>([]);
  const [purchasedIds, setPurchasedIds] = useState<Map<string, PurchasedCertificationAccess>>(
    new Map()
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Exam voucher redemption (admin-issued code, unlocks exam mode for 30
  // days without PDF export) - a secondary path alongside paying. When the
  // modal wasn't opened for a specific certification (the generic "Passer
  // en illimité" entry point), the user must pick which one the code is
  // for; the server still verifies the code actually matches it.
  const [voucherOpen, setVoucherOpen] = useState(false);
  const [voucherCertId, setVoucherCertId] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherStatus, setVoucherStatus] = useState<"idle" | "redeeming" | "error" | "success">(
    "idle"
  );
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [voucherUnlockedName, setVoucherUnlockedName] = useState<string | null>(null);

  useEffect(() => {
    if (!upgradeModalOpen || !user) return;
    setError(null);
    setVoucherOpen(upgradeModalOpenVoucher);
    setVoucherCode("");
    setVoucherStatus("idle");
    setVoucherError(null);
    setVoucherUnlockedName(null);
    Promise.all([listCertifications(), getPurchasedCertificationIds(user.id)]).then(
      ([allCerts, purchased]) => {
        setCerts(allCerts);
        setPurchasedIds(purchased);
        const preselected = allCerts.find(
          (c) => c.slug === upgradeModalPreselect && !purchased.has(c.id)
        );
        setSelected(preselected ? new Set([preselected.id]) : new Set());
        setVoucherCertId(
          preselected?.id ?? allCerts.find((c) => !purchased.has(c.id))?.id ?? ""
        );
      }
    );
  }, [upgradeModalOpen, user, upgradeModalPreselect, upgradeModalOpenVoucher]);

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

  // Gumroad has no equivalent of Stripe's "pick several, pay one total"
  // checkout session - each product is its own purchase. Sends the buyer
  // straight to that certification's Gumroad checkout instead.
  function handleGumroadBuy(cert: CertificationSummary) {
    const url = buildGumroadCheckoutUrl(cert.slug, user?.email);
    if (!url) {
      setError(t.formations.upgradeModalError);
      return;
    }
    sessionStorage.setItem(PENDING_GUMROAD_PURCHASE_KEY, "1");
    window.location.href = url;
  }

  async function handleStripeCheckout() {
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

  async function handleRedeemVoucher() {
    if (!voucherCode.trim() || !voucherCertId) return;
    setVoucherStatus("redeeming");
    setVoucherError(null);
    try {
      const { certificationId } = await redeemExamVoucher(voucherCode.trim(), voucherCertId);
      const unlockedCert = certs.find((c) => c.id === certificationId);
      setVoucherUnlockedName(unlockedCert ? localize(unlockedCert.name, lang) : null);
      setVoucherStatus("success");
      // No shared client-side cache to update from here - the certification
      // page/dashboard just refetch access on mount. Give the user a moment
      // to read the confirmation before the reload takes over.
      setTimeout(() => {
        closeUpgradeModal();
        window.location.reload();
      }, 1400);
    } catch (err) {
      setVoucherStatus("error");
      setVoucherError(err instanceof Error ? err.message : "Erreur lors de la validation du code.");
    }
  }

  const availableCerts = certs.filter((c) => !purchasedIds.has(c.id));
  // "Passer en mode Pro" on a specific certification card should only ever
  // offer to pay for that certification - not also list the other one, the
  // way the generic "Passer en illimité" (no preselect) entry point does.
  const gumroadCerts = upgradeModalPreselect
    ? availableCerts.filter((c) => c.slug === upgradeModalPreselect)
    : availableCerts;
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
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-black/8 bg-white p-7 shadow-sm"
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
              {voucherOpen ? t.quiz.voucherModalTitle : t.formations.upgradeModalTitle}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {voucherOpen ? (
                upgradeModalPreselect && gumroadCerts.length === 1 ? (
                  t.quiz.voucherModalDescFor(localize(gumroadCerts[0].name, lang))
                ) : (
                  t.quiz.voucherModalDescGeneric
                )
              ) : ENABLE_GUMROAD ? (
                gumroadCerts.length === 1 ? (
                  t.formations.upgradeModalDescForCert(localize(gumroadCerts[0].name, lang))
                ) : (
                  t.formations.upgradeModalDescSingle
                )
              ) : (
                t.formations.upgradeModalDesc
              )}
            </p>

            {voucherOpen ? null : (ENABLE_GUMROAD ? gumroadCerts : availableCerts).length === 0 ? (
              <p className="mt-6 rounded-xl border border-teal/25 bg-teal/5 p-4 text-sm text-teal-dark">
                {t.formations.upgradeModalEmpty}
              </p>
            ) : ENABLE_GUMROAD ? (
              <div className="mt-5 flex flex-col gap-2">
                {gumroadCerts.map((cert) => (
                  <button
                    key={cert.id}
                    type="button"
                    onClick={() => handleGumroadBuy(cert)}
                    className="flex items-center justify-between gap-3 rounded-xl border border-black/10 px-4 py-3 text-left text-sm transition hover:border-teal/40 hover:bg-teal/[0.04]"
                  >
                    <span className="text-ink">{localize(cert.name, lang)}</span>
                    <span className="shrink-0 font-medium text-teal-dark">9,99 €</span>
                  </button>
                ))}
              </div>
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

            {!voucherOpen && !ENABLE_GUMROAD && selected.size > 0 && (
              <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4 text-sm">
                <span className="text-muted">{t.formations.upgradeModalTotal}</span>
                <span className="font-display text-lg font-semibold text-ink">{total} €</span>
              </div>
            )}

            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

            {!voucherOpen && !ENABLE_GUMROAD && availableCerts.length > 0 && (
              <button
                type="button"
                onClick={handleStripeCheckout}
                disabled={selected.size === 0 || loading}
                className="brand-gradient mt-6 w-full rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? t.formations.upgradeModalLoading : t.formations.upgradeModalSubmit}
              </button>
            )}

            <div className={voucherOpen ? "mt-5" : "mt-5 border-t border-black/5 pt-4"}>
              {voucherOpen ? (
                voucherStatus === "success" ? (
                  <p className="rounded-xl border border-green/30 bg-green/10 p-3 text-sm text-green">
                    {voucherUnlockedName
                      ? t.quiz.voucherSuccessFor(voucherUnlockedName)
                      : t.quiz.voucherSuccess}
                  </p>
                ) : (
                  <>
                    {!upgradeModalPreselect && availableCerts.length > 1 && (
                      <select
                        value={voucherCertId}
                        onChange={(e) => setVoucherCertId(e.target.value)}
                        className="mt-3 w-full rounded-full border border-black/10 px-4 py-2 text-sm text-ink focus:border-teal/40 focus:outline-none"
                      >
                        {availableCerts.map((cert) => (
                          <option key={cert.id} value={cert.id}>
                            {localize(cert.name, lang)}
                          </option>
                        ))}
                      </select>
                    )}

                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={voucherCode}
                        onChange={(e) => {
                          setVoucherCode(e.target.value);
                          if (voucherStatus === "error") setVoucherStatus("idle");
                        }}
                        placeholder={t.quiz.voucherPlaceholder}
                        className="flex-1 rounded-full border border-black/10 px-4 py-2 text-sm uppercase tracking-wide text-ink placeholder:normal-case placeholder:text-muted focus:border-teal/40 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleRedeemVoucher}
                        disabled={
                          voucherStatus === "redeeming" || !voucherCode.trim() || !voucherCertId
                        }
                        className="shrink-0 rounded-full border border-teal/40 px-4 py-2 text-sm font-medium text-teal-dark transition hover:bg-teal/5 disabled:opacity-50"
                      >
                        {voucherStatus === "redeeming"
                          ? t.quiz.voucherRedeeming
                          : t.quiz.voucherSubmit}
                      </button>
                    </div>
                    {voucherStatus === "error" && voucherError && (
                      <p className="mt-2 text-xs text-red-600">{voucherError}</p>
                    )}
                    {availableCerts.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setVoucherOpen(false)}
                        className="mt-4 text-sm font-semibold text-teal-dark underline underline-offset-2 transition hover:text-teal"
                      >
                        {t.quiz.voucherModalPayInstead}
                      </button>
                    )}
                  </>
                )
              ) : (
                <button
                  type="button"
                  onClick={() => setVoucherOpen(true)}
                  className="text-sm font-medium text-teal-dark transition hover:text-teal"
                >
                  {t.quiz.voucherTitle}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
