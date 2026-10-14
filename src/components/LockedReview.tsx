import { useLanguage } from "../i18n";
import { USER_T } from "../userAreaI18n";

// What the free quiz's last page shows in place of the detailed correction: a
// blurred mock-up of it, with the person's own right/wrong pattern (their own
// data) but no question text at all - the questions behind the exam mode are
// never sent here, the grey bars are placeholders. Selling the correction
// without giving any of it away.
const MAX_ROWS = 4;

export default function LockedReview({
  outcomes,
  onUnlock,
}: {
  // true = answered correctly, in the order the person answered them.
  outcomes: boolean[];
  onUnlock: () => void;
}) {
  const { lang } = useLanguage();
  const l = USER_T[lang].reviewLocked;
  const rows = outcomes.slice(0, MAX_ROWS);

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-black/8 bg-white text-left shadow-sm">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none space-y-2 overflow-hidden p-4 blur-[5px]">
        {rows.map((correct, i) => (
          <div
            key={i}
            className={`overflow-hidden rounded-2xl border border-l-4 border-black/8 bg-white ${
              correct ? "border-l-green" : "border-l-red-400"
            }`}
          >
            <div className="flex items-center gap-3 px-4 py-3.5">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  correct ? "bg-green/15 text-green" : "bg-red-100 text-red-600"
                }`}
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                  <path
                    d={correct ? "M5 12.5l4.5 4.5L19 7.5" : "M6 6l12 12M18 6L6 18"}
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="h-3 flex-1 rounded-full bg-black/[0.09]" style={{ maxWidth: `${70 - i * 9}%` }} />
            </div>
            {i === 0 && (
              <div className="border-t border-black/8 px-4 py-4">
                <div className="rounded-xl border border-teal/25 bg-teal/[0.06] p-4">
                  <p className="text-xs font-semibold tracking-wide text-teal-dark uppercase">{l.sampleExplanation}</p>
                  <span className="mt-3 block h-2.5 w-full rounded-full bg-black/[0.08]" />
                  <span className="mt-2 block h-2.5 w-11/12 rounded-full bg-black/[0.08]" />
                  <span className="mt-2 block h-2.5 w-2/3 rounded-full bg-black/[0.08]" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="relative flex flex-1 items-center justify-center bg-white/60 px-5 py-6">
        <div className="w-full max-w-md rounded-2xl border border-black/8 bg-white/95 p-5 text-center shadow-lg backdrop-blur-sm">
          <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-teal/12 text-teal-dark">
            <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden="true">
              <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M8 11V8a4 4 0 118 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          <p className="mt-2 font-display text-lg font-semibold text-ink">{l.title}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">{l.lead}</p>
          <ul className="mx-auto mt-3 w-fit space-y-1.5 text-left text-[13px] text-ink">
            {l.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 h-4 w-4 shrink-0 text-green" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onUnlock}
            className="brand-gradient mt-4 rounded-full px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-teal/20 transition hover:opacity-90"
          >
            {l.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
