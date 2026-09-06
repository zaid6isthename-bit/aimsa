'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUp, Mail, Sparkles } from 'lucide-react';
import { StampBadge } from './StampBadge';
import { InstagramIcon, LinkedinIcon, GithubIcon } from './SocialIcons';

export const EditorialFooter: React.FC = () => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setTimeStr(now.toLocaleTimeString('en-US', options) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative paper-crumpled-bg text-[#121110] pt-16 pb-12 border-t border-black/15 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-black/15">
          
          {/* Column 1: Brand & Live Clock */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#121110] rounded-sm flex items-center justify-center font-syne font-black text-white text-xl shadow-md">
                  AI
                </div>
                <div>
                  <h3 className="font-syne font-black text-2xl tracking-tight text-[#121110]">AIMSA</h3>
                  <p className="font-mono-tech text-xs uppercase tracking-widest text-[#D92525] font-bold">
                    AI & ML STUDENTS' ASSOCIATION
                  </p>
                </div>
              </div>
              <p className="text-neutral-700 font-mono-tech text-xs max-w-sm leading-relaxed mb-6">
                The unofficial official living heart of the Artificial Intelligence & Machine Learning department. Run by students, powered by passion, built on community memories.
              </p>
            </div>

            {/* Live IST Clock */}
            <div className="p-4 bg-[#FAF8F5] border border-black/15 rounded-sm inline-flex items-center gap-4 max-w-xs shadow-sm">
              <div className="w-3 h-3 rounded-full bg-emerald-600 animate-ping" />
              <div>
                <div className="font-mono-tech text-[10px] uppercase text-neutral-500 tracking-widest font-bold">
                  CAMPUS TIME (INDIA)
                </div>
                <div className="font-mono-tech font-bold text-lg text-[#121110] tracking-wider">
                  {timeStr || '12:00:00 PM IST'}
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-3">
            <h4 className="font-syne font-bold text-sm uppercase tracking-widest text-[#D92525] mb-5 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>NAVIGATION</span>
            </h4>
            <ul className="space-y-3 font-mono-tech text-xs uppercase tracking-wider text-neutral-800 font-semibold">
              <li>
                <Link href="/about" className="hover:text-[#D92525] transition-colors">
                  01. ABOUT AIMSA
                </Link>
              </li>
              <li>
                <Link href="/people" className="hover:text-[#D92525] transition-colors">
                  02. OUR PEOPLE & LEADS
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#D92525] transition-colors">
                  03. EVENTS & HACKATHONS
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-[#D92525] transition-colors">
                  04. COMMUNITY & CULTURE
                </Link>
              </li>
              <li>
                <Link href="/achievements" className="hover:text-[#D92525] transition-colors">
                  05. WALL OF FAME
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#D92525] transition-colors">
                  06. VISUAL ARCHIVE
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Stamp & Social Links */}
          <div className="md:col-span-4 flex flex-col justify-between items-start md:items-end">
            <StampBadge size={120} variant="red" />

            <div className="mt-8 md:mt-0">
              <h4 className="font-syne font-bold text-sm uppercase tracking-widest text-[#D92525] mb-4 md:text-right">
                CONNECT WITH US
              </h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white border border-black/15 flex items-center justify-center text-neutral-800 hover:text-white hover:bg-[#D92525] hover:border-[#D92525] transition-all shadow-xs"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white border border-black/15 flex items-center justify-center text-neutral-800 hover:text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] transition-all shadow-xs"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white border border-black/15 flex items-center justify-center text-neutral-800 hover:text-white hover:bg-[#121110] hover:border-[#121110] transition-all shadow-xs"
                  aria-label="GitHub"
                >
                  <GithubIcon className="w-5 h-5" />
                </a>
                <a
                  href="mailto:aimsa@college.edu"
                  className="w-10 h-10 rounded-full bg-white border border-black/15 flex items-center justify-center text-neutral-800 hover:text-white hover:bg-[#D92525] hover:border-[#D92525] transition-all shadow-xs"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Portal Entry — subtle premium link */}
        <div className="pt-6 pb-4 border-t border-black/8 mt-6">
          <div className="flex flex-col items-center gap-3">
            <Link
              href="/admin/login"
              className="group inline-flex items-center gap-2 px-5 py-2 rounded-full border border-black/10 bg-white/50 hover:bg-[#121110] hover:border-[#121110] transition-all duration-300"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 group-hover:bg-emerald-400 transition-colors" />
              <span className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-neutral-500 group-hover:text-white transition-colors font-bold">
                AIMSA Admin Portal
              </span>
            </Link>
          </div>
        </div>

        {/* Bottom copyright & Back to Top */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-mono-tech text-xs text-neutral-600">
          <p>© {new Date().getFullYear()} AIMSA (AI & ML Students' Association). All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-neutral-500 font-bold">AI & ML Department Council</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-neutral-800 hover:text-[#D92525] transition-colors group font-bold"
            >
              <span>BACK TO TOP</span>
              <div className="w-7 h-7 rounded-full bg-white border border-black/15 flex items-center justify-center group-hover:bg-[#D92525] group-hover:text-white transition-all shadow-xs">
                <ArrowUp className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
