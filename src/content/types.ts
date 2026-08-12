/**
 * AIMSA content models.
 * Editing guide: every array in ./ is plain typed data. Add/replace entries
 * without touching layout components. Fields marked `?` are optional and the
 * UI hides the related element when they are absent — never invent values.
 */

export type EventCategory =
  | "Workshop"
  | "Debate"
  | "Hackathon"
  | "Seminar"
  | "Bootcamp"
  | "Competition"
  | "Community";

export type EventFormat = "In-person" | "Online" | "Hybrid";

export type EventStatus =
  | "Registration Open"
  | "Coming Soon"
  | "Ongoing"
  | "Completed"
  | "Cancelled";

export interface AgendaItem {
  time?: string;
  title: string;
  detail?: string;
}

export interface AimsaEvent {
  slug: string;
  title: string;
  summary: string;
  description: string[];
  category: EventCategory;
  format: EventFormat;
  /** Explicit override. Leave undefined to derive from dates. */
  status?: EventStatus;
  /** ISO date-time. Undefined renders as "Date to be announced". */
  startDate?: string;
  endDate?: string;
  venue?: string;
  registrationDeadline?: string;
  registrationUrl?: string;
  featured?: boolean;
  published: boolean;
  theme?: string;
  eligibility?: string[];
  agenda?: AgendaItem[];
  resources?: { label: string; url: string }[];
  contacts?: { label: string; value: string }[];
  recapUrl?: string;
  seo?: { title?: string; description?: string };
}

export type AnnouncementCategory = "Registration" | "Notice" | "Result" | "Update";

export interface Announcement {
  id: string;
  title: string;
  summary: string;
  body?: string[];
  category: AnnouncementCategory;
  publishedAt: string;
  expiresAt?: string;
  pinned?: boolean;
  ctaLabel?: string;
  /** Internal route (starts with "/") or absolute URL. */
  ctaHref?: string;
}

export interface TeamMember {
  id: string;
  /** Use "To be announced" until the official name is confirmed. */
  name: string;
  role: string;
  group: "Faculty" | "Office Bearers" | "Technical" | "Events" | "Design & Media";
  academicYear: string;
  bio?: string;
  photo?: string;
  linkedin?: string;
  confirmed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  year: string;
  category: string;
  context: string;
  outcome: string;
  contributors?: string[];
  evidenceUrl?: string;
  relatedEventSlug?: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  year: string;
  category: string;
  images: GalleryImage[];
}

export interface Metric {
  id: string;
  label: string;
  /** Only verified, populated values are rendered. */
  value?: number;
  suffix?: string;
  note?: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export type ProjectDomain =
  | "Machine Learning"
  | "Computer Vision"
  | "NLP"
  | "Data Science"
  | "Generative AI"
  | "Robotics"
  | "Tooling";

export type ProjectStage = "Concept" | "In development" | "Shipped";

export interface Project {
  id: string;
  title: string;
  summary: string;
  domain: ProjectDomain;
  stage: ProjectStage;
  year: string;
  stack: string[];
  builders?: string[];
  repoUrl?: string;
  demoUrl?: string;
  writeupUrl?: string;
  published: boolean;
}

export type ResourceKind = "Certificate" | "Slides" | "Notebook" | "Dataset" | "Recording" | "Guide";

export interface PortalResource {
  id: string;
  title: string;
  kind: ResourceKind;
  description: string;
  /** Only set once the file is officially cleared for members. */
  url?: string;
  relatedEventSlug?: string;
}
