'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { EditorialHeader } from '@/components/ui/EditorialHeader';
import { EditorialFooter } from '@/components/ui/EditorialFooter';
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Users,
  Barcode,
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  X,
  AlertCircle,
  Ticket,
  User,
  Mail,
  Phone,
  GraduationCap,
} from 'lucide-react';
import { StampBadge } from '@/components/ui/StampBadge';

export default function IndividualEventPage() {
  const params = useParams();
  const category = params.category as string;
  const slug = params.slug as string;
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Registration Modal State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registeredTicket, setRegisteredTicket] = useState<any | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    rollNumber: '',
    year: '1st Year',
    branch: 'AI & ML',
    teamName: '',
    notes: '',
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/public/events/${slug}`).then((r) => r.json()).catch(() => ({})),
      fetch(`/api/public/events?category=${category}`).then((r) => r.json()).catch(() => ({})),
    ]).then(([eventData, catData]) => {
      if (eventData.event) {
        setEvent(eventData.event);
      } else if (catData.events) {
        const found = catData.events.find((e: any) => e.slug === slug);
        setEvent(found || null);
      }
      setAllEvents(catData.events || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [category, slug]);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterLoading(true);

    try {
      const res = await fetch(`/api/public/events/${slug}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setRegisteredTicket(data.registration);
      } else {
        setRegisterError(data.error || 'Failed to complete registration.');
      }
    } catch {
      setRegisterError('Network error. Please check your connection and try again.');
    } finally {
      setRegisterLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E6E1D7] text-[#121110] paper-crumpled-bg flex flex-col font-sans overflow-x-hidden">
        <EditorialHeader />
        <main className="flex-1 pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full select-none overflow-hidden">
          <div className="py-24 text-center text-neutral-500 font-mono-tech text-xs uppercase">Loading event...</div>
        </main>
        <EditorialFooter />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#E6E1D7] text-[#121110] paper-crumpled-bg flex flex-col font-sans overflow-x-hidden">
        <EditorialHeader />
        <main className="flex-1 pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full select-none overflow-hidden">
          <div className="py-24 text-center text-neutral-500 font-mono-tech text-xs uppercase">Event not found</div>
        </main>
        <EditorialFooter />
      </div>
    );
  }

  const relatedEvents = allEvents.filter(
    (e: any) => e.category === event.category && e.slug !== event.slug
  ).slice(0, 3);

  const isRegistrationOpen = event.registrationOpen !== false;

  return (
    <div className="min-h-screen bg-[#E6E1D7] text-[#121110] paper-crumpled-bg flex flex-col font-sans overflow-x-hidden">
      <EditorialHeader />

      <main className="flex-1 pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full select-none overflow-hidden">
        {/* Breadcrumb Nav */}
        <div className="mb-6 font-mono-tech text-xs uppercase flex items-center gap-2 text-neutral-600">
          <Link href="/" className="hover:text-[#D92525]">HOME</Link>
          <span>/</span>
          <Link href="/events" className="hover:text-[#D92525]">EVENTS</Link>
          <span>/</span>
          <Link href={`/events/${event.category}`} className="hover:text-[#D92525]">
            {event.category.toUpperCase()}
          </Link>
          <span>/</span>
          <span className="text-[#D92525] font-bold">{event.title}</span>
        </div>

        {/* Main Digital Scrapbook Entry Container */}
        <div className="bg-[#FAF8F5] border border-black/20 p-6 sm:p-12 rounded-xs shadow-2xl tape-effect tape-kraft mb-16">
          
          {/* Top Ticket Stub Overlay */}
          <div className="bg-white border border-black/20 p-6 rounded-xs shadow-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 transform -rotate-1 relative">
            {/* Frosted Tape */}
            <div className="absolute -top-3 left-6 w-20 h-5 bg-white/80 border-x border-black/10 shadow-xs z-30 pointer-events-none transform -rotate-6" />

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#D92525] text-white rounded-full font-mono-tech text-[10px] uppercase font-bold tracking-widest inline-block">
                  AIMSA {event.category.toUpperCase()} ARCHIVE
                </span>
                {isRegistrationOpen ? (
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-mono-tech text-[9px] uppercase font-bold tracking-wider">
                    ● REGISTRATIONS LIVE
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 bg-neutral-200 text-neutral-700 border border-neutral-300 rounded font-mono-tech text-[9px] uppercase font-bold tracking-wider">
                    ● REGISTRATION CLOSED
                  </span>
                )}
              </div>
              <h1 className="font-syne font-black text-3xl sm:text-4xl text-[#121110] uppercase tracking-tight mt-2 break-words">
                {event.title}
              </h1>
              <p className="font-mono-tech text-xs text-neutral-600">
                OFFICIAL SCRAPBOOK ENTRY #{event.id ? event.id.slice(0, 8).toUpperCase() : 'AIMSA-2025'}
              </p>
            </div>

            <div className="border-t sm:border-t-0 sm:border-l border-dashed border-black/30 pt-4 sm:pt-0 sm:pl-6 flex flex-col items-center shrink-0 font-mono-tech">
              <Barcode className="w-16 h-10 text-neutral-800" />
              <span className="text-[9px] text-neutral-500 tracking-widest mt-1">2025-AIMSA-{event.slug ? event.slug.slice(0, 8) : 'EVT'}</span>
            </div>
          </div>

          {/* Cover Hero Photo */}
          <div className="relative w-full aspect-[16/9] bg-neutral-900 rounded-xs overflow-hidden border border-black/15 shadow-xl mb-8">
            <Image
              src={event.coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200'}
              alt={event.title}
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Quick Meta Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#F2EDE2] border border-black/15 rounded-xs font-mono-tech text-xs uppercase mb-8">
            <div className="flex items-center gap-2 text-neutral-800 font-bold">
              <Calendar className="w-4 h-4 text-[#D92525]" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-800 font-bold">
              <Clock className="w-4 h-4 text-[#D92525]" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-800 font-bold">
              <MapPin className="w-4 h-4 text-[#D92525]" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>

          {/* Full Event Story */}
          <div className="space-y-4 mb-8">
            <h2 className="font-syne font-black text-2xl text-[#121110] uppercase border-b border-black/15 pb-2">
              EVENT CHRONICLES & FULL STORY
            </h2>
            <p className="font-mono-tech text-xs sm:text-sm text-neutral-800 leading-relaxed font-medium">
              {event.fullStory || event.description}
            </p>
          </div>

          {/* Winners Section if applicable */}
          {event.winners && event.winners.length > 0 && (
            <div className="mb-8 p-6 bg-white border border-black/15 rounded-xs shadow-md space-y-4">
              <h3 className="font-syne font-black text-xl text-[#121110] uppercase flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>OFFICIAL WINNERS & PODIUM</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono-tech text-xs">
                {event.winners.map((w: any, idx: number) => (
                  <div key={idx} className="p-3 bg-[#F9F7F1] border border-black/10 rounded-xs space-y-1">
                    <span className="text-[10px] text-[#D92525] font-bold block uppercase">{w.position}</span>
                    <h4 className="font-bold text-sm text-[#121110] uppercase">{w.teamName}</h4>
                    <p className="text-[11px] text-neutral-600">{Array.isArray(w.members) ? w.members.join(', ') : w.members}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Organizers List */}
          <div className="mb-8">
            <h3 className="font-syne font-bold text-sm uppercase text-neutral-600 tracking-wider mb-2">
              ORGANIZED & PRODUCED BY
            </h3>
            <div className="flex flex-wrap gap-2 font-mono-tech text-xs">
              {(Array.isArray(event.organizers) ? event.organizers : typeof event.organizers === 'string' ? event.organizers.split(',').map((s: string) => s.trim()).filter(Boolean) : []).map((org: string) => (
                <span key={org} className="px-3 py-1 bg-black/5 border border-black/10 rounded text-[#121110] font-bold">
                  {org}
                </span>
              ))}
            </div>
          </div>

          {/* Event Gallery Grid */}
          {event.galleryImages && event.galleryImages.length > 0 && (
            <div className="mb-8">
              <h3 className="font-syne font-black text-xl text-[#121110] uppercase mb-4">
                EVENT MEMORY GALLERY
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {event.galleryImages.map((img: string, i: number) => (
                  <div key={i} className="polaroid-card-light bg-white border border-black/15 p-2 rounded-xs">
                    <div className="relative w-full aspect-[4/3] bg-neutral-900 overflow-hidden">
                      <Image src={img} alt={`Memory ${i}`} fill className="object-cover" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Native Registration / RSVP CTA Section */}
          <div className="pt-6 border-t border-black/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-mono-tech text-xs text-neutral-600 uppercase font-bold block">
                ATTENDEE CAPACITY: {event.attendeeCount || 300}+ REGISTERED
              </span>
              <span className="font-mono-tech text-[11px] text-neutral-500">
                {isRegistrationOpen
                  ? 'Official digital passes issued immediately upon form submission.'
                  : 'Enrollment is currently closed by the event organizers.'}
              </span>
            </div>

            {isRegistrationOpen ? (
              <button
                onClick={() => {
                  setRegisteredTicket(null);
                  setRegisterError('');
                  setIsRegisterModalOpen(true);
                }}
                className="px-8 py-3.5 rounded-full bg-[#D92525] hover:bg-[#B81D1D] text-white font-mono-tech font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>REGISTER / RSVP FOR EVENT</span>
              </button>
            ) : (
              <button
                disabled
                className="px-8 py-3.5 rounded-full bg-neutral-400 text-white font-mono-tech font-bold text-xs uppercase tracking-wider cursor-not-allowed opacity-80"
              >
                REGISTRATIONS CLOSED
              </button>
            )}
          </div>

        </div>

        {/* Related Events Section */}
        {relatedEvents.length > 0 && (
          <div className="border-t border-black/15 pt-12">
            <h3 className="font-syne font-black text-2xl text-[#121110] uppercase mb-6">
              RELATED {event.category.toUpperCase()} EVENTS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono-tech">
              {relatedEvents.map((rel: any) => (
                <Link
                  key={rel.id}
                  href={`/events/${rel.category}/${rel.slug}`}
                  className="p-5 bg-[#F9F7F1] border border-black/15 hover:border-[#D92525] rounded-xs shadow-md transition-all group"
                >
                  <span className="text-[10px] text-[#D92525] font-bold uppercase">{rel.date}</span>
                  <h4 className="font-bold text-base text-[#121110] group-hover:text-[#D92525] transition-colors uppercase mt-1">
                    {rel.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Interactive Registration / Admission Ticket Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-[#FAF8F5] text-[#121110] border-2 border-black/20 rounded-xs shadow-2xl p-6 sm:p-8 tape-effect tape-kraft max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-neutral-600 hover:text-black bg-black/5 hover:bg-black/10 rounded-full transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {registeredTicket ? (
              /* Success Digital Ticket View */
              <div className="text-center space-y-6 pt-2">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500 shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <span className="font-mono-tech text-[10px] uppercase tracking-widest text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300">
                    ADMISSION PASS CONFIRMED
                  </span>
                  <h3 className="font-syne font-black text-2xl sm:text-3xl uppercase text-[#121110] mt-3">
                    YOU'RE REGISTERED!
                  </h3>
                  <p className="font-mono-tech text-xs text-neutral-600 mt-1">
                    An official confirmation has been logged for <strong className="text-black">{registeredTicket.name}</strong>.
                  </p>
                </div>

                {/* Perforated Admission Ticket Stub */}
                <div className="p-6 bg-white border-2 border-dashed border-black/30 rounded-xs shadow-md text-left font-mono-tech text-xs space-y-4 relative">
                  <div className="flex items-center justify-between border-b border-black/10 pb-3">
                    <div>
                      <p className="font-bold text-sm text-[#D92525] uppercase">AIMSA ADMISSION PASS</p>
                      <h4 className="font-syne font-black text-base text-[#121110] uppercase">{event.title}</h4>
                    </div>
                    <Barcode className="w-16 h-8 text-neutral-800 shrink-0" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <span className="text-neutral-500 uppercase block font-semibold">ATTENDEE</span>
                      <span className="font-bold text-black uppercase">{registeredTicket.name}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 uppercase block font-semibold">ROLL NUMBER (USN)</span>
                      <span className="font-bold text-black">{registeredTicket.rollNumber || 'AIMSA-STUDENT'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 uppercase block font-semibold">DATE & VENUE</span>
                      <span className="font-bold text-black">{event.date} • {event.venue}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 uppercase block font-semibold">PASS ID</span>
                      <span className="font-bold text-[#D92525]">#{registeredTicket.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-black/10 flex items-center justify-between text-[10px] text-neutral-500">
                    <span>STATUS: OFFICIAL VERIFIED RSVP</span>
                    <span>PRESENT THIS PASS AT ENTRANCE</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="w-full py-3.5 rounded-full bg-[#121110] hover:bg-[#D92525] text-white font-mono-tech font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
                >
                  DONE / CLOSE PASS
                </button>
              </div>
            ) : (
              /* Registration Form */
              <form onSubmit={handleRegisterSubmit} className="space-y-4 font-mono-tech text-xs">
                <div>
                  <div className="flex items-center gap-2 text-[#D92525] font-bold text-[10px] uppercase tracking-widest">
                    <Ticket className="w-3.5 h-3.5" />
                    <span>EVENT ADMISSION FORM</span>
                  </div>
                  <h3 className="font-syne font-black text-2xl uppercase text-[#121110] mt-1">
                    REGISTER FOR {event.title}
                  </h3>
                  <p className="text-neutral-600 text-[11px] mt-0.5">
                    {event.date} • {event.venue}
                  </p>
                </div>

                {registerError && (
                  <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="text-xs">{registerError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-800 font-bold uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Sharma"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-black/20 rounded-xs text-[#121110] placeholder-neutral-400 focus:outline-none focus:border-[#D92525]"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-800 font-bold uppercase mb-1">
                      College Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="aarav@college.edu"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-black/20 rounded-xs text-[#121110] placeholder-neutral-400 focus:outline-none focus:border-[#D92525]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-800 font-bold uppercase mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-black/20 rounded-xs text-[#121110] placeholder-neutral-400 focus:outline-none focus:border-[#D92525]"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-800 font-bold uppercase mb-1">
                      USN / Roll Number
                    </label>
                    <input
                      type="text"
                      placeholder="1MS23AI001"
                      value={form.rollNumber}
                      onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-black/20 rounded-xs text-[#121110] placeholder-neutral-400 focus:outline-none focus:border-[#D92525]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-800 font-bold uppercase mb-1">
                      Year of Study
                    </label>
                    <select
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-black/20 rounded-xs text-[#121110] focus:outline-none focus:border-[#D92525]"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-800 font-bold uppercase mb-1">
                      Department / Branch
                    </label>
                    <input
                      type="text"
                      placeholder="AI & ML / CSE"
                      value={form.branch}
                      onChange={(e) => setForm({ ...form, branch: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-black/20 rounded-xs text-[#121110] placeholder-neutral-400 focus:outline-none focus:border-[#D92525]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-800 font-bold uppercase mb-1">
                    Team Name (Optional, if participating as team)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NeuralKnights"
                    value={form.teamName}
                    onChange={(e) => setForm({ ...form, teamName: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-black/20 rounded-xs text-[#121110] placeholder-neutral-400 focus:outline-none focus:border-[#D92525]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-800 font-bold uppercase mb-1">
                    Questions / Dietary / Technical Requirements (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Any requirements or queries..."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-black/20 rounded-xs text-[#121110] placeholder-neutral-400 focus:outline-none focus:border-[#D92525]"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={registerLoading}
                    className="w-full py-4 rounded-full bg-[#D92525] hover:bg-[#B81D1D] text-white font-mono-tech font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>{registerLoading ? 'PROCESSING REGISTRATION...' : 'CONFIRM RSVP & GET PASS'}</span>
                  </button>
                  <p className="text-[10px] text-center text-neutral-500 mt-2">
                    Official AIMSA Student Council admission. No spam.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <EditorialFooter />
    </div>
  );
}
