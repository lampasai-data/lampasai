import { useState, type ReactNode } from "react";
import type { TimeBucket } from "../../lib/dateRange";

// Small dependency-free charts for the stats tabs: the admin has a handful of
// series, so plain divs beat pulling in a chart library.

export function Kpi({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="rounded-2xl border border-black/8 bg-white p-4">
      <p className="font-display text-2xl font-semibold text-ink tabular-nums">{value}</p>
      <p className="mt-1 text-xs font-semibold text-muted">{label}</p>
      {hint && <p className="mt-0.5 text-[11px] text-muted/80">{hint}</p>}
    </div>
  );
}

export function KpiGrid({ children }: { children: ReactNode }) {
  return <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">{children}</div>;
}

export function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/8 bg-white p-5">
      <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

const axisLabel = (b: TimeBucket, locale: string) =>
  b.unit === "month"
    ? b.start.toLocaleDateString(locale, { month: "short" })
    : b.start.toLocaleDateString(locale, { day: "numeric", month: "numeric" });

export function TimeBars({
  buckets,
  format,
  tooltip,
  locale,
}: {
  buckets: TimeBucket[];
  format: (n: number) => string;
  tooltip: (b: TimeBucket) => string;
  locale: string;
}) {
  const max = Math.max(...buckets.map((b) => b.value), 1);
  // Keep the axis readable: at most ~12 labels whatever the number of bars.
  const step = Math.ceil(buckets.length / 12);
  return (
    <div className="flex h-44 items-end gap-1 sm:gap-1.5" role="img" aria-label={buckets.map(tooltip).join("; ")}>
      {buckets.map((b, i) => (
        <div key={b.start.toISOString()} className="group flex h-full min-w-0 flex-1 flex-col justify-end" title={tooltip(b)}>
          <span className="mb-1 text-center text-[10px] font-semibold text-ink tabular-nums opacity-0 transition group-hover:opacity-100">
            {format(b.value)}
          </span>
          <div
            className={`w-full rounded-t-md transition ${b.value > 0 ? "bg-teal group-hover:bg-teal-dark" : "bg-black/8"}`}
            style={{ height: `${b.value > 0 ? Math.max((b.value / max) * 100, 4) : 2}%` }}
          />
          <span className="mt-1.5 h-3 text-center text-[10px] whitespace-nowrap text-muted">
            {i % step === 0 ? axisLabel(b, locale) : ""}
          </span>
        </div>
      ))}
    </div>
  );
}

// Time series as a line with a soft area: 2px line, recessive grid, points on
// hover (and on every non-empty day while the series is short), and a tooltip.
export function TimeLine({
  buckets,
  format,
  tooltip,
  locale,
}: {
  buckets: TimeBucket[];
  format: (n: number) => string;
  tooltip: (b: TimeBucket) => string;
  locale: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(...buckets.map((b) => b.value), 1);
  const n = buckets.length;
  const step = Math.ceil(n / 12);
  const x = (i: number) => ((i + 0.5) / n) * 100;
  const y = (v: number) => 92 - (v / max) * 80; // 12% headroom top, 8% floor
  const line = buckets.map((b, i) => `${x(i)},${y(b.value)}`).join(" ");
  const area = `${x(0)},92 ${line} ${x(n - 1)},92`;
  const showDots = n <= 31;
  // Which points get a value label: the non-empty ones, at least `gap` apart.
  const gap = n <= 12 ? 1 : Math.ceil(n / 12);
  const labelled = new Set<number>();
  let lastLabelled = -Infinity;
  buckets.forEach((b, i) => {
    if (b.value > 0 && i - lastLabelled >= gap) {
      labelled.add(i);
      lastLabelled = i;
    }
  });

  return (
    <div role="img" aria-label={buckets.map(tooltip).join("; ")}>
      <div className="relative h-44" onMouseLeave={() => setActive(null)}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
          {[12, 52, 92].map((gy) => (
            <line key={gy} x1="0" x2="100" y1={gy} y2={gy} stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" className="text-black/[0.07]" />
          ))}
          <polygon points={area} fill="#4a8896" opacity="0.12" />
          <polyline
            points={line}
            fill="none"
            stroke="#4a8896"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {active !== null && (
            <line x1={x(active)} x2={x(active)} y1="0" y2="92" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" className="text-black/20" />
          )}
        </svg>

        {buckets.map((b, i) =>
          (showDots && b.value > 0) || active === i ? (
            <span
              key={`dot${b.start.toISOString()}`}
              className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-teal-dark"
              style={{ left: `${x(i)}%`, top: `${y(b.value)}%`, opacity: active === null || active === i ? 1 : 0.5 }}
            />
          ) : null
        )}

        {/* Value written above each point. On long series only every few points
            get one, so the numbers never run into each other. */}
        {buckets.map((b, i) =>
          labelled.has(i) && active !== i ? (
            <span
              key={`val${b.start.toISOString()}`}
              className="pointer-events-none absolute text-[10px] font-semibold whitespace-nowrap text-ink tabular-nums"
              style={{
                left: `${Math.min(Math.max(x(i), 4), 96)}%`,
                top: `calc(${y(b.value)}% - 10px)`,
                transform: "translate(-50%, -100%)",
              }}
            >
              {format(b.value)}
            </span>
          ) : null
        )}

        <div className="absolute inset-0 flex">
          {buckets.map((b, i) => (
            <div key={b.start.toISOString()} className="h-full flex-1" onMouseEnter={() => setActive(i)} title={tooltip(b)} />
          ))}
        </div>

        {active !== null && (
          <div
            className="pointer-events-none absolute z-10 -translate-y-full rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs whitespace-nowrap shadow-lg"
            style={{
              left: `${Math.min(Math.max(x(active), 14), 86)}%`,
              top: `calc(${y(buckets[active].value)}% - 12px)`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <span className="font-semibold text-ink">{format(buckets[active].value)}</span>
            <span className="ml-1.5 text-muted">{tooltip(buckets[active]).split(" : ")[0]}</span>
          </div>
        )}
      </div>

      <div className="mt-1.5 flex">
        {buckets.map((b, i) => (
          <span key={b.start.toISOString()} className="h-3 flex-1 text-center text-[10px] whitespace-nowrap text-muted">
            {i % step === 0 ? axisLabel(b, locale) : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

// Few labelled steps as columns (same look as TimeBars): value on top, share
// of the first step as a hint, name underneath. Used for the sign-up journey.
export function StepBars({
  rows,
  total,
}: {
  rows: { label: string; value: number; hint?: string }[];
  // Bars are scaled to it (the first step), so a column is "share of sign-ups".
  total: number;
}) {
  const max = Math.max(total, ...rows.map((r) => r.value), 1);
  return (
    <div
      className="flex h-52 items-end gap-3 sm:gap-4"
      role="img"
      aria-label={rows.map((r) => `${r.label}: ${r.value}${r.hint ? ` (${r.hint})` : ""}`).join("; ")}
    >
      {rows.map((r) => (
        <div key={r.label} className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end" title={`${r.label} : ${r.value}${r.hint ? ` (${r.hint})` : ""}`}>
          <span className="mb-1 text-center text-sm font-semibold text-ink tabular-nums">
            {r.value}
            {r.hint && <span className="ml-1 text-[11px] font-normal text-muted">{r.hint}</span>}
          </span>
          <div
            className={`w-full max-w-20 rounded-t-md transition ${r.value > 0 ? "bg-teal group-hover:bg-teal-dark" : "bg-black/8"}`}
            style={{ height: `${r.value > 0 ? Math.max((r.value / max) * 100, 4) : 2}%`, maxHeight: "calc(100% - 3.5rem)" }}
          />
          <span className="mt-1.5 line-clamp-2 h-8 text-center text-[11px] leading-tight text-muted">{r.label}</span>
        </div>
      ))}
    </div>
  );
}

// Real funnel, laid out left to right: one band per step, each narrowing into
// the next, with the count and its share of the first step above the band and
// the step name (plus the drop from the previous step) underneath. The band
// heights follow the values, so a steep drop reads at a glance. On a phone the
// row scrolls sideways rather than squeezing the labels.
export function FunnelChart({
  rows,
  dropLabel,
}: {
  rows: { label: string; value: number }[];
  dropLabel: (pct: number) => string;
}) {
  const first = Math.max(rows[0]?.value ?? 0, 1);
  const heightOf = (v: number) => Math.min(1, Math.max(v / first, 0.08));
  // Steps are not strictly nested (someone can buy without answering), so a
  // step is never drawn taller than the one before it.
  const heights: number[] = [];
  rows.forEach((r, i) => heights.push(i === 0 ? 1 : Math.min(heightOf(r.value), heights[i - 1])));
  const shades = ["#4a8896", "#5a8a88", "#6d8479", "#837a62", "#7d4e2e"];

  return (
    <div className="overflow-x-auto pb-1">
      <ul
        className="flex min-w-[26rem] sm:min-w-0"
        role="img"
        aria-label={rows.map((r) => `${r.label}: ${r.value}`).join("; ")}
      >
        {rows.map((r, i) => {
          const h = heights[i];
          const nextH = i < rows.length - 1 ? heights[i + 1] : h * 0.82;
          const top = ((1 - h) / 2) * 100;
          const nextTop = ((1 - nextH) / 2) * 100;
          const sharePct = Math.round((r.value / first) * 100);
          const prev = i > 0 ? rows[i - 1].value : null;
          const drop = prev && prev > 0 && r.value < prev ? Math.round((1 - r.value / prev) * 100) : null;
          return (
            <li key={r.label} className="flex min-w-0 flex-1 flex-col">
              <div className="px-1 text-center">
                <span className="block font-display text-lg font-semibold text-ink tabular-nums">{r.value}</span>
                <span className="block text-[11px] text-muted tabular-nums">{sharePct} %</span>
              </div>
              <div
                className="mt-1 h-36 w-full"
                style={{
                  background: `linear-gradient(90deg, ${shades[Math.min(i, shades.length - 1)]}, ${shades[Math.min(i + 1, shades.length - 1)]})`,
                  clipPath: `polygon(0 ${top}%, 100% ${nextTop}%, 100% ${100 - nextTop}%, 0 ${100 - top}%)`,
                  opacity: r.value > 0 ? 1 : 0.35,
                }}
              />
              <div className="mt-2 px-1 text-center">
                <span className="block text-[11px] leading-tight font-medium text-ink">{r.label}</span>
                <span className="mt-0.5 block h-4 text-[11px] text-danger-ink/90">{drop !== null ? dropLabel(drop) : ""}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Classic horizontal bar chart: label on the left, the bar from a shared
// baseline, the value (and share) at the end of the bar.
export function HBars({
  rows,
  format = (n) => String(n),
  total,
}: {
  rows: { label: string; value: number; hint?: string }[];
  format?: (n: number) => string;
  // When set, bars are scaled to it (a share of the whole); otherwise to the largest row.
  total?: number;
}) {
  const max = total ?? Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul
      className="space-y-2.5"
      role="img"
      aria-label={rows.map((r) => `${r.label}: ${format(r.value)}${r.hint ? ` (${r.hint})` : ""}`).join("; ")}
    >
      {rows.map((r) => (
        <li key={r.label} className="group flex items-center gap-3" title={`${r.label} : ${format(r.value)}${r.hint ? ` (${r.hint})` : ""}`}>
          <span className="w-28 shrink-0 text-right text-xs font-medium text-ink sm:w-32">{r.label}</span>
          <div className="relative h-6 min-w-0 flex-1 border-l border-black/15">
            <div
              className="h-full rounded-r-md bg-teal transition group-hover:bg-teal-dark"
              style={{ width: `${r.value > 0 ? Math.max((r.value / max) * 100, 2) : 0}%` }}
            />
          </div>
          <span className="w-20 shrink-0 text-xs text-muted tabular-nums">
            <b className="text-sm font-semibold text-ink">{format(r.value)}</b>
            {r.hint ? ` · ${r.hint}` : ""}
          </span>
        </li>
      ))}
    </ul>
  );
}

// Categorical slots in fixed order (validated light palette: lightness band,
// chroma and adjacent colour-blind separation all pass). Colour only marks
// identity here: values and shares are always spelled out in the legend.
const DONUT_COLORS = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300"];
const MAX_SLICES = DONUT_COLORS.length;

export interface DonutRow {
  label: string;
  value: number;
  hint?: string;
}

// Part-to-whole donut: thin ring, 2px gaps between slices, the total (or the
// hovered slice) in the middle, and a legend that doubles as the data table.
export function Donut({
  rows,
  format,
  totalLabel,
  otherLabel,
}: {
  rows: DonutRow[];
  format: (n: number) => string;
  totalLabel: string;
  otherLabel: string;
}) {
  const [active, setActive] = useState<number | null>(null);

  // More than six slices stop being readable: fold the smallest into "Other".
  const sorted = [...rows].filter((r) => r.value > 0).sort((x, y) => y.value - x.value);
  const slices: DonutRow[] =
    sorted.length > MAX_SLICES
      ? [
          ...sorted.slice(0, MAX_SLICES - 1),
          { label: otherLabel, value: sorted.slice(MAX_SLICES - 1).reduce((sum, r) => sum + r.value, 0) },
        ]
      : sorted;
  const total = slices.reduce((sum, r) => sum + r.value, 0);

  const R = 70;
  const STROKE = 22;
  const GAP = 2;
  const C = 2 * Math.PI * R;
  const pct = (v: number) => (total > 0 ? Math.round((v / total) * 100) : 0);

  let offset = 0;
  const arcs = slices.map((slice, i) => {
    const len = (slice.value / total) * C;
    const arc = { slice, i, dash: Math.max(len - (slices.length > 1 ? GAP : 0), 0.5), offset };
    offset += len;
    return arc;
  });

  const shown = active !== null ? slices[active] : null;

  return (
    <div>
      <div
        className="relative mx-auto h-40 w-40"
        role="img"
        aria-label={slices.map((s) => `${s.label}: ${format(s.value)} (${pct(s.value)} %)`).join("; ")}
      >
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
          <circle cx="100" cy="100" r={R} fill="none" stroke="currentColor" strokeWidth={STROKE} className="text-black/[0.06]" />
          {arcs.map(({ slice, i, dash, offset: off }) => (
            <circle
              key={slice.label}
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke={DONUT_COLORS[i]}
              strokeWidth={active === i ? STROKE + 5 : STROKE}
              strokeDasharray={`${dash} ${C - dash}`}
              strokeDashoffset={-off}
              opacity={active === null || active === i ? 1 : 0.35}
              className="cursor-pointer transition-all duration-150"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <title>{`${slice.label} : ${format(slice.value)} (${pct(slice.value)} %)`}</title>
            </circle>
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-7 text-center">
          <span className="font-display text-lg leading-tight font-semibold text-ink tabular-nums">
            {format(shown ? shown.value : total)}
          </span>
          <span className="mt-0.5 line-clamp-2 text-[11px] leading-tight text-muted">
            {shown ? `${shown.label} · ${pct(shown.value)} %` : totalLabel}
          </span>
        </div>
      </div>

      <ul className="mt-4 space-y-1">
        {slices.map((slice, i) => (
          <li
            key={slice.label}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition ${
              active === i ? "bg-black/[0.05]" : ""
            }`}
          >
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: DONUT_COLORS[i] }} />
            <span className="min-w-0 flex-1 truncate font-medium text-ink">{slice.label}</span>
            <span className="text-xs text-muted tabular-nums">
              {slice.hint ? `${slice.hint} · ` : ""}
              <b className="text-sm font-semibold text-ink">{format(slice.value)}</b> · {pct(slice.value)} %
            </span>
          </li>
        ))}
        {slices.length === 0 && <li className="px-2 py-1.5 text-sm text-muted">-</li>}
      </ul>
    </div>
  );
}
