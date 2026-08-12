import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { permissions, roleLabels, useAdmin } from "@/lib/cms/useAdmin";
import { createAdminAccount, deleteAdminAccount, setAdminRole } from "@/lib/cms/admin.functions";
import type { AdminRole } from "@/lib/cms/admin.server";

export const Route = createFileRoute("/admin/admins")({ ssr: false, component: AdminsPage });

const roleValues: AdminRole[] = ["super_admin", "content_admin", "event_admin"];

function AdminsPage() {
  const identity = useAdmin();
  const perms = permissions(identity.role);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", adminId: "", password: "", role: "content_admin" as AdminRole });

  const admins = useQuery({
    queryKey: ["admin", "admin_profiles"],
    queryFn: async () => {
      const [{ data: profiles, error }, { data: roles }] = await Promise.all([
        supabase.from("admin_profiles").select("*").order("created_at"),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      if (error) throw new Error(error.message);
      return (profiles ?? []).map((p) => ({
        ...p,
        role: (roles ?? []).find((r) => r.user_id === p.id)?.role as AdminRole | undefined,
      }));
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "admin_profiles"] });

  const create = useMutation({
    mutationFn: () => createAdminAccount({ data: form }),
    onSuccess: () => {
      toast.success("Administrator created");
      setOpen(false);
      setForm({ name: "", email: "", adminId: "", password: "", role: "content_admin" });
      void invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const changeRole = useMutation({
    mutationFn: (input: { userId: string; role: AdminRole }) => setAdminRole({ data: input }),
    onSuccess: () => {
      toast.success("Role updated");
      void invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const toggleActive = useMutation({
    mutationFn: async (input: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from("admin_profiles")
        .update({ active: input.active })
        .eq("id", input.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Account updated");
      void invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const removeAdmin = useMutation({
    mutationFn: (userId: string) => deleteAdminAccount({ data: { userId } }),
    onSuccess: () => {
      toast.success("Administrator removed");
      void invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (!perms.manageAdmins) {
    return (
      <p className="rounded-xl border border-border bg-card p-8 text-sm text-muted-foreground">
        Only a Super Admin can manage administrator accounts.
      </p>
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Administrators"
        description="Create accounts and control what each administrator can manage."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" aria-hidden="true" /> New administrator
          </Button>
        }
      />

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Admin ID</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Active</th>
              <th className="px-4 py-3 font-semibold">Last login</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(admins.data ?? []).map((admin) => (
              <tr key={admin.id} className="border-t border-border/70">
                <td className="px-4 py-3">{admin.name}</td>
                <td className="px-4 py-3">{admin.admin_id}</td>
                <td className="px-4 py-3">{admin.email}</td>
                <td className="px-4 py-3">
                  <Select
                    value={admin.role ?? ""}
                    onValueChange={(value) => changeRole.mutate({ userId: admin.id, role: value as AdminRole })}
                  >
                    <SelectTrigger className="w-44"><SelectValue placeholder="No role" /></SelectTrigger>
                    <SelectContent>
                      {roleValues.map((role) => (
                        <SelectItem key={role} value={role}>{roleLabels[role]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3">
                  <Switch
                    checked={admin.active}
                    aria-label={`Toggle ${admin.name}`}
                    onCheckedChange={(checked) => toggleActive.mutate({ id: admin.id, active: checked })}
                  />
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {admin.last_login ? new Date(admin.last_login).toLocaleString() : "Never"}
                </td>
                <td className="px-4 py-3 text-right">
                  {admin.id === identity.session?.user.id ? (
                    <Badge variant="secondary">You</Badge>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${admin.name}`}
                      onClick={() => removeAdmin.mutate(admin.id)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New administrator</DialogTitle>
            <DialogDescription>
              The account is created immediately. Share the password securely and ask them to change it.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              create.mutate();
            }}
          >
            <div>
              <Label htmlFor="a-name" className="mb-2 block">Full name</Label>
              <Input id="a-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="a-id" className="mb-2 block">Admin ID</Label>
              <Input id="a-id" required value={form.adminId} onChange={(e) => setForm({ ...form, adminId: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="a-email" className="mb-2 block">Email</Label>
              <Input id="a-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="a-pass" className="mb-2 block">Temporary password</Label>
              <Input id="a-pass" type="text" required minLength={10} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="a-role" className="mb-2 block">Role</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as AdminRole })}>
                <SelectTrigger id="a-role"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {roleValues.map((role) => (
                    <SelectItem key={role} value={role}>{roleLabels[role]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={create.isPending}>
                {create.isPending ? "Creating…" : "Create administrator"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}