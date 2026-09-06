'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EditorialHeader } from '@/components/ui/EditorialHeader';
import { EditorialFooter } from '@/components/ui/EditorialFooter';
import { X, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { StampBadge } from '@/components/ui/StampBadge';

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/gallery')
      .then(r => r.json())
      .then(data => {
        setItems(data.images || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = ['ALL', 'Technical', 'Cultural', 'Sports', 'Community', 'Celebrations'];

  const filteredItems = selectedCategory === 'ALL'
    ? items
    : items.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#E6E1D7] text-[#121110] paper-crumpled-bg flex flex-col font-sans overflow-x-hidden">
      <EditorialHeader />

      <main className="flex-1 pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full select-none overflow-hidden">
        {/* Header Title */}
        <div className="border-b border-black/15 pb-12 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#D92525] font-bold">
              AIMSA VISUAL ARCHIVE • FIELD JOURNAL
            </span>
            <h1 className="font-syne font-black text-5xl sm:text-7xl text-[#121110] uppercase tracking-tight mt-2 break-words">
              VISUAL <span className="red-marker-line">GALLERY</span>
            </h1>
            <p className="font-mono-tech text-xs sm:text-sm text-neutral-700 max-w-2xl mt-4 leading-relaxed">
              Explore photo field-journals across technical hackathons, cultural nights, sports championships, and campus life. Click any polaroid to expand into full screen.
            </p>
          </div>
          <StampBadge size={110} variant="red" text="• AIMSA GALLERY • VISUAL ARCHIVE •" />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 mb-12 font-mono-tech text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full font-bold uppercase tracking-wider transition-all border ${
                selectedCategory === cat
                  ? 'bg-[#121110] text-white border-[#121110] shadow-md'
                  : 'bg-[#F9F7F1] text-neutral-800 border-black/15 hover:border-[#D92525]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Polaroid Scrapbook Masonry Grid */}
        <div className="relative w-full graph-paper-card border border-black/15 p-6 sm:p-12 rounded-xs shadow-2xl overflow-hidden mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-4 py-12 text-center text-neutral-500 font-mono-tech text-xs uppercase">Loading gallery...</div>
            ) : (
              filteredItems.map((item: any, idx: number) => (
                <div
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className="polaroid-card-light bg-white border border-black/15 p-3 rounded-xs cursor-pointer group shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 relative"
                >
                  {/* Frosted Tape */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/80 border-x border-black/10 shadow-xs z-30 pointer-events-none transform -rotate-2" />

                  <div className="relative w-full aspect-[4/3] bg-neutral-900 overflow-hidden rounded-xs">
                    <Image
                      src={item.url}
                      alt={item.caption}
                      fill
                      sizes="300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 bg-black/80 text-white rounded font-mono-tech text-[9px] uppercase font-bold">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 text-center overflow-hidden">
                    <p className="font-handwriting text-lg text-neutral-800 font-bold group-hover:text-[#D92525] transition-colors leading-tight line-clamp-2">
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Lightbox Modal */}
        {activeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md text-white">
            <div className="relative max-w-4xl w-full bg-[#FAF8F5] text-[#121110] border border-black/20 rounded-xs overflow-hidden shadow-2xl flex flex-col md:flex-row">
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 z-30 p-2 text-neutral-800 bg-white/80 hover:bg-[#D92525] hover:text-white rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative w-full md:w-2/3 min-h-[350px] md:min-h-[500px] bg-black">
                <Image
                  src={activeItem.url}
                  alt={activeItem.title}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="w-full md:w-1/3 p-6 sm:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-black/15">
                <div>
                  <span className="px-3 py-1 bg-[#D92525] text-white rounded-full font-mono-tech text-[10px] uppercase font-bold tracking-widest inline-block mb-4">
                    {activeItem.category}
                  </span>

                  <h3 className="font-syne font-black text-2xl uppercase text-[#121110] mb-3">
                    {activeItem.title}
                  </h3>

                  <p className="font-handwriting text-2xl text-[#D92525] leading-snug mb-6">
                    "{activeItem.caption}"
                  </p>

                  <div className="space-y-2 font-mono-tech text-xs uppercase text-neutral-600 border-t border-black/15 pt-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#D92525]" />
                      <span>{activeItem.date}</span>
                    </div>
                    {activeItem.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-600" />
                        <span>{activeItem.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-black/15">
                  <span className="font-mono-tech text-[10px] uppercase text-neutral-500 tracking-widest block font-bold">
                    AIMSA OFFICIAL ARCHIVE • MEMORY #{activeItem.id}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <EditorialFooter />
    </div>
  );
}
