import type { CSSProperties } from "react";
import { useLanguage } from "../i18n";
import Reveal from "./Reveal";

const ROLE_COLORS = ["#4a8896", "#7d4e2e", "#f5a623", "#1d9e75", "#3a6b77"];

/** "Analytics Engineers" -> "AE", "Développeurs" -> "DÉ" */
function initials(role: string) {
  const words = role.split(/[\s/-]+/).filter(Boolean);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return words
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

function RoleChip({ role, color }: { role: string; color: string }) {
  return (
    <span
      className="role-pill inline-flex items-center gap-2 rounded-full border border-black/[0.07] bg-white/70 py-1 pl-1 pr-3.5 backdrop-blur-sm transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_26px_-20px_rgba(20,20,43,0.5)]"
      style={{ "--role": color } as CSSProperties}
    >
      <span className="monogram relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full font-display text-[0.625rem] font-semibold tracking-wide transition-colors duration-300">
        <span className="monogram-fill absolute inset-0 opacity-0 transition-opacity duration-300" aria-hidden="true" />
        <span className="relative">{initials(role)}</span>
      </span>
      <span className="font-display text-xs font-medium text-ink">{role}</span>
    </span>
  );
}

export default function Team() {
  const { t } = useLanguage();

  return (
    <section id="team" className="mx-auto max-w-6xl px-6 py-10 md:py-14">
      <Reveal>
        <span className="eyebrow">{t.team.tag}</span>
        <h2 className="font-heading heading-fit text-ink">
          {t.team.title}
        </h2>
      </Reveal>

      <Reveal delay={80}>
        <p className="text-block mt-6 max-w-4xl leading-relaxed text-muted">{t.team.lead}</p>
      </Reveal>

      <Reveal delay={160}>
        <div className="mt-7 flex flex-wrap gap-2.5">
          {t.team.roles.map((role, i) => (
            <RoleChip key={role} role={role} color={ROLE_COLORS[i % ROLE_COLORS.length]} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
