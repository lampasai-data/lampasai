import jsPDF from "jspdf";
import type { Question } from "../data/types";
import type { Lang } from "../i18n";
import { localize } from "./i18nText";

const MARGIN = 15;
const PAGE_WIDTH = 210;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const LINE_HEIGHT = 6;

export function exportCertificationPdf(certName: string, questions: Question[], lang: Lang) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  function ensureSpace(lines: number) {
    if (y + lines * LINE_HEIGHT > 297 - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  }

  function writeParagraph(text: string, options: { bold?: boolean; size?: number } = {}) {
    doc.setFont("helvetica", options.bold ? "bold" : "normal");
    doc.setFontSize(options.size ?? 11);
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
    ensureSpace(lines.length);
    doc.text(lines, MARGIN, y);
    y += lines.length * LINE_HEIGHT;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(`Lampas .ai - ${certName}`, MARGIN, y);
  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.text(
    lang === "fr"
      ? `${questions.length} questions d'entraînement avec corrigé`
      : `${questions.length} practice questions with answer key`,
    MARGIN,
    y
  );
  doc.setTextColor(0);
  y += 12;

  questions.forEach((q, i) => {
    ensureSpace(2);
    writeParagraph(`${i + 1}. ${localize(q.question, lang)}`, { bold: true });
    y += 1;

    q.options.forEach((option, oi) => {
      const isCorrect = q.correctIndexes.includes(oi);
      const prefix = isCorrect ? "✓" : "•";
      doc.setFont("helvetica", isCorrect ? "bold" : "normal");
      doc.setFontSize(10.5);
      if (isCorrect) doc.setTextColor(29, 158, 117);
      const lines = doc.splitTextToSize(`${prefix} ${localize(option, lang)}`, CONTENT_WIDTH - 4);
      ensureSpace(lines.length);
      doc.text(lines, MARGIN + 4, y);
      doc.setTextColor(0);
      y += lines.length * LINE_HEIGHT;
    });

    if (q.explanation) {
      y += 1;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9.5);
      doc.setTextColor(90);
      const lines = doc.splitTextToSize(
        `${lang === "fr" ? "Explication" : "Explanation"}: ${localize(q.explanation, lang)}`,
        CONTENT_WIDTH - 4
      );
      ensureSpace(lines.length);
      doc.text(lines, MARGIN + 4, y);
      doc.setTextColor(0);
      y += lines.length * LINE_HEIGHT;
    }

    y += 5;
  });

  doc.save(`lampasai-${certName.toLowerCase().replace(/\s+/g, "-")}.pdf`);
}
