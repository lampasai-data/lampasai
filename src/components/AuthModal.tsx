import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n";
import AuthPanel from "./AuthPanel";

export default function AuthModal() {
  const { authModalOpen, closeAuthModal } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (!authModalOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeAuthModal();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [authModalOpen, closeAuthModal]);

  return (
    <AnimatePresence>
      {authModalOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
        >
          <motion.div
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label={t.auth.close}
              onClick={closeAuthModal}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-ink shadow-sm transition hover:bg-black/[0.03]"
            >
              ✕
            </button>
            <AuthPanel />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
