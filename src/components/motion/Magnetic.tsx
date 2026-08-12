import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/** Magnetic hover pull for primary CTAs. */
export function Magnetic({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * 0.28}px, ${dy * 0.34}px)`;
    };
    const reset = () => {
      el.style.transform = "translate(0px, 0px)";
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <span ref={ref} className={`inline-block transition-transform duration-300 ease-out ${className}`}>
      {children}
    </span>
  );
}