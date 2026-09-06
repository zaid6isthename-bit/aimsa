'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EditorialHeader } from '@/components/ui/EditorialHeader';
import { EditorialFooter } from '@/components/ui/EditorialFooter';
import { ArrowUpRight, UserCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/SocialIcons';

export default function PeoplePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/team')
      .then(r => r.json())
      .then(data => {
        setMembers(data.members || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = ['ALL', 'Leadership', 'Core Team', 'Department Leads', 'Executive Committee'];

  const filteredMembers = selectedCategory === 'ALL'
    ? members
    : members.filter((m) => m.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#E6E1D7] text-[#121110] paper-crumpled-bg flex flex-col font-sans">
      <EditorialHeader />

      <main className="flex-1 pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full select-none">
        {/* Page Title Header */}
        <div className="border-b border-black/15 pb-10 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#D92525] font-bold">
              AIMSA PERSONNEL ARCHIVE • {members.length} MEMBERS
            </span>
            <h1 className="font-syne font-black text-5xl sm:text-7xl text-[#121110] uppercase tracking-tight mt-2">
              THE <span className="red-marker-line">PEOPLE</span> OF AIMSA
            </h1>
            <p className="font-mono-tech text-xs sm:text-sm text-neutral-700 max-w-xl mt-4 leading-relaxed">
              Meet the student leaders, hackathon architects, research leads, cultural directors, and athletic captains driving the AI & ML department council.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono-tech text-xs uppercase bg-[#FAF8F5] border border-black/15 p-4 rounded-xs shadow-sm">
            <ShieldCheck className="w-5 h-5 text-[#D92525]" />
            <div>
              <p className="font-bold text-[#121110]">SESSION 2026-2027</p>
              <p className="text-[10px] text-neutral-500">OFFICIAL EXECUTIVE ROSTER</p>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 mb-12 font-mono-tech text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full font-bold uppercase tracking-wider transition-all border ${
                selectedCategory === cat
                  ? 'bg-[#121110] text-white border-[#121110] shadow-md'
                  : 'bg-[#F9F7F1] text-neutral-800 border-black/15 hover:border-[#D92525]'
              }`}
            >
              {cat} {cat === 'ALL' ? `(${members.length})` : ''}
            </button>
          ))}
        </div>

        {/* 16 Member Roster Editorial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
          {loading ? (
            <div className="col-span-4 py-12 text-center text-neutral-500 font-mono-tech text-xs uppercase">Loading team members...</div>
          ) : (
            filteredMembers.map((member) => (
              <Link
                key={member.id}
                href={`/people/${member.slug}`}
                className="group polaroid-card-light bg-white border border-black/15 p-4 rounded-xs flex flex-col justify-between shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative"
              >
                {/* Frosted tape accent */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/80 backdrop-blur-xs border-x border-black/10 shadow-xs z-30 pointer-events-none transform -rotate-2" />

                <div>
                  {/* Photo Frame */}
                  <div className="relative w-full aspect-[4/5] bg-neutral-900 overflow-hidden mb-4 rounded-xs border border-black/10">
                    <Image
                      src={member.photoUrl}
                      alt={member.name}
                      fill
                      sizes="300px"
                      className="object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2.5 py-0.5 bg-black/80 text-white rounded font-mono-tech text-[9px] uppercase font-bold tracking-widest">
                        {member.category}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    <h3 className="font-syne font-black text-xl text-[#121110] group-hover:text-[#D92525] transition-colors uppercase leading-tight">
                      {member.name}
                    </h3>
                    <p className="font-mono-tech text-xs text-[#D92525] uppercase font-bold tracking-wider">
                      {member.role}
                    </p>
                    <p className="font-mono-tech text-[11px] text-neutral-500">
                      {member.year}
                    </p>
                  </div>
                </div>

                {/* View Profile CTA */}
                <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between font-mono-tech text-[11px] font-bold text-neutral-700 group-hover:text-[#D92525]">
                  <span>VIEW PROFILE ARCHIVE</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Link>
            ))
          )}
        </div>
      </main>

      <EditorialFooter />
    </div>
  );
}
