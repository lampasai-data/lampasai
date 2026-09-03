import { useLanguage } from "../i18n";
import Reveal from "./Reveal";

// Série d'illustration : progression du volume de données valorisé, 12 mois.
const SERIES = [22, 30, 27, 38, 44, 41, 55, 62, 58, 72, 84, 96];
const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

const CHART_W = 400;
const CHART_H = 112;
const PAD_X = 10;
const PAD_TOP = 14;
const PAD_BOTTOM = 10;

function chartPoints() {
  const max = Math.max(...SERIES);
  const usableW = CHART_W - PAD_X * 2;
  const usableH = CHART_H - PAD_TOP - PAD_BOTTOM;
  return SERIES.map((v, i) => {
    const x = PAD_X + (usableW * i) / (SERIES.length - 1);
    const y = PAD_TOP + usableH * (1 - v / max);
    return [x, y] as const;
  });
}

/** Courbe lissée : une bézier par segment, tangentes horizontales au milieu. */
function smoothPath(points: ReadonlyArray<readonly [number, number]>) {
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0} ${cx} ${y1} ${x1} ${y1}`;
  }
  return d;
}

function DataPulse() {
  const { t } = useLanguage();
  const points = chartPoints();
  const line = smoothPath(points);
  const area = `${line} L ${points[points.length - 1][0]} ${CHART_H} L ${points[0][0]} ${CHART_H} Z`;
  const [lastX, lastY] = points[points.length - 1];

  return (
    <div className="mx-auto w-full max-w-lg rounded-3xl border border-black/[0.07] bg-white/80 p-6 shadow-[0_24px_60px_-40px_rgba(20,20,43,0.5)] backdrop-blur-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
            {t.services.statsLabel}
          </p>
          <p className="mt-1.5 font-heading text-3xl text-ink">{t.services.statsValue}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-green/10 px-2.5 py-1 text-xs font-medium text-green">
          <span className="h-1.5 w-1.5 rounded-full bg-green" aria-hidden="true" />
          {t.services.statsBadge}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        className="mt-5 w-full"
        role="img"
        aria-label={`${t.services.statsLabel} — ${t.services.statsCaption}`}
      >
        <defs>
          <linearGradient id="pulse-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a8896" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#4a8896" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((r) => (
          <line
            key={r}
            x1={PAD_X}
            x2={CHART_W - PAD_X}
            y1={PAD_TOP + (CHART_H - PAD_TOP - PAD_BOTTOM) * r}
            y2={PAD_TOP + (CHART_H - PAD_TOP - PAD_BOTTOM) * r}
            stroke="rgba(20,20,43,0.06)"
            strokeWidth="1"
          />
        ))}

        <path className="chart-area" d={area} fill="url(#pulse-area)" />
        <path
          className="chart-line"
          d={line}
          fill="none"
          stroke="#4a8896"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
        />

        <circle className="chart-dot" cx={lastX} cy={lastY} r="5.5" fill="#7d4e2e" stroke="#fff" strokeWidth="2" />
      </svg>

      <div className="mt-2 flex justify-between px-1 text-[0.625rem] text-muted/70" aria-hidden="true">
        {MONTHS.map((m, i) => (
          <span key={`${m}-${i}`}>{m}</span>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-black/[0.06] pt-5">
        {t.services.stats.map((stat) => (
          <div key={stat.label}>
            <p className="font-display text-lg font-semibold text-ink">{stat.value}</p>
            <p className="mt-0.5 text-[0.6875rem] leading-snug text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Services() {
  const { t } = useLanguage();

  return (
    <section id="services" className="section-band">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <Reveal>
          <span className="eyebrow">{t.services.tag}</span>
          <h2 className="font-heading heading-fit text-ink">
            {t.services.title}
          </h2>
        </Reveal>

        <div className="mt-6 grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <p className="text-block max-w-3xl leading-relaxed text-muted">{t.services.lead}</p>
          </Reveal>

          <Reveal delay={100}>
            <DataPulse />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
