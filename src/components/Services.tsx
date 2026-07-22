import { useLanguage } from "../i18n";
import Reveal from "./Reveal";

const DATA_NODES = [
  { x: 40, y: 55, color: "#4a8896" },
  { x: 30, y: 120, color: "#1d9e75" },
  { x: 50, y: 185, color: "#7d4e2e" },
  { x: 95, y: 90, color: "#f5a623" },
  { x: 90, y: 155, color: "#4a8896" },
];

function ServicesIllustration() {
  const gemLeft = { x: 190, y: 120 };

  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="svc-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a8896" />
          <stop offset="55%" stopColor="#7d4e2e" />
          <stop offset="100%" stopColor="#f5a623" />
        </linearGradient>
      </defs>

      {DATA_NODES.map((node) => (
        <line
          key={`${node.x}-${node.y}`}
          x1={node.x}
          y1={node.y}
          x2={gemLeft.x}
          y2={gemLeft.y}
          stroke={node.color}
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
      ))}
      {DATA_NODES.map((node) => (
        <circle key={`n-${node.x}-${node.y}`} cx={node.x} cy={node.y} r="5" fill={node.color} />
      ))}

      <circle cx="230" cy="120" r="62" fill="url(#svc-grad)" opacity="0.14" />

      <polygon
        points="230,58 274,120 230,182 186,120"
        fill="url(#svc-grad)"
        opacity="0.92"
      />
      <polygon points="230,58 274,120 230,120" fill="#ffffff" opacity="0.15" />
      <polygon points="186,120 230,120 230,182" fill="#000000" opacity="0.08" />

      <path
        d="M258 76 l4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4 z"
        fill="#f5a623"
      />
      <circle cx="270" cy="150" r="3" fill="#1d9e75" />
    </svg>
  );
}

export default function Services() {
  const { t } = useLanguage();

  return (
    <section id="services" className="border-y border-black/5 bg-surface">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-4xl font-semibold text-ink md:text-5xl">
            {t.services.title}
          </h2>
          <p className="mt-5 leading-relaxed text-muted">{t.services.lead}</p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mx-auto flex h-56 w-full max-w-md items-center justify-center rounded-3xl border border-black/8 bg-white p-6 shadow-sm">
            <ServicesIllustration />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
