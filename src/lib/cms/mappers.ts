import type { Tables } from "@/integrations/supabase/types";
import type {
  Achievement,
  AimsaEvent,
  Announcement,
  EventCategory,
  EventFormat,
  EventStatus,
  GalleryAlbum,
  Project,
  ProjectDomain,
  ProjectStage,
  TeamMember,
} from "@/content/types";

const paragraphs = (value: string | null | undefined): string[] =>
  (value ?? "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

const stateToStatus: Record<string, EventStatus> = {
  upcoming: "Coming Soon",
  ongoing: "Ongoing",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function mapEvent(row: Tables<"events">): AimsaEvent {
  const agenda = Array.isArray(row.agenda) ? (row.agenda as unknown as AimsaEvent["agenda"]) : [];
  const resources = Array.isArray(row.resources) ? (row.resources as unknown as AimsaEvent["resources"]) : [];
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    description: paragraphs(row.description),
    category: row.category as EventCategory,
    format: row.format as EventFormat,
    status:
      row.registration_url && row.state === "upcoming"
        ? "Registration Open"
        : stateToStatus[row.state] ?? "Coming Soon",
    startDate: row.start_date ?? undefined,
    endDate: row.end_date ?? undefined,
    venue: row.venue ?? undefined,
    registrationDeadline: row.registration_deadline ?? undefined,
    registrationUrl: row.registration_url ?? undefined,
    featured: row.featured,
    published: true,
    eligibility: row.eligibility ?? [],
    agenda,
    resources,
    posterUrl: row.poster_url ?? undefined,
    bannerUrl: row.banner_url ?? undefined,
    organizers: row.organizers ?? [],
    rules: row.rules ?? [],
  } as AimsaEvent;
}

export function mapAnnouncement(row: Tables<"announcements">): Announcement {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    body: paragraphs(row.body),
    category: (row.category as Announcement["category"]) ?? "Notice",
    publishedAt: (row.publish_at ?? row.created_at).slice(0, 10),
    expiresAt: row.expires_at ?? undefined,
    pinned: row.pinned,
    ctaLabel: row.cta_label ?? undefined,
    ctaHref: row.cta_href ?? undefined,
  } as Announcement;
}

export function mapTeamMember(row: Tables<"team_members">): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.position,
    group: (row.group_name as TeamMember["group"]) ?? "Office Bearers",
    academicYear: row.academic_year ?? "",
    bio: row.bio ?? undefined,
    photo: row.photo_url ?? undefined,
    linkedin: row.linkedin ?? undefined,
    confirmed: true,
  } as TeamMember;
}

export function mapProject(row: Tables<"projects">): Project {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    domain: row.domain as ProjectDomain,
    stage: row.stage as ProjectStage,
    year: row.year ?? "",
    stack: row.stack ?? [],
    builders: row.builders ?? [],
    repoUrl: row.repo_url ?? undefined,
    demoUrl: row.demo_url ?? undefined,
    writeupUrl: row.writeup_url ?? undefined,
    published: true,
  } as Project;
}

export function mapAchievement(row: Tables<"achievements">): Achievement {
  return {
    id: row.id,
    title: row.title,
    year: row.year ?? (row.achieved_on ? row.achieved_on.slice(0, 4) : ""),
    category: row.category,
    context: row.competition ?? "",
    outcome: row.position ? `${row.position} — ${row.description}` : row.description,
    contributors: row.participants ?? [],
    evidenceUrl: row.evidence_url ?? undefined,
  } as Achievement;
}

export function mapAlbum(
  row: Tables<"gallery_albums">,
  images: Tables<"gallery_images">[],
): GalleryAlbum {
  return {
    id: row.id,
    title: row.title,
    year: row.year ?? "",
    category: row.category,
    images: images
      .filter((i) => i.album_id === row.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((i) => ({ src: i.url, alt: i.alt_text, caption: i.caption ?? undefined }) as GalleryAlbum["images"][number]),
  };
}