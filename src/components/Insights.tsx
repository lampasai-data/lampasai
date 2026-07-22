import { useLanguage } from "../i18n";
import Reveal from "./Reveal";

export default function Insights() {
  const { t } = useLanguage();

  return (
    <section id="insights" className="border-y border-black/5 bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-4xl font-semibold text-ink md:text-5xl">
            {t.insights.title}
          </h2>
          <p className="mt-5 leading-relaxed text-muted">{t.insights.lead}</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {t.insights.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <div className="h-full rounded-2xl border border-black/8 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <span className="brand-gradient-text font-display text-3xl font-semibold opacity-40">
                  0{i + 1}
                </span>
                <h3 className="mt-4 font-display text-lg font-medium text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
