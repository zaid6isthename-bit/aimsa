'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { EditorialHeader } from '@/components/ui/EditorialHeader';
import { EditorialFooter } from '@/components/ui/EditorialFooter';
import { Calendar, Clock, MapPin, Trophy, Users, Barcode, ArrowLeft, ArrowUpRight, Sparkles } from 'lucide-react';
import { StampBadge } from '@/components/ui/StampBadge';

export default function IndividualEventPage() {
  const params = useParams();
  const category = params.category as string;
  const slug = params.slug as string;
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/public/events?category=${category}`)
      .then(r => r.json())
      .then(data => {
        const events = data.events || [];
        setAllEvents(events);
        const found = events.find((e: any) => e.slug === slug);
        setEvent(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category, slug]);

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
          
          {/* Top Ticket Stub Overlay (Exact to Reference Screenshots) */}
          <div className="bg-white border border-black/20 p-6 rounded-xs shadow-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 transform -rotate-1 relative">
            {/* Frosted Tape */}
            <div className="absolute -top-3 left-6 w-20 h-5 bg-white/80 border-x border-black/10 shadow-xs z-30 pointer-events-none transform -rotate-6" />

            <div className="space-y-1">
              <span className="px-3 py-1 bg-[#D92525] text-white rounded-full font-mono-tech text-[10px] uppercase font-bold tracking-widest inline-block">
                AIMSA {event.category.toUpperCase()} ARCHIVE
              </span>
              <h1 className="font-syne font-black text-3xl sm:text-4xl text-[#121110] uppercase tracking-tight mt-2 break-words">
                {event.title}
              </h1>
              <p className="font-mono-tech text-xs text-neutral-600">
                OFFICIAL SCRAPBOOK ENTRY #{event.id.toUpperCase()}
              </p>
            </div>

            <div className="border-t sm:border-t-0 sm:border-l border-dashed border-black/30 pt-4 sm:pt-0 sm:pl-6 flex flex-col items-center shrink-0 font-mono-tech">
              <Barcode className="w-16 h-10 text-neutral-800" />
              <span className="text-[9px] text-neutral-500 tracking-widest mt-1">2025-AIMSA-{event.id}</span>
            </div>
          </div>

          {/* Cover Hero Photo */}
          <div className="relative w-full aspect-[16/9] bg-neutral-900 rounded-xs overflow-hidden border border-black/15 shadow-xl mb-8">
            <Image
              src={event.coverUrl}
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
              {event.fullStory}
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
                    <p className="text-[11px] text-neutral-600">{w.members.join(', ')}</p>
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

          {/* Registration CTA if active */}
          {event.registrationUrl && (
            <div className="pt-6 border-t border-black/15 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="font-mono-tech text-xs text-neutral-600 uppercase font-bold block">
                  ATTENDEE CAPACITY: {event.attendeeCount || 300}+ SEATS
                </span>
              </div>
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3.5 rounded-full bg-[#D92525] hover:bg-[#B81D1D] text-white font-mono-tech font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
              >
                <span>REGISTER / RSVP FOR EVENT</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          )}

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

      <EditorialFooter />
    </div>
  );
}
