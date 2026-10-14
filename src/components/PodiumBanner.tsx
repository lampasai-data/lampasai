import { motion } from "motion/react";
import { useLanguage } from "../i18n";
import { USER_T } from "../userAreaI18n";

// "Well done, you are 2nd" - the congratulation shown on the dashboard and on
// the end-of-exam screen.
export default function PodiumBanner({
  name,
  rank,
  certName,
  onClose,
}: {
  name: string | null;
  rank: number;
  certName: string;
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const t = USER_T[lang].podium;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-center justify-between gap-4 rounded-2xl border border-amber/40 bg-amber/10 px-5 py-4 text-left text-sm font-medium text-ink"
    >
      <span>
        <span aria-hidden="true" className="mr-2 text-lg">
          {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
        </span>
        {t.message(name, rank, certName)}
      </span>
      <button type="button" onClick={onClose} aria-label={t.dismiss} className="shrink-0 text-lg leading-none text-muted hover:text-ink">
        ×
      </button>
    </motion.div>
  );
}
