import type { AimsaEvent, Announcement, EventStatus } from "@/content/types";
import { cmsAnnouncements, cmsEvents } from "@/lib/cms/store";

export const TBA = "To be announced";

export function formatEventDate(event: AimsaEvent): string {
  if (!event.startDate) return "Date to be announced";
  const start = new Date(event.startDate);
  if (Number.isNaN(start.getTime())) return "Date to be announced";
  const dateFmt = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  if (event.endDate) {
    const end = new Date(event.endDate);
    if (!Number.isNaN(end.getTime()) && end.toDateString() !== start.toDateString()) {
      return `${dateFmt.format(start)} – ${dateFmt.format(end)}`;
    }
  }
  return dateFmt.format(start);
}

export function formatEventTime(event: AimsaEvent): string | null {
  if (!event.startDate || !event.startDate.includes("T")) return null;
  const start = new Date(event.startDate);
  if (Number.isNaN(start.getTime())) return null;
  return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(start);
}

/** Derives state from dates unless an explicit status override is set. */
export function eventStatus(event: AimsaEvent, now = new Date()): EventStatus {
  if (event.status === "Cancelled") return "Cancelled";
  if (!event.startDate) return event.status ?? "Coming Soon";
  const start = new Date(event.startDate);
  if (Number.isNaN(start.getTime())) return event.status ?? "Coming Soon";
  const end = event.endDate ? new Date(event.endDate) : start;
  if (now > end) return "Completed";
  if (now >= start && now <= end) return "Ongoing";
  if (event.status) return event.status;
  return "Coming Soon";
}

export function isRegistrationOpen(event: AimsaEvent, now = new Date()): boolean {
  if (!event.registrationUrl) return false;
  const status = eventStatus(event, now);
  if (status === "Cancelled" || status === "Completed") return false;
  if (event.registrationDeadline) {
    const deadline = new Date(event.registrationDeadline);
    if (!Number.isNaN(deadline.getTime()) && now > deadline) return false;
  }
  return true;
}

export type TimeBucket = "upcoming" | "ongoing" | "past";

export function eventBucket(event: AimsaEvent, now = new Date()): TimeBucket {
  const status = eventStatus(event, now);
  if (status === "Ongoing") return "ongoing";
  if (status === "Completed" || status === "Cancelled") return "past";
  return "upcoming";
}

export const publishedEvents = () => cmsEvents().filter((e) => e.published);

export function sortedUpcoming(now = new Date()): AimsaEvent[] {
  return publishedEvents()
    .filter((e) => eventBucket(e, now) !== "past")
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      if (a.startDate && b.startDate) return a.startDate.localeCompare(b.startDate);
      if (a.startDate) return -1;
      if (b.startDate) return 1;
      return 0;
    });
}

export function nextEvent(now = new Date()): AimsaEvent | undefined {
  return sortedUpcoming(now)[0];
}

export function eventBySlug(slug: string): AimsaEvent | undefined {
  return publishedEvents().find((e) => e.slug === slug);
}

export function eventYears(): string[] {
  const years = new Set<string>();
  for (const e of publishedEvents()) {
    if (e.startDate) years.add(new Date(e.startDate).getFullYear().toString());
  }
  return [...years].sort((a, b) => b.localeCompare(a));
}

const NEW_WINDOW_DAYS = 21;

export function activeAnnouncements(now = new Date()): Announcement[] {
  return cmsAnnouncements()
    .filter((a) => !a.expiresAt || new Date(a.expiresAt) >= now)
    .sort((a, b) => {
      if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
      return b.publishedAt.localeCompare(a.publishedAt);
    });
}

export function isNewAnnouncement(a: Announcement, now = new Date()): boolean {
  const published = new Date(a.publishedAt);
  if (Number.isNaN(published.getTime())) return false;
  const days = (now.getTime() - published.getTime()) / 86_400_000;
  return days >= 0 && days <= NEW_WINDOW_DAYS;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return TBA;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(d);
}

function icsStamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Returns an .ics payload, or null when the event has no confirmed date. */
export function buildIcs(event: AimsaEvent): string | null {
  if (!event.startDate) return null;
  const start = new Date(event.startDate);
  if (Number.isNaN(start.getTime())) return null;
  const end = event.endDate ? new Date(event.endDate) : new Date(start.getTime() + 2 * 3600_000);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AIMSA//Events//EN",
    "BEGIN:VEVENT",
    `UID:${event.slug}@aimsa-ltce`,
    `DTSTAMP:${icsStamp(new Date().toISOString())}`,
    `DTSTART:${icsStamp(start.toISOString())}`,
    `DTEND:${icsStamp(end.toISOString())}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.summary.replace(/,/g, "\\,")}`,
    `LOCATION:${event.venue ?? TBA}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
