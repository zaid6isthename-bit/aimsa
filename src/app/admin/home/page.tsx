'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import { useToast, ToastProvider } from '@/components/admin/Toast';
import { Save } from 'lucide-react';

function HomeContent() {
  const { toast } = useToast();
  const [user, setUser] = useState({ name: 'Admin', role: 'admin' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [heroHeading, setHeroHeading] = useState('');
  const [heroTagline, setHeroTagline] = useState('');
  const [heroBadge, setHeroBadge] = useState('');
  const [whoHeading, setWhoHeading] = useState('');
  const [whoText, setWhoText] = useState('');
  const [whoImage, setWhoImage] = useState('');
  const [eventsHeading, setEventsHeading] = useState('');
  const [eventsNumber, setEventsNumber] = useState('');
  const [peopleHeading, setPeopleHeading] = useState('');
  const [peopleNumber, setPeopleNumber] = useState('');
  const [achHeading, setAchHeading] = useState('');
  const [achNumber, setAchNumber] = useState('');
  const [galHeading, setGalHeading] = useState('');
  const [galNumber, setGalNumber] = useState('');
  const [ctaHeading, setCtaHeading] = useState('');
  const [ctaText, setCtaText] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/home').then(r => r.json()),
      fetch('/api/admin/auth/me').then(r => r.json()),
    ]).then(([data, userData]) => {
      const h = data.home || {};
      setHeroHeading(h.home_hero_heading || '');
      setHeroTagline(h.home_hero_tagline || '');
      setHeroBadge(h.home_hero_badge || '');
      setWhoHeading(h.home_who_heading || '');
      setWhoText(h.home_who_text || '');
      setWhoImage(h.home_who_image_url || '');
      setEventsHeading(h.home_events_heading || '');
      setEventsNumber(h.home_events_number || '');
      setPeopleHeading(h.home_people_heading || '');
      setPeopleNumber(h.home_people_number || '');
      setAchHeading(h.home_achievements_heading || '');
      setAchNumber(h.home_achievements_number || '');
      setGalHeading(h.home_gallery_heading || '');
      setGalNumber(h.home_gallery_number || '');
      setCtaHeading(h.home_cta_heading || '');
      setCtaText(h.home_cta_text || '');
      if (userData.user) setUser(userData.user);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          home_hero_heading: heroHeading,
          home_hero_tagline: heroTagline,
          home_hero_badge: heroBadge,
          home_who_heading: whoHeading,
          home_who_text: whoText,
          home_who_image_url: whoImage,
          home_events_heading: eventsHeading,
          home_events_number: eventsNumber,
          home_people_heading: peopleHeading,
          home_people_number: peopleNumber,
          home_achievements_heading: achHeading,
          home_achievements_number: achNumber,
          home_gallery_heading: galHeading,
          home_gallery_number: galNumber,
          home_cta_heading: ctaHeading,
          home_cta_text: ctaText,
        }),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Home page updated', type: 'success' });
    } catch {
      toast({ title: 'Failed to save', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar currentPath="/admin/home" role={user.role} />
      <div className="flex-1 ml-64">
        <AdminHeader title="Home Page" user={user} />
        <main className="p-6 bg-[#E6E1D7] min-h-screen">
          {loading ? <LoadingSpinner /> : (
            <div className="space-y-8 max-w-4xl">
              {/* Hero Section */}
              <section className="bg-[#FAF8F5] border border-black/15 rounded-sm p-6 space-y-4">
                <h3 className="font-syne font-bold text-sm uppercase tracking-widest text-[#D92525]">Hero Section</h3>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Heading</label>
                  <input className="admin-input" value={heroHeading} onChange={e => setHeroHeading(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Tagline</label>
                  <textarea className="admin-input" rows={2} value={heroTagline} onChange={e => setHeroTagline(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Badge Text</label>
                  <input className="admin-input" value={heroBadge} onChange={e => setHeroBadge(e.target.value)} />
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
                  <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Description</label>
                  <textarea className="admin-input" rows={3} value={whoText} onChange={e => setWhoText(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Image URL</label>
                  <input className="admin-input" value={whoImage} onChange={e => setWhoImage(e.target.value)} />
                </div>
              </section>

              {/* Section Headings */}
              <section className="bg-[#FAF8F5] border border-black/15 rounded-sm p-6 space-y-4">
                <h3 className="font-syne font-bold text-sm uppercase tracking-widest text-[#D92525]">Section Headings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Events Number</label>
                    <input className="admin-input" value={eventsNumber} onChange={e => setEventsNumber(e.target.value)} placeholder="02." />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Events Heading</label>
                    <input className="admin-input" value={eventsHeading} onChange={e => setEventsHeading(e.target.value)} placeholder="EVENT ECOSYSTEM" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">People Number</label>
                    <input className="admin-input" value={peopleNumber} onChange={e => setPeopleNumber(e.target.value)} placeholder="03." />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">People Heading</label>
                    <input className="admin-input" value={peopleHeading} onChange={e => setPeopleHeading(e.target.value)} placeholder="PERSONNEL ARCHIVE" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Achievements Number</label>
                    <input className="admin-input" value={achNumber} onChange={e => setAchNumber(e.target.value)} placeholder="04." />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Achievements Heading</label>
                    <input className="admin-input" value={achHeading} onChange={e => setAchHeading(e.target.value)} placeholder="WALL OF FAME" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Gallery Number</label>
                    <input className="admin-input" value={galNumber} onChange={e => setGalNumber(e.target.value)} placeholder="05." />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Gallery Heading</label>
                    <input className="admin-input" value={galHeading} onChange={e => setGalHeading(e.target.value)} placeholder="VISUAL FIELD JOURNAL" />
                  </div>
                </div>
              </section>

              {/* CTA Section */}
              <section className="bg-[#FAF8F5] border border-black/15 rounded-sm p-6 space-y-4">
                <h3 className="font-syne font-bold text-sm uppercase tracking-widest text-[#D92525]">CTA Section</h3>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Heading</label>
                  <input className="admin-input" value={ctaHeading} onChange={e => setCtaHeading(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#121110] uppercase tracking-widest font-mono-tech">Text</label>
                  <textarea className="admin-input" rows={2} value={ctaText} onChange={e => setCtaText(e.target.value)} />
                </div>
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

export default function HomePage() {
  return <ToastProvider><HomeContent /></ToastProvider>;
}
