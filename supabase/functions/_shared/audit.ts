import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

// Writes one line in the admin action journal (admin_audit_log). A journal
// problem must never undo or block the action it records, so failures are
// only logged to the function console.
//
// Keep customers' personal data out of `detail`: counts, ids and labels only.
export async function logAdminAction(
  supabase: SupabaseClient,
  actor: string,
  entry: {
    action: string;
    targetType?: string;
    targetId?: string;
    targetLabel?: string;
    detail?: Record<string, unknown>;
  }
) {
  try {
    const { error } = await supabase.from("admin_audit_log").insert({
      actor,
      action: entry.action,
      target_type: entry.targetType ?? null,
      target_id: entry.targetId ?? null,
      target_label: entry.targetLabel ?? null,
      detail: entry.detail ?? {},
    });
    if (error) console.error("Failed to write admin_audit_log row", error);
  } catch (err) {
    console.error("Failed to write admin_audit_log row", err);
  }
}
