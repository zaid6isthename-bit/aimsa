import { ArtBackdrop } from "@/components/site/ArtBackdrop";
import { bgFor } from "@/assets/bg";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Tilt } from "@/components/motion/Tilt";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  Hammer,
  MapPin,
  Megaphone,
  Presentation,
  Trophy,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { SectionHeading } from "@/components/site/SectionHeading";
import { StatusBadge } from "@/components/site/StatusBadge";
import { FloatingNextEvent } from "@/components/site/FloatingNextEvent";
import { KineticHeading } from "@/components/motion/KineticHeading";
import { Shuffle } from "@/components/motion/Shuffle";
import { GridHorizon } from "@/components/motion/GridHorizon";
import { ParticleField } from "@/components/motion/ParticleField";
import { HeroExit } from "@/components/motion/HeroExit";
import TextLoop from "@/components/motion/TextLoop";
import AccordionGallery from "@/components/motion/AccordionGallery";
import tile1 from "@/assets/tiles/tile-1.jpg.asset.json";
import tile2 from "@/assets/tiles/tile-2.png.asset.json";
import tile3 from "@/assets/tiles/tile-3.jpg.asset.json";
import tile4 from "@/assets/tiles/tile-4.jpg.asset.json";
import tile5 from "@/assets/tiles/tile-5.jpg.asset.json";
import tile6 from "@/assets/tiles/tile-6.webp.asset.json";

const tileBackgrounds: string[] = [tile1.url, tile2.url, tile3.url, tile4.url, tile5.url, tile6.url];
import { HyperspeedBackground } from "@/components/motion/HyperspeedBackground";
import { ScrambleText } from "@/components/motion/ScrambleText";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { HorizontalScroller } from "@/components/motion/HorizontalScroller";
import { StatCounter } from "@/components/motion/StatCounter";
import { site } from "@/content/site";
import { copy } from "@/lib/cms/store";
import heroBg from "@/assets/hero-synthwave-v2.png.asset.json";
import { team, teamGroups } from "@/content/team";

import { impactAreas, metrics } from "@/content/achievements";
import {
  activeAnnouncements,
  eventBucket,
  eventStatus,
  formatDate,
  formatEventDate,
  isNewAnnouncement,
  nextEvent,
  publishedEvents,
  TBA,
} from "@/lib/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AIMSA — AI & ML Students Association | LTCE Navi Mumbai" },
      {
        name: "description",
        content:
          "AIMSA is the student-led AI and machine learning community at Lokmanya Tilak College of Engineering, Navi Mumbai. Learn, build, compete, lead and showcase.",
      },
      { property: "og:title", content: "AIMSA — Think Beyond. Build Ahead." },
      {
        property: "og:description",
        content:
          "The student-led AI & ML community at Lokmanya Tilak College of Engineering, Koparkhairane, Navi Mumbai.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: site.fullName,
          alternateName: site.name,
          slogan: site.tagline,
          url: site.url,
          parentOrganization: { "@type": "CollegeOrUniversity", name: site.college },
          address: {
            "@type": "PostalAddress",
            streetAddress: "Sector 4, Koparkhairane",
            addressLocality: "Navi Mumbai",
            addressRegion: "Maharashtra",
            addressCountry: "IN",
          },
        }),
      },
    ],
  }),
  component: Home,
});

const journey = [
  { icon: BookOpen, title: "Learn", detail: "Workshops, talks and peer study groups that start from foundations." },
  { icon: Hammer, title: "Build", detail: "Projects, labs, prototypes and first open source contributions." },
  { icon: Trophy, title: "Compete", detail: "Debates, hackathons and technical challenges with real judging." },
  { icon: Users, title: "Lead", detail: "Team roles, event ownership and mentoring the next cohort." },
  { icon: Presentation, title: "Showcase", detail: "Documented outcomes, portfolios and visibility beyond campus." },
];

const whyPillars = [
  {
    title: "Practice over passive attendance",
    detail:
      "Every session ends with something built, measured or defended. Turning up is the start, not the outcome.",
  },
  {
    title: "Evidence, not adjectives",
    detail:
      "Numbers appear on this site only when they are verified. Until then we say what is confirmed and what is pending.",
  },
  {
    title: "Open to every branch and year",
    detail:
      "No entrance test and no prerequisite subject. Foundations are taught, and members enter at whatever stage fits.",
  },
  {
    title: "Student-led, faculty-backed",
    detail:
      "Students own the programme and its execution; faculty coordinators provide academic grounding and approval.",
  },
  {
    title: "Work that outlives the semester",
    detail:
      "Projects, write-ups and certificates stay documented so members carry a portfolio, not just a memory.",
  },
];


function Home() {
  const heroTagline = copy("home.heroTagline");
  const heroParts = heroTagline.split(/(?<=\.)\s+/);
  const heroLine1 = heroParts[0] ?? heroTagline;
  const heroLine2 = heroParts.slice(1).join(" ");
  const next = nextEvent();
  const flagship = publishedEvents().find((e) => e.featured);
  const latest = activeAnnouncements()[0];
  const allEvents = publishedEvents();
  const buckets = {
    upcoming: allEvents.filter((e) => eventBucket(e) === "upcoming"),
    ongoing: allEvents.filter((e) => eventBucket(e) === "ongoing"),
    past: allEvents.filter((e) => eventBucket(e) === "past"),
  };
  const visibleMetrics = metrics.filter((m) => typeof m.value === "number");
  const leadership = team.filter((m) => m.group === "Faculty" || m.group === "Office Bearers").slice(0, 6);

  return (
    <>
      {/* Hero */}
      <HeroExit>
      <section data-hero className="scanlines relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <img
            src={heroBg.url}
            alt=""
            className="h-full w-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-background/72" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-background" />
        </div>
        <GridHorizon />
        <ParticleField className="opacity-70 mix-blend-screen" />
        <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-32 top-0 h-[36rem] w-[36rem] rounded-full bg-accent/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-40 top-40 h-[30rem] w-[30rem] rounded-full bg-primary/15 blur-3xl"
          aria-hidden="true"
        />

        <div
          data-hero-inner
          className="container-aimsa relative grid items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24"
        >
          <div className="animate-rise">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs font-medium tracking-wide text-muted-foreground">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
              {copy("home.heroEyebrow")}
            </p>

            <div className="group relative mt-6" style={{ perspective: "900px" }}>
              <div
                className="transition-transform duration-500 ease-out group-hover:scale-[1.015]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <Shuffle
                  tag="h1"
                  text={heroLine1}
                  textAlign="left"
                  shuffleDirection="right"
                  duration={0.4}
                  shuffleTimes={2}
                  animationMode="evenodd"
                  stagger={0.035}
                  ease="power3.out"
                  threshold={0.1}
                  rootMargin="0px"
                  scrambleCharset="ABCDEFGHIJKLMNOPQRSTUVWXYZ01#/\\"
                  triggerOnce={true}
                  triggerOnHover
                  className="block font-hero text-[3.6rem] leading-[0.92] text-foreground sm:text-7xl lg:text-[6.5rem]"
                />
                <Shuffle
                  tag="p"
                  text={heroLine2}
                  textAlign="left"
                  shuffleDirection="right"
                  duration={0.45}
                  shuffleTimes={2}
                  animationMode="evenodd"
                  stagger={0.045}
                  ease="power3.out"
                  threshold={0.1}
                  rootMargin="0px"
                  scrambleCharset="ABCDEFGHIJKLMNOPQRSTUVWXYZ01#/\\"
                  triggerOnce={true}
                  triggerOnHover
                  className="block font-hero text-[3.6rem] leading-[0.92] text-primary drop-shadow-[0_0_18px_var(--neon-a)] sm:text-7xl lg:text-[6.5rem]"
                />
                <span
                  aria-hidden="true"
                  className="ml-1 inline-block h-[0.55em] w-[3px] translate-y-[-0.05em] animate-pulse bg-neon-b shadow-[0_0_10px_var(--neon-b)]"
                />
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-2 left-0 h-px w-full overflow-hidden opacity-70"
              >
                <div className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-transparent via-neon-b to-transparent transition-transform duration-700 group-hover:scale-x-100" />
              </div>
            </div>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {copy("home.heroDescription")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Button asChild variant="hero" size="xl" data-cursor="Explore">
                  <Link to="/about">
                    Explore AIMSA
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </Magnetic>
              <Magnetic>
                <Button asChild variant="outline" size="xl" data-cursor="Events">
                  <Link to="/events">View Events</Link>
                </Button>
              </Magnetic>
              <Button asChild variant="link" size="xl">
                <Link to="/join">Join the Community</Link>
              </Button>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["Student-led", "Applied learning", "Built at LTCE"].map((cue) => (
                <li key={cue} className="flex items-center gap-2">
                  <span className="size-1 rounded-full bg-accent" aria-hidden="true" />
                  {cue}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <FloatingNextEvent next={next} />
          </div>
        </div>

        {/* Diagonal wavy ribbon across the lower-right corner */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -right-[12%] z-10 w-[130%] origin-bottom-right rotate-[-14deg] opacity-95 sm:-bottom-32 sm:w-[105%] lg:-bottom-36 lg:w-[85%]"
        >
          <TextLoop
            text="AIMSA"
            shape="wave"
            speed={90}
            direction="forward"
            separator="✦"
            curviness={55}
            fontSize={46}
            fontWeight={800}
            letterSpacing={2}
            uppercase
            color="#ffffff"
            ribbon
            ribbonColor="#ff00ca"
            ribbonWidth={86}
            pauseOnHover={false}
          />
        </div>
      </section>
      </HeroExit>

      {/* Hyperspeed backdrop for everything after the hero */}
      <div className="relative isolate">
        <div
          className="pointer-events-none sticky top-0 z-0 h-0 overflow-visible"
          aria-hidden="true"
        >
          <div className="relative h-screen w-full">
            <HyperspeedBackground />
            <div className="absolute inset-0 bg-background/60" />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
          </div>
        </div>
        <div className="relative z-10">
      {/* Pulse */}
      <section className="container-aimsa" aria-labelledby="pulse-heading">
        <h2 id="pulse-heading" className="sr-only">
          AIMSA pulse
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {next ? (
            <PulseCard
              icon={<CalendarDays className="size-4" aria-hidden="true" />}
              label="Next event"
              title={next.title}
              detail={formatEventDate(next)}
              to="/events/$slug"
              params={{ slug: next.slug }}
              cta="Open event"
            />
          ) : null}
          {latest ? (
            <PulseCard
              icon={<Megaphone className="size-4" aria-hidden="true" />}
              label="Latest announcement"
              title={latest.title}
              detail={formatDate(latest.publishedAt)}
              to="/announcements"
              cta="All announcements"
            />
          ) : null}
          <PulseCard
            icon={<Bell className="size-4" aria-hidden="true" />}
            label="Membership"
            title="Interest form is open to all branches"
            detail="No entrance test · orientation-based allocation"
            to="/join"
            cta="Register interest"
          />
        </div>
      </section>

      {/* About */}
      <section className="relative isolate overflow-hidden" aria-labelledby="about-heading">
        <ArtBackdrop image={bgFor("home:about")} position="center 50%" />
        <div className="container-aimsa section-y grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            id="about-heading"
            eyebrow="About AIMSA"
            title="The bridge between coursework and applied AI practice"
            intro="AIMSA exists because there is a gap between passing a machine learning subject and being able to build, evaluate and defend a working system. We close it with practice, in public, together."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="surface-card p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Mission</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Give every interested LTCE student a structured, hands-on path into artificial intelligence and
                machine learning — regardless of branch, year, or starting point.
              </p>
            </div>
            <div className="surface-card p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Vision</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                A student community whose work speaks for itself: shipped projects, evidenced outcomes and
                graduates who can reason about AI systems, not just use them.
              </p>
            </div>
            <div className="surface-card p-6 sm:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">The gap we close</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Classrooms teach the theory. Industry expects judgement — scoping a problem, handling messy data,
                knowing when a result is real, working in a team and communicating the outcome. AIMSA is where
                students practise that second half.
              </p>
              <Button asChild variant="link" className="mt-3 px-0">
                <Link to="/about">
                  Learn more about AIMSA <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="relative isolate overflow-hidden border-y border-border bg-surface/40" aria-labelledby="journey-heading">
        <ArtBackdrop image={bgFor("home:journey")} position="center 45%" />
        <div className="container-aimsa section-y">
          <SectionHeading
            id="journey-heading"
            eyebrow="The AIMSA journey"
            title="Five stages, one continuous path"
            intro="Membership is not a subscription to notifications. It is a progression — and you can enter at any stage."
            align="center"
          />
          <ol className="relative mt-14 grid gap-5 md:grid-cols-5">
            <li
              className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-border-strong to-transparent md:block"
              aria-hidden="true"
            />
            {journey.map((stage, i) => (
              <li key={stage.title} className="relative">
                <Tilt className="h-full"><div className="surface-card h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:neon-ring" data-cursor="Stage">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-primary/10 text-primary">
                      <stage.icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{stage.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{stage.detail}</p>
                </div></Tilt>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Flagship */}
      {flagship ? (
        <section className="container-aimsa section-y" aria-labelledby="flagship-heading">
          <Tilt className="h-full">
            <div className="relative isolate h-full overflow-hidden rounded-3xl border border-primary/25 bg-surface p-8 shadow-elev-2 lg:p-14">
              <ArtBackdrop image={bgFor("home:flagship")} position="center 40%" />
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet/20 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    {copy("home.eventsTitle")}
                  </p>
                  <h2 id="flagship-heading" className="mt-4 text-3xl font-bold sm:text-5xl">
                    {flagship.title}
                  </h2>
                  <p className="mt-4 max-w-xl font-display text-xl italic text-foreground/90">
                    “Ideas under pressure. Arguments backed by evidence.”
                  </p>
                  <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">{flagship.summary}</p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Button asChild variant="hero" size="lg">
                      <Link to="/events/$slug" params={{ slug: flagship.slug }}>
                        View event details
                      </Link>
                    </Button>
                    {flagship.registrationUrl ? (
                      <Button asChild variant="outline" size="lg">
                        <a href={flagship.registrationUrl}>Register</a>
                      </Button>
                    ) : null}
                  </div>
                </div>
                <dl className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border">
                  {[
                    ["Theme", flagship.theme ?? TBA],
                    ["Date", formatEventDate(flagship)],
                    ["Venue", flagship.venue ?? TBA],
                    ["Format", flagship.format],
                    ["Eligibility", flagship.eligibility?.[0] ?? TBA],
                    ["Registration", flagship.registrationUrl ? "Open" : "To be announced"],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-surface px-5 py-4">
                      <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{k}</dt>
                      <dd className="mt-1 text-sm font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Tilt>
        </section>
      ) : null}

      {/* Events */}
      <section className="container-aimsa section-y" aria-labelledby="events-heading">
        <SectionHeading
          id="events-heading"
          eyebrow={copy("home.programmesEyebrow")}
          title={copy("home.programmesTitle")}
          intro={copy("home.programmesIntro")}
          action={
            <Button asChild variant="quiet">
              <Link to="/events">
                View all events <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          }
        />
        <Tabs defaultValue="upcoming" className="mt-10">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming ({buckets.upcoming.length})</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing ({buckets.ongoing.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({buckets.past.length})</TabsTrigger>
          </TabsList>
          {(["upcoming", "ongoing", "past"] as const).map((bucket) => (
            <TabsContent key={bucket} value={bucket} className="mt-8">
              {buckets[bucket].length ? (
                <AccordionGallery
                  items={buckets[bucket].slice(0, 6).map((event, i) => ({
                    label: event.title,
                    sublabel: `${event.category} · ${formatEventDate(event)}`,
                    to: `/events/${event.slug}`,
                    image: tileBackgrounds[i % tileBackgrounds.length]!,
                    alt: "",
                  }))}
                  defaultIndex={0}
                  accentColor="#ff00ca"
                  height={440}
                  gap={12}
                  radius={18}
                  expandRatio={0.46}
                  grayscale={false}
                  panelBackground="linear-gradient(150deg, #1b0b2e 0%, #2a0f45 45%, #0a0713 100%)"
                  imageOpacity={0.5}
                />

              ) : (
                <p className="surface-card p-8 text-sm text-muted-foreground">
                  Nothing in this state right now. Check the{" "}
                  <Link to="/events" className="text-primary underline underline-offset-4">
                    full event directory
                  </Link>{" "}
                  for everything AIMSA has planned.
                </p>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Impact */}
      <section className="relative isolate overflow-hidden border-y border-border bg-surface/40" aria-labelledby="impact-heading">
        <ArtBackdrop image={bgFor("home:impact")} position="center 55%" />
        <div className="container-aimsa section-y">
          <SectionHeading
            id="impact-heading"
            eyebrow="Impact"
            title="How we intend to be judged"
            intro="AIMSA publishes outcomes with evidence. Until a figure is verified, this site says so instead of showing a number."
          />
          {visibleMetrics.length ? (
            <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {visibleMetrics.map((m) => (
                <div key={m.id} className="surface-card p-6">
                  <dt className="text-sm text-muted-foreground">{m.label}</dt>
                  <dd className="mt-2 font-display text-4xl font-bold text-primary">
                    <StatCounter value={m.value as number} suffix={m.suffix ?? ""} />
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {impactAreas.map((area) => (
              <Tilt className="h-full" key={area.title}><div className="surface-card p-6">
                <h3 className="text-lg font-semibold">{area.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{area.detail}</p>
              </div></Tilt>
            ))}
          </div>
          <Button asChild variant="quiet" className="mt-8">
            <Link to="/achievements">
              See achievements &amp; outcomes <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Why AIMSA — horizontal scroll */}
      <section className="relative py-16 lg:py-0" aria-labelledby="why-heading">
        <div>
          <HorizontalScroller
            heading={
              <SectionHeading
                id="why-heading"
                eyebrow="Why AIMSA"
                title="Built like a lab, not a mailing list"
                intro="Scroll sideways through the principles that shape everything we run."
              />
            }
          >
            {whyPillars.map((pillar, i) => (
              <Tilt className="shrink-0" key={pillar.title}><article
                data-cursor="Read"
                className="surface-card scanlines relative w-[78vw] shrink-0 p-8 sm:w-[26rem] lg:w-[30rem]"
              >
                <span className="font-mono text-xs text-accent">0{i + 1}</span>
                <h3 className="mt-4 font-display text-2xl font-bold sm:text-3xl">{pillar.title}</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">{pillar.detail}</p>
              </article></Tilt>
            ))}
          </HorizontalScroller>
        </div>
      </section>

      {/* Projects teaser */}
      <section className="container-aimsa section-y" aria-labelledby="projects-teaser">
        <Reveal>
          <Tilt className="h-full"><div className="relative isolate overflow-hidden rounded-3xl border border-primary/25 bg-surface p-8 lg:p-14">
            <ArtBackdrop image={bgFor("home:showcase")} position="center 55%" />
            <GridHorizon className="opacity-60" />
            <div className="relative max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {copy("home.projectsTitle")}
              </p>
              <h2 id="projects-teaser" className="mt-4 text-3xl font-bold sm:text-5xl">
                Student builds, in the open
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{copy("home.projectsIntro")}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Magnetic>
                  <Button asChild variant="hero" size="lg" data-cursor="Open">
                    <Link to="/projects">Open the showcase</Link>
                  </Button>
                </Magnetic>
                <Button asChild variant="outline" size="lg">
                  <Link to="/join">Join AIMSA</Link>
                </Button>
              </div>
            </div>
          </div></Tilt>
        </Reveal>
      </section>

      {/* Leadership */}
      <section className="relative isolate overflow-hidden" aria-labelledby="leadership-heading">
        <ArtBackdrop image={bgFor("home:leadership")} position="center 40%" />
        <div className="container-aimsa section-y">
        <SectionHeading
          id="leadership-heading"
          eyebrow="Leadership"
          title={copy("home.teamTitle")}
          intro={copy("home.teamIntro")}
          action={
            <Button asChild variant="quiet">
              <Link to="/team">
                Full team <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          }
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {leadership.map((member) => (
            <li key={member.id} className="surface-card flex items-center gap-4 p-5">
              <span
                className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-primary/10 font-display text-sm font-bold text-primary"
                aria-hidden="true"
              >
                {member.role
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")}
              </span>
              <div>
                <p className="font-semibold">{member.role}</p>
                <p className="text-sm text-muted-foreground">
                  {member.confirmed ? member.name : "To be announced"}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">
          Grouped by function on the{" "}
          <Link to="/team" className="text-primary underline underline-offset-4">
            team page
          </Link>
          , including {teamGroups.length} functional groups.
        </p>
        </div>
      </section>

      {/* Announcements */}
      <section className="container-aimsa pb-4" aria-labelledby="announcements-heading">
        <SectionHeading
          id="announcements-heading"
          eyebrow="Announcements"
          title="Recent updates"
          action={
            <Button asChild variant="quiet">
              <Link to="/announcements">
                All announcements <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          }
        />
        <ul className="mt-8 grid gap-4">
          {activeAnnouncements()
            .slice(0, 3)
            .map((a) => (
              <li key={a.id} className="surface-card flex flex-col gap-3 p-6 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                      {a.category}
                    </span>
                    <time className="text-xs text-muted-foreground" dateTime={a.publishedAt}>
                      {formatDate(a.publishedAt)}
                    </time>
                    {isNewAnnouncement(a) ? (
                      <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent">
                        New
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-2 font-semibold">{a.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{a.summary}</p>
                </div>
                {a.ctaHref?.startsWith("/") ? (
                  <Button asChild variant="quiet" className="sm:shrink-0">
                    <Link to={a.ctaHref}>{a.ctaLabel ?? "Read more"}</Link>
                  </Button>
                ) : null}
              </li>
            ))}
        </ul>
      </section>

      {/* Join CTA */}
      <section className="container-aimsa section-y">
        <Tilt className="h-full">
          <div className="relative h-full overflow-hidden rounded-3xl border border-border bg-surface p-10 text-center shadow-elev-2 lg:p-16">
            <div
              className="grid-backdrop pointer-events-none absolute inset-0 opacity-60"
              aria-hidden="true"
            />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold sm:text-4xl">{copy("home.joinTitle")}</h2>
              <p className="mt-4 text-muted-foreground">{copy("home.joinIntro")}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild variant="hero" size="xl">
                  <Link to="/join">{copy("home.joinCtaLabel")}</Link>
                </Button>
                <Button asChild variant="outline" size="xl">
                  <Link to="/contact">Contact the Team</Link>
                </Button>
              </div>
              <p className="mt-6 text-xs text-muted-foreground">
                Forms collect only what is needed to respond to you. Details stay within the association.
              </p>
            </div>
          </div>
        </Tilt>
      </section>
        </div>
      </div>
    </>
  );
}

function PulseCard({
  icon,
  label,
  title,
  detail,
  to,
  params,
  cta,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  detail: string;
  to: string;
  params?: Record<string, string>;
  cta: string;
}) {
  return (
    <article className="surface-card group relative p-5 transition-colors hover:border-border-strong">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
        {icon}
        {label}
      </p>
      <h3 className="mt-3 font-semibold leading-snug">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
      <Link
        to={to}
        params={params as never}
        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary after:absolute after:inset-0 after:content-['']"
      >
        {cta} <ArrowUpRight className="size-4" aria-hidden="true" />
      </Link>
    </article>
  );
}
