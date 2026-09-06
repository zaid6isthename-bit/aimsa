'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EditorialHeader } from '@/components/ui/EditorialHeader';
import { EditorialFooter } from '@/components/ui/EditorialFooter';
import { ArrowRight, Ticket, Barcode, Sparkles, Code2, Music, Trophy, Users, Heart } from 'lucide-react';
import { StampBadge } from '@/components/ui/StampBadge';

export default function MainEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/events')
      .then(r => r.json())
      .then(data => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const eventCategories = [
    {
      id: 'technical',
      name: 'TECHNICAL',
      tagline: 'Hackathons, PyTorch Bootcamps & AI Sprints',
      description: '36-hour continuous buildathons, algorithm challenges, computer vision masterclasses, and open-source project sprints.',
      icon: <Code2 className="w-6 h-6 text-[#D92525]" />,
      badge: 'FLAGSHIP ECOSYSTEM',
      href: '/events/technical',
    },
    {
      id: 'cultural',
      name: 'CULTURAL',
      tagline: 'Music Nights, Art Exhibitions & Drama',
      description: 'AURA Cultural Night, live student acoustic rock, generative neural artwork showcases, and short film premieres.',
      icon: <Music className="w-6 h-6 text-[#D92525]" />,
      badge: 'CREATIVE SHOWCASE',
      href: '/events/cultural',
    },
    {
      id: 'sports',
      name: 'SPORTS',
      tagline: 'Inter-Department Championships & Grit',
      description: 'AIMSA Clash football leagues, 7v7 cricket tournaments, badminton championships, table tennis, and rapid chess.',
      icon: <Trophy className="w-6 h-6 text-[#D92525]" />,
      badge: 'ATHLETIC LEAGUE',
      href: '/events/sports',
    },
    {
      id: 'community',
      name: 'COMMUNITY',
      tagline: 'Freshman Orientation & Peer Mentorship',
      description: 'Welcoming new undergraduates, peer buddy onboarding, outdoor pizza lawn jams, and student wellness circles.',
      icon: <Users className="w-6 h-6 text-[#D92525]" />,
      badge: 'STUDENT LIFE',
      href: '/events/community',
    },
    {
      id: 'celebrations',
      name: 'CELEBRATIONS',
      tagline: 'Senior Farewells & Milestone Gala',
      description: 'Graduation farewell galas, annual awards ceremony, memory yearbook reveals, and alumni reunions.',
      icon: <Heart className="w-6 h-6 text-[#D92525]" />,
      badge: 'MILESTONES',
      href: '/events/celebrations',
    },
  ];

  return (
    <div className="min-h-screen bg-[#E6E1D7] text-[#121110] paper-crumpled-bg flex flex-col font-sans overflow-x-hidden">
      <EditorialHeader />

      <main className="flex-1 pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full select-none overflow-hidden">
        {/* Header Title */}
        <div className="border-b border-black/15 pb-12 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#D92525] font-bold">
              AIMSA CALENDAR & EVENT ARCHIVE
            </span>
            <h1 className="font-syne font-black text-5xl sm:text-7xl text-[#121110] uppercase tracking-tight mt-2 break-words">
              EVENT <span className="red-marker-line">ECOSYSTEM</span>
            </h1>
            <p className="font-mono-tech text-xs sm:text-sm text-neutral-700 max-w-2xl mt-4 leading-relaxed">
              Explore the five core activity branches of AIMSA. Click any category to enter its dedicated archive, schedule, and photo memories.
            </p>
          </div>
          <StampBadge size={110} variant="amber" text="• AIMSA EVENTS • 5 CATEGORIES • ARCHIVE •" />
        </div>

        {/* 5 Event Category Navigation Hub Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {eventCategories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group bg-[#F9F7F1] border border-black/15 p-8 rounded-xs shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:border-[#D92525] relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-black/5 rounded font-mono-tech text-[10px] font-bold uppercase text-[#D92525]">
                    {cat.badge}
                  </span>
                  {cat.icon}
                </div>

                <h3 className="font-syne font-black text-2xl text-[#121110] group-hover:text-[#D92525] transition-colors uppercase mb-2 break-words leading-tight">
                  {cat.name}
                </h3>
                <p className="font-mono-tech text-xs text-[#D92525] uppercase font-bold tracking-wider mb-4">
                  {cat.tagline}
                </p>

                <p className="font-mono-tech text-xs text-neutral-700 leading-relaxed mb-6">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 border-t border-black/10 flex items-center justify-between font-mono-tech text-xs font-bold text-neutral-800 group-hover:text-[#D92525]">
                <span>ENTER {cat.name} ARCHIVE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#D92525]" />
              </div>
            </Link>
          ))}
        </div>

        {/* Perforated Concert Ticket List of Featured Events */}
        <div className="bg-[#FAF8F5] border border-black/20 p-8 rounded-xs shadow-xl tape-effect tape-amber mb-12">
          <div className="flex items-center justify-between mb-8 border-b border-black/15 pb-4">
            <div>
              <h2 className="font-syne font-black text-3xl text-[#121110] uppercase">
                FEATURED EVENT TICKETS & SCHEDULE
              </h2>
              <p className="font-mono-tech text-xs text-neutral-600 mt-1">
                Click any ticket to view its full digital scrapbook entry.
              </p>
            </div>
            <Ticket className="w-8 h-8 text-[#D92525]" />
          </div>

          <div className="divide-y divide-black/15 font-mono-tech">
            {loading ? (
              <div className="py-12 text-center text-neutral-500 font-mono-tech text-xs uppercase">Loading events...</div>
            ) : (
              events.map((evt: any, idx: number) => (
                <Link
                  key={evt.id}
                  href={`/events/${evt.category}/${evt.slug}`}
                  className="py-5 px-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/60 transition-colors group rounded-xs"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg text-neutral-600">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <div>
                      <span className="px-2.5 py-0.5 bg-[#D92525]/10 text-[#D92525] rounded text-[10px] font-bold uppercase tracking-wider">
                        {evt.category}
                      </span>
                      <h4 className="font-bold text-lg text-[#121110] group-hover:text-[#D92525] transition-colors uppercase mt-1">
                        {evt.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs uppercase text-neutral-700">
                    <div>
                      <p className="font-bold text-[#121110]">{evt.date}</p>
                      <p className="text-neutral-500">{evt.venue}</p>
                    </div>
                    <div className="hidden sm:flex flex-col items-center border-l border-black/20 pl-4">
                      <Barcode className="w-10 h-6 text-neutral-800" />
                      <span className="text-[8px] text-neutral-500">ENTRY TICKET</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#D92525] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>

      <EditorialFooter />
    </div>
  );
}
