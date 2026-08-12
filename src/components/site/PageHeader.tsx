import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArtBackdrop } from "@/components/site/ArtBackdrop";
import { bgFor } from "@/assets/bg";

export function PageHeader({
  eyebrow,
  title,
  intro,
  breadcrumb,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  breadcrumb?: { label: string; to?: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border">
      <ArtBackdrop image={bgFor(`header:${title}`)} position="center 55%" />
      <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
        aria-hidden="true"
      />
      <div className="container-aimsa relative py-16 lg:py-24">
        {breadcrumb ? (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {breadcrumb.map((b, i) => (
                <li key={b.label} className="flex items-center gap-2">
                  {b.to ? (
                    <Link to={b.to} className="hover:text-primary">
                      {b.label}
                    </Link>
                  ) : (
                    <span className="text-foreground">{b.label}</span>
                  )}
                  {i < breadcrumb.length - 1 ? <span aria-hidden="true">/</span> : null}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">{title}</h1>
        {intro ? (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{intro}</p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
