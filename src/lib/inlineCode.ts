// Matches inline formula-like fragments inside an otherwise prose sentence:
// a table/column reference ('Sales'[Order ID], City[State Province]),
// optionally followed by a comparison (= "Kentucky", = 2020), or an
// UPPERCASE-leading function call (CountRows(...), TARGET_LAG(...)). Kept
// conservative (bracket refs, or a capitalized identifier glued to "(") so it
// never fires on ordinary parenthetical asides like "(une par produit)".
// Shared between the quiz UI (CertificationQuiz.tsx) and the PDF export
// (pdfExport.ts) so both highlight the exact same fragments.
export const INLINE_CODE_RE =
  /((?:'[^']+'|\b[A-Z][\p{L}0-9_]*)?\[[\p{L}_][\p{L}0-9_ ]*\](?:\s*(?:=|<>|>=|<=)\s*(?:"[^"]*"|-?\d+(?:[.,]\d+)?))?|\b[A-Z][A-Za-z0-9_]*\((?:[^()]|\([^()]*\))*\))/gu;

/** Splits text into alternating {code:false} prose and {code:true} formula segments. */
export function splitInlineCode(text: string): { text: string; code: boolean }[] {
  const parts = text.split(INLINE_CODE_RE);
  return parts
    .map((part, i) => ({ text: part, code: i % 2 === 1 }))
    .filter((seg) => seg.text.length > 0);
}
