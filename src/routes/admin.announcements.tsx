import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { announcementsResource } from "@/lib/cms/resource-configs";
import { permissions, useAdmin } from "@/lib/cms/useAdmin";

export const Route = createFileRoute("/admin/announcements")({
  ssr: false,
  component: Page,
});

function Page() {
  const identity = useAdmin();
  const perms = permissions(identity.role);
  return (
    <ResourceManager
      config={announcementsResource}
      actorName={identity.profile?.name ?? "Administrator"}
      canEdit={perms.manageContent}
    />
  );
}
