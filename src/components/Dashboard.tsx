import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n";
import { localize } from "../lib/i18nText";
import {
  getAllCertificationPurchaseDates,
  getPurchasedCertificationIds,
  getUserProgress,
  loadQuestions,
  type CertificationProgress,
  type CertificationSummary,
  type PurchasedCertificationAccess,
} from "../lib/quizData";
import type { LocalizedText, Question } from "../data/types";
import { CERT_LOGOS } from "../data/certLogos";
import { CERTIFICATION_DOMAINS } from "../data/certificationDomains";
import { useCheckoutSuccessPoll } from "../lib/useCheckoutSuccessPoll";

function TrophyIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 4h10v4a5 5 0 01-10 0V4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M7 5H4v1a4 4 0 004 4M17 5h3v1a4 4 0 01-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 13v4M9 20h6M10 17h4v3h-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export default function Dashboard({ certs }: { certs: CertificationSummary[] }) {
  const { user, profile, openUpgradeModal, purchasesVersion } = useAuth();
  const { t, lang } = useLanguage();
  const [progress, setProgress] = useState<Record<string, CertificationProgress>>({});
  const [purchasedIds, setPurchasedIds] = useState<Map<string, PurchasedCertificationAccess>>(
    new Map()
  );
  const [allPurchaseDates, setAllPurchaseDates] = useState<Map<string, string>>(new Map());
  const [downloadingSlug, setDownloadingSlug] = useState<string | null>(null);
  const [pdfModal, setPdfModal] = useState<{
    certName: LocalizedText;
    questions: Question[];
    count: number;
  } | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  // Months granted by the purchase that just completed, computed from the
  // actual expires_at rather than assumed - a voucher grants 1 month, a real
  // purchase 3, so the banner must reflect whichever one actually happened.
  const [checkoutBannerMonths, setCheckoutBannerMonths] = useState<number | null>(null);
  const isPro = profile?.plan === "pro";

  useEffect(() => {
    if (user) getUserProgress(user.id).then(setProgress);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    getPurchasedCertificationIds(user.id).then(setPurchasedIds);
    getAllCertificationPurchaseDates(user.id).then(setAllPurchaseDates);
  }, [user, purchasesVersion]);

  useCheckoutSuccessPoll(user, searchParams, setSearchParams, (ids) => {
    setPurchasedIds(ids);
    getAllCertificationPurchaseDates(user!.id).then(setAllPurchaseDates);
    // The just-completed purchase/voucher is the one expiring furthest in
    // the future - reliable without needing to diff against pre-checkout
    // state, and avoids ever hardcoding a duration that might be wrong.
    const newest = [...ids.values()].reduce<PurchasedCertificationAccess | null>(
      (max, entry) =>
        !max || new Date(entry.expiresAt) > new Date(max.expiresAt) ? entry : max,
      null
    );
    if (newest) {
      const months = Math.max(
        1,
        Math.round(
          (new Date(newest.expiresAt).getTime() - Date.now()) / (30 * 24 * 60 * 60 * 1000)
        )
      );
      setCheckoutBannerMonths(months);
    }
  });

  async function handleDownloadPdf(cert: CertificationSummary) {
    setDownloadingSlug(cert.slug);
    const data = await loadQuestions(cert.slug);
    if (data) {
      setPdfModal({ certName: data.name, questions: data.questions, count: data.questions.length });
    }
    setDownloadingSlug(null);
  }

  async function confirmDownloadPdf() {
    if (!pdfModal) return;
    const { exportCertificationPdf } = await import("../lib/pdfExport");
    exportCertificationPdf(
      localize(pdfModal.certName, lang),
      pdfModal.questions.slice(0, pdfModal.count),
      lang
    );
    setPdfModal(null);
  }

  return (
    <>
      {checkoutBannerMonths !== null && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-teal/25 bg-teal/5 px-5 py-4 text-sm font-medium text-teal-dark"
        >
          {t.formations.checkoutSuccessBanner(checkoutBannerMonths)}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-display text-2xl font-semibold text-ink">
            {profile?.first_name
              ? t.formations.dashboardGreeting(profile.first_name)
              : t.formations.dashboardWelcome}
          </p>
          {isPro && (
            <span className="brand-gradient inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold text-white">
              {t.formations.dashboardPlanPro}
            </span>
          )}
        </div>
      </motion.div>

      {!isPro && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-teal/25 bg-teal/5 p-6 sm:flex-row sm:items-center"
        >
          <div>
            <p className="font-display text-base font-medium text-ink">
              {t.formations.upgradeTitle}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {t.formations.upgradeDesc}
            </p>
          </div>
          <button
            type="button"
            onClick={() => openUpgradeModal()}
            className="brand-gradient inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-md shadow-teal/20 transition hover:opacity-90 active:scale-95"
          >
            {t.formations.upgradeCta}
          </button>
        </motion.div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {certs.map((cert, i) => {
          const stats = progress[cert.slug];
          const access = purchasedIds.get(cert.id);
          const expiresAt = access?.expiresAt;
          const unlocked = isPro || expiresAt !== undefined;
          const canDownloadPdf = isPro || access?.pdfAllowed === true;
          const isExpired = !isPro && expiresAt === undefined && allPurchaseDates.has(cert.id);
          return (
            <motion.div
              key={cert.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 + i * 0.06 }}
              className="flex h-full flex-col rounded-2xl border border-black/8 bg-white p-7 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-black/8 bg-surface">
                  {CERT_LOGOS[cert.slug] ? (
                    <img
                      src={CERT_LOGOS[cert.slug]}
                      alt=""
                      className={
                        cert.slug === "power-bi"
                          ? "h-14 w-14 object-contain"
                          : "h-11 w-11 object-contain"
                      }
                    />
                  ) : (
                    <span className="brand-gradient h-2.5 w-2.5 rounded-full" />
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg font-medium text-ink">
                      {localize(cert.name, lang)}
                    </h3>
                    {!isPro && expiresAt && (
                      <span className="inline-flex items-center rounded-full border border-green/30 bg-green/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-green">
                        {t.formations.dashboardPaidBadge}
                      </span>
                    )}
                    {isExpired && (
                      <span className="inline-flex items-center rounded-full border border-red-300 bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-red-600">
                        {t.formations.dashboardRenewAccess}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {stats && stats.answered > 0
                      ? t.formations.dashboardProgress(
                          Math.round((stats.correct / stats.answered) * 100),
                          stats.correct,
                          stats.answered
                        )
                      : t.formations.dashboardNotStarted}
                  </p>
                </div>
              </div>

              {CERTIFICATION_DOMAINS[cert.slug] && (
                <div className="mt-5 border-t border-black/5 pt-4">
                  <p className="text-xs font-medium text-teal-dark">{t.formations.domainsLabel}</p>
                  <ul className="mt-2.5 flex flex-col gap-1.5">
                    {CERTIFICATION_DOMAINS[cert.slug].map((domain) => (
                      <li
                        key={domain.label.fr}
                        className="flex items-center justify-between gap-3 text-xs text-ink/70"
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal/60" />
                          {localize(domain.label, lang)}
                        </span>
                        <span className="shrink-0 font-medium text-muted">{domain.weight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-auto flex flex-nowrap items-center gap-x-2 overflow-x-auto border-t border-black/5 pt-5">
                {unlocked ? (
                  <Link
                    to={`/formations/${cert.slug}?mode=exam`}
                    className="shrink-0 rounded-full border border-teal/40 px-3 py-1.5 text-xs font-medium text-teal-dark transition hover:bg-teal/5"
                  >
                    {t.formations.dashboardContinue}
                  </Link>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => openUpgradeModal(cert.slug)}
                      className="shrink-0 brand-gradient rounded-full px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
                    >
                      {t.formations.dashboardGoPro}
                    </button>
                    <button
                      type="button"
                      onClick={() => openUpgradeModal(cert.slug, true)}
                      className="shrink-0 rounded-full border border-teal/40 px-3 py-1.5 text-xs font-medium text-teal-dark transition hover:bg-teal/5"
                    >
                      {t.quiz.voucherTitle}
                    </button>
                  </>
                )}
                {unlocked && canDownloadPdf && (
                  <button
                    type="button"
                    onClick={() => handleDownloadPdf(cert)}
                    disabled={downloadingSlug === cert.slug}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-teal/5 disabled:opacity-50"
                  >
                    {downloadingSlug === cert.slug
                      ? t.formations.downloadingPdf
                      : t.formations.downloadPdf}
                  </button>
                )}
                {unlocked && (
                  <Link
                    to={`/formations/${cert.slug}/classement`}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-green/40 bg-green/5 px-3 py-1.5 text-xs font-medium text-green transition hover:bg-green/10"
                  >
                    <TrophyIcon className="h-3.5 w-3.5" />
                    {t.quiz.viewLeaderboard}
                  </Link>
                )}
              </div>

              {/* Always rendered, fixed-height slot - even when neither
                  condition below applies - so every card reserves the same
                  amount of space beneath the (mt-auto, bottom-anchored)
                  button row. Without this, a card with an access-until/renew
                  message ended up taller below its buttons than one without,
                  which pushed its button row up and broke the alignment
                  between cards that all sit in the same grid row. */}
              <div className="flex min-h-4 items-center justify-center pt-4">
                {!isPro && expiresAt && (
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span>
                      {t.formations.dashboardAccessUntil(
                        new Date(expiresAt).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      )}
                    </span>
                    <span className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-green text-white">
                      <svg viewBox="0 0 24 24" fill="none" className="h-2 w-2">
                        <path
                          d="M5 13l4 4L19 7"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                )}
                {isExpired && (
                  <button
                    type="button"
                    onClick={() => openUpgradeModal(cert.slug)}
                    className="flex items-center gap-2 text-xs font-medium text-red-600 transition hover:text-red-700"
                  >
                    <span>{t.formations.dashboardRenewAccess}</span>
                    <span className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
                      <svg viewBox="0 0 24 24" fill="none" className="h-2 w-2">
                        <path
                          d="M6 6l12 12M18 6L6 18"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {pdfModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6"
            onClick={() => setPdfModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-2xl border border-black/8 bg-white p-6 shadow-xl"
            >
              <h3 className="font-display text-base font-semibold text-ink">
                {t.formations.pdfCountPrompt}
              </h3>

              {(() => {
                const total = pdfModal.questions.length;
                const stepValues = Array.from(
                  { length: Math.ceil(total / 20) },
                  (_, i) => Math.min((i + 1) * 20, total)
                );
                const sliderIndex = Math.max(
                  0,
                  stepValues.findIndex((v) => v === pdfModal.count)
                );
                return (
                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-muted">
                        {t.quiz.questionCountLabel}
                      </span>
                      <span className="text-sm font-semibold text-ink">{pdfModal.count}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={Math.max(stepValues.length - 1, 0)}
                      step={1}
                      value={sliderIndex}
                      onChange={(e) =>
                        setPdfModal((prev) =>
                          prev ? { ...prev, count: stepValues[Number(e.target.value)] } : prev
                        )
                      }
                      className="w-full accent-teal"
                    />
                  </div>
                );
              })()}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPdfModal(null)}
                  className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-ink transition hover:border-black/20"
                >
                  {t.formations.pdfCountCancel}
                </button>
                <button
                  type="button"
                  onClick={confirmDownloadPdf}
                  className="brand-gradient rounded-full px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                >
                  {t.formations.pdfCountConfirm}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
