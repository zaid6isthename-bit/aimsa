import { Link } from "@tanstack/react-router";
import { ArrowUpRight, CalendarDays, MapPin, Radio } from "lucide-react";
import type { AimsaEvent } from "@/content/types";
import { eventStatus, formatEventDate, TBA } from "@/lib/content";
import { StatusBadge } from "./StatusBadge";
import { Tilt } from "@/components/motion/Tilt";

export function EventCard({ event, featured = false }: { event: AimsaEvent; featured?: boolean }) {
  const status = eventStatus(event);
  return (
    <Tilt className="h-full">
    <article
      className={`surface-card group relative flex h-full flex-col gap-4 p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-elev-2 ${
        featured ? "ring-1 ring-primary/30" : ""
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={status} />
        <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
          {event.category}
        </span>
        <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
          {event.format}
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold leading-snug">
          <Link
            to="/events/$slug"
            params={{ slug: event.slug }}
            className="after:absolute after:inset-0 after:content-[''] hover:text-primary"
          >
            {event.title}
          </Link>
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{event.summary}</p>
      </div>

      <dl className="mt-auto grid gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-accent" aria-hidden="true" />
          <dt className="sr-only">Date</dt>
          <dd>{formatEventDate(event)}</dd>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-accent" aria-hidden="true" />
          <dt className="sr-only">Venue</dt>
          <dd>{event.venue ?? TBA}</dd>
        </div>
        {event.theme ? (
          <div className="flex items-start gap-2">
            <Radio className="mt-0.5 size-4 text-accent" aria-hidden="true" />
            <dt className="sr-only">Theme</dt>
            <dd className="italic">{event.theme}</dd>
          </div>
        ) : null}
      </dl>

      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
        View event details
        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
      </span>
    </article>
    </Tilt>
  );
}
