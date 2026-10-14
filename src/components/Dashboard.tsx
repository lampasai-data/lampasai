import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n";
import { localize } from "../lib/i18nText";
import {
  getAllCertificationPurchaseDates,
  getPurchasedCertificationIds,
  getMyCertificationRank,
  getUserProgress,
  loadQuestions,
  type CertificationProgress,
  type CertificationSummary,
  type PurchasedCertificationAccess,
} from "../lib/quizData";
import type { LocalizedText, Question } from "../data/types";
import { CERT_LOGOS } from "../data/certLogos";
import { useCheckoutSuccessPoll } from "../lib/useCheckoutSuccessPoll";
import { EMPTY_INSIGHTS, loadMyInsights, type MyInsights } from "../lib/insights";
import { USER_T } from "../userAreaI18n";
import Avatar from "./Avatar";
import PodiumBanner from "./PodiumBanner";
import Tooltip from "./Tooltip";
import { claimPodium } from "../lib/podium";
import HelpFeedbackButtons from "./HelpFeedbackButtons";
import { accentOf } from "../lib/certAccent";
import { CertAnalysis, LockedPreview } from "./ProgressInsights";

function TrophyIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 4h10v4a5 5 0 01-10 0V4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M7 5H4v1a4 4 0 004 4M17 5h3v1a4 4 0 01-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 13v4M9 20h6M10 17h4v3h-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

// Short name for a switch button: the certification's product name.
function shortCertName(c: CertificationSummary, lang: "fr" | "en") {
  if (c.slug === "snowflake") return "Snowflake";
  if (c.slug === "power-bi") return "Power BI";
  return localize(c.name, lang);
}

export default function Dashboard({ certs }: { certs: CertificationSummary[] }) {
  const { user, profile, profileReady, openUpgradeModal, purchasesVersion } = useAuth();
  const { t, lang } = useLanguage();
  const [progress, setProgress] = useState<Record<string, CertificationProgress>>({});
  const [purchasedIds, setPurchasedIds] = useState<Map<string, PurchasedCertificationAccess>>(
    new Map()
  );
  const [allPurchaseDates, setAllPurchaseDates] = useState<Map<string, string>>(new Map());
  const [downloadingSlug, setDownloadingSlug] = useState<string | null>(null);
  // Leaderboard rank per certification id, kept only for the podium (1-3).
  // Recomputed whenever the user or their purchases change, so a medal
  // disappears on its own as soon as someone else overtakes them.
  const [medals, setMedals] = useState<Map<string, number>>(new Map());
  const [accessLoaded, setAccessLoaded] = useState(false);
  const [insights, setInsights] = useState<MyInsights>(EMPTY_INSIGHTS);
  // Which certification the figures above the cards describe ("all" = both).
  const [scope, setScope] = useState<string>("all");
  // Congratulation shown once when the person reaches the podium of a
  // certification this month (see the effect below).
  const [podium, setPodium] = useState<{ certId: string; rank: number }[]>([]);
  const [pdfModal, setPdfModal] = useState<{
    certName: LocalizedText;
    questions: Question[];
    count: number;
  } | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  // Months granted by the purchase that just completed, computed from the
  // actual expires_at rather than assumed - a voucher grants 1 month, a real
  // purchase 3, so the banner must reflect whichever one actually happened.
  const [checkoutBannerMonths, setCheckoutBannerMonths] = useState<number | null>(null);
  // "Bienvenue" only for someone who just created their account and has not
  // yet seen this page; everyone else gets a greeting for the time of day.
  // Decided once per mount, so the flag written below does not flip the text.
  const [isFirstVisit] = useState(() => {
    if (!user) return false;
    const key = `lampas-welcomed-${user.id}`;
    try {
      if (localStorage.getItem(key)) return false;
    } catch {
      return false;
    }
    return Date.now() - new Date(user.created_at).getTime() < 24 * 3600 * 1000;
  });
  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem(`lampas-welcomed-${user.id}`, "1");
    } catch {
      /* private mode: the greeting just falls back to the time of day */
    }
  }, [user]);
  const isPro = profile?.plan === "pro";

  function greeting(name: string) {
    if (isFirstVisit) return t.formations.dashboardGreeting(name);
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return t.formations.dashboardGreetingMorning(name);
    if (hour >= 12 && hour < 18) return t.formations.dashboardGreetingAfternoon(name);
    return t.formations.dashboardGreetingEvening(name);
  }
  // Everything that decides locked vs unlocked - the upgrade banner and each
  // card's action row - has to wait for both the plan and the purchases.
  // Rendering on a half-known answer showed a Pro subscriber the "go
  // unlimited" banner and locked cards for a beat before correcting itself.
  const accessReady = profileReady && accessLoaded;
  // A voucher (or a one-off purchase) grants access per certification through
  // certification_purchases; it never flips profiles.plan to "pro". So the
  // upgrade banner can't key on the plan alone - someone who unlocked every
  // certification with vouchers kept being told to "go unlimited", and the
  // modal then answered that everything was already unlocked. The guard on
  // certs.length matters: every() on an empty list is vacuously true, which
  // would hide the banner while the catalogue is still loading.
  const hasFullAccess =
    isPro || (certs.length > 0 && certs.every((c) => purchasedIds.has(c.id)));

  useEffect(() => {
    if (user) getUserProgress(user.id).then(setProgress);
  }, [user]);

  useEffect(() => {
    if (user) loadMyInsights(user.id).then(setInsights);
    else setInsights(EMPTY_INSIGHTS);
  }, [user, purchasesVersion]);

  // One congratulation per (certification, rank, month): remembered in this
  // browser so it does not come back on every visit. Reaching a better rank
  // later shows a new one. Every podium not yet announced is shown together.
  useEffect(() => {
    if (!user || medals.size === 0) return;
    const fresh: { certId: string; rank: number }[] = [];
    for (const [certId, rank] of medals) {
      if (claimPodium(user.id, certId, rank)) fresh.push({ certId, rank });
    }
    if (fresh.length > 0) setPodium(fresh);
  }, [user, medals]);

  // The message fades away by itself after a few seconds.
  useEffect(() => {
    if (podium.length === 0) return;
    const timer = setTimeout(() => setPodium([]), 14000);
    return () => clearTimeout(timer);
  }, [podium]);

  useEffect(() => {
    if (!user) {
      setMedals(new Map());
      return;
    }
    let cancelled = false;
    // "month" matches the period the leaderboard page opens on, so the medal
    // on the card and the ranking the user lands on always agree.
    Promise.all(
      certs.map(async (c) => [c.id, await getMyCertificationRank(c.id, "month")] as const)
    ).then((entries) => {
      if (cancelled) return;
      setMedals(new Map(entries.filter(([, rank]) => rank !== null && rank <= 3) as [string, number][]));
    });
    return () => {
      cancelled = true;
    };
  }, [user, certs, purchasesVersion]);

  useEffect(() => {
    if (!user) {
      setAccessLoaded(true);
      return;
    }
    setAccessLoaded(false);
    Promise.all([
      getPurchasedCertificationIds(user.id).then(setPurchasedIds),
      getAllCertificationPurchaseDates(user.id).then(setAllPurchaseDates),
    ])
      // Settled either way - a failed lookup means "no purchase known", and
      // must not hold the cards behind a spinner forever.
      .finally(() => setAccessLoaded(true));
  }, [user, purchasesVersion]);

  useCheckoutSuccessPoll(user, searchParams, setSearchParams, (ids) => {
    setPurchasedIds(ids);
    getAllCertificationPurchaseDates(user!.id).then(setAllPurchaseDates);
    // The just-completed purchase/voucher is the one expiring furthest in
    // the future - reliable without needing to diff against pre-checkout
    // state, and avoids ever hardcoding a duration that might be wrong.
    const newest = [...ids.values()].reduce<PurchasedCertificationAccess | null>(
      (max, entry) =>
        !max || new Date(entry.expiresAt) > new Date(max.expiresAt) ? entry : max,
      null
    );
    if (newest) {
      const months = Math.max(
        1,
        Math.round(
          (new Date(newest.expiresAt).getTime() - Date.now()) / (30 * 24 * 60 * 60 * 1000)
        )
      );
      setCheckoutBannerMonths(months);
    }
  });

  async function handleDownloadPdf(cert: CertificationSummary) {
    setDownloadingSlug(cert.slug);
    const data = await loadQuestions(cert.slug);
    if (data) {
      setPdfModal({ certName: data.name, questions: data.questions, count: data.questions.length });
    }
    setDownloadingSlug(null);
  }

  async function confirmDownloadPdf() {
    if (!pdfModal) return;
    const { exportCertificationPdf } = await import("../lib/pdfExport");
    exportCertificationPdf(
      localize(pdfModal.certName, lang),
      pdfModal.questions.slice(0, pdfModal.count),
      lang
    );
    setPdfModal(null);
  }

  return (
    <>
      <AnimatePresence>
        {podium.map((p) => (
          <div key={`${p.certId}-${p.rank}`} className="mb-4">
            <PodiumBanner
              name={profile?.first_name ?? null}
              rank={p.rank}
              certName={localize(certs.find((c) => c.id === p.certId)?.name ?? { fr: "", en: "" }, lang)}
              onClose={() => setPodium((list) => list.filter((x) => x !== p))}
            />
          </div>
        ))}
      </AnimatePresence>

      {checkoutBannerMonths !== null && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-teal/25 bg-teal/5 px-5 py-4 text-sm font-medium text-teal-dark"
        >
          {t.formations.checkoutSuccessBanner(checkoutBannerMonths)}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/profil" className="group relative shrink-0" aria-label={USER_T[lang].profile.menu}>
              {isPro ? (
                <span className="brand-gradient block rounded-full p-[2.5px]">
                  <span className="block rounded-full bg-white p-[2px]">
                    <Avatar src={profile?.avatar_url} firstName={profile?.first_name} email={user?.email} size={52} />
                  </span>
                </span>
              ) : (
                <Avatar src={profile?.avatar_url} firstName={profile?.first_name} email={user?.email} size={52} />
              )}
              <span className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-teal text-white shadow-sm transition group-hover:bg-teal-dark">
                <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" aria-hidden="true">
                  <path d="M4 20h4L19 9l-4-4L4 16v4z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
            <div>
              <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-display text-2xl font-semibold text-ink">
                {profile?.first_name ? greeting(profile.first_name) : t.formations.dashboardWelcome}
                {/* Two distinct statuses, deliberately styled apart: "Pro" is
                    a subscription; "Accès complet" means every certification
                    happens to be unlocked right now through purchases or
                    vouchers, which expire. Showing Pro for the latter would
                    promise something the account does not have. */}
                {accessReady && isPro && (
                  <Tooltip label={t.formations.dashboardPlanPro}>
                    <span className="brand-gradient rounded-md px-1.5 py-0.5 font-sans text-[10px] font-bold tracking-widest text-white">
                      PRO
                    </span>
                  </Tooltip>
                )}
                {accessReady && !isPro && hasFullAccess && (
                  <span className="rounded-md border border-teal/40 bg-teal/5 px-1.5 py-0.5 font-sans text-[10px] font-bold tracking-wide text-teal-dark uppercase">
                    {t.formations.dashboardFullAccess}
                  </span>
                )}
              </p>
              <Link to="/profil" className="text-sm font-medium text-teal-dark hover:underline">
                {profile?.avatar_url ? USER_T[lang].profile.editLink : USER_T[lang].profile.addPhotoLink}
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {accessReady && certs.length > 1 && (
              <div className="mr-5 flex h-[38px] max-w-full items-center gap-0.5 rounded-full border border-black/10 bg-white p-0.5 shadow-sm">
                {[{ id: "all", label: USER_T[lang].insights.scopeAll }, ...certs.map((c) => ({ id: c.slug, label: shortCertName(c, lang) }))].map(
                  (o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setScope(o.id)}
                      className={`flex h-full items-center justify-center rounded-full px-3.5 text-sm font-semibold whitespace-nowrap transition ${
                        scope === o.id ? "bg-teal/13 text-teal-dark" : "text-muted hover:text-ink"
                      }`}
                    >
                      {o.label}
                    </button>
                  )
                )}
              </div>
            )}
            <HelpFeedbackButtons />
          </div>
        </div>
      </motion.div>

      {accessReady && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        >
          {(() => {
            const it = USER_T[lang].insights;
            // Figures for the chosen certification, or for both together.
            const one = scope === "all" ? null : scope;
            const totals = one ? insights.totalsBySlug[one] : null;
            const oneExams = one ? (insights.bySlug[one]?.exams ?? []) : [];
            const streak = one ? (totals?.streakDays ?? 0) : insights.streakDays;
            const answered = one ? (totals?.answered ?? 0) : insights.answeredTotal;
            const correct = one ? (totals?.correct ?? 0) : insights.correctTotal;
            const examCount = one ? oneExams.length : insights.examCount;
            const best = one ? (oneExams.length ? Math.max(...oneExams.map((e) => e.ratio)) : null) : insights.bestExamRatio;
            const rate = answered > 0 ? Math.round((correct / answered) * 100) : null;
            // Outline icons on a 24px grid (2px round strokes), one tint per tile.
            const icon = (...paths: string[]) => (
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
                {paths.map((d) => (
                  <path key={d} d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                ))}
              </svg>
            );
            const tiles = [
              {
                label: it.tileStreak,
                value: it.tileStreakValue(streak),
                tint: "text-amber-ink",
                icon: icon("M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"),
              },
              {
                label: it.tileAnswered,
                value: String(answered),
                tint: "text-green-ink",
                icon: icon("M21.8 10A10 10 0 1 1 17 3.34", "m9 11 3 3L22 4"),
              },
              {
                label: it.tileSuccess,
                value: rate === null ? "-" : `${rate} %`,
                tint: "text-teal-dark",
                icon: icon("M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z", "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"),
              },
              {
                label: it.tileExams,
                value: String(examCount),
                tint: "text-brown-ink",
                icon: icon("M8 2h8a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z", "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2", "m9 14 2 2 4-4"),
              },
              {
                label: it.tileBest,
                value: best === null ? "-" : `${Math.round(best * 100)} %`,
                tint: "text-amber-ink",
                icon: icon("M6 9H4.5a2.5 2.5 0 0 1 0-5H6", "M18 9h1.5a2.5 2.5 0 0 0 0-5H18", "M4 22h16", "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22", "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22", "M18 2H6v7a6 6 0 0 0 12 0V2z"),
              },
            ];
            return tiles.map((tile) => (
              <div key={tile.label} className="flex items-center gap-3 rounded-2xl border border-black/8 bg-white px-3.5 py-3 shadow-sm">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center ${tile.tint}`}>
                  {tile.icon}
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-lg leading-tight font-semibold text-ink tabular-nums">{tile.value}</span>
                  <span className="block text-[11px] leading-tight text-muted sm:truncate">{tile.label}</span>
                </span>
              </div>
            ));
          })()}
        </motion.div>
      )}

      {accessReady && (
        <h2 className="mt-10 font-display text-xl font-semibold text-ink">{USER_T[lang].insights.coursesTitle}</h2>
      )}
      {!accessReady ? (
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2" aria-busy="true" aria-label={t.quiz.leaderboardLoading}>
          {[0, 1].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-3xl border border-black/8 bg-white p-7 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded-2xl bg-black/[0.06]" />
                <div className="flex-1 space-y-2.5">
                  <div className="h-4 w-2/3 rounded bg-black/[0.07]" />
                  <div className="h-3 w-1/2 rounded bg-black/[0.05]" />
                </div>
              </div>
              <div className="mt-8 space-y-3">
                <div className="h-3 rounded bg-black/[0.05]" />
                <div className="h-3 w-5/6 rounded bg-black/[0.05]" />
                <div className="h-3 w-2/3 rounded bg-black/[0.05]" />
              </div>
            </div>
          ))}
        </div>
      ) : (
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {certs.map((cert, i) => {
          const stats = progress[cert.slug];
          const access = purchasedIds.get(cert.id);
          const expiresAt = access?.expiresAt;
          const unlocked = isPro || expiresAt !== undefined;
          const canDownloadPdf = isPro || access?.pdfAllowed === true;
          const isExpired = !isPro && expiresAt === undefined && allPurchaseDates.has(cert.id);
          const medal = medals.get(cert.id);
          return (
            <motion.div
              key={cert.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 + i * 0.06 }}
              className="flex h-full flex-col overflow-hidden rounded-3xl border border-black/8 bg-white shadow-sm transition hover:shadow-md"
            >
              <div
                className="px-7 pt-5 pb-4"
                style={{
                  background: `linear-gradient(120deg, ${accentOf(cert.slug)}1a 0%, ${accentOf(cert.slug)}08 55%, transparent 100%)`,
                }}
              >
              <div className="flex flex-wrap items-start gap-x-3 gap-y-3">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                  {medal !== undefined && (
                    <span className="absolute -right-1.5 -top-1.5 text-2xl leading-none drop-shadow-sm">
                      <Tooltip label={t.formations.dashboardMedal(medal)} align="start">
                        <span>{medal === 1 ? "🥇" : medal === 2 ? "🥈" : "🥉"}</span>
                      </Tooltip>
                    </span>
                  )}
                  {CERT_LOGOS[cert.slug] ? (
                    <img
                      src={CERT_LOGOS[cert.slug]}
                      alt=""
                      className={
                        cert.slug === "power-bi"
                          ? "h-14 w-14 object-contain"
                          : "h-11 w-11 object-contain"
                      }
                    />
                  ) : (
                    <span className="brand-gradient h-2.5 w-2.5 rounded-full" />
                  )}
                </div>
                <div className="min-w-0 flex-1 basis-44">
                  <div className="flex items-center gap-2">
                    <h3 className="min-w-0 truncate font-display text-lg font-medium text-ink">
                      {localize(cert.name, lang)}
                    </h3>
                    {!isPro && expiresAt && (
                      <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-green/30 bg-green/10 px-2 py-px text-[9.5px] font-semibold uppercase tracking-wide text-green">
                        {t.formations.dashboardPaidBadge}
                      </span>
                    )}
                    {isExpired && (
                      <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-red-300 bg-red-50 px-2 py-px text-[9.5px] font-semibold uppercase tracking-wide text-red-600">
                        {t.formations.dashboardRenewAccess}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {stats && stats.answered > 0
                      ? t.formations.dashboardProgress(
                          Math.round((stats.correct / stats.answered) * 100),
                          stats.correct,
                          stats.answered
                        )
                      : t.formations.dashboardNotStarted}
                  </p>
                </div>
                {unlocked && (
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Link
                      to={`/formations/${cert.slug}?mode=exam`}
                      className="brand-gradient rounded-full px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-teal/20 transition hover:opacity-90"
                    >
                      {t.formations.dashboardContinue}
                    </Link>
                    <Tooltip label={t.quiz.viewLeaderboard} align="end">
                      <Link
                        to={`/formations/${cert.slug}/classement`}
                        aria-label={t.quiz.viewLeaderboard}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-green shadow-sm transition hover:border-green/50 hover:bg-green/5"
                      >
                        <TrophyIcon className="h-[18px] w-[18px]" />
                      </Link>
                    </Tooltip>
                    {canDownloadPdf && (
                      <Tooltip
                        label={downloadingSlug === cert.slug ? t.formations.downloadingPdf : t.formations.downloadPdf}
                        align="end"
                      >
                      <button
                        type="button"
                        onClick={() => handleDownloadPdf(cert)}
                        disabled={downloadingSlug === cert.slug}
                        aria-label={t.formations.downloadPdf}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-ink shadow-sm transition hover:border-teal/50 hover:bg-teal/5 disabled:animate-pulse disabled:opacity-60"
                      >
                        <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden="true">
                          <path d="M12 4v11M7.5 11l4.5 4.5 4.5-4.5M5 20h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      </Tooltip>
                    )}
                  </div>
                )}
              </div>
              </div>

              <div className="flex flex-1 flex-col px-7 pt-4 pb-5">
              {unlocked ? (
                <CertAnalysis cert={cert} data={insights.bySlug[cert.slug] ?? { domains: [], exams: [] }} />
              ) : (
                <LockedPreview
                  onUnlock={() => openUpgradeModal(cert.slug)}
                  onVoucher={() => openUpgradeModal(cert.slug, true)}
                  voucherLabel={t.quiz.voucherTitle}
                />
              )}

              {/* Always rendered, fixed-height slot - even when neither
                  condition below applies - so every card reserves the same
                  amount of space beneath the (mt-auto, bottom-anchored)
                  button row. Without this, a card with an access-until/renew
                  message ended up taller below its buttons than one without,
                  which pushed its button row up and broke the alignment
                  between cards that all sit in the same grid row. */}
              <div className="mt-auto flex min-h-6 items-center justify-center pt-3">
                {!isPro && expiresAt && (
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span>
                      {t.formations.dashboardAccessUntil(
                        new Date(expiresAt).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      )}
                    </span>
                    <span className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-green text-white">
                      <svg viewBox="0 0 24 24" fill="none" className="h-2 w-2">
                        <path
                          d="M5 13l4 4L19 7"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                )}
                {isExpired && (
                  <button
                    type="button"
                    onClick={() => openUpgradeModal(cert.slug)}
                    className="flex items-center gap-2 text-xs font-medium text-red-600 transition hover:text-red-700"
                  >
                    <span>{t.formations.dashboardRenewAccess}</span>
                    <span className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
                      <svg viewBox="0 0 24 24" fill="none" className="h-2 w-2">
                        <path
                          d="M6 6l12 12M18 6L6 18"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                )}
              </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      )}

      <AnimatePresence>
        {pdfModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6"
            onClick={() => setPdfModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-2xl border border-black/8 bg-white p-6 shadow-xl"
            >
              <h3 className="font-display text-base font-semibold text-ink">
                {t.formations.pdfCountPrompt}
              </h3>

              {(() => {
                const total = pdfModal.questions.length;
                const stepValues = Array.from(
                  { length: Math.ceil(total / 20) },
                  (_, i) => Math.min((i + 1) * 20, total)
                );
                const sliderIndex = Math.max(
                  0,
                  stepValues.findIndex((v) => v === pdfModal.count)
                );
                return (
                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-muted">
                        {t.quiz.questionCountLabel}
                      </span>
                      <span className="text-sm font-semibold text-ink">{pdfModal.count}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={Math.max(stepValues.length - 1, 0)}
                      step={1}
                      value={sliderIndex}
                      onChange={(e) =>
                        setPdfModal((prev) =>
                          prev ? { ...prev, count: stepValues[Number(e.target.value)] } : prev
                        )
                      }
                      className="w-full accent-teal"
                    />
                  </div>
                );
              })()}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPdfModal(null)}
                  className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-ink transition hover:border-black/20"
                >
                  {t.formations.pdfCountCancel}
                </button>
                <button
                  type="button"
                  onClick={confirmDownloadPdf}
                  className="brand-gradient rounded-full px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                >
                  {t.formations.pdfCountConfirm}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
