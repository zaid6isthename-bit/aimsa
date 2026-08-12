import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Branded cursor. Morphs into a labelled disc over elements carrying
 * `data-cursor="View"` (any label works) and over links/buttons.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const trail = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-cursor], a, button, [role='button']",
      );
      if (el) {
        setActive(true);
        setLabel(el.dataset["cursor"] ?? null);
      } else {
        setActive(false);
        setLabel(null);
      }
    };

    const loop = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      const c = trail.current;
      const ctx = c?.getContext("2d");
      if (c && ctx) {
        if (c.width !== window.innerWidth || c.height !== window.innerHeight) {
          c.width = window.innerWidth;
          c.height = window.innerHeight;
        }
        points.push({ x: cx, y: cy });
        if (points.length > 18) points.shift();
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.globalCompositeOperation = "lighter";
        points.forEach((p, i) => {
          const t = i / points.length;
          ctx.beginPath();
          ctx.fillStyle = `rgba(125, 227, 255, ${(t * 0.28).toFixed(3)})`;
          ctx.arc(p.x, p.y, 2 + t * 9, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalCompositeOperation = "source-over";
      }
      raf = requestAnimationFrame(loop);
    };
    const points: { x: number; y: number }[] = [];

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
    <canvas ref={trail} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[199] hidden lg:block" />
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[200] hidden lg:block"
    >
      <div
        className={`flex items-center justify-center rounded-full border border-accent/70 bg-accent/10 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent backdrop-blur-[2px] transition-all duration-200 ${
          label ? "size-16" : active ? "size-9" : "size-4"
        }`}
        style={{ boxShadow: "0 0 24px -4px var(--neon-b)" }}
      >
        {label}
      </div>
    </div>
    </>
  );
}