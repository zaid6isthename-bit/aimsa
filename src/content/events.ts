import type { AimsaEvent } from "./types";

/**
 * SEED CONTENT — every entry below describes a planned AIMSA activity format.
 * Official dates, venues and registration links are intentionally left blank
 * and render as "To be announced". Fill them in as they are confirmed.
 */
export const events: AimsaEvent[] = [
  {
    slug: "aimsa-tech-debate-2026",
    title: "AIMSA Tech Debate 2026",
    summary:
      "Our flagship debate format: teams argue real questions about AI systems, evidence in hand, under time pressure.",
    description: [
      "AIMSA Tech Debate is built on a simple premise: engineers should be able to defend a technical position out loud, with evidence, in front of people who disagree.",
      "Teams receive a motion drawn from applied AI and machine learning practice — deployment risk, data governance, automation and work, model evaluation — and prepare a structured case with citations. Rounds are timed, judged on evidence quality and reasoning, and open to spectators from every branch.",
      "The event is designed for participants who have never debated before as much as for experienced speakers. A briefing session covers format, rebuttal structure and how to cite a paper without reading it aloud.",
    ],
    category: "Debate",
    format: "In-person",
    status: "Coming Soon",
    venue: "To be announced",
    theme: "Ideas under pressure. Arguments backed by evidence.",
    featured: true,
    published: true,
    eligibility: [
      "Open to all LTCE students across branches and years",
      "Teams of two; individual entries are matched into teams",
      "No prior debating experience required",
    ],
    agenda: [
      { title: "Briefing and motion release", detail: "Format walkthrough, judging criteria, preparation window." },
      { title: "Preliminary rounds", detail: "Timed opening cases and rebuttals across parallel rooms." },
      { title: "Semi-finals", detail: "Top teams by evidence and reasoning scores advance." },
      { title: "Final round and adjudication", detail: "Open to spectators, followed by judge feedback." },
    ],
    contacts: [{ label: "Event queries", value: "Use the contact form" }],
    seo: {
      title: "AIMSA Tech Debate 2026",
      description:
        "AIMSA's flagship technical debate at LTCE Navi Mumbai — ideas under pressure, arguments backed by evidence.",
    },
  },
  {
    slug: "ml-foundations-workshop",
    title: "ML Foundations Workshop",
    summary:
      "A hands-on series that takes students from Python and data handling to training and evaluating a first model.",
    description: [
      "A practical, laptop-open workshop series for students who want to move past tutorial-following. Sessions cover data loading and cleaning, feature construction, model training, and — the part most courses skip — honest evaluation.",
      "Participants leave with a working notebook they wrote themselves and a checklist for judging whether a model result is real or an artefact of a bad split.",
    ],
    category: "Workshop",
    format: "In-person",
    status: "Coming Soon",
    venue: "To be announced",
    published: true,
    eligibility: ["Open to all LTCE students", "Basic Python familiarity helps but is not required"],
    agenda: [
      { title: "Session 1 — Data in, sanity checks", detail: "Loading, cleaning, splitting and leakage." },
      { title: "Session 2 — First models", detail: "Baselines, linear models, trees, and why baselines matter." },
      { title: "Session 3 — Evaluation that survives scrutiny", detail: "Metrics, validation, error analysis." },
    ],
  },
  {
    slug: "build-week-prototype-sprint",
    title: "Build Week: Prototype Sprint",
    summary:
      "A week-long sprint where small teams take an AI/ML idea from problem statement to a demoable prototype.",
    description: [
      "Build Week is AIMSA's answer to the project that never gets started. Teams pick a narrow problem, scope it down until it fits a week, and ship something that runs.",
      "Mentoring checkpoints keep scope honest. The week closes with short demos — working prototypes only, no slide-only submissions.",
    ],
    category: "Hackathon",
    format: "Hybrid",
    status: "Coming Soon",
    venue: "To be announced",
    published: true,
    eligibility: ["Teams of two to four LTCE students", "One prototype per team"],
  },
  {
    slug: "applied-ai-seminar-series",
    title: "Applied AI Seminar Series",
    summary:
      "Talks on how AI and ML are actually used in industry and research, with time reserved for questions.",
    description: [
      "A recurring seminar slot for practitioners, researchers and senior students to walk through real systems: what was built, what broke, and what they would do differently.",
      "Every session reserves a substantial block for audience questions. Speaker line-ups are published on this page once confirmed.",
    ],
    category: "Seminar",
    format: "In-person",
    status: "Coming Soon",
    venue: "To be announced",
    published: true,
  },
  {
    slug: "open-source-contribution-lab",
    title: "Open Source Contribution Lab",
    summary:
      "A guided lab where students make their first genuine pull request to an open source AI/ML project.",
    description: [
      "Reading other people's code is a skill. This lab walks students through finding an approachable issue, setting up a project locally, writing a change that respects existing conventions, and surviving code review.",
      "The goal is one merged contribution per participant, however small.",
    ],
    category: "Bootcamp",
    format: "Hybrid",
    status: "Coming Soon",
    venue: "To be announced",
    published: true,
  },
  {
    slug: "aimsa-orientation",
    title: "AIMSA Orientation",
    summary:
      "An introduction to the association: what we run through the year, how teams work, and how to get involved.",
    description: [
      "An open session for students considering AIMSA. We cover the year's activity calendar, how the functional teams operate, what commitment looks like in practice, and how to join.",
      "Bring questions. There is no application test — participation is the entry point.",
    ],
    category: "Community",
    format: "In-person",
    status: "Coming Soon",
    venue: "To be announced",
    published: true,
  },
];
