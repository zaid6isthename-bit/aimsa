import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { AlbumPhotos } from "@/components/admin/AlbumPhotos";
import { galleryResource } from "@/lib/cms/resource-configs";
import { permissions, useAdmin } from "@/lib/cms/useAdmin";

export const Route = createFileRoute("/admin/gallery")({
  ssr: false,
  component: Page,
});

function Page() {
  const identity = useAdmin();
  const perms = permissions(identity.role);
  return (
    <>
      <ResourceManager
        config={galleryResource}
        actorName={identity.profile?.name ?? "Administrator"}
        canEdit={perms.manageEvents}
      />
      <AlbumPhotos canEdit={perms.manageEvents} />
    </>
  );
}
