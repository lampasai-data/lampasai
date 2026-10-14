import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n";
import { sendFeedback, type FeedbackKind, type FeedbackResult } from "../lib/feedback";
import { USER_T } from "../userAreaI18n";

// One dialog, two uses: "feedback" (review / idea / problem, with an optional
// rating) and "help" (a plain message the team answers by e-mail).
export default function FeedbackModal({ mode, onClose }: { mode: "feedback" | "help"; onClose: () => void }) {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const t = USER_T[lang].feedback;
  const [kind, setKind] = useState<Exclude<FeedbackKind, "help">>("review");
  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<FeedbackResult | null>(null);

  const sent = result === "ok";
  const title = mode === "help" ? t.helpTitle : t.feedbackTitle;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setResult(await sendFeedback(mode === "help" ? "help" : kind, mode === "feedback" ? rating : null, message, pathname));
    setBusy(false);
  }

  const errorText =
    result === "invalid" ? t.invalid : result === "rate_limited" ? t.rateLimited : result === "error" ? t.error : null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 px-4" onClick={busy ? undefined : onClose}>
      <div
        role="dialog"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
          <button type="button" onClick={onClose} aria-label={t.close} className="text-xl leading-none text-muted hover:text-ink">
            ×
          </button>
        </div>

        {sent ? (
          <>
            <p className="mt-4 rounded-xl bg-green/10 px-4 py-3 text-sm text-green">
              {mode === "help" ? t.thanksHelp : t.thanksFeedback}
            </p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="brand-gradient rounded-full px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                {t.close}
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={submit} className="mt-2">
            <p className="text-sm text-muted">{mode === "help" ? t.helpLead(user?.email ?? "") : t.feedbackLead}</p>

            {mode === "feedback" && (
              <>
                <div className="mt-4 flex gap-1.5 rounded-xl bg-black/[0.05] p-1">
                  {(["review", "idea", "problem"] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setKind(k)}
                      className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                        kind === k ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"
                      }`}
                    >
                      {t.kinds[k]}
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold text-muted">{t.ratingLabel}</p>
                  <div className="mt-1 flex gap-1" role="radiogroup" aria-label={t.ratingLabel}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        role="radio"
                        aria-checked={rating === n}
                        aria-label={`${n}/5`}
                        onClick={() => setRating((r) => (r === n ? null : n))}
                        className={`transition ${rating !== null && n <= rating ? "text-amber" : "text-black/20 hover:text-amber/60"}`}
                      >
                        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
                          <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <label htmlFor="feedback-message" className="mt-4 block text-xs font-semibold text-muted">
              {t.messageLabel}
            </label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={2000}
              rows={5}
              placeholder={mode === "help" ? t.helpPlaceholder : t.placeholders[kind]}
              className="mt-1.5 w-full resize-none rounded-xl border border-black/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20"
            />

            {errorText && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errorText}</p>}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={busy}
                className="rounded-full border border-black/12 px-4 py-2 text-sm font-medium text-ink hover:bg-black/[0.04] disabled:opacity-50"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={busy || message.trim().length < 3}
                className="brand-gradient rounded-full px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40"
              >
                {busy ? t.sending : t.send}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
