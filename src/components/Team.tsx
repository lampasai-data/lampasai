import { useLanguage } from "../i18n";

export default function Team() {
  const { t } = useLanguage();

  return (
    <section id="team" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2">
        <div>
          <span className="text-xs font-medium uppercase tracking-widest text-violet-400">
            {t.team.tag}
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-white md:text-4xl">
            {t.team.title}
          </h2>
          <p className="mt-5 leading-relaxed text-white/60">{t.team.lead}</p>
        </div>

        <div className="flex flex-col gap-4">
          {t.team.roles.map((role) => (
            <div
              key={role}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#35e5b8]" />
              <span className="font-display text-base font-medium text-white">
                {role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
