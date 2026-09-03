import { useLanguage } from "../i18n";
import Reveal from "./Reveal";

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-10 md:py-14">
      <Reveal>
        <span className="eyebrow">{t.about.tag}</span>
        <h2 className="font-heading heading-fit text-ink">
          {t.about.title}
        </h2>
        <p className="text-block mt-6 max-w-4xl leading-relaxed text-muted">{t.about.lead}</p>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {t.about.cards.map((card, i) => (
          <Reveal key={card.title} delay={i * 80} className="h-full">
            <article className="card card-flat p-6">
              <span className="card-index">0{i + 1}</span>
              <h3 className="mt-4 font-display text-lg font-medium text-ink">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {card.desc}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
