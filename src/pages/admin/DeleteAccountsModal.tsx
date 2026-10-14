import { useEffect, useState } from "react";
import { useLanguage } from "../../i18n";
import { supabase } from "../../lib/supabase";
import { ADMIN_T } from "../adminI18n";
import { useAdminContext } from "./useAdminContext";

type Reason = "not_found" | "admin" | "paid_purchase" | "active_access";
interface Verdict {
  id: string;
  deletable: boolean;
  reasons: Reason[];
  answers: number;
  exams: number;
  hadVoucher: boolean;
}

// Two steps, nothing is deleted before the second: first a dry run that asks the
// server which of the chosen accounts may be deleted (and why the others may
// not), then a typed confirmation for the real deletion.
export default function DeleteAccountsModal({
  ids,
  onClose,
  onDone,
}: {
  ids: string[];
  onClose: () => void;
  onDone: () => void;
}) {
  const { lang } = useLanguage();
  const d = ADMIN_T[lang].del;
  const { data } = useAdminContext();
  const [verdicts, setVerdicts] = useState<Verdict[] | null>(null);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [finished, setFinished] = useState(false); // the real deletion has run
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  async function call(body: Record<string, unknown>) {
    const { data: session } = await supabase!.auth.getSession();
    const token = session.session?.access_token;
    return supabase!.functions.invoke("admin-delete-accounts", {
      body,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }

  useEffect(() => {
    if (!supabase) return;
    call({ ids, dry_run: true }).then(({ data: res, error }) => {
      if (error || res?.error) setResult({ ok: false, text: String(res?.error ?? error?.message) });
      else setVerdicts(res.results as Verdict[]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const who = (id: string) => {
    const p = data.profiles.find((x) => x.id === id);
    return p?.first_name ? `${p.first_name} (${p.email})` : (p?.email ?? id);
  };
  const deletable = verdicts?.filter((v) => v.deletable) ?? [];
  const blocked = verdicts?.filter((v) => !v.deletable) ?? [];
  const confirmed = typed.trim() === d.confirmWord;

  async function confirmDelete() {
    setBusy(true);
    const { data: res, error } = await call({ ids: deletable.map((v) => v.id), dry_run: false, confirm: true });
    setBusy(false);
    if (error || res?.error) {
      setResult({ ok: false, text: String(res?.error ?? error?.message) });
      return;
    }
    setFinished(true);
    const failed = (res.failed as unknown[]).length;
    setResult({
      ok: failed === 0,
      text: [d.done((res.deleted as unknown[]).length), failed ? d.failed(failed) : ""].filter(Boolean).join(" "),
    });
    onDone();
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div
        role="dialog"
        aria-label={d.title}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl"
      >
        <div className="border-b border-black/8 px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-ink">{d.title}</h2>
          <p className="mt-1 text-xs text-muted">{d.intro}</p>
        </div>

        <div className="space-y-4 overflow-y-auto px-5 py-4 text-sm">
          {verdicts === null && !result && <p className="text-muted">{d.checking}</p>}

          {verdicts && deletable.length > 0 && (
            <div>
              <p className="font-semibold text-ink">{d.deletable(deletable.length)}</p>
              <ul className="mt-2 max-h-44 overflow-y-auto rounded-lg border border-black/10">
                {deletable.map((v) => (
                  <li key={v.id} className="border-b border-black/5 px-3 py-1.5 last:border-0">
                    <span className="font-medium text-ink">{who(v.id)}</span>
                    <span className="block text-xs text-muted">{d.detail(v.answers, v.exams, v.hadVoucher)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {verdicts && blocked.length > 0 && (
            <div>
              <p className="font-semibold text-amber-ink">{d.protectedTitle(blocked.length)}</p>
              <ul className="mt-2 max-h-32 overflow-y-auto rounded-lg border border-amber/40 bg-amber/10">
                {blocked.map((v) => (
                  <li key={v.id} className="border-b border-black/5 px-3 py-1.5 last:border-0">
                    <span className="font-medium text-ink">{who(v.id)}</span>
                    <span className="block text-xs text-muted">{v.reasons.map((r) => d.reasons[r]).join(", ")}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {verdicts && deletable.length === 0 && <p className="text-muted">{d.nothing}</p>}

          {verdicts && deletable.length > 0 && !finished && (
            <div className="space-y-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
              <p className="text-xs text-danger-ink">{d.warning}</p>
              <label className="block text-xs font-bold text-ink">{d.typeToConfirm(d.confirmWord)}</label>
              <input
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                autoComplete="off"
                className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-ink"
              />
            </div>
          )}

          {result && (
            <p className={`rounded-lg px-3 py-2 ${result.ok ? "bg-green/10 text-green-ink" : "bg-red-500/10 text-danger-ink"}`}>
              {result.text}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-black/8 px-5 py-3">
          <button type="button" onClick={onClose} disabled={busy} className="rounded-full border border-black/12 px-4 py-2 text-sm font-medium text-ink hover:bg-black/[0.04]">
            {finished ? d.close : d.cancel}
          </button>
          {verdicts && deletable.length > 0 && !finished && (
            <button
              type="button"
              onClick={confirmDelete}
              disabled={!confirmed || busy}
              className="rounded-full bg-[#e5484d] px-4 py-2 text-sm font-medium text-[#ffffff] hover:opacity-90 disabled:opacity-40"
            >
              {busy ? d.deleting : d.confirmButton(deletable.length)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
