import { useLanguage } from "../i18n";
import Reveal from "./Reveal";

export default function Team() {
  const { t } = useLanguage();

  return (
    <section id="team" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2">
        <Reveal>
          <span className="text-xs font-medium uppercase tracking-widest text-teal-dark">
            {t.team.tag}
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
            {t.team.title}
          </h2>
          <p className="mt-5 leading-relaxed text-muted">{t.team.lead}</p>
        </Reveal>

        <div className="flex flex-col gap-4">
          {t.team.roles.map((role, i) => (
            <Reveal key={role} delay={i * 80}>
              <div className="flex items-center gap-4 rounded-2xl border border-black/8 bg-white p-5 shadow-sm">
                <div className="brand-gradient h-2.5 w-2.5 shrink-0 rounded-full" />
                <span className="font-display text-base font-medium text-ink">
                  {role}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
