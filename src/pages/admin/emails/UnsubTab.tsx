import { useLanguage } from "../../../i18n";
import { adminLocale } from "../../adminI18n";
import { EMAIL_T } from "../../adminEmailsI18n";
import DataTable, { type Column } from "../DataTable";
import { useAdminContext } from "../useAdminContext";
import type { EmailsApi } from "./types";

export default function UnsubTab({ api }: { api: EmailsApi }) {
  const { lang } = useLanguage();
  const t = EMAIL_T[lang];
  const locale = adminLocale(lang);
  const { data } = useAdminContext();
  const profileById = new Map(data.profiles.map((p) => [p.id, p]));

  type Row = { user_id: string; created_at: string };
  const columns: Column<Row>[] = [
    {
      key: "name",
      label: t.unsub.colName,
      value: (r) => profileById.get(r.user_id)?.first_name ?? "",
      render: (r) => <span className="font-medium text-ink">{profileById.get(r.user_id)?.first_name ?? "-"}</span>,
    },
    { key: "email", label: t.unsub.colEmail, value: (r) => profileById.get(r.user_id)?.email ?? "" },
    {
      key: "date",
      label: t.unsub.colDate,
      value: (r) => r.created_at,
      filter: "date",
      render: (r) => new Date(r.created_at).toLocaleString(locale),
    },
  ];

  return (
    <div>
      <p className="mt-5 text-sm text-muted">{t.unsub.intro}</p>
      <DataTable
        rows={api.unsubscribed}
        columns={columns}
        rowKey={(r) => r.user_id}
        emptyText={t.unsub.empty}
        initialSort={{ key: "date", dir: "desc" }}
      />
    </div>
  );
}
