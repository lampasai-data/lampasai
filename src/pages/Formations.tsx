import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCertifications, loadQuestions, type CertificationSummary } from "../lib/quizData";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n";
import { localize } from "../lib/i18nText";
import Reveal from "../components/Reveal";
import AuthPanel from "../components/AuthPanel";
import TrainingRequestForm from "../components/TrainingRequestForm";
import { CERTIFICATION_DOMAINS } from "../data/certificationDomains";
import { CERT_LOGOS } from "../data/certLogos";

type Tab = "certifications" | "formations" | "pricing";

export default function Formations() {
  const [certs, setCerts] = useState<CertificationSummary[]>([]);
  const [tab, setTab] = useState<Tab>("certifications");
  const [showAuth, setShowAuth] = useState(false);
  const [downloadingSlug, setDownloadingSlug] = useState<string | null>(null);
  const [pricingSlug, setPricingSlug] = useState<string>("power-bi");
  const { user, profile } = useAuth();
  const { lang, t } = useLanguage();

  useEffect(() => {
    listCertifications().then(setCerts);
  }, []);

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

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <Reveal className="max-w-2xl">
        {profile?.first_name && (
          <p className="mb-2 text-sm font-medium text-teal-dark">
            Bienvenue {profile.first_name} 👋
          </p>
        )}
        <h1 className="font-display text-4xl font-semibold text-ink md:text-5xl">
          {t.formations.title}
        </h1>
        <p className="mt-5 leading-relaxed text-muted">{t.formations.lead}</p>
        <p className="mt-3 text-sm font-medium text-teal-dark">{t.formations.valueProp}</p>
      </Reveal>

      <div className="mt-10 inline-flex gap-1 rounded-full border border-black/8 bg-surface p-1.5">
        {(
          [
            { id: "formations" as const, label: t.formations.tabFormations },
            { id: "certifications" as const, label: t.formations.tabCertifications },
            ...(!isPro
              ? [{ id: "pricing" as const, label: t.formations.tabPricing }]
              : []),
          ]
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              tab === item.id
                ? "bg-teal text-white shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "certifications" ? (
        <>
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber/30 bg-amber/[0.08] px-5 py-4">
            <span className="text-lg leading-none">💡</span>
            <p className="text-sm font-medium leading-relaxed text-ink">
              {t.formations.certifValue}
            </p>
          </div>

          {!isPro && (
            <Reveal delay={40} className="mt-6">
              <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-black/8 bg-surface p-6 sm:flex-row sm:items-center">
                <div>
                  <p className="font-display text-base font-medium text-ink">
                    {t.formations.skipFreeTitle}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {t.formations.skipFreeDesc}
                  </p>
                </div>
                {!user && (
                  <button
                    type="button"
                    onClick={() => setShowAuth((v) => !v)}
                    className="brand-gradient inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-md shadow-teal/20 transition hover:opacity-90 active:scale-95"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
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
                )}
              </div>
              {showAuth && !user && (
                <div className="mt-5">
                  <AuthPanel />
                </div>
              )}
            </Reveal>
          )}

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {certs.map((cert, i) => (
              <Reveal key={cert.slug} delay={i * 80}>
                <div className="group h-full rounded-2xl border border-black/8 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-teal/30 hover:shadow-md">
                  <Link to={`/formations/${cert.slug}`}>
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-black/8 bg-surface">
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

                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <Link
                      to={`/formations/${cert.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-teal/30 bg-teal/[0.06] px-4 py-1.5 text-xs font-semibold text-teal-dark transition group-hover:border-teal/50 group-hover:bg-teal/10"
                    >
                      {t.formations.trainFor}
                    </Link>
                    {isPro && (
                      <>
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
                      </>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </>
      ) : tab === "pricing" ? (
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-stretch">
          <Reveal delay={40} className="flex">
            <div className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-teal/25 bg-white p-8 shadow-sm">
              <span className="brand-gradient inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white">
                {t.formations.offerBadge}
              </span>
              <div className="mt-4 flex flex-wrap items-end gap-2">
                <span className="font-display text-4xl font-semibold text-ink">
                  {t.formations.offerPrice}
                </span>
                <span className="pb-1 text-sm text-muted">{t.formations.offerPeriod}</span>
              </div>
              <p className="mt-1 text-xs text-muted">{t.formations.offerNote}</p>

              {certs.filter((c) => CERTIFICATION_DOMAINS[c.slug]).length > 0 && (
                <div className="mt-5">
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

              <p className="mt-5 text-xs font-medium text-teal-dark">{t.formations.domainsLabel}</p>
              <ul className="mt-2.5 flex flex-col gap-2 text-sm text-ink/80">
                {(CERTIFICATION_DOMAINS[pricingSlug] ?? []).map((domain) => (
                  <li key={domain.label.fr} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 text-teal-dark">✓</span>
                    {localize(domain.label, lang)}
                  </li>
                ))}
              </ul>
              <a
                href={`mailto:contact@lampasai.com?subject=Passage%20au%20mode%20Pro%20(9%2C99%E2%82%AC%20%2F%203%20mois%20-%20${encodeURIComponent(
                  certs.find((c) => c.slug === pricingSlug)?.name.fr ?? pricingSlug
                )})`}
                className="brand-gradient mt-8 inline-flex self-start rounded-full px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 lg:mt-auto"
              >
                {t.formations.offerCta}
              </a>
            </div>
          </Reveal>

          <Reveal delay={80} className="flex flex-col">
            <h3 className="font-display text-2xl font-semibold text-ink">
              {t.formations.requestTitle}
            </h3>
            <p className="mt-3 leading-relaxed text-muted">{t.formations.requestLead}</p>
            <div className="mt-6 flex-1">
              <TrainingRequestForm />
            </div>
          </Reveal>
        </div>
      ) : null}
    </section>
  );
}
