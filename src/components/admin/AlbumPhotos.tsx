import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadMedia } from "./MediaUpload";

export function AlbumPhotos({ canEdit }: { canEdit: boolean }) {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [albumId, setAlbumId] = useState("");
  const [busy, setBusy] = useState(false);

  const albums = useQuery({
    queryKey: ["admin", "gallery_albums"],
    queryFn: async () => {
      const { data } = await supabase.from("gallery_albums").select("id, title").order("title");
      return data ?? [];
    },
  });

  const images = useQuery({
    queryKey: ["admin", "gallery_images", albumId],
    enabled: Boolean(albumId),
    queryFn: async () => {
      const { data } = await supabase
        .from("gallery_images")
        .select("*")
        .eq("album_id", albumId)
        .order("sort_order", { ascending: true });
      return data ?? [];
    },
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin", "gallery_images", albumId] });

  const updateAlt = useMutation({
    mutationFn: async ({ id, alt }: { id: string; alt: string }) => {
      const { error } = await supabase.from("gallery_images").update({ alt_text: alt }).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => toast.success("Caption saved"),
    onError: (e: Error) => toast.error(e.message),
  });

  const removeImage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gallery_images").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Photo removed");
      void invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length || !albumId) return;
    setBusy(true);
    try {
      let order = images.data?.length ?? 0;
      for (const file of Array.from(files)) {
        const url = await uploadMedia(file, "gallery");
        await supabase.from("gallery_images").insert({
          album_id: albumId,
          url,
          alt_text: file.name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]/g, " "),
          sort_order: order++,
        });
      }
      toast.success("Photos added");
      void invalidate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold text-foreground">Album photos</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Choose an album, then upload photos. Alt text is required for accessibility.
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div>
          <Label className="mb-2 block">Album</Label>
          <Select value={albumId} onValueChange={setAlbumId}>
            <SelectTrigger className="w-72"><SelectValue placeholder="Select an album" /></SelectTrigger>
            <SelectContent>
              {(albums.data ?? []).map((a) => (
                <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {canEdit ? (
          <Button disabled={!albumId || busy} onClick={() => inputRef.current?.click()}>
            <Upload className="size-4" aria-hidden="true" /> {busy ? "Uploading…" : "Add photos"}
          </Button>
        ) : null}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </div>

      {albumId ? (
        images.isLoading ? (
          <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
        ) : (images.data ?? []).length === 0 ? (
          <p className="mt-6 rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            This album has no photos yet.
          </p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {(images.data ?? []).map((image) => (
              <figure key={image.id} className="overflow-hidden rounded-xl border border-border bg-card">
                <img src={image.url} alt={image.alt_text} loading="lazy" className="h-36 w-full object-cover" />
                <figcaption className="space-y-2 p-3">
                  <Input
                    defaultValue={image.alt_text}
                    aria-label="Alt text"
                    onBlur={(e) => {
                      if (canEdit && e.target.value !== image.alt_text) {
                        updateAlt.mutate({ id: image.id, alt: e.target.value });
                      }
                    }}
                  />
                  {canEdit ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImage.mutate(image.id)}
                    >
                      <Trash2 className="size-4 text-destructive" aria-hidden="true" /> Remove
                    </Button>
                  ) : null}
                </figcaption>
              </figure>
            ))}
          </div>
        )
      ) : null}
    </section>
  );
}