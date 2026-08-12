import { createFileRoute, Link } from "@tanstack/react-router";
import { Tilt } from "@/components/motion/Tilt";
import { Award, FileText, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { EmptyState } from "@/components/site/EmptyState";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { portalResources, portalTracks } from "@/content/portal";
import { ArtBackdrop } from "@/components/site/ArtBackdrop";
import { bgFor } from "@/assets/bg";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Member Portal — Certificates & resources | AIMSA LTCE" },
      {
        name: "description",
        content:
          "The AIMSA member portal: event certificates, workshop resources, mentorship and project team tracking for members at LTCE, Navi Mumbai.",
      },
      { property: "og:title", content: "AIMSA Member Portal" },
      {
        property: "og:description",
        content: "Certificates, session resources and mentorship tracking for AIMSA members.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/portal" },
    ],
    links: [{ rel: "canonical", href: "/portal" }],
  }),
  component: Portal,
});

function Portal() {
  return (
    <>
      <PageHeader
        eyebrow="Members"
        title="The AIMSA member portal"
        intro="One place for your certificates, session material and project track. Member sign-in is being set up with the department — this page documents exactly what will be behind it."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Member Portal" }]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Magnetic>
            <Button variant="hero" size="lg" disabled data-cursor="Soon">
              <Lock aria-hidden="true" /> Member sign-in — coming soon
            </Button>
          </Magnetic>
          <Button asChild variant="outline" size="lg">
            <Link to="/join">Register interest</Link>
          </Button>
        </div>
      </PageHeader>

      <section className="relative isolate overflow-hidden" aria-labelledby="portal-tracks">
        <ArtBackdrop image={bgFor("portal:tracks")} position="center 50%" />
        <div className="container-aimsa section-y">
        <h2 id="portal-tracks" className="text-2xl font-bold sm:text-3xl">
          What the portal will hold
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {portalTracks.map((track, i) => (
            <Reveal key={track.id} delay={i * 0.06}>
              <Tilt className="h-full"><article className="surface-card h-full p-6" data-cursor="Info">
                <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-primary/10 text-primary">
                  {track.id === "certifications" ? (
                    <Award className="size-5" aria-hidden="true" />
                  ) : track.id === "resources" ? (
                    <FileText className="size-5" aria-hidden="true" />
                  ) : (
                    <ShieldCheck className="size-5" aria-hidden="true" />
                  )}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{track.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{track.detail}</p>
              </article></Tilt>
            </Reveal>
          ))}
        </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-y border-border bg-surface/40" aria-labelledby="portal-library">
        <ArtBackdrop image={bgFor("portal:library")} position="center 60%" />
        <div className="container-aimsa section-y">
          <h2 id="portal-library" className="text-2xl font-bold sm:text-3xl">
            Resource library
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Material is published here after each session, once it is cleared for distribution.
          </p>
          <div className="mt-8">
            {portalResources.length ? (
              <ul className="grid gap-4 md:grid-cols-2">
                {portalResources.map((r) => (
                  <Tilt as="li" key={r.id}><div className="surface-card p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{r.kind}</p>
                    <h3 className="mt-2 text-lg font-semibold">{r.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.description}</p>
                    {r.url ? (
                      <a href={r.url} className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
                        Open resource
                      </a>
                    ) : (
                      <p className="mt-3 text-sm text-muted-foreground">Link to be published</p>
                    )}
                  </div></Tilt>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={<FileText className="size-8" aria-hidden="true" />}
                title="No resources published yet"
                description="Slides, notebooks and recordings from AIMSA sessions will be listed here as soon as the first workshops run and the material is approved."
                action={
                  <Button asChild variant="hero">
                    <Link to="/events">See what's scheduled</Link>
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}