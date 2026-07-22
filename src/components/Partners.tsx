import { useLanguage } from "../i18n";

export default function Partners() {
  const { t } = useLanguage();

  return (
    <section id="clients" className="border-y border-white/10 bg-white/[0.02]">
      <div className="mx-auto max-w-6xl px-6 py-24 text-center">
        <span className="text-xs font-medium uppercase tracking-widest text-violet-400">
          {t.partners.tag}
        </span>
        <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-semibold text-white md:text-4xl">
          {t.partners.title}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-white/60">
          {t.partners.lead}
        </p>
      </div>
    </section>
  );
}
