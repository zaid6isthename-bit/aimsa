import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  action,
  id,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  action?: ReactNode;
  id?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={`flex flex-col gap-5 ${centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}
    >
      <div className={`max-w-2xl ${centered ? "" : "space-y-3"}`}>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
        ) : null}
        <h2 id={id} className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
          {title}
        </h2>
        {intro ? <p className="mt-3 text-base leading-relaxed text-muted-foreground">{intro}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
