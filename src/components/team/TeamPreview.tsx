'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { TeamMember } from '@/types';
import { InstagramIcon, LinkedinIcon, GithubIcon } from '../ui/SocialIcons';
import { Mail, X, Quote } from 'lucide-react';

export const TeamPreview: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
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

  const executiveLeads = members.slice(0, 4);

  return (
    <section id="team" className="relative paper-crumpled-bg text-[#121110] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-black/10 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto relative z-10 overflow-hidden">
        
        {/* Section Header (Exact to Screenshot 5: "Team" with Red Underline) */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-syne font-black text-5xl sm:text-7xl text-[#121110] tracking-tight uppercase inline-block break-words"
          >
            <span className="red-marker-line">Team</span>
          </motion.h2>
        </div>

        {/* Massive 01, 02, 03, 04 Executive Leads Grid (Exact to Screenshot 5 - Light Paper Blended) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 items-start">
          {loading ? (
            <div className="col-span-4 py-12 text-center text-neutral-500 font-mono-tech text-xs uppercase">Loading team...</div>
          ) : (
            executiveLeads.map((member: any, index: number) => {
              const numberStr = `0${index + 1}.`;
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center group cursor-pointer"
                  onClick={() => setSelectedMember(member)}
                >
                  {/* Massive Number (01., 02., 03., 04.) */}
                  <span className="font-syne font-black text-6xl sm:text-7xl lg:text-8xl xl:text-9xl text-[#121110] tracking-tighter leading-none mb-6 group-hover:text-[#D92525] transition-colors break-words">
                    {numberStr}
                  </span>

                  {/* Taped B&W Polaroid Photo below number */}
                  <div className="relative w-full max-w-xs polaroid-card-light p-3 rounded-xs transform group-hover:rotate-1 transition-all duration-300 shadow-2xl bg-white border border-black/10">
                    {/* Translucent Masking Tape Strip on Top */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-white/80 backdrop-blur-xs border-x border-black/10 z-20 pointer-events-none transform -rotate-2" />

                    {/* Photo */}
                    <div className="relative w-full aspect-[4/5] bg-neutral-900 overflow-hidden">
                      <Image
                        src={member.photoUrl}
                        alt={member.name}
                        fill
                        sizes="300px"
                        className="object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>

                    {/* Handwritten Typewriter Title below photo (PRESIDENT, VICE PRESIDENT, etc.) */}
                    <div className="mt-3 text-center">
                      <p className="font-mono-tech text-xs uppercase text-neutral-800 font-bold tracking-widest group-hover:text-[#D92525] transition-colors">
                        {member.role}
                      </p>
                      <p className="font-sans text-sm text-neutral-600 font-medium mt-0.5">
                        {member.name}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Starburst icon in bottom right */}
        <div className="absolute bottom-6 right-6 text-neutral-400 opacity-60 text-3xl font-mono-tech pointer-events-none">
          ✦
        </div>
      </div>

      {/* Member Bio Light Paper Modal */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm text-[#121110]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#FAF8F5] border border-black/20 rounded-xl p-6 sm:p-8 shadow-2xl overflow-hidden tape-effect tape-kraft"
            >
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 p-2 text-neutral-600 hover:text-black bg-black/5 hover:bg-black/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <div className="sm:col-span-5 relative w-full aspect-[4/5] bg-neutral-900 rounded-lg overflow-hidden border border-black/10">
                  <Image
                    src={selectedMember.photoUrl}
                    alt={selectedMember.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="sm:col-span-7 space-y-4">
                  <div>
                    <span className="font-mono-tech text-xs uppercase tracking-widest text-[#D92525] font-bold">
                      {selectedMember.highlightTag || 'AIMSA EXECUTIVE'}
                    </span>
                    <h3 className="font-syne font-black text-3xl text-[#121110] uppercase mt-1">
                      {selectedMember.name}
                    </h3>
                    <p className="font-mono-tech text-sm text-neutral-700 uppercase font-semibold">
                      {selectedMember.role}
                    </p>
                  </div>

                  <p className="text-neutral-700 font-mono-tech text-xs leading-relaxed">
                    {selectedMember.bio}
                  </p>

                  {selectedMember.quote && (
                    <div className="p-4 bg-[#F2EDE2] border-l-2 border-[#D92525] rounded-r-lg">
                      <Quote className="w-4 h-4 text-[#D92525] mb-1" />
                      <p className="font-handwriting italic text-neutral-900 text-lg">
                        "{selectedMember.quote}"
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    {selectedMember.github && (
                      <a
                        href={selectedMember.github}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-full bg-black/10 hover:bg-black/20 text-[#121110] font-mono-tech text-xs uppercase tracking-wider flex items-center gap-2 font-bold"
                      >
                        <GithubIcon className="w-4 h-4" />
                        <span>GITHUB</span>
                      </a>
                    )}
                    {selectedMember.linkedin && (
                      <a
                        href={selectedMember.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-full bg-[#0A66C2] hover:bg-[#08529c] text-white font-mono-tech text-xs uppercase tracking-wider flex items-center gap-2 font-bold"
                      >
                        <LinkedinIcon className="w-4 h-4" />
                        <span>LINKEDIN</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
