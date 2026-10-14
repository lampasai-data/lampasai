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
import { TOOLS, TOOL_LOGOS } from "../data/toolLogos";
import { accentOf } from "../lib/certAccent";
import { useCertPrices } from "../lib/certPrices";

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

// Round white chip behind a tool logo: black-ink logos (Linux, dbt) would
// vanish on the dark theme without it.
function LogoChip({ src, size = "h-9 w-9" }: { src: string; size?: string }) {
  return (
    <span className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-[#ffffff] p-1.5 shadow-sm ring-1 ring-black/[0.08]`}>
      <img src={src} alt="" className="h-full w-full object-contain" />
    </span>
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
  const prices = useCertPrices(lang);

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
            <div className="relative mt-8 overflow-hidden rounded-3xl border border-black/8 bg-white px-6 py-10 shadow-sm sm:px-10 sm:py-12">
              <div
                className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full opacity-[0.14] blur-3xl"
                style={{ background: "radial-gradient(circle, #4a8896, transparent 70%)" }}
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full opacity-[0.10] blur-3xl"
                style={{ background: "radial-gradient(circle, #7d4e2e, transparent 70%)" }}
                aria-hidden="true"
              />
              <div className="relative max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/[0.07] px-3 py-1 text-xs font-semibold text-teal-dark">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden="true" />
                  {t.formations.comingSoonBadge}
                </span>
                <h3 className="mt-4 font-heading text-3xl text-ink md:text-4xl">
                  {t.formations.comingSoonTitle}
                </h3>
                <p className="mt-4 leading-relaxed text-muted">{t.formations.comingSoonDesc}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {TOOLS.map((tool) => (
                    <li
                      key={tool}
                      className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-surface py-1 pr-3.5 pl-1 text-sm font-medium text-ink"
                    >
                      <LogoChip src={TOOL_LOGOS[tool]} size="h-7 w-7" />
                      {tool}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => setTab("certifications")}
                  className="brand-gradient mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-teal/20 transition hover:opacity-90"
                >
                  {t.formations.comingSoonCta}
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>

            <div className="mt-8">
              <TrainingRequestForm title={t.formations.requestTitle} lead={t.formations.requestLead} />
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
              {certs.map((cert) => {
                const accent = accentOf(cert.slug);
                const domains = CERTIFICATION_DOMAINS[cert.slug];
                return (
                  <div key={cert.slug}>
                    <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black/8 bg-white shadow-sm transition hover:-translate-y-1 hover:border-teal/30 hover:shadow-md">
                      <div
                        className="px-7 pt-6 pb-5"
                        style={{
                          background: `linear-gradient(120deg, ${accent}1a 0%, ${accent}08 60%, transparent 100%)`,
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <Link
                            to={`/formations/${cert.slug}`}
                            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffffff] shadow-sm ring-1 ring-black/[0.06]"
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
                          <p className="mt-2 text-sm leading-relaxed text-muted">
                            {localize(cert.description, lang)}
                          </p>
                        </Link>
                      </div>

                      <div className="flex flex-1 flex-col px-7 pt-4 pb-6">
                        {domains && (
                          <div>
                            <p className="text-xs font-semibold text-muted">{t.formations.domainsLabel}</p>
                            <ul className="mt-3 flex flex-col gap-2.5">
                              {domains.map((domain) => (
                                <li
                                  key={domain.label.fr}
                                  className="flex items-center justify-between gap-3 text-xs text-ink/80"
                                >
                                  <span className="flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal/60" />
                                    {localize(domain.label, lang)}
                                  </span>
                                  <span className="shrink-0 font-semibold text-ink tabular-nums">{domain.weight}</span>
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
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : tab === "pricing" ? (
          <motion.div
            key="pricing"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
            className="mt-8"
          >
            {(() => {
              const domains = CERTIFICATION_DOMAINS[pricingSlug] ?? [];
              const accent = accentOf(pricingSlug);
              return (
                <div className="mx-auto grid grid-cols-1 w-full max-w-5xl overflow-hidden rounded-3xl border border-black/8 bg-white shadow-sm md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                  {/* Purchase panel: what you buy, for how much, and the button. */}
                  <div
                    className="flex flex-col p-7 sm:p-8"
                    style={{
                      background: `linear-gradient(160deg, ${accent}24 0%, ${accent}0c 60%, transparent 100%)`,
                    }}
                  >
                    <span className="brand-gradient inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold text-white">
                      {t.formations.offerBadge}
                    </span>

                    {certs.filter((c) => CERTIFICATION_DOMAINS[c.slug]).length > 0 && (
                      <div className="mt-6">
                        <p className="text-xs font-medium text-muted">{t.formations.offerCertLabel}</p>
                        <div className="mt-2 flex flex-col gap-2">
                          {certs
                            .filter((c) => CERTIFICATION_DOMAINS[c.slug])
                            .map((c) => (
                              <button
                                key={c.slug}
                                type="button"
                                onClick={() => setPricingSlug(c.slug)}
                                aria-pressed={pricingSlug === c.slug}
                                className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-left text-sm font-semibold transition ${
                                  pricingSlug === c.slug
                                    ? "border-teal/50 bg-white text-ink shadow-sm ring-1 ring-teal/30"
                                    : "border-black/8 bg-white/50 text-muted hover:border-teal/30 hover:text-ink"
                                }`}
                              >
                                {CERT_LOGOS[c.slug] && (
                                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ffffff] p-1 ring-1 ring-black/[0.08]">
                                    <img src={CERT_LOGOS[c.slug]} alt="" className="h-full w-full object-contain" />
                                  </span>
                                )}
                                {localize(c.name, lang)}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-7">
                      {/* Hidden until the real price is known, rather than flashing a default. */}
                      <span
                        className={`block font-display text-5xl font-semibold text-ink tabular-nums transition-opacity ${
                          prices.ready ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {prices.price(pricingSlug)}
                      </span>
                      <p className="mt-1 text-sm text-muted">{t.formations.offerPeriod}</p>
                      <p className="mt-1 text-xs text-muted">{t.formations.offerNote}</p>
                    </div>

                    {EXAM_QUESTION_COUNTS[pricingSlug] !== undefined && (
                      <p className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-teal/25 bg-white/70 px-3 py-1.5 text-xs font-semibold text-teal-dark">
                        <QuestionBankIcon className="h-3.5 w-3.5 shrink-0" />
                        {t.formations.offerQuestionBank(EXAM_QUESTION_COUNTS[pricingSlug])}
                      </p>
                    )}

                    <div className="mt-auto pt-8">
                      <button
                        type="button"
                        onClick={() => openAuthModalForUpgrade(pricingSlug)}
                        className="brand-gradient w-full rounded-full px-6 py-3.5 text-sm font-semibold text-white shadow-sm shadow-teal/20 transition hover:opacity-90"
                      >
                        {t.formations.offerCta}
                      </button>
                    </div>
                  </div>

                  {/* Details: what is included, then what the exam covers. */}
                  <div className="flex flex-col gap-7 p-7 sm:p-8">
                    <div>
                      <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                        {t.formations.offerFeaturesLabel}
                      </p>
                      <ul className="mt-3 flex flex-col gap-3 text-sm text-ink/85">
                        {t.formations.offerFeatures.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal/15 text-teal-dark">
                              <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" aria-hidden="true">
                                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                            <span className="leading-snug">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-black/[0.06] pt-6">
                      <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                        {t.formations.domainsLabel}
                      </p>
                      {/* One tile per exam block: the official weight in big
                          figures, the block name under it. */}
                      <ul className="mt-3 grid grid-cols-2 gap-3">
                        {domains.map((domain, i) => (
                          <li
                            key={domain.key}
                            className={`rounded-2xl border border-black/8 bg-surface px-4 py-3 ${
                              domains.length % 2 === 1 && i === domains.length - 1 ? "col-span-2" : ""
                            }`}
                          >
                            <p className="font-display text-2xl font-semibold text-teal-dark tabular-nums">
                              {domain.weight}
                            </p>
                            <p className="mt-0.5 text-xs leading-snug text-ink/80">
                              {localize(domain.label, lang)}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
