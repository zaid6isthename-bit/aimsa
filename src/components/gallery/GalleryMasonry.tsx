'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin } from 'lucide-react';

export const GalleryMasonry: React.FC = () => {
  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/gallery')
      .then(r => r.json())
      .then(data => {
        setGalleryItems(data.images || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const collageItems = [
    { id: 'gal-1', rotation: -6, width: 'w-48 sm:w-60' },
    { id: 'gal-2', rotation: 4, width: 'w-52 sm:w-64' },
    { id: 'gal-3', rotation: -3, width: 'w-48 sm:w-60' },
    { id: 'gal-4', rotation: 6, width: 'w-52 sm:w-64' },
    { id: 'gal-5', rotation: -5, width: 'w-48 sm:w-60' },
    { id: 'gal-6', rotation: 3, width: 'w-52 sm:w-64' },
    { id: 'gal-7', rotation: -2, width: 'w-48 sm:w-60' },
    { id: 'gal-8', rotation: 5, width: 'w-52 sm:w-64' },
  ];

  return (
    <section id="gallery" className="relative paper-crumpled-bg py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-black/10 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header (Exact to Screenshot 3: "Gallery") */}
        <div className="mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-syne font-black text-5xl sm:text-6xl text-[#121110] tracking-tight uppercase"
          >
            Gallery
          </motion.h2>
        </div>

        {/* Dense Organic Polaroid Collage Grid (Exact to Reference Screenshot 3) */}
        <div className="relative w-full graph-paper-card border border-black/15 p-6 sm:p-12 rounded-xs shadow-2xl overflow-hidden">
          
          {/* Handwritten ink margin note on left */}
          <div className="mb-8 font-handwriting text-neutral-700 text-base max-w-xs rotate-[-3deg]">
            <p>Steering with code & art,</p>
            <p>AIMSA memories captured in frame.</p>
            <p className="text-xs text-neutral-500 font-mono-tech mt-1">Research & Culture Archive</p>
          </div>

          {/* Overlapping Polaroid Collage Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 items-center justify-center">
            {loading ? (
              <div className="col-span-4 py-12 text-center text-neutral-500 font-mono-tech text-xs uppercase">Loading gallery...</div>
            ) : (
              collageItems.map((item, index) => {
                const fullItem = galleryItems[index % galleryItems.length];
                if (!fullItem) return null;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.06 }}
                    style={{ transform: `rotate(${item.rotation}deg)` }}
                    onClick={() => setActiveItem(fullItem)}
                    className="polaroid-card-light cursor-pointer group relative"
                  >
                    {/* Frosted Translucent Tape Strip */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/80 backdrop-blur-xs border-x border-black/10 shadow-xs z-30 pointer-events-none transform -rotate-2" />

                    {/* Photo */}
                    <div className="relative w-full aspect-[4/3] bg-neutral-200 overflow-hidden">
                      <Image
                        src={fullItem.url}
                        alt={fullItem.caption}
                        fill
                        sizes="300px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Handwritten caption */}
                    <div className="mt-3 text-center">
                      <p className="font-handwriting text-lg text-neutral-800 font-bold group-hover:text-[#D92525] transition-colors leading-tight">
                        {fullItem.caption}
                      </p>
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
      </div>

      {/* Lightbox Fullscreen Modal */}
      <AnimatePresence>
        {activeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl w-full bg-[#181816] border border-white/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 z-30 p-2 text-white bg-black/60 hover:bg-[#D92525] rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Lightbox Image */}
              <div className="relative w-full md:w-2/3 min-h-[350px] md:min-h-[500px] bg-black">
                <Image
                  src={activeItem.url}
                  alt={activeItem.title}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Lightbox Info */}
              <div className="w-full md:w-1/3 p-6 sm:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10">
                <div>
                  <span className="px-3 py-1 bg-[#D92525] text-white rounded-full font-mono-tech text-[10px] uppercase font-bold tracking-widest inline-block mb-4">
                    {activeItem.category}
                  </span>

                  <h3 className="font-syne font-black text-2xl uppercase text-white mb-3">
                    {activeItem.title}
                  </h3>

                  <p className="font-handwriting text-2xl text-amber-200 leading-snug mb-6">
                    "{activeItem.caption}"
                  </p>

                  <div className="space-y-2 font-mono-tech text-xs uppercase text-neutral-400 border-t border-white/10 pt-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#D92525]" />
                      <span>{activeItem.date}</span>
                    </div>
                    {activeItem.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-400" />
                        <span>{activeItem.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <div className="font-mono-tech text-[10px] uppercase text-neutral-500 tracking-widest">
                    AIMSA OFFICIAL ARCHIVE • MEMORY #{activeItem.id}
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
