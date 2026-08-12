import type { PortalResource } from "./types";

/**
 * Member portal library. Add a resource only when the department/committee has
 * cleared it for distribution; leave `url` unset until the link is official.
 */
export const portalResources: PortalResource[] = [];

export const portalTracks = [
  {
    id: "certifications",
    title: "Certifications",
    detail:
      "Participation and merit certificates are issued after each AIMSA event and will be downloadable here once the verification workflow is live.",
  },
  {
    id: "resources",
    title: "Session resources",
    detail:
      "Slides, notebooks and recordings from workshops, shared with members after the department clears them for distribution.",
  },
  {
    id: "mentorship",
    title: "Mentorship & teams",
    detail:
      "Project team formation, mentor allocation and progress check-ins for members building through AIMSA.",
  },
] as const;