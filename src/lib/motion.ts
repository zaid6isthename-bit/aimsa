/**
 * Shared motion helpers. GSAP/Lenis are always loaded lazily on the client so
 * nothing browser-only enters the SSR graph.
 */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export async function loadGsap() {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]);
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}