import { useEffect, useRef, useState, type ElementType } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01AIMSA";

/** Decodes text from random glyphs when it scrolls into view. */
export function ScrambleText({
  text,
  as: Tag = "span",
  className = "",
  speed = 34,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    setDisplay(text.replace(/\S/g, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "#"));

    let interval = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        let i = 0;
        interval = window.setInterval(() => {
          setDisplay(
            text
              .split("")
              .map((ch, idx) => {
                if (idx < i || ch === " ") return ch;
                return GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? ch;
              })
              .join(""),
          );
          if (i >= text.length) {
            window.clearInterval(interval);
            setDisplay(text);
          }
          i += 1 / 2;
        }, speed);
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearInterval(interval);
    };
  }, [text, speed]);

  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display}</span>
    </Tag>
  );
}