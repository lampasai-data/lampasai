import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "../../i18n";
import { ADMIN_T, adminLocale } from "../adminI18n";
import { IconFilter, IconSearch, IconSort } from "./AdminIcons";

export interface Column<T> {
  key: string;
  label: string;
  // Value used to sort AND filter; a column without it is neither.
  value?: (row: T) => string | number | null | undefined;
  render?: (row: T) => ReactNode;
  // "options": checkbox list of the distinct values (with counts) instead of
  // a text search. "date": from/until range; `value` must return an ISO date.
  filter?: "options" | "date";
  align?: "right";
}

type Range = { from: string; to: string };
type Sort = { key: string; dir: "asc" | "desc" } | null;

const EMPTY = "\u0000empty";

function normalise(v: unknown): string {
  return String(v ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

const keyOf = (v: unknown) => (v == null || v === "" ? EMPTY : String(v));

// Admin data table modelled on the Wonjo back-office one: a search box with a
// live "shown / total" counter, a sort + filter menu on every column header,
// removable chips for active filters, and a numbered pager (10 rows a page).
export default function DataTable<T>({
  rows,
  columns,
  rowKey,
  title,
  toolbar,
  emptyText,
  searchPlaceholder,
  initialSort,
  pageSize = 10,
  expanded,
  selected,
  onSelectedChange,
  onRowClick,
}: {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  title?: ReactNode;
  toolbar?: ReactNode;
  emptyText?: string;
  searchPlaceholder?: string;
  initialSort?: { key: string; dir: "asc" | "desc" };
  pageSize?: number;
  // Rendering this makes rows clickable and unfolds the returned detail
  // underneath the clicked row.
  expanded?: (row: T) => ReactNode;
  // Checkbox column for bulk actions (delete, restore...). Absent = no column.
  selected?: Set<string>;
  onSelectedChange?: (next: Set<string>) => void;
  // Clickable rows that open something else (a form, a detail).
  onRowClick?: (row: T) => void;
}) {
  const { lang } = useLanguage();
  const d = ADMIN_T[lang].dt;
  const locale = adminLocale(lang);

  const [search, setSearch] = useState("");
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [choices, setChoices] = useState<Record<string, string[]>>({});
  const [ranges, setRanges] = useState<Record<string, Range>>({});
  const [sort, setSort] = useState<Sort>(initialSort ?? null);
  const [menu, setMenu] = useState<{ key: string; anchor: HTMLElement } | null>(null);
  const [page, setPage] = useState(0);
  const [openKey, setOpenKey] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = normalise(search.trim());
    const activeTexts = Object.entries(texts).filter(([, v]) => v.trim() !== "");
    const activeChoices = Object.entries(choices).filter(([, v]) => v.length > 0);
    const activeRanges = Object.entries(ranges).filter(([, r]) => r.from || r.to);
    const col = (key: string) => columns.find((c) => c.key === key);

    let out = rows.filter((row) => {
      if (q && !columns.some((c) => c.value && normalise(c.value(row)).includes(q))) return false;
      if (
        !activeTexts.every(([key, v]) => {
          const c = col(key);
          return !c?.value || normalise(c.value(row)).includes(normalise(v.trim()));
        })
      )
        return false;
      if (
        !activeChoices.every(([key, vals]) => {
          const c = col(key);
          return !c?.value || vals.includes(keyOf(c.value(row)));
        })
      )
        return false;
      return activeRanges.every(([key, r]) => {
        const c = col(key);
        if (!c?.value) return true;
        const v = c.value(row);
        if (v == null || v === "") return false;
        const t = new Date(v).getTime();
        if (Number.isNaN(t)) return false;
        if (r.from && t < new Date(r.from).getTime()) return false;
        if (r.to && t > new Date(r.to).getTime() + 86399999) return false;
        return true;
      });
    });

    if (sort) {
      const get = col(sort.key)?.value;
      if (get) {
        out = [...out].sort((x, y) => {
          const vx = get(x);
          const vy = get(y);
          if (vx == null && vy == null) return 0;
          if (vx == null) return 1;
          if (vy == null) return -1;
          const cmp =
            typeof vx === "number" && typeof vy === "number"
              ? vx - vy
              : String(vx).localeCompare(String(vy), locale, { sensitivity: "base", numeric: true });
          return sort.dir === "asc" ? cmp : -cmp;
        });
      }
    }
    return out;
  }, [rows, columns, search, texts, choices, ranges, sort, locale]);

  // Back to page 1 whenever what is displayed changes.
  useEffect(() => setPage(0), [search, texts, choices, ranges, sort, rows]);

  const pageCount = Math.max(1, Math.ceil(visible.length / pageSize));
  const current = Math.min(page, pageCount - 1);
  const pageRows = visible.slice(current * pageSize, (current + 1) * pageSize);

  const fmt = (iso: string) => new Date(iso).toLocaleDateString(locale);
  const rangeLabel = (r: Range) =>
    r.from && r.to ? d.chipBetween(fmt(r.from), fmt(r.to)) : r.from ? d.chipSince(fmt(r.from)) : d.chipUntil(fmt(r.to));

  const choiceCols = columns.filter((c) => (choices[c.key]?.length ?? 0) > 0);
  const textCols = columns.filter((c) => (texts[c.key] ?? "").trim() !== "");
  const rangeCols = columns.filter((c) => ranges[c.key] && (ranges[c.key].from || ranges[c.key].to));
  const hasChips = choiceCols.length + textCols.length + rangeCols.length > 0;
  const menuCol = menu ? columns.find((c) => c.key === menu.key) : undefined;
  const clickable = Boolean(expanded) || Boolean(onRowClick);
  const selectable = Boolean(selected && onSelectedChange);
  const visibleKeys = visible.map(rowKey);
  const allSelected = selectable && visibleKeys.length > 0 && visibleKeys.every((k) => selected!.has(k));
  const someSelected = selectable && !allSelected && visibleKeys.some((k) => selected!.has(k));
  const toggleRowSelection = (k: string) => {
    const next = new Set(selected);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    onSelectedChange!(next);
  };
  const toggleAll = () => {
    const next = new Set(selected);
    if (allSelected) visibleKeys.forEach((k) => next.delete(k));
    else visibleKeys.forEach((k) => next.add(k));
    onSelectedChange!(next);
  };
  const colCount = columns.length + (selectable ? 1 : 0);

  const displayChoice = (v: string) => (v === EMPTY ? d.emptyValue : v);

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 border-b border-black/8 px-4 py-3">
        {title && <h3 className="font-display text-base font-semibold text-ink">{title}</h3>}
        {toolbar}
        <div className="relative ml-auto min-w-[200px] max-w-xs flex-1">
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted">
            <IconSearch />
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder ?? d.search}
            className="h-10 w-full rounded-lg border border-black/12 bg-white pr-3 pl-9 text-sm shadow-sm"
          />
        </div>
        <span className="text-xs text-muted">{d.count(visible.length, rows.length)}</span>
      </div>

      {hasChips && (
        <div className="flex flex-wrap items-center gap-1.5 border-b border-black/8 px-4 py-2.5">
          {choiceCols.map((c) => (
            <Chip
              key={c.key}
              label={c.label}
              text={choices[c.key].map(displayChoice).join(", ")}
              removeLabel={d.removeFilter(c.label)}
              onRemove={() => setChoices((f) => ({ ...f, [c.key]: [] }))}
            />
          ))}
          {textCols.map((c) => (
            <Chip
              key={c.key}
              label={c.label}
              text={d.chipContains(texts[c.key].trim())}
              removeLabel={d.removeFilter(c.label)}
              onRemove={() => setTexts((f) => ({ ...f, [c.key]: "" }))}
            />
          ))}
          {rangeCols.map((c) => (
            <Chip
              key={c.key}
              label={c.label}
              text={rangeLabel(ranges[c.key])}
              removeLabel={d.removeFilter(c.label)}
              onRemove={() => setRanges((f) => ({ ...f, [c.key]: { from: "", to: "" } }))}
            />
          ))}
          <button
            type="button"
            onClick={() => {
              setChoices({});
              setTexts({});
              setRanges({});
            }}
            className="px-2 py-1 text-xs font-semibold text-teal-dark hover:underline"
          >
            {d.clearAll}
          </button>
        </div>
      )}

      {/* Phone: no room for a wide table, so rows become cards (below) and the
          sort / filter menus of the column headers move into this strip. */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-black/8 px-4 py-2.5 md:hidden">
        {selectable && (
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = someSelected;
            }}
            onChange={toggleAll}
            aria-label="Select all"
            className="mr-1 h-5 w-5 shrink-0 accent-teal"
          />
        )}
        {columns
          .filter((c) => c.value)
          .map((c) => {
            const dir = sort?.key === c.key ? sort.dir : null;
            const filtered =
              (choices[c.key]?.length ?? 0) > 0 ||
              (texts[c.key] ?? "").trim() !== "" ||
              Boolean(ranges[c.key]?.from || ranges[c.key]?.to);
            return (
              <button
                key={c.key}
                type="button"
                onClick={(e) => {
                  const anchor = e.currentTarget;
                  setMenu((m) => (m?.key === c.key ? null : { key: c.key, anchor }));
                }}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  dir || filtered ? "border-teal/40 bg-teal/10 text-teal-dark" : "border-black/10 text-muted"
                }`}
              >
                {c.label}
                {dir && <IconSort dir={dir} />}
                <span className={filtered ? "text-teal-dark" : "opacity-40"}>
                  <IconFilter />
                </span>
              </button>
            );
          })}
      </div>

      <ul className="md:hidden">
        {pageRows.length === 0 ? (
          <li className="px-4 py-8 text-center text-xs text-muted">{emptyText ?? d.empty}</li>
        ) : (
          pageRows.map((row) => {
            const k = rowKey(row);
            const isOpen = openKey === k;
            return (
              <li key={k} className={`border-b border-black/5 ${isOpen ? "bg-black/[0.02]" : ""}`}>
                <div
                  onClick={onRowClick ? () => onRowClick(row) : expanded ? () => setOpenKey(isOpen ? null : k) : undefined}
                  className={`flex items-start gap-3 px-4 py-3.5 text-xs ${clickable ? "cursor-pointer" : ""}`}
                >
                  {selectable && (
                    <input
                      type="checkbox"
                      checked={selected!.has(k)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => toggleRowSelection(k)}
                      aria-label="Select"
                      className="mt-0.5 h-5 w-5 shrink-0 accent-teal"
                    />
                  )}
                  <dl className="grid min-w-0 flex-1 grid-cols-[minmax(0,6.5rem)_minmax(0,1fr)] items-baseline gap-x-3 gap-y-1.5">
                    {columns
                      // A field with nothing to say ("-") only costs height on a phone.
                      .filter((c) => {
                        const v = c.value?.(row);
                        return !c.value || (v !== null && v !== undefined && v !== "" && v !== "-");
                      })
                      .map((c) => (
                        <Fragment key={c.key}>
                          <dt className="text-[11px] font-semibold text-muted">{c.label}</dt>
                          <dd className="min-w-0 text-ink [overflow-wrap:anywhere]">
                            {c.render ? c.render(row) : String(c.value?.(row) ?? "-")}
                          </dd>
                        </Fragment>
                      ))}
                  </dl>
                </div>
                {isOpen && expanded && <div className="px-4 pb-4">{expanded(row)}</div>}
              </li>
            );
          })
        )}
      </ul>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-black/[0.025]">
              {selectable && (
                <th className="w-11 border-b border-black/8 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={toggleAll}
                    aria-label="Select all"
                    className="h-4 w-4 accent-teal"
                  />
                </th>
              )}
              {columns.map((c) => {
                const dir = sort?.key === c.key ? sort.dir : null;
                const filtered =
                  (choices[c.key]?.length ?? 0) > 0 ||
                  (texts[c.key] ?? "").trim() !== "" ||
                  Boolean(ranges[c.key]?.from || ranges[c.key]?.to);
                return (
                  <th
                    key={c.key}
                    aria-sort={dir === "asc" ? "ascending" : dir === "desc" ? "descending" : undefined}
                    className={`border-b border-black/8 px-4 py-3 text-xs font-bold whitespace-nowrap ${
                      c.align === "right" ? "text-right" : ""
                    } ${dir || filtered ? "text-teal-dark" : "text-muted"}`}
                  >
                    {c.value ? (
                      <button
                        type="button"
                        title={d.headerTitle(c.label)}
                        onClick={(e) => {
                          const anchor = e.currentTarget;
                          setMenu((m) => (m?.key === c.key ? null : { key: c.key, anchor }));
                        }}
                        className="inline-flex items-center gap-1.5 font-bold hover:text-ink"
                      >
                        {c.label}
                        {dir && <IconSort dir={dir} />}
                        <span className={filtered ? "text-teal-dark" : "opacity-40"}>
                          <IconFilter />
                        </span>
                      </button>
                    ) : (
                      c.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="px-4 py-8 text-center text-muted">
                  {emptyText ?? d.empty}
                </td>
              </tr>
            ) : (
              pageRows.map((row) => {
                const k = rowKey(row);
                const isOpen = openKey === k;
                return (
                  <Fragment key={k}>
                    <tr
                      onClick={
                        onRowClick ? () => onRowClick(row) : expanded ? () => setOpenKey(isOpen ? null : k) : undefined
                      }
                      className={`border-b border-black/5 transition-colors hover:bg-black/[0.02] ${
                        clickable ? "cursor-pointer" : ""
                      } ${isOpen ? "bg-black/[0.02]" : ""}`}
                    >
                      {selectable && (
                        <td className="px-4 py-3 align-middle" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selected!.has(k)}
                            onChange={() => toggleRowSelection(k)}
                            aria-label="Select"
                            className="h-4 w-4 accent-teal"
                          />
                        </td>
                      )}
                      {columns.map((c) => (
                        <td
                          key={c.key}
                          className={`px-4 py-3 align-middle ${c.align === "right" ? "text-right" : ""} ${
                            c.filter === "date" ? "whitespace-nowrap" : ""
                          }`}
                        >
                          {c.render ? c.render(row) : String(c.value?.(row) ?? "-")}
                        </td>
                      ))}
                    </tr>
                    {isOpen && expanded && (
                      <tr className="border-b border-black/5 bg-black/[0.02]">
                        <td colSpan={colCount} className="px-4 py-4">
                          {expanded(row)}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-black/8 px-4 py-3 text-xs text-muted">
          <span>{d.range(current * pageSize + 1, Math.min((current + 1) * pageSize, visible.length), visible.length)}</span>
          <div className="flex flex-wrap items-center gap-1">
            <PageButton disabled={current === 0} onClick={() => setPage(current - 1)}>
              ‹ {ADMIN_T[lang].previous}
            </PageButton>
            {Array.from({ length: pageCount }, (_, i) => i)
              .filter((i) => pageCount <= 7 || Math.abs(i - current) <= 2 || i === 0 || i === pageCount - 1)
              .map((i, idx, arr) => (
                <Fragment key={i}>
                  {idx > 0 && i - arr[idx - 1] > 1 && <span>…</span>}
                  <PageButton active={i === current} onClick={() => setPage(i)}>
                    {i + 1}
                  </PageButton>
                </Fragment>
              ))}
            <PageButton disabled={current >= pageCount - 1} onClick={() => setPage(current + 1)}>
              {ADMIN_T[lang].next} ›
            </PageButton>
          </div>
        </div>
      )}

      {menu && menuCol?.value && (
        <ColumnMenu
          anchor={menu.anchor}
          label={menuCol.label}
          mode={menuCol.filter ?? "text"}
          numeric={rows.some((r) => typeof menuCol.value!(r) === "number")}
          values={rows.map((r) => keyOf(menuCol.value!(r)))}
          chosen={choices[menu.key] ?? []}
          text={texts[menu.key] ?? ""}
          range={ranges[menu.key] ?? { from: "", to: "" }}
          sort={sort?.key === menu.key ? sort.dir : null}
          onSort={(dir) => setSort(dir ? { key: menu.key, dir } : null)}
          onChoices={(vals) => setChoices((f) => ({ ...f, [menu.key]: vals }))}
          onText={(v) => setTexts((f) => ({ ...f, [menu.key]: v }))}
          onRange={(r) => setRanges((f) => ({ ...f, [menu.key]: r }))}
          onClose={() => setMenu(null)}
        />
      )}
    </div>
  );
}

function Chip({
  label,
  text,
  removeLabel,
  onRemove,
}: {
  label: string;
  text: string;
  removeLabel: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/12 py-1 pr-1.5 pl-3 text-xs text-teal-dark">
      <b className="font-bold">{label} :</b> {text}
      <button
        type="button"
        aria-label={removeLabel}
        onClick={onRemove}
        className="flex h-5 w-5 items-center justify-center rounded-full bg-black/8 text-sm leading-none hover:bg-black/15"
      >
        ×
      </button>
    </span>
  );
}

function PageButton({
  children,
  onClick,
  disabled,
  active,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-current={active ? "page" : undefined}
      className={`rounded-full border px-3 py-1.5 font-medium transition disabled:opacity-40 ${
        active
          ? "border-teal bg-teal/12 text-teal-dark"
          : "border-black/10 bg-white text-ink hover:border-black/20"
      }`}
    >
      {children}
    </button>
  );
}

// Header menu: sort + (checkbox list | text search | date range).
function ColumnMenu({
  anchor,
  label,
  mode,
  numeric,
  values,
  chosen,
  text,
  range,
  sort,
  onSort,
  onChoices,
  onText,
  onRange,
  onClose,
}: {
  anchor: HTMLElement;
  label: string;
  mode: "options" | "date" | "text";
  numeric: boolean;
  values: string[];
  chosen: string[];
  text: string;
  range: Range;
  sort: "asc" | "desc" | null;
  onSort: (dir: "asc" | "desc" | null) => void;
  onChoices: (vals: string[]) => void;
  onText: (v: string) => void;
  onRange: (r: Range) => void;
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const d = ADMIN_T[lang].dt;
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const modalities = useMemo(() => {
    const counts = new Map<string, number>();
    values.forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1));
    return [...counts.entries()].sort((x, y) => x[0].localeCompare(y[0], undefined, { numeric: true }));
  }, [values]);

  useLayoutEffect(() => {
    function place() {
      const r = anchor.getBoundingClientRect();
      setPos({ top: r.bottom + 6, left: Math.min(Math.max(8, r.left - 12), window.innerWidth - 268) });
    }
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [anchor]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      if (!ref.current?.contains(t) && !anchor.contains(t)) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [anchor, onClose]);

  if (!pos) return null;

  const sortBtn = (dir: "asc" | "desc", text: string) => (
    <button
      type="button"
      onClick={() => onSort(sort === dir ? null : dir)}
      className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition ${
        sort === dir ? "border-teal bg-teal/12 text-teal-dark" : "border-black/10 hover:border-teal"
      }`}
    >
      {text}
    </button>
  );

  const footBtn = "rounded-md px-1.5 py-1 text-xs font-bold text-teal-dark hover:bg-black/5 disabled:opacity-50";

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-label={label}
      style={{ top: pos.top, left: pos.left }}
      className="fixed z-50 w-[260px] rounded-xl border border-black/10 bg-white p-2.5 shadow-xl"
    >
      <div className="grid grid-cols-2 gap-1.5 border-b border-black/8 pb-2">
        {sortBtn("asc", mode === "date" ? d.oldest : numeric ? d.sortAsc : d.sortAZ)}
        {sortBtn("desc", mode === "date" ? d.newest : numeric ? d.sortDesc : d.sortZA)}
      </div>

      {/* Numeric columns only need sorting: a text search makes no sense there. */}
      {mode === "text" && !numeric && (
        <>
          <p className="mx-1.5 mt-2.5 mb-1 text-[11px] font-extrabold tracking-wide text-muted uppercase">
            {d.searchColumn}
          </p>
          <input
            type="search"
            autoFocus
            value={text}
            placeholder={d.contains}
            onChange={(e) => onText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onClose()}
            className="w-full rounded-lg border border-black/12 px-3 py-2 text-sm"
          />
        </>
      )}

      {mode === "date" && (
        <>
          <p className="mx-1.5 mt-2.5 mb-1 text-[11px] font-extrabold tracking-wide text-muted uppercase">
            {d.filterPeriod}
          </p>
          <div className="space-y-2 px-1.5 pb-1">
            <label className="block text-xs font-bold text-muted">
              {d.from}
              <input
                type="date"
                value={range.from}
                onChange={(e) => onRange({ ...range, from: e.target.value })}
                className="mt-1 w-full rounded-lg border border-black/12 px-2 py-1.5 text-sm font-normal text-ink"
              />
            </label>
            <label className="block text-xs font-bold text-muted">
              {d.to}
              <input
                type="date"
                value={range.to}
                onChange={(e) => onRange({ ...range, to: e.target.value })}
                className="mt-1 w-full rounded-lg border border-black/12 px-2 py-1.5 text-sm font-normal text-ink"
              />
            </label>
          </div>
          <div className="mt-1.5 border-t border-black/8 pt-2">
            <button type="button" className={footBtn} disabled={!range.from && !range.to} onClick={() => onRange({ from: "", to: "" })}>
              {d.clear}
            </button>
          </div>
        </>
      )}

      {mode === "options" && (
        <>
          <p className="mx-1.5 mt-2.5 mb-1 text-[11px] font-extrabold tracking-wide text-muted uppercase">
            {d.showOnly}
          </p>
          <ul className="max-h-64 overflow-y-auto">
            {modalities.map(([v, n]) => (
              <li key={v}>
                <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1.5 py-2 text-[13px] font-semibold hover:bg-black/[0.04]">
                  <input
                    type="checkbox"
                    checked={chosen.includes(v)}
                    onChange={() => onChoices(chosen.includes(v) ? chosen.filter((x) => x !== v) : [...chosen, v])}
                    className="h-4 w-4 accent-teal"
                  />
                  <span className="flex-1">{v === EMPTY ? d.emptyValue : v}</span>
                  <span className="rounded-full border border-black/10 bg-black/[0.03] px-2 text-[11.5px] text-muted tabular-nums">
                    {n}
                  </span>
                </label>
              </li>
            ))}
          </ul>
          <div className="mt-1.5 flex justify-between border-t border-black/8 pt-2">
            <button type="button" className={footBtn} onClick={() => onChoices(modalities.map(([v]) => v))}>
              {d.checkAll}
            </button>
            <button type="button" className={footBtn} disabled={chosen.length === 0} onClick={() => onChoices([])}>
              {d.clear}
            </button>
          </div>
        </>
      )}
    </div>,
    // Inside the admin root so the menu follows the light/dark theme.
    document.querySelector<HTMLElement>(".admin-root") ?? document.body
  );
}
