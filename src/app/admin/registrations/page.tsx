'use client';

import { useEffect, useState, useMemo } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import Modal from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import { useToast, ToastProvider } from '@/components/admin/Toast';
import {
  ClipboardList,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  Users,
  Calendar,
  ToggleLeft,
  ToggleRight,
  UserCheck,
  FileSpreadsheet,
  AlertCircle,
  Hash,
  Mail,
  Phone,
  GraduationCap,
} from 'lucide-react';

interface EventRegistration {
  id: string;
  eventId?: string | null;
  eventTitle: string;
  eventSlug: string;
  name: string;
  email: string;
  phone: string;
  rollNumber: string;
  year: string;
  branch: string;
  teamName: string;
  teamMembers: string;
  customAnswers: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface EventItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  venue: string;
  attendeeCount: number;
  registrationOpen: boolean;
  maxCapacity: number;
  liveRegistrationCount?: number;
}

function RegistrationsContent() {
  const { toast } = useToast();
  const [user, setUser] = useState({ name: 'Admin', role: 'admin' });
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedEventId, setSelectedEventId] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [viewItem, setViewItem] = useState<EventRegistration | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EventRegistration | null>(null);
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    eventId: '',
    name: '',
    email: '',
    phone: '',
    rollNumber: '',
    year: '1st Year',
    branch: 'AI & ML',
    teamName: '',
    status: 'confirmed',
    notes: '',
  });
  const [submittingManual, setSubmittingManual] = useState(false);

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/registrations');
      const data = await res.json();
      if (res.ok) {
        setRegistrations(data.registrations || []);
        setEvents(data.events || []);
      } else {
        toast({ title: data.error || 'Failed to load registrations', type: 'error' });
      }
    } catch {
      toast({ title: 'Failed to connect to registrations server', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetch('/api/admin/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setUser(d.user);
      })
      .catch(() => {});
  }, []);

  // Filtered registrations
  const filtered = useMemo(() => {
    return registrations.filter((r) => {
      const matchEvent =
        selectedEventId === 'all' ||
        r.eventId === selectedEventId ||
        r.eventSlug === selectedEventId;
      const matchStatus =
        selectedStatus === 'all' || r.status === selectedStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.rollNumber.toLowerCase().includes(q) ||
        r.eventTitle.toLowerCase().includes(q) ||
        r.teamName.toLowerCase().includes(q);

      return matchEvent && matchStatus && matchQuery;
    });
  }, [registrations, selectedEventId, selectedStatus, searchQuery]);

  // Toggle event registration status (Live / Closed)
  const toggleEventRegistration = async (event: EventItem) => {
    const newState = !event.registrationOpen;
    try {
      const res = await fetch(`/api/admin/events/${event.id}/toggle-registration`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationOpen: newState }),
      });
      const data = await res.json();
      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) =>
            e.id === event.id ? { ...e, registrationOpen: newState } : e
          )
        );
        toast({
          title: `${event.title.slice(0, 24)}... registrations are now ${newState ? 'LIVE (OPEN)' : 'CLOSED'}`,
          type: 'success',
        });
      } else {
        toast({ title: data.error || 'Failed to update status', type: 'error' });
      }
    } catch {
      toast({ title: 'Network error updating event status', type: 'error' });
    }
  };

  // Update registration status
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setRegistrations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
        if (viewItem && viewItem.id === id) {
          setViewItem({ ...viewItem, status: newStatus });
        }
        toast({ title: `Status changed to ${newStatus}`, type: 'success' });
      } else {
        toast({ title: 'Failed to update status', type: 'error' });
      }
    } catch {
      toast({ title: 'Network error updating status', type: 'error' });
    }
  };

  // Delete registration
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/registrations/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setRegistrations((prev) => prev.filter((r) => r.id !== deleteTarget.id));
        toast({ title: 'Registration entry deleted', type: 'success' });
        setDeleteTarget(null);
      } else {
        toast({ title: 'Failed to delete registration', type: 'error' });
      }
    } catch {
      toast({ title: 'Network error', type: 'error' });
    }
  };

  // Create manual walk-in registration
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.eventId) {
      toast({ title: 'Please select an event', type: 'error' });
      return;
    }
    setSubmittingManual(true);
    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manualForm),
      });
      const data = await res.json();
      if (res.ok) {
        setRegistrations((prev) => [data.registration, ...prev]);
        setManualModalOpen(false);
        setManualForm({
          eventId: '',
          name: '',
          email: '',
          phone: '',
          rollNumber: '',
          year: '1st Year',
          branch: 'AI & ML',
          teamName: '',
          status: 'confirmed',
          notes: '',
        });
        toast({ title: 'Attendee registered successfully!', type: 'success' });
      } else {
        toast({ title: data.error || 'Failed to register', type: 'error' });
      }
    } catch {
      toast({ title: 'Network error', type: 'error' });
    } finally {
      setSubmittingManual(false);
    }
  };

  // Export to CSV (Like Google Forms / Google Sheets)
  const exportToCSV = () => {
    if (filtered.length === 0) {
      toast({ title: 'No registrations to export', type: 'error' });
      return;
    }

    const headers = [
      'Registration ID',
      'Event Title',
      'Student Name',
      'Email',
      'Phone',
      'Roll Number (USN)',
      'Year',
      'Branch',
      'Team Name',
      'Status',
      'Registered Date',
      'Notes',
    ];

    const rows = filtered.map((r) => [
      `"${r.id}"`,
      `"${(r.eventTitle || '').replace(/"/g, '""')}"`,
      `"${(r.name || '').replace(/"/g, '""')}"`,
      `"${(r.email || '').replace(/"/g, '""')}"`,
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      `"${(r.rollNumber || '').replace(/"/g, '""')}"`,
      `"${(r.year || '').replace(/"/g, '""')}"`,
      `"${(r.branch || '').replace(/"/g, '""')}"`,
      `"${(r.teamName || '').replace(/"/g, '""')}"`,
      `"${(r.status || '').toUpperCase()}"`,
      `"${new Date(r.createdAt).toLocaleString('en-IN')}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const filename = `aimsa_registrations_${selectedEventId === 'all' ? 'all_events' : selectedEventId}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: `Exported ${filtered.length} responses to ${filename}`,
      type: 'success',
    });
  };

  // Metrics
  const totalCount = registrations.length;
  const confirmedCount = registrations.filter(
    (r) => r.status === 'confirmed' || r.status === 'attended'
  ).length;
  const attendedCount = registrations.filter((r) => r.status === 'attended').length;
  const liveEventsCount = events.filter((e) => e.registrationOpen !== false).length;

  return (
    <div className="flex min-h-screen bg-[#0F0E0D] text-white">
      <AdminSidebar currentPath="/admin/registrations" role={user.role} />

      <div className="flex-1 pl-64 flex flex-col min-w-0">
        <AdminHeader title="Registrations & Forms" user={user} />

        <main className="p-6 sm:p-8 space-y-8 max-w-7xl w-full">
          {/* Top Banner & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2 text-[#D92525] font-mono-tech text-xs uppercase tracking-widest font-bold mb-1">
                <ClipboardList className="w-4 h-4" />
                <span>STUDENT INTAKE & FORM CENTER</span>
              </div>
              <h1 className="font-syne font-black text-2xl sm:text-3xl uppercase tracking-tight text-white">
                EVENT REGISTRATIONS & FORMS
              </h1>
              <p className="font-mono-tech text-xs text-neutral-400 mt-1">
                Manage live form enrollment, view responses, take walk-in RSVPs, and export data.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={exportToCSV}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-600 hover:text-white transition-all font-mono-tech text-xs font-bold uppercase tracking-wider"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export CSV ({filtered.length})</span>
              </button>

              <button
                onClick={() => setManualModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D92525] hover:bg-[#B81D1D] text-white transition-all font-mono-tech text-xs font-bold uppercase tracking-wider shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Walk-In RSVP</span>
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="font-mono-tech text-[10px] uppercase tracking-wider text-neutral-400">
                Total Submissions
              </span>
              <p className="font-syne font-black text-3xl text-white">
                {totalCount}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="font-mono-tech text-[10px] uppercase tracking-wider text-emerald-400">
                Confirmed RSVPs
              </span>
              <p className="font-syne font-black text-3xl text-emerald-400">
                {confirmedCount}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="font-mono-tech text-[10px] uppercase tracking-wider text-cyan-400">
                Checked In / Attended
              </span>
              <p className="font-syne font-black text-3xl text-cyan-400">
                {attendedCount}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="font-mono-tech text-[10px] uppercase tracking-wider text-amber-400">
                Active Live Forms
              </span>
              <p className="font-syne font-black text-3xl text-amber-400">
                {liveEventsCount} / {events.length}
              </p>
            </div>
          </div>

          {/* Live Form Enrollment Switcher (Google Forms Live Enrollment) */}
          <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-syne font-bold text-base uppercase text-white tracking-wide">
                  Live Event Enrollment Controls
                </h3>
              </div>
              <span className="font-mono-tech text-xs text-neutral-400">
                Turn registrations on/off instantly for users
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((evt) => {
                const count = registrations.filter(
                  (r) => r.eventId === evt.id || r.eventSlug === evt.slug
                ).length;
                const isLive = evt.registrationOpen !== false;

                return (
                  <div
                    key={evt.id}
                    className={`p-4 rounded-lg border transition-all flex flex-col justify-between ${
                      isLive
                        ? 'bg-white/[0.03] border-white/15'
                        : 'bg-white/[0.01] border-white/5 opacity-70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono-tech font-bold bg-white/10 text-neutral-300">
                          {evt.category}
                        </span>
                        <button
                          onClick={() => toggleEventRegistration(evt)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono-tech font-bold uppercase transition-all ${
                            isLive
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                              : 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
                          }`}
                        >
                          {isLive ? (
                            <>
                              <ToggleRight className="w-3.5 h-3.5" />
                              <span>LIVE (OPEN)</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-3.5 h-3.5" />
                              <span>CLOSED</span>
                            </>
                          )}
                        </button>
                      </div>

                      <h4 className="font-syne font-bold text-sm text-white line-clamp-1">
                        {evt.title}
                      </h4>
                      <p className="font-mono-tech text-[11px] text-neutral-400 mt-0.5">
                        {evt.date} • {evt.venue}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between font-mono-tech text-xs">
                      <span className="text-neutral-400">Responses:</span>
                      <span className="font-bold text-white">
                        {count} registered
                        {evt.maxCapacity > 0 ? ` / ${evt.maxCapacity} cap` : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submissions Filter & Search Bar */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Event Filter */}
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="px-3 py-2 bg-neutral-900 border border-white/15 rounded-lg text-xs font-mono-tech text-white focus:outline-none focus:border-[#D92525]"
              >
                <option value="all">All Events ({registrations.length})</option>
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title.slice(0, 32)}...
                  </option>
                ))}
              </select>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 font-mono-tech text-xs">
                {['all', 'confirmed', 'attended', 'waitlisted', 'cancelled'].map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => setSelectedStatus(st)}
                      className={`px-3 py-1.5 rounded-md uppercase font-bold text-[11px] transition-colors ${
                        selectedStatus === st
                          ? 'bg-[#D92525] text-white'
                          : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search name, email, roll no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-white/15 rounded-lg text-xs font-mono-tech text-white placeholder-neutral-500 focus:outline-none focus:border-[#D92525]"
              />
            </div>
          </div>

          {/* Registrations Data Table */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
            {loading ? (
              <div className="py-16 text-center text-neutral-400 font-mono-tech text-xs uppercase flex items-center justify-center gap-2">
                <LoadingSpinner />
                <span>Loading responses...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-neutral-500 mx-auto" />
                <p className="font-syne font-bold text-white text-lg uppercase">
                  No Responses Found
                </p>
                <p className="font-mono-tech text-xs text-neutral-400">
                  Try clearing your search query or selecting a different event.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono-tech text-xs">
                  <thead className="bg-white/5 border-b border-white/10 text-neutral-400 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4 font-bold">Student Name</th>
                      <th className="py-3 px-4 font-bold">Event</th>
                      <th className="py-3 px-4 font-bold">Email / Phone</th>
                      <th className="py-3 px-4 font-bold">USN / Branch</th>
                      <th className="py-3 px-4 font-bold">Team / Role</th>
                      <th className="py-3 px-4 font-bold">Status</th>
                      <th className="py-3 px-4 font-bold">Date</th>
                      <th className="py-3 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-neutral-300">
                    {filtered.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-white/[0.03] transition-colors group"
                      >
                        {/* Name & Year */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white uppercase text-xs">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-neutral-400">
                            {item.year}
                          </div>
                        </td>

                        {/* Event */}
                        <td className="py-3.5 px-4 max-w-[200px]">
                          <span className="font-syne font-bold text-white line-clamp-1 text-xs">
                            {item.eventTitle}
                          </span>
                        </td>

                        {/* Email & Phone */}
                        <td className="py-3.5 px-4">
                          <div className="text-neutral-300 font-medium">
                            {item.email}
                          </div>
                          {item.phone && (
                            <div className="text-[10px] text-neutral-400">
                              {item.phone}
                            </div>
                          )}
                        </td>

                        {/* Roll Number & Branch */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-amber-300/90 text-xs">
                            {item.rollNumber || '—'}
                          </div>
                          <div className="text-[10px] text-neutral-400">
                            {item.branch}
                          </div>
                        </td>

                        {/* Team Name */}
                        <td className="py-3.5 px-4">
                          {item.teamName ? (
                            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[10px] uppercase">
                              {item.teamName}
                            </span>
                          ) : (
                            <span className="text-neutral-500 text-[10px] uppercase">
                              Solo
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                              item.status === 'confirmed'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : item.status === 'attended'
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                : item.status === 'waitlisted'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-neutral-400 text-[11px] whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Mark Attended Quick Button */}
                            {item.status !== 'attended' && (
                              <button
                                onClick={() => updateStatus(item.id, 'attended')}
                                className="p-1.5 rounded hover:bg-cyan-500/20 text-neutral-400 hover:text-cyan-400 transition-colors"
                                title="Mark as Attended / Checked-In"
                              >
                                <UserCheck className="w-4 h-4" />
                              </button>
                            )}

                            {/* View Detail */}
                            <button
                              onClick={() => setViewItem(item)}
                              className="p-1.5 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                              title="View Full Submission"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => setDeleteTarget(item)}
                              className="p-1.5 rounded hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors"
                              title="Delete Submission"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Submission Detail Modal */}
      {viewItem && (
        <Modal
          isOpen={Boolean(viewItem)}
          onClose={() => setViewItem(null)}
          title="REGISTRATION SUBMISSION DETAILS"
        >
          <div className="space-y-6 font-mono-tech text-xs text-neutral-200">
            {/* Header Badge */}
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase block font-bold">
                  EVENT
                </span>
                <h3 className="font-syne font-bold text-lg text-white">
                  {viewItem.eventTitle}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 uppercase block font-bold">
                  SUBMISSION ID
                </span>
                <span className="font-bold text-amber-400">
                  #{viewItem.id.slice(0, 8)}
                </span>
              </div>
            </div>

            {/* Student Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-white/[0.03] border border-white/10">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase block font-bold">
                  FULL NAME
                </span>
                <p className="font-bold text-white text-sm mt-0.5">{viewItem.name}</p>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 uppercase block font-bold">
                  EMAIL ADDRESS
                </span>
                <p className="font-bold text-white text-sm mt-0.5">{viewItem.email}</p>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 uppercase block font-bold">
                  PHONE / WHATSAPP
                </span>
                <p className="font-bold text-white mt-0.5">
                  {viewItem.phone || 'Not Provided'}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 uppercase block font-bold">
                  USN / ROLL NUMBER
                </span>
                <p className="font-bold text-amber-300 mt-0.5">
                  {viewItem.rollNumber || 'Not Provided'}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 uppercase block font-bold">
                  YEAR OF STUDY
                </span>
                <p className="font-bold text-white mt-0.5">{viewItem.year}</p>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 uppercase block font-bold">
                  BRANCH / DEPARTMENT
                </span>
                <p className="font-bold text-white mt-0.5">{viewItem.branch}</p>
              </div>
            </div>

            {/* Team Info if present */}
            {viewItem.teamName && (
              <div className="p-4 rounded-lg bg-purple-900/20 border border-purple-500/30 space-y-1">
                <span className="text-[10px] text-purple-300 uppercase block font-bold">
                  TEAM REGISTRATION
                </span>
                <h4 className="font-bold text-white text-sm">{viewItem.teamName}</h4>
                {viewItem.teamMembers && (
                  <p className="text-[11px] text-neutral-300 mt-1">
                    Teammates: {viewItem.teamMembers}
                  </p>
                )}
              </div>
            )}

            {/* Notes / Special Requests */}
            {viewItem.notes && (
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase block font-bold">
                  STUDENT NOTES / QUESTIONS
                </span>
                <p className="text-neutral-300">{viewItem.notes}</p>
              </div>
            )}

            {/* Status Switcher inside Modal */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-neutral-400 text-xs">Update Status:</span>
                <select
                  value={viewItem.status}
                  onChange={(e) => updateStatus(viewItem.id, e.target.value)}
                  className="px-3 py-1.5 bg-neutral-900 border border-white/20 rounded text-xs text-white uppercase font-bold"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="attended">Attended</option>
                  <option value="waitlisted">Waitlisted</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <span className="text-[11px] text-neutral-500">
                Registered: {new Date(viewItem.createdAt).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Walk-In RSVP Modal */}
      {manualModalOpen && (
        <Modal
          isOpen={manualModalOpen}
          onClose={() => setManualModalOpen(false)}
          title="ADD MANUAL / WALK-IN RSVP"
        >
          <form onSubmit={handleManualSubmit} className="space-y-4 font-mono-tech text-xs">
            <div>
              <label className="block text-neutral-300 uppercase font-bold mb-1">
                Select Event *
              </label>
              <select
                required
                value={manualForm.eventId}
                onChange={(e) =>
                  setManualForm({ ...manualForm, eventId: e.target.value })
                }
                className="w-full px-3 py-2 bg-neutral-900 border border-white/15 rounded text-white focus:outline-none focus:border-[#D92525]"
              >
                <option value="">-- Choose Event --</option>
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title} ({evt.date})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 uppercase font-bold mb-1">
                  Student Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={manualForm.name}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/15 rounded text-white focus:outline-none focus:border-[#D92525]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 uppercase font-bold mb-1">
                  College Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="aarav@college.edu"
                  value={manualForm.email}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, email: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/15 rounded text-white focus:outline-none focus:border-[#D92525]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 uppercase font-bold mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={manualForm.phone}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/15 rounded text-white focus:outline-none focus:border-[#D92525]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 uppercase font-bold mb-1">
                  Roll Number / USN
                </label>
                <input
                  type="text"
                  placeholder="1MS23AI045"
                  value={manualForm.rollNumber}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, rollNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/15 rounded text-white focus:outline-none focus:border-[#D92525]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 uppercase font-bold mb-1">
                  Year
                </label>
                <select
                  value={manualForm.year}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, year: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/15 rounded text-white focus:outline-none focus:border-[#D92525]"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 uppercase font-bold mb-1">
                  Initial Status
                </label>
                <select
                  value={manualForm.status}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, status: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/15 rounded text-white focus:outline-none focus:border-[#D92525]"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="attended">Attended (On-Spot Check-in)</option>
                  <option value="waitlisted">Waitlisted</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 uppercase font-bold mb-1">
                Admin Notes
              </label>
              <textarea
                rows={2}
                placeholder="Walk-in registration at venue..."
                value={manualForm.notes}
                onChange={(e) =>
                  setManualForm({ ...manualForm, notes: e.target.value })
                }
                className="w-full px-3 py-2 bg-neutral-900 border border-white/15 rounded text-white focus:outline-none focus:border-[#D92525]"
              />
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setManualModalOpen(false)}
                className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-neutral-300 uppercase font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingManual}
                className="px-5 py-2 rounded bg-[#D92525] hover:bg-[#B81D1D] text-white font-bold uppercase disabled:opacity-50"
              >
                {submittingManual ? 'Registering...' : 'Register Attendee'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Registration"
        message={`Are you sure you want to delete the registration for ${deleteTarget?.name}? This action cannot be undone.`}
      />
    </div>
  );
}

export default function AdminRegistrationsPage() {
  return (
    <ToastProvider>
      <RegistrationsContent />
    </ToastProvider>
  );
}
