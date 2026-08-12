import { useEffect, useRef, type ElementType } from "react";
import { loadGsap, prefersReducedMotion } from "@/lib/motion";

/** Per-character kinetic reveal for display headings. */
export function KineticHeading({
  text,
  as: Tag = "h1",
  className = "",
  id,
  delay = 0,
  charClassName = "",
}: {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
  delay?: number;
  /** Per-character fill class (e.g. `text-chrome`, `text-gradient`). */
  charClassName?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let revert = () => {};
    let cancelled = false;
    (async () => {
      const { gsap } = await loadGsap();
      if (cancelled) return;
      const ctx = gsap.context(() => {
        gsap.fromTo(
          el.querySelectorAll("[data-char]"),
          { yPercent: 115, opacity: 0, rotateX: -60 },
          {
            yPercent: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.9,
            delay,
            ease: "power4.out",
            stagger: 0.024,
            scrollTrigger: { trigger: el, start: "top 92%" },
          },
        );
      }, el);
      revert = () => ctx.revert();
    })();
    return () => {
      cancelled = true;
      revert();
    };
  }, [delay, text]);

  const words = text.split(" ");

  return (
    <Tag ref={ref} id={id} className={className} style={{ perspective: "700px" }}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-block">
        {words.map((word, wi) => (
          <span key={`${word}-${wi}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            {/* Transformed children escape an ancestor's background-clip:text,
                so any gradient fill is applied per character. */}
            {[...word].map((char, ci) => (
              <span
                key={`${char}-${ci}`}
                data-char
                className={`inline-block will-change-transform ${charClassName}`}
              >
                {char}
              </span>
            ))}
            {wi < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}