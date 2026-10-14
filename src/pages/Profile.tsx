import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Avatar from "../components/Avatar";
import AvatarCropper from "../components/AvatarCropper";
import BackLink from "../components/BackLink";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n";
import { CERT_LOGOS } from "../data/certLogos";
import { localize } from "../lib/i18nText";
import {
  getPurchasedCertificationIds,
  listCertifications,
  type CertificationSummary,
  type PurchasedCertificationAccess,
} from "../lib/quizData";
import { deleteMyAccount, getNameChangedAt, removeMyAvatar, saveMyAvatar, updateMyFirstName } from "../lib/profile";
import { USER_T } from "../userAreaI18n";

const MAX_FILE = 10 * 1024 * 1024;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export default function Profile() {
  const { user, ready, profile, reloadProfile, openUpgradeModal, signOut } = useAuth();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = USER_T[lang].profile;
  const locale = lang === "fr" ? "fr-FR" : "en-GB";

  const fileInput = useRef<HTMLInputElement>(null);
  const [picked, setPicked] = useState<File | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoMsg, setPhotoMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [name, setName] = useState(profile?.first_name ?? "");
  const [changedAt, setChangedAt] = useState<string | null>(null);
  const [nameBusy, setNameBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [nameMsg, setNameMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    setName((n) => n || profile?.first_name || "");
  }, [profile?.first_name]);

  useEffect(() => {
    if (user) getNameChangedAt(user.id).then(setChangedAt);
  }, [user]);

  const [certs, setCerts] = useState<CertificationSummary[]>([]);
  const [access, setAccess] = useState<Map<string, PurchasedCertificationAccess>>(new Map());
  useEffect(() => {
    listCertifications().then(setCerts);
  }, []);
  useEffect(() => {
    if (user) getPurchasedCertificationIds(user.id).then(setAccess);
  }, [user]);

  if (!ready) return null;
  if (!user) return <Navigate to="/formations" replace />;

  const unlockAt = changedAt ? new Date(new Date(changedAt).getTime() + WEEK_MS) : null;
  const locked = unlockAt !== null && unlockAt.getTime() > Date.now() && user.email?.toLowerCase() !== "mbairo.allatessem@gmail.com";
  const fmt = (d: Date) => d.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    setPhotoMsg(null);
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return setPhotoMsg({ ok: false, text: t.notAnImage });
    if (file.size > MAX_FILE) return setPhotoMsg({ ok: false, text: t.tooBig });
    setPicked(file);
  }

  async function savePhoto(blob: Blob) {
    setPhotoBusy(true);
    const ok = await saveMyAvatar(user!.id, blob);
    if (ok) await reloadProfile();
    setPhotoBusy(false);
    setPicked(null);
    setPhotoMsg({ ok, text: ok ? t.photoSaved : t.photoError });
  }

  async function removePhoto() {
    setPhotoBusy(true);
    const ok = await removeMyAvatar(user!.id);
    if (ok) await reloadProfile();
    setPhotoBusy(false);
    setPhotoMsg({ ok, text: ok ? t.photoRemoved : t.photoError });
  }

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    setNameBusy(true);
    setNameMsg(null);
    const result = await updateMyFirstName(name);
    if (result.status === "ok") {
      await reloadProfile();
      setChangedAt(new Date().toISOString());
      setNameMsg({ ok: true, text: t.nameSaved });
    } else if (result.status === "unchanged") {
      setNameMsg(null);
    } else if (result.status === "rate_limited") {
      setNameMsg({ ok: false, text: t.nameLocked(fmt(new Date(result.nextChangeAt || Date.now() + WEEK_MS))) });
    } else if (result.status === "invalid") {
      setNameMsg({ ok: false, text: t.nameInvalid });
    } else {
      setNameMsg({ ok: false, text: t.nameError });
    }
    setNameBusy(false);
  }

  const card = "rounded-2xl border border-black/8 bg-white p-6 shadow-sm";
  const isPro = profile?.plan === "pro";
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString(locale, { month: "long", year: "numeric" })
    : null;

  return (
    <section className="mx-auto w-full max-w-4xl px-6 pt-8 pb-20">
      <BackLink to="/formations" label={t.back} />

      {/* Identity: a soft brand banner, the picture straddling its edge. */}
      <div className="mt-5 overflow-hidden rounded-3xl border border-black/8 bg-white shadow-sm">
        <div className="brand-gradient h-28 opacity-90" />
        <div className="flex flex-wrap items-end gap-x-6 gap-y-4 px-6 pb-6 sm:px-8">
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={photoBusy}
            aria-label={profile?.avatar_url ? t.changePhoto : t.addPhoto}
            className="group relative -mt-14 shrink-0 rounded-full ring-4 ring-white disabled:opacity-60"
          >
            <Avatar src={profile?.avatar_url} firstName={profile?.first_name} email={user.email} size={112} />
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
              <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
                <path d="M4 8h3l1.5-2h7L17 8h3v11H4V8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </span>
            <span className="absolute right-0 bottom-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-teal text-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                <path d="M4 8h3l1.5-2h7L17 8h3v11H4V8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
          </button>

          <div className="min-w-0 flex-1 pt-2">
            <h1 className="truncate font-display text-3xl font-semibold text-ink">
              {profile?.first_name ?? t.title}
            </h1>
            <p className="truncate text-sm text-muted">{user.email}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {isPro && (
                <span className="brand-gradient rounded-full px-3 py-1 text-xs font-semibold text-white">{t.planPro}</span>
              )}
              {memberSince && (
                <span className="rounded-full bg-black/[0.05] px-3 py-1 text-xs font-medium text-muted">
                  {t.memberSince(memberSince)}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={photoBusy}
              className="rounded-full border border-black/12 px-4 py-2 text-sm font-medium text-ink hover:bg-black/[0.04] disabled:opacity-50"
            >
              {profile?.avatar_url ? t.changePhoto : t.addPhoto}
            </button>
            {profile?.avatar_url && (
              <button
                type="button"
                onClick={removePhoto}
                disabled={photoBusy}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted hover:text-ink disabled:opacity-50"
              >
                {t.removePhoto}
              </button>
            )}
          </div>
          <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" onChange={pickFile} className="hidden" />
        </div>

        {(photoMsg || !profile?.avatar_url) && (
          <div className="border-t border-black/6 px-6 py-3 sm:px-8">
            {photoMsg ? (
              <p className={`text-sm ${photoMsg.ok ? "text-green" : "text-red-600"}`}>{photoMsg.text}</p>
            ) : (
              <p className="text-xs text-muted">{t.photoHint}</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <form onSubmit={saveName} className={card}>
          <h2 className="font-display text-lg font-semibold text-ink">{t.nameTitle}</h2>

          <label htmlFor="first-name" className="mt-5 block text-xs font-semibold text-muted">
            {t.nameLabel}
          </label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            <input
              id="first-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              disabled={locked || nameBusy}
              autoComplete="given-name"
              className="min-w-0 flex-1 rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20 disabled:bg-black/[0.04] disabled:text-muted"
            />
            <button
              type="submit"
              disabled={locked || nameBusy || name.trim() === "" || name.trim() === (profile?.first_name ?? "")}
              className="brand-gradient rounded-full px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40"
            >
              {nameBusy ? t.saving : t.save}
            </button>
          </div>
          <p className="mt-2 text-xs text-muted">{locked && unlockAt ? t.nameLocked(fmt(unlockAt)) : t.nameHint}</p>
          {nameMsg && (
            <p className={`mt-3 rounded-lg px-3 py-2 text-sm ${nameMsg.ok ? "bg-green/10 text-green" : "bg-red-50 text-red-600"}`}>
              {nameMsg.text}
            </p>
          )}

          <label htmlFor="account-email" className="mt-6 block text-xs font-semibold text-muted">
            {t.emailTitle}
          </label>
          <input
            id="account-email"
            value={user.email ?? ""}
            readOnly
            className="mt-1.5 w-full rounded-xl border border-black/10 bg-black/[0.04] px-4 py-2.5 text-sm text-muted"
          />
        </form>

        <div className={card}>
          <h2 className="font-display text-lg font-semibold text-ink">{t.accessTitle}</h2>
          {isPro && <p className="mt-2 text-xs text-muted">{t.accessPro}</p>}
          <ul className="mt-4 space-y-3">
            {certs.map((c) => {
              const a = access.get(c.id);
              const active = isPro || a !== undefined;
              return (
                <li key={c.id} className="flex items-center gap-3 rounded-xl border border-black/8 p-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface">
                    {CERT_LOGOS[c.slug] ? (
                      <img src={CERT_LOGOS[c.slug]} alt="" className="h-8 w-8 object-contain" />
                    ) : (
                      <span className="brand-gradient h-2.5 w-2.5 rounded-full" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">{localize(c.name, lang)}</span>
                    <span className={`block text-xs ${active ? "text-green" : "text-muted"}`}>
                      {active
                        ? a
                          ? t.accessActiveUntil(fmt(new Date(a.expiresAt)))
                          : t.planPro
                        : t.accessNone}
                    </span>
                  </span>
                  {!active && (
                    <button
                      type="button"
                      onClick={() => openUpgradeModal(c.slug)}
                      className="shrink-0 rounded-full border border-teal/40 px-3 py-1.5 text-xs font-medium text-teal-dark hover:bg-teal/5"
                    >
                      {t.unlock}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {user.email?.toLowerCase() !== "mbairo.allatessem@gmail.com" && (
        <div className="mt-6 rounded-2xl border border-red-300/70 bg-red-50/40 p-6">
          <h2 className="font-display text-lg font-semibold text-red-700">{t.dangerTitle}</h2>
          <p className="mt-2 text-sm text-muted">{t.dangerText}</p>
          <button
            type="button"
            onClick={() => setDeleting(true)}
            className="mt-4 rounded-full border border-red-400 px-5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-[#ffffff]"
          >
            {t.dangerButton}
          </button>
        </div>
      )}

      {deleting && (
        <DeleteAccountDialog
          activeAccess={certs
            .filter((c) => isPro || access.has(c.id))
            .map((c) => {
              const a = access.get(c.id);
              return `${localize(c.name, lang)}${a ? ` (${fmt(new Date(a.expiresAt))})` : ""}`;
            })}
          onClose={() => setDeleting(false)}
          onDeleted={async () => {
            await signOut();
            navigate("/", { replace: true });
          }}
        />
      )}

      {picked && <AvatarCropper file={picked} busy={photoBusy} onCancel={() => setPicked(null)} onConfirm={savePhoto} />}
    </section>
  );
}

// Typed confirmation, then the deletion itself. The word is checked again on
// the server.
function DeleteAccountDialog({
  activeAccess,
  onClose,
  onDeleted,
}: {
  activeAccess: string[];
  onClose: () => void;
  onDeleted: () => Promise<void>;
}) {
  const { lang } = useLanguage();
  const t = USER_T[lang].profile;
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const confirmed = typed.trim() === t.deleteConfirmWord;

  async function run() {
    setBusy(true);
    setError(false);
    const ok = await deleteMyAccount(t.deleteConfirmWord);
    if (!ok) {
      setBusy(false);
      setError(true);
      return;
    }
    await onDeleted();
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 px-4" onClick={busy ? undefined : onClose}>
      <div
        role="dialog"
        aria-label={t.deleteModalTitle}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl"
      >
        <h2 className="font-display text-lg font-semibold text-ink">{t.deleteModalTitle}</h2>
        <p className="mt-2 text-[13px] text-muted">{t.dangerText}</p>

        {activeAccess.length > 0 && (
          <div className="mt-4 rounded-xl border border-amber/40 bg-amber/10 px-4 py-3 text-sm">
            <p className="font-semibold text-amber-ink">{t.deleteActiveAccess}</p>
            <ul className="mt-1 list-disc pl-5 text-ink">
              {activeAccess.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        )}

        <label htmlFor="delete-confirm" className="mt-5 block text-xs font-bold text-ink">
          {t.deleteTypeToConfirm(t.deleteConfirmWord)}
        </label>
        <input
          id="delete-confirm"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          autoComplete="off"
          className="mt-1.5 w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-200"
        />
        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{t.deleteError}</p>}

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
            type="button"
            onClick={run}
            disabled={!confirmed || busy}
            className="rounded-full bg-[#e5484d] px-5 py-2 text-sm font-semibold text-[#ffffff] hover:opacity-90 disabled:opacity-40"
          >
            {busy ? t.deleting : t.deleteConfirmButton}
          </button>
        </div>
      </div>
    </div>
  );
}
