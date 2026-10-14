import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n";
import { supabase } from "../lib/supabase";

// Tells the server which language a signed-in person uses on the site, so
// e-mails (promotions, reminders) can be sent in that language. The choice was
// only kept in the browser before. Runs once per account and language per
// browser session, and never blocks or breaks anything: a failure is ignored.
export default function LanguageSync() {
  const { user } = useAuth();
  const { lang } = useLanguage();

  useEffect(() => {
    if (!user || !supabase) return;
    const key = `lampasai_lang_synced:${user.id}:${lang}`;
    try {
      if (sessionStorage.getItem(key)) return;
    } catch {
      // storage unavailable: just sync again, it is idempotent
    }
    supabase.rpc("set_my_language", { p_language: lang }).then(({ error }) => {
      if (error) return;
      try {
        sessionStorage.setItem(key, "1");
      } catch {
        // ignore
      }
    });
  }, [user, lang]);

  return null;
}
