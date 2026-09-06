'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EditorialHeader } from '@/components/ui/EditorialHeader';
import { EditorialFooter } from '@/components/ui/EditorialFooter';
import { ArrowRight, Compass, Target, Heart, History } from 'lucide-react';
import { StampBadge } from '@/components/ui/StampBadge';

interface TimelineEvent {
  year: string;
  title: string;
  desc: string;
}

export default function AboutPage() {
  const [about, setAbout] = useState<Record<string, string>>({});
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/settings')
      .then(r => r.json())
      .then(data => {
        const s = data.settings || {};
        setAbout(s);
        try { setTimeline(JSON.parse(s.about_timeline || '[]')); } catch { setTimeline([]); }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E6E1D7] flex items-center justify-center">
        <span className="font-mono-tech text-xs text-neutral-500 uppercase">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E6E1D7] text-[#121110] paper-crumpled-bg flex flex-col font-sans overflow-x-hidden">
      <EditorialHeader />

      <main className="flex-1 pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full select-none overflow-hidden">
        {/* Page Hero Header */}
        <div className="border-b border-black/15 pb-12 mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="font-mono-tech text-xs uppercase tracking-widest text-[#D92525] font-bold">
                {about.about_subheading || 'OFFICIAL FIELD-JOURNAL ARCHIVE'}
              </span>
              <h1 className="font-syne font-black text-5xl sm:text-7xl text-[#121110] uppercase tracking-tight mt-2 break-words">
                ABOUT <span className="red-marker-line">AIMSA</span>
              </h1>
            </div>
            <StampBadge size={110} variant="red" text="• EST. 2024 • AI & ML DEPT COUNCIL •" />
          </div>

          <p className="font-mono-tech text-sm sm:text-base text-neutral-700 max-w-2xl mt-6 leading-relaxed">
            {about.about_description || ''}
          </p>
        </div>

        {/* Identity & Story Scrapbook Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 space-y-6 bg-[#F9F7F1] border border-black/15 p-8 rounded-xs shadow-xl tape-effect tape-kraft">
            <h2 className="font-syne font-black text-3xl text-[#121110] uppercase">
              {about.about_who_we_are_heading || 'WHO WE ARE & OUR ORIGIN'}
            </h2>
            <p className="font-mono-tech text-xs text-neutral-800 leading-relaxed">
              {about.about_who_we_are_p1 || ''}
            </p>
            <p className="font-mono-tech text-xs text-neutral-800 leading-relaxed">
              {about.about_who_we_are_p2 || ''}
            </p>

            <div className="pt-4 border-t border-black/10 font-handwriting text-xl text-neutral-800 flex justify-between">
              <span>{about.about_quote || ''}</span>
              <span className="text-xs font-mono-tech text-neutral-500">AIMSA DEPT COUNCIL</span>
            </div>
          </div>

          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-md polaroid-card-light p-4 bg-white border border-black/15 shadow-2xl transform rotate-2">
              <div className="relative w-full aspect-[4/3] bg-neutral-900 overflow-hidden">
                <Image
                  src={about.about_image_url || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000'}
                  alt="AIMSA Council Members"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-3 text-center font-handwriting text-xl text-neutral-800">
                AIMSA Founders & Council Meeting • Lab 3
              </div>
            </div>
          </div>
        </div>

        {/* Vision, Mission, Values Grid */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="font-syne font-black text-4xl text-[#121110] uppercase">
              VISION, MISSION & VALUES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FAF8F5] border border-black/15 p-8 rounded-xs shadow-lg space-y-4">
              <div className="w-12 h-12 bg-[#D92525]/10 text-[#D92525] rounded-full flex items-center justify-center font-bold">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-syne font-bold text-2xl uppercase text-[#121110]">OUR VISION</h3>
              <p className="font-mono-tech text-xs text-neutral-700 leading-relaxed">
                {about.about_vision || ''}
              </p>
            </div>

            <div className="bg-[#FAF8F5] border border-black/15 p-8 rounded-xs shadow-lg space-y-4">
              <div className="w-12 h-12 bg-[#D92525]/10 text-[#D92525] rounded-full flex items-center justify-center font-bold">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-syne font-bold text-2xl uppercase text-[#121110]">OUR MISSION</h3>
              <p className="font-mono-tech text-xs text-neutral-700 leading-relaxed">
                {about.about_mission || ''}
              </p>
            </div>

            <div className="bg-[#FAF8F5] border border-black/15 p-8 rounded-xs shadow-lg space-y-4">
              <div className="w-12 h-12 bg-[#D92525]/10 text-[#D92525] rounded-full flex items-center justify-center font-bold">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-syne font-bold text-2xl uppercase text-[#121110]">OUR VALUES</h3>
              <p className="font-mono-tech text-xs text-neutral-700 leading-relaxed">
                {about.about_values || ''}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        {timeline.length > 0 && (
          <div className="mb-20 bg-[#F9F7F1] border border-black/15 p-8 sm:p-12 rounded-xs shadow-xl">
            <div className="mb-8">
              <h2 className="font-syne font-black text-3xl text-[#121110] uppercase flex items-center gap-3">
                <History className="w-7 h-7 text-[#D92525]" />
                <span>TIMELINE & MILESTONES</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono-tech">
              {timeline.map((t, idx) => (
                <div key={idx} className="border-l-2 border-[#D92525] pl-4 py-2 space-y-2">
                  <span className="text-xs font-bold text-[#D92525] uppercase tracking-widest">
                    {t.year}
                  </span>
                  <h4 className="font-bold text-sm text-[#121110] uppercase">{t.title}</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation CTAs */}
        <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-black/15">
          <Link
            href="/people"
            className="px-8 py-3.5 rounded-full bg-[#121110] hover:bg-[#D92525] text-white font-mono-tech font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
          >
            <span>MEET THE PEOPLE OF AIMSA</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/events"
            className="px-8 py-3.5 rounded-full border border-black/80 hover:bg-black/10 text-[#121110] font-mono-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <span>EXPLORE OUR EVENT ECOSYSTEM</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <EditorialFooter />
    </div>
  );
}
