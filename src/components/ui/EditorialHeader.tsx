'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface EditorialHeaderProps {
  onOpenJoinModal?: () => void;
}

export const EditorialHeader: React.FC<EditorialHeaderProps> = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'HOME', href: '/' },
    { label: 'ABOUT', href: '/about' },
    { label: 'PEOPLE', href: '/people' },
    { label: 'EVENTS', href: '/events' },
    { label: 'COMMUNITY', href: '/community' },
    { label: 'ACHIEVEMENTS', href: '/achievements' },
    { label: 'GALLERY', href: '/gallery' },
    { label: 'CONNECT', href: '/connect' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#E6E1D7]/95 backdrop-blur-md border-b border-black/15 py-3 shadow-md'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-syne font-black text-2xl tracking-tight text-[#121110] group-hover:text-[#D92525] transition-colors leading-none uppercase">
              AIMSA
            </span>
            <span className="font-mono-tech text-[10px] uppercase tracking-wider text-neutral-600 mt-1 font-semibold">
              AI & ML Students' Association
            </span>
          </div>
        </Link>

        {/* Desktop Navigation (Exact Foundation Links) */}
        <nav className="hidden lg:flex items-center gap-6 font-mono-tech text-xs text-[#121110] font-bold tracking-wider">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`transition-colors relative py-1 group flex items-center gap-1 ${
                  isActive ? 'text-[#D92525]' : 'hover:text-[#D92525]'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D92525] inline-block ml-0.5" />
                )}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#D92525] transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Sign Up / Connect Pill Button */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/connect"
            className="px-6 py-2.5 rounded-full bg-[#121110] hover:bg-[#D92525] text-white font-mono-tech font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span>JOIN AIMSA</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#121110] hover:text-[#D92525] transition-colors focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#E6E1D7] border-b border-black/15 px-6 pt-4 pb-8 shadow-xl"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-mono-tech font-bold text-sm py-2 border-b border-black/10 flex items-center justify-between ${
                      isActive ? 'text-[#D92525]' : 'text-[#121110] hover:text-[#D92525]'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-4 h-4 text-neutral-500" />
                  </Link>
                );
              })}
              <div className="pt-4 flex flex-col gap-3">
                <Link
                  href="/connect"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 bg-[#121110] text-white font-mono-tech font-bold text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>JOIN AIMSA</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
