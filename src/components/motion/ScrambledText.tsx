// Component inspired by Tom Miller from the GSAP community
// https://codepen.io/creativeocean/pen/NPWLwJM
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import "./ScrambledText.css";

gsap.registerPlugin(SplitText, ScrambleTextPlugin);

type ScrambledTextProps = {
  radius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export default function ScrambledText({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = ".:",
  className = "",
  style = {},
  children,
}: ScrambledTextProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const charsRef = useRef<Element[]>([]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = el.querySelector("p");
    if (!target) return;

    const split = SplitText.create(target, { type: "words,chars", charsClass: "char", wordsClass: "sc-word" });
    charsRef.current = split.chars as Element[];
    gsap.set(split.words as Element[], { whiteSpace: "nowrap" });

    charsRef.current.forEach((c) => {
      gsap.set(c, {
        display: "inline-block",
        attr: { "data-content": (c as HTMLElement).innerHTML },
      });
    });

    const handleMove = (e: PointerEvent) => {
      charsRef.current.forEach((c) => {
        const { left, top, width, height } = c.getBoundingClientRect();
        const dx = e.clientX - (left + width / 2);
        const dy = e.clientY - (top + height / 2);
        const dist = Math.hypot(dx, dy);

        if (dist < radius) {
          gsap.to(c, {
            overwrite: true,
            duration: duration * (1 - dist / radius),
            scrambleText: {
              text: (c as HTMLElement).dataset['content'] || "",
              chars: scrambleChars,
              speed,
            },
            ease: "none",
          });
        }
      });
    };

    el.addEventListener("pointermove", handleMove);
    return () => {
      el.removeEventListener("pointermove", handleMove);
      split.revert();
    };
  }, [radius, duration, speed, scrambleChars]);

  return (
    <div ref={rootRef} className={`text-block ${className}`} style={style}>
      <p>{children}</p>
    </div>
  );
}
