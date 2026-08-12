import type {
  Achievement,
  AimsaEvent,
  Announcement,
  GalleryAlbum,
  Project,
  TeamMember,
} from "@/content/types";

export interface HomeSettings {
  heroHeading: string;
  heroDescription: string;
  tagline: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  sections: Record<string, boolean>;
}

export interface AboutSettings {
  description: string;
  mission: string;
  vision: string;
  objectives: string[];
  history: string;
  values: string[];
  faculty: string;
}

export interface ContactSettings {
  email: string;
  phone: string;
  address: string;
  mapsUrl: string;
  socials: { label: string; href: string }[];
}

export interface SiteContent {
  events: AimsaEvent[];
  announcements: Announcement[];
  team: TeamMember[];
  projects: Project[];
  achievements: Achievement[];
  albums: GalleryAlbum[];
  home: HomeSettings | null;
  about: AboutSettings | null;
  contact: ContactSettings | null;
}

export const emptySiteContent: SiteContent = {
  events: [],
  announcements: [],
  team: [],
  projects: [],
  achievements: [],
  albums: [],
  home: null,
  about: null,
  contact: null,
};