import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { uploadMedia } from "@/components/admin/MediaUpload";
import { permissions, useAdmin } from "@/lib/cms/useAdmin";

export const Route = createFileRoute("/admin/media")({ ssr: false, component: MediaLibrary });

function MediaLibrary() {
  const identity = useAdmin();
  const perms = permissions(identity.role);
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);

  const assets = useQuery({
    queryKey: ["admin", "media"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media_assets")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  const remove = useMutation({
    mutationFn: async (asset: { id: string; path: string }) => {
      await supabase.storage.from("media").remove([asset.path]);
      const { error } = await supabase.from("media_assets").delete().eq("id", asset.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("File deleted");
      void queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) await uploadMedia(file, "library");
      toast.success("Upload complete");
      void queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const rows = (assets.data ?? []).filter((a) =>
    a.file_name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <>
      <AdminPageHeader
        title="Media library"
        description="Images and documents used across the website. Copy a URL to reuse a file anywhere."
        actions={
          perms.manageMedia ? (
            <Button disabled={busy} onClick={() => inputRef.current?.click()}>
              <Upload className="size-4" aria-hidden="true" /> {busy ? "Uploading…" : "Upload files"}
            </Button>
          ) : null
        }
      />
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        accept="image/*,application/pdf"
        onChange={(e) => void handleFiles(e.target.files)}
      />

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search files"
        className="mb-5 max-w-sm"
        aria-label="Search files"
      />

      {assets.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
          No files uploaded yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {rows.map((asset) => (
            <figure key={asset.id} className="overflow-hidden rounded-xl border border-border bg-card">
              {asset.mime_type?.startsWith("image/") ? (
                <img src={asset.url} alt={asset.file_name} loading="lazy" className="h-36 w-full object-cover" />
              ) : (
                <div className="grid h-36 place-items-center text-xs text-muted-foreground">Document</div>
              )}
              <figcaption className="space-y-2 p-3">
                <p className="truncate text-xs font-medium" title={asset.file_name}>{asset.file_name}</p>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      void navigator.clipboard.writeText(asset.url);
                      toast.success("URL copied");
                    }}
                  >
                    <Copy className="size-3.5" aria-hidden="true" /> Copy URL
                  </Button>
                  {perms.manageMedia ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete file"
                      onClick={() => remove.mutate({ id: asset.id, path: asset.path })}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  ) : null}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </>
  );
}