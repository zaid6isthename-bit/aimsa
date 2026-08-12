/** Central site configuration. Replace placeholders marked TBA before launch. */
export const site = {
  name: "AIMSA",
  fullName: "Artificial Intelligence & Machine Learning Students Association",
  tagline: "Think Beyond. Build Ahead.",
  motto: "Redefining the Future",
  college: "Lokmanya Tilak College of Engineering",
  campus: "Koparkhairane, Navi Mumbai",
  eyebrow: "Lokmanya Tilak College of Engineering · Navi Mumbai",
  description:
    "AIMSA is LTCE's student-led AI and machine learning community—where curious learners become builders, ideas become systems, and technical growth becomes shared impact.",
  url: "https://aimsa-ltce.lovable.app",
  /** Official channels — replace with confirmed details (see CONTENT_CHECKLIST.md). */
  contact: {
    email: "" as string,
    department: "Department of Artificial Intelligence & Machine Learning",
    address: "Lokmanya Tilak College of Engineering, Sector 4, Koparkhairane, Navi Mumbai 400709",
  },
  socials: [] as { label: string; href: string }[],
} as const;

export const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Events", to: "/events" },
  { label: "Projects", to: "/projects" },
  { label: "Achievements", to: "/achievements" },
  { label: "Team", to: "/team" },
  { label: "Gallery", to: "/gallery" },
  { label: "Announcements", to: "/announcements" },
  { label: "Portal", to: "/portal" },
] as const;
