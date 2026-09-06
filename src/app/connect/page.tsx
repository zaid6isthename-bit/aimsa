'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { EditorialHeader } from '@/components/ui/EditorialHeader';
import { EditorialFooter } from '@/components/ui/EditorialFooter';
import { InstagramIcon, LinkedinIcon, GithubIcon } from '@/components/ui/SocialIcons';
import { Mail, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { StampBadge } from '@/components/ui/StampBadge';

export default function ConnectPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    year: '1st Year',
    interest: 'Technical / AI',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#E6E1D7] text-[#121110] paper-crumpled-bg flex flex-col font-sans">
      <EditorialHeader />

      <main className="flex-1 pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full select-none">
        {/* Header Title */}
        <div className="border-b border-black/15 pb-12 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#D92525] font-bold">
              GET IN TOUCH & JOIN THE FAMILY
            </span>
            <h1 className="font-syne font-black text-5xl sm:text-7xl text-[#121110] uppercase tracking-tight mt-2">
              CONNECT <span className="red-marker-line">WITH AIMSA</span>
            </h1>
            <p className="font-mono-tech text-xs sm:text-sm text-neutral-700 max-w-2xl mt-4 leading-relaxed">
              Apply for membership, pitch an event idea, request tech sponsorships, or visit our campus department hub.
            </p>
          </div>
          <StampBadge size={110} variant="red" text="• JOIN AIMSA • CONNECT • CAMPUS HUB •" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Membership Application Form */}
          <div className="lg:col-span-7 bg-[#FAF8F5] border border-black/20 p-8 sm:p-12 rounded-xs shadow-2xl tape-effect tape-kraft">
            <span className="font-mono-tech text-xs uppercase text-[#D92525] font-bold tracking-widest">
              AIMSA MEMBERSHIP FORM 2025-26
            </span>
            <h2 className="font-syne font-black text-3xl sm:text-4xl text-[#121110] uppercase mt-2 mb-6">
              BECOME AN OFFICIAL MEMBER
            </h2>

            {formSubmitted ? (
              <div className="text-center py-12 space-y-4 bg-white border border-black/15 p-8 rounded-xs">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-syne font-black text-3xl text-[#121110] uppercase">
                  APPLICATION RECEIVED!
                </h3>
                <p className="font-mono-tech text-xs text-neutral-700 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-[#121110]">{formData.name}</strong>! Your application has been logged into the AIMSA 2025-26 database. The Executive Committee will send your welcome kit to <span className="text-[#D92525]">{formData.email}</span> shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 font-mono-tech text-xs">
                <div>
                  <label className="block uppercase text-neutral-800 font-bold mb-2">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-black/20 rounded-xs text-[#121110] placeholder-neutral-400 focus:outline-none focus:border-[#D92525]"
                  />
                </div>

                <div>
                  <label className="block uppercase text-neutral-800 font-bold mb-2">
                    COLLEGE EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@college.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-black/20 rounded-xs text-[#121110] placeholder-neutral-400 focus:outline-none focus:border-[#D92525]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase text-neutral-800 font-bold mb-2">
                      YEAR OF STUDY
                    </label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-black/20 rounded-xs text-[#121110] focus:outline-none focus:border-[#D92525]"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>

                  <div>
                    <label className="block uppercase text-neutral-800 font-bold mb-2">
                      PRIMARY INTEREST
                    </label>
                    <select
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-black/20 rounded-xs text-[#121110] focus:outline-none focus:border-[#D92525]"
                    >
                      <option value="Technical / AI">Technical / AI</option>
                      <option value="Cultural / Music">Cultural / Music</option>
                      <option value="Sports / Gaming">Sports / Gaming</option>
                      <option value="Media & Design">Media & Design</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 mt-4 rounded-full bg-[#D92525] hover:bg-[#B81D1D] text-white font-mono-tech font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>SUBMIT APPLICATION</span>
                </button>
              </form>
            )}
          </div>

          {/* Social Channels & Campus Location */}
          <div className="lg:col-span-5 space-y-8 font-mono-tech">
            <div className="bg-[#F9F7F1] border border-black/15 p-8 rounded-xs shadow-xl space-y-6">
              <h3 className="font-syne font-black text-2xl text-[#121110] uppercase border-b border-black/15 pb-3">
                OFFICIAL SOCIAL CHANNELS
              </h3>

              <div className="space-y-4 text-xs font-bold text-neutral-800">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 p-3 bg-white border border-black/10 rounded-xs hover:border-[#D92525] transition-all group"
                >
                  <InstagramIcon className="w-5 h-5 text-[#D92525]" />
                  <div>
                    <p className="text-xs font-bold group-hover:text-[#D92525]">INSTAGRAM</p>
                    <p className="text-[10px] text-neutral-500 font-normal">@aimsa_official</p>
                  </div>
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 p-3 bg-white border border-black/10 rounded-xs hover:border-[#0A66C2] transition-all group"
                >
                  <LinkedinIcon className="w-5 h-5 text-[#0A66C2]" />
                  <div>
                    <p className="text-xs font-bold group-hover:text-[#0A66C2]">LINKEDIN</p>
                    <p className="text-[10px] text-neutral-500 font-normal">AIMSA Student Council</p>
                  </div>
                </a>

                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 p-3 bg-white border border-black/10 rounded-xs hover:border-[#121110] transition-all group"
                >
                  <GithubIcon className="w-5 h-5 text-[#121110]" />
                  <div>
                    <p className="text-xs font-bold group-hover:text-[#121110]">GITHUB</p>
                    <p className="text-[10px] text-neutral-500 font-normal">github.com/aimsa-org</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Office Location */}
            <div className="bg-[#FAF8F5] border border-black/15 p-8 rounded-xs shadow-xl space-y-4">
              <h3 className="font-syne font-black text-2xl text-[#121110] uppercase flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#D92525]" />
                <span>AIMSA HEADQUARTERS</span>
              </h3>
              <p className="text-xs text-neutral-700 leading-relaxed">
                Room 304, Department of Artificial Intelligence & Machine Learning, Main Academic Block.
              </p>
              <p className="text-[11px] text-neutral-500 font-bold">
                OFFICE HOURS: MON - FRI (04:00 PM - 07:00 PM IST)
              </p>
            </div>
          </div>
        </div>
      </main>

      <EditorialFooter />
    </div>
  );
}
