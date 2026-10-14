import { supabase } from "./supabase";

export type FeedbackKind = "review" | "idea" | "problem" | "help";
export type FeedbackResult = "ok" | "invalid" | "rate_limited" | "error";

// The server validates (length, kind, rating) and limits to 5 a day.
export async function sendFeedback(
  kind: FeedbackKind,
  rating: number | null,
  message: string,
  page: string
): Promise<FeedbackResult> {
  if (!supabase) return "error";
  const { data, error } = await supabase.rpc("submit_feedback", {
    p_kind: kind,
    p_rating: rating,
    p_message: message,
    p_page: page,
  });
  if (error || !data) return "error";
  const status = (data as { status: string }).status;
  return status === "ok" || status === "invalid" || status === "rate_limited" ? status : "error";
}
