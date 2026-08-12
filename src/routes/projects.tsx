import { useMemo, useState } from "react";
import { Tilt } from "@/components/motion/Tilt";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Boxes, Github, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { EmptyState } from "@/components/site/EmptyState";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { projectDomains, projectStages, publishedProjects } from "@/content/projects";
import { site } from "@/content/site";
import { copy } from "@/lib/cms/store";
import { ArtBackdrop } from "@/components/site/ArtBackdrop";
import artTruck from "@/assets/art-truck.jpg.asset.json";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Student AI & ML builds | AIMSA LTCE" },
      {
        name: "description",
        content:
          "The AIMSA project showcase: machine learning, computer vision, NLP and generative AI systems built by students at Lokmanya Tilak College of Engineering.",
      },
      { property: "og:title", content: "AIMSA Projects — Student AI & ML builds" },
      {
        property: "og:description",
        content: "Filterable showcase of AI and ML projects built by AIMSA members at LTCE, Navi Mumbai.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/projects" },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "AIMSA Projects",
          isPartOf: { "@type": "WebSite", name: site.fullName, url: site.url },
        }),
      },
    ],
  }),
  component: Projects,
});

function Projects() {
  const all = publishedProjects();
  const [domain, setDomain] = useState<string>("All");
  const [stage, setStage] = useState<string>("All");

  const filtered = useMemo(
    () =>
      all.filter(
        (p) => (domain === "All" || p.domain === domain) && (stage === "All" || p.stage === stage),
      ),
    [all, domain, stage],
  );

  return (
    <>
      <PageHeader
        eyebrow={copy("projects.eyebrow")}
        title={copy("projects.title")}
        intro={copy("projects.intro")}
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Projects" }]}
      >
        <Magnetic>
          <Button asChild variant="hero" size="lg" data-cursor="Submit">
            <Link to="/contact">Submit a project</Link>
          </Button>
        </Magnetic>
      </PageHeader>

      <section
        className="relative isolate overflow-hidden container-aimsa section-y"
        aria-labelledby="projects-heading"
      >
        <ArtBackdrop image={artTruck.url} opacity={0.8} position="center 40%" />
        <h2 id="projects-heading" className="sr-only">
          Project directory
        </h2>

        <div className="flex flex-wrap gap-6">
          <FilterRow label="Domain" value={domain} onChange={setDomain} options={[...projectDomains]} />
          <FilterRow label="Stage" value={stage} onChange={setStage} options={[...projectStages]} />
        </div>

        <div className="mt-10">
          {filtered.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.04}>
                  <Tilt className="h-full"><article
                    className="surface-card group relative flex h-full flex-col gap-4 p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-elev-2"
                    data-cursor="View"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full border border-primary/40 px-2.5 py-1 text-primary">
                        {p.domain}
                      </span>
                      <span className="rounded-full border border-border px-2.5 py-1">{p.stage}</span>
                      <span className="rounded-full border border-border px-2.5 py-1">{p.year}</span>
                    </div>
                    <h3 className="text-xl font-semibold leading-snug">{p.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{p.summary}</p>
                    <ul className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                      {p.stack.map((s) => (
                        <li key={s} className="rounded-md bg-secondary px-2 py-1">
                          {s}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex flex-wrap gap-4 text-sm font-semibold">
                      {p.repoUrl ? (
                        <a href={p.repoUrl} className="inline-flex items-center gap-1 text-primary hover:underline">
                          <Github className="size-4" aria-hidden="true" /> Code
                        </a>
                      ) : null}
                      {p.demoUrl ? (
                        <a href={p.demoUrl} className="inline-flex items-center gap-1 text-primary hover:underline">
                          <Rocket className="size-4" aria-hidden="true" /> Demo
                        </a>
                      ) : null}
                      {p.writeupUrl ? (
                        <a
                          href={p.writeupUrl}
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          <ArrowUpRight className="size-4" aria-hidden="true" /> Write-up
                        </a>
                      ) : null}
                    </div>
                  </article></Tilt>
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Boxes className="size-8" aria-hidden="true" />}
              title={all.length ? "No projects match these filters" : "The showcase opens with the first cohort"}
              description={
                all.length
                  ? "Try a different domain or stage."
                  : copy("projects.emptyText")
              }
              action={
                <Button asChild variant="hero">
                  <Link to="/join">Build with AIMSA</Link>
                </Button>
              }
            />
          )}
        </div>
      </section>
    </>
  );
}

function FilterRow({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {["All", ...options].map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              value === opt
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}