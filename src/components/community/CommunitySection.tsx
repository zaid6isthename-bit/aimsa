'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export const CommunitySection: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/community')
      .then(r => r.json())
      .then(data => {
        setActivities(data.activities || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="community" className="relative paper-crumpled-bg text-[#121110] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-black/10 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto relative z-10 overflow-hidden">
        
        {/* Header Banner */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="font-syne font-black text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight mb-6 text-[#121110]">
            "AI & ML IS OUR FIELD. <br />
            <span className="red-marker-line">COMMUNITY IS OUR IDENTITY</span>"
          </h2>

          <p className="font-handwriting text-2xl text-neutral-800 leading-relaxed max-w-2xl mx-auto">
            Beyond GPUs, neural networks, and algorithms lies a vibrant family of musicians, athletes, artists, organizers, and lifelong friends.
          </p>
        </div>

        {/* Community Activity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {loading ? (
            <div className="col-span-2 py-12 text-center text-neutral-500 font-mono-tech text-xs uppercase">Loading community...</div>
          ) : (
            activities.map((activity: any, index: number) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative p-6 sm:p-8 rounded-xs bg-[#F9F7F1] border border-black/15 hover:border-[#D92525]/50 transition-all duration-300 group shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-full h-56 rounded-xs overflow-hidden mb-6 bg-neutral-200 border border-black/10">
                    <Image
                      src={activity.imageUrl}
                      alt={activity.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 border border-black/10 rounded-full font-mono-tech text-xs font-bold text-[#121110] uppercase tracking-wider">
                        {activity.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-syne font-black text-2xl uppercase text-[#121110] group-hover:text-[#D92525] transition-colors mb-3">
                    {activity.title}
                  </h3>

                  <p className="text-neutral-700 font-mono-tech text-xs leading-relaxed mb-6">
                    {activity.description}
                  </p>
                </div>

                {/* Quote Footer */}
                {activity.quote && (
                  <div className="pt-4 border-t border-black/10 bg-[#F2EDE2] p-4 rounded-xs">
                    <Quote className="w-4 h-4 text-[#D92525] mb-2" />
                    <p className="font-handwriting text-xl text-neutral-900 leading-snug">
                      "{activity.quote}"
                    </p>
                    <div className="mt-2 font-mono-tech text-[11px] uppercase text-neutral-600 font-bold">
                      — {activity.authorName} ({activity.authorRole})
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>

        {/* Culture Ticker / Banner */}
        <div className="p-8 rounded-xs bg-[#FAF8F5] border border-black/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg tape-effect tape-amber">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-sm bg-[#D92525] flex items-center justify-center font-syne font-black text-white text-xl shrink-0 shadow-md">
              AI
            </div>
            <div>
              <h4 className="font-syne font-black text-xl uppercase text-[#121110]">
                WANT TO START A NEW AIMSA CLUB OR INITIATIVE?
              </h4>
              <p className="font-mono-tech text-xs text-neutral-700 mt-1">
                Whether it's an AI Ethics reading circle, esports team, or photography crew—AIMSA backs student initiative with funding, logistics, and promotion.
              </p>
            </div>
          </div>
          <a
            href="#connect"
            className="px-6 py-3 rounded-full bg-[#121110] hover:bg-[#D92525] text-white font-mono-tech font-bold text-xs uppercase tracking-wider transition-all shrink-0 shadow-md"
          >
            PITCH AN IDEA
          </a>
        </div>
      </div>
    </section>
  );
};
