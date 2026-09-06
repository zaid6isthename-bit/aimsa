'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, CheckCircle2 } from 'lucide-react';
import { InstagramIcon, LinkedinIcon } from '../ui/SocialIcons';

interface JoinCtaSectionProps {
  isModalOpen?: boolean;
  onCloseModal?: () => void;
  onOpenModal?: () => void;
}

export const JoinCtaSection: React.FC<JoinCtaSectionProps> = ({
  isModalOpen: externalModalOpen,
  onCloseModal: externalCloseModal,
  onOpenModal: externalOpenModal,
}) => {
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    year: '1st Year',
    interest: 'Technical / AI',
  });

  const isModalOpen = externalModalOpen ?? internalModalOpen;
  const handleOpen = externalOpenModal ?? (() => setInternalModalOpen(true));
  const handleClose = externalCloseModal ?? (() => {
    setInternalModalOpen(false);
    setFormSubmitted(false);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  // Polaroid collage data matching reference video photos
  const polaroids = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600',
      caption: 'Football Finals Victory',
      rotation: -6,
      top: '0px',
      left: '2%',
      width: 'w-48 sm:w-60',
      zIndex: 10,
      tapePos: '-top-3 left-1/3 -rotate-6',
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&q=80&w=600',
      caption: 'Track Championship Banner',
      rotation: -2,
      top: '110px',
      left: '6%',
      width: 'w-52 sm:w-64',
      zIndex: 25,
      tapePos: '-top-3 left-1/2 rotate-3',
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600',
      caption: 'AIMSA Lawn Gathering',
      rotation: 3,
      top: '40px',
      left: '26%',
      width: 'w-48 sm:w-56',
      zIndex: 30,
      tapePos: '-top-4 left-1/3 rotate-2',
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600',
      caption: 'AURA Cultural Stage',
      rotation: 2,
      top: '-10px',
      left: '42%',
      width: 'w-52 sm:w-60',
      zIndex: 15,
      tapePos: '-top-3 right-1/4 -rotate-3',
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600',
      caption: 'Neural Hack 2024 Squad',
      rotation: -4,
      top: '75px',
      left: '44%',
      width: 'w-52 sm:w-64',
      zIndex: 35,
      tapePos: '-top-3 left-1/2 rotate-1',
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600',
      caption: 'Workshop Attendees',
      rotation: 4,
      top: '10px',
      left: '58%',
      width: 'w-48 sm:w-56',
      zIndex: 20,
      tapePos: '-top-3 left-1/3 rotate-6',
    },
    {
      id: 7,
      url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600',
      caption: 'Team Lanyards & Crew',
      rotation: 2,
      top: '90px',
      left: '70%',
      width: 'w-52 sm:w-64',
      zIndex: 25,
      tapePos: '-top-3 right-1/3 -rotate-2',
    },
  ];

  return (
    <section id="connect" className="relative paper-crumpled-bg py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center overflow-hidden">
        {/* TOP: Dense Overlapping Polaroid Collage Cluster (Exact to Reference Video) */}
        <div className="relative w-full h-[320px] sm:h-[400px] max-w-6xl mb-12 sm:mb-16">
          {/* Handwritten ink note scribble on left */}
          <div className="absolute top-12 left-0 sm:left-4 z-40 max-w-[140px] font-handwriting text-neutral-800 text-sm sm:text-base leading-tight rotate-[-6deg]">
            <p>Dreaming worth</p>
            <p>both code and art</p>
            <p>to be found in</p>
            <p>AIMSA memories.</p>
            <p className="text-xs text-neutral-600 mt-1 font-mono-tech">Research & Culture.</p>
          </div>

          {/* Overlapping Polaroid Cards */}
          {polaroids.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: p.id * 0.08 }}
              style={{
                top: p.top,
                left: p.left,
                transform: `rotate(${p.rotation}deg)`,
                zIndex: p.zIndex,
              }}
              className={`absolute polaroid-card-light cursor-pointer group ${p.width}`}
              onClick={handleOpen}
            >
              {/* Frosted Translucent Tape Strip */}
              <div
                className={`absolute w-16 h-5 bg-white/80 backdrop-blur-xs border-x border-black/10 shadow-xs z-30 pointer-events-none ${p.tapePos}`}
              />

              {/* Photo */}
              <div className="relative w-full aspect-[4/3] bg-neutral-200 overflow-hidden">
                <Image
                  src={p.url}
                  alt={p.caption}
                  fill
                  sizes="300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* MIDDLE: Massive Solid Black Title "BE PART OF AIMSA" (Exact to Reference Video) */}
        <div
          onClick={handleOpen}
          className="cursor-pointer text-center group my-6 sm:my-10 overflow-hidden"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-syne font-black text-5xl sm:text-7xl lg:text-8xl xl:text-[118px] text-[#121110] tracking-tight uppercase leading-[0.88] group-hover:text-[#FF3B00] transition-colors break-words"
          >
            BE PART <br />
            OF AIMSA
          </motion.h2>
        </div>

        {/* BOTTOM: Typewriter Social Links & Starburst Accent (Exact to Reference Video) */}
        <div className="w-full max-w-2xl mt-12 sm:mt-16 flex items-center justify-center gap-12 font-mono-tech text-base sm:text-lg text-[#121110] uppercase tracking-wider">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="hover:underline underline-offset-8 decoration-2 decoration-[#121110] transition-all flex items-center gap-2 font-semibold"
          >
            <span>Instagram</span>
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="hover:underline underline-offset-8 decoration-2 decoration-[#121110] transition-all flex items-center gap-2 font-semibold"
          >
            <span>LinkedIn</span>
          </a>

          <button
            onClick={handleOpen}
            className="hover:underline underline-offset-8 decoration-2 decoration-[#FF3B00] text-[#FF3B00] transition-all font-bold"
          >
            <span>[ JOIN NOW ]</span>
          </button>
        </div>

        {/* Starburst icon in bottom right */}
        <div className="absolute bottom-6 right-6 text-neutral-400 opacity-60 text-2xl font-mono-tech pointer-events-none">
          ✦
        </div>
      </div>

      {/* AIMSA Join Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-[#161614] border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden"
            >
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {formSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-syne font-black text-3xl text-white uppercase">
                    WELCOME TO AIMSA!
                  </h3>
                  <p className="text-neutral-300 font-sans text-sm max-w-md mx-auto">
                    Thank you, <strong className="text-white">{formData.name}</strong>! Your application has been received. The AIMSA Executive Committee will reach out to you via email shortly.
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-4 px-6 py-2.5 rounded-full bg-[#FF3B00] text-white font-syne font-bold text-xs uppercase tracking-wider"
                  >
                    CLOSE WINDOW
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <span className="font-mono-tech text-xs uppercase tracking-widest text-[#FF3B00] font-bold">
                      BE PART OF AIMSA
                    </span>
                    <h3 className="font-syne font-black text-3xl text-white uppercase mt-1">
                      AIMSA MEMBERSHIP FORM
                    </h3>
                    <p className="text-neutral-400 font-sans text-xs mt-1">
                      Join the AI & ML student family — hackathons, sports, culture & events.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block font-mono-tech text-xs uppercase text-neutral-300 mb-1">
                        FULL NAME
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aarav Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border border-white/15 rounded-lg text-white placeholder-neutral-500 font-sans text-sm focus:outline-none focus:border-[#FF3B00]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono-tech text-xs uppercase text-neutral-300 mb-1">
                        COLLEGE EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="student@college.edu"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border border-white/15 rounded-lg text-white placeholder-neutral-500 font-sans text-sm focus:outline-none focus:border-[#FF3B00]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono-tech text-xs uppercase text-neutral-300 mb-1">
                          YEAR OF STUDY
                        </label>
                        <select
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                          className="w-full px-4 py-3 bg-black/50 border border-white/15 rounded-lg text-white font-sans text-sm focus:outline-none focus:border-[#FF3B00]"
                        >
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-mono-tech text-xs uppercase text-neutral-300 mb-1">
                          PRIMARY INTEREST
                        </label>
                        <select
                          value={formData.interest}
                          onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                          className="w-full px-4 py-3 bg-black/50 border border-white/15 rounded-lg text-white font-sans text-sm focus:outline-none focus:border-[#FF3B00]"
                        >
                          <option value="Technical / AI">Technical / AI</option>
                          <option value="Cultural / Music">Cultural / Music</option>
                          <option value="Sports / Gaming">Sports / Gaming</option>
                          <option value="Media & Design">Media & Design</option>
                          <option value="Event Ops & Logistics">Event Ops & Logistics</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 mt-2 rounded-full bg-[#FF3B00] hover:bg-[#E03400] text-white font-syne font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>SUBMIT APPLICATION</span>
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
