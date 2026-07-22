import { useLanguage } from "../i18n";
import Reveal from "./Reveal";

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal className="max-w-2xl">
        <span className="text-xs font-medium uppercase tracking-widest text-teal-dark">
          {t.about.tag}
        </span>
        <h2 className="mt-3 font-display text-4xl font-semibold text-ink md:text-5xl">
          {t.about.title}
        </h2>
        <p className="mt-5 leading-relaxed text-muted">{t.about.lead}</p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {t.about.cards.map((card, i) => (
          <Reveal key={card.title} delay={i * 80}>
            <div className="group h-full rounded-2xl border border-black/8 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-teal/30 hover:shadow-md">
              <div className="brand-gradient mb-4 flex h-10 w-10 items-center justify-center rounded-lg text-white">
                ◆
              </div>
              <h3 className="font-display text-lg font-medium text-ink">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {card.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
