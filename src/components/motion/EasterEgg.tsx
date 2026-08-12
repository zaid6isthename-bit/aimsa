import { useEffect, useRef } from "react";

/**
 * Hidden reward: five rapid clicks on the site logo (or the Konami code)
 * fires a neon particle burst across the viewport.
 */
export function EasterEgg() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    type Bit = { x: number; y: number; vx: number; vy: number; life: number; c: string };
    let bits: Bit[] = [];
    let raf = 0;
    const colors = ["#ff4fb8", "#7de3ff", "#a97bff", "#fff3a8"];

    const resize = () => {
      el.width = window.innerWidth;
      el.height = window.innerHeight;
    };

    const loop = () => {
      ctx.clearRect(0, 0, el.width, el.height);
      ctx.globalCompositeOperation = "lighter";
      bits = bits.filter((b) => b.life > 0);
      for (const b of bits) {
        b.vy += 0.28;
        b.x += b.vx;
        b.y += b.vy;
        b.life -= 0.012;
        ctx.fillStyle = b.c;
        ctx.globalAlpha = Math.max(0, b.life);
        ctx.fillRect(b.x, b.y, 4, 8);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      if (bits.length) raf = requestAnimationFrame(loop);
    };

    const fire = () => {
      resize();
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight * 0.4;
      for (let i = 0; i < 260; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = Math.random() * 16 + 4;
        bits.push({
          x: cx,
          y: cy,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s - 4,
          life: 1,
          c: colors[i % colors.length] ?? "#fff",
        });
      }
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    };

    let clicks = 0;
    let timer = 0;
    const onClick = (e: MouseEvent) => {
      const logo = (e.target as HTMLElement | null)?.closest("[data-easter-egg]");
      if (!logo) return;
      clicks += 1;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        clicks = 0;
      }, 900);
      if (clicks >= 5) {
        clicks = 0;
        fire();
      }
    };

    const konami = [
      "ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a",
    ];
    let idx = 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === konami[idx]?.toLowerCase()) {
        idx += 1;
        if (idx === konami.length) {
          idx = 0;
          fire();
        }
      } else {
        idx = 0;
      }
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[190]"
    />
  );
}