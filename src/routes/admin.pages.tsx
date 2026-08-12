import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { permissions, useAdmin } from "@/lib/cms/useAdmin";
import { logActivity } from "@/lib/cms/activity";

export const Route = createFileRoute("/admin/pages")({ ssr: false, component: SiteContentPage });

interface SettingField {
  key: string;
  label: string;
  type: "text" | "textarea";
  help?: string;
}

const groups: { title: string; fields: SettingField[] }[] = [
  {
    title: "Home page",
    fields: [
      { key: "home_tagline", label: "Hero tagline", type: "text" },
      { key: "home_intro", label: "Hero description", type: "textarea" },
      { key: "home_cta_label", label: "Primary button label", type: "text" },
      { key: "home_cta_href", label: "Primary button link", type: "text" },
    ],
  },
  {
    title: "About page",
    fields: [
      { key: "about_mission", label: "Mission", type: "textarea" },
      { key: "about_vision", label: "Vision", type: "textarea" },
      { key: "about_history", label: "History", type: "textarea" },
    ],
  },
  {
    title: "Contact details",
    fields: [
      { key: "contact_email", label: "Email address", type: "text" },
      { key: "contact_phone", label: "Phone", type: "text" },
      { key: "contact_address", label: "Address", type: "textarea" },
      { key: "contact_map_url", label: "Map embed URL", type: "text" },
      { key: "social_instagram", label: "Instagram URL", type: "text" },
      { key: "social_linkedin", label: "LinkedIn URL", type: "text" },
      { key: "social_github", label: "GitHub URL", type: "text" },
    ],
  },
  {
    title: "Site-wide banner",
    fields: [
      { key: "banner_text", label: "Banner message", type: "text", help: "Leave empty to hide the banner." },
      { key: "banner_href", label: "Banner link", type: "text" },
    ],
  },
];

function SiteContentPage() {
  const identity = useAdmin();
  const perms = permissions(identity.role);
  const queryClient = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});

  const settings = useQuery({
    queryKey: ["admin", "site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("key, value");
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  useEffect(() => {
    if (!settings.data) return;
    const next: Record<string, string> = {};
    settings.data.forEach((row) => {
      next[row.key] = typeof row.value === "string" ? row.value : JSON.stringify(row.value ?? "");
    });
    setValues(next);
  }, [settings.data]);

  const save = useMutation({
    mutationFn: async () => {
      const rows = groups
        .flatMap((g) => g.fields)
        .map((field) => ({ key: field.key, value: values[field.key] ?? "" }));
      const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
      if (error) throw new Error(error.message);
      await logActivity({
        action: "updated",
        entity: "site content",
        actorName: identity.profile?.name ?? "Administrator",
      });
    },
    onSuccess: () => {
      toast.success("Site content saved");
      void queryClient.invalidateQueries({ queryKey: ["admin", "site_settings"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <>
      <AdminPageHeader
        title="Site content"
        description="Editable text used across the public pages, contact details and the site-wide banner."
        actions={
          perms.manageContent ? (
            <Button onClick={() => save.mutate()} disabled={save.isPending}>
              {save.isPending ? "Saving…" : "Save changes"}
            </Button>
          ) : null
        }
      />

      <div className="space-y-8">
        {groups.map((group) => (
          <section key={group.title} className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-5 text-base font-semibold text-foreground">{group.title}</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {group.fields.map((field) => (
                <div key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                  <Label htmlFor={field.key} className="mb-2 block">{field.label}</Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      id={field.key}
                      rows={4}
                      disabled={!perms.manageContent}
                      value={values[field.key] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                    />
                  ) : (
                    <Input
                      id={field.key}
                      disabled={!perms.manageContent}
                      value={values[field.key] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                    />
                  )}
                  {field.help ? <p className="mt-1.5 text-xs text-muted-foreground">{field.help}</p> : null}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}