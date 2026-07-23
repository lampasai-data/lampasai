import { useLanguage } from "../i18n";
import Reveal from "./Reveal";

const AVATAR_COLORS = ["#4a8896", "#7d4e2e", "#f5a623"];

function PersonIcon({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-7 w-7"
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

function Avatar({ role, color, delay }: { role: string; color: string; delay: number }) {
  return (
    <Reveal delay={delay} className="flex flex-col items-center gap-2">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full border border-black/8 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        style={{ backgroundColor: `${color}1a` }}
      >
        <PersonIcon color={color} />
      </div>
      <span className="max-w-[6rem] text-center text-xs font-medium leading-snug text-ink">
        {role}
      </span>
    </Reveal>
  );
}

export default function Team() {
  const { t } = useLanguage();
  const topRow = t.team.roles.slice(0, 2);
  const bottomRow = t.team.roles.slice(2, 5);

  return (
    <section id="team" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
        <Reveal>
          <h2 className="font-display text-4xl font-semibold text-ink md:text-5xl">
            {t.team.title}
          </h2>
          <p className="mt-5 leading-relaxed text-muted">{t.team.lead}</p>
        </Reveal>

        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-8">
            {topRow.map((role, i) => (
              <Avatar
                key={role}
                role={role}
                color={AVATAR_COLORS[i % AVATAR_COLORS.length]}
                delay={i * 80}
              />
            ))}
          </div>
          <div className="flex gap-8">
            {bottomRow.map((role, i) => (
              <Avatar
                key={role}
                role={role}
                color={AVATAR_COLORS[(i + 2) % AVATAR_COLORS.length]}
                delay={(i + 2) * 80}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
