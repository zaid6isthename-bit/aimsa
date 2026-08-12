import { ArtBackdrop } from "@/components/site/ArtBackdrop";
import { bgFor } from "@/assets/bg";
import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CalendarPlus, Check, Clock, Link2, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { StatusBadge } from "@/components/site/StatusBadge";
import { EventCard } from "@/components/site/EventCard";
import { site } from "@/content/site";
import type { AimsaEvent } from "@/content/types";
import { joinFaqs } from "@/content/faqs";
import {
  buildIcs,
  eventBySlug,
  eventStatus,
  formatEventDate,
  formatEventTime,
  isRegistrationOpen,
  publishedEvents,
  TBA,
} from "@/lib/content";

export const Route = createFileRoute("/events/$slug")({
  loader: ({ params }) => {
    const event = eventBySlug(params.slug);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Event not found — AIMSA" }, { name: "robots", content: "noindex" }],
      };
    }
    const { event } = loaderData;
    const title = event.seo?.title ?? `${event.title} — AIMSA`;
    const description = event.seo?.description ?? event.summary;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: event.title,
            description: event.summary,
            ...(event.startDate ? { startDate: event.startDate } : {}),
            eventAttendanceMode:
              event.format === "Online"
                ? "https://schema.org/OnlineEventAttendanceMode"
                : "https://schema.org/OfflineEventAttendanceMode",
            organizer: { "@type": "Organization", name: site.fullName },
          }),
        },
      ],
    };
  },
  component: EventDetail,
  notFoundComponent: EventNotFound,
});

function EventNotFound() {
  return (
    <div className="container-aimsa py-28 text-center">
      <h1 className="text-3xl font-bold">We could not find that event</h1>
      <p className="mt-3 text-muted-foreground">
        It may have been renamed or removed from the published calendar.
      </p>
      <Button asChild variant="hero" className="mt-6">
        <Link to="/events">Browse all events</Link>
      </Button>
    </div>
  );
}

function EventDetail() {
  const { event } = Route.useLoaderData() as { event: AimsaEvent };
  const [copied, setCopied] = useState(false);
  const status = eventStatus(event);
  const registrationOpen = isRegistrationOpen(event);
  const time = formatEventTime(event);
  const ics = buildIcs(event);
  const related = publishedEvents()
    .filter((e) => e.slug !== event.slug && e.category === event.category)
    .slice(0, 3);

  function downloadIcs() {
    if (!ics) return;
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.slug}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <PageHeader
        eyebrow={`${event.category} · ${event.format}`}
        title={event.title}
        intro={event.summary}
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Events", to: "/events" }, { label: event.title }]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={status} />
          {registrationOpen && event.registrationUrl ? (
            <Button asChild variant="hero">
              <a href={event.registrationUrl}>Register now</a>
            </Button>
          ) : (
            <span className="text-sm text-muted-foreground">
              {status === "Completed" || status === "Cancelled"
                ? "Registration is closed."
                : "Registration opens once official details are confirmed."}
            </span>
          )}
        </div>
      </PageHeader>

      <div className="relative isolate overflow-hidden">
      <ArtBackdrop image={bgFor(`event:${event.slug}`)} position="center 45%" />
      <div className="container-aimsa grid gap-12 py-14 lg:grid-cols-[1.5fr_0.8fr] lg:py-20">
        <div className="space-y-12">
          <section aria-labelledby="overview-heading">
            <h2 id="overview-heading" className="text-2xl font-bold">
              Overview
            </h2>
            <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
              {event.description.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </section>

          {event.theme ? (
            <section aria-labelledby="theme-heading" className="surface-card p-6">
              <h2 id="theme-heading" className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">
                Theme
              </h2>
              <p className="mt-2 font-display text-xl italic">{event.theme}</p>
            </section>
          ) : null}

          {event.eligibility?.length ? (
            <section aria-labelledby="eligibility-heading">
              <h2 id="eligibility-heading" className="text-2xl font-bold">
                Eligibility
              </h2>
              <ul className="mt-4 space-y-2">
                {event.eligibility.map((item) => (
                  <li key={item} className="flex gap-3 text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {event.agenda?.length ? (
            <section aria-labelledby="agenda-heading">
              <h2 id="agenda-heading" className="text-2xl font-bold">
                Agenda
              </h2>
              <ol className="mt-5 space-y-4 border-l border-border pl-6">
                {event.agenda.map((item) => (
                  <li key={item.title} className="relative">
                    <span
                      className="absolute -left-[1.9rem] top-1.5 size-2.5 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                    <p className="font-semibold">{item.title}</p>
                    {item.time ? <p className="text-sm text-accent">{item.time}</p> : null}
                    {item.detail ? (
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                    ) : null}
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {event.resources?.length ? (
            <section aria-labelledby="resources-heading">
              <h2 id="resources-heading" className="text-2xl font-bold">
                Rules &amp; resources
              </h2>
              <ul className="mt-4 space-y-2">
                {event.resources.map((r) => (
                  <li key={r.url}>
                    <a href={r.url} className="text-primary underline underline-offset-4">
                      {r.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section aria-labelledby="event-faq-heading">
            <h2 id="event-faq-heading" className="text-2xl font-bold">
              Common questions
            </h2>
            <dl className="mt-5 space-y-4">
              {joinFaqs.slice(0, 3).map((faq) => (
                <div key={faq.question} className="surface-card p-5">
                  <dt className="font-semibold">{faq.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="surface-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Event details
            </h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <dt className="text-muted-foreground">Date &amp; time</dt>
                  <dd className="font-medium">
                    {formatEventDate(event)}
                    {time ? ` · ${time}` : ""}
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <dt className="text-muted-foreground">Venue</dt>
                  <dd className="font-medium">{event.venue ?? TBA}</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Users className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <dt className="text-muted-foreground">Format</dt>
                  <dd className="font-medium">{event.format}</dd>
                </div>
              </div>
            </dl>

            <div className="mt-6 grid gap-2">
              {ics ? (
                <Button variant="quiet" onClick={downloadIcs}>
                  <CalendarPlus aria-hidden="true" /> Add to calendar
                </Button>
              ) : null}
              <Button variant="quiet" onClick={copyLink}>
                <Link2 aria-hidden="true" /> {copied ? "Link copied" : "Copy link"}
              </Button>
              <noscript>
                <p className="text-xs text-muted-foreground">
                  Copy this page&rsquo;s address from the browser bar to share it.
                </p>
              </noscript>
            </div>
          </div>

          <div className="surface-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Questions?
            </h2>
            {event.contacts?.length ? (
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {event.contacts.map((c) => (
                  <li key={c.label}>
                    <span className="text-foreground">{c.label}:</span> {c.value}
                  </li>
                ))}
              </ul>
            ) : null}
            <Button asChild variant="hero" className="mt-4 w-full">
              <Link to="/contact">Contact the team</Link>
            </Button>
          </div>
        </aside>
      </div>
      </div>

      {related.length ? (
        <section className="container-aimsa pb-20" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-2xl font-bold">
            Related events
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {related.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
