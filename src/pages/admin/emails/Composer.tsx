import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../../../i18n";
import { supabase } from "../../../lib/supabase";
import { EMAIL_T, SEGMENT_IDS, type SegmentId } from "../../adminEmailsI18n";
import { useAdminContext } from "../useAdminContext";
import EmailPreview from "./EmailPreview";
import { toParagraphs, type EmailTemplate } from "./types";

const fieldClass = "w-full rounded-lg border border-black/12 bg-white px-3 py-2 text-sm text-ink";
const labelClass = "mb-1.5 block text-xs font-bold text-muted";

type Lang = "fr" | "en";
interface Counts {
  recipients: number;
  fr: number;
  en: number;
  unsubscribed_excluded: number;
}

export default function Composer({
  templates,
  initial,
  onClose,
  onSent,
}: {
  templates: EmailTemplate[];
  // Pre-filled targeting, e.g. people picked in the Users table.
  initial?: { segment?: SegmentId; ids?: string[] };
  onClose: () => void;
  onSent: () => void;
}) {
  const { lang } = useLanguage();
  const t = EMAIL_T[lang];
  const c = t.composer;
  const { data } = useAdminContext();

  const [type, setType] = useState<"service" | "promotion">("service");
  const [segment, setSegment] = useState<SegmentId>(initial?.ids?.length ? "selection" : (initial?.segment ?? "dormant"));
  const [ids, setIds] = useState<string[]>(initial?.ids ?? []);
  const [language, setLanguage] = useState<"" | Lang>("");
  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState<string[] | null>(null);
  const [search, setSearch] = useState("");
  // Content, one version per language (French is required, English optional).
  const [tab, setTab] = useState<Lang>("fr");
  const [content, setContent] = useState({
    fr: { subject: "", message: "", cta: "" },
    en: { subject: "", message: "", cta: "" },
  });
  const [ctaUrl, setCtaUrl] = useState("");
  const [count, setCount] = useState<Counts | null>(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const cur = content[tab];
  const setCur = (patch: Partial<typeof cur>) => setContent((prev) => ({ ...prev, [tab]: { ...prev[tab], ...patch } }));
  const hasEnglish = content.en.subject.trim() !== "" && content.en.message.trim() !== "";

  // Live "n recipients" for the current targeting, with the French / English
  // split (counts only, never addresses).
  useEffect(() => {
    if (!supabase) return;
    setCount(null);
    const timer = setTimeout(() => {
      supabase!
        .rpc("admin_count_email_recipients", { p_segment: segment, p_ids: ids, p_type: type, p_language: language || null })
        .then(({ data: res, error }) => {
          if (!error && res) setCount(res as Counts);
        });
    }, 250);
    return () => clearTimeout(timer);
  }, [segment, ids, type, language]);

  // Who the current group contains, so the list can be checked and picked from.
  useEffect(() => {
    if (!supabase || !showMembers || segment === "selection") return;
    setMembers(null);
    supabase
      .rpc("admin_email_segment_members", { p_segment: segment, p_ids: ids, p_type: type, p_language: language || null })
      .then(({ data: res, error }) => setMembers(error ? [] : ((res as { user_id: string }[]) ?? []).map((r) => r.user_id)));
  }, [showMembers, segment, type, ids, language]);

  const matches = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return data.profiles
      .filter((p) => !ids.includes(p.id) && `${p.first_name ?? ""} ${p.email ?? ""}`.toLowerCase().includes(q))
      .slice(0, 8);
  }, [data.profiles, search, ids]);
  const nameOf = (id: string) => {
    const p = data.profiles.find((x) => x.id === id);
    return p?.first_name ? `${p.first_name} (${p.email})` : (p?.email ?? id);
  };

  const ready =
    content.fr.subject.trim() !== "" &&
    content.fr.message.trim() !== "" &&
    (ctaUrl === "" || ctaUrl.startsWith("https://")) &&
    (segment !== "selection" || ids.length > 0);

  async function send(test: boolean, testLanguage?: Lang) {
    if (!supabase || !ready) return;
    if (!test && !window.confirm(c.confirmSend(count?.recipients ?? 0))) return;
    setBusy(true);
    setFeedback(null);
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    const { data: res, error } = await supabase.functions.invoke("admin-send-email", {
      body: {
        type,
        segment,
        ids,
        language: language || null,
        subject: content.fr.subject,
        message: content.fr.message,
        cta_label: content.fr.cta.trim() || undefined,
        subject_en: hasEnglish ? content.en.subject : undefined,
        message_en: hasEnglish ? content.en.message : undefined,
        cta_label_en: hasEnglish ? content.en.cta.trim() || undefined : undefined,
        cta_url: ctaUrl.trim() || undefined,
        test,
        test_language: testLanguage,
      },
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    setBusy(false);
    if (error || res?.error) {
      let text = res?.error ?? error?.message ?? "Error";
      try {
        const body = await (error as { context?: Response } | null)?.context?.json();
        if (body?.error) text = body.error;
      } catch {
        // response was not JSON
      }
      setFeedback({ ok: false, text });
      return;
    }
    setFeedback({
      ok: res.failed === 0,
      text: test ? c.testSent : `${c.sentResult(res.sent, res.recipients, res.failed)}${res.english ? ` (${c.sentEnglish(res.english)})` : ""}`,
    });
    if (!test) {
      onSent();
      if (res.failed === 0) setTimeout(onClose, 1500);
    }
  }

  async function saveAsTemplate() {
    if (!supabase || !content.fr.subject.trim() || !content.fr.message.trim()) return;
    const name = window.prompt(t.templates.name, content.fr.subject.trim());
    if (!name?.trim()) return;
    const { error } = await supabase.from("admin_email_templates").insert({
      category: type === "promotion" ? "promotion" : "other",
      name: name.trim(),
      subject: content.fr.subject,
      body: content.fr.message,
      subject_en: hasEnglish ? content.en.subject : null,
      body_en: hasEnglish ? content.en.message : null,
    });
    setFeedback(error ? { ok: false, text: error.message } : { ok: true, text: t.templates.newTitle + " ✓" });
    if (!error) onSent();
  }

  const typeButton = (value: "service" | "promotion", label: string, hint: string) => (
    <button
      type="button"
      onClick={() => setType(value)}
      aria-pressed={type === value}
      className={`flex-1 rounded-xl border px-3 py-2.5 text-left transition ${
        type === value ? "border-teal bg-teal/10" : "border-black/12 hover:border-black/25"
      }`}
    >
      <span className="block text-sm font-bold text-ink">{label}</span>
      <span className="block text-xs text-muted">{hint}</span>
    </button>
  );

  const adminName = data.profiles.find((p) => p.email?.toLowerCase() === "mbairo.allatessem@gmail.com")?.first_name;
  const preview = toParagraphs(cur.message.split("{prenom}").join(adminName ?? "Prénom"));
  const englishRecipients = count?.en ?? 0;

  return (
    <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
      <div className="space-y-4 rounded-2xl border border-black/8 bg-white p-5 shadow-sm">
        <h3 className="font-display text-base font-semibold text-ink">{c.title}</h3>

        <div>
          <span className={labelClass}>{c.type}</span>
          <div className="flex flex-col gap-2 sm:flex-row">
            {typeButton("service", c.typeService, c.typeServiceHint)}
            {typeButton("promotion", c.typePromotion, c.typePromotionHint)}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_200px]">
          <div>
            <label className={labelClass}>{c.target}</label>
            <select value={segment} onChange={(e) => setSegment(e.target.value as SegmentId)} className={fieldClass}>
              {SEGMENT_IDS.map((id) => (
                <option key={id} value={id}>
                  {t.segments[id].label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>{c.language}</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value as "" | Lang)} className={fieldClass}>
              <option value="">{c.langAll}</option>
              <option value="fr">{c.langFr}</option>
              <option value="en">{c.langEn}</option>
            </select>
          </div>
        </div>
        <p className="-mt-2 text-xs text-muted">
          {t.segments[segment].hint}
          {" · "}
          <b className="text-ink">{count ? c.recipients(count.recipients) : "…"}</b>
          {count && count.recipients > 0 && ` (${c.split(count.fr, count.en)})`}
          {count && count.unsubscribed_excluded > 0 && ` · ${c.unsubscribedExcluded(count.unsubscribed_excluded)}`}
        </p>

        {segment !== "selection" && count && count.recipients > 0 && (
          <div>
            <button type="button" onClick={() => setShowMembers((v) => !v)} className="text-sm font-semibold text-teal-dark hover:underline">
              {showMembers ? c.hideRecipients : c.showRecipients(count.recipients)}
            </button>
            {showMembers && (
              <div className="mt-2 rounded-lg border border-black/10">
                <ul className="max-h-56 overflow-y-auto">
                  {members === null && <li className="px-3 py-2 text-sm text-muted">{t.loading}</li>}
                  {members?.length === 0 && <li className="px-3 py-2 text-sm text-muted">{c.noRecipients}</li>}
                  {members?.map((id) => {
                    const p = data.profiles.find((x) => x.id === id);
                    return (
                      <li key={id} className="flex items-baseline justify-between gap-3 border-b border-black/5 px-3 py-1.5 text-sm last:border-0">
                        <span className="font-medium text-ink">
                          {p?.first_name ?? "-"}
                          <span className="ml-2 text-[11px] font-normal text-muted uppercase">{p?.language ?? "fr"}</span>
                        </span>
                        <span className="truncate text-xs text-muted">{p?.email}</span>
                      </li>
                    );
                  })}
                </ul>
                {members && members.length > 0 && (
                  <div className="border-t border-black/8 px-3 py-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIds(members);
                        setSegment("selection");
                      }}
                      className="text-sm font-semibold text-teal-dark hover:underline"
                    >
                      {c.pickByHand}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {segment === "selection" && (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-bold text-muted">{c.pickMembers}</label>
              {ids.length > 0 && (
                <button type="button" onClick={() => setIds([])} className="text-xs font-semibold text-teal-dark hover:underline">
                  {c.clearAll}
                </button>
              )}
            </div>
            <div className="mb-2 flex max-h-40 flex-wrap gap-1.5 overflow-y-auto">
              {ids.map((id) => (
                <span key={id} className="inline-flex items-center gap-1.5 rounded-full bg-teal/12 py-1 pr-1.5 pl-3 text-xs text-teal-dark">
                  {nameOf(id)}
                  <button
                    type="button"
                    onClick={() => setIds(ids.filter((x) => x !== id))}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-black/8 hover:bg-black/15"
                    aria-label="Remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={c.searchMember} className={fieldClass} />
            {matches.length > 0 && (
              <ul className="mt-1 max-h-48 overflow-y-auto rounded-lg border border-black/10 bg-white">
                {matches.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setIds([...ids, p.id]);
                        setSearch("");
                      }}
                      className="block w-full px-3 py-2 text-left text-sm text-ink hover:bg-black/[0.04]"
                    >
                      {p.first_name ?? "-"} <span className="text-muted">{p.email}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div>
          <label className={labelClass}>{c.template}</label>
          <select
            value=""
            onChange={(e) => {
              const tpl = templates.find((x) => x.id === e.target.value);
              if (tpl) {
                setContent({
                  fr: { subject: tpl.subject, message: tpl.body, cta: "" },
                  en: { subject: tpl.subject_en ?? "", message: tpl.body_en ?? "", cta: "" },
                });
              }
            }}
            className={fieldClass}
          >
            <option value="">{c.noTemplate}</option>
            {templates.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>
                {tpl.name}
                {tpl.body_en ? " · FR/EN" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-0.5 rounded-xl border border-black/8 p-1 w-fit">
          {(["fr", "en"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setTab(l)}
              className={`rounded-lg px-4 py-1.5 text-[13px] font-bold transition ${
                tab === l ? "bg-teal/13 text-teal-dark" : "text-muted hover:text-ink"
              }`}
            >
              {l === "fr" ? c.tabFrench : c.tabEnglish}
              {l === "en" && hasEnglish && " ✓"}
            </button>
          ))}
        </div>
        {tab === "en" && <p className="-mt-2 text-xs text-muted">{c.englishHint}</p>}

        <div>
          <label className={labelClass}>{c.subject}</label>
          <input value={cur.subject} maxLength={150} onChange={(e) => setCur({ subject: e.target.value })} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>{c.message}</label>
          <textarea value={cur.message} rows={8} maxLength={5000} onChange={(e) => setCur({ message: e.target.value })} className={fieldClass} />
          <p className="mt-1 text-xs text-muted">{c.messageHint}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass}>{c.ctaLabel}</label>
            <input value={cur.cta} onChange={(e) => setCur({ cta: e.target.value })} placeholder={c.ctaOptional} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>{c.ctaUrl}</label>
            <input value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="https://lampasai.com/formations" className={fieldClass} />
          </div>
        </div>

        {englishRecipients > 0 && !hasEnglish && (
          <p className="rounded-lg bg-amber/15 px-3 py-2 text-sm text-amber-ink">{c.noEnglishWarning(englishRecipients)}</p>
        )}
        {feedback && (
          <p className={`rounded-lg px-3 py-2 text-sm ${feedback.ok ? "bg-green/10 text-green-ink" : "bg-red-500/10 text-danger-ink"}`}>
            {feedback.text}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <button type="button" onClick={saveAsTemplate} disabled={!content.fr.subject.trim() || !content.fr.message.trim()} className="text-sm font-semibold text-teal-dark hover:underline disabled:opacity-40">
            {c.saveAsTemplate}
          </button>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={onClose} disabled={busy} className="rounded-full border border-black/12 px-4 py-2 text-sm font-medium text-ink hover:bg-black/[0.04]">
              {t.cancel}
            </button>
            <button type="button" onClick={() => send(true, "fr")} disabled={busy || !ready} className="rounded-full border border-teal/40 px-4 py-2 text-sm font-medium text-teal-dark hover:bg-teal/5 disabled:opacity-40">
              {c.sendTestIn("fr")}
            </button>
            {hasEnglish && (
              <button type="button" onClick={() => send(true, "en")} disabled={busy || !ready} className="rounded-full border border-teal/40 px-4 py-2 text-sm font-medium text-teal-dark hover:bg-teal/5 disabled:opacity-40">
                {c.sendTestIn("en")}
              </button>
            )}
            <button
              type="button"
              onClick={() => send(false)}
              disabled={busy || !ready || !count || count.recipients === 0}
              className="brand-gradient rounded-full px-5 py-2 text-sm font-medium text-[#ffffff] hover:opacity-90 disabled:opacity-40"
            >
              {busy ? c.sending : c.send}
            </button>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold tracking-wide text-muted uppercase">
          {c.previewTitle} · {tab === "fr" ? c.tabFrench : c.tabEnglish}
        </p>
        <EmailPreview
          firstName={adminName ?? "Prénom"}
          paragraphs={preview}
          ctaLabel={cur.cta.trim() || undefined}
          promotion={type === "promotion"}
          emailLang={tab}
        />
      </div>
    </div>
  );
}
