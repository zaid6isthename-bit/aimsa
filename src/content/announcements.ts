import type { Announcement } from "./types";

/**
 * SEED CONTENT — replace with official AIMSA notices.
 * `publishedAt` drives ordering and the "New" badge (see lib/content.ts).
 */
export const announcements: Announcement[] = [
  {
    id: "membership-open",
    title: "Membership interest is open for the current academic year",
    summary:
      "Students from all branches can register their interest in AIMSA. Team allocation happens after the orientation session.",
    body: [
      "AIMSA membership is open to every LTCE student interested in artificial intelligence and machine learning, regardless of branch or year.",
      "Submit the interest form and you will be contacted about orientation and functional-team allocation. There is no entrance test.",
    ],
    category: "Registration",
    publishedAt: "2026-07-28",
    pinned: true,
    ctaLabel: "Register your interest",
    ctaHref: "/join",
  },
  {
    id: "tech-debate-2026-notice",
    title: "AIMSA Tech Debate 2026 — details to be published",
    summary:
      "The flagship debate returns. Motion, date, venue and registration window will be published on the event page as they are confirmed.",
    category: "Notice",
    publishedAt: "2026-07-20",
    ctaLabel: "View event page",
    ctaHref: "/events/aimsa-tech-debate-2026",
  },
  {
    id: "call-for-speakers",
    title: "Call for speakers: Applied AI Seminar Series",
    summary:
      "Students, alumni and faculty working on applied AI or ML can propose a session for the seminar series.",
    category: "Update",
    publishedAt: "2026-07-10",
    ctaLabel: "Propose a session",
    ctaHref: "/contact",
  },
];
