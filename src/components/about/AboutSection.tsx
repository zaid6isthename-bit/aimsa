'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative paper-crumpled-bg py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-black/10 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Title (Exact to Screenshot 4) */}
        <div className="mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-syne font-extrabold text-4xl sm:text-5xl text-[#121110] tracking-tight uppercase"
          >
            About AIMSA
          </motion.h2>
        </div>

        {/* Main Grid Layout (Exact to Screenshot 4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Taped Notebook Sheet with Typewriter Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 relative p-8 sm:p-10 bg-[#F9F7F1] border border-black/10 rounded-sm shadow-xl tape-effect tape-kraft transform -rotate-1"
          >
            {/* Frosted Tape Strips on top left & top right */}
            <div className="absolute -top-3 left-8 w-24 h-6 bg-white/80 border-x border-black/10 shadow-xs z-30 transform -rotate-6 pointer-events-none" />
            <div className="absolute -top-3 right-8 w-24 h-6 bg-white/80 border-x border-black/10 shadow-xs z-30 transform rotate-3 pointer-events-none" />

            <p className="font-mono-tech text-sm sm:text-base text-neutral-800 leading-relaxed font-medium">
              The association is an undergraduate student organization created to empower and provide opportunities to artificial intelligence and machine learning students. We organize hackathons, technical workshops, inter-department sports tournaments, and cultural nights that build lifelong community bonds.
            </p>

            {/* Handwritten ink scribble note at bottom */}
            <div className="mt-8 pt-4 border-t border-black/10 flex items-center justify-between font-handwriting text-neutral-600 text-lg">
              <span>AIMSA AI & ML Department Council</span>
              <span className="text-xs font-mono-tech text-neutral-500">EST. 2024</span>
            </div>
          </motion.div>

          {/* Right Column: Layered Scrapbook Stack (Exact to Screenshot 4) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 relative flex justify-center"
          >
            <div className="relative w-full max-w-lg">
              
              {/* Kraft Brown Paper Backing Card */}
              <div className="absolute -top-6 -right-4 inset-0 bg-[#D0C3B0] border border-black/10 rounded-xs shadow-md transform rotate-3 z-0" />

              {/* Lined Graph Paper Card with Binder Hole Punches */}
              <div className="relative bg-[#F5F2E9] graph-paper-card border border-black/15 p-6 shadow-2xl rounded-xs z-10 transform -rotate-1">
                
                {/* Binder Hole Punches on left edge */}
                <div className="absolute top-0 bottom-0 left-3 flex flex-col justify-around py-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-3.5 h-3.5 rounded-full bg-[#E6E1D7] border border-black/20" />
                  ))}
                </div>

                {/* Content Inside Scrapbook */}
                <div className="pl-6">
                  {/* Handwritten annotations on top margin */}
                  <div className="mb-3 font-handwriting text-neutral-700 text-sm flex justify-between">
                    <span>Heath back issue...</span>
                    <span>AIMSA 2024 Lab</span>
                  </div>

                  {/* B&W Student Lab Photo */}
                  <div className="relative w-full aspect-[4/3] bg-neutral-900 border-2 border-white shadow-md overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000"
                      alt="AIMSA Team Collaboration"
                      fill
                      className="object-cover filter grayscale contrast-110"
                    />
                  </div>

                  {/* Handwritten ink arrow & note below photo */}
                  <div className="mt-4 font-handwriting text-neutral-800 text-base flex items-center justify-between">
                    <span>→ Code sprint & ML paper discussion</span>
                    <span className="text-xs font-mono-tech text-neutral-500">AP15</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
