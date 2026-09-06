'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, Search } from 'lucide-react';
import { InstagramIcon, LinkedinIcon, GithubIcon } from '../ui/SocialIcons';

interface CinematicHeroProps {
  onExploreEvents?: () => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({ onExploreEvents }) => {
  return (
    <section className="relative min-h-screen w-full paper-crumpled-bg flex flex-col justify-between pt-28 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
      {/* Main Hero Grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto relative z-10">
        
        {/* Left Side: Typography & Buttons (Exact to Reference Screenshots 2 & 3) */}
        <div className="lg:col-span-6 flex flex-col items-start space-y-6">
          {/* Stacked Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-1"
          >
            <div className="flex items-center gap-3">
              <span className="font-syne font-black text-6xl sm:text-7xl lg:text-8xl tracking-tight text-[#121110] uppercase leading-none red-marker-circle">
                AIMSA
              </span>
            </div>
            <h1 className="font-syne font-black text-6xl sm:text-7xl lg:text-8xl tracking-tight text-[#121110] uppercase leading-none">
              AI
            </h1>
            <h1 className="font-syne font-black text-6xl sm:text-7xl lg:text-8xl tracking-tight text-[#121110] uppercase leading-none">
              <span className="red-marker-line">ML</span>
            </h1>
            <h1 className="font-syne font-black text-5xl sm:text-6xl lg:text-7xl tracking-tight text-[#121110] uppercase leading-none">
              COMMUNITY
            </h1>
          </motion.div>

          {/* Subtitle Monospace Typewriter Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-mono-tech text-sm sm:text-base text-neutral-700 max-w-lg leading-relaxed pt-2"
          >
            There with AIMSA accepting prospective men, science and focus activities in outcome-based capacity building, and forming concepts for applications.
          </motion.p>

          {/* Buttons (Exact Red Pill & Outline Pill from Screenshot 2 & 3) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <a
              href="#about"
              className="px-8 py-3.5 rounded-full bg-[#D92525] hover:bg-[#B81D1D] text-white font-mono-tech font-bold text-sm tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <span>Visit Website</span>
            </a>

            <a
              href="#connect"
              className="px-7 py-3.5 rounded-full border border-black/80 hover:bg-black/10 text-[#121110] font-mono-tech font-bold text-sm tracking-wider transition-all flex items-center gap-2"
            >
              <span>Connect Us</span>
            </a>
          </motion.div>
        </div>

        {/* Right Side: Film Strip Backing & Taped Polaroid Photo (Exact to Screenshot 2 & 3) */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-full max-w-md"
          >
            {/* Film strip black frame background */}
            <div className="filmstrip-border rounded-xs shadow-2xl p-4 transform rotate-2">
              <div className="relative w-full h-80 bg-neutral-900 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000"
                  alt="AIMSA Hackathon Lab"
                  fill
                  className="object-cover opacity-80"
                />
              </div>
            </div>

            {/* Large Polaroid Overlay Taped Over Film Strip */}
            <div className="absolute -top-6 -left-4 w-full polaroid-card-light transform -rotate-3 z-20 shadow-2xl">
              {/* Frosted Tape Strips on corners */}
              <div className="absolute -top-4 -left-4 w-20 h-6 bg-white/80 border-x border-black/10 shadow-xs z-30 transform -rotate-45 pointer-events-none" />
              <div className="absolute -bottom-4 -right-4 w-20 h-6 bg-white/80 border-x border-black/10 shadow-xs z-30 transform -rotate-45 pointer-events-none" />

              <div className="relative w-full aspect-[4/3] bg-neutral-100 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000"
                  alt="AIMSA Students Working"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="mt-3 px-2 flex items-center justify-between">
                <p className="font-mono-tech text-xs text-neutral-800 font-bold uppercase tracking-wider">
                  AIMSA TECH HACKATHON
                </p>
                <span className="font-mono-tech text-[10px] text-neutral-500">LAB 3</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar: Nav Links & Social Icons (Exact to Reference Screenshots) */}
      <div className="max-w-7xl mx-auto w-full pt-8 mt-8 border-t border-black/10 flex items-center justify-between font-mono-tech text-xs text-[#121110]">
        <div className="flex items-center gap-8 font-semibold">
          <a href="#" className="hover:text-[#D92525] transition-colors">Home</a>
          <a href="#about" className="hover:text-[#D92525] transition-colors">About</a>
          <a href="#connect" className="hover:text-[#D92525] transition-colors">Connect</a>
        </div>

        <div className="flex items-center gap-4 text-neutral-700">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#D92525]">
            <InstagramIcon className="w-4 h-4" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#D92525]">
            <LinkedinIcon className="w-4 h-4" />
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#D92525]">
            <GithubIcon className="w-4 h-4" />
          </a>
          <Search className="w-4 h-4 cursor-pointer hover:text-[#D92525]" />
        </div>
      </div>
    </section>
  );
};
