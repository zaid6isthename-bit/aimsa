import React, { useCallback, useEffect, useRef } from "react";
import "./ChromaSpotlight.css";

/**
 * ChromaGrid-style reveal: cards render monochrome until the pointer enters
 * them, at which point the card returns to full colour with a cursor-following
 * illumination. Leaving the card restores the monochrome look.
 */
export function ChromaSpotlight({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const target = useRef<{ el: HTMLElement; x: number; y: number } | null>(null);

  const setup = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const grid = root.firstElementChild;
    if (!grid) return;
    Array.from(grid.children).forEach((child) => {
      const item = child as HTMLElement;
      item.classList.add("chroma-item");
      if (!item.querySelector(":scope > .chroma-item-veil")) {
        const veil = document.createElement("div");
        veil.className = "chroma-item-veil";
        veil.setAttribute("aria-hidden", "true");
        item.appendChild(veil);
      }
    });
  }, []);

  useEffect(() => {
    setup();
    const root = rootRef.current;
    if (!root) return;
    const mo = new MutationObserver(() => setup());
    mo.observe(root, { childList: true, subtree: false });
    return () => {
      mo.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [setup]);

  const paint = useCallback(() => {
    rafRef.current = null;
    const hovered = target.current;
    const root = rootRef.current;
    if (root) {
      root.querySelectorAll<HTMLElement>(".chroma-item").forEach((item) => {
        const active = hovered ? item === hovered.el : false;
        item.classList.toggle("chroma-on", active);
        const avatar = item.querySelector<HTMLElement>(".pc-avatar-content");
        if (avatar) avatar.style.mixBlendMode = active ? "normal" : "luminosity";
      });
    }
    if (!hovered) return;
    const veil = hovered.el.querySelector<HTMLElement>(":scope > .chroma-item-veil");
    if (!veil) return;
    veil.style.setProperty("--hx", `${hovered.x}px`);
    veil.style.setProperty("--hy", `${hovered.y}px`);
  }, []);

  const schedule = useCallback(() => {
    if (rafRef.current == null) rafRef.current = requestAnimationFrame(paint);
  }, [paint]);

  const handleMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== "mouse") return;
      const item = (e.target as HTMLElement).closest<HTMLElement>(".chroma-item");
      if (!item || !rootRef.current?.contains(item)) {
        target.current = null;
      } else {
        const b = item.getBoundingClientRect();
        target.current = { el: item, x: e.clientX - b.left, y: e.clientY - b.top };
      }
      schedule();
    },
    [schedule],
  );

  const handleLeave = useCallback(() => {
    target.current = null;
    schedule();
  }, [schedule]);

  return (
    <div
      ref={rootRef}
      className={`chroma-spotlight ${className}`.trim()}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </div>
  );
}

export default ChromaSpotlight;
