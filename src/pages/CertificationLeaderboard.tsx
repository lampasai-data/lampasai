import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n";
import { formatNumber, localize } from "../lib/i18nText";
import {
  listCertifications,
  getCertificationLeaderboard,
  type CertificationSummary,
  type LeaderboardEntry,
  type LeaderboardPeriod,
} from "../lib/quizData";
import { CERT_LOGOS } from "../data/certLogos";
import { GOAL_RATIO } from "../lib/goals";
import BackLink from "../components/BackLink";
import AuthPanel from "../components/AuthPanel";
import lampasLogo from "../assets/Logo_Lampas_AI_flavicon.png";
import Avatar from "../components/Avatar";
import { accentOf } from "../lib/certAccent";
import { USER_T } from "../userAreaI18n";



// Only the top 15 are ever listed, 10 at a time. Anyone ranked below that
// gets their own row pinned under the list instead (see PinnedRow usage), so
// the podium stays short without leaving the majority unable to find
// themselves.
const PAGE_SIZE = 10;
const MAX_RANKS = 15;

function GoalArrowIcon({ reached, className = "h-3.5 w-3.5" }: { reached: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d={reached ? "M12 19V5M12 5l-6 6M12 5l6 6" : "M12 5v14M12 19l-6-6M12 19l6-6"}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MONTH_LABEL_OPTIONS: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" };
const DAY_LABEL_OPTIONS: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };

// Monday-start week, matching Postgres's date_trunc('week', now()).
function startOfIsoWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

const MEDAL = ["🥇", "🥈", "🥉"];
const PODIUM_TONE = [
  { bar: "from-[#f5c542] to-[#e8a317]", ring: "ring-[#f5c542]", h: "h-24" },
  { bar: "from-[#d5d9e2] to-[#aab1c0]", ring: "ring-[#c3c8d3]", h: "h-16" },
  { bar: "from-[#e0a878] to-[#c47f4c]", ring: "ring-[#d79a6a]", h: "h-12" },
];

function GoalChip({ entry }: { entry: LeaderboardEntry }) {
  const { t } = useLanguage();
  if (entry.lastRatio === null) return null;
  const reached = entry.lastRatio >= GOAL_RATIO;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
        reached ? "bg-green/12 text-green" : "bg-brown/10 text-brown"
      }`}
      title={reached ? t.quiz.leaderboardGoalReached : t.quiz.leaderboardGoalMissed}
    >
      <GoalArrowIcon reached={reached} className="h-3 w-3" />
      {Math.round(entry.lastRatio * 100)}%
    </span>
  );
}

// The three first places as a podium: first in the middle and tallest.
function Podium({ entries }: { entries: LeaderboardEntry[] }) {
  const { t, lang } = useLanguage();
  const slots = [1, 0, 2].filter((i) => entries[i]); // 2nd, 1st, 3rd
  return (
    <div className="flex items-end justify-center gap-2.5 sm:gap-5">
      {slots.map((i) => {
        const e = entries[i];
        const tone = PODIUM_TONE[i];
        return (
          <div key={e.rank} className="flex w-1/3 max-w-[11.5rem] flex-col items-center text-center">
            <span className="text-2xl leading-none" aria-hidden="true">
              {MEDAL[i]}
            </span>
            <span className={`mt-2 rounded-full ring-4 ${tone.ring} ${e.isYou ? "ring-offset-2 ring-offset-white" : ""}`}>
              <Avatar firstName={e.firstName} size={i === 0 ? 68 : 56} />
            </span>
            <p className={`mt-2 w-full truncate text-sm ${e.isYou ? "font-bold text-ink" : "font-semibold text-ink/85"}`}>
              {e.isYou ? t.quiz.leaderboardYou(e.firstName) : e.firstName}
            </p>
            <p className="font-display text-lg font-semibold text-teal-dark tabular-nums">
              {formatNumber(e.points, lang)}
              <span className="ml-1 text-[11px] font-medium text-muted">{t.quiz.leaderboardPointsUnit}</span>
            </p>
            <div className="mt-1 min-h-5">
              <GoalChip entry={e} />
            </div>
            <div
              className={`mt-3 flex w-full items-start justify-center rounded-t-2xl bg-gradient-to-b ${tone.bar} ${tone.h} pt-2 font-display text-xl font-bold text-white/90 shadow-inner`}
            >
              {e.rank}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LeaderboardRow({ entry, leaderPoints }: { entry: LeaderboardEntry; leaderPoints: number }) {
  const { t, lang } = useLanguage();
  const share = leaderPoints > 0 ? Math.max(4, Math.round((entry.points / leaderPoints) * 100)) : 4;

  return (
    <li
      className={`rounded-2xl border px-4 py-3 sm:px-5 ${
        entry.isYou ? "border-teal/50 bg-teal/[0.06] shadow-sm ring-1 ring-teal/20" : "border-black/8 bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="w-7 shrink-0 text-center font-display text-sm font-bold text-muted tabular-nums">{entry.rank}</span>
        <Avatar firstName={entry.firstName} size={38} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className={`truncate text-sm ${entry.isYou ? "font-bold text-ink" : "font-medium text-ink/85"}`}>
              {entry.isYou ? t.quiz.leaderboardYou(entry.firstName) : entry.firstName}
            </span>
            <GoalChip entry={entry} />
          </div>
          <div className="mt-1.5 h-1 w-full rounded-full bg-black/[0.06]">
            <div className="brand-gradient h-full rounded-full" style={{ width: `${share}%` }} />
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-display text-base font-semibold text-teal-dark tabular-nums">
            {formatNumber(entry.points, lang)}
            <span className="ml-1 text-[11px] font-medium text-muted">{t.quiz.leaderboardPointsUnit}</span>
          </p>
          <p className="text-[11px] text-muted">
            {t.quiz.leaderboardSessions(entry.sessionCount)}
            {entry.avgRatio !== null && entry.sessionCount > 1 && ` · ${t.quiz.leaderboardAvgRatio(Math.round(entry.avgRatio * 100))}`}
          </p>
        </div>
      </div>
    </li>
  );
}

// "Where am I": rank, points, and what separates you from the next goal.
function Standing({ self, entries }: { self: LeaderboardEntry; entries: LeaderboardEntry[] }) {
  const { t, lang } = useLanguage();
  const b = USER_T[lang].board;
  const third = entries[2];
  const first = entries[0];
  const message =
    self.rank === 1
      ? b.leading
      : self.rank <= 3
        ? b.onPodium
        : third
          ? b.gapToPodium(Math.max(1, third.points - self.points + 1))
          : first
            ? b.gapToLeader(Math.max(1, first.points - self.points))
            : "";
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-teal/30 bg-teal/[0.05] px-5 py-4">
      <div>
        <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">{b.yourRank}</p>
        <p className="font-display text-3xl leading-tight font-semibold text-ink tabular-nums">
          #{self.rank}
          {self.rank <= 3 && <span className="ml-1.5 text-2xl">{MEDAL[self.rank - 1]}</span>}
        </p>
      </div>
      <div>
        <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">{t.quiz.leaderboardPointsUnit}</p>
        <p className="font-display text-3xl leading-tight font-semibold text-teal-dark tabular-nums">{formatNumber(self.points, lang)}</p>
      </div>
      {message && <p className="min-w-[12rem] flex-1 text-sm font-medium text-ink">{message}</p>}
    </div>
  );
}

export default function CertificationLeaderboard() {
  const { slug = "" } = useParams();
  const { user, ready } = useAuth();
  const { t, lang } = useLanguage();
  const b = USER_T[lang].board;

  const [period, setPeriod] = useState<LeaderboardPeriod>("month");
  const [cert, setCert] = useState<CertificationSummary | null>(null);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    setPage(0);
    listCertifications().then(async (certs) => {
      if (cancelled) return;
      const found = certs.find((c) => c.slug === slug) ?? null;
      setCert(found);
      if (found) {
        const rows = await getCertificationLeaderboard(found.id, period);
        if (!cancelled) setEntries(rows);
      }
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [slug, user, period]);

  const backLabel = user ? t.quiz.backDashboard : t.quiz.back;
  const locale = lang === "fr" ? "fr-FR" : "en-US";
  const now = new Date();
  const periodLabel =
    period === "month"
      ? now.toLocaleDateString(locale, MONTH_LABEL_OPTIONS)
      : (() => {
          const start = startOfIsoWeek(now);
          const end = new Date(start);
          end.setDate(end.getDate() + 6);
          return `${start.toLocaleDateString(locale, DAY_LABEL_OPTIONS)} – ${end.toLocaleDateString(
            locale,
            DAY_LABEL_OPTIONS
          )}`;
        })();

  // Ranks past MAX_RANKS are dropped outright. The first three go on the
  // podium; the rest of the visible top is listed and paged.
  const ranked = entries.slice(0, MAX_RANKS);
  const podium = ranked.slice(0, 3);
  const rest = ranked.slice(3);
  const pageCount = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
  const pageEntries = rest.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const leaderPoints = ranked[0]?.points ?? 0;
  const self = entries.find((e) => e.isYou) ?? null;
  const pinnedSelf = self && self.rank > MAX_RANKS ? self : null;

  if (!ready) return null;

  if (!user) {
    return (
      <section className="mx-auto max-w-md px-6 py-24">
        <BackLink to="/formations" label={backLabel} />
        <h1 className="mt-6 font-display text-2xl font-semibold text-ink">{t.quiz.leaderboardTitle}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">{t.quiz.leaderboardLoginRequired}</p>
        <div className="mt-6">
          <AuthPanel />
        </div>
      </section>
    );
  }

  const accent = accentOf(slug);

  return (
    <section className="mx-auto max-w-3xl px-6 pt-6 pb-24">
      <BackLink to="/formations" label={backLabel} />

      {/* Header: certification accent, title, period and goal. */}
      <div
        className="mt-5 rounded-3xl border border-black/8 px-6 py-6 sm:px-8"
        style={{ background: `linear-gradient(120deg, ${accent}30 0%, ${accent}0d 55%, var(--color-white) 100%)` }}
      >
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
            <img src={(cert && CERT_LOGOS[cert.slug]) ?? lampasLogo} alt="" className="h-10 w-10 object-contain" />
          </span>
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{t.quiz.leaderboardTitle}</h1>
            {cert && <p className="truncate text-sm font-medium text-ink/70">{localize(cert.name, lang)}</p>}
          </div>
        </div>
        <p className="mt-3 text-sm text-muted">{b.subtitle}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <div className="inline-flex rounded-full border border-black/10 bg-white p-1 shadow-sm">
            {(["week", "month"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  period === p ? "brand-gradient text-white shadow-sm" : "text-muted hover:text-ink"
                }`}
              >
                {p === "week" ? t.quiz.leaderboardWeek : t.quiz.leaderboardMonth}
              </button>
            ))}
          </div>
          <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium capitalize text-muted shadow-sm">
            {periodLabel}
          </span>
          <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-teal-dark shadow-sm">
            {t.quiz.leaderboardGoal(Math.round(GOAL_RATIO * 100))}
          </span>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-center text-sm text-muted">{t.quiz.leaderboardLoading}</p>
        ) : ranked.length === 0 ? (
          <p className="rounded-2xl border border-black/8 bg-white p-8 text-center text-sm text-muted">
            {t.quiz.leaderboardEmpty}
          </p>
        ) : (
          <>
            {self && <Standing self={self} entries={ranked} />}

            <div className="mt-8">
              <Podium entries={podium} />
            </div>

            {rest.length > 0 && (
              <>
                <h2 className="mt-9 mb-3 text-xs font-semibold tracking-wide text-muted uppercase">{b.rest}</h2>
                <ul className="flex flex-col gap-2">
                  {pageEntries.map((entry) => (
                    <LeaderboardRow key={entry.rank} entry={entry} leaderPoints={leaderPoints} />
                  ))}
                </ul>

                {pageCount > 1 && (
                  <div className="mt-5 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-ink shadow-sm transition hover:border-black/20 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {t.quiz.leaderboardPrev}
                    </button>
                    <span className="text-xs font-medium text-muted">{t.quiz.leaderboardPageOf(page + 1, pageCount)}</span>
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                      disabled={page >= pageCount - 1}
                      className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-ink shadow-sm transition hover:border-black/20 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {t.quiz.leaderboardNext}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* You, ranked past the visible top: pinned below so the page
                always answers "and where am I?". */}
            {pinnedSelf && (
              <>
                <div className="mt-6 flex items-center gap-3" aria-hidden="true">
                  <span className="h-px flex-1 bg-black/10" />
                  <span className="text-xs font-medium text-muted">···</span>
                  <span className="h-px flex-1 bg-black/10" />
                </div>
                <ul className="mt-3">
                  <LeaderboardRow entry={pinnedSelf} leaderPoints={leaderPoints} />
                </ul>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
