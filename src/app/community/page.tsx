import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EditorialHeader } from '@/components/ui/EditorialHeader';
import { EditorialFooter } from '@/components/ui/EditorialFooter';
import { COMMUNITY_ACTIVITIES } from '@/data/community';
import { Quote, Heart, Users, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { StampBadge } from '@/components/ui/StampBadge';

export default function CommunityPage() {
  const studentStories = [
    {
      author: 'Aarav Sharma',
      role: 'President (Batch of 2025)',
      text: 'AIMSA became my second family. The late-night pizza sessions in Lab 3 before hackathons taught me more about leadership than any textbook.',
    },
    {
      author: 'Priya Sundaram',
      role: 'Technical Lead (Batch of 2026)',
      text: 'When I joined in my first year, I was terrified of PyTorch. Seniors at AIMSA sat with me for hours during weekend code sprints. Now I pay it forward.',
    },
    {
      author: 'Siddharth Nair',
      role: 'Cultural Lead (Batch of 2026)',
      text: 'Creating AURA Cultural Night allowed us to jam, play guitars, and express ourselves beyond neural network models.',
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
              THE HUMAN SIDE OF AI & ML
            </span>
            <h1 className="font-syne font-black text-5xl sm:text-7xl text-[#121110] uppercase tracking-tight mt-2 break-words">
              AIMSA <span className="red-marker-line">COMMUNITY</span>
            </h1>
            <p className="font-mono-tech text-xs sm:text-sm text-neutral-700 max-w-2xl mt-4 leading-relaxed">
              Behind every algorithm and research paper lies a passionate group of friends, athletes, artists, and student leaders. Discover our informal moments and student initiatives.
            </p>
          </div>
          <StampBadge size={110} variant="red" text="• HUMAN SIDE OF AI • AIMSA FAMILY • COMMUNITY •" />
        </div>

        {/* Hero Quote Card */}
        <div className="mb-20 bg-[#FAF8F5] border border-black/20 p-8 sm:p-12 rounded-xs shadow-2xl tape-effect tape-kraft text-center overflow-hidden">
          <Quote className="w-10 h-10 text-[#D92525] mx-auto mb-4" />
          <h2 className="font-syne font-black text-3xl sm:text-5xl uppercase text-[#121110] max-w-4xl mx-auto leading-tight break-words">
            "NO STUDENT STANDS ALONE IN THE AI & ML DEPARTMENT."
          </h2>
          <p className="font-handwriting text-2xl text-neutral-800 mt-4">
            — The AIMSA Student Commitment
          </p>
        </div>

        {/* Community Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {COMMUNITY_ACTIVITIES.map((act) => (
            <div
              key={act.id}
              className="bg-[#F9F7F1] border border-black/15 p-6 rounded-xs shadow-lg space-y-4"
            >
              <div className="relative w-full h-64 rounded-xs overflow-hidden border border-black/10">
                <Image
                  src={act.imageUrl}
                  alt={act.title}
                  fill
                  className="object-cover"
                />
              </div>

              <span className="px-3 py-1 bg-[#D92525]/10 text-[#D92525] rounded font-mono-tech text-[10px] uppercase font-bold tracking-widest inline-block">
                {act.category}
              </span>

              <h3 className="font-syne font-black text-2xl uppercase text-[#121110]">
                {act.title}
              </h3>

              <p className="font-mono-tech text-xs text-neutral-700 leading-relaxed">
                {act.description}
              </p>

              {act.quote && (
                <div className="pt-4 border-t border-black/10 bg-[#F2EDE2] p-4 rounded-xs">
                  <p className="font-handwriting text-lg text-neutral-900">
                    "{act.quote}"
                  </p>
                  <span className="font-mono-tech text-[10px] text-neutral-600 block uppercase mt-1 font-bold">
                    — {act.authorName} ({act.authorRole})
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Student Voice Testimonials */}
        <div className="mb-20">
          <h2 className="font-syne font-black text-3xl text-[#121110] uppercase mb-8 border-b border-black/15 pb-4">
            STUDENT VOICES ACROSS BATCHES
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono-tech">
            {studentStories.map((s, idx) => (
              <div key={idx} className="p-6 bg-[#FAF8F5] border border-black/15 rounded-xs shadow-md space-y-3">
                <p className="font-handwriting text-xl text-neutral-900 leading-snug">
                  "{s.text}"
                </p>
                <div className="pt-2 border-t border-black/10">
                  <span className="font-bold text-xs text-[#121110] uppercase block">{s.author}</span>
                  <span className="text-[10px] text-neutral-500 uppercase">{s.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pitch an Idea Banner */}
        <div className="p-8 bg-[#FAF8F5] border border-black/20 rounded-xs shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 tape-effect tape-amber overflow-hidden">
          <div>
            <h3 className="font-syne font-black text-2xl text-[#121110] uppercase break-words">
              HAVE AN IDEA FOR A NEW STUDENT CLUB OR EVENT?
            </h3>
            <p className="font-mono-tech text-xs text-neutral-700 mt-1">
              AIMSA backs student initiatives with funding, lab resources, and promotion.
            </p>
          </div>
          <Link
            href="/connect"
            className="px-8 py-3.5 rounded-full bg-[#121110] hover:bg-[#D92525] text-white font-mono-tech font-bold text-xs uppercase tracking-wider transition-all shadow-md shrink-0"
          >
            PITCH YOUR IDEA
          </Link>
        </div>
      </main>

      <EditorialFooter />
    </div>
  );
}
