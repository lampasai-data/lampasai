import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../i18n";
import logo from "../assets/lampas-logo.png";
import { USER_T } from "../userAreaI18n";

const W = 1200;
const H = 630;
const SITE = "https://lampasai.com";

const TEAL = "#4a8896";
const BROWN = "#7d4e2e";
const GREEN = "#1d9e75";
const INK = "#14142b";
const MUTED = "#5b5b70";

function loadImage(src: string, cors = false): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    if (cors) img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function pill(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, bg: string, fg: string) {
  ctx.font = '600 30px "Inter", system-ui, sans-serif';
  const w = ctx.measureText(text).width + 56;
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(x, y, w, 56, 28);
  ctx.fill();
  ctx.fillStyle = fg;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + 28, y + 29);
}

// Draws the 1200x630 result card. Nothing here comes from anywhere but the
// run that was just finished (score, certification) and the person's own
// profile (first name, picture).
async function drawCard(
  canvas: HTMLCanvasElement,
  o: {
    lang: "fr" | "en";
    certName: string;
    score: number;
    total: number;
    ratio: number;
    goal: number;
    reached: boolean;
    firstName: string | null;
    avatarUrl: string | null;
  }
) {
  const t = USER_T[o.lang].share;
  try {
    await Promise.all([
      document.fonts.load('700 200px "Space Grotesk"'),
      document.fonts.load('600 30px "Inter"'),
    ]);
  } catch {
    // fonts fall back to the system ones
  }
  const [logoImg, avatarImg] = await Promise.all([
    loadImage(logo),
    o.avatarUrl ? loadImage(o.avatarUrl, true) : Promise.resolve(null),
  ]);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = W;
  canvas.height = H;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);
  const bar = ctx.createLinearGradient(0, 0, W, 0);
  bar.addColorStop(0, TEAL);
  bar.addColorStop(1, BROWN);
  ctx.fillStyle = bar;
  ctx.fillRect(0, 0, W, 14);

  // Brand
  if (logoImg) ctx.drawImage(logoImg, 56, 48, 72, 72);
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = INK;
  ctx.font = '700 40px "Space Grotesk", system-ui, sans-serif';
  ctx.fillText("Lampas", 142, 96);
  const lw = ctx.measureText("Lampas ").width;
  ctx.fillStyle = TEAL;
  ctx.fillText(".ai", 142 + lw, 96);

  // Title + score
  ctx.fillStyle = MUTED;
  ctx.font = '600 34px "Inter", system-ui, sans-serif';
  ctx.fillText(t.cardExam(o.certName), 56, 218);

  ctx.fillStyle = o.reached ? GREEN : TEAL;
  ctx.font = '700 210px "Space Grotesk", system-ui, sans-serif';
  ctx.fillText(`${Math.round(o.ratio * 100)} %`, 50, 408);

  ctx.fillStyle = INK;
  ctx.font = '500 34px "Inter", system-ui, sans-serif';
  ctx.fillText(t.cardCorrect(o.score, o.total), 56, 466);

  if (o.reached) pill(ctx, t.cardReached(o.goal), 56, 500, "#e3f5ee", "#136b50");
  else pill(ctx, t.cardGoal(o.goal), 56, 500, "#eeeeef", MUTED);

  // Person (right)
  const cx = 960;
  const cy = 290;
  const r = 110;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  if (avatarImg) {
    ctx.drawImage(avatarImg, cx - r, cy - r, r * 2, r * 2);
  } else {
    ctx.fillStyle = "#e4eef0";
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    ctx.fillStyle = "#3a6b77";
    ctx.font = '700 96px "Space Grotesk", system-ui, sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText((o.firstName?.trim()[0] ?? "L").toUpperCase(), cx, cy + 6);
  }
  ctx.restore();
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  if (o.firstName) {
    ctx.fillStyle = INK;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.font = '700 44px "Space Grotesk", system-ui, sans-serif';
    ctx.fillText(o.firstName, cx, cy + r + 66, 380);
  }

  // Footer
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#e6e6ec";
  ctx.fillRect(56, 570, W - 112, 2);
  ctx.fillStyle = MUTED;
  ctx.font = '500 24px "Inter", system-ui, sans-serif';
  ctx.fillText(t.cardFooter, 56, 608);
  ctx.textAlign = "right";
  ctx.fillText(SITE.replace("https://", ""), W - 56, 608);
}

export default function ShareResultModal({
  certName,
  score,
  total,
  goal,
  firstName,
  avatarUrl,
  onClose,
}: {
  certName: string;
  score: number;
  total: number;
  goal: number;
  firstName: string | null;
  avatarUrl: string | null;
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const t = USER_T[lang].share;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  const ratio = total > 0 ? score / total : 0;
  const reached = ratio >= goal / 100;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    drawCard(canvas, { lang, certName, score, total, ratio, goal, reached, firstName, avatarUrl }).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [lang, certName, score, total, ratio, goal, reached, firstName, avatarUrl]);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.canShare === "function");
  }, []);

  // A picture that cannot be read back (blocked cross-origin picture) makes
  // toBlob throw: the card is then redrawn without it.
  async function toBlob(): Promise<Blob | null> {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const attempt = () => new Promise<Blob | null>((res) => {
      try {
        canvas.toBlob((b) => res(b), "image/png");
      } catch {
        res(null);
      }
    });
    const blob = await attempt();
    if (blob) return blob;
    await drawCard(canvas, { lang, certName, score, total, ratio, goal, reached, firstName, avatarUrl: null });
    return attempt();
  }

  async function download() {
    const blob = await toBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lampas-ai-resultat.png";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  async function nativeShare() {
    const blob = await toBlob();
    if (!blob) return;
    const file = new File([blob], "lampas-ai-resultat.png", { type: "image/png" });
    const data = { files: [file], text: t.shareText(certName, Math.round(ratio * 100)), url: SITE };
    try {
      if (navigator.canShare?.(data)) await navigator.share(data);
      else await download();
    } catch {
      // the person closed the share sheet: nothing to do
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 px-4" onClick={onClose}>
      <div
        role="dialog"
        aria-label={t.title}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl bg-white p-6 text-left shadow-2xl"
      >
        <h2 className="font-display text-lg font-semibold text-ink">{t.title}</h2>
        <p className="mt-1 text-sm text-muted">{t.help}</p>

        <canvas
          ref={canvasRef}
          className={`mt-4 w-full rounded-xl border border-black/10 transition-opacity ${ready ? "opacity-100" : "opacity-0"}`}
          style={{ aspectRatio: `${W} / ${H}` }}
        />

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={download}
            disabled={!ready}
            className="brand-gradient rounded-full px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {t.download}
          </button>
          {canNativeShare && (
            <button
              type="button"
              onClick={nativeShare}
              disabled={!ready}
              className="rounded-full border border-teal/40 px-5 py-2.5 text-sm font-medium text-teal-dark hover:bg-teal/5 disabled:opacity-50"
            >
              {t.shareNative}
            </button>
          )}
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-black/12 px-5 py-2.5 text-sm font-medium text-ink hover:bg-black/[0.04]"
          >
            {t.linkedin}
          </a>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-full px-4 py-2.5 text-sm font-medium text-muted hover:text-ink"
          >
            {t.close}
          </button>
        </div>
        <p className="mt-3 text-xs text-muted">{t.linkedinHint}</p>
      </div>
    </div>
  );
}
