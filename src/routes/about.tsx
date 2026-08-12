import { createFileRoute, Link } from "@tanstack/react-router";
import { Tilt } from "@/components/motion/Tilt";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionHeading } from "@/components/site/SectionHeading";
import { copy, copyPairs, copyList } from "@/lib/cms/store";
import aboutBridge from "@/assets/about-bridge.webp.asset.json";
import aboutWordmark from "@/assets/about-wordmark.png.asset.json";
import { ArtBackdrop } from "@/components/site/ArtBackdrop";
import { bgFor } from "@/assets/bg";
import artSkatepark from "@/assets/tiles/tile-1.jpg.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About AIMSA — mission, vision and objectives | LTCE" },
      {
        name: "description",
        content:
          "What AIMSA is, why it exists, and how the AI & ML Students Association at LTCE Navi Mumbai turns coursework into applied practice.",
      },
      { property: "og:title", content: "About AIMSA — LTCE Navi Mumbai" },
      {
        property: "og:description",
        content: "Mission, vision, objectives and operating values of the AI & ML Students Association at LTCE.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const objectives = copyPairs("about.objectives");
  const values = copyPairs("about.values");
  return (
    <>
      <PageHeader
        eyebrow={copy("about.eyebrow")}
        title={copy("about.title")}
        intro={copy("about.intro")}
        breadcrumb={[{ label: "Home", to: "/" }, { label: "About" }]}
      />

      <section className="relative isolate overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <img
            src={aboutBridge.url}
            alt=""
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={aboutWordmark.url}
              alt=""
              className="w-[70%] max-w-3xl object-contain opacity-35 mix-blend-screen"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/55 to-background" />
        </div>
        <div className="container-aimsa section-y">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            <h2 className="text-3xl font-bold text-foreground">{copy("about.whoTitle")}</h2>
            {copyList("about.who").map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
          <div className="grid gap-4 self-start">
            <Tilt className="h-full"><div className="surface-card p-7">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Mission</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{copy("about.mission")}</p>
            </div></Tilt>
            <Tilt className="h-full"><div className="surface-card p-7">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Vision</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{copy("about.vision")}</p>
            </div></Tilt>
            <Tilt className="h-full"><div className="surface-card p-7">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Tagline</h2>
              <p className="mt-3 font-display text-2xl font-bold">{copy("global.tagline")}</p>
            </div></Tilt>
          </div>
        </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-y border-border bg-surface/40">
        <ArtBackdrop image={artSkatepark.url} opacity={0.8} />
        <div className="container-aimsa section-y">
          <SectionHeading
            eyebrow="Objectives"
            title={copy("about.objectivesTitle")}
            intro={copy("about.objectivesIntro")}
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {objectives.map((o, i) => (
              <Tilt className="h-full" key={o.title}><article className="surface-card p-6">
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                <h3 className="mt-3 text-lg font-semibold">{o.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{o.detail}</p>
              </article></Tilt>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden">
        <ArtBackdrop image={bgFor("about:values")} position="center 45%" />
        <div className="container-aimsa section-y">
        <SectionHeading eyebrow="Values" title={copy("about.valuesTitle")} />
        <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
          {values.map(({ title, detail }) => (
            <div key={title} className="bg-surface p-7">
              <dt className="text-lg font-semibold">{title}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{detail}</dd>
            </div>
          ))}
        </dl>
        </div>
      </section>

      <section className="relative isolate overflow-hidden">
        <ArtBackdrop image={bgFor("about:cta")} position="center 60%" />
        <div className="container-aimsa pb-24 pt-10">
        <div className="surface-card flex flex-col items-start gap-5 p-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">{copy("about.ctaTitle")}</h2>
            <p className="mt-2 text-muted-foreground">{copy("about.ctaText")}</p>
          </div>
          <Button asChild variant="hero" size="lg">
            <Link to="/join">
              Join AIMSA <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
        </div>
      </section>
    </>
  );
}
