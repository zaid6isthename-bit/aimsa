import { useCallback, useRef, useState } from "react";
import { Linkedin } from "lucide-react";
import type { TeamMember } from "@/content/types";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Team member card with a pointer-following hover preview (skiper6-style).
 * States: default / hover / focus-visible / active. Pointer preview is a
 * decorative enhancement only — all information is present in the card itself,
 * so touch and keyboard users lose nothing.
 */
export function MemberCard({ member }: { member: TeamMember }) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [preview, setPreview] = useState<{ x: number; y: number; tilt: number } | null>(null);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setPreview((prev) => ({ x, y, tilt: Math.max(-14, Math.min(14, (x - (prev?.x ?? x)) * 1.6)) }));
    });
  }, []);

  const clear = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setPreview(null);
  }, []);

  const label = member.confirmed ? member.name : "To be announced";

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={clear}
      onPointerCancel={clear}
      className="group surface-card relative isolate p-6 transition-[transform,box-shadow,border-color] duration-150 ease-out hover:-translate-y-1 hover:border-border-strong hover:shadow-elev-2 active:translate-y-0 focus-within:-translate-y-1 motion-reduce:transform-none"
    >
      {/* Neon wash on hover/focus */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
        style={{
          backgroundImage:
            "radial-gradient(240px circle at var(--mx, 50%) var(--my, 0%), color-mix(in oklch, var(--primary) 22%, transparent), transparent 70%)",
          ...(preview ? ({ "--mx": `${preview.x}px`, "--my": `${preview.y}px` } as React.CSSProperties) : {}),
        }}
      />

      {/* Pointer-following preview tile */}
      {preview ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute z-20 hidden md:block"
          style={{ left: preview.x, top: preview.y, transform: `translate(-50%, -120%) rotate(${preview.tilt}deg)` }}
        >
          <span className="flex h-28 w-24 items-center justify-center overflow-hidden rounded-xl border border-border-strong bg-surface-2 neon-ring">
            {member.photo ? (
              <img src={member.photo} alt="" className="size-full object-cover" />
            ) : (
              <span className="px-2 text-center text-[10px] font-semibold uppercase leading-tight tracking-widest text-muted-foreground">
                {member.group}
              </span>
            )}
          </span>
        </span>
      ) : null}

      <div className="flex items-start gap-4">
        {member.photo ? (
          <img
            src={member.photo}
            alt={`${label}, ${member.role}`}
            width={56}
            height={56}
            loading="lazy"
            className="size-14 rounded-xl object-cover"
          />
        ) : (
          <span
            className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-border-strong text-xs text-muted-foreground"
            aria-hidden="true"
          >
            Photo
          </span>
        )}
        <div className="min-w-0">
          <p className="font-semibold break-words">{member.role}</p>
          <p className={member.confirmed ? "text-sm text-muted-foreground" : "text-sm italic text-muted-foreground"}>
            {label}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{member.academicYear}</p>
        </div>
      </div>

      {member.bio ? <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{member.bio}</p> : null}

      {member.linkedin ? (
        <a
          href={member.linkedin}
          className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <Linkedin className="size-4" aria-hidden="true" />
          {`LinkedIn profile of ${label}`}
        </a>
      ) : null}
    </div>
  );
}