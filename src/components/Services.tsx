import { useLanguage } from "../i18n";
import Reveal from "./Reveal";

export default function Services() {
  const { t } = useLanguage();

  return (
    <section id="services" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal className="max-w-2xl">
        <span className="text-xs font-medium uppercase tracking-widest text-teal-dark">
          {t.services.tag}
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
          {t.services.title}
        </h2>
        <p className="mt-5 leading-relaxed text-muted">{t.services.lead}</p>
      </Reveal>
    </section>
  );
}
