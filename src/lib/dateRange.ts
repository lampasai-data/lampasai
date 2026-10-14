// Period filter for the admin statistics (presets + custom calendar range).
// Ranges are whole local days, both ends inclusive.

export type PresetId = "today" | "yesterday" | "3d" | "7d" | "15d" | "30d" | "90d" | "all";

export const PRESET_IDS: PresetId[] = ["today", "yesterday", "3d", "7d", "15d", "30d", "90d", "all"];
export const DEFAULT_PRESET: PresetId = "30d";

export interface DateRange {
  from: Date;
  to: Date;
  preset: PresetId | "custom";
}

const DAY_MS = 24 * 60 * 60 * 1000;
// "All time" starts here; charts clamp it to the first real data point.
const ALL_TIME_START = new Date(2020, 0, 1);

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

export function presetRange(id: PresetId, now = new Date()): DateRange {
  const today = startOfDay(now);
  switch (id) {
    case "today":
      return { from: today, to: endOfDay(today), preset: id };
    case "yesterday":
      return { from: addDays(today, -1), to: endOfDay(addDays(today, -1)), preset: id };
    case "all":
      return { from: ALL_TIME_START, to: endOfDay(today), preset: id };
    default: {
      const days = parseInt(id, 10); // "7d" -> 7, includes today
      return { from: addDays(today, -(days - 1)), to: endOfDay(today), preset: id };
    }
  }
}

export const toParam = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function fromParam(value: string | null): Date | null {
  const m = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

// The range lives in the URL (?range=7d or ?from=2026-10-01&to=2026-10-13).
export function rangeFromParams(params: URLSearchParams): DateRange {
  const from = fromParam(params.get("from"));
  const to = fromParam(params.get("to"));
  if (from && to && from <= to) return { from, to: endOfDay(to), preset: "custom" };
  const preset = params.get("range") as PresetId | null;
  return presetRange(preset && PRESET_IDS.includes(preset) ? preset : DEFAULT_PRESET);
}

export function rangeToParams(range: DateRange): Record<string, string> {
  if (range.preset === "custom") return { from: toParam(range.from), to: toParam(range.to) };
  return range.preset === DEFAULT_PRESET ? {} : { range: range.preset };
}

export function inRange(iso: string, range: DateRange) {
  const t = new Date(iso).getTime();
  return t >= range.from.getTime() && t <= range.to.getTime();
}

export type BucketUnit = "day" | "week" | "month";

export interface TimeBucket {
  start: Date;
  unit: BucketUnit;
  value: number;
  count: number;
}

const mondayOf = (d: Date) => addDays(startOfDay(d), -((d.getDay() + 6) % 7));

// Buckets items over the range: daily for short ranges, weekly for medium
// ones, monthly beyond that. "All time" is clamped to the first data point.
export function timeBuckets<T>(
  items: T[],
  dateOf: (item: T) => string,
  valueOf: (item: T) => number,
  range: DateRange
): TimeBucket[] {
  let from = range.from;
  if (range.preset === "all" && items.length > 0) {
    const first = Math.min(...items.map((i) => new Date(dateOf(i)).getTime()));
    from = startOfDay(new Date(first));
  }
  const to = startOfDay(range.to);
  const days = Math.round((to.getTime() - startOfDay(from).getTime()) / DAY_MS) + 1;
  const unit: BucketUnit = days <= 45 ? "day" : days <= 200 ? "week" : "month";

  const startOf = (d: Date) =>
    unit === "day" ? startOfDay(d) : unit === "week" ? mondayOf(d) : new Date(d.getFullYear(), d.getMonth(), 1);
  const next = (d: Date) =>
    unit === "day" ? addDays(d, 1) : unit === "week" ? addDays(d, 7) : new Date(d.getFullYear(), d.getMonth() + 1, 1);

  const buckets: TimeBucket[] = [];
  for (let s = startOf(from); s <= to; s = next(s)) buckets.push({ start: s, unit, value: 0, count: 0 });

  for (const item of items) {
    const when = new Date(dateOf(item));
    const key = startOf(when).getTime();
    const bucket = buckets.find((b) => b.start.getTime() === key);
    if (bucket && when >= range.from && when <= range.to) {
      bucket.value += valueOf(item);
      bucket.count += 1;
    }
  }
  return buckets;
}

// Human title of a bucket: a day, "Week of …" or a month.
export function bucketTitle(b: TimeBucket, locale: string, weekOf: (date: string) => string) {
  if (b.unit === "day") return b.start.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "long" });
  if (b.unit === "week") return weekOf(b.start.toLocaleDateString(locale));
  return b.start.toLocaleDateString(locale, { month: "long", year: "numeric" });
}
