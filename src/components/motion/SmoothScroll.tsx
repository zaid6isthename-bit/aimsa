import { useEffect } from "react";
import { prefersReducedMotion, loadGsap } from "@/lib/motion";

/** Lenis smooth scroll driving GSAP ScrollTrigger. Mounted once at the root. */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let dispose = () => {};
    let cancelled = false;

    (async () => {
      const [{ default: Lenis }, { gsap, ScrollTrigger }] = await Promise.all([
        import("lenis"),
        loadGsap(),
      ]);
      if (cancelled) return;

      const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.refresh();

      dispose = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    })();

    return () => {
      cancelled = true;
      dispose();
    };
  }, []);

  return null;
}