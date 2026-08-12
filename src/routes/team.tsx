import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import ProfileCard from "@/components/motion/ProfileCard";
import ChromaSpotlight from "@/components/motion/ChromaSpotlight";
import { currentAcademicYear, team, teamGroups } from "@/content/team";
import { ArtBackdrop } from "@/components/site/ArtBackdrop";
import artHotel from "@/assets/tiles/tile-4.jpg.asset.json";
import { bgFor } from "@/assets/bg";
import iconPattern from "@/assets/aimsa-icon-pattern.png.asset.json";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — AIMSA office bearers and faculty coordinators | LTCE" },
      {
        name: "description",
        content:
          "Faculty coordinators, office bearers and functional teams of the AI & ML Students Association at LTCE Navi Mumbai.",
      },
      { property: "og:title", content: "The AIMSA team" },
      {
        property: "og:description",
        content: "Faculty coordinators, office bearers, technical, events and design teams at AIMSA, LTCE.",
      },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  return (
    <>
      <PageHeader
        eyebrow={`Academic year ${currentAcademicYear}`}
        title="The people behind AIMSA"
        intro="AIMSA is run by student office bearers and functional teams, with departmental faculty coordinators providing oversight. Names are published here as the department confirms each appointment."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Team" }]}
      />

      <div className="container-aimsa section-y space-y-16">
        {teamGroups.map((group) => {
          const members = team.filter((m) => m.group === group.id);
          if (!members.length) return null;
          return (
            <section key={group.id} aria-labelledby={`group-${group.id}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 id={`group-${group.id}`} className="text-2xl font-bold">
                  {group.label}
                </h2>
                <p className="text-sm text-muted-foreground">{group.blurb}</p>
              </div>
              <div className="trace-divider my-6" />
              <ChromaSpotlight>
              <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((member) => {
                  const label = member.confirmed ? member.name : "To be announced";
                  const photo = member.photo ?? bgFor(`member:${member.id}`);
                  return (
                    <li key={member.id} className="h-full">
                      <ProfileCard
                        avatarUrl={photo}
                        miniAvatarUrl={photo}
                        name={label}
                        title={member.role}
                        handle={member.id}
                        status={member.academicYear}
                        iconUrl={iconPattern.url}
                        contactText={member.linkedin ? "LinkedIn" : "Contact"}
                        behindGlowColor="rgba(255, 0, 202, 0.28)"
                        behindGlowSize="42%"
                        innerGradient="linear-gradient(145deg,#2a1250cc 0%,#0b2a4a88 100%)"
                        onContactClick={() => {
                          if (member.linkedin) window.open(member.linkedin, "_blank", "noopener,noreferrer");
                          else window.location.assign("/contact");
                        }}
                      />
                    </li>
                  );
                })}
              </ul>
              </ChromaSpotlight>
            </section>
          );
        })}

        <section className="surface-card relative isolate flex flex-col items-start gap-5 overflow-hidden p-10 sm:flex-row sm:items-center sm:justify-between">
          <ArtBackdrop image={artHotel.url} opacity={0.8} position="center 45%" />
          <div>
            <h2 className="text-2xl font-bold">Want a role on one of these teams?</h2>
            <p className="mt-2 text-muted-foreground">
              Functional teams take new members after orientation each year.
            </p>
          </div>
          <Button asChild variant="hero" size="lg">
            <Link to="/join">Register your interest</Link>
          </Button>
        </section>
      </div>
    </>
  );
}
