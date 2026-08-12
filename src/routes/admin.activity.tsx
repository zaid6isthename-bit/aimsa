import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { AdminPageHeader } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/activity")({ ssr: false, component: ActivityPage });

function ActivityPage() {
  const [search, setSearch] = useState("");

  const log = useQuery({
    queryKey: ["admin", "activity_log"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  const rows = (log.data ?? []).filter((entry) =>
    `${entry.actor_name} ${entry.action} ${entry.entity} ${entry.entity_label ?? ""}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  return (
    <>
      <AdminPageHeader
        title="Activity log"
        description="Every create, update and delete performed in the admin portal."
      />
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search activity"
        className="mb-5 max-w-sm"
        aria-label="Search activity"
      />
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {log.isLoading ? (
          <p className="p-8 text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="p-8 text-sm text-muted-foreground">No activity recorded yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((entry) => (
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
    </>
  );
}