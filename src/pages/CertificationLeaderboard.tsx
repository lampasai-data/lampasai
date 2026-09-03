import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n";
import { localize } from "../lib/i18nText";
import {
  listCertifications,
  getCertificationLeaderboard,
  type CertificationSummary,
  type LeaderboardEntry,
  type LeaderboardPeriod,
} from "../lib/quizData";
import { CERT_LOGOS } from "../data/certLogos";
import BackLink from "../components/BackLink";
import AuthPanel from "../components/AuthPanel";
import lampasLogo from "../assets/Logo_Lampas_AI_flavicon.png";

// Static, purely motivational reference point shown alongside the ranking -
// not tied to the certification's real pass threshold (getPassThreshold).
const GOAL_RATIO = 0.85;

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

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  const { t } = useLanguage();
  // Hidden rather than shown as 0% when the value is missing, so a database
  // that predates migration 023 degrades to "no indicator" instead of
  // claiming every single player just bombed their last run.
  const reached = entry.lastRatio !== null && entry.lastRatio >= GOAL_RATIO;

  return (
    <li
      className={`flex items-center justify-between gap-3 rounded-2xl border px-5 py-3.5 ${
        entry.isYou ? "border-teal/40 bg-teal/[0.06] shadow-sm" : "border-black/8 bg-white"
      }`}
    >
      <span className="flex min-w-0 items-center gap-3.5">
        <span className="w-6 shrink-0 text-right font-display text-sm font-semibold text-muted">
          {entry.rank}
        </span>
        <span
          className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
            entry.isYou ? "bg-teal/20 text-teal-dark" : "bg-black/5 text-ink/70"
          }`}
        >
          {entry.firstName.charAt(0).toUpperCase()}
          {entry.rank <= 3 && (
            <span className="absolute -bottom-1 -right-1.5 text-sm leading-none">
              {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"}
            </span>
          )}
        </span>
        <span className="min-w-0">
          <span
            className={`block truncate text-sm ${
              entry.isYou ? "font-semibold text-ink" : "text-ink/80"
            }`}
          >
            {entry.isYou ? t.quiz.leaderboardYou(entry.firstName) : entry.firstName}
          </span>
          {entry.lastRatio !== null && (
            <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-medium">
              <span
                className={`flex items-center gap-1 ${reached ? "text-green" : "text-brown"}`}
                title={reached ? t.quiz.leaderboardGoalReached : t.quiz.leaderboardGoalMissed}
              >
                <GoalArrowIcon reached={reached} />
                {t.quiz.leaderboardLastSession(Math.round(entry.lastRatio * 100))}
              </span>
              {entry.avgRatio !== null && entry.sessionCount > 1 && (
                <span className="text-muted">
                  {t.quiz.leaderboardAvgRatio(Math.round(entry.avgRatio * 100))}
                </span>
              )}
            </span>
          )}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-4 text-right">
        <span className="text-xs text-muted">{t.quiz.leaderboardSessions(entry.sessionCount)}</span>
        <span className="font-display text-lg font-semibold text-teal-dark">
          {entry.points}
          <span className="ml-1 text-xs font-medium text-muted">
            {t.quiz.leaderboardPointsUnit}
          </span>
        </span>
      </span>
    </li>
  );
}

export default function CertificationLeaderboard() {
  const { slug = "" } = useParams();
  const { user, ready } = useAuth();
  const { t, lang } = useLanguage();

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

  // Ranks past MAX_RANKS are dropped outright, and what remains is paged.
  const ranked = entries.slice(0, MAX_RANKS);
  const pageCount = Math.max(1, Math.ceil(ranked.length / PAGE_SIZE));
  const pageEntries = ranked.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  // The caller's own row when it fell outside the visible top - the RPC still
  // returns it, we just don't list it above.
  const self = entries.find((e) => e.isYou);
  const pinnedSelf = self && self.rank > MAX_RANKS ? self : null;

  if (!ready) return null;

  if (!user) {
    return (
      <section className="mx-auto max-w-md px-6 py-24">
        <BackLink to="/formations" label={backLabel} />
        <h1 className="mt-6 font-display text-2xl font-semibold text-ink">
          {t.quiz.leaderboardTitle}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {t.quiz.leaderboardLoginRequired}
        </p>
        <div className="mt-6">
          <AuthPanel />
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-6 pt-6 pb-24">
      <BackLink to="/formations" label={backLabel} />

      <div className="mt-6 flex items-center gap-3">
        <img
          src={(cert && CERT_LOGOS[cert.slug]) ?? lampasLogo}
          alt=""
          className="h-9 w-9 object-contain"
        />
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            {t.quiz.leaderboardTitle}
          </h1>
          {cert && <p className="text-sm text-muted">{localize(cert.name, lang)}</p>}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-full border border-black/10 bg-white p-1 shadow-sm">
          {(["week", "month"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                period === p ? "brand-gradient text-white shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              {p === "week" ? t.quiz.leaderboardWeek : t.quiz.leaderboardMonth}
            </button>
          ))}
        </div>
        <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium capitalize text-muted shadow-sm">
          {periodLabel}
        </span>
        <span className="inline-flex items-center rounded-full border border-teal/30 bg-teal/[0.06] px-3 py-1.5 text-xs font-semibold text-teal-dark">
          {t.quiz.leaderboardGoal(Math.round(GOAL_RATIO * 100))}
        </span>
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="text-center text-sm text-muted">{t.quiz.leaderboardLoading}</p>
        ) : ranked.length === 0 ? (
          <p className="rounded-2xl border border-black/8 bg-white p-6 text-center text-sm text-muted">
            {t.quiz.leaderboardEmpty}
          </p>
        ) : (
          <>
          <ul className="flex flex-col gap-2">
            {pageEntries.map((entry) => (
              <LeaderboardRow key={entry.rank} entry={entry} />
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
              <span className="text-xs font-medium text-muted">
                {t.quiz.leaderboardPageOf(page + 1, pageCount)}
              </span>
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

          {/* You, ranked past the visible top - pinned below the pager (which
              only drives the list above) so the page always answers "and
              where am I?" without listing everyone. */}
          {pinnedSelf && (
            <>
              <div className="mt-6 flex items-center gap-3" aria-hidden="true">
                <span className="h-px flex-1 bg-black/10" />
                <span className="text-xs font-medium text-muted">···</span>
                <span className="h-px flex-1 bg-black/10" />
              </div>
              <ul className="mt-3">
                <LeaderboardRow entry={pinnedSelf} />
              </ul>
            </>
          )}
          </>
        )}
      </div>
    </section>
  );
}
