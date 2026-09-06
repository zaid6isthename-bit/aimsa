'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Rocket, Trophy, Music, Users, ArrowUpRight } from 'lucide-react';

interface Pillar {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  stats: string;
}

export const IdentityPillars: React.FC = () => {
  const [activePillar, setActivePillar] = useState<string>('pillar-1');

  const pillars: Pillar[] = [
    {
      id: 'pillar-1',
      number: '01',
      title: 'LEARN',
      tagline: 'Mastering the AI Frontier',
      description: 'Hands-on bootcamps on LLMs, PyTorch fine-tuning, computer vision, and agentic AI architectures led by senior peers and industry mentors.',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'text-[#D92525]',
      stats: '15+ Workshops Hosted',
    },
    {
      id: 'pillar-2',
      number: '02',
      title: 'CREATE',
      tagline: 'From Idea to Model in 36 Hours',
      description: '36-hour national hackathons, open-source AI libraries buildathons, and creative neural artwork exhibitions that redefine innovation.',
      icon: <Rocket className="w-6 h-6" />,
      color: 'text-[#D92525]',
      stats: '40+ Projects Built',
    },
    {
      id: 'pillar-3',
      number: '03',
      title: 'COMPETE',
      tagline: 'Championship Grit & Fire',
      description: 'Battle-tested on football fields, badminton courts, esports arenas, and Kaggle leaderboards. We play to win and support to the end.',
      icon: <Trophy className="w-6 h-6" />,
      color: 'text-[#D92525]',
      stats: '12+ Gold Medals',
    },
    {
      id: 'pillar-4',
      number: '04',
      title: 'CELEBRATE',
      tagline: 'Acoustic Guitars & Stage Lights',
      description: 'AURA Cultural Night, live student bands, flash mobs, street play drama, and unforgettable batch celebrations under open skies.',
      icon: <Music className="w-6 h-6" />,
      color: 'text-[#D92525]',
      stats: '800+ Fest Attendees',
    },
    {
      id: 'pillar-5',
      number: '05',
      title: 'LEAD',
      tagline: 'Architecting Student Culture',
      description: 'Empowering students to step up as organizers, event directors, tech leads, and mentors—building skills that last a lifetime.',
      icon: <Users className="w-6 h-6" />,
      color: 'text-[#D92525]',
      stats: '50+ Student Organizers',
    },
  ];

  return (
    <section className="relative paper-crumpled-bg text-[#121110] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-black/10 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto relative z-10 overflow-hidden">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-syne font-black text-4xl sm:text-6xl uppercase tracking-tight mb-4 text-[#121110] break-words">
            THE FIVE PILLARS OF <br />
            <span className="red-marker-line">AIMSA CULTURE</span>
          </h2>
          <p className="font-handwriting text-xl text-neutral-700 mt-2">
            Explore how we spend our college years—code, competition, culture, and community.
          </p>
        </div>

        {/* Pillars Scrapbook Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {pillars.map((pillar, idx) => {
            const isSelected = activePillar === pillar.id;
            const isLast = idx === pillars.length - 1;
            return (
              <motion.div
                key={pillar.id}
                onMouseEnter={() => setActivePillar(pillar.id)}
                onClick={() => setActivePillar(pillar.id)}
                className={`relative p-6 rounded-xs border transition-all duration-400 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[280px] md:min-h-[320px] ${
                  isLast ? 'sm:col-span-2 sm:max-w-md sm:mx-auto sm:w-full lg:col-span-1 lg:max-w-none' : ''
                } ${
                  isSelected
                    ? 'bg-[#FFFFFF] border-[#D92525] shadow-xl scale-[1.02] z-20'
                    : 'bg-[#F9F7F1] border-black/15 hover:bg-white/80'
                }`}
              >
                {/* Top Number & Icon */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono-tech font-bold text-sm tracking-widest text-neutral-600">
                      {pillar.number}
                    </span>
                    <div className={`p-2 rounded-lg bg-black/5 ${pillar.color}`}>
                      {pillar.icon}
                    </div>
                  </div>

                  <h3 className="font-syne font-black text-2xl uppercase tracking-tight text-[#121110] mb-2">
                    {pillar.title}
                  </h3>
                  <p className="font-mono-tech text-xs text-[#D92525] uppercase tracking-wider font-bold mb-4">
                    {pillar.tagline}
                  </p>

                  <p className="text-neutral-700 font-mono-tech text-xs leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                {/* Bottom Stats Badge */}
                <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between font-mono-tech text-[11px] uppercase tracking-wider">
                  <span className="text-neutral-800 font-bold">{pillar.stats}</span>
                  <ArrowUpRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-1 -translate-y-1 text-[#D92525]' : 'text-neutral-400'}`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
