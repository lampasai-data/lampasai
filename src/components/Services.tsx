import { useLanguage } from "../i18n";
import Reveal from "./Reveal";

// Série d'illustration : progression du volume de données valorisé, 12 mois.
const SERIES = [22, 30, 27, 38, 44, 41, 55, 62, 58, 72, 84, 96];
const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

const CHART_W = 400;
const CHART_H = 132;
const PAD_X = 6;
const PAD_TOP = 18;
const PAD_BOTTOM = 4;
const BAR_W = 20;

const usableW = CHART_W - PAD_X * 2;
const usableH = CHART_H - PAD_TOP - PAD_BOTTOM;
const MAX = Math.max(...SERIES);
const slot = usableW / SERIES.length;

const barX = (i: number) => PAD_X + slot * i + (slot - BAR_W) / 2;
const barH = (v: number) => (usableH * v) / MAX;
const barY = (v: number) => CHART_H - PAD_BOTTOM - barH(v);

// Tendance : moyenne glissante sur 3 mois, qui gomme les creux de la série.
const TREND = SERIES.map((_, i) => {
  const window = SERIES.slice(Math.max(0, i - 2), i + 1);
  return window.reduce((sum, v) => sum + v, 0) / window.length;
});

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
  const trendPoints = TREND.map((v, i) => [barX(i) + BAR_W / 2, barY(v)] as const);
  const trendLine = smoothPath(trendPoints);
  const [lastX, lastY] = trendPoints[trendPoints.length - 1];

  return (
    <div className="relative mx-auto w-full max-w-lg overflow-hidden rounded-3xl border border-black/[0.07] bg-white/80 p-6 shadow-[0_24px_60px_-40px_rgba(20,20,43,0.5)] backdrop-blur-md">
      <div
        className="pointer-events-none absolute -top-16 -right-16 h-52 w-52 rounded-full opacity-[0.16] blur-3xl"
        style={{ background: "radial-gradient(circle, #4a8896, transparent 70%)" }}
        aria-hidden="true"
      />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
            {t.services.statsLabel}
          </p>
          <p className="mt-1.5 font-heading text-3xl text-ink">{t.services.statsValue}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-green/10 px-2.5 py-1 text-xs font-medium text-green">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-green" aria-hidden="true" />
          {t.services.statsBadge}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        className="relative mt-5 w-full overflow-visible"
        role="img"
        aria-label={`${t.services.statsLabel} - ${t.services.statsCaption}`}
      >
        <defs>
          <linearGradient id="bar-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a8896" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#4a8896" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="bar-fill-last" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--pipe-model)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#4a8896" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="trend-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4a8896" />
            <stop offset="100%" stopColor="var(--pipe-model)" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((r) => (
          <line
            key={r}
            x1={PAD_X}
            x2={CHART_W - PAD_X}
            y1={PAD_TOP + usableH * r}
            y2={PAD_TOP + usableH * r}
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 5"
            className="text-ink/15"
          />
        ))}

        {SERIES.map((v, i) => (
          <rect
            key={i}
            className="chart-bar"
            style={{ ["--i" as string]: i }}
            x={barX(i)}
            y={barY(v)}
            width={BAR_W}
            height={barH(v)}
            rx="6"
            fill={i === SERIES.length - 1 ? "url(#bar-fill-last)" : "url(#bar-fill)"}
          />
        ))}

        <path
          className="chart-line"
          d={trendLine}
          fill="none"
          stroke="url(#trend-stroke)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
        />
        <circle className="chart-dot" cx={lastX} cy={lastY} r="9" fill="var(--pipe-model)" opacity="0.2" />
        <circle className="chart-dot" cx={lastX} cy={lastY} r="5" fill="var(--pipe-model)" stroke="var(--color-white)" strokeWidth="2" />
      </svg>

      <div className="relative mt-2 flex px-[6px] text-[0.625rem] text-muted/70" aria-hidden="true">
        {MONTHS.map((m, i) => (
          <span key={`${m}-${i}`} className="flex-1 text-center">
            {m}
          </span>
        ))}
      </div>

      <div className="relative mt-5 grid grid-cols-3 gap-3 border-t border-black/[0.06] pt-5">
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
