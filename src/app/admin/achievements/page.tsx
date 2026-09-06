'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import { useToast, ToastProvider } from '@/components/admin/Toast';
import { Plus } from 'lucide-react';

const categories = ['Hackathon', 'Research', 'Sports', 'Community'];

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  competition: string;
  participants: string;
  position: string;
  imageUrl: string;
  externalLink: string;
}

const empty: Achievement = {
  id: '', title: '', description: '', category: 'Hackathon', date: '',
  competition: '', participants: '', position: '', imageUrl: '', externalLink: '',
};

function AchievementsContent() {
  const { toast } = useToast();
  const [user, setUser] = useState({ name: 'Admin', role: 'admin' });
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [form, setForm] = useState<Achievement>(empty);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Achievement | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/achievements');
      const data = await res.json();
      setItems(data.achievements || data || []);
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
  const openEdit = (a: Achievement) => { setEditing(a); setForm({ ...a }); setModalOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/admin/achievements/${editing.id}` : '/api/admin/achievements';
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
      await fetch(`/api/admin/achievements/${deleteTarget.id}`, { method: 'DELETE' });
      toast({ title: 'Deleted', type: 'success' });
      fetchData();
    } catch {
      toast({ title: 'Failed to delete', type: 'error' });
    }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
    { key: 'date', label: 'Date', render: (v: unknown) => v ? new Date(v as string).toLocaleDateString() : '—' },
    { key: 'position', label: 'Position' },
  ];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar currentPath="/admin/achievements" role={user.role} />
      <div className="flex-1 ml-64">
        <AdminHeader title="Achievements" user={user} />
        <main className="p-6 bg-[#E6E1D7] min-h-screen">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-xs text-neutral-500 font-mono-tech uppercase tracking-widest">{items.length} achievements</p>
            <button onClick={openAdd} className="btn-primary flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-bold">
              <Plus size={16} /> Add Achievement
            </button>
          </div>

          {loading ? <LoadingSpinner /> : (
            <DataTable columns={columns} data={items as unknown as Record<string, unknown>[]} onEdit={(r) => openEdit(r as unknown as Achievement)} onDelete={(r) => setDeleteTarget(r as unknown as Achievement)} emptyMessage="No achievements found" />
          )}
        </main>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Achievement' : 'Add Achievement'} maxWidth="max-w-2xl">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Title</label><input className="admin-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="col-span-2"><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Description</label><textarea className="admin-input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Category</label>
              <select className="admin-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Date</label><input type="date" className="admin-input" value={form.date?.split('T')[0] || ''} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Competition</label><input className="admin-input" value={form.competition} onChange={(e) => setForm({ ...form, competition: e.target.value })} /></div>
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Participants</label><input className="admin-input" value={form.participants} onChange={(e) => setForm({ ...form, participants: e.target.value })} /></div>
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Position</label><input className="admin-input" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} /></div>
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Image URL</label><input className="admin-input" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></div>
            <div className="col-span-2"><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">External Link</label><input className="admin-input" value={form.externalLink} onChange={(e) => setForm({ ...form, externalLink: e.target.value })} /></div>
          </div>
          <div className="flex justify-end gap-3 border-t border-black/10 pt-4">
            <button onClick={() => setModalOpen(false)} className="btn-secondary rounded-sm px-4 py-2 text-sm font-medium">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary rounded-sm px-4 py-2 text-sm font-bold disabled:opacity-50">
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Achievement" message={`Delete "${deleteTarget?.title}"?`} />
    </div>
  );
}

export default function AchievementsPage() {
  return <ToastProvider><AchievementsContent /></ToastProvider>;
}
