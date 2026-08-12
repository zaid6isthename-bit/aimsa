import { createFileRoute, Link } from "@tanstack/react-router";
import { Tilt } from "@/components/motion/Tilt";
import { Award, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionHeading } from "@/components/site/SectionHeading";
import { EmptyState } from "@/components/site/EmptyState";
import { impactAreas as seedImpactAreas, metrics } from "@/content/achievements";
import { cmsAchievements, copy, copyPairs } from "@/lib/cms/store";
import { publishedEvents } from "@/lib/content";
import { ArtBackdrop } from "@/components/site/ArtBackdrop";
import artSwamp from "@/assets/tiles/tile-2.png.asset.json";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements & impact — AIMSA | LTCE Navi Mumbai" },
      {
        name: "description",
        content:
          "Verified outcomes, milestones and impact areas of AIMSA, the AI & ML Students Association at LTCE Navi Mumbai.",
      },
      { property: "og:title", content: "AIMSA achievements and impact" },
      {
        property: "og:description",
        content: "Evidence-backed outcomes from the AI & ML Students Association at LTCE Navi Mumbai.",
      },
    ],
  }),
  component: AchievementsPage,
});

function AchievementsPage() {
  const achievements = cmsAchievements();
  const editedImpact = copyPairs("achievements.impactAreas");
  const impactAreas = editedImpact.length ? editedImpact : seedImpactAreas;
  const editedMetrics = copyPairs("achievements.metrics");
  const visibleMetrics = editedMetrics.length
    ? editedMetrics.map((m, i) => ({ id: `metric-${i}`, label: m.detail, value: m.title, suffix: "" }))
    : metrics
        .filter((m) => typeof m.value === "number")
        .map((m) => ({ id: m.id, label: m.label, value: String(m.value), suffix: m.suffix ?? "" }));
  const years = [...new Set(achievements.map((a) => a.year))].sort((a, b) => b.localeCompare(a));

  return (
    <>
      <PageHeader
        eyebrow={copy("achievements.eyebrow")}
        title={copy("achievements.title")}
        intro={copy("achievements.intro")}
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Achievements" }]}
      />

      <div className="container-aimsa section-y space-y-16">
        {visibleMetrics.length ? (
          <section aria-labelledby="metrics-heading">
            <h2 id="metrics-heading" className="sr-only">
              Verified metrics
            </h2>
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {visibleMetrics.map((m) => (
                <Tilt className="h-full" key={m.id}><div className="surface-card p-6">
                  <dt className="text-sm text-muted-foreground">{m.label}</dt>
                  <dd className="mt-2 font-display text-4xl font-bold text-primary">
                    {m.value}
                    {m.suffix}
                  </dd>
                </div></Tilt>
              ))}
            </dl>
          </section>
        ) : null}

        <section aria-labelledby="record-heading">
          <SectionHeading
            id="record-heading"
            eyebrow="Record"
            title={years.length ? "Achievement timeline" : "The record starts here"}
          />
          <div className="mt-8">
            {achievements.length ? (
              <div className="space-y-12">
                {years.map((year) => (
                  <div key={year}>
                    <h3 className="font-display text-xl font-bold text-accent">{year}</h3>
                    <ul className="mt-4 grid gap-4 md:grid-cols-2">
                      {achievements
                        .filter((a) => a.year === year)
                        .map((a) => (
                          <Tilt as="li" key={a.id}><div className="surface-card p-6">
                            <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                              {a.category}
                            </span>
                            <h4 className="mt-3 text-lg font-semibold">{a.title}</h4>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.context}</p>
                            <p className="mt-3 text-sm">
                              <span className="font-semibold">Outcome: </span>
                              <span className="text-muted-foreground">{a.outcome}</span>
                            </p>
                            {a.contributors?.length ? (
                              <p className="mt-2 text-sm text-muted-foreground">
                                Contributors: {a.contributors.join(", ")}
                              </p>
                            ) : null}
                            <div className="mt-4 flex flex-wrap gap-4 text-sm">
                              {a.evidenceUrl ? (
                                <a
                                  href={a.evidenceUrl}
                                  className="inline-flex items-center gap-1 text-primary hover:underline"
                                >
                                  Evidence <ExternalLink className="size-3.5" aria-hidden="true" />
                                </a>
                              ) : null}
                              {a.relatedEventSlug && publishedEvents().some((e) => e.slug === a.relatedEventSlug) ? (
                                <Link
                                  to="/events/$slug"
                                  params={{ slug: a.relatedEventSlug }}
                                  className="text-primary hover:underline"
                                >
                                  Related event
                                </Link>
                              ) : null}
                            </div>
                          </div></Tilt>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Award className="size-8" aria-hidden="true" />}
                title="No verified achievements published yet"
                description={copy("achievements.emptyText")}
                action={
                  <Button asChild variant="hero">
                    <Link to="/events">See what is planned</Link>
                  </Button>
                }
              />
            )}
          </div>
        </section>

        <section
          aria-labelledby="impact-heading"
          className="relative isolate overflow-hidden rounded-3xl px-4 py-10 sm:px-8"
        >
          <ArtBackdrop image={artSwamp.url} opacity={0.8} position="center 55%" />
          <SectionHeading
            id="impact-heading"
            eyebrow="Impact areas"
            title={copy("achievements.impactTitle")}
            intro="Qualitative commitments that guide how every AIMSA activity is planned and reviewed."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {impactAreas.map((area) => (
              <Tilt className="h-full" key={area.title}><article className="surface-card p-6">
                <h3 className="text-lg font-semibold">{area.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{area.detail}</p>
              </article></Tilt>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
