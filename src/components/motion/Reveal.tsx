import { useEffect, useRef, type ReactNode } from "react";
import { loadGsap, prefersReducedMotion } from "@/lib/motion";

/** Scroll-position-driven reveal (scrubbed, not timer-based). */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.opacity = "1";
      return;
    }
    let ctxRevert = () => {};
    let cancelled = false;
    (async () => {
      const { gsap } = await loadGsap();
      if (cancelled) return;
      const ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 34 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          },
        );
      });
      ctxRevert = () => ctx.revert();
    })();
    return () => {
      cancelled = true;
      ctxRevert();
    };
  }, [delay]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}