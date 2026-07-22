import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCertifications, type CertificationSummary } from "../lib/quizData";
import { useAuth } from "../context/AuthContext";
import { FREE_QUESTION_LIMIT, getAnonymousUsage } from "../lib/freeQuota";

export default function Certifications() {
  const [certs, setCerts] = useState<CertificationSummary[]>([]);
  const { user, profile } = useAuth();

  useEffect(() => {
    listCertifications().then(setCerts);
  }, []);

  const used = user ? profile?.free_questions_used ?? 0 : getAnonymousUsage();
  const isPro = profile?.plan === "pro";

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl">
        <span className="text-xs font-medium uppercase tracking-widest text-violet-400">
          Certifications
        </span>
        <h1 className="mt-3 font-display text-3xl font-semibold text-white md:text-4xl">
          Entraîne-toi pour tes certifications data
        </h1>
        <p className="mt-5 leading-relaxed text-white/60">
          20 questions gratuites pour découvrir, sans compte. Ensuite, crée un
          compte (email ou Google) pour continuer à t'entraîner.
        </p>
        {!isPro && (
          <p className="mt-3 text-sm text-violet-300">
            {Math.max(FREE_QUESTION_LIMIT - used, 0)} question(s) gratuite(s)
            restante(s)
          </p>
        )}
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {certs.map((cert) => (
          <Link
            key={cert.slug}
            to={`/certifications/${cert.slug}`}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-violet-400/30 hover:bg-white/[0.06]"
          >
            <h3 className="font-display text-xl font-medium text-white">
              {cert.name}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              {cert.description}
            </p>
            <span className="mt-5 inline-block text-sm font-medium text-violet-300 group-hover:text-violet-200">
              S'entraîner →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
