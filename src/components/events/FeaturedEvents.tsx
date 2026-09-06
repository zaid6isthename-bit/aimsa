'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { EventItem } from '@/types';
import { Calendar, Clock, MapPin, X, ArrowUpRight, Ticket, Barcode } from 'lucide-react';

export const FeaturedEvents: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/events')
      .then(r => r.json())
      .then(data => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="events" className="relative paper-crumpled-bg py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-black/10 overflow-hidden select-none">
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Section Header (Exact to Screenshots 1 & 2: "Events" with Red Underline and Red Arrow Scribble) */}
        <div className="flex items-center justify-between mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-syne font-black text-5xl sm:text-6xl text-[#121110] tracking-tight uppercase inline-block"
          >
            <span className="red-marker-line">Events</span>
          </motion.h2>

          {/* Red marker arrow scribble in top right */}
          <div className="font-handwriting text-[#D92525] text-2xl font-bold rotate-12 flex items-center gap-1">
            <span>w↗</span>
          </div>
        </div>

        {/* Perforated Ticket Event List / Table (Exact to Reference Screenshots 1 & 2) */}
        <div className="border-t border-b border-black/20 font-mono-tech divide-y divide-black/15">
          {loading ? (
            <div className="py-12 text-center text-neutral-500 font-mono-tech text-xs uppercase">Loading events...</div>
          ) : (
            events.map((event: any, index: number) => {
              const isFeatured = index === 1;
              const numStr = index < 9 ? `0${index + 1}` : `${index + 1}`;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  onClick={() => setSelectedEvent(event)}
                  className={`relative group cursor-pointer py-6 px-4 transition-colors ${
                    isFeatured ? 'bg-white/40' : 'hover:bg-white/30'
                  }`}
                >
                  {isFeatured && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] sm:w-[85%] bg-[#FAF8F5] border border-black/20 p-4 rounded-xs shadow-xl z-20 flex items-center justify-between pointer-events-none transform -rotate-1">
                      <div className="absolute -top-3 left-4 w-16 h-5 bg-white/80 border-x border-black/10 shadow-xs z-30 transform -rotate-6" />

                      <div className="flex items-center gap-4">
                        <span className="font-mono-tech font-bold text-lg text-[#121110]">{numStr}</span>
                        <div>
                          <h4 className="font-mono-tech font-black text-lg text-[#121110] uppercase tracking-wider">
                            {event.title}
                          </h4>
                          <p className="font-mono-tech text-xs text-neutral-600">
                            {event.date} • {event.time}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="hidden sm:block text-right font-mono-tech text-xs text-neutral-700">
                          <p className="font-bold text-[#D92525]">{event.venue}</p>
                          <p className="text-[10px] text-neutral-500">TICKET #2024-AIMSA</p>
                        </div>
                        <div className="border-l border-dashed border-black/30 pl-4 flex flex-col items-center">
                          <Barcode className="w-12 h-8 text-neutral-800" />
                          <span className="text-[9px] tracking-widest text-neutral-500">0085295591201</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-2 sm:col-span-1 font-mono-tech font-bold text-lg text-neutral-700">
                      {numStr}
                    </div>

                    <div className="col-span-10 sm:col-span-6">
                      <h3 className="font-mono-tech font-bold text-lg sm:text-xl text-[#121110] uppercase tracking-wider group-hover:text-[#D92525] transition-colors">
                        {event.title}
                      </h3>
                    </div>

                    <div className="col-span-12 sm:col-span-5 text-left sm:text-right font-mono-tech text-xs uppercase text-neutral-600 space-y-0.5">
                      <p className="font-bold text-[#121110]">{event.date}</p>
                      <p className="text-neutral-500">{event.venue} ({event.time})</p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Event Details Drawer / Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-[#161614] border border-white/20 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col text-white"
            >
              {/* Header Cover */}
              <div className="relative w-full h-64 sm:h-80 shrink-0">
                <Image
                  src={selectedEvent.coverUrl}
                  alt={selectedEvent.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161614] via-black/40 to-black/60" />

                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 p-2 text-white bg-black/60 hover:bg-[#D92525] rounded-full transition-colors z-20"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="absolute bottom-6 left-6 right-6">
                  <span className="px-3 py-1 bg-[#D92525] rounded-full font-mono-tech text-xs uppercase font-bold text-white tracking-wider">
                    {selectedEvent.category}
                  </span>
                  <h3 className="font-syne font-black text-2xl sm:text-4xl text-white uppercase mt-2">
                    {selectedEvent.title}
                  </h3>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
                {/* Meta Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-white/5 border border-white/10 rounded-xl font-mono-tech text-xs uppercase">
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Clock className="w-4 h-4 text-[#D92525]" />
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span className="truncate">{selectedEvent.venue}</span>
                  </div>
                </div>

                {/* Event Story */}
                <div>
                  <h4 className="font-syne font-bold text-lg text-[#D92525] uppercase mb-2">
                    ABOUT THE EVENT STORY
                  </h4>
                  <p className="text-neutral-300 font-sans text-sm leading-relaxed">
                    {selectedEvent.fullStory}
                  </p>
                </div>

                {/* Organizers */}
                <div>
                  <h4 className="font-syne font-bold text-sm uppercase text-neutral-400 mb-2">
                    ORGANIZED BY
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.organizers.map((org: string) => (
                      <span
                        key={org}
                        className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg font-mono-tech text-xs uppercase text-neutral-200"
                      >
                        {org}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Registration CTA */}
                {selectedEvent.registrationUrl && (
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="font-mono-tech text-xs text-neutral-400 uppercase block">
                        EXPECTED ATTENDEES: {selectedEvent.attendeeCount || 300}+
                      </span>
                    </div>
                    <a
                      href={selectedEvent.registrationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-3 rounded-full bg-[#D92525] hover:bg-[#B81D1D] text-white font-mono-tech font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
                    >
                      <span>REGISTER NOW</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
