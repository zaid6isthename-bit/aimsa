import { createServerFn } from "@tanstack/react-start";
import { emptySiteContent, type SiteContent } from "./content-types";

/** Public, unauthenticated read of everything published through the admin portal. */
export const getSiteContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteContent> => {
    const { createPublicSupabase } = await import("./public-client.server");
    const mappers = await import("./mappers");
    const supabase = createPublicSupabase();

    const [events, announcements, team, projects, achievements, albums, images, settings] =
      await Promise.all([
        supabase.from("events").select("*"),
        supabase.from("announcements").select("*"),
        supabase.from("team_members").select("*").order("sort_order"),
        supabase.from("projects").select("*"),
        supabase.from("achievements").select("*"),
        supabase.from("gallery_albums").select("*").order("sort_order"),
        supabase.from("gallery_images").select("*"),
        supabase.from("site_settings").select("*"),
      ]);

    const setting = (key: string) =>
      (settings.data?.find((s) => s.key === key)?.value as Record<string, unknown> | undefined) ?? null;

    return {
      ...emptySiteContent,
      events: (events.data ?? []).map(mappers.mapEvent),
      announcements: (announcements.data ?? []).map(mappers.mapAnnouncement),
      team: (team.data ?? []).map(mappers.mapTeamMember),
      projects: (projects.data ?? []).map(mappers.mapProject),
      achievements: (achievements.data ?? []).map(mappers.mapAchievement),
      albums: (albums.data ?? []).map((a) => mappers.mapAlbum(a, images.data ?? [])),
      home: setting("home") as SiteContent["home"],
      about: setting("about") as SiteContent["about"],
      contact: setting("contact") as SiteContent["contact"],
      copy: ((settings.data?.find((s) => s.key === "copy")?.value as Record<string, string> | undefined) ?? {}),
    };
  },
);