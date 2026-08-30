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

export default function CertificationLeaderboard() {
  const { slug = "" } = useParams();
  const { user, ready } = useAuth();
  const { t, lang } = useLanguage();

  const [period, setPeriod] = useState<LeaderboardPeriod>("month");
  const [cert, setCert] = useState<CertificationSummary | null>(null);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
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
    <section className="mx-auto max-w-2xl px-6 py-24">
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
        ) : entries.length === 0 ? (
          <p className="rounded-2xl border border-black/8 bg-white p-6 text-center text-sm text-muted">
            {t.quiz.leaderboardEmpty}
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {entries.map((entry) => (
              <li
                key={entry.rank}
                className={`flex items-center justify-between gap-3 rounded-2xl border px-5 py-3.5 ${
                  entry.isYou
                    ? "border-teal/40 bg-teal/[0.06] shadow-sm"
                    : "border-black/8 bg-white"
                }`}
              >
                <span className="flex items-center gap-3.5">
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
                  <span className={`text-sm ${entry.isYou ? "font-semibold text-ink" : "text-ink/80"}`}>
                    {entry.isYou ? t.quiz.leaderboardYou(entry.firstName) : entry.firstName}
                  </span>
                </span>
                <span className="flex items-center gap-4 text-right">
                  <span className="text-xs text-muted">
                    {t.quiz.leaderboardSessions(entry.sessionCount)}
                  </span>
                  <span className="font-display text-lg font-semibold text-teal-dark">
                    {entry.points}
                    <span className="ml-1 text-xs font-medium text-muted">
                      {t.quiz.leaderboardPointsUnit}
                    </span>
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
