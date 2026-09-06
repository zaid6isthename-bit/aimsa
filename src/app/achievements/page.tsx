'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EditorialHeader } from '@/components/ui/EditorialHeader';
import { EditorialFooter } from '@/components/ui/EditorialFooter';
import { Trophy, Award, Medal, Star, Sparkles } from 'lucide-react';
import { StampBadge } from '@/components/ui/StampBadge';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/achievements')
      .then(r => r.json())
      .then(data => {
        setAchievements(data.achievements || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#E6E1D7] text-[#121110] paper-crumpled-bg flex flex-col font-sans overflow-x-hidden">
      <EditorialHeader />

      <main className="flex-1 pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full select-none overflow-hidden">
        {/* Header Title */}
        <div className="border-b border-black/15 pb-12 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#D92525] font-bold">
              AIMSA WALL OF FAME & HONORS
            </span>
            <h1 className="font-syne font-black text-5xl sm:text-7xl text-[#121110] uppercase tracking-tight mt-2 break-words">
              VICTORIES & <span className="red-marker-line">ACHIEVEMENTS</span>
            </h1>
            <p className="font-mono-tech text-xs sm:text-sm text-neutral-700 max-w-2xl mt-4 leading-relaxed">
              Celebrating national hackathon podiums, NeurIPS research publications, university sports championships, and algorithmic milestones achieved by AIMSA members.
            </p>
          </div>
          <StampBadge size={110} variant="amber" text="• WALL OF FAME • RECOGNITION • NATIONAL CHAMPIONS •" />
        </div>

        {/* Vintage Newspaper Trophy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {loading ? (
            <div className="col-span-2 py-12 text-center text-neutral-500 font-mono-tech text-xs uppercase">Loading achievements...</div>
          ) : (
            achievements.map((ach: any) => (
              <div
                key={ach.id}
                className="bg-[#F9F7F1] border border-black/15 p-6 sm:p-8 rounded-xs shadow-xl space-y-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="px-3.5 py-1 bg-[#D92525]/10 border border-[#D92525]/30 text-[#D92525] rounded-full font-mono-tech text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5" />
                      {ach.position || ach.category}
                    </span>
                    <span className="font-mono-tech text-xs text-neutral-600 uppercase font-semibold">
                      {ach.date}
                    </span>
                  </div>

                  <div className="relative w-full h-56 rounded-xs overflow-hidden border border-black/15 mb-6">
                    <Image
                      src={ach.imageUrl}
                      alt={ach.title}
                      fill
                      className="object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </div>

                  <h3 className="font-syne font-black text-2xl uppercase text-[#121110] mb-2 leading-tight">
                    {ach.title}
                  </h3>

                  <p className="font-mono-tech text-xs text-neutral-700 leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-black/10 flex flex-wrap items-center justify-between gap-4 font-mono-tech">
                  <div>
                    <span className="text-[10px] uppercase text-neutral-500 font-bold block">
                      HONORED MEMBERS:
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {(ach.participants || '').split(',').filter(Boolean).map((r: string) => (
                        <span
                          key={r.trim()}
                          className="px-2.5 py-0.5 bg-black/5 rounded text-[11px] text-[#121110] font-bold"
                        >
                          {r.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <EditorialFooter />
    </div>
  );
}
