import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { CalendarDays, MapPin, ArrowUpRight, Bell, X } from "lucide-react";
import { StatusBadge } from "@/components/site/StatusBadge";
import { loadGsap, prefersReducedMotion } from "@/lib/motion";
import { eventStatus, formatEventDate, TBA } from "@/lib/content";
import type { AimsaEvent } from "@/content/types";

const KEY = "aimsa:next-event-closed";

export function FloatingNextEvent({ next }: { next?: AimsaEvent | undefined }) {
  if (!next) return null;

  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(KEY) === "1") setClosed(true);
  }, []);
  const [minimized, setMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const cardRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLButtonElement>(null);
  const initedRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion() || closed) return;
    let revert = () => {};
    let cancelled = false;

    (async () => {
      const { gsap, ScrollTrigger } = await loadGsap();
      if (cancelled) return;
      initedRef.current = true;

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: "[data-hero]",
          start: "bottom 80%",
          end: "bottom 20%",
          onUpdate: (self) => {
            const shouldMinimize = self.progress > 0.5;
            setMinimized((prev) => (prev !== shouldMinimize ? shouldMinimize : prev));
          },
        });
      });
      revert = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      revert();
    };
  }, [closed]);

  useEffect(() => {
    if (closed || !initedRef.current) return;
    (async () => {
      const { gsap } = await loadGsap();
      const card = cardRef.current;
      const badge = badgeRef.current;
      if (!card || !badge) return;

      if (minimized) {
        gsap.to(card, { opacity: 0, scale: 0.92, duration: 0.35, ease: "power2.inOut" });
        gsap.fromTo(
          badge,
          { opacity: 0, scale: 0.5, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "back.out(1.7)" }
        );
      } else {
        gsap.to(card, { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" });
        gsap.to(badge, { opacity: 0, scale: 0.8, duration: 0.25, ease: "power2.in" });
      }
    })();
  }, [minimized, closed]);

  const handleClose = () => {
    setClosed(true);
    if (typeof window !== "undefined") sessionStorage.setItem(KEY, "1");
  };

  const handleExpand = () => {
    setMinimized(false);
    const hero = document.querySelector("[data-hero]");
    if (hero) hero.scrollIntoView({ behavior: "smooth" });
  };

  if (closed) return null;

  return (
    <>
      <article
        ref={cardRef}
        className="surface-card group relative mx-auto -mt-6 max-w-md p-5 transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-[1.015] lg:absolute lg:bottom-2 lg:right-0 lg:mt-0 lg:w-80"
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Dismiss next event"
          className="absolute -right-2 -top-2 grid size-7 place-items-center rounded-full border border-border/60 bg-background/90 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Next at AIMSA</p>
        <h2 className="mt-2 text-lg font-semibold leading-snug transition-colors group-hover:text-primary">
          {next.title}
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusBadge status={eventStatus(next)} />
          <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
            {next.format}
          </span>
        </div>
        <dl className="mt-3 space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-accent" aria-hidden="true" />
            <dd>{formatEventDate(next)}</dd>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-accent" aria-hidden="true" />
            <dd>{next.venue ?? TBA}</dd>
          </div>
        </dl>
        <Link
          to="/events/$slug"
          params={{ slug: next.slug }}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          Event details <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </article>

      {mounted &&
        createPortal(
          <button
            ref={badgeRef}
            type="button"
            onClick={handleExpand}
            aria-label="Next AIMSA event"
            className="fixed bottom-5 right-5 z-[90] flex items-center gap-2 rounded-full border border-border/60 bg-background/90 px-3 py-2.5 text-sm font-medium text-foreground shadow-lg backdrop-blur-md opacity-0"
          >
            <span className="relative flex size-6 items-center justify-center rounded-full bg-primary/10">
              <Bell className="size-3.5 text-primary" aria-hidden="true" />
              <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-accent animate-pulse" />
            </span>
            <span className="hidden sm:inline">Next at AIMSA</span>
          </button>,
          document.body
        )}
    </>
  );
}
