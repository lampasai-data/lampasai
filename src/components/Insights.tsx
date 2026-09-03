import { useLanguage } from "../i18n";
import Reveal from "./Reveal";

export default function Insights() {
  const { t } = useLanguage();

  return (
    <section id="insights" className="section-band">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <Reveal>
          <span className="eyebrow">{t.insights.tag}</span>
          <h2 className="font-heading heading-fit text-ink">
            {t.insights.title}
          </h2>
          <p className="text-block mt-6 max-w-4xl leading-relaxed text-muted">{t.insights.lead}</p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {t.insights.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 100} className="h-full">
              <article className="card card-flat p-7">
                <span className="card-index">0{i + 1}</span>
                <h3 className="mt-4 font-display text-lg font-medium text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.desc}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
