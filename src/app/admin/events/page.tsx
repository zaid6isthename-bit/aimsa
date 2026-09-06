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

const categories = ['Technical', 'Cultural', 'Workshop', 'Seminar', 'Competition', 'Social'];
const scheduleStatuses = ['upcoming', 'ongoing', 'completed'];

interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  shortDesc: string;
  fullStory: string;
  coverUrl: string;
  registrationUrl: string;
  featured: boolean;
  status: string;
  scheduleStatus: string;
  organizers: string;
  rules: string;
  results: string;
}

const emptyEvent: Event = {
  id: '',
  title: '',
  category: 'Technical',
  date: '',
  time: '',
  venue: '',
  shortDesc: '',
  fullStory: '',
  coverUrl: '',
  registrationUrl: '',
  featured: false,
  status: 'draft',
  scheduleStatus: 'upcoming',
  organizers: '',
  rules: '',
  results: '',
};

function EventsContent() {
  const { toast } = useToast();
  const [user, setUser] = useState({ name: 'Admin', role: 'admin' });
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [form, setForm] = useState<Event>(emptyEvent);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/admin/events');
      const data = await res.json();
      setEvents(data.events || data || []);
    } catch {
      toast({ title: 'Failed to load events', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetch('/api/admin/auth/me')
      .then((r) => r.json())
      .then((d) => { if (d.user) setUser(d.user); })
      .catch(() => {});
  }, []);

  const filtered = filter === 'all' ? events : events.filter((e) => e.status === filter);

  const openAdd = () => {
    setEditingEvent(null);
    setForm(emptyEvent);
    setModalOpen(true);
  };

  const openEdit = (event: Event) => {
    setEditingEvent(event);
    setForm({ ...event });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = editingEvent ? 'PUT' : 'POST';
      const url = editingEvent ? `/api/admin/events/${editingEvent.id}` : '/api/admin/events';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      toast({ title: editingEvent ? 'Event updated' : 'Event created', type: 'success' });
      setModalOpen(false);
      fetchEvents();
    } catch {
      toast({ title: 'Failed to save event', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/admin/events/${deleteTarget.id}`, { method: 'DELETE' });
      toast({ title: 'Event deleted', type: 'success' });
      fetchEvents();
    } catch {
      toast({ title: 'Failed to delete event', type: 'error' });
    }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
    { key: 'date', label: 'Date', render: (v: unknown) => v ? new Date(v as string).toLocaleDateString() : '—' },
    { key: 'status', label: 'Status', render: (v: unknown) => <StatusBadge status={v as string} /> },
    { key: 'featured', label: 'Featured', render: (v: unknown) => v ? <Star size={16} className="fill-yellow-400 text-yellow-400" /> : '—' },
  ];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar currentPath="/admin/events" role={user.role} />
      <div className="flex-1 ml-64">
        <AdminHeader title="Events Management" user={user} />
        <main className="p-6 bg-[#E6E1D7] min-h-screen">
          {/* Filter Tabs */}
          <div className="mb-6 flex items-center gap-2">
            {['all', 'draft', 'published', 'archived'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`rounded-sm px-4 py-2 text-xs font-bold uppercase tracking-widest font-mono-tech transition-colors ${
                  filter === tab
                    ? 'bg-[#121110] text-white'
                    : 'bg-[#FAF8F5] text-neutral-800 border border-black/10 hover:bg-neutral-100'
                }`}
              >
                {tab}
              </button>
            ))}
            <div className="ml-auto">
              <button
                onClick={openAdd}
                className="btn-primary flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-bold transition-colors"
              >
                <Plus size={16} />
                Add Event
              </button>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <DataTable
              columns={columns}
              data={filtered as unknown as Record<string, unknown>[]}
              onEdit={(row) => openEdit(row as unknown as Event)}
              onDelete={(row) => setDeleteTarget(row as unknown as Event)}
              emptyMessage="No events found"
            />
          )}
        </main>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingEvent ? 'Edit Event' : 'Add Event'}
        maxWidth="max-w-3xl"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Title</label>
              <input className="admin-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Category</label>
              <select className="admin-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Date</label>
              <input type="date" className="admin-input" value={form.date?.split('T')[0] || ''} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Time</label>
              <input className="admin-input" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Venue</label>
              <input className="admin-input" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Short Description</label>
              <textarea className="admin-input" rows={2} value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Full Story</label>
              <textarea className="admin-input" rows={4} value={form.fullStory} onChange={(e) => setForm({ ...form, fullStory: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Cover URL</label>
              <input className="admin-input" value={form.coverUrl} onChange={(e) => setForm({ ...form, coverUrl: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Registration URL</label>
              <input className="admin-input" value={form.registrationUrl} onChange={(e) => setForm({ ...form, registrationUrl: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Status</label>
              <select className="admin-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Schedule Status</label>
              <select className="admin-input" value={form.scheduleStatus} onChange={(e) => setForm({ ...form, scheduleStatus: e.target.value })}>
                {scheduleStatuses.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Organizers</label>
              <input className="admin-input" value={form.organizers} onChange={(e) => setForm({ ...form, organizers: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Rules</label>
              <textarea className="admin-input" rows={3} value={form.rules} onChange={(e) => setForm({ ...form, rules: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Results</label>
              <textarea className="admin-input" rows={3} value={form.results} onChange={(e) => setForm({ ...form, results: e.target.value })} />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="h-4 w-4 rounded-sm border-black/20 text-[#D92525] focus:ring-[#D92525]"
              />
              <label htmlFor="featured" className="text-sm font-medium text-[#121110] font-mono-tech">Featured Event</label>
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t border-black/10 pt-4">
            <button onClick={() => setModalOpen(false)} className="btn-secondary rounded-sm px-4 py-2 text-sm font-medium">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary rounded-sm px-4 py-2 text-sm font-bold disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingEvent ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Event"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}

export default function EventsPage() {
  return (
    <ToastProvider>
      <EventsContent />
    </ToastProvider>
  );
}
