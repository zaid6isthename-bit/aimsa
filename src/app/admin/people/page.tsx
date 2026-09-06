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
import { Plus, Upload, X } from 'lucide-react';

const categories = ['Leadership', 'Core Team', 'Department Leads', 'Executive Committee'];

interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: string;
  year: string;
  photoUrl: string;
  bio: string;
  quote: string;
  contributions: string;
  github: string;
  linkedin: string;
  email: string;
  highlightTag: string;
  displayOrder: number;
  isActive: boolean;
}

const emptyMember: TeamMember = {
  id: '', name: '', role: '', category: 'Core Team', year: '', photoUrl: '',
  bio: '', quote: '', contributions: '', github: '', linkedin: '', email: '',
  highlightTag: '', displayOrder: 0, isActive: true,
};

function TeamContent() {
  const { toast } = useToast();
  const [user, setUser] = useState({ name: 'Admin', role: 'admin' });
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<TeamMember>(emptyMember);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/team');
      const data = await res.json();
      setMembers(data.members || data || []);
    } catch {
      toast({ title: 'Failed to load team', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetch('/api/admin/auth/me').then((r) => r.json()).then((d) => { if (d.user) setUser(d.user); }).catch(() => {});
  }, []);

  const openAdd = () => { setEditing(null); setForm(emptyMember); setModalOpen(true); };
  const openEdit = (m: TeamMember) => { setEditing(m); setForm({ ...m }); setModalOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/admin/team/${editing.id}` : '/api/admin/team';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      toast({ title: editing ? 'Member updated' : 'Member added', type: 'success' });
      setModalOpen(false);
      fetchData();
    } catch {
      toast({ title: 'Failed to save', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/admin/team/${deleteTarget.id}`, { method: 'DELETE' });
      toast({ title: 'Member removed', type: 'success' });
      fetchData();
    } catch {
      toast({ title: 'Failed to delete', type: 'error' });
    }
  };

  const columns = [
    { key: 'photoUrl', label: 'Photo', render: (v: unknown) => v ? <img src={v as string} alt="" className="w-10 h-12 object-cover rounded-sm border border-black/10" /> : <div className="w-10 h-12 bg-neutral-200 rounded-sm border border-black/10" /> },
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'category', label: 'Category' },
    { key: 'year', label: 'Year' },
    { key: 'isActive', label: 'Status', render: (v: unknown) => <StatusBadge status={v ? 'active' : 'inactive'} /> },
    { key: 'displayOrder', label: 'Order' },
  ];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar currentPath="/admin/people" role={user.role} />
      <div className="flex-1 ml-64">
        <AdminHeader title="Team Management" user={user} />
        <main className="p-6 bg-[#E6E1D7] min-h-screen">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-xs text-neutral-500 font-mono-tech uppercase tracking-widest">{members.length} team members</p>
            <button onClick={openAdd} className="btn-primary flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-bold">
              <Plus size={16} /> Add Member
            </button>
          </div>

          {loading ? <LoadingSpinner /> : (
            <DataTable columns={columns} data={members as unknown as Record<string, unknown>[]} onEdit={(r) => openEdit(r as unknown as TeamMember)} onDelete={(r) => setDeleteTarget(r as unknown as TeamMember)} emptyMessage="No team members found" />
          )}
        </main>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Member' : 'Add Member'} maxWidth="max-w-3xl">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Name</label><input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Role</label><input className="admin-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></div>
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Category</label>
              <select className="admin-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Year</label><input className="admin-input" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} /></div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Photo</label>
              <div className="flex items-start gap-4">
                {form.photoUrl && (
                  <div className="relative w-24 h-28 rounded-sm overflow-hidden border border-black/15 flex-shrink-0">
                    <img src={form.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, photoUrl: '' })}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
                <div className="flex-1">
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-black/20 rounded-sm cursor-pointer hover:border-[#D92525] transition-colors bg-white/50">
                    <div className="flex flex-col items-center justify-center py-2">
                      <Upload size={20} className="text-neutral-400 mb-1" />
                      <span className="text-[11px] font-mono-tech text-neutral-500 uppercase">{uploading ? 'Uploading...' : 'Click to upload photo'}</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploading(true);
                        try {
                          const fd = new FormData();
                          fd.append('file', file);
                          fd.append('folder', 'team');
                          const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
                          const data = await res.json();
                          if (data.url) setForm({ ...form, photoUrl: data.url });
                          else toast({ title: 'Upload failed', type: 'error' });
                        } catch {
                          toast({ title: 'Upload failed', type: 'error' });
                        } finally {
                          setUploading(false);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              <input className="admin-input mt-2" placeholder="Or enter photo URL" value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} />
            </div>
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Email</label><input className="admin-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">GitHub</label><input className="admin-input" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} /></div>
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">LinkedIn</label><input className="admin-input" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} /></div>
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Highlight Tag</label><input className="admin-input" value={form.highlightTag} onChange={(e) => setForm({ ...form, highlightTag: e.target.value })} /></div>
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Display Order</label><input type="number" className="admin-input" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} /></div>
            <div className="col-span-2"><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Bio</label><textarea className="admin-input" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
            <div className="col-span-2"><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Quote</label><input className="admin-input" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} /></div>
            <div className="col-span-2"><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Contributions</label><textarea className="admin-input" rows={3} value={form.contributions} onChange={(e) => setForm({ ...form, contributions: e.target.value })} /></div>
            <div className="col-span-2 flex items-center gap-2">
              <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4 rounded-sm border-black/20 text-[#D92525] focus:ring-[#D92525]" />
              <label htmlFor="isActive" className="text-sm font-medium text-[#121110] font-mono-tech">Active</label>
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

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Remove Member" message={`Remove "${deleteTarget?.name}" from the team?`} />
    </div>
  );
}

export default function TeamPage() {
  return <ToastProvider><TeamContent /></ToastProvider>;
}
