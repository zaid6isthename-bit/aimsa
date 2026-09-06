'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { EditorialHeader } from '@/components/ui/EditorialHeader';
import { EditorialFooter } from '@/components/ui/EditorialFooter';
import { ArrowLeft, ArrowRight, Quote, CheckCircle2, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/SocialIcons';
import { TEAM_MEMBERS } from '@/data/team';

export default function MemberProfilePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [members, setMembers] = useState<any[]>(TEAM_MEMBERS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/public/team')
      .then(r => r.json())
      .then(data => {
        if (data.members && data.members.length > 0) {
          setMembers(data.members);
        }
      })
      .catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E6E1D7] text-[#121110] paper-crumpled-bg flex flex-col font-sans overflow-x-hidden">
        <EditorialHeader />
        <main className="flex-1 pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full select-none overflow-hidden">
          <div className="py-24 text-center text-neutral-500 font-mono-tech text-xs uppercase">Loading profile...</div>
        </main>
        <EditorialFooter />
      </div>
    );
  }

  const memberIndex = members.findIndex((m) => m.slug === slug);
  if (memberIndex === -1) {
    return (
      <div className="min-h-screen bg-[#E6E1D7] text-[#121110] paper-crumpled-bg flex flex-col font-sans overflow-x-hidden">
        <EditorialHeader />
        <main className="flex-1 pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full select-none overflow-hidden">
          <div className="py-24 text-center text-neutral-500 font-mono-tech text-xs uppercase">Member not found</div>
        </main>
        <EditorialFooter />
      </div>
    );
  }

  const member = members[memberIndex];
  const prevMember = members[(memberIndex - 1 + members.length) % members.length];
  const nextMember = members[(memberIndex + 1) % members.length];

  return (
    <div className="min-h-screen bg-[#E6E1D7] text-[#121110] paper-crumpled-bg flex flex-col font-sans overflow-x-hidden">
      <EditorialHeader />

      <main className="flex-1 pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full select-none overflow-hidden">
        {/* Top Breadcrumb Nav */}
        <div className="mb-8 font-mono-tech text-xs uppercase flex items-center gap-2 text-neutral-600">
          <Link href="/" className="hover:text-[#D92525]">HOME</Link>
          <span>/</span>
          <Link href="/people" className="hover:text-[#D92525]">PEOPLE</Link>
          <span>/</span>
          <span className="text-[#D92525] font-bold">{member.name}</span>
        </div>

        {/* Individual Profile Editorial Container */}
        <div className="bg-[#FAF8F5] border border-black/20 p-6 sm:p-12 rounded-xs shadow-2xl tape-effect tape-kraft mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Polaroid Photo */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full polaroid-card-light bg-white border border-black/15 p-4 rounded-xs shadow-2xl transform -rotate-1">
                {/* Frosted tape strip */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/80 border-x border-black/10 z-30 pointer-events-none transform -rotate-2" />

                <div className="relative w-full aspect-[4/5] bg-neutral-900 overflow-hidden rounded-xs">
                  <Image
                    src={member.photoUrl}
                    alt={member.name}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>

                <div className="mt-4 text-center border-t border-black/10 pt-3">
                  <p className="font-mono-tech text-xs text-[#D92525] font-bold uppercase tracking-widest">
                    {member.role}
                  </p>
                  <p className="font-mono-tech text-[11px] text-neutral-600 mt-0.5 font-semibold">
                    {member.year}
                  </p>
                  {member.quote && (
                    <p className="font-handwriting text-base text-neutral-800 mt-2 px-1 leading-tight">
                      "{member.quote}"
                    </p>
                  )}
                </div>
              </div>

              {/* Social Links Bar */}
              <div className="mt-6 flex items-center justify-center gap-4 w-full">
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 px-4 bg-white border border-black/15 rounded-full font-mono-tech text-xs font-bold uppercase text-[#121110] hover:bg-[#121110] hover:text-white transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>GITHUB</span>
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 px-4 bg-[#0A66C2] text-white rounded-full font-mono-tech text-xs font-bold uppercase hover:bg-[#08529c] transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                    <span>LINKEDIN</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: Bio, Quote, Contributions */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="px-3 py-1 bg-[#D92525]/10 border border-[#D92525]/30 text-[#D92525] font-mono-tech text-xs font-bold uppercase tracking-widest rounded-full">
                  {member.highlightTag || member.category}
                </span>

                <h1 className="font-syne font-black text-4xl sm:text-5xl text-[#121110] uppercase mt-3 tracking-tight break-words">
                  {member.name}
                </h1>
                <p className="font-mono-tech text-sm text-[#D92525] uppercase font-bold tracking-wider mt-1">
                  {member.role} — {member.year}
                </p>
              </div>

              {/* Biography Card */}
              <div className="border border-black/15 bg-white/70 p-6 rounded-xs shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-[#D92525]">
                  <div className="w-2 h-2 rounded-full bg-[#D92525]" />
                  <h3 className="font-syne font-black text-base uppercase tracking-wider text-[#121110]">
                    BIOGRAPHY & AIMSA ROLE
                  </h3>
                </div>
                <p className="font-mono-tech text-xs sm:text-sm text-neutral-800 leading-relaxed font-medium">
                  {member.bio}
                </p>
              </div>

              {/* Quote */}
              {member.quote && (
                <div className="p-6 bg-[#F2EDE2] border-l-4 border-[#D92525] rounded-r-xs shadow-xs">
                  <Quote className="w-5 h-5 text-[#D92525] mb-2" />
                  <p className="font-handwriting text-2xl text-neutral-900 leading-snug">
                    "{member.quote}"
                  </p>
                  <p className="font-mono-tech text-[10px] text-neutral-500 uppercase mt-2 font-bold">
                    — {member.name} ({member.role})
                  </p>
                </div>
              )}

              {/* Key Contributions */}
              {member.contributions && member.contributions.length > 0 && (
                <div>
                  <h3 className="font-syne font-bold text-sm uppercase text-[#121110] tracking-wider mb-3">
                    KEY CONTRIBUTIONS TO AIMSA
                  </h3>
                  <div className="space-y-2 font-mono-tech text-xs text-neutral-800">
                    {member.contributions.map((c: string, i: number) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#D92525] shrink-0" />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Previous / Next Member Roster Navigation */}
        <div className="grid grid-cols-2 gap-4 font-mono-tech text-xs border-t border-black/15 pt-8">
          <Link
            href={`/people/${prevMember.slug}`}
            className="p-4 bg-[#F9F7F1] border border-black/15 hover:border-[#D92525] rounded-xs flex items-center gap-3 group transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#D92525] group-hover:-translate-x-1 transition-transform" />
            <div>
              <span className="text-[10px] text-neutral-500 block uppercase">PREVIOUS MEMBER</span>
              <span className="font-bold text-[#121110] group-hover:text-[#D92525]">{prevMember.name}</span>
            </div>
          </Link>

          <Link
            href={`/people/${nextMember.slug}`}
            className="p-4 bg-[#F9F7F1] border border-black/15 hover:border-[#D92525] rounded-xs flex items-center justify-end gap-3 group transition-all text-right"
          >
            <div>
              <span className="text-[10px] text-neutral-500 block uppercase">NEXT MEMBER</span>
              <span className="font-bold text-[#121110] group-hover:text-[#D92525]">{nextMember.name}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#D92525] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>

      <EditorialFooter />
    </div>
  );
}
