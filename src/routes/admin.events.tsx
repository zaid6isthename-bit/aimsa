import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { eventsResource } from "@/lib/cms/resource-configs";
import { permissions, useAdmin } from "@/lib/cms/useAdmin";

export const Route = createFileRoute("/admin/events")({
  ssr: false,
  component: Page,
});

function Page() {
  const identity = useAdmin();
  const perms = permissions(identity.role);
  return (
    <ResourceManager
      config={eventsResource}
      actorName={identity.profile?.name ?? "Administrator"}
      canEdit={perms.manageEvents}
    />
  );
}
