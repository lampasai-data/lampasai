import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCertifications, type CertificationSummary } from "../lib/quizData";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n";
import { localize } from "../lib/i18nText";
import { FREE_QUESTION_LIMIT, getAnonymousUsage } from "../lib/freeQuota";
import Reveal from "../components/Reveal";
import AuthPanel from "../components/AuthPanel";
import TrainingRequestForm from "../components/TrainingRequestForm";
import powerBiLogo from "../assets/PowerBI.png";
import snowflakeLogo from "../assets/snowflake.png";

const CERT_LOGOS: Record<string, string> = {
  "power-bi": powerBiLogo,
  snowflake: snowflakeLogo,
};

type Tab = "certifications" | "formations";

export default function Formations() {
  const [certs, setCerts] = useState<CertificationSummary[]>([]);
  const [tab, setTab] = useState<Tab>("certifications");
  const [showAuth, setShowAuth] = useState(false);
  const { user, profile } = useAuth();
  const { lang, t } = useLanguage();

  useEffect(() => {
    listCertifications().then(setCerts);
  }, []);

  const used = user ? profile?.free_questions_used ?? 0 : getAnonymousUsage();
  const isPro = profile?.plan === "pro";

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <Reveal className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold text-ink md:text-5xl">
          {t.formations.title}
        </h1>
        <p className="mt-5 leading-relaxed text-muted">{t.formations.lead}</p>
        <p className="mt-3 text-sm font-medium text-teal-dark">{t.formations.valueProp}</p>
      </Reveal>

      <div className="mt-10 flex gap-2 border-b border-black/8">
        {(
          [
            { id: "formations" as const, label: t.formations.tabFormations },
            { id: "certifications" as const, label: t.formations.tabCertifications },
          ]
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`relative -mb-px px-4 py-3 text-sm font-medium transition ${
              tab === item.id
                ? "text-ink"
                : "text-muted hover:text-ink"
            }`}
          >
            {item.label}
            {tab === item.id && (
              <span className="brand-gradient absolute inset-x-0 -bottom-px h-0.5 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {tab === "certifications" ? (
        <>
          {!isPro && (
            <p className="mt-6 text-sm text-teal-dark">
              {Math.max(FREE_QUESTION_LIMIT - used, 0)} {t.formations.remainingFree}
            </p>
          )}

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
                {user ? (
                  <a
                    href="mailto:contact@lampasai.com?subject=Passage%20au%20mode%20Pro"
                    className="brand-gradient shrink-0 rounded-full px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    {t.formations.upgradeCta}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAuth((v) => !v)}
                    className="brand-gradient shrink-0 rounded-full px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                  >
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-black/8 bg-surface">
                      {CERT_LOGOS[cert.slug] ? (
                        <img
                          src={CERT_LOGOS[cert.slug]}
                          alt=""
                          className="h-7 w-7 object-contain"
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
                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <Link
                      to={`/formations/${cert.slug}`}
                      className="text-sm font-medium text-teal-dark group-hover:text-ink"
                    >
                      {t.formations.trainFor}
                    </Link>
                    {isPro && (
                      <Link
                        to={`/formations/${cert.slug}`}
                        className="brand-gradient rounded-full px-4 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
                      >
                        {t.formations.accessQuiz}
                      </Link>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </>
      ) : (
        <>
          <Reveal className="mt-10 rounded-2xl border border-black/8 bg-surface p-10 text-center">
            <h3 className="font-display text-xl font-medium text-ink">
              {t.formations.comingSoonTitle}
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
              {t.formations.comingSoonDesc}
            </p>
          </Reveal>

          <Reveal delay={80} className="mt-10 max-w-2xl">
            <h3 className="font-display text-2xl font-semibold text-ink">
              {t.formations.requestTitle}
            </h3>
            <p className="mt-3 leading-relaxed text-muted">{t.formations.requestLead}</p>
            <div className="mt-6">
              <TrainingRequestForm />
            </div>
          </Reveal>
        </>
      )}
    </section>
  );
}
