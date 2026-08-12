import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ImageField } from "./MediaUpload";
import { AdminPageHeader } from "./AdminShell";
import { logActivity } from "@/lib/cms/activity";

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "boolean"
  | "select"
  | "date"
  | "datetime"
  | "tags"
  | "image"
  | "url";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  options?: { label: string; value: string }[];
  required?: boolean;
  help?: string;
  placeholder?: string;
  defaultValue?: unknown;
  /** Show this field as a column in the list table. */
  column?: boolean;
}

export interface ResourceConfig {
  table: string;
  title: string;
  description: string;
  singular: string;
  labelField: string;
  fields: FieldConfig[];
  orderBy?: { column: string; ascending?: boolean };
  searchFields?: string[];
  /** Set when the table has a `status` column supporting draft/published. */
  hasStatus?: boolean;
}

type Row = Record<string, unknown>;

/** Table names are resolved at runtime from the resource config, so use an untyped client. */
const db = supabase as unknown as SupabaseClient;

const statusOptions = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];

function emptyValue(field: FieldConfig) {
  if (field.defaultValue !== undefined) return field.defaultValue;
  switch (field.type) {
    case "boolean":
      return false;
    case "number":
      return "";
    case "tags":
      return [] as string[];
    default:
      return "";
  }
}

function blankRecord(config: ResourceConfig): Row {
  const record: Row = {};
  config.fields.forEach((f) => {
    record[f.name] = emptyValue(f);
  });
  if (config.hasStatus) record["status"] = "draft";
  return record;
}

function toInputValue(field: FieldConfig, value: unknown): string {
  if (value === null || value === undefined) return "";
  if (field.type === "datetime" && typeof value === "string") return value.slice(0, 16);
  if (field.type === "date" && typeof value === "string") return value.slice(0, 10);
  return String(value);
}

function serialize(config: ResourceConfig, record: Row): Row {
  const payload: Row = {};
  config.fields.forEach((field) => {
    const raw = record[field.name];
    switch (field.type) {
      case "number":
        payload[field.name] = raw === "" || raw === null ? null : Number(raw);
        break;
      case "boolean":
        payload[field.name] = Boolean(raw);
        break;
      case "tags":
        payload[field.name] = Array.isArray(raw)
          ? raw
          : String(raw ?? "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
        break;
      case "datetime":
      case "date":
        payload[field.name] = raw ? new Date(String(raw)).toISOString() : null;
        break;
      default:
        payload[field.name] = raw === "" ? null : raw;
    }
  });
  if (config.hasStatus) payload["status"] = record["status"] ?? "draft";
  return payload;
}

export function ResourceManager({
  config,
  actorName,
  canEdit,
}: {
  config: ResourceConfig;
  actorName: string;
  canEdit: boolean;
}) {
  const queryClient = useQueryClient();
  const queryKey = ["admin", config.table];
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editing, setEditing] = useState<Row | null>(null);
  const [draft, setDraft] = useState<Row>({});
  const [deleting, setDeleting] = useState<Row | null>(null);

  const list = useQuery({
    queryKey,
    queryFn: async () => {
      const order = config.orderBy ?? { column: "created_at", ascending: false };
      const { data, error } = await db
        .from(config.table)
        .select("*")
        .order(order.column, { ascending: order.ascending ?? false });
      if (error) throw new Error(error.message);
      return (data ?? []) as Row[];
    },
  });

  const save = useMutation({
    mutationFn: async ({ record, id }: { record: Row; id?: string | undefined }) => {
      const payload = serialize(config, record);
      if (id) {
        const { error } = await db.from(config.table).update(payload).eq("id", id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await db.from(config.table).insert(payload);
        if (error) throw new Error(error.message);
      }
      await logActivity({
        action: id ? "updated" : "created",
        entity: config.singular,
        entityLabel: String(record[config.labelField] ?? ""),
        entityId: id,
        actorName,
      });
    },
    onSuccess: (_data, variables) => {
      toast.success(variables.id ? `${config.singular} updated` : `${config.singular} created`);
      setEditing(null);
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (row: Row) => {
      const { error } = await db.from(config.table).delete().eq("id", row["id"] as string);
      if (error) throw new Error(error.message);
      await logActivity({
        action: "deleted",
        entity: config.singular,
        entityLabel: String(row[config.labelField] ?? ""),
        actorName,
      });
    },
    onSuccess: () => {
      toast.success(`${config.singular} deleted`);
      setDeleting(null);
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    const searchFields = config.searchFields ?? [config.labelField];
    return (list.data ?? []).filter((row) => {
      if (statusFilter !== "all" && row["status"] !== statusFilter) return false;
      if (!term) return true;
      return searchFields.some((f) => String(row[f] ?? "").toLowerCase().includes(term));
    });
  }, [list.data, search, statusFilter, config]);

  const openCreate = () => {
    const record = blankRecord(config);
    setDraft(record);
    setEditing({ __new: true });
  };

  const openEdit = (row: Row) => {
    const record = blankRecord(config);
    Object.keys(record).forEach((key) => {
      if (row[key] !== undefined && row[key] !== null) record[key] = row[key];
    });
    if (config.hasStatus) record["status"] = row["status"] ?? "draft";
    setDraft(record);
    setEditing(row);
  };

  const duplicate = (row: Row) => {
    const record = blankRecord(config);
    Object.keys(record).forEach((key) => {
      if (row[key] !== undefined && row[key] !== null) record[key] = row[key];
    });
    record[config.labelField] = `${String(row[config.labelField] ?? "")} (copy)`;
    if (config.fields.some((f) => f.name === "slug") && row["slug"]) {
      record["slug"] = `${String(row["slug"])}-copy`;
    }
    if (config.hasStatus) record["status"] = "draft";
    setDraft(record);
    setEditing({ __new: true });
  };

  const columns = config.fields.filter((f) => f.column);
  const editingId = editing && !editing["__new"] ? (editing["id"] as string) : undefined;

  return (
    <>
      <AdminPageHeader
        title={config.title}
        description={config.description}
        actions={
          canEdit ? (
            <Button onClick={openCreate}>
              <Plus className="size-4" aria-hidden="true" /> New {config.singular.toLowerCase()}
            </Button>
          ) : (
            <Badge variant="secondary">Read only</Badge>
          )
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${config.title.toLowerCase()}`}
            className="pl-9"
            aria-label={`Search ${config.title}`}
          />
        </div>
        {config.hasStatus ? (
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {statusOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {list.isLoading ? (
          <p className="p-8 text-sm text-muted-foreground">Loading…</p>
        ) : list.isError ? (
          <p className="p-8 text-sm text-destructive">
            Could not load records: {(list.error as Error).message}
          </p>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-muted-foreground">
              No {config.title.toLowerCase()} yet.
            </p>
            {canEdit ? (
              <Button className="mt-4" variant="outline" onClick={openCreate}>
                <Plus className="size-4" aria-hidden="true" /> Add the first {config.singular.toLowerCase()}
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  {columns.map((c) => (
                    <th key={c.name} className="px-4 py-3 font-semibold">{c.label}</th>
                  ))}
                  {config.hasStatus ? <th className="px-4 py-3 font-semibold">Status</th> : null}
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={String(row["id"])} className="border-t border-border/70">
                    {columns.map((c) => (
                      <td key={c.name} className="max-w-72 truncate px-4 py-3">
                        {c.type === "boolean"
                          ? row[c.name] ? "Yes" : "No"
                          : Array.isArray(row[c.name])
                            ? (row[c.name] as string[]).join(", ")
                            : toInputValue(c, row[c.name])}
                      </td>
                    ))}
                    {config.hasStatus ? (
                      <td className="px-4 py-3">
                        <Badge variant={row["status"] === "published" ? "default" : "secondary"}>
                          {String(row["status"] ?? "draft")}
                        </Badge>
                      </td>
                    ) : null}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(row)} aria-label="Edit">
                          <Pencil className="size-4" />
                        </Button>
                        {canEdit ? (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => duplicate(row)} aria-label="Duplicate">
                              <Copy className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleting(row)}
                              aria-label="Delete"
                            >
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? `Edit ${config.singular.toLowerCase()}` : `New ${config.singular.toLowerCase()}`}
            </DialogTitle>
            <DialogDescription>
              Changes go live on the public website as soon as the record is published.
            </DialogDescription>
          </DialogHeader>

          <form
            className="grid gap-5 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              save.mutate({ record: draft, id: editingId });
            }}
          >
            {config.fields.map((field) => {
              const wide = field.type === "textarea" || field.type === "richtext" || field.type === "image";
              const value = draft[field.name];
              return (
                <div key={field.name} className={wide ? "sm:col-span-2" : ""}>
                  <Label htmlFor={`f-${field.name}`} className="mb-2 block">
                    {field.label}
                    {field.required ? <span className="text-destructive"> *</span> : null}
                  </Label>

                  {field.type === "textarea" || field.type === "richtext" ? (
                    <Textarea
                      id={`f-${field.name}`}
                      rows={field.type === "richtext" ? 8 : 4}
                      required={field.required}
                      value={toInputValue(field, value)}
                      placeholder={field.placeholder}
                      onChange={(e) => setDraft((d) => ({ ...d, [field.name]: e.target.value }))}
                    />
                  ) : field.type === "boolean" ? (
                    <div className="flex h-10 items-center">
                      <Switch
                        id={`f-${field.name}`}
                        checked={Boolean(value)}
                        onCheckedChange={(checked) => setDraft((d) => ({ ...d, [field.name]: checked }))}
                      />
                    </div>
                  ) : field.type === "select" ? (
                    <Select
                      value={value ? String(value) : ""}
                      onValueChange={(v) => setDraft((d) => ({ ...d, [field.name]: v }))}
                    >
                      <SelectTrigger id={`f-${field.name}`}><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {(field.options ?? []).map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === "image" ? (
                    <ImageField
                      label={field.label}
                      value={String(value ?? "")}
                      category={config.table}
                      onChange={(v) => setDraft((d) => ({ ...d, [field.name]: v }))}
                    />
                  ) : field.type === "tags" ? (
                    <Input
                      id={`f-${field.name}`}
                      value={Array.isArray(value) ? (value as string[]).join(", ") : String(value ?? "")}
                      placeholder={field.placeholder ?? "Comma separated"}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          [field.name]: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        }))
                      }
                    />
                  ) : (
                    <Input
                      id={`f-${field.name}`}
                      type={
                        field.type === "number"
                          ? "number"
                          : field.type === "date"
                            ? "date"
                            : field.type === "datetime"
                              ? "datetime-local"
                              : field.type === "url"
                                ? "url"
                                : "text"
                      }
                      required={field.required}
                      value={toInputValue(field, value)}
                      placeholder={field.placeholder}
                      onChange={(e) => setDraft((d) => ({ ...d, [field.name]: e.target.value }))}
                    />
                  )}

                  {field.help ? (
                    <p className="mt-1.5 text-xs text-muted-foreground">{field.help}</p>
                  ) : null}
                </div>
              );
            })}

            {config.hasStatus ? (
              <div className="sm:col-span-2">
                <Label htmlFor="f-status" className="mb-2 block">Status</Label>
                <Select
                  value={String(draft["status"] ?? "draft")}
                  onValueChange={(v) => setDraft((d) => ({ ...d, status: v }))}
                >
                  <SelectTrigger id="f-status" className="w-56"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            <DialogFooter className="sm:col-span-2">
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              {canEdit ? (
                <Button type="submit" disabled={save.isPending}>
                  {save.isPending ? "Saving…" : "Save"}
                </Button>
              ) : null}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {config.singular.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>
              “{String(deleting?.[config.labelField] ?? "")}” will be permanently removed from the
              website. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleting && remove.mutate(deleting)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}