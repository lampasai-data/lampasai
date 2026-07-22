import { useEffect, useRef } from "react";
import { useLanguage } from "../i18n";

function MeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gridSize = 42;
    const mouse = { x: -9999, y: -9999 };
    let points: { x: number; y: number; ox: number; oy: number; z: number }[] = [];
    let rows = 0;
    let cols = 0;
    let frameId: number;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      canvas!.width = rect.width;
      canvas!.height = rect.height;
      cols = Math.ceil(canvas!.width / gridSize);
      rows = Math.ceil(canvas!.height / gridSize);
      points = [];
      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          points.push({ x: i * gridSize, y: j * gridSize, ox: i * gridSize, oy: j * gridSize, z: 0 });
        }
      }
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const maxDist = 160;

      for (const p of points) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < maxDist) {
          const angle = Math.atan2(dy, dx);
          const force = (maxDist - dist) / maxDist;
          p.x += Math.cos(angle) * force * 4;
          p.y += Math.sin(angle) * force * 4;
          p.z = force * 20;
        }
        p.x += (p.ox - p.x) * 0.08;
        p.y += (p.oy - p.y) * 0.08;
        p.z += (0 - p.z) * 0.08;
      }

      const gradient = ctx!.createLinearGradient(0, 0, canvas!.width, canvas!.height);
      gradient.addColorStop(0, "rgba(74, 136, 150, 0.28)");
      gradient.addColorStop(1, "rgba(125, 78, 46, 0.20)");
      ctx!.strokeStyle = gradient;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const p1 = points[i * (rows + 1) + j];
          const pRight = points[(i + 1) * (rows + 1) + j];
          const pDown = points[i * (rows + 1) + (j + 1)];
          if (!p1) continue;
          ctx!.lineWidth = 1 + p1.z / 12;
          if (pRight) {
            ctx!.beginPath();
            ctx!.moveTo(p1.x, p1.y);
            ctx!.lineTo(pRight.x, pRight.y);
            ctx!.stroke();
          }
          if (pDown) {
            ctx!.beginPath();
            ctx!.moveTo(p1.x, p1.y);
            ctx!.lineTo(pDown.x, pDown.y);
            ctx!.stroke();
          }
        }
      }

      frameId = requestAnimationFrame(animate);
    }

    function handleMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }

    function handleMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    resize();
    animate();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-auto absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

export default function Hero() {
  const { t } = useLanguage();

  return (
    <header id="home" className="glow-grid relative overflow-hidden">
      <MeshBackground />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 py-28 text-center md:py-36">
        <span className="mb-6 animate-[float-slow_9s_ease-in-out_infinite] rounded-full border border-teal/25 bg-teal/[0.07] px-4 py-1.5 text-xs font-medium tracking-wide text-teal-dark">
          {t.hero.eyebrow}
        </span>

        <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink md:text-6xl">
          {t.hero.title[0]}
          <br />
          <span className="brand-gradient-text">{t.hero.title[1]}</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          {t.hero.sub}
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="#contact"
            className="brand-gradient rounded-full px-7 py-3.5 text-sm font-medium text-white shadow-lg shadow-teal/20 transition hover:opacity-90 active:scale-95"
          >
            {t.hero.ctaPrimary}
          </a>
          <a
            href="#about"
            className="rounded-full border border-black/10 px-7 py-3.5 text-sm font-medium text-ink/80 transition hover:border-black/20 hover:text-ink active:scale-95"
          >
            {t.hero.ctaGhost}
          </a>
        </div>
      </div>
    </header>
  );
}
