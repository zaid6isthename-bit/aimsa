'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import Modal from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import { useToast, ToastProvider } from '@/components/admin/Toast';
import { Plus } from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

const empty: AdminUser = {
  id: '', name: '', username: '', email: '', role: 'admin', status: 'active', lastLogin: '',
};

function AdminsContent() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState({ name: 'Admin', role: 'admin', id: '' });
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<AdminUser & { password?: string }>({ ...empty });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/admins');
      const data = await res.json();
      setAdmins(data.admins || data || []);
    } catch {
      toast({ title: 'Failed to load admins', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetch('/api/admin/auth/me')
      .then((r) => r.json())
      .then((d) => { if (d.user) setCurrentUser(d.user); })
      .catch(() => {});
  }, []);

  const openAdd = () => { setEditing(null); setForm({ ...empty, password: '' }); setModalOpen(true); };
  const openEdit = (a: AdminUser) => { setEditing(a); setForm({ ...a, password: '' }); setModalOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/admin/admins/${editing.id}` : '/api/admin/admins';
      const body: Record<string, unknown> = { ...form };
      if (!editing && !body.password) {
        toast({ title: 'Password is required', type: 'error' });
        setSaving(false);
        return;
      }
      if (editing && !body.password) delete body.password;
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed');
      }
      toast({ title: editing ? 'Admin updated' : 'Admin created', type: 'success' });
      setModalOpen(false);
      fetchData();
    } catch (err) {
      toast({ title: err instanceof Error ? err.message : 'Failed to save', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.id === currentUser.id) {
      toast({ title: 'Cannot delete your own account', type: 'error' });
      return;
    }
    try {
      await fetch(`/api/admin/admins/${deleteTarget.id}`, { method: 'DELETE' });
      toast({ title: 'Admin deleted', type: 'success' });
      fetchData();
    } catch {
      toast({ title: 'Failed to delete', type: 'error' });
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (v: unknown) => <span className="capitalize font-mono-tech">{(v as string)?.replace('_', ' ')}</span> },
    { key: 'status', label: 'Status', render: (v: unknown) => <StatusBadge status={v as string} /> },
    { key: 'lastLogin', label: 'Last Login', render: (v: unknown) => v ? new Date(v as string).toLocaleDateString() : 'Never' },
  ];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar currentPath="/admin/admins" role={currentUser.role} />
      <div className="flex-1 ml-64">
        <AdminHeader title="Admin Users" user={currentUser} />
        <main className="p-6 bg-[#E6E1D7] min-h-screen">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-xs text-neutral-500 font-mono-tech uppercase tracking-widest">{admins.length} admin users</p>
            <button onClick={openAdd} className="btn-primary flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-bold">
              <Plus size={16} /> Add Admin
            </button>
          </div>

          {loading ? <LoadingSpinner /> : (
            <DataTable
              columns={columns}
              data={admins as unknown as Record<string, unknown>[]}
              onEdit={(r) => openEdit(r as unknown as AdminUser)}
              onDelete={(r) => {
                const target = r as unknown as AdminUser;
                if (target.id === currentUser.id) {
                  toast({ title: 'Cannot delete your own account', type: 'error' });
                  return;
                }
                setDeleteTarget(target);
              }}
              emptyMessage="No admin users found"
            />
          )}
        </main>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Admin' : 'Add Admin'} maxWidth="max-w-lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Name</label><input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Username</label><input className="admin-input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} disabled={!!editing} /></div>
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Email</label><input type="email" className="admin-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Password {editing && <span className="text-neutral-400 normal-case">(leave blank to keep)</span>}</label>
              <input type="password" className="admin-input" value={form.password || ''} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={editing ? '••••••••' : 'Enter password'} />
            </div>
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Role</label>
              <select className="admin-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <div className="col-span-2"><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Status</label>
              <select className="admin-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t border-black/10 pt-4">
            <button onClick={() => setModalOpen(false)} className="btn-secondary rounded-sm px-4 py-2 text-sm font-medium">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary rounded-sm px-4 py-2 text-sm font-bold disabled:opacity-50">
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Admin" message={`Delete admin "${deleteTarget?.name}"? This cannot be undone.`} />
    </div>
  );
}

export default function AdminsPage() {
  return <ToastProvider><AdminsContent /></ToastProvider>;
}
