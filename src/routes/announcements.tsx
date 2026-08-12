import { createFileRoute, Link } from "@tanstack/react-router";
import { Tilt } from "@/components/motion/Tilt";
import { Bell, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { EmptyState } from "@/components/site/EmptyState";
import { activeAnnouncements, formatDate, isNewAnnouncement } from "@/lib/content";
import { copy } from "@/lib/cms/store";
import { ArtBackdrop } from "@/components/site/ArtBackdrop";
import { bgFor } from "@/assets/bg";

export const Route = createFileRoute("/announcements")({
  head: () => ({
    meta: [
      { title: "Announcements & notices — AIMSA | LTCE Navi Mumbai" },
      {
        name: "description",
        content:
          "Official notices, registration windows and updates from AIMSA, the AI & ML Students Association at LTCE Navi Mumbai.",
      },
      { property: "og:title", content: "AIMSA announcements" },
      { property: "og:description", content: "Notices, registration windows and updates from AIMSA at LTCE." },
    ],
  }),
  component: AnnouncementsPage,
});

function AnnouncementsPage() {
  const items = activeAnnouncements();

  return (
    <>
      <PageHeader
        eyebrow={copy("announcements.eyebrow")}
        title={copy("announcements.title")}
        intro={copy("announcements.intro")}
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Announcements" }]}
      />

      <div className="relative isolate overflow-hidden">
      <ArtBackdrop image={bgFor("announcements:list")} position="center 50%" />
      <div className="container-aimsa section-y">
        {items.length === 0 ? (
          <EmptyState
            icon={<Bell className="size-8" aria-hidden="true" />}
            title="No active announcements"
            description={copy("announcements.emptyText")}
            action={
              <Button asChild variant="hero">
                <Link to="/events">Browse events</Link>
              </Button>
            }
          />
        ) : (
          <ol className="space-y-5">
            {items.map((a) => (
              <Tilt as="li" key={a.id}><div className="surface-card p-7">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">
                    {a.category}
                  </span>
                  {a.pinned ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 font-semibold text-accent">
                      <Pin className="size-3" aria-hidden="true" /> Pinned
                    </span>
                  ) : null}
                  {isNewAnnouncement(a) ? (
                    <span className="rounded-full bg-primary/15 px-2.5 py-1 font-semibold text-primary">New</span>
                  ) : null}
                  <time dateTime={a.publishedAt} className="text-muted-foreground">
                    {formatDate(a.publishedAt)}
                  </time>
                </div>
                <h2 className="mt-3 text-xl font-semibold">{a.title}</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">{a.summary}</p>
                {a.body?.length ? (
                  <div className="mt-4 space-y-3 border-l-2 border-border pl-4 text-sm leading-relaxed text-muted-foreground">
                    {a.body.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                ) : null}
                {a.ctaLabel && a.ctaHref ? (
                  <div className="mt-5">
                    <Button asChild variant="quiet" size="sm">
                      <Link to={a.ctaHref}>{a.ctaLabel}</Link>
                    </Button>
                  </div>
                ) : null}
              </div></Tilt>
            ))}
          </ol>
        )}
      </div>
      </div>
    </>
  );
}
