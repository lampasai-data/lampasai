import { supabase } from "./supabase";

export type ContactResult = "ok" | "rate_limited" | "error";

// Sends a site form through the contact-message Edge Function, which e-mails
// it to Lampas .ai: the contact address is never written in the page.
export async function sendContactMessage(payload: Record<string, unknown>): Promise<ContactResult> {
  if (!supabase) return "error";
  const { error } = await supabase.functions.invoke("contact-message", { body: payload });
  if (!error) return "ok";
  const status = (error as { context?: Response }).context?.status;
  return status === 429 ? "rate_limited" : "error";
}
