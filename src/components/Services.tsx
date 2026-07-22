import { useLanguage } from "../i18n";
import Reveal from "./Reveal";

export default function Services() {
  const { t } = useLanguage();

  return (
    <section id="services" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal className="max-w-2xl">
        <h2 className="font-display text-4xl font-semibold text-ink md:text-5xl">
          {t.services.title}
        </h2>
        <p className="mt-5 leading-relaxed text-muted">{t.services.lead}</p>
      </Reveal>
    </section>
  );
}
