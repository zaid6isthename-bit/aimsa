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

const categories = ['General', 'Event', 'Academic', 'Placement', 'Technical', 'Important'];

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl: string;
  link: string;
  pinned: boolean;
  status: string;
  createdAt: string;
}

const empty: Announcement = {
  id: '', title: '', content: '', category: 'General', imageUrl: '', link: '', pinned: false, status: 'draft', createdAt: '',
};

function AnnouncementsContent() {
  const { toast } = useToast();
  const [user, setUser] = useState({ name: 'Admin', role: 'admin' });
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState<Announcement>(empty);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/announcements');
      const data = await res.json();
      setItems(data.announcements || data || []);
    } catch {
      toast({ title: 'Failed to load', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetch('/api/admin/auth/me').then((r) => r.json()).then((d) => { if (d.user) setUser(d.user); }).catch(() => {});
  }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setModalOpen(true); };
  const openEdit = (a: Announcement) => { setEditing(a); setForm({ ...a }); setModalOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/admin/announcements/${editing.id}` : '/api/admin/announcements';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      toast({ title: editing ? 'Updated' : 'Created', type: 'success' });
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
      await fetch(`/api/admin/announcements/${deleteTarget.id}`, { method: 'DELETE' });
      toast({ title: 'Deleted', type: 'success' });
      fetchData();
    } catch {
      toast({ title: 'Failed to delete', type: 'error' });
    }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
    { key: 'pinned', label: 'Pinned', render: (v: unknown) => v ? <span className="text-yellow-600 font-bold font-mono-tech">Pinned</span> : '—' },
    { key: 'status', label: 'Status', render: (v: unknown) => <StatusBadge status={v as string} /> },
    { key: 'createdAt', label: 'Date', render: (v: unknown) => v ? new Date(v as string).toLocaleDateString() : '—' },
  ];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar currentPath="/admin/community" role={user.role} />
      <div className="flex-1 ml-64">
        <AdminHeader title="Announcements" user={user} />
        <main className="p-6 bg-[#E6E1D7] min-h-screen">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-xs text-neutral-500 font-mono-tech uppercase tracking-widest">{items.length} announcements</p>
            <button onClick={openAdd} className="btn-primary flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-bold">
              <Plus size={16} /> Add Announcement
            </button>
          </div>

          {loading ? <LoadingSpinner /> : (
            <DataTable columns={columns} data={items as unknown as Record<string, unknown>[]} onEdit={(r) => openEdit(r as unknown as Announcement)} onDelete={(r) => setDeleteTarget(r as unknown as Announcement)} emptyMessage="No announcements found" />
          )}
        </main>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Announcement' : 'Add Announcement'}>
        <div className="space-y-4">
          <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Title</label><input className="admin-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Content</label><textarea className="admin-input" rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Category</label>
              <select className="admin-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Status</label>
              <select className="admin-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Image URL</label><input className="admin-input" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></div>
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Link</label><input className="admin-input" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} /></div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="pinned" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} className="h-4 w-4 rounded-sm border-black/20 text-[#D92525] focus:ring-[#D92525]" />
            <label htmlFor="pinned" className="text-sm font-medium text-[#121110] font-mono-tech">Pin to top</label>
          </div>
          <div className="flex justify-end gap-3 border-t border-black/10 pt-4">
            <button onClick={() => setModalOpen(false)} className="btn-secondary rounded-sm px-4 py-2 text-sm font-medium">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary rounded-sm px-4 py-2 text-sm font-bold disabled:opacity-50">
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Announcement" message={`Delete "${deleteTarget?.title}"?`} />
    </div>
  );
}

export default function AnnouncementsPage() {
  return <ToastProvider><AnnouncementsContent /></ToastProvider>;
}
