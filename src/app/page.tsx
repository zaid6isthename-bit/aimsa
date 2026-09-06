'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EditorialHeader } from '@/components/ui/EditorialHeader';
import { EditorialFooter } from '@/components/ui/EditorialFooter';
import { CinematicHero } from '@/components/hero/CinematicHero';
import { IdentityPillars } from '@/components/identity/IdentityPillars';
import { JoinCtaSection } from '@/components/cta/JoinCtaSection';
import { COMMUNITY_ACTIVITIES } from '@/data/community';
import { ArrowRight, Ticket, Barcode, Trophy, Users, Sparkles, Code2, Music, Heart } from 'lucide-react';
import { StampBadge } from '@/components/ui/StampBadge';

export default function HomePage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [featuredPeople, setFeaturedPeople] = useState<any[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);
  const [featuredGallery, setFeaturedGallery] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/public/team').then(r => r.json()),
      fetch('/api/public/events').then(r => r.json()),
      fetch('/api/public/gallery').then(r => r.json()),
      fetch('/api/public/achievements').then(r => r.json()),
    ]).then(([teamData, eventsData, galleryData, achievementsData]) => {
      setFeaturedPeople((teamData.members || []).slice(0, 4));
      setFeaturedEvents((eventsData.events || []).slice(0, 3));
      setFeaturedGallery((galleryData.images || []).slice(0, 4));
      setAchievements((achievementsData.achievements || []).slice(0, 2));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#E6E1D7] text-[#121110] paper-crumpled-bg flex flex-col font-sans select-none overflow-x-hidden">
      {/* Editorial Header */}
      <EditorialHeader onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      {/* 1. Hero Section */}
      <CinematicHero />

      {/* 2. Who is AIMSA / About Teaser */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-black/10 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center overflow-hidden">
          <div className="lg:col-span-6 space-y-6">
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#D92525] font-bold">
              01. WHO WE ARE
            </span>
            <h2 className="font-syne font-black text-4xl sm:text-6xl text-[#121110] uppercase tracking-tight break-words">
              AI & ML IS OUR FIELD. <br />
              <span className="red-marker-line">AIMSA IS OUR FAMILY</span>
            </h2>
            <p className="font-mono-tech text-xs sm:text-sm text-neutral-700 leading-relaxed">
              AIMSA is the official student association of the Artificial Intelligence & Machine Learning department. We bring together developers, researchers, athletes, musicians, and artists under one unified student council.
            </p>
            <div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#121110] hover:bg-[#D92525] text-white font-mono-tech font-bold text-xs uppercase tracking-wider transition-all shadow-md"
              >
                <span>READ THE FULL AIMSA STORY</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-md polaroid-card-light p-4 bg-white border border-black/15 shadow-2xl transform rotate-2">
              <div className="relative w-full aspect-[4/3] bg-neutral-900 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000"
                  alt="AIMSA Community"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-3 text-center font-handwriting text-xl text-neutral-800">
                AIMSA Lawn Celebration • Department Central Hub
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Five Identity Pillars */}
      <IdentityPillars />

      {/* 4. Event Ecosystem & Tickets Teaser */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-black/10 overflow-hidden">
        <div className="max-w-7xl mx-auto overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-black/15 pb-8">
            <div>
              <span className="font-mono-tech text-xs uppercase tracking-widest text-[#D92525] font-bold">
                02. EVENT ECOSYSTEM
              </span>
              <h2 className="font-syne font-black text-4xl sm:text-6xl text-[#121110] uppercase tracking-tight mt-1 break-words">
                FEATURED <span className="red-marker-line">EVENTS & TICKETS</span>
              </h2>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-black/80 hover:bg-black/10 text-[#121110] font-mono-tech font-bold text-xs uppercase tracking-wider transition-all"
            >
              <span>EXPLORE ALL EVENT CATEGORIES</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-[#FAF8F5] border border-black/20 p-8 rounded-xs shadow-xl divide-y divide-black/15 font-mono-tech mb-8">
            {loading ? (
              <div className="py-12 text-center text-neutral-500 font-mono-tech text-xs uppercase">Loading events...</div>
            ) : (
              featuredEvents.map((evt: any, idx: number) => (
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
                    <ArrowRight className="w-4 h-4 text-[#D92525] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 5. People / Team Teaser (16 Roster Preview) */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-black/10 overflow-hidden">
        <div className="max-w-7xl mx-auto overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-black/15 pb-8">
            <div>
              <span className="font-mono-tech text-xs uppercase tracking-widest text-[#D92525] font-bold">
                03. PERSONNEL ARCHIVE
              </span>
              <h2 className="font-syne font-black text-4xl sm:text-6xl text-[#121110] uppercase tracking-tight mt-1 break-words">
                MEET THE <span className="red-marker-line">COUNCIL</span>
              </h2>
            </div>
            <Link
              href="/people"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#121110] hover:bg-[#D92525] text-white font-mono-tech font-bold text-xs uppercase tracking-wider transition-all shadow-md"
            >
              <span>VIEW ALL TEAM MEMBERS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-4 py-12 text-center text-neutral-500 font-mono-tech text-xs uppercase">Loading team...</div>
            ) : (
              featuredPeople.map((member: any, idx: number) => (
                <Link
                  key={member.id}
                  href={`/people/${member.slug}`}
                  className="group polaroid-card-light bg-white border border-black/15 p-4 rounded-xs shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1"
                >
                  <div className="relative w-full aspect-[4/5] bg-neutral-900 overflow-hidden rounded-xs mb-3">
                    <Image
                      src={member.photoUrl}
                      alt={member.name}
                      fill
                      sizes="300px"
                      className="object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-mono-tech text-xs text-[#D92525] font-bold uppercase tracking-widest">
                      {member.role}
                    </p>
                    <h4 className="font-syne font-black text-lg text-[#121110] uppercase mt-0.5">
                      {member.name}
                    </h4>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 6. Wall of Fame / Achievements Teaser */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-black/10 overflow-hidden">
        <div className="max-w-7xl mx-auto overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-black/15 pb-8">
            <div>
              <span className="font-mono-tech text-xs uppercase tracking-widest text-[#D92525] font-bold">
                04. WALL OF FAME
              </span>
              <h2 className="font-syne font-black text-4xl sm:text-6xl text-[#121110] uppercase tracking-tight mt-1 break-words">
                VICTORIES & <span className="red-marker-line">HONORS</span>
              </h2>
            </div>
            <Link
              href="/achievements"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-black/80 hover:bg-black/10 text-[#121110] font-mono-tech font-bold text-xs uppercase tracking-wider transition-all"
            >
              <span>VIEW FULL HONORS ARCHIVE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
              <div className="col-span-2 py-12 text-center text-neutral-500 font-mono-tech text-xs uppercase">Loading achievements...</div>
            ) : (
              achievements.map((ach: any) => (
                <div key={ach.id} className="bg-[#F9F7F1] border border-black/15 p-6 rounded-xs shadow-lg space-y-4">
                  <span className="px-3 py-1 bg-[#D92525]/10 text-[#D92525] rounded font-mono-tech text-[10px] uppercase font-bold tracking-widest inline-block">
                    {ach.badgeText}
                  </span>
                  <h3 className="font-syne font-black text-2xl uppercase text-[#121110]">
                    {ach.title}
                  </h3>
                  <p className="font-mono-tech text-xs text-neutral-700 leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 7. Gallery Teaser */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-black/10 overflow-hidden">
        <div className="max-w-7xl mx-auto overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-black/15 pb-8">
            <div>
              <span className="font-mono-tech text-xs uppercase tracking-widest text-[#D92525] font-bold">
                05. VISUAL FIELD JOURNAL
              </span>
              <h2 className="font-syne font-black text-4xl sm:text-6xl text-[#121110] uppercase tracking-tight mt-1 break-words">
                MEMORIES <span className="red-marker-line">ARCHIVE</span>
              </h2>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#121110] hover:bg-[#D92525] text-white font-mono-tech font-bold text-xs uppercase tracking-wider transition-all shadow-md"
            >
              <span>OPEN FULL GALLERY</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-4 py-12 text-center text-neutral-500 font-mono-tech text-xs uppercase">Loading gallery...</div>
            ) : (
              featuredGallery.map((g: any) => (
                <Link key={g.id} href="/gallery" className="polaroid-card-light bg-white border border-black/15 p-3 rounded-xs shadow-md group">
                  <div className="relative w-full aspect-[4/3] bg-neutral-900 overflow-hidden">
                    <Image src={g.url} alt={g.caption} fill className="object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <p className="font-handwriting text-lg text-[#121110] text-center mt-2 font-bold">{g.caption}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 8. BE PART OF AIMSA CTA Section */}
      <JoinCtaSection
        isModalOpen={isJoinModalOpen}
        onCloseModal={() => setIsJoinModalOpen(false)}
        onOpenModal={() => setIsJoinModalOpen(true)}
      />

      {/* Editorial Footer */}
      <EditorialFooter />
    </div>
  );
}
