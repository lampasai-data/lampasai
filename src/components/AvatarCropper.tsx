import { useEffect, useRef, useState } from "react";
import { USER_T } from "../userAreaI18n";
import { useLanguage } from "../i18n";

const VIEW = 260; // size of the round frame on screen
const OUT = 256; // size of the saved picture

// Round crop: the person drags the picture and zooms; what sits inside the
// circle is exported as a square JPEG (shown round everywhere it is used).
export default function AvatarCropper({
  file,
  onCancel,
  onConfirm,
  busy,
}: {
  file: File;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
  busy: boolean;
}) {
  const { lang } = useLanguage();
  const t = USER_T[lang].profile;
  const [src, setSrc] = useState<string | null>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // The picture always covers the frame: at zoom 1 its short side fits it.
  const base = size ? VIEW / Math.min(size.w, size.h) : 1;
  const scale = base * zoom;
  const clamp = (o: { x: number; y: number }, z = zoom) => {
    if (!size) return o;
    const maxX = Math.max(0, (size.w * base * z - VIEW) / 2);
    const maxY = Math.max(0, (size.h * base * z - VIEW) / 2);
    return { x: Math.min(maxX, Math.max(-maxX, o.x)), y: Math.min(maxY, Math.max(-maxY, o.y)) };
  };

  function onPointerDown(e: React.PointerEvent) {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    setOffset(clamp({ x: drag.current.ox + e.clientX - drag.current.x, y: drag.current.oy + e.clientY - drag.current.y }));
  }
  function changeZoom(z: number) {
    setZoom(z);
    setOffset((o) => clamp(o, z));
  }

  function confirm() {
    const img = imgRef.current;
    if (!img || !size) return;
    const canvas = document.createElement("canvas");
    canvas.width = OUT;
    canvas.height = OUT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const f = OUT / VIEW;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, OUT, OUT);
    ctx.drawImage(
      img,
      (VIEW / 2 - (size.w * scale) / 2 + offset.x) * f,
      (VIEW / 2 - (size.h * scale) / 2 + offset.y) * f,
      size.w * scale * f,
      size.h * scale * f
    );
    canvas.toBlob((blob) => blob && onConfirm(blob), "image/jpeg", 0.88);
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 px-4" onClick={busy ? undefined : onCancel}>
      <div
        role="dialog"
        aria-label={t.cropTitle}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
      >
        <h2 className="font-display text-lg font-semibold text-ink">{t.cropTitle}</h2>
        <p className="mt-1 text-sm text-muted">{t.cropHelp}</p>

        <div
          className="relative mx-auto mt-5 touch-none overflow-hidden rounded-full bg-black/5 ring-1 ring-black/10"
          style={{ width: VIEW, height: VIEW, cursor: "grab" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={() => (drag.current = null)}
          onPointerCancel={() => (drag.current = null)}
        >
          {src && (
            <img
              ref={imgRef}
              src={src}
              alt=""
              draggable={false}
              onLoad={(e) => setSize({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
              className="pointer-events-none absolute top-1/2 left-1/2 max-w-none select-none"
              style={
                size
                  ? {
                      width: size.w * scale,
                      height: size.h * scale,
                      transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
                    }
                  : { visibility: "hidden" }
              }
            />
          )}
        </div>

        <label className="mt-5 block text-xs font-semibold text-muted">
          {t.zoom}
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => changeZoom(Number(e.target.value))}
            className="mt-1 block w-full accent-teal"
          />
        </label>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-full border border-black/12 px-4 py-2 text-sm font-medium text-ink hover:bg-black/[0.04] disabled:opacity-50"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={busy || !size}
            className="brand-gradient rounded-full px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {busy ? t.saving : t.save}
          </button>
        </div>
      </div>
    </div>
  );
}
