import { useState } from "react";
import { useLanguage } from "../i18n";
import { USER_T } from "../userAreaI18n";
import FeedbackModal from "./FeedbackModal";

const iconButton =
  "inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-sm font-medium text-ink shadow-sm transition hover:border-teal/40 hover:bg-teal/5 hover:text-teal-dark";

// The two buttons in the dashboard header: a lightbulb to give feedback
// (review, idea, problem) and a question mark to ask for help.
export default function HelpFeedbackButtons() {
  const { lang } = useLanguage();
  const t = USER_T[lang].feedback;
  const [mode, setMode] = useState<"feedback" | "help" | null>(null);

  return (
    <>
      <button type="button" onClick={() => setMode("feedback")} title={t.openFeedback} aria-label={t.openFeedback} className={iconButton}>
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <path d="M9 18h6M10 21h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path
            d="M12 3a6 6 0 00-3.6 10.8c.6.5 1.1 1.2 1.1 2V16h5v-.2c0-.8.5-1.5 1.1-2A6 6 0 0012 3z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
        <span className="hidden sm:inline">{t.openFeedback}</span>
      </button>
      <button type="button" onClick={() => setMode("help")} title={t.openHelp} aria-label={t.openHelp} className={iconButton}>
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9.5 9.5a2.6 2.6 0 015.1.7c0 1.7-2.6 2.2-2.6 3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="17" r="1" fill="currentColor" />
        </svg>
        <span className="hidden sm:inline">{t.openHelp}</span>
      </button>
      {mode && <FeedbackModal mode={mode} onClose={() => setMode(null)} />}
    </>
  );
}
