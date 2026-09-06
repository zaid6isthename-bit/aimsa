'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { EditorialHeader } from '@/components/ui/EditorialHeader';
import { EditorialFooter } from '@/components/ui/EditorialFooter';
import { ArrowRight, Calendar, MapPin, Clock, ArrowLeft, Barcode, Ticket, Sparkles } from 'lucide-react';
import { StampBadge } from '@/components/ui/StampBadge';

const CATEGORY_META: Record<string, { title: string; tagline: string; description: string; badge: string }> = {
  technical: {
    title: 'TECHNICAL CHRONICLES',
    tagline: 'Hackathons, PyTorch Bootcamps & AI Code Sprints',
    description: 'Where AI architectures meet 36-hour hackathon endurance. Explore our national buildathons, algorithm cups, computer vision labs, and open-source releases.',
    badge: 'TECHNICAL ECOSYSTEM',
  },
  cultural: {
    title: 'CULTURAL CHRONICLES',
    tagline: 'Music Nights, Neural Art & Stage Lights',
    description: 'Celebrating the artistic soul of AI & ML students. Acoustic rock bands, street theater drama, dance showcases, and AI short film premieres.',
    badge: 'CULTURAL SHOWCASE',
  },
  sports: {
    title: 'SPORTS CHRONICLES',
    tagline: 'AIMSA League Championship Grit & Athletics',
    description: 'Championship football squads, 7v7 cricket leagues, badminton tournaments, table tennis, and strategic rapid chess matches.',
    badge: 'ATHLETIC LEAGUE',
  },
  community: {
    title: 'COMMUNITY CHRONICLES',
    tagline: 'Freshman Orientation, Lawn Jams & Student Life',
    description: 'Building lifelong bonds beyond the lab. Peer buddy onboarding, pizza lawn jams, community reading circles, and student wellness.',
    badge: 'STUDENT LIFE',
  },
  celebrations: {
    title: 'CELEBRATION CHRONICLES',
    tagline: 'Senior Farewells, Awards & Milestone Galas',
    description: 'Honoring four years of shared memories, senior citation awards, custom memory field-journals, and alumni graduation galas.',
    badge: 'MILESTONE GALAS',
  },
};

export default function CategoryPage() {
  const params = useParams();
  const categoryKey = (params.category as string).toLowerCase();
  const meta = CATEGORY_META[categoryKey];
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/public/events?category=${categoryKey}`)
      .then(r => r.json())
      .then(data => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [categoryKey]);

  if (!meta) {
    return (
      <div className="min-h-screen bg-[#E6E1D7] text-[#121110] paper-crumpled-bg flex flex-col font-sans overflow-x-hidden">
        <EditorialHeader />
        <main className="flex-1 pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full select-none overflow-hidden">
          <div className="py-24 text-center text-neutral-500 font-mono-tech text-xs uppercase">Category not found</div>
        </main>
        <EditorialFooter />
      </div>
    );
  }

  const featuredEvent = events.find((e: any) => e.featured) || events[0];

  return (
    <div className="min-h-screen bg-[#E6E1D7] text-[#121110] paper-crumpled-bg flex flex-col font-sans overflow-x-hidden">
      <EditorialHeader />

      <main className="flex-1 pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full select-none overflow-hidden">
        {/* Breadcrumb Nav */}
        <div className="mb-6 font-mono-tech text-xs uppercase flex items-center gap-2 text-neutral-600">
          <Link href="/" className="hover:text-[#D92525]">HOME</Link>
          <span>/</span>
          <Link href="/events" className="hover:text-[#D92525]">EVENTS</Link>
          <span>/</span>
          <span className="text-[#D92525] font-bold">{meta.title}</span>
        </div>

        {/* Category Banner Header */}
        <div className="border-b border-black/15 pb-12 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="px-3.5 py-1 bg-[#D92525]/10 border border-[#D92525]/30 text-[#D92525] rounded-full font-mono-tech text-xs font-bold uppercase tracking-widest">
              {meta.badge}
            </span>
            <h1 className="font-syne font-black text-4xl sm:text-6xl text-[#121110] uppercase tracking-tight mt-3 break-words">
              {meta.title}
            </h1>
            <p className="font-mono-tech text-xs sm:text-sm text-[#D92525] uppercase font-bold tracking-wider mt-1">
              {meta.tagline}
            </p>
            <p className="font-mono-tech text-xs sm:text-sm text-neutral-700 max-w-2xl mt-4 leading-relaxed">
              {meta.description}
            </p>
          </div>
          <StampBadge size={110} variant="red" text={`• AIMSA ${categoryKey.toUpperCase()} • ARCHIVE •`} />
        </div>

        {/* Featured Category Event Showcase Card */}
        {featuredEvent && (
          <div className="mb-16 bg-[#FAF8F5] border border-black/20 p-6 sm:p-10 rounded-xs shadow-2xl tape-effect tape-kraft">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 relative w-full aspect-[4/3] rounded-xs overflow-hidden border border-black/10 shadow-lg">
                <Image
                  src={featuredEvent.coverUrl}
                  alt={featuredEvent.title}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#D92525] text-white px-3 py-1 font-mono-tech text-[10px] uppercase font-bold tracking-widest rounded-full">
                  FEATURED {meta.badge}
                </div>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <span className="font-mono-tech text-xs text-[#D92525] uppercase font-bold tracking-widest">
                  {featuredEvent.date} • {featuredEvent.time}
                </span>

                <h2 className="font-syne font-black text-3xl sm:text-4xl text-[#121110] uppercase leading-tight">
                  {featuredEvent.title}
                </h2>

                <p className="font-mono-tech text-xs text-neutral-700 leading-relaxed">
                  {featuredEvent.shortDesc}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono-tech text-neutral-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#D92525]" />
                    <span>{featuredEvent.venue}</span>
                  </div>
                  {featuredEvent.attendeeCount && (
                    <span className="font-bold text-[#121110]">
                      {featuredEvent.attendeeCount}+ ATTENDEES
                    </span>
                  )}
                </div>

                <div className="pt-4">
                  <Link
                    href={`/events/${categoryKey}/${featuredEvent.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#121110] hover:bg-[#D92525] text-white font-mono-tech font-bold text-xs uppercase tracking-wider shadow-md transition-all"
                  >
                    <span>OPEN DIGITAL SCRAPBOOK ENTRY</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Events List for Category */}
        <div className="bg-[#F9F7F1] border border-black/15 p-8 rounded-xs shadow-xl mb-16">
          <h3 className="font-syne font-black text-2xl text-[#121110] uppercase mb-6 border-b border-black/15 pb-4">
            {meta.title} ARCHIVE LIST
          </h3>

          <div className="divide-y divide-black/15 font-mono-tech">
            {loading ? (
              <div className="py-12 text-center text-neutral-500 font-mono-tech text-xs uppercase">Loading events...</div>
            ) : (
              events.map((evt: any, idx: number) => (
                <Link
                  key={evt.id}
                  href={`/events/${categoryKey}/${evt.slug}`}
                  className="py-5 px-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/60 transition-colors group rounded-xs"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg text-neutral-600">0{idx + 1}.</span>
                    <div>
                      <h4 className="font-bold text-lg text-[#121110] group-hover:text-[#D92525] transition-colors uppercase">
                        {evt.title}
                      </h4>
                      <p className="text-xs text-neutral-600 line-clamp-1 mt-0.5">
                        {evt.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs uppercase text-neutral-700 shrink-0">
                    <div>
                      <p className="font-bold text-[#121110]">{evt.date}</p>
                      <p className="text-neutral-500">{evt.venue}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#D92525] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Category Back Nav */}
        <div className="flex items-center justify-between border-t border-black/15 pt-8 font-mono-tech text-xs">
          <Link
            href="/events"
            className="flex items-center gap-2 text-neutral-800 hover:text-[#D92525] font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO ALL EVENT CATEGORIES</span>
          </Link>
        </div>
      </main>

      <EditorialFooter />
    </div>
  );
}
