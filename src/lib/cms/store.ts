import { emptySiteContent, type SiteContent } from "./content-types";
import { events as seedEvents } from "@/content/events";
import { announcements as seedAnnouncements } from "@/content/announcements";
import { team as seedTeam } from "@/content/team";
import { projects as seedProjects } from "@/content/projects";
import { achievements as seedAchievements } from "@/content/achievements";
import { albums as seedAlbums } from "@/content/gallery";
import { site } from "@/content/site";

let current: SiteContent = emptySiteContent;

/** Called by the root route on every render so DB content is available to all pages. */
export function setSiteContent(next: SiteContent | null | undefined) {
  if (next) current = next;
}

export function siteContent(): SiteContent {
  return current;
}

function merge<T>(dbItems: T[], seed: T[], key: (item: T) => string): T[] {
  const seen = new Set(dbItems.map(key));
  return [...dbItems, ...seed.filter((s) => !seen.has(key(s)))];
}

export const cmsEvents = () => merge(current.events, seedEvents, (e) => e.slug);
export const cmsAnnouncements = () => merge(current.announcements, seedAnnouncements, (a) => a.id);
export const cmsTeam = () => merge(current.team, seedTeam, (m) => m.id);
export const cmsProjects = () => merge(current.projects, seedProjects, (p) => p.id);
export const cmsAchievements = () => merge(current.achievements, seedAchievements, (a) => a.id);
export const cmsAlbums = () => merge(current.albums, seedAlbums, (a) => a.id);

export const cmsHome = () => current.home;
export const cmsAbout = () => current.about;

export function cmsContact() {
  const c = current.contact;
  return {
    email: c?.email || site.contact.email,
    phone: c?.phone ?? "",
    address: c?.address || site.contact.address,
    mapsUrl: c?.mapsUrl ?? "",
    socials: c?.socials?.length ? c.socials : [...site.socials],
  };
}