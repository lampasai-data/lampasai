import { useLanguage } from "../i18n";
import Reveal from "./Reveal";

const AVATAR_COLORS = ["#4a8896", "#7d4e2e", "#f5a623"];

function PersonIcon({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8" />
      <path
        d="M4 20c0-3.6 3.6-6 8-6s8 2.4 8 6"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Team() {
  const { t } = useLanguage();

  return (
    <section id="team" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2">
        <Reveal>
          <span className="text-xs font-medium uppercase tracking-widest text-teal-dark">
            {t.team.tag}
          </span>
          <h2 className="mt-3 font-display text-4xl font-semibold text-ink md:text-5xl">
            {t.team.title}
          </h2>
          <p className="mt-5 leading-relaxed text-muted">{t.team.lead}</p>
        </Reveal>

        <div className="flex flex-col gap-4">
          {t.team.roles.map((role, i) => {
            const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
            return (
              <Reveal key={role} delay={i * 80}>
                <div className="flex items-center gap-4 rounded-2xl border border-black/8 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${color}1a` }}
                  >
                    <PersonIcon color={color} />
                  </div>
                  <span className="font-display text-base font-medium text-ink">
                    {role}
                  </span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
