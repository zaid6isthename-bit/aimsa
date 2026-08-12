import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

type P = { x: number; y: number; ox: number; oy: number; vx: number; vy: number; r: number; hue: number };

/**
 * Cursor-reactive particle field with additive glow. Canvas 2D keeps it
 * 60fps on integrated GPUs; counts scale down on small/low-core devices and
 * the whole layer is skipped for reduced-motion users.
 */
export function ParticleField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || prefersReducedMotion()) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lowPower =
      (navigator.hardwareConcurrency ?? 4) < 4 || window.innerWidth < 768;
    let dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 2);
    let w = 0;
    let h = 0;
    let particles: P[] = [];
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let burst = 0;
    let raf = 0;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, w * dpr);
      canvas.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const density = lowPower ? 9000 : 3600;
      const count = Math.min(lowPower ? 260 : 1100, Math.floor((w * h) / density));
      particles = Array.from({ length: count }, () => {
        const x = Math.random() * w;
        const y = Math.random() * h;
        return {
          x,
          y,
          ox: x,
          oy: y,
          vx: 0,
          vy: 0,
          r: Math.random() * 1.6 + 0.5,
          hue: Math.random(),
        };
      });
    };

    const colorFor = (t: number) =>
      t < 0.5
        ? `rgba(${255 - t * 160},${60 + t * 120},${200},`
        : `rgba(${120 - (t - 0.5) * 100},${180 + (t - 0.5) * 120},${255},`;

    const tick = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;
      burst *= 0.94;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      const time = performance.now() / 1000;
      const radius = 150 + burst * 260;

      for (const p of particles) {
        // ambient drift — nothing is ever static
        const drift = Math.sin(time * 0.5 + p.ox * 0.01) * 0.15;
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < radius) {
          const force = (1 - dist / radius) * (0.9 + burst * 4);
          p.vx += (dx / (dist || 1)) * force;
          p.vy += (dy / (dist || 1)) * force;
        }
        p.vx += (p.ox - p.x) * 0.012 + drift * 0.05;
        p.vy += (p.oy - p.y) * 0.012;
        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x += p.vx;
        p.y += p.vy;

        const glow = Math.min(1, 0.25 + Math.hypot(p.vx, p.vy) * 0.5);
        ctx.fillStyle = `${colorFor(p.hue)}${glow.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + glow, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - rect.left;
      mouse.ty = e.clientY - rect.top;
    };
    const onDown = () => {
      burst = 1;
    };
    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 2);
      build();
    };

    build();
    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}