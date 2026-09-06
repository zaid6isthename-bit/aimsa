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
import { Plus, Star } from 'lucide-react';

const categories = ['Web Development', 'Mobile App', 'AI/ML', 'IoT', 'Blockchain', 'DevOps', 'Other'];

interface Project {
  id: string;
  name: string;
  description: string;
  technologyStack: string;
  category: string;
  imageUrl: string;
  githubLink: string;
  demoLink: string;
  teamMembers: string;
  status: string;
  featured: boolean;
}

const empty: Project = {
  id: '', name: '', description: '', technologyStack: '', category: 'Web Development',
  imageUrl: '', githubLink: '', demoLink: '', teamMembers: '', status: 'draft', featured: false,
};

function ProjectsContent() {
  const { toast } = useToast();
  const [user, setUser] = useState({ name: 'Admin', role: 'admin' });
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Project>(empty);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      setItems(data.projects || data || []);
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
  const openEdit = (p: Project) => { setEditing(p); setForm({ ...p }); setModalOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/admin/projects/${editing.id}` : '/api/admin/projects';
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
      await fetch(`/api/admin/projects/${deleteTarget.id}`, { method: 'DELETE' });
      toast({ title: 'Deleted', type: 'success' });
      fetchData();
    } catch {
      toast({ title: 'Failed to delete', type: 'error' });
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'status', label: 'Status', render: (v: unknown) => <StatusBadge status={v as string} /> },
    { key: 'featured', label: 'Featured', render: (v: unknown) => v ? <Star size={16} className="fill-yellow-400 text-yellow-400" /> : '—' },
  ];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar currentPath="/admin/projects" role={user.role} />
      <div className="flex-1 ml-64">
        <AdminHeader title="Projects" user={user} />
        <main className="p-6 bg-[#E6E1D7] min-h-screen">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-xs text-neutral-500 font-mono-tech uppercase tracking-widest">{items.length} projects</p>
            <button onClick={openAdd} className="btn-primary flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-bold">
              <Plus size={16} /> Add Project
            </button>
          </div>

          {loading ? <LoadingSpinner /> : (
            <DataTable columns={columns} data={items as unknown as Record<string, unknown>[]} onEdit={(r) => openEdit(r as unknown as Project)} onDelete={(r) => setDeleteTarget(r as unknown as Project)} emptyMessage="No projects found" />
          )}
        </main>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Project' : 'Add Project'} maxWidth="max-w-3xl">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Name</label><input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="col-span-2"><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Description</label><textarea className="admin-input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="col-span-2"><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Technology Stack</label><input className="admin-input" value={form.technologyStack} onChange={(e) => setForm({ ...form, technologyStack: e.target.value })} placeholder="e.g. React, Node.js, MongoDB" /></div>
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
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Team Members</label><input className="admin-input" value={form.teamMembers} onChange={(e) => setForm({ ...form, teamMembers: e.target.value })} /></div>
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">GitHub Link</label><input className="admin-input" value={form.githubLink} onChange={(e) => setForm({ ...form, githubLink: e.target.value })} /></div>
            <div><label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Demo Link</label><input className="admin-input" value={form.demoLink} onChange={(e) => setForm({ ...form, demoLink: e.target.value })} /></div>
            <div className="col-span-2 flex items-center gap-2">
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4 rounded-sm border-black/20 text-[#D92525] focus:ring-[#D92525]" />
              <label htmlFor="featured" className="text-sm font-medium text-[#121110] font-mono-tech">Featured Project</label>
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

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Project" message={`Delete "${deleteTarget?.name}"?`} />
    </div>
  );
}

export default function ProjectsPage() {
  return <ToastProvider><ProjectsContent /></ToastProvider>;
}
