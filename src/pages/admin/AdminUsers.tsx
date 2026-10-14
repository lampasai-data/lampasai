import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../../i18n";
import { localize } from "../../lib/i18nText";
import { ADMIN_EMAIL, isActivePurchase, type AdminExamResult, type AdminProfile, type AdminPurchase } from "../../lib/adminData";
import { segmentUserIds, type UserSegment } from "../../lib/adminAlerts";
import DeleteAccountsModal from "./DeleteAccountsModal";
import { ADMIN_T, adminLocale } from "../adminI18n";
import Avatar from "../../components/Avatar";
import Badge from "./Badge";
import DataTable, { type Column } from "./DataTable";
import { useAdminContext } from "./useAdminContext";

type AccessStatus = "active" | "expired" | "none";
type AccessOrigin = "paid" | "voucher" | "both" | "none";

interface UserRow {
  profile: AdminProfile;
  purchases: AdminPurchase[];
  results: AdminExamResult[];
  active: AdminPurchase[];
  status: AccessStatus;
  // How the current access was obtained: bought, unlocked with a voucher, or both.
  origin: AccessOrigin;
  lastExam: string | null;
  accessEnd: string | null;
}

export default function AdminUsers() {
  const { lang } = useLanguage();
  const a = ADMIN_T[lang];
  const locale = adminLocale(lang);
  const { data, loading, reload } = useAdminContext();
  const location = useLocation();
  const navigate = useNavigate();

  // An alert can open this page pre-filtered on a segment (location state).
  const initialSegment = (location.state as { segment?: UserSegment } | null)?.segment ?? null;
  const [segment, setSegment] = useState<UserSegment | null>(initialSegment);
  // Tick people (the header box ticks every row of the current filter) to write
  // to them or delete them; the action bar shows up as soon as one is ticked.
  const [picking, setPicking] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<string[] | null>(null);
  const writeTo = (ids: string[]) => navigate("/admin/emails", { state: { compose: { ids } } });

  const allRows = useMemo<UserRow[]>(() => {
    const now = Date.now();
    const group = <T extends { user_id: string }>(rows: T[]) => {
      const map = new Map<string, T[]>();
      for (const r of rows) map.set(r.user_id, [...(map.get(r.user_id) ?? []), r]);
      return map;
    };
    const purchasesBy = group(data.purchases.filter((p) => p.status === "paid"));
    const resultsBy = group(data.results);

    return data.profiles.map((profile) => {
      const purchases = purchasesBy.get(profile.id) ?? [];
      const results = [...(resultsBy.get(profile.id) ?? [])].sort((x, y) => y.completed_at.localeCompare(x.completed_at));
      const active = purchases.filter((p) => isActivePurchase(p, now));
      const status: AccessStatus = active.length > 0 ? "active" : purchases.length > 0 ? "expired" : "none";
      const accessEnd =
        (status === "active" ? active : purchases).map((p) => p.expires_at).sort().at(-1) ?? null;
      const paidActive = active.some((p) => p.source !== "voucher");
      const voucherActive = active.some((p) => p.source === "voucher");
      const origin: AccessOrigin = paidActive && voucherActive ? "both" : paidActive ? "paid" : voucherActive ? "voucher" : "none";
      return { profile, purchases, results, active, status, origin, lastExam: results[0]?.completed_at ?? null, accessEnd };
    });
  }, [data]);

  const cleanupCount = useMemo(() => segmentUserIds(data, "cleanup").size, [data]);

  const rows = useMemo(() => {
    if (!segment) return allRows;
    const ids = segmentUserIds(data, segment);
    return allRows.filter((r) => ids.has(r.profile.id));
  }, [allRows, data, segment]);

  // Never keep a ticked person that is no longer in the list (segment change,
  // reload after a deletion): a delete must only ever hit rows that are shown.
  useEffect(() => {
    const ids = new Set(rows.map((r) => r.profile.id));
    setPicking((prev) => (prev.size === 0 || [...prev].every((id) => ids.has(id)) ? prev : new Set([...prev].filter((id) => ids.has(id)))));
  }, [rows]);

  const certName = (id: string) => {
    const c = data.certs.find((x) => x.id === id);
    return c ? localize(c.name, lang) : id;
  };
  // Short name of the certification(s) the user can use today.
  const shortCert = (id: string) => {
    const c = data.certs.find((x) => x.id === id);
    if (!c) return id;
    if (c.slug === "snowflake") return "Snowflake";
    if (c.slug === "power-bi") return "Power BI";
    return localize(c.name, lang);
  };
  const certsOf = (r: UserRow) => [...new Set(r.active.map((p) => shortCert(p.certification_id)))].join(", ");
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(locale);
  const statusLabel: Record<AccessStatus, string> = {
    active: a.filterActive,
    expired: a.filterExpired,
    none: a.noAccess,
  };
  const statusTone = { active: "green", expired: "amber", none: "muted" } as const;
  const originLabel: Record<AccessOrigin, string> = {
    paid: a.originPaid,
    voucher: a.originVoucher,
    both: a.originBoth,
    none: "-",
  };
  const originTone = { paid: "green", voucher: "teal", both: "teal", none: "muted" } as const;

  const fmtDateTime = (iso: string) =>
    new Date(iso).toLocaleString(locale, { dateStyle: "short", timeStyle: "short" });

  const columns: Column<UserRow>[] = [
    {
      key: "avatar",
      label: a.colAvatar,
      render: (r) => <Avatar src={r.profile.avatar_url} firstName={r.profile.first_name} email={r.profile.email} />,
    },
    {
      key: "user",
      label: a.colUser,
      value: (r) => r.profile.first_name ?? "",
      render: (r) => (
        <span className="font-medium text-ink">
          {r.profile.first_name ?? "-"}
          {r.profile.email?.toLowerCase() === ADMIN_EMAIL && (
            <span className="ml-2 align-middle">
              <Badge tone="teal">admin</Badge>
            </span>
          )}
        </span>
      ),
    },
    { key: "email", label: a.colEmail, value: (r) => r.profile.email ?? "" },
    {
      key: "access",
      label: a.colAccess,
      value: (r) => statusLabel[r.status],
      filter: "options",
      render: (r) => (
        <span>
          <Badge tone={statusTone[r.status]}>{statusLabel[r.status]}</Badge>
        </span>
      ),
    },
    {
      key: "origin",
      label: a.colOrigin,
      value: (r) => originLabel[r.origin],
      filter: "options",
      render: (r) => (r.origin === "none" ? "-" : <Badge tone={originTone[r.origin]}>{originLabel[r.origin]}</Badge>),
    },
    {
      key: "certification",
      label: a.colCertification,
      value: (r) => certsOf(r),
      filter: "options",
      render: (r) => certsOf(r) || "-",
    },
    {
      key: "code",
      label: a.colCode,
      value: (r) => (data.voucherUses.get(r.profile.id) ?? []).map((u) => u.code).join(" "),
      render: (r) => {
        const uses = data.voucherUses.get(r.profile.id) ?? [];
        if (uses.length === 0) return "-";
        return (
          <span className="block space-y-1">
            {uses.map((u) => (
              <span key={`${u.code}-${u.redeemed_at}`} className="block whitespace-nowrap">
                <span className="font-mono font-medium text-ink">{u.code}</span>
              </span>
            ))}
          </span>
        );
      },
    },
    {
      key: "language",
      label: a.colLanguage,
      value: (r) => a.langValue(r.profile.language),
      filter: "options",
    },
    {
      key: "until",
      label: a.colAccessEnd,
      value: (r) => r.accessEnd,
      filter: "date",
      render: (r) => (r.accessEnd ? fmtDate(r.accessEnd) : "-"),
    },
    { key: "exams", label: a.colSessions, value: (r) => r.results.length },
    {
      key: "last",
      label: a.colLastActivity,
      value: (r) => r.lastExam,
      filter: "date",
      render: (r) => (r.lastExam ? fmtDate(r.lastExam) : "-"),
    },
    {
      key: "login",
      label: a.colLastLogin,
      value: (r) => data.lastSignIn.get(r.profile.id) ?? null,
      filter: "date",
      render: (r) => {
        const at = data.lastSignIn.get(r.profile.id);
        return <span className="whitespace-nowrap">{at ? fmtDateTime(at) : "-"}</span>;
      },
    },
    {
      key: "signed",
      label: a.statsSignedUp,
      value: (r) => r.profile.created_at,
      filter: "date",
      render: (r) => fmtDate(r.profile.created_at),
    },
  ];

  return (
    <section className="w-full max-w-[1600px] px-6 lg:px-8 pt-8 pb-16">
      <h1 className="font-display text-2xl font-semibold text-ink">{a.usersTitle}</h1>
      <p className="mt-2 text-sm text-muted">{a.usersSubtitle}</p>

      {segment && (
        <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber/20 py-1 pr-1.5 pl-3 text-xs font-semibold text-amber-ink">
          {a.al.segment(a.al.segments[segment])}
          <button
            type="button"
            aria-label={a.dt.clear}
            onClick={() => setSegment(null)}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 text-sm leading-none hover:bg-black/20"
          >
            ×
          </button>
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {picking.size > 0 ? (
          <>
            <span className="mr-1 text-sm font-semibold text-ink">{a.selectedN(picking.size)}</span>
            <button
              type="button"
              onClick={() => writeTo([...picking])}
              className="brand-gradient inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-[#ffffff] hover:opacity-90"
            >
              {a.writeToN(picking.size)}
            </button>
            <button
              type="button"
              onClick={() => setDeleting([...picking])}
              className="inline-flex items-center rounded-full border border-red-500/40 px-4 py-2 text-sm font-medium text-danger-ink hover:bg-red-500/10"
            >
              {a.deleteN(picking.size)}
            </button>
            <button type="button" onClick={() => setPicking(new Set())} className="inline-flex items-center rounded-full border border-black/12 px-4 py-2 text-sm font-medium text-ink hover:bg-black/[0.04]">
              {a.dt.clear}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setSegment("cleanup")}
              disabled={cleanupCount === 0}
              className="inline-flex items-center rounded-full border border-black/12 px-4 py-2 text-sm font-medium text-ink hover:bg-black/[0.04] disabled:opacity-40"
            >
              {a.cleanupButton(cleanupCount)}
            </button>
            {segment === "cleanup" && rows.length > 0 && (
              <button
                type="button"
                onClick={() => setDeleting(rows.map((r) => r.profile.id))}
                className="inline-flex items-center rounded-full bg-[#e5484d] px-3 py-1.5 text-xs font-medium text-[#ffffff] hover:opacity-90"
              >
                {a.deleteAllShown(rows.length)}
              </button>
            )}
          </>
        )}
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-muted">{a.loading}</p>
      ) : (
        <DataTable
          selected={picking}
          onSelectedChange={setPicking}
          rows={rows}
          columns={columns}
          rowKey={(r) => r.profile.id}
          searchPlaceholder={a.usersSearch}
          emptyText={a.noUserMatch}
          initialSort={{ key: "signed", dir: "desc" }}
          expanded={({ purchases, results }) => (
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">{a.purchasesHeading}</h3>
                {purchases.length === 0 ? (
                  <p className="mt-2 text-sm text-muted">{a.noPurchases}</p>
                ) : (
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {purchases.map((p) => (
                      <li key={`${p.certification_id}-${p.created_at}`}>
                        <span className="font-medium text-ink">{certName(p.certification_id)}</span>
                        <span className="text-muted">
                          {" · "}
                          {a.sourceLabel(p.source)}
                          {" · "}
                          {fmtDate(p.created_at)} → {fmtDate(p.expires_at)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">{a.examsHeading}</h3>
                {results.length === 0 ? (
                  <p className="mt-2 text-sm text-muted">{a.noExams}</p>
                ) : (
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {results.slice(0, 5).map((r) => (
                      <li key={r.completed_at}>
                        <span className="font-medium text-ink">{certName(r.certification_id)}</span>
                        <span className="text-muted">
                          {" · "}
                          {r.correct_count}/{r.total_count} (
                          {r.total_count > 0 ? Math.round((r.correct_count / r.total_count) * 100) : 0}%){" · "}
                          {fmtDate(r.completed_at)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        />
      )}
      {deleting && (
        <DeleteAccountsModal
          ids={deleting}
          onClose={() => {
            setDeleting(null);
          }}
          onDone={() => {
            setPicking(new Set());
            reload();
          }}
        />
      )}
    </section>
  );
}
