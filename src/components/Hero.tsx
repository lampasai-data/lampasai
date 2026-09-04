import { useLanguage } from "../i18n";
import snowflakeLogo from "../assets/snowflake.png";
import powerBiLogo from "../assets/icons8-puissance-bi-2021-96.png";
import dbtLogo from "../assets/dbt.png";
import gcpLogo from "../assets/GCP.png";
import fivetranLogo from "../assets/Fivetran-removebg-preview.png";
import gitLogo from "../assets/icons8-git-96.png";
import linuxLogo from "../assets/icons8-linux-96.png";
import sqlLogo from "../assets/icons8-sql-96.png";

// Ordonné comme le pipeline se lit : ingestion, transformation, stockage,
// restitution, puis les outils transverses.
const STACK_TOOLS: { name: string; logo: string }[] = [
  { name: "Fivetran", logo: fivetranLogo },
  { name: "dbt", logo: dbtLogo },
  { name: "Snowflake", logo: snowflakeLogo },
  { name: "GCP", logo: gcpLogo },
  { name: "SQL", logo: sqlLogo },
  { name: "Power BI", logo: powerBiLogo },
  { name: "Git", logo: gitLogo },
  { name: "Linux", logo: linuxLogo },
];

// Géométrie du pipeline, en unités du viewBox.
const NODE_W = 108;
const NODE_H = 72;
const NODE_Y = 16;
const NODE_X = [6, 176, 346];
const PIPE_W = 460;
const PIPE_H = 104;
const GAP_START = NODE_X[0] + NODE_W;
const GAP_LEN = NODE_X[1] - GAP_START;

/** Source de données : un cylindre. */
function SourceIcon() {
  return (
    <g stroke="#4a8896" strokeWidth="1.6" fill="none">
      <ellipse cx="0" cy="-8" rx="10" ry="4" />
      <path d="M-10 -8v16c0 2.2 4.5 4 10 4s10-1.8 10-4V-8" />
      <path d="M-10 0c0 2.2 4.5 4 10 4s10-1.8 10-4" />
    </g>
  );
}

/** Modèle : trois neurones reliés. */
function ModelIcon() {
  return (
    <g stroke="#7d4e2e" strokeWidth="1.6" fill="none">
      <path d="M-9 -7 L4 -9 M-9 -7 L4 7 M-9 6 L4 -9 M-9 6 L4 7 M4 -9 L9 -1 M4 7 L9 -1" opacity="0.55" />
      <circle cx="-9" cy="-7" r="2.6" fill="#fff" />
      <circle cx="-9" cy="6" r="2.6" fill="#fff" />
      <circle cx="4" cy="-9" r="2.6" fill="#fff" />
      <circle cx="4" cy="7" r="2.6" fill="#fff" />
      <circle cx="9" cy="-1" r="2.6" fill="#7d4e2e" />
    </g>
  );
}

/** Décision : trois barres croissantes. */
function DecisionIcon() {
  return (
    <g fill="#1d9e75">
      <rect x="-10" y="0" width="5" height="10" rx="2" opacity="0.55" />
      <rect x="-2.5" y="-5" width="5" height="15" rx="2" opacity="0.75" />
      <rect x="5" y="-11" width="5" height="21" rx="2" />
    </g>
  );
}

const STAGE_ICONS = [SourceIcon, ModelIcon, DecisionIcon];

function Pipeline() {
  const { t } = useLanguage();

  return (
    <div>
      <svg
        viewBox={`0 0 ${PIPE_W} ${PIPE_H}`}
        className="w-full"
        role="img"
        aria-label={t.hero.pipelineSteps.join(" → ")}
      >
      {/* Connecteurs + points qui circulent */}
      {[0, 1].map((i) => {
        const x = NODE_X[i] + NODE_W;
        const y = NODE_Y + NODE_H / 2;
        return (
          <g key={i}>
            <line
              x1={x}
              x2={x + GAP_LEN}
              y1={y}
              y2={y}
              stroke="rgba(20,20,43,0.12)"
              strokeWidth="1.5"
              strokeDasharray="3 4"
            />
            {[0, 1].map((d) => (
              <circle
                key={d}
                className="pipe-dot"
                cx={x}
                cy={y}
                r="3"
                fill={i === 0 ? "#4a8896" : "#7d4e2e"}
                style={{
                  ["--flow-dist" as string]: `${GAP_LEN}px`,
                  animationDelay: `${i * 0.5 + d * 1.4}s`,
                }}
              />
            ))}
          </g>
        );
      })}

      {/* Étapes */}
      {t.hero.pipelineSteps.map((step, i) => {
        const Icon = STAGE_ICONS[i];
        const cx = NODE_X[i] + NODE_W / 2;
        return (
          <g key={step}>
            <rect
              x={NODE_X[i]}
              y={NODE_Y}
              width={NODE_W}
              height={NODE_H}
              rx="18"
              fill="rgba(255,255,255,0.92)"
              stroke="rgba(20,20,43,0.08)"
            />
            <g transform={`translate(${cx}, ${NODE_Y + NODE_H / 2})`}>
              <Icon />
            </g>
          </g>
        );
      })}
      </svg>

      {/* Libellés en HTML : ils gardent une taille de texte réelle quel que
          soit l'écran, contrairement à du <text> mis à l'échelle par le viewBox.
          Positionnés en % à partir des mêmes coordonnées que les nœuds du SVG
          (NODE_X/NODE_W/PIPE_W) plutôt qu'avec un grid-cols-3 à tiers égaux -
          les nœuds ne sont pas espacés en tiers égaux (le premier est collé au
          bord gauche), donc un grid régulier désalignait les libellés par
          rapport aux icônes au-dessus, plus visible sur les petits écrans. */}
      <div className="relative mt-1.5 h-8 text-center">
        {t.hero.pipelineSteps.map((step, i) => (
          <span
            key={step}
            className="absolute top-0 w-max max-w-[5.5rem] -translate-x-1/2 font-display text-[0.6875rem] font-medium text-ink sm:text-xs"
            style={{ left: `${((NODE_X[i] + NODE_W / 2) / PIPE_W) * 100}%` }}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const { t } = useLanguage();

  return (
    <header id="home" className="glow-grid relative overflow-hidden">
      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 py-12 md:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <span className="mb-5 rounded-full border border-teal/25 bg-teal/[0.07] px-4 py-1.5 text-xs font-medium tracking-wide text-teal-dark">
            {t.hero.eyebrow}
          </span>

          <h1 className="font-heading text-4xl leading-[1.05] text-ink md:text-5xl">
            {t.hero.title[0]}
            <br />
            <span className="brand-gradient-text">{t.hero.title[1]}</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            {t.hero.sub}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="#contact"
              className="brand-gradient rounded-full px-7 py-3.5 text-sm font-medium text-white shadow-lg shadow-teal/20 transition hover:opacity-90 active:scale-95"
            >
              {t.hero.ctaPrimary}
            </a>
            <a
              href="#about"
              className="rounded-full border border-black/10 px-7 py-3.5 text-sm font-medium text-ink/80 transition hover:border-black/20 hover:text-ink active:scale-95"
            >
              {t.hero.ctaGhost}
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div
            className="float-slow absolute -left-6 -top-6 h-20 w-20 rounded-full opacity-30 blur-2xl"
            style={{ background: "radial-gradient(circle, #4a8896, transparent 70%)" }}
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-8 -right-4 h-24 w-24 rounded-full opacity-25 blur-2xl"
            style={{ background: "radial-gradient(circle, #7d4e2e, transparent 70%)", animation: "float-slow 11s ease-in-out infinite" }}
            aria-hidden="true"
          />

          <div className="relative overflow-hidden rounded-3xl border border-black/8 bg-white/75 p-5 shadow-xl backdrop-blur-sm">
            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted">
                  {t.hero.pipelineTitle}
                </p>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-green/10 px-2.5 py-1 text-[0.6875rem] font-medium text-green">
                  <span className="live-dot h-1.5 w-1.5 rounded-full bg-green" aria-hidden="true" />
                  {t.hero.pipelineBadge}
                </span>
              </div>

              <div className="mt-3">
                <Pipeline />
              </div>

              {/* Largeurs fluides : les 8 outils tiennent sur une seule ligne
                  quelle que soit la largeur, en occupant tout l'espace dispo. */}
              <div className="mt-3 flex items-center gap-1.5 border-t border-black/[0.06] pt-4 sm:gap-2">
                {STACK_TOOLS.map((tool) => (
                  <span
                    key={tool.name}
                    title={tool.name}
                    className="flex aspect-square min-w-0 flex-1 items-center justify-center rounded-xl border border-black/[0.07] bg-white/90 p-1.5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-2"
                  >
                    <img src={tool.logo} alt={tool.name} className="h-full w-full object-contain" />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs font-medium uppercase tracking-widest text-muted">
            {t.hero.toolsLabel}
          </p>
        </div>
      </div>
    </header>
  );
}
