import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionHeading } from "@/components/site/SectionHeading";
import { InquiryForm } from "@/components/site/InquiryForm";
import { joinFaqs } from "@/content/faqs";
import { ArtBackdrop } from "@/components/site/ArtBackdrop";
import artBeach from "@/assets/tiles/tile-5.jpg.asset.json";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join AIMSA — membership for LTCE students" },
      {
        name: "description",
        content:
          "Register your interest in AIMSA, the AI & ML Students Association at LTCE Navi Mumbai. Open to every branch and year, no entrance test.",
      },
      { property: "og:title", content: "Join AIMSA at LTCE Navi Mumbai" },
      {
        property: "og:description",
        content: "Membership is open to all LTCE students. Register your interest and attend orientation.",
      },
    ],
  }),
  component: JoinPage,
});

const steps = [
  { title: "Register interest", detail: "Submit the form below with your branch, year and what you want to work on." },
  { title: "Attend orientation", detail: "A short session covering how AIMSA runs and what each functional team does." },
  { title: "Pick a team", detail: "Choose technical, events, design or outreach based on where you want to contribute." },
  { title: "Start building", detail: "Join the next workshop or project cycle and ship something in your first term." },
];

function JoinPage() {
  return (
    <>
      <PageHeader
        eyebrow="Join"
        title="Membership is open to every LTCE student"
        intro="No entrance test, no branch requirement, no prior machine-learning experience. Register your interest and the core team will contact you about orientation."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Join" }]}
      />

      <div className="container-aimsa section-y grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="text-2xl font-bold">How joining works</h2>
          <ol className="mt-6 space-y-4">
            {steps.map((s, i) => (
              <li key={s.title} className="surface-card flex gap-4 p-5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 font-mono text-sm font-semibold text-primary">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="surface-card p-7 sm:p-9">
          <h2 className="text-2xl font-bold">Interest form</h2>
          <p className="mt-2 text-sm text-muted-foreground">Fields marked with an asterisk are required.</p>
          <div className="mt-6">
            <InquiryForm kind="join" />
          </div>
        </div>
      </div>

      <section className="relative isolate overflow-hidden border-t border-border bg-surface/40">
        <ArtBackdrop image={artBeach.url} opacity={0.8} position="center 60%" />
        <div className="container-aimsa section-y">
          <SectionHeading eyebrow="FAQ" title="Common questions" />
          <dl className="mt-8 grid gap-4 md:grid-cols-2">
            {joinFaqs.map((f) => (
              <div key={f.question} className="surface-card p-6">
                <dt className="font-semibold">{f.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
