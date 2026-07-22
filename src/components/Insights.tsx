import { useLanguage } from "../i18n";

export default function Insights() {
  const { t } = useLanguage();

  return (
    <section id="insights" className="border-y border-white/10 bg-white/[0.02]">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <span className="text-xs font-medium uppercase tracking-widest text-violet-400">
            {t.insights.tag}
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-white md:text-4xl">
            {t.insights.title}
          </h2>
          <p className="mt-5 leading-relaxed text-white/60">{t.insights.lead}</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {t.insights.items.map((item, i) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-7"
            >
              <span className="font-display text-3xl font-semibold text-white/15">
                0{i + 1}
              </span>
              <h3 className="mt-4 font-display text-lg font-medium text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
