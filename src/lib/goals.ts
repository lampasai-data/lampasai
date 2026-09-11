/**
 * The pass mark this platform holds you to, and the goal shown on the
 * leaderboard - the same number on purpose.
 *
 * Deliberately stricter than the real exams (see OFFICIAL_PASS_BY_SLUG).
 * Someone who trains until they reliably clear 80% walks into the real thing
 * with a margin; someone who stops at the official 70% has none, and a bad
 * day costs them the certification. The gap is the point.
 */
export const GOAL_RATIO = 0.8;

/**
 * What the real certification bodies actually require, shown to the learner
 * so the stricter bar above reads as a deliberate choice rather than an
 * error. Not used to score anything.
 */
export const OFFICIAL_PASS_BY_SLUG: Record<string, number> = {
  "power-bi": 0.7,
  snowflake: 0.75,
};

export function getOfficialPass(slug: string): number | null {
  return OFFICIAL_PASS_BY_SLUG[slug] ?? null;
}
