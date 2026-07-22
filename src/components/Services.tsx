import { useLanguage } from "../i18n";
import Reveal from "./Reveal";

function ServicesIllustration() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="svc-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a8896" />
          <stop offset="100%" stopColor="#7d4e2e" />
        </linearGradient>
      </defs>

      <circle cx="230" cy="70" r="46" fill="url(#svc-grad)" opacity="0.16" />
      <circle cx="230" cy="70" r="26" fill="url(#svc-grad)" opacity="0.9" />

      {[
        { x: 60, h: 60 },
        { x: 100, h: 96 },
        { x: 140, h: 74 },
        { x: 180, h: 120 },
      ].map((bar) => (
        <rect
          key={bar.x}
          x={bar.x}
          y={210 - bar.h}
          width="24"
          height={bar.h}
          rx="6"
          fill="url(#svc-grad)"
          opacity="0.85"
        />
      ))}

      <line x1="40" y1="210" x2="280" y2="210" stroke="#14142b" strokeOpacity="0.1" strokeWidth="2" />

      <circle cx="72" cy="140" r="4" fill="#f5a623" />
      <circle cx="150" cy="60" r="4" fill="#1d9e75" />
      <circle cx="260" cy="140" r="4" fill="#4a8896" />
    </svg>
  );
}

export default function Services() {
  const { t } = useLanguage();

  return (
    <section id="services" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
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
