'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { StampBadge } from '../ui/StampBadge';

export const AchievementsSection: React.FC = () => {
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
    <section id="achievements" className="relative paper-crumpled-bg text-[#121110] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-black/10 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto relative z-10 overflow-hidden">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-black/15 pb-8">
          <div>
            <h2 className="font-syne font-black text-4xl sm:text-6xl uppercase tracking-tight text-[#121110]">
              VICTORIES & <br />
              <span className="red-marker-line">RECOGNITIONS</span>
            </h2>
          </div>
          <div className="shrink-0">
            <StampBadge size={110} variant="amber" text="• AIMSA WALL OF FAME • NATIONAL CHAMPIONS • VICTORIES •" />
          </div>
        </div>

        {/* Vintage Newspaper Trophy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-2 py-12 text-center text-neutral-500 font-mono-tech text-xs uppercase">Loading achievements...</div>
          ) : (
            achievements.map((ach: any, index: number) => (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative p-6 sm:p-8 rounded-xs bg-[#F9F7F1] border border-black/15 hover:border-[#D92525]/50 transition-all duration-300 group shadow-xl flex flex-col justify-between"
              >
                {/* Top Banner Tag */}
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="px-3.5 py-1 bg-[#D92525]/10 border border-[#D92525]/30 rounded-full font-mono-tech text-xs font-bold text-[#D92525] uppercase tracking-widest flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5" />
                      {ach.badgeText}
                    </span>
                    <span className="font-mono-tech text-xs text-neutral-600 uppercase font-semibold">
                      {ach.date}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center mb-6">
                    <div className="sm:col-span-5 relative w-full h-44 rounded-xs overflow-hidden bg-neutral-200 border border-black/10">
                      <Image
                        src={ach.imageUrl}
                        alt={ach.title}
                        fill
                        className="object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>

                    <div className="sm:col-span-7">
                      <h3 className="font-syne font-black text-xl uppercase text-[#121110] group-hover:text-[#D92525] transition-colors mb-2 leading-tight">
                        {ach.title}
                      </h3>
                      <p className="text-neutral-700 font-mono-tech text-xs leading-relaxed line-clamp-3">
                        {ach.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Achievers & Highlight Footer */}
                <div className="pt-4 border-t border-black/10 flex flex-wrap items-center justify-between gap-4 font-mono-tech">
                  <div>
                    <span className="text-[10px] uppercase text-neutral-500 tracking-widest block font-bold">
                      ACHIEVERS:
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {ach.recipients.map((r: string) => (
                        <span
                          key={r}
                          className="px-2.5 py-0.5 bg-black/5 rounded text-[11px] text-[#121110] font-bold"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {ach.highlightStat && (
                    <div className="px-3 py-1.5 bg-[#D92525] text-white rounded font-mono-tech text-xs font-bold uppercase tracking-wider shadow-sm">
                      {ach.highlightStat}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
