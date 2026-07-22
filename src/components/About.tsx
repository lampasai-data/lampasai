import { useLanguage } from "../i18n";

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl">
        <span className="text-xs font-medium uppercase tracking-widest text-violet-400">
          {t.about.tag}
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold text-white md:text-4xl">
          {t.about.title}
        </h2>
        <p className="mt-5 leading-relaxed text-white/60">{t.about.lead}</p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {t.about.cards.map((card) => (
          <div
            key={card.title}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-violet-400/30 hover:bg-white/[0.06]"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
              ◆
            </div>
            <h3 className="font-display text-lg font-medium text-white">
              {card.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
