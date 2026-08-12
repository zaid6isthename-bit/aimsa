import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function mediaUrl(path: string) {
  return `/api/public/media/${path}`;
}

/** Uploads a file to the media bucket, registers it in the media library and returns its public URL. */
export async function uploadMedia(file: File, category = "general"): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const path = `${category}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const url = mediaUrl(path);
  const { data: userData } = await supabase.auth.getUser();
  await supabase.from("media_assets").insert({
    path,
    url,
    file_name: file.name,
    mime_type: file.type,
    size_bytes: file.size,
    category,
    uploaded_by: userData.user?.id ?? null,
  });
  return url;
}

interface ImageFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  category?: string;
}

export function ImageField({ value, onChange, label, category = "general" }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadMedia(file, category));
      toast.success("File uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste a URL or upload a file"
          aria-label={label}
        />
        <Button type="button" variant="outline" disabled={busy} onClick={() => inputRef.current?.click()}>
          <Upload className="size-4" aria-hidden="true" />
          {busy ? "Uploading…" : "Upload"}
        </Button>
        {value ? (
          <Button type="button" variant="ghost" size="icon" onClick={() => onChange("")} aria-label="Clear">
            <X className="size-4" />
          </Button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />
      {value ? (
        <img
          src={value}
          alt=""
          className="h-24 w-auto rounded-md border border-border object-cover"
          loading="lazy"
        />
      ) : null}
    </div>
  );
}