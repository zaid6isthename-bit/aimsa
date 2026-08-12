import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { teamResource } from "@/lib/cms/resource-configs";
import { permissions, useAdmin } from "@/lib/cms/useAdmin";

export const Route = createFileRoute("/admin/team")({
  ssr: false,
  component: Page,
});

function Page() {
  const identity = useAdmin();
  const perms = permissions(identity.role);
  return (
    <ResourceManager
      config={teamResource}
      actorName={identity.profile?.name ?? "Administrator"}
      canEdit={perms.manageContent}
    />
  );
}
