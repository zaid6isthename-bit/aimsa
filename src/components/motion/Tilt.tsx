import { useRef, type ElementType, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import "./TiltedCard.css";

const springValues = { damping: 30, stiffness: 120, mass: 1.2 };

/**
 * TiltedCard behaviour applied to arbitrary content cards.
 * Renders a perspective shell + 3D inner layer around its children.
 */
export function Tilt({
  children,
  as = "div",
  className = "",
  rotateAmplitude = 9,
  scaleOnHover = 1.02,
  glare = true,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  rotateAmplitude?: number;
  scaleOnHover?: number;
  glare?: boolean;
}) {
  const Shell = motion[as as "div"] ?? motion.div;
  const ref = useRef<HTMLDivElement | null>(null);

  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const glareOpacity = useSpring(0, springValues);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const glareBg = useMotionTemplate`radial-gradient(240px circle at ${mx}% ${my}%, color-mix(in oklab, var(--neon-b) 20%, transparent), transparent 70%)`;

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  function onMove(e: React.MouseEvent) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);
    mx.set(((e.clientX - rect.left) / rect.width) * 100);
    my.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  function onEnter() {
    if (reduced) return;
    scale.set(scaleOnHover);
    glareOpacity.set(1);
  }

  function onLeave() {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    glareOpacity.set(0);
  }

  return (
    <Shell
      className={`tilt-shell ${className}`}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <motion.div ref={ref} className="tilt-inner" style={{ rotateX, rotateY, scale }}>
        {children}
        {glare ? (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              opacity: glareOpacity,
              background: glareBg,
              transform: "translateZ(24px)",
            }}
          />
        ) : null}
      </motion.div>
    </Shell>
  );
}
