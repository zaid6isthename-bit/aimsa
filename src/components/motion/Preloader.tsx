import { useEffect, useRef, useState } from "react";
import { loadGsap, prefersReducedMotion } from "@/lib/motion";
import ASCIIText from "./ASCIIText";
import bg from "@/assets/hero-synthwave-v2.png.asset.json";

const KEY = "aimsa:preloaded";

/**
 * Boot sequence: synthwave plate fades in → ASCII "AIMSA" resolves in 3D →
 * the whole panel slides up to reveal the hero. Once per session, never for
 * reduced-motion users.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (sessionStorage.getItem(KEY)) return;
    sessionStorage.setItem(KEY, "1");
    setRun(true);
  }, []);

  useEffect(() => {
    if (!run) return;
    const el = root.current;
    if (!el) return;

    document.body.style.overflow = "hidden";
    let alive = true;
    let revert = () => {};

    (async () => {
      const { gsap } = await loadGsap();
      if (!alive) return;
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            document.body.style.overflow = "";
            el.style.display = "none";
            window.dispatchEvent(new CustomEvent("aimsa:preloader-done"));
          },
        });

        // Stage 1 — the plate fades in
        tl.fromTo(
          "[data-preloader-bg]",
          { opacity: 0, scale: 1.14 },
          { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" },
        );

        // Stage 2 — ASCII wordmark resolves
        tl.fromTo(
          "[data-ascii]",
          { opacity: 0, scale: 0.94 },
          { opacity: 1, scale: 1, duration: 1.1, ease: "power3.out" },
          "-=0.5",
        ).to("[data-meta]", { opacity: 1, duration: 0.5 }, "-=0.6");

        // Stage 3 — hold, then slide up to reveal the hero
        tl.to("[data-preloader-content]", {
          opacity: 0,
          y: -50,
          duration: 0.5,
          ease: "power2.in",
        }, "+=1.1")
          .to(el, { yPercent: -100, duration: 1.05, ease: "expo.inOut" }, "<0.1")
          .to(
            "[data-preloader-bg]",
            { yPercent: 30, scale: 1.1, duration: 1.05, ease: "expo.inOut" },
            "<",
          );
      }, el);
      revert = () => ctx.revert();
    })();

    return () => {
      alive = false;
      revert();
      document.body.style.overflow = "";
    };
  }, [run]);

  if (!run) return null;

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden bg-[#05060c]"
    >
      <div data-preloader-bg className="pointer-events-none absolute inset-0 opacity-0">
        <img src={bg.url} alt="" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-[#05060c]/55" />
      </div>
      <div className="scanlines pointer-events-none absolute inset-0 opacity-40" />

      <div data-preloader-content className="relative flex w-full flex-col items-center">
        <div data-ascii className="h-[38vh] w-[min(92vw,60rem)] opacity-0">
          <ASCIIText text="AIMSA" asciiFontSize={7} textFontSize={220} planeBaseHeight={7} />
        </div>

        <div
          data-meta
          className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.32em] text-muted-foreground opacity-0"
        >
          Think Beyond. Build Ahead.
        </div>
      </div>
    </div>
  );
}
