import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, FolderGit2, Megaphone, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { permissions, roleLabels, useAdmin } from "@/lib/cms/useAdmin";

export const Route = createFileRoute("/admin/dashboard")({
  ssr: false,
  component: Dashboard,
});

async function countOf(table: string, filters?: Record<string, string>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any).from(table).select("id", { count: "exact", head: true });
  Object.entries(filters ?? {}).forEach(([key, value]) => {
    query = query.eq(key, value);
  });
  const { count } = await query;
  return (count as number | null) ?? 0;
}

function Dashboard() {
  const identity = useAdmin();
  const perms = permissions(identity.role);

  const stats = useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: async () => ({
      events: await countOf("events", { status: "published" }),
      drafts: await countOf("events", { status: "draft" }),
      announcements: await countOf("announcements", { status: "published" }),
      team: await countOf("team_members", { status: "published" }),
      projects: await countOf("projects", { status: "published" }),
    }),
  });

  const activity = useQuery({
    queryKey: ["admin", "recent-activity"],
    queryFn: async () => {
      const { data } = await supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8);
      return data ?? [];
    },
  });

  const cards = [
    { label: "Published events", value: stats.data?.events, icon: CalendarDays, to: "/admin/events" },
    { label: "Announcements", value: stats.data?.announcements, icon: Megaphone, to: "/admin/announcements" },
    { label: "Team members", value: stats.data?.team, icon: Users, to: "/admin/team" },
    { label: "Projects", value: stats.data?.projects, icon: FolderGit2, to: "/admin/projects" },
  ];

  return (
    <>
      <AdminPageHeader
        title={`Welcome, ${identity.profile?.name?.split(" ")[0] ?? "Admin"}`}
        description={`Signed in as ${identity.role ? roleLabels[identity.role] : "administrator"}. Everything you publish here updates the public website.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
          >
            <card.icon className="size-5 text-primary" aria-hidden="true" />
            <p className="mt-4 text-3xl font-bold text-foreground">
              {stats.isLoading ? "—" : (card.value ?? 0)}
            </p>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </Link>
        ))}
      </div>

      {perms.manageEvents && (stats.data?.drafts ?? 0) > 0 ? (
        <p className="mt-4 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          You have {stats.data?.drafts} event draft(s) waiting to be published.
        </p>
      ) : null}

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Recent activity</h2>
        <div className="rounded-xl border border-border bg-card">
          {activity.isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Loading…</p>
          ) : (activity.data ?? []).length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No activity recorded yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {(activity.data ?? []).map((entry) => (
                <li key={entry.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm">
                  <span>
                    <strong className="font-medium">{entry.actor_name}</strong> {entry.action} {entry.entity}
                    {entry.entity_label ? ` — ${entry.entity_label}` : ""}
                  </span>
                  <time className="text-xs text-muted-foreground" dateTime={entry.created_at}>
                    {new Date(entry.created_at).toLocaleString()}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}