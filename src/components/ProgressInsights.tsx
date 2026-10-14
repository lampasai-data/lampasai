import { Link } from "react-router-dom";
import { useLanguage } from "../i18n";
import { CERTIFICATION_DOMAINS } from "../data/certificationDomains";
import { GOAL_RATIO } from "../lib/goals";
import type { CertInsights } from "../lib/insights";
import { localize } from "../lib/i18nText";
import type { CertificationSummary } from "../lib/quizData";
import { accentOf } from "../lib/certAccent";
import { USER_T } from "../userAreaI18n";

// Fewer answers than this and a domain's percentage says little: it is shown
// without judgement.
const MIN_ANSWERS = 5;
const LAST_EXAMS = 3;
const TREND_POINTS = 8;

const pct = (r: number) => Math.round(r * 100);
const tone = (r: number) => (r >= GOAL_RATIO ? "text-green" : r >= 0.6 ? "text-teal" : "text-amber");
const barColor = (r: number) => (r >= GOAL_RATIO ? "bg-green" : r >= 0.6 ? "bg-teal" : "bg-amber");

// Readiness as a ring: the arc is the score, the tick is the goal.
function Ring({ ratio }: { ratio: number }) {
  const R = 46;
  const C = 2 * Math.PI * R;
  const angle = GOAL_RATIO * 2 * Math.PI - Math.PI / 2;
  const tick = (r: number) => [58 + r * Math.cos(angle), 58 + r * Math.sin(angle)];
  const [x1, y1] = tick(R - 7);
  const [x2, y2] = tick(R + 7);
  return (
    <div className="relative h-[92px] w-[92px] shrink-0">
      <svg viewBox="0 0 116 116" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="58" cy="58" r={R} fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="10" className="text-ink" />
        <circle
          cx="58"
          cy="58"
          r={R}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${Math.min(1, ratio) * C} ${C}`}
          className={tone(ratio)}
        />
      </svg>
      <svg viewBox="0 0 116 116" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-ink/70" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-2xl font-semibold text-ink tabular-nums">
          {pct(ratio)}
          <span className="text-base text-muted"> %</span>
        </span>
      </div>
    </div>
  );
}

function Trend({ exams, accent }: { exams: CertInsights["exams"]; accent: string }) {
  const { lang } = useLanguage();
  const t = USER_T[lang].insights;
  const trend = exams.slice(-TREND_POINTS);
  if (trend.length < 2) return null;
  const W = 220;
  const H = 52;
  const x = (i: number) => (i / (trend.length - 1)) * (W - 8) + 4;
  const y = (r: number) => H - 6 - r * (H - 12);
  const line = trend.map((e, i) => `${x(i)},${y(e.ratio)}`).join(" ");
  const area = `${x(0)},${H} ${line} ${x(trend.length - 1)},${H}`;
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold text-muted">{t.trendTitle}</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-1 w-full max-w-[16rem]" role="img" aria-label={t.trendTitle}>
        <defs>
          <linearGradient id={`trend-${accent.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" x2={W} y1={y(GOAL_RATIO)} y2={y(GOAL_RATIO)} stroke="currentColor" strokeOpacity="0.25" strokeDasharray="3 3" className="text-ink" />
        <polygon points={area} fill={`url(#trend-${accent.slice(1)})`} />
        <polyline points={line} fill="none" stroke={accent} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
        {trend.map((e, i) => (
          <circle key={e.completedAt} cx={x(i)} cy={y(e.ratio)} r="3" fill="var(--color-white)" stroke={accent} strokeWidth="2" />
        ))}
      </svg>
    </div>
  );
}

function Domains({ slug, data }: { slug: string; data: CertInsights }) {
  const { lang } = useLanguage();
  const t = USER_T[lang].insights;
  const declared = CERTIFICATION_DOMAINS[slug] ?? [];
  const stats = new Map(data.domains.map((d) => [d.key, d]));
  const rows = declared
    .map((d) => ({ domain: d, stat: stats.get(d.key) }))
    .filter((r) => r.stat && r.stat.answered > 0)
    .map((r) => ({ ...r, ratio: r.stat!.correct / r.stat!.answered, enough: r.stat!.answered >= MIN_ANSWERS }));

  const judged = rows.filter((r) => r.enough);
  if (judged.length < 2) return <p className="text-sm text-muted">{t.domainsNeedMore}</p>;

  const weakest = new Set(
    [...judged]
      .sort((a, b) => a.ratio - b.ratio)
      .filter((r) => r.ratio < GOAL_RATIO)
      .slice(0, 2)
      .map((r) => r.domain.key)
  );
  const ordered = [...rows].sort((a, b) => Number(b.enough) - Number(a.enough) || a.ratio - b.ratio);

  return (
    <ul className="space-y-2">
      {ordered.map(({ domain, stat, ratio, enough }) => (
        <li key={domain.key}>
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="flex min-w-0 items-center gap-2">
              <span className={`h-2 w-2 shrink-0 rounded-full ${enough ? barColor(ratio) : "bg-black/20"}`} />
              <span className="truncate font-medium text-ink">{localize(domain.shortLabel, lang)}</span>
              {weakest.has(domain.key) && (
                <span className="shrink-0 rounded-full bg-amber/20 px-2 py-0.5 text-[10px] font-semibold text-amber-ink">
                  {t.domainsWeakest}
                </span>
              )}
            </span>
            <span className="flex shrink-0 items-baseline gap-2">
              <span className="text-[10.5px] text-muted">{t.answeredShort(stat!.answered)}</span>
              <span className="w-9 text-right font-semibold text-ink tabular-nums">{enough ? `${pct(ratio)} %` : "-"}</span>
            </span>
          </div>
          <div className="mt-1 h-1 rounded-full bg-black/[0.07]">
            <div
              className={`h-full rounded-full ${enough ? barColor(ratio) : "bg-black/20"}`}
              style={{ width: `${Math.max(2, pct(ratio))}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

// The one thing worth doing next: revise the weakest domain. Null when there
// is nothing weak to point at.
function weakestStep(slug: string, data: CertInsights, lang: "fr" | "en") {
  const declared = CERTIFICATION_DOMAINS[slug] ?? [];
  const weakest = data.domains
    .filter((d) => d.answered >= MIN_ANSWERS && d.correct / d.answered < GOAL_RATIO)
    .sort((a, b) => a.correct / a.answered - b.correct / b.answered)[0];
  const domain = weakest ? declared.find((d) => d.key === weakest.key) : undefined;
  if (!domain) return null;
  return {
    label: USER_T[lang].insights.reviseNamed(localize(domain.shortLabel, lang)),
    to: `/formations/${slug}?mode=exam&domain=${encodeURIComponent(domain.key)}`,
  };
}

// Level of the last exams, for the badge in the card header.
export function ReadinessBadge({ data }: { data: CertInsights }) {
  const { lang } = useLanguage();
  const t = USER_T[lang].insights;
  const last = data.exams.slice(-LAST_EXAMS);
  if (last.length === 0) return null;
  const ratio = last.reduce((s, e) => s + e.ratio, 0) / last.length;
  const level = ratio >= GOAL_RATIO ? t.levelReady : ratio >= 0.6 ? t.levelOnTrack : t.levelBuilding;
  return (
    <span className={`shrink-0 rounded-full bg-black/[0.05] px-2.5 py-0.5 text-xs font-semibold ${tone(ratio)}`}>
      {level}
    </span>
  );
}

// The analysis of one certification, inside its card: readiness ring and
// trend, success per domain, and the one suggested next step.
export function CertAnalysis({ cert, data }: { cert: CertificationSummary; data: CertInsights }) {
  const { lang } = useLanguage();
  const t = USER_T[lang].insights;
  const accent = accentOf(cert.slug);
  const last = data.exams.slice(-LAST_EXAMS);
  const ratio = last.length ? last.reduce((s, e) => s + e.ratio, 0) / last.length : null;
  const step = weakestStep(cert.slug, data, lang);

  return (
    <div className="flex flex-1 flex-col">
      <p className="text-sm font-semibold text-muted">{t.readinessTitle}</p>
      {ratio === null ? (
        <p className="mt-2 text-sm text-muted">{t.readinessNone}</p>
      ) : (
        <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-3">
          <Ring ratio={ratio} />
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <ReadinessBadge data={data} />
                <p className="text-sm font-semibold text-ink">{t.goal(pct(GOAL_RATIO))}</p>
              </div>
              <p className="mt-0.5 text-xs text-muted">{t.readinessBasis(last.length)}</p>
            </div>
            <Trend exams={data.exams} accent={accent} />
          </div>
        </div>
      )}

      <p className="mt-4 text-sm font-semibold text-muted">{t.domainsTitle}</p>
      <div className="mt-2.5">
        <Domains slug={cert.slug} data={data} />
      </div>

      {step && (
        <div className="mt-auto pt-4">
        <Link
          to={step.to}
          className="group inline-flex items-center gap-2 rounded-full border border-teal/30 bg-gradient-to-r from-teal/10 via-teal/5 to-brown/10 py-2 pr-3 pl-4 text-xs font-semibold text-teal-dark shadow-sm transition hover:border-teal/60 hover:from-teal/20 hover:to-brown/15"
        >
          {step.label}
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true">
            <path d="m6 17 5-5-5-5M13 17l5-5-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        </div>
      )}
    </div>
  );
}

// What a certification without access shows in place of the analysis: a
// blurred, invented sample (never the person's data) with the way to unlock.
export function LockedPreview({
  onUnlock,
  onVoucher,
  voucherLabel,
}: {
  onUnlock: () => void;
  onVoucher: () => void;
  voucherLabel: string;
}) {
  const { lang } = useLanguage();
  const l = USER_T[lang].locked;
  const sample = [78, 64, 52, 90];
  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/8">
      {/* The blurred sample is only a backdrop: the card is as tall as the
          message in front of it, so nothing gets clipped. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none p-5 blur-[5px]">
        <p className="font-display text-3xl font-semibold text-ink">72 %</p>
        <div className="mt-2 h-2.5 rounded-full bg-black/[0.07]">
          <div className="h-full w-[72%] rounded-full bg-teal" />
        </div>
        <ul className="mt-5 space-y-3">
          {sample.map((v, i) => (
            <li key={v}>
              <div className="flex justify-between text-xs">
                <span className="font-medium text-ink">{"▮".repeat(6 + i)}</span>
                <span className="font-semibold text-ink">{v} %</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-black/[0.07]">
                <div className="h-full rounded-full bg-teal" style={{ width: `${v}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <span className="absolute top-3 right-3 rounded-full bg-black/[0.06] px-2.5 py-0.5 text-[10.5px] font-semibold tracking-wide text-muted uppercase">
        {l.example}
      </span>

      <div className="relative flex justify-center bg-white/80 px-5 py-4">
        <div className="w-full max-w-md text-center">
          <div className="flex items-center justify-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal/12 text-teal-dark">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8 11V8a4 4 0 118 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <p className="font-display text-lg font-semibold text-ink">{l.title}</p>
          </div>
          <p className="mt-1.5 text-xs text-muted">{l.lead}</p>
          <ul className="mx-auto mt-2.5 w-fit space-y-1.5 text-left text-[13px] text-ink">
            {l.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 h-4 w-4 shrink-0 text-green" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={onUnlock}
              className="brand-gradient rounded-full px-4 py-1.5 text-xs font-semibold text-white shadow-sm shadow-teal/20 transition hover:opacity-90"
            >
              {l.cta}
            </button>
            <button
              type="button"
              onClick={onVoucher}
              className="rounded-full border-2 border-teal-dark bg-white px-3 py-1.5 text-xs font-bold text-ink shadow-sm transition hover:bg-teal/10"
            >
              {voucherLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
