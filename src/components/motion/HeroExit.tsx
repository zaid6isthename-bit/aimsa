import { useEffect, type ReactNode } from "react";
import { loadGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * As the hero scrolls out of view, its contents gently enlarge while the
 * viewport continues scrolling normally. No pin, no hard fade — just a subtle
 * zoom-off into the next section.
 */
export function HeroExit({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let revert = () => {};
    let cancelled = false;
    (async () => {
      const { gsap } = await loadGsap();
      if (cancelled) return;
      const ctx = gsap.context(() => {
        gsap.fromTo(
          "[data-hero-inner]",
          { scale: 1, opacity: 1 },
          {
            scale: 1.06,
            opacity: 0.85,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-hero]",
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
      revert = () => ctx.revert();
    })();
    return () => {
      cancelled = true;
      revert();
    };
  }, []);

  return <>{children}</>;
}