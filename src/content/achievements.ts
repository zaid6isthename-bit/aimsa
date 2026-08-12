import type { Achievement, Metric } from "./types";

/**
 * VERIFIED RECORDS ONLY. Nothing is seeded here on purpose — add an entry only
 * when the outcome can be evidenced (certificate, result page, repository,
 * official communication). The achievements page shows an honest empty state
 * until the first verified record is added.
 */
export const achievements: Achievement[] = [];

/**
 * Metrics render only when `value` is a number. Leave undefined until the
 * figure is confirmed — the UI hides unverified metrics rather than showing 0.
 */
export const metrics: Metric[] = [
  { id: "events", label: "Events delivered", note: "Confirm from the association register" },
  { id: "members", label: "Active members", note: "Confirm after membership drive" },
  { id: "projects", label: "Student projects shipped", note: "Confirm from project submissions" },
  { id: "branches", label: "Branches represented", note: "Confirm after membership drive" },
];

/** Impact areas are qualitative and safe to publish before metrics exist. */
export const impactAreas = [
  {
    title: "Applied practice, not just theory",
    detail:
      "AIMSA activity is organised around producing something that runs — a notebook, a prototype, a merged pull request — rather than certificates of attendance.",
  },
  {
    title: "Cross-branch participation",
    detail:
      "Sessions are designed so students outside the AI & ML branch can take part meaningfully from the first hour.",
  },
  {
    title: "Student ownership",
    detail:
      "Events are planned, run and documented by student teams, with faculty coordinators providing oversight and institutional support.",
  },
  {
    title: "Evidence over claims",
    detail:
      "Outcomes are published with context and links to evidence. Where a result is not yet verified, this site says so.",
  },
];
