const FREE_LIMIT = 20;
const STORAGE_KEY = "lampasai_free_questions_used";

export function getAnonymousUsage(): number {
  if (typeof window === "undefined") return 0;
  return Number(window.localStorage.getItem(STORAGE_KEY) ?? "0");
}

export function incrementAnonymousUsage(): number {
  const next = getAnonymousUsage() + 1;
  window.localStorage.setItem(STORAGE_KEY, String(next));
  return next;
}

export const FREE_QUESTION_LIMIT = FREE_LIMIT;
