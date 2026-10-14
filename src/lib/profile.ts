import { supabase } from "./supabase";

export type NameResult =
  | { status: "ok" | "unchanged" | "invalid" }
  | { status: "rate_limited"; nextChangeAt: string }
  | { status: "error" };

// The server enforces everything (length, content, once a week): this only
// carries the answer back.
export async function updateMyFirstName(name: string): Promise<NameResult> {
  if (!supabase) return { status: "error" };
  const { data, error } = await supabase.rpc("update_my_first_name", { p_first_name: name });
  if (error || !data) return { status: "error" };
  const r = data as { status: "ok" | "unchanged" | "invalid" | "rate_limited"; next_change_at?: string };
  return r.status === "rate_limited" ? { status: "rate_limited", nextChangeAt: r.next_change_at ?? "" } : { status: r.status };
}

// When the name was last changed by the person (null = never), to show the
// "next change" date. A failed read just means no lock is displayed; the
// server still refuses an early change.
export async function getNameChangedAt(userId: string): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.from("profiles").select("first_name_changed_at").eq("id", userId).maybeSingle();
  return (data as { first_name_changed_at: string | null } | null)?.first_name_changed_at ?? null;
}

// Deletes the signed-in person's own account (server checks the typed word).
// True once it is gone.
export async function deleteMyAccount(confirmWord: string): Promise<boolean> {
  if (!supabase) return false;
  const { data, error } = await supabase.functions.invoke("delete-my-account", { body: { confirm: confirmWord } });
  return !error && (data as { ok?: boolean } | null)?.ok === true;
}

export const AVATAR_BUCKET = "avatars";
export const avatarPath = (userId: string) => `${userId}/avatar.jpg`;

// Uploads the already-cropped JPEG, then points the profile at it. The
// version in the address defeats the browser/CDN cache after a change.
export async function saveMyAvatar(userId: string, blob: Blob): Promise<boolean> {
  if (!supabase) return false;
  const path = avatarPath(userId);
  const { error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, blob, { upsert: true, contentType: "image/jpeg", cacheControl: "3600" });
  if (error) return false;
  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  const { error: rpcError } = await supabase.rpc("update_my_avatar", { p_url: `${data.publicUrl}?v=${Date.now()}` });
  return !rpcError;
}

export async function removeMyAvatar(userId: string): Promise<boolean> {
  if (!supabase) return false;
  const { error: rpcError } = await supabase.rpc("update_my_avatar", { p_url: null });
  if (rpcError) return false;
  // The file itself can stay if this fails: nothing points at it any more.
  await supabase.storage.from(AVATAR_BUCKET).remove([avatarPath(userId)]);
  return true;
}
