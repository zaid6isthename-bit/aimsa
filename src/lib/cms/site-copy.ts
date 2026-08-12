/**
 * Editable copy registry.
 *
 * Every string on the public site that the AIMSA team may want to change lives
 * here with a default value. The admin portal ("Site content") edits these keys
 * and stores them as a single JSON object in `site_settings` under key `copy`.
 *
 * Pages read values through `copy()` / `copyList()` / `copyPairs()` in store.ts,
 * so an empty or missing value automatically falls back to the default below.
 */

export type CopyFieldType = "text" | "textarea" | "list" | "pairs";

export interface CopyField {
  id: string;
  label: string;
  type: CopyFieldType;
  help?: string;
}

export interface CopyGroup {
  key: string;
  title: string;
  description: string;
  fields: CopyField[];
}

const pairHelp = "One per line, in the form  Title :: Detail";

export const copyGroups: CopyGroup[] = [
  {
    key: "global",
    title: "Global / brand",
    description: "Names, tagline and the site-wide announcement bar used on every page.",
    fields: [
      { id: "global.name", label: "Short name", type: "text" },
      { id: "global.fullName", label: "Full association name", type: "text" },
      { id: "global.tagline", label: "Tagline", type: "text" },
      { id: "global.motto", label: "Motto", type: "text" },
      { id: "global.college", label: "College", type: "text" },
      { id: "global.campus", label: "Campus", type: "text" },
      { id: "global.eyebrow", label: "Header eyebrow", type: "text" },
      { id: "global.description", label: "Association description", type: "textarea" },
      { id: "global.footerNote", label: "Footer note", type: "textarea" },
      { id: "global.bannerText", label: "Announcement bar message", type: "text", help: "Leave empty to hide the bar." },
      { id: "global.bannerHref", label: "Announcement bar link", type: "text" },
    ],
  },
  {
    key: "home",
    title: "Home page",
    description: "Hero, section headings and the calls to action on the landing page.",
    fields: [
      { id: "home.heroEyebrow", label: "Hero eyebrow", type: "text" },
      { id: "home.heroTagline", label: "Hero tagline", type: "text" },
      { id: "home.heroDescription", label: "Hero description", type: "textarea" },
      { id: "home.primaryCtaLabel", label: "Primary button label", type: "text" },
      { id: "home.primaryCtaHref", label: "Primary button link", type: "text" },
      { id: "home.secondaryCtaLabel", label: "Secondary button label", type: "text" },
      { id: "home.secondaryCtaHref", label: "Secondary button link", type: "text" },
      { id: "home.whyEyebrow", label: "\"Why AIMSA\" eyebrow", type: "text" },
      { id: "home.whyTitle", label: "\"Why AIMSA\" title", type: "text" },
      { id: "home.whyIntro", label: "\"Why AIMSA\" intro", type: "textarea" },
      { id: "home.whyItems", label: "\"Why AIMSA\" cards", type: "pairs", help: pairHelp },
      { id: "home.programmesEyebrow", label: "Programmes eyebrow", type: "text" },
      { id: "home.programmesTitle", label: "Programmes title", type: "text" },
      { id: "home.programmesIntro", label: "Programmes intro", type: "textarea" },
      { id: "home.eventsTitle", label: "Events section title", type: "text" },
      { id: "home.eventsIntro", label: "Events section intro", type: "textarea" },
      { id: "home.projectsTitle", label: "Showcase title", type: "text" },
      { id: "home.projectsIntro", label: "Showcase intro", type: "textarea" },
      { id: "home.teamTitle", label: "Team section title", type: "text" },
      { id: "home.teamIntro", label: "Team section intro", type: "textarea" },
      { id: "home.joinTitle", label: "Join CTA title", type: "text" },
      { id: "home.joinIntro", label: "Join CTA text", type: "textarea" },
      { id: "home.joinCtaLabel", label: "Join CTA button", type: "text" },
    ],
  },
  {
    key: "about",
    title: "About page",
    description: "Who we are, mission, vision, objectives and values.",
    fields: [
      { id: "about.eyebrow", label: "Eyebrow", type: "text" },
      { id: "about.title", label: "Page title", type: "text" },
      { id: "about.intro", label: "Page intro", type: "textarea" },
      { id: "about.whoTitle", label: "\"Who we are\" title", type: "text" },
      { id: "about.who", label: "\"Who we are\" paragraphs", type: "list", help: "One paragraph per line." },
      { id: "about.mission", label: "Mission", type: "textarea" },
      { id: "about.vision", label: "Vision", type: "textarea" },
      { id: "about.objectivesTitle", label: "Objectives title", type: "text" },
      { id: "about.objectivesIntro", label: "Objectives intro", type: "textarea" },
      { id: "about.objectives", label: "Objectives", type: "pairs", help: pairHelp },
      { id: "about.valuesTitle", label: "Values title", type: "text" },
      { id: "about.values", label: "Values", type: "pairs", help: pairHelp },
      { id: "about.ctaTitle", label: "Closing CTA title", type: "text" },
      { id: "about.ctaText", label: "Closing CTA text", type: "textarea" },
    ],
  },
  {
    key: "events",
    title: "Events page",
    description: "Header copy for the events listing.",
    fields: [
      { id: "events.eyebrow", label: "Eyebrow", type: "text" },
      { id: "events.title", label: "Page title", type: "text" },
      { id: "events.intro", label: "Page intro", type: "textarea" },
      { id: "events.emptyText", label: "Empty state text", type: "textarea" },
    ],
  },
  {
    key: "projects",
    title: "Projects page",
    description: "Header copy for the project showcase.",
    fields: [
      { id: "projects.eyebrow", label: "Eyebrow", type: "text" },
      { id: "projects.title", label: "Page title", type: "text" },
      { id: "projects.intro", label: "Page intro", type: "textarea" },
      { id: "projects.emptyText", label: "Empty state text", type: "textarea" },
    ],
  },
  {
    key: "achievements",
    title: "Achievements page",
    description: "Header copy, headline metrics and impact areas.",
    fields: [
      { id: "achievements.eyebrow", label: "Eyebrow", type: "text" },
      { id: "achievements.title", label: "Page title", type: "text" },
      { id: "achievements.intro", label: "Page intro", type: "textarea" },
      { id: "achievements.metrics", label: "Headline metrics", type: "pairs", help: "One per line: Value :: Label" },
      { id: "achievements.impactTitle", label: "Impact section title", type: "text" },
      { id: "achievements.impactAreas", label: "Impact areas", type: "pairs", help: pairHelp },
      { id: "achievements.emptyText", label: "Empty state text", type: "textarea" },
    ],
  },
  {
    key: "team",
    title: "Team page",
    description: "Header copy and the academic year shown on the team page.",
    fields: [
      { id: "team.academicYear", label: "Academic year", type: "text" },
      { id: "team.title", label: "Page title", type: "text" },
      { id: "team.intro", label: "Page intro", type: "textarea" },
      { id: "team.ctaTitle", label: "Closing CTA title", type: "text" },
      { id: "team.ctaText", label: "Closing CTA text", type: "textarea" },
    ],
  },
  {
    key: "gallery",
    title: "Gallery page",
    description: "Header copy for photo albums.",
    fields: [
      { id: "gallery.eyebrow", label: "Eyebrow", type: "text" },
      { id: "gallery.title", label: "Page title", type: "text" },
      { id: "gallery.intro", label: "Page intro", type: "textarea" },
      { id: "gallery.emptyText", label: "Empty state text", type: "textarea" },
    ],
  },
  {
    key: "announcements",
    title: "Announcements page",
    description: "Header copy for the notice board.",
    fields: [
      { id: "announcements.eyebrow", label: "Eyebrow", type: "text" },
      { id: "announcements.title", label: "Page title", type: "text" },
      { id: "announcements.intro", label: "Page intro", type: "textarea" },
      { id: "announcements.emptyText", label: "Empty state text", type: "textarea" },
    ],
  },
  {
    key: "join",
    title: "Join page",
    description: "Membership steps, form copy and the FAQ list.",
    fields: [
      { id: "join.eyebrow", label: "Eyebrow", type: "text" },
      { id: "join.title", label: "Page title", type: "text" },
      { id: "join.intro", label: "Page intro", type: "textarea" },
      { id: "join.stepsTitle", label: "Steps title", type: "text" },
      { id: "join.steps", label: "Steps", type: "pairs", help: pairHelp },
      { id: "join.formTitle", label: "Form title", type: "text" },
      { id: "join.formNote", label: "Form note", type: "text" },
      { id: "join.faqTitle", label: "FAQ title", type: "text" },
      { id: "join.faqs", label: "FAQs", type: "pairs", help: "One per line: Question :: Answer" },
    ],
  },
  {
    key: "contact",
    title: "Contact page & details",
    description: "Address, email, socials and the contact page copy.",
    fields: [
      { id: "contact.eyebrow", label: "Eyebrow", type: "text" },
      { id: "contact.title", label: "Page title", type: "text" },
      { id: "contact.intro", label: "Page intro", type: "textarea" },
      { id: "contact.department", label: "Department", type: "text" },
      { id: "contact.address", label: "Address", type: "textarea" },
      { id: "contact.email", label: "Email address", type: "text" },
      { id: "contact.phone", label: "Phone", type: "text" },
      { id: "contact.socials", label: "Social links", type: "pairs", help: "One per line: Label :: URL" },
      { id: "contact.responseTitle", label: "Response section title", type: "text" },
      { id: "contact.responseText", label: "Response section text", type: "textarea" },
      { id: "contact.formTitle", label: "Form title", type: "text" },
    ],
  },
];

export const copyDefaults: Record<string, string> = {
  "global.name": "AIMSA",
  "global.fullName": "Artificial Intelligence & Machine Learning Students Association",
  "global.tagline": "Think Beyond. Build Ahead.",
  "global.motto": "Redefining the Future",
  "global.college": "Lokmanya Tilak College of Engineering",
  "global.campus": "Koparkhairane, Navi Mumbai",
  "global.eyebrow": "Lokmanya Tilak College of Engineering · Navi Mumbai",
  "global.description":
    "AIMSA is LTCE's student-led AI and machine learning community—where curious learners become builders, ideas become systems, and technical growth becomes shared impact.",
  "global.footerNote": "Student-led association of the Department of Artificial Intelligence & Machine Learning.",
  "global.bannerText": "",
  "global.bannerHref": "",

  "home.heroEyebrow": "Lokmanya Tilak College of Engineering · Navi Mumbai",
  "home.heroTagline": "Think Beyond. Build Ahead.",
  "home.heroDescription":
    "AIMSA is LTCE's student-led AI and machine learning community—where curious learners become builders, ideas become systems, and technical growth becomes shared impact.",
  "home.primaryCtaLabel": "Join AIMSA",
  "home.primaryCtaHref": "/join",
  "home.secondaryCtaLabel": "See what's on",
  "home.secondaryCtaHref": "/events",
  "home.whyEyebrow": "Why AIMSA",
  "home.whyTitle": "Your next breakthrough should not happen alone.",
  "home.whyIntro": "Four reasons students stay with AIMSA through the year.",
  "home.whyItems":
    "Learn by building :: Every programme ends with something you made and can explain.\nOpen to everyone :: No test, no branch requirement, no prior machine-learning experience.\nMentorship that lasts :: Seniors, faculty coordinators and alumni review work in the open.\nEvidence, not claims :: Outcomes are documented and published with proof.",
  "home.programmesEyebrow": "Programmes",
  "home.programmesTitle": "What AIMSA runs through the year",
  "home.programmesIntro": "Workshops, debates, hackathons and community sessions across the academic calendar.",
  "home.eventsTitle": "Flagship event",
  "home.eventsIntro": "The next thing on the AIMSA calendar.",
  "home.projectsTitle": "Showcase",
  "home.projectsIntro": "Work built by AIMSA members.",
  "home.teamTitle": "The people behind it",
  "home.teamIntro": "Office bearers, technical, events and design teams.",
  "home.joinTitle": "Ready to build with us?",
  "home.joinIntro": "Membership is open to all branches and years. Start with the interest form.",
  "home.joinCtaLabel": "Join AIMSA",

  "about.eyebrow": "About",
  "about.title": "A student community built around applied AI",
  "about.intro":
    "AIMSA is LTCE's student-led AI and machine learning community—where curious learners become builders, ideas become systems, and technical growth becomes shared impact.",
  "about.whoTitle": "Who we are",
  "about.who":
    "AIMSA — the Artificial Intelligence & Machine Learning Students Association — is the student-led association for artificial intelligence and machine learning at Lokmanya Tilak College of Engineering, Koparkhairane, Navi Mumbai.\nWe are organised around a single idea: students learn AI by building with it, in a group, with people who will tell them honestly what is working. Every activity we run is designed so that participants leave with something they made and can explain.\nThe association is run by student office bearers under the guidance of departmental faculty coordinators. Membership is open to every LTCE student.",
  "about.mission":
    "Give every interested LTCE student a structured, hands-on path into AI and machine learning — regardless of branch, year or starting point.",
  "about.vision":
    "A student community whose work speaks for itself: shipped projects, evidenced outcomes, and graduates who can reason about AI systems rather than only operate them.",
  "about.objectivesTitle": "What the association commits to",
  "about.objectivesIntro": "These are the operating objectives the team plans each academic year against.",
  "about.objectives":
    "Make AI practice accessible :: Run entry-level sessions that assume nothing, so a first-year student from any branch can participate meaningfully.\nTurn learning into artefacts :: Every programme ends with something concrete: a notebook, a prototype, a contribution, a documented result.\nBuild technical judgement :: Teach students to question a result, check a baseline, and explain a trade-off — the skills that outlast any framework.\nCreate speaking and leading opportunities :: Debates, demos and event ownership give members practice at defending work in front of an audience.\nDocument and publish outcomes :: Maintain a public, evidenced record of what the association and its members actually did.\nSupport the department :: Work alongside faculty coordinators to complement the AI & ML curriculum rather than duplicate it.",
  "about.valuesTitle": "How we work",
  "about.values":
    "Evidence over claims :: If it cannot be shown, it is not published.\nOpen door :: No test, no gatekeeping, no prerequisite branch.\nBuild in public :: Work is reviewed by peers, not hidden until perfect.\nRespect for time :: Sessions start on time, scope is honest, no filler.",
  "about.ctaTitle": "Interested in being part of it?",
  "about.ctaText": "Membership is open to all branches and years. Start with the interest form.",

  "events.eyebrow": "Events",
  "events.title": "Workshops, debates and build sessions",
  "events.intro": "Everything AIMSA is running this academic year, with registration details and outcomes.",
  "events.emptyText": "The calendar for this term is being finalised. Check back shortly.",

  "projects.eyebrow": "Projects",
  "projects.title": "Work built by AIMSA members",
  "projects.intro": "Prototypes, tools and research builds from the association's project cycles.",
  "projects.emptyText": "Project entries are published once they are reviewed and documented.",

  "achievements.eyebrow": "Achievements",
  "achievements.title": "A public, evidenced record",
  "achievements.intro": "Results, recognitions and outcomes — every entry links to supporting evidence.",
  "achievements.metrics": "",
  "achievements.impactTitle": "Where AIMSA makes a difference",
  "achievements.impactAreas": "",
  "achievements.emptyText": "Verified achievements will be published here as they are recorded.",

  "team.academicYear": "2025-26",
  "team.title": "The people behind AIMSA",
  "team.intro": "Office bearers, technical, events and design teams running the association this year.",
  "team.ctaTitle": "Want to be on this page next year?",
  "team.ctaText": "Core team roles open at the start of each academic year.",

  "gallery.eyebrow": "Gallery",
  "gallery.title": "Moments from AIMSA",
  "gallery.intro": "Photos from workshops, debates, hackathons and community sessions.",
  "gallery.emptyText": "Albums are published after each event once photos are approved.",

  "announcements.eyebrow": "Announcements",
  "announcements.title": "Notices and updates",
  "announcements.intro": "Registrations, results and important updates from the AIMSA core team.",
  "announcements.emptyText": "There are no active announcements right now.",

  "join.eyebrow": "Join",
  "join.title": "Membership is open to every LTCE student",
  "join.intro":
    "No entrance test, no branch requirement, no prior machine-learning experience. Register your interest and the core team will contact you about orientation.",
  "join.stepsTitle": "How joining works",
  "join.steps":
    "Register interest :: Submit the form below with your branch, year and what you want to work on.\nAttend orientation :: A short session covering how AIMSA runs and what each functional team does.\nPick a team :: Choose technical, events, design or outreach based on where you want to contribute.\nStart building :: Join the next workshop or project cycle and ship something in your first term.",
  "join.formTitle": "Interest form",
  "join.formNote": "Fields marked with an asterisk are required.",
  "join.faqTitle": "Common questions",
  "join.faqs": "",


  "contact.eyebrow": "Contact",
  "contact.title": "Talk to the AIMSA core team",
  "contact.intro":
    "Collaboration proposals, speaking offers, sponsorship enquiries or a simple question — send it here and the core team will route it to the right person.",
  "contact.department": "Department of Artificial Intelligence & Machine Learning",
  "contact.address": "Lokmanya Tilak College of Engineering, Sector 4, Koparkhairane, Navi Mumbai 400709",
  "contact.email": "",
  "contact.phone": "",
  "contact.socials": "",
  "contact.responseTitle": "Response time",
  "contact.responseText":
    "Messages are reviewed by the core team during term. Expect a reply within a few working days; time-sensitive event queries are prioritised.",
  "contact.formTitle": "Send a message",
};

export const listSeparator = "::";
