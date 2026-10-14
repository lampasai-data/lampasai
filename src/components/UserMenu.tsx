import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n";
import { USER_T } from "../userAreaI18n";
import Avatar from "./Avatar";

const ADMIN_EMAIL = "mbairo.allatessem@gmail.com";

// The signed-in person's entry in the top bar: picture, first name and a
// chevron, so it reads as a menu. It holds the profile page, the admin area
// (admin only) and the sign-out.
export default function UserMenu() {
  const { user, profile, signOut } = useAuth();
  const { lang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const copy = USER_T[lang].profile;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;
  const isAdmin = user.email?.toLowerCase() === ADMIN_EMAIL;
  const item =
    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-ink transition hover:bg-black/[0.04]";

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-black/10 py-1 pr-2.5 pl-1 transition hover:border-teal/40 hover:bg-teal/5"
      >
        <Avatar src={profile?.avatar_url} firstName={profile?.first_name} email={user.email} size={28} />
        {profile?.first_name && (
          <span className="max-w-[8rem] truncate text-sm font-medium text-ink">{profile.first_name}</span>
        )}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`h-4 w-4 text-muted transition ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-60 rounded-xl border border-black/10 bg-white p-1.5 shadow-xl"
        >
          <div className="border-b border-black/8 px-3 pt-2 pb-2.5">
            <p className="truncate text-sm font-semibold text-ink">{profile?.first_name ?? user.email}</p>
            {profile?.first_name && <p className="truncate text-xs text-muted">{user.email}</p>}
          </div>
          <div className="pt-1.5">
            <Link to="/profil" role="menuitem" onClick={() => setOpen(false)} className={item}>
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-muted" aria-hidden="true">
                <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
                <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              {copy.menu}
            </Link>
            {isAdmin && (
              <Link to="/admin" role="menuitem" onClick={() => setOpen(false)} className={item}>
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-muted" aria-hidden="true">
                  <path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
                Administration
              </Link>
            )}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                signOut();
              }}
              className={`${item} text-muted`}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                <path d="M9 4H6a2 2 0 00-2 2v12a2 2 0 002 2h3M16 8l4 4-4 4M20 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t.nav.logout}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
