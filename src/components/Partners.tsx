import { useLanguage } from "../i18n";
import Reveal from "./Reveal";
import wonjoLogo from "../assets/wonjo.png";

export default function Partners() {
  const { t } = useLanguage();

  return (
    <section id="clients" className="border-y border-black/5 bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-24 text-center">
        <Reveal>
          <h2 className="mx-auto max-w-2xl font-display text-4xl font-semibold text-ink md:text-5xl">
            {t.partners.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted">
            {t.partners.lead}
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-12 flex justify-center">
          <a
            href="https://wonjo.app"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-full max-w-xs flex-col items-center gap-3 rounded-2xl border border-black/8 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-teal/30 hover:shadow-md"
          >
            <img src={wonjoLogo} alt="Wonjo" className="h-16 w-16 object-contain" />
            <span className="brand-gradient-text font-display text-2xl font-bold tracking-tight">
              wonjo
            </span>
            <p className="text-sm leading-relaxed text-muted">
              {t.partners.wonjoDesc}
            </p>
            <span className="mt-1 text-xs font-medium text-teal-dark transition group-hover:text-ink">
              {t.partners.visitSite} →
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
