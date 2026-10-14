// Remembers, in this browser, which podium places were already announced, so
// the congratulation shows once per (certification, rank, month). Reaching a
// better rank later announces it again. Storage can be unavailable (private
// window): then the message simply may show again next time.
const key = (userId: string, certId: string, rank: number) =>
  `lampasai_podium_seen:${userId}:${certId}:${rank}:${new Date().toISOString().slice(0, 7)}`;

// True the first time this place is claimed (and marks it as announced).
export function claimPodium(userId: string, certId: string, rank: number): boolean {
  const k = key(userId, certId, rank);
  try {
    if (localStorage.getItem(k) === "1") return false;
    localStorage.setItem(k, "1");
  } catch {
    // storage unavailable: announce it
  }
  return true;
}
