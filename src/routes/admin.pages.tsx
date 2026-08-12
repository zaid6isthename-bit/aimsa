import { useEffect, useMemo, useState } from "react";
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
import { copyDefaults, copyGroups } from "@/lib/cms/site-copy";

export const Route = createFileRoute("/admin/pages")({ ssr: false, component: SiteContentPage });

function SiteContentPage() {
  const identity = useAdmin();
  const perms = permissions(identity.role);
  const queryClient = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [active, setActive] = useState(copyGroups[0]!.key);
  const [dirty, setDirty] = useState(false);

  const settings = useQuery({
    queryKey: ["admin", "site_copy"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "copy")
        .maybeSingle();
      if (error) throw new Error(error.message);
      return (data?.value ?? {}) as Record<string, string>;
    },
  });

  useEffect(() => {
    if (!settings.data) return;
    setValues({ ...copyDefaults, ...settings.data });
    setDirty(false);
  }, [settings.data]);

  const group = useMemo(
    () => copyGroups.find((g) => g.key === active) ?? copyGroups[0]!,
    [active],
  );

  const set = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    setDirty(true);
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload: Record<string, string> = {};
      copyGroups.forEach((g) =>
        g.fields.forEach((f) => {
          payload[f.id] = values[f.id] ?? "";
        }),
      );
      const { error } = await supabase
        .from("site_settings")
        .upsert({ key: "copy", value: payload }, { onConflict: "key" });
      if (error) throw new Error(error.message);
      await logActivity({
        action: "updated",
        entity: "site content",
        entityLabel: group.title,
        actorName: identity.profile?.name ?? "Administrator",
      });
    },
    onSuccess: () => {
      toast.success("Site content saved — the public pages update immediately");
      setDirty(false);
      void queryClient.invalidateQueries({ queryKey: ["admin", "site_copy"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <>
      <AdminPageHeader
        title="Site content"
        description="Every editable heading, paragraph, list and contact detail across the public website."
        actions={
          perms.manageContent ? (
            <Button onClick={() => save.mutate()} disabled={save.isPending || !dirty}>
              {save.isPending ? "Saving…" : dirty ? "Save changes" : "Saved"}
            </Button>
          ) : null
        }
      />

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="flex flex-wrap gap-1 lg:flex-col">
          {copyGroups.map((g) => (
            <button
              key={g.key}
              type="button"
              onClick={() => setActive(g.key)}
              className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                g.key === active
                  ? "bg-primary/15 font-semibold text-primary"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {g.title}
            </button>
          ))}
        </nav>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold text-foreground">{group.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {group.fields.map((field) => {
              const multiline = field.type !== "text";
              return (
                <div key={field.id} className={multiline ? "sm:col-span-2" : ""}>
                  <Label htmlFor={field.id} className="mb-2 block">
                    {field.label}
                  </Label>
                  {multiline ? (
                    <Textarea
                      id={field.id}
                      rows={field.type === "textarea" ? 3 : 6}
                      value={values[field.id] ?? ""}
                      disabled={!perms.manageContent}
                      onChange={(e) => set(field.id, e.target.value)}
                    />
                  ) : (
                    <Input
                      id={field.id}
                      value={values[field.id] ?? ""}
                      disabled={!perms.manageContent}
                      onChange={(e) => set(field.id, e.target.value)}
                    />
                  )}
                  {field.help ? (
                    <p className="mt-1.5 text-xs text-muted-foreground">{field.help}</p>
                  ) : null}
                </div>
              );
            })}
          </div>

          {perms.manageContent ? (
            <div className="mt-6 flex items-center gap-3">
              <Button onClick={() => save.mutate()} disabled={save.isPending || !dirty}>
                {save.isPending ? "Saving…" : "Save changes"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  const next = { ...values };
                  group.fields.forEach((f) => {
                    next[f.id] = copyDefaults[f.id] ?? "";
                  });
                  setValues(next);
                  setDirty(true);
                }}
              >
                Reset this section
              </Button>
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">
              Your role has read-only access to site content.
            </p>
          )}
        </section>
      </div>
    </>
  );
}
