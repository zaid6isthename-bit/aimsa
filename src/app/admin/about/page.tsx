'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import { useToast, ToastProvider } from '@/components/admin/Toast';
import { Save, Plus, Trash2 } from 'lucide-react';

interface TimelineEvent {
  year: string;
  title: string;
  desc: string;
}

function AboutContent() {
  const { toast } = useToast();
  const [user, setUser] = useState({ name: 'Admin', role: 'admin' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');
  const [description, setDescription] = useState('');
  const [whoHeading, setWhoHeading] = useState('');
  const [whoP1, setWhoP1] = useState('');
  const [whoP2, setWhoP2] = useState('');
  const [quote, setQuote] = useState('');
  const [vision, setVision] = useState('');
  const [mission, setMission] = useState('');
  const [values, setValues] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/about').then(r => r.json()),
      fetch('/api/admin/auth/me').then(r => r.json()),
    ]).then(([aboutData, userData]) => {
      const a = aboutData.about || {};
      setHeading(a.about_heading || 'ABOUT AIMSA');
      setSubheading(a.about_subheading || 'OFFICIAL FIELD-JOURNAL ARCHIVE');
      setDescription(a.about_description || '');
      setWhoHeading(a.about_who_we_are_heading || 'WHO WE ARE & OUR ORIGIN');
      setWhoP1(a.about_who_we_are_p1 || '');
      setWhoP2(a.about_who_we_are_p2 || '');
      setQuote(a.about_quote || '"Not just code—culture, grit and community."');
      setVision(a.about_vision || '');
      setMission(a.about_mission || '');
      setValues(a.about_values || '');
      setImageUrl(a.about_image_url || '');
      try { setTimeline(JSON.parse(a.about_timeline || '[]')); } catch { setTimeline([]); }
      if (userData.user) setUser(userData.user);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          about_heading: heading,
          about_subheading: subheading,
          about_description: description,
          about_who_we_are_heading: whoHeading,
          about_who_we_are_p1: whoP1,
          about_who_we_are_p2: whoP2,
          about_quote: quote,
          about_vision: vision,
          about_mission: mission,
          about_values: values,
          about_image_url: imageUrl,
          about_timeline: JSON.stringify(timeline),
        }),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'About page updated', type: 'success' });
    } catch {
      toast({ title: 'Failed to save', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const addTimelineEvent = () => setTimeline([...timeline, { year: '', title: '', desc: '' }]);
  const removeTimelineEvent = (i: number) => setTimeline(timeline.filter((_, idx) => idx !== i));
  const updateTimelineEvent = (i: number, field: keyof TimelineEvent, value: string) => {
    const updated = [...timeline];
    updated[i] = { ...updated[i], [field]: value };
    setTimeline(updated);
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar currentPath="/admin/about" role={user.role} />
      <div className="flex-1 ml-64">
        <AdminHeader title="About Page" user={user} />
        <main className="p-6 bg-[#E6E1D7] min-h-screen">
          {loading ? <LoadingSpinner /> : (
            <div className="space-y-8 max-w-4xl">
              {/* Hero Section */}
              <section className="bg-[#FAF8F5] border border-black/15 rounded-sm p-6 space-y-4">
                <h3 className="font-syne font-bold text-sm uppercase tracking-widest text-[#D92525]">Hero Section</h3>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Subheading</label>
                  <input className="admin-input" value={subheading} onChange={e => setSubheading(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Heading</label>
                  <input className="admin-input" value={heading} onChange={e => setHeading(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Description</label>
                  <textarea className="admin-input" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
                </div>
              </section>

              {/* Who We Are */}
              <section className="bg-[#FAF8F5] border border-black/15 rounded-sm p-6 space-y-4">
                <h3 className="font-syne font-bold text-sm uppercase tracking-widest text-[#D92525]">Who We Are Section</h3>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Section Heading</label>
                  <input className="admin-input" value={whoHeading} onChange={e => setWhoHeading(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Paragraph 1</label>
                  <textarea className="admin-input" rows={3} value={whoP1} onChange={e => setWhoP1(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Paragraph 2</label>
                  <textarea className="admin-input" rows={3} value={whoP2} onChange={e => setWhoP2(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Quote</label>
                  <input className="admin-input" value={quote} onChange={e => setQuote(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Image URL</label>
                  <input className="admin-input" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
                </div>
              </section>

              {/* Vision, Mission, Values */}
              <section className="bg-[#FAF8F5] border border-black/15 rounded-sm p-6 space-y-4">
                <h3 className="font-syne font-bold text-sm uppercase tracking-widest text-[#D92525]">Vision, Mission & Values</h3>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Vision</label>
                  <textarea className="admin-input" rows={3} value={vision} onChange={e => setVision(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Mission</label>
                  <textarea className="admin-input" rows={3} value={mission} onChange={e => setMission(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Values</label>
                  <textarea className="admin-input" rows={3} value={values} onChange={e => setValues(e.target.value)} />
                </div>
              </section>

              {/* Timeline */}
              <section className="bg-[#FAF8F5] border border-black/15 rounded-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-syne font-bold text-sm uppercase tracking-widest text-[#D92525]">Timeline & Milestones</h3>
                  <button onClick={addTimelineEvent} className="flex items-center gap-1 text-xs font-mono-tech font-bold text-[#D92525] hover:underline">
                    <Plus size={14} /> Add Event
                  </button>
                </div>
                {timeline.map((t, i) => (
                  <div key={i} className="grid grid-cols-12 gap-3 items-start border border-black/10 rounded-sm p-3 bg-white/50">
                    <div className="col-span-2">
                      <label className="mb-1 block text-[10px] font-semibold text-[#121110] uppercase font-mono-tech">Year</label>
                      <input className="admin-input text-xs" value={t.year} onChange={e => updateTimelineEvent(i, 'year', e.target.value)} />
                    </div>
                    <div className="col-span-4">
                      <label className="mb-1 block text-[10px] font-semibold text-[#121110] uppercase font-mono-tech">Title</label>
                      <input className="admin-input text-xs" value={t.title} onChange={e => updateTimelineEvent(i, 'title', e.target.value)} />
                    </div>
                    <div className="col-span-5">
                      <label className="mb-1 block text-[10px] font-semibold text-[#121110] uppercase font-mono-tech">Description</label>
                      <input className="admin-input text-xs" value={t.desc} onChange={e => updateTimelineEvent(i, 'desc', e.target.value)} />
                    </div>
                    <div className="col-span-1 flex items-end justify-center">
                      <button onClick={() => removeTimelineEvent(i)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-sm"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </section>

              {/* Save */}
              <div className="flex justify-end">
                <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 rounded-sm px-6 py-2.5 text-sm font-bold disabled:opacity-50">
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return <ToastProvider><AboutContent /></ToastProvider>;
}
