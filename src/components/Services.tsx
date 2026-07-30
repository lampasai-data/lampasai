import { useLanguage } from "../i18n";
import Reveal from "./Reveal";
import powerBiLogo from "../assets/icons8-puissance-bi-2021-96.png";

const BARS = [38, 55, 46, 70, 62, 88];

function BIAnalyticsIllustration() {
  const chartW = 280;
  const chartH = 100;
  const gap = 14;
  const barW = (chartW - gap * (BARS.length - 1)) / BARS.length;
  const points = BARS.map((v, i) => {
    const x = i * (barW + gap) + barW / 2;
    const y = chartH - v;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={powerBiLogo} alt="" className="h-7 w-7 object-contain" />
        </div>
        <span className="rounded-full bg-green/10 px-2.5 py-1 text-xs font-semibold text-green">
          +24 %
        </span>
      </div>

      <svg viewBox={`0 0 ${chartW} ${chartH}`} className="mt-4 h-24 w-full" aria-hidden="true">
        <defs>
          <linearGradient id="bi-bar-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4a8896" />
            <stop offset="100%" stopColor="#4a8896" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        {BARS.map((v, i) => (
          <rect
            key={i}
            x={i * (barW + gap)}
            y={chartH - v}
            width={barW}
            height={v}
            rx="4"
            fill={i === BARS.length - 1 ? "#f5a623" : "url(#bi-bar-grad)"}
          />
        ))}
        <polyline points={points} fill="none" stroke="#1d9e75" strokeWidth="2" strokeDasharray="4 3" />
      </svg>

      <div className="mt-3 flex items-center justify-between text-xs text-muted">
        <span>T1</span>
        <span>T2</span>
        <span>T3</span>
        <span>T4</span>
        <span>T5</span>
        <span>T6</span>
      </div>
    </div>
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
          <div className="mx-auto h-56 w-full max-w-md rounded-3xl border border-black/8 bg-white p-6 shadow-sm">
            <BIAnalyticsIllustration />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
