import { useEffect, useRef, type ReactNode } from "react";
import { loadGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Pins a section and scrolls its track horizontally with the page scroll.
 * Falls back to a normal swipeable row when motion is reduced.
 */
export function HorizontalScroller({
  children,
  heading,
}: {
  children: ReactNode;
  heading?: ReactNode;
}) {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sectionEl = section.current;
    const trackEl = track.current;
    if (!sectionEl || !trackEl || prefersReducedMotion()) return;
    if (window.innerWidth < 1024) return;

    let revert = () => {};
    let cancelled = false;
    (async () => {
      const { gsap } = await loadGsap();
      if (cancelled) return;
      const ctx = gsap.context(() => {
        const distance = () => trackEl.scrollWidth - window.innerWidth + 96;
        gsap.to(trackEl, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: sectionEl,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            anticipatePin: 1,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
      }, sectionEl);
      revert = () => ctx.revert();
    })();
    return () => {
      cancelled = true;
      revert();
    };
  }, []);

  return (
    <div
      ref={section}
      className="relative flex flex-col justify-center overflow-hidden lg:min-h-screen lg:py-16"
    >
      {heading ? <div className="container-aimsa">{heading}</div> : null}
      <div
        ref={track}
        className={`flex gap-5 overflow-x-auto px-5 pb-4 lg:overflow-visible lg:px-12 lg:pb-0 ${heading ? "mt-10 lg:mt-12" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}