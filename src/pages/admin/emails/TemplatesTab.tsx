import { useState } from "react";
import { useLanguage } from "../../../i18n";
import { supabase } from "../../../lib/supabase";
import { adminLocale } from "../../adminI18n";
import { EMAIL_T, TEMPLATE_CATEGORIES } from "../../adminEmailsI18n";
import { IconPencil, IconTrash } from "../AdminIcons";
import Badge from "../Badge";
import DataTable, { type Column } from "../DataTable";
import EmailPreview from "./EmailPreview";
import { btnDanger, btnGhost, btnPrimary } from "./SentTab";
import { toParagraphs, type EmailsApi, type EmailTemplate } from "./types";

const fieldClass = "w-full rounded-lg border border-black/12 bg-white px-3 py-2 text-sm text-ink";
const labelClass = "mb-1.5 block text-xs font-bold text-muted";

interface Form {
  id: string | null;
  category: string;
  name: string;
  subject: string;
  body: string;
  subjectEn: string;
  bodyEn: string;
}

export default function TemplatesTab({ api }: { api: EmailsApi }) {
  const { lang } = useLanguage();
  const t = EMAIL_T[lang];
  const locale = adminLocale(lang);
  const [form, setForm] = useState<Form | null>(null);
  const [tab, setTab] = useState<"fr" | "en">("fr");
  const [busy, setBusy] = useState(false);
  const [selecting, setSelecting] = useState<Set<string> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categoryLabel = (c: string) => t.categories[c as keyof typeof t.categories] ?? c;

  async function save() {
    if (!supabase || !form) return;
    setBusy(true);
    setError(null);
    const hasEn = form.subjectEn.trim() !== "" && form.bodyEn.trim() !== "";
    const row = {
      category: form.category,
      name: form.name.trim(),
      subject: form.subject.trim(),
      body: form.body,
      subject_en: hasEn ? form.subjectEn.trim() : null,
      body_en: hasEn ? form.bodyEn : null,
    };
    const { error: e } = form.id
      ? await supabase.from("admin_email_templates").update({ ...row, updated_at: new Date().toISOString() }).eq("id", form.id)
      : await supabase.from("admin_email_templates").insert(row);
    setBusy(false);
    if (e) {
      setError(e.message);
      return;
    }
    setForm(null);
    await api.reload();
  }

  async function trash(ids: string[]) {
    if (!supabase || ids.length === 0) return;
    const { error: e } = await supabase
      .from("admin_email_templates")
      .update({ trashed_at: new Date().toISOString() })
      .in("id", ids);
    if (e) setError(e.message);
    setSelecting(null);
    await api.reload();
  }

  const columns: Column<EmailTemplate>[] = [
    {
      key: "category",
      label: t.templates.category,
      value: (m) => categoryLabel(m.category),
      filter: "options",
      render: (m) => <Badge tone="teal">{categoryLabel(m.category)}</Badge>,
    },
    { key: "name", label: t.templates.name, value: (m) => m.name, render: (m) => <span className="font-medium text-ink">{m.name}</span> },
    { key: "subject", label: t.templates.subject, value: (m) => m.subject },
    {
      key: "langs",
      label: t.composer.language,
      value: (m) => (m.body_en ? "FR + EN" : "FR"),
      filter: "options",
    },
    {
      key: "updated",
      label: t.templates.colUpdated,
      value: (m) => m.updated_at,
      filter: "date",
      render: (m) => new Date(m.updated_at).toLocaleString(locale),
    },
  ];

  return (
    <div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-sm text-muted">{t.templates.intro}</p>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={btnPrimary} onClick={() => {
                setTab("fr");
                setForm({ id: null, category: "other", name: "", subject: "", body: "", subjectEn: "", bodyEn: "" });
              }}>
            <IconPencil /> {t.newTemplate}
          </button>
          {selecting ? (
            <>
              <button type="button" className={btnGhost} onClick={() => setSelecting(null)}>
                {t.cancel}
              </button>
              <button type="button" className={btnDanger} disabled={selecting.size === 0} onClick={() => trash([...selecting])}>
                <IconTrash /> {t.moveToTrash(selecting.size)}
              </button>
            </>
          ) : (
            <button type="button" className={btnGhost} title={t.deleteMode} aria-label={t.deleteMode} onClick={() => setSelecting(new Set())}>
              <IconTrash />
            </button>
          )}
        </div>
      </div>
      {error && <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-danger-ink">{error}</p>}

      {form && (
        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
          <div className="space-y-4 rounded-2xl border border-black/8 bg-white p-5 shadow-sm">
            <h3 className="font-display text-base font-semibold text-ink">{form.id ? t.templates.edit : t.templates.newTitle}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>{t.templates.category}</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={fieldClass}>
                  {TEMPLATE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {t.categories[c]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>{t.templates.name}</label>
                <input value={form.name} placeholder={t.templates.namePlaceholder} onChange={(e) => setForm({ ...form, name: e.target.value })} className={fieldClass} />
              </div>
            </div>
            <div className="flex w-fit gap-0.5 rounded-xl border border-black/8 p-1">
              {(["fr", "en"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setTab(l)}
                  className={`rounded-lg px-4 py-1.5 text-[13px] font-bold transition ${
                    tab === l ? "bg-teal/13 text-teal-dark" : "text-muted hover:text-ink"
                  }`}
                >
                  {l === "fr" ? t.composer.tabFrench : t.composer.tabEnglish}
                  {l === "en" && form.subjectEn.trim() && form.bodyEn.trim() ? " ✓" : ""}
                </button>
              ))}
            </div>
            {tab === "en" && <p className="-mt-2 text-xs text-muted">{t.templates.englishVersion}. {t.composer.englishHint}</p>}
            <div>
              <label className={labelClass}>{t.templates.subject}</label>
              <input
                value={tab === "fr" ? form.subject : form.subjectEn}
                maxLength={150}
                onChange={(e) => setForm({ ...form, ...(tab === "fr" ? { subject: e.target.value } : { subjectEn: e.target.value }) })}
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>{t.templates.body}</label>
              <textarea
                value={tab === "fr" ? form.body : form.bodyEn}
                rows={8}
                placeholder={t.templates.bodyPlaceholder}
                onChange={(e) => setForm({ ...form, ...(tab === "fr" ? { body: e.target.value } : { bodyEn: e.target.value }) })}
                className={fieldClass}
              />
              <p className="mt-1 text-xs text-muted">{t.composer.messageHint}</p>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className={btnGhost} disabled={busy} onClick={() => setForm(null)}>
                {t.cancel}
              </button>
              <button type="button" className={btnPrimary} disabled={busy || !form.name.trim() || !form.subject.trim() || !form.body.trim()} onClick={save}>
                {busy ? t.saving : t.save}
              </button>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-bold tracking-wide text-muted uppercase">{t.composer.previewTitle}</p>
            <EmailPreview
              firstName="Prénom"
              paragraphs={toParagraphs((tab === "fr" ? form.body : form.bodyEn).split("{prenom}").join("Prénom"))}
              emailLang={tab}
            />
          </div>
        </div>
      )}

      <DataTable
        rows={api.templates}
        columns={columns}
        rowKey={(m) => m.id}
        emptyText={t.templates.empty}
        initialSort={{ key: "updated", dir: "desc" }}
        selected={selecting ?? undefined}
        onSelectedChange={selecting ? setSelecting : undefined}
        onRowClick={
          selecting
            ? undefined
            : (m) => {
                setTab("fr");
                setForm({
                  id: m.id,
                  category: m.category,
                  name: m.name,
                  subject: m.subject,
                  body: m.body,
                  subjectEn: m.subject_en ?? "",
                  bodyEn: m.body_en ?? "",
                });
              }
        }
      />
    </div>
  );
}
