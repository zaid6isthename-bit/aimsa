import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Linkedin, Mail, MapPin } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { InquiryForm } from "@/components/site/InquiryForm";
import { site } from "@/content/site";
import { ArtBackdrop } from "@/components/site/ArtBackdrop";
import artDock from "@/assets/tiles/tile-3.jpg.asset.json";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact AIMSA — AI & ML Students Association, LTCE" },
      {
        name: "description",
        content:
          "Reach the AIMSA core team at LTCE Navi Mumbai for collaborations, speaking proposals, sponsorship or general queries.",
      },
      { property: "og:title", content: "Contact AIMSA" },
      {
        property: "og:description",
        content: "Get in touch with the AI & ML Students Association at LTCE Navi Mumbai.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to the AIMSA core team"
        intro="Collaboration proposals, speaking offers, sponsorship enquiries or a simple question — send it here and the core team will route it to the right person."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Contact" }]}
      />

      <div className="relative isolate overflow-hidden">
        <ArtBackdrop image={artDock.url} opacity={0.8} position="center 60%" />
        <div className="container-aimsa section-y grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          <div className="surface-card p-7">
            <h2 className="text-lg font-semibold">Where to find us</h2>
            <ul className="mt-4 space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                <span>
                  {site.contact.department}
                  <br />
                  {site.college}
                  <br />
                  {site.contact.address}
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                <span>
                  {site.contact.email ? (
                    <a href={`mailto:${site.contact.email}`} className="text-primary hover:underline">
                      {site.contact.email}
                    </a>
                  ) : (
                    <span className="italic">Official email to be announced</span>
                  )}
                </span>
              </li>
              {site.socials.length ? (
                site.socials.map((s) => (
                  <li key={s.href} className="flex gap-3">
                    <Linkedin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                    <a href={s.href} className="text-primary hover:underline">
                      {s.label}
                    </a>
                  </li>
                ))
              ) : (
                <li className="flex gap-3">
                  <Instagram className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                  <span className="italic">Official social channels to be announced</span>
                </li>
              )}
            </ul>
          </div>
          <div className="surface-card p-7">
            <h2 className="text-lg font-semibold">Response time</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Messages are reviewed by the core team during term. Expect a reply within a few working days;
              time-sensitive event queries are prioritised.
            </p>
          </div>
        </div>

        <div className="surface-card p-7 sm:p-9">
          <h2 className="text-2xl font-bold">Send a message</h2>
          <p className="mt-2 text-sm text-muted-foreground">Fields marked with an asterisk are required.</p>
          <div className="mt-6">
            <InquiryForm kind="contact" />
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
