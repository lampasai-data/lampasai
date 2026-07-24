import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n";
import { localize } from "../lib/i18nText";
import {
  getPurchasedCertificationIds,
  getUserProgress,
  loadQuestions,
  type CertificationProgress,
  type CertificationSummary,
} from "../lib/quizData";
import { CERT_LOGOS } from "../data/certLogos";
import { CERTIFICATION_DOMAINS } from "../data/certificationDomains";

export default function Dashboard({ certs }: { certs: CertificationSummary[] }) {
  const { user, profile, openUpgradeModal } = useAuth();
  const { t, lang } = useLanguage();
  const [progress, setProgress] = useState<Record<string, CertificationProgress>>({});
  const [purchasedIds, setPurchasedIds] = useState<Set<string>>(new Set());
  const [downloadingSlug, setDownloadingSlug] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const isPro = profile?.plan === "pro";

  useEffect(() => {
    if (user) getUserProgress(user.id).then(setProgress);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    getPurchasedCertificationIds(user.id).then(setPurchasedIds);
  }, [user]);

  useEffect(() => {
    if (!user || searchParams.get("checkout") !== "success") return;
    setShowSuccessBanner(true);
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts += 1;
      const ids = await getPurchasedCertificationIds(user.id);
      setPurchasedIds(ids);
      if (attempts >= 5) clearInterval(interval);
    }, 2000);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("checkout");
      return next;
    }, { replace: true });
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function handleDownloadPdf(cert: CertificationSummary) {
    setDownloadingSlug(cert.slug);
    const [data, { exportCertificationPdf }] = await Promise.all([
      loadQuestions(cert.slug),
      import("../lib/pdfExport"),
    ]);
    if (data) {
      const answer = window.prompt(
        `${t.formations.pdfCountPrompt} (${t.formations.pdfCountMax}: ${data.questions.length})`,
        `${data.questions.length}`
      );
      if (answer !== null) {
        const count = Math.min(Math.max(parseInt(answer, 10) || data.questions.length, 1), data.questions.length);
        exportCertificationPdf(localize(data.name, lang), data.questions.slice(0, count), lang);
      }
    }
    setDownloadingSlug(null);
  }

  return (
    <>
      {showSuccessBanner && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-teal/25 bg-teal/5 px-5 py-4 text-sm font-medium text-teal-dark"
        >
          {t.formations.checkoutSuccessBanner}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {profile?.first_name && (
          <p className="text-lg font-medium text-ink">Bienvenue {profile.first_name} 👋</p>
        )}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <p className="font-display text-2xl font-semibold text-ink">
            {t.formations.dashboardWelcome}
          </p>
          <span
            className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold ${
              isPro ? "brand-gradient text-white" : "border border-black/10 text-muted"
            }`}
          >
            {isPro ? t.formations.dashboardPlanPro : t.formations.dashboardPlanFree}
          </span>
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
          const unlocked = isPro || purchasedIds.has(cert.id);
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
                  <h3 className="font-display text-lg font-medium text-ink">
                    {localize(cert.name, lang)}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {stats
                      ? `${Math.round((stats.correct / stats.answered) * 100)}% ${
                          t.formations.dashboardProgress
                        } ${stats.answered}`
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

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-black/5 pt-5">
                {unlocked ? (
                  <Link
                    to={`/formations/${cert.slug}`}
                    className="brand-gradient rounded-full px-4 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
                  >
                    {t.formations.dashboardContinue}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => openUpgradeModal(cert.slug)}
                    className="brand-gradient rounded-full px-4 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
                  >
                    {t.formations.dashboardGoPro}
                  </button>
                )}
                {unlocked && (
                  <button
                    type="button"
                    onClick={() => handleDownloadPdf(cert)}
                    disabled={downloadingSlug === cert.slug}
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-1.5 text-xs font-medium text-ink transition hover:border-black/20 disabled:opacity-50"
                  >
                    {downloadingSlug === cert.slug
                      ? t.formations.downloadingPdf
                      : t.formations.downloadPdf}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
