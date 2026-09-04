import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  listCertifications,
  loadQuestions,
  getCertificationLeaderboardPreview,
  type CertificationSummary,
  type LeaderboardPreview,
} from "../lib/quizData";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n";
import { localize } from "../lib/i18nText";
import Dashboard from "../components/Dashboard";
import TrainingRequestForm from "../components/TrainingRequestForm";
import { CERTIFICATION_DOMAINS, EXAM_QUESTION_COUNTS } from "../data/certificationDomains";
import { CERT_LOGOS } from "../data/certLogos";

type Tab = "certifications" | "formations" | "pricing";

function QuestionBankIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" fill="currentColor" fillOpacity="0.12" />
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 9h10M7 12.5h10M7 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function Formations() {
  const [certs, setCerts] = useState<CertificationSummary[]>([]);
  const [tab, setTab] = useState<Tab>("certifications");
  const [downloadingSlug, setDownloadingSlug] = useState<string | null>(null);
  const [pricingSlug, setPricingSlug] = useState<string>("power-bi");
  const [leaderboardPreviews, setLeaderboardPreviews] = useState<
    Record<string, LeaderboardPreview>
  >({});
  const { user, profile, openAuthModal, openAuthModalForUpgrade } = useAuth();
  const { lang, t } = useLanguage();

  useEffect(() => {
    listCertifications().then(setCerts);
  }, []);

  // Anonymized teaser for logged-out visitors only - Dashboard (shown to
  // logged-in users instead of this page) has its own full leaderboard link.
  useEffect(() => {
    if (user || certs.length === 0) return;
    let cancelled = false;
    Promise.all(
      certs.map(async (cert) => {
        const preview = await getCertificationLeaderboardPreview(cert.id);
        return [cert.slug, preview] as const;
      })
    ).then((results) => {
      if (cancelled) return;
      const next: Record<string, LeaderboardPreview> = {};
      for (const [slug, preview] of results) if (preview) next[slug] = preview;
      setLeaderboardPreviews(next);
    });
    return () => {
      cancelled = true;
    };
  }, [certs, user]);

  const isPro = profile?.plan === "pro";

  async function handleDownloadPdf(cert: CertificationSummary) {
    setDownloadingSlug(cert.slug);
    const [data, { exportCertificationPdf }] = await Promise.all([
      loadQuestions(cert.slug),
      import("../lib/pdfExport"),
    ]);
    if (data) {
      exportCertificationPdf(localize(data.name, lang), data.questions, lang);
    }
    setDownloadingSlug(null);
  }

  if (user) {
    return (
      <section className="mx-auto max-w-6xl px-6 pt-4 pb-14">
        <Dashboard certs={certs} />
      </section>
    );
  }

  const tabs = [
    { id: "formations" as const, label: t.formations.tabFormations },
    { id: "certifications" as const, label: t.formations.tabCertifications },
    ...(!isPro ? [{ id: "pricing" as const, label: t.formations.tabPricing }] : []),
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 pt-8 pb-14">
      {/* Texte d'en-tête sans animation d'entrée : il doit être lisible dès
          l'arrivée sur la page, pas se déplier sous les yeux du visiteur. */}
      <h1 className="font-heading max-w-3xl text-3xl text-ink md:text-4xl">
        {t.formations.title}
      </h1>
      <p className="text-block mt-5 max-w-2xl leading-relaxed text-muted">
        {t.formations.lead}
      </p>
      <p className="mt-3 max-w-2xl text-sm font-medium text-teal-dark">
        {t.formations.valueProp}
      </p>

      <div className="mt-10 flex items-center gap-8 border-b border-black/8">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`relative pb-3 text-sm font-semibold transition ${
              tab === item.id ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            {item.label}
            {tab === item.id && (
              <motion.span
                layoutId="formations-tab-underline"
                transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-teal"
              />
            )}
          </button>
        ))}
      </div>

      {/* initial={false} : le premier rendu s'affiche tel quel ; l'animation
          de glissement ne joue qu'au changement d'onglet. */}
      <AnimatePresence mode="wait" initial={false}>
        {tab === "formations" ? (
          <motion.div
            key="formations"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mt-8 flex flex-col items-center rounded-2xl border border-black/8 bg-white px-8 py-14 text-center">
              <span className="brand-gradient inline-flex h-12 w-12 items-center justify-center rounded-full text-lg text-white">
                🚧
              </span>
              <h3 className="mt-5 font-display text-xl font-medium text-ink">
                {t.formations.comingSoonTitle}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
                {t.formations.comingSoonDesc}
              </p>
              <button
                type="button"
                onClick={() => setTab("certifications")}
                className="brand-gradient mt-6 rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {t.formations.comingSoonCta}
              </button>
            </div>

            <div className="mt-8 flex flex-col">
              <h3 className="font-display text-2xl font-semibold text-ink">
                {t.formations.requestTitle}
              </h3>
              <p className="mt-3 leading-relaxed text-muted">{t.formations.requestLead}</p>
              <div className="mt-6">
                <TrainingRequestForm />
              </div>
            </div>
          </motion.div>
        ) : tab === "certifications" ? (
          <motion.div
            key="certifications"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-amber/30 bg-amber/[0.08] px-5 py-3">
              <span className="text-lg leading-none">🎓</span>
              <p className="text-sm font-medium leading-relaxed text-ink">
                {t.formations.certifValue}
              </p>
            </div>

            {!isPro && (
              <div
                className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-black/8 bg-surface px-6 py-4 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="font-display text-base font-medium text-ink">
                    {t.formations.skipFreeTitle}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {t.formations.skipFreeDesc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAuthModal}
                  className="brand-gradient inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-95"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
                    <path
                      d="M5 20c0-3.5 3.13-6 7-6s7 2.5 7 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  {t.formations.createAccountCta}
                </button>
              </div>
            )}

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {certs.map((cert) => (
                <div key={cert.slug}>
                  <div className="group flex h-full flex-col rounded-2xl border border-black/8 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-teal/30 hover:shadow-md">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        to={`/formations/${cert.slug}`}
                        className="flex h-16 w-16 items-center justify-center rounded-xl border border-black/8 bg-surface"
                      >
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
                      </Link>
                      <Link
                        to={`/formations/${cert.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-teal/30 bg-teal/[0.06] px-5 py-2 text-sm font-semibold text-teal-dark transition group-hover:border-teal/50 group-hover:bg-teal/10"
                      >
                        {t.formations.trainFor}
                      </Link>
                    </div>
                    <Link to={`/formations/${cert.slug}`}>
                      <h3 className="mt-4 font-display text-xl font-medium text-ink">
                        {localize(cert.name, lang)}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted">
                        {localize(cert.description, lang)}
                      </p>
                    </Link>

                    {CERTIFICATION_DOMAINS[cert.slug] && (
                      <div className="mt-5 border-t border-black/5 pt-4">
                        <p className="text-xs font-medium text-teal-dark">
                          {t.formations.domainsLabel}
                        </p>
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
                              <span className="shrink-0 font-medium text-muted">
                                {domain.weight}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-auto">
                    {leaderboardPreviews[cert.slug] && (
                      <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-amber/30 bg-amber/[0.08] px-4 py-2">
                        <span className="text-lg leading-none">🏆</span>
                        <p className="whitespace-pre-line text-xs font-semibold leading-tight text-ink">
                          {t.formations.leaderboardTeaser(
                            leaderboardPreviews[cert.slug].topPoints,
                            Math.round(leaderboardPreviews[cert.slug].topRatio * 100)
                          )}
                        </p>
                      </div>
                    )}

                    {isPro && (
                      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                        <Link
                          to={`/formations/${cert.slug}`}
                          className="brand-gradient rounded-full px-4 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
                        >
                          {t.formations.accessQuiz}
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDownloadPdf(cert)}
                          disabled={downloadingSlug === cert.slug}
                          className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-1.5 text-xs font-medium text-ink transition hover:border-black/20 disabled:opacity-50"
                        >
                          <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                            <path
                              d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {downloadingSlug === cert.slug
                            ? t.formations.downloadingPdf
                            : t.formations.downloadPdf}
                        </button>
                      </div>
                    )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : tab === "pricing" ? (
          <motion.div
            key="pricing"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
            className="mt-8 flex justify-center"
          >
            <div className="flex w-full max-w-xl">
              <div className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-teal/25 bg-white p-6 shadow-sm">
                <span className="brand-gradient inline-flex w-fit self-start rounded-full px-3 py-1 text-xs font-semibold text-white">
                  {t.formations.offerBadge}
                </span>
                <div className="mt-3 flex flex-wrap items-end gap-2">
                  <span className="font-display text-4xl font-semibold text-ink">
                    {t.formations.offerPrice}
                  </span>
                  <span className="pb-1 text-sm text-muted">{t.formations.offerPeriod}</span>
                </div>
                <p className="mt-1 text-xs text-muted">{t.formations.offerNote}</p>

                {certs.filter((c) => CERTIFICATION_DOMAINS[c.slug]).length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-muted">{t.formations.offerCertLabel}</p>
                    <div className="mt-2 inline-flex gap-1 rounded-full border border-black/8 bg-surface p-1">
                      {certs
                        .filter((c) => CERTIFICATION_DOMAINS[c.slug])
                        .map((c) => (
                          <button
                            key={c.slug}
                            type="button"
                            onClick={() => setPricingSlug(c.slug)}
                            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                              pricingSlug === c.slug
                                ? "brand-gradient text-white shadow-sm"
                                : "text-muted hover:text-ink"
                            }`}
                          >
                            {localize(c.name, lang)}
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {EXAM_QUESTION_COUNTS[pricingSlug] !== undefined && (
                  <p className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-teal/25 bg-teal/5 px-3 py-1.5 text-xs font-semibold text-teal-dark">
                    <QuestionBankIcon className="h-3.5 w-3.5 shrink-0" />
                    {t.formations.offerQuestionBank(EXAM_QUESTION_COUNTS[pricingSlug])}
                  </p>
                )}

                <p className="mt-4 text-xs font-medium text-teal-dark">{t.formations.domainsLabel}</p>
                <ul className="mt-2 flex flex-col gap-1.5 text-sm text-ink/80">
                  {(CERTIFICATION_DOMAINS[pricingSlug] ?? []).map((domain) => (
                    <li key={domain.label.fr} className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 text-teal-dark">✓</span>
                      {localize(domain.label, lang)}
                    </li>
                  ))}
                </ul>

                <p className="mt-4 text-xs font-medium text-teal-dark">
                  {t.formations.offerFeaturesLabel}
                </p>
                <ul className="mt-2 flex flex-col gap-1.5 text-sm text-ink/80">
                  {t.formations.offerFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 text-teal-dark">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => openAuthModalForUpgrade(pricingSlug)}
                  className="brand-gradient mt-6 inline-flex self-start rounded-full px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  {t.formations.offerCta}
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
