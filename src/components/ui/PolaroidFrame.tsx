'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface PolaroidFrameProps {
  imageUrl: string;
  caption: string;
  date?: string;
  rotation?: number; // degree
  tapeVariant?: 'none' | 'white' | 'amber' | 'red';
  onClick?: () => void;
  className?: string;
  aspectRatio?: 'square' | '4/5' | '16/9';
}

export const PolaroidFrame: React.FC<PolaroidFrameProps> = ({
  imageUrl,
  caption,
  date,
  rotation = 0,
  tapeVariant = 'white',
  onClick,
  className = '',
  aspectRatio = 'square',
}) => {
  const aspectClass = {
    square: 'aspect-square',
    '4/5': 'aspect-[4/5]',
    '16/9': 'aspect-[16/9]',
  }[aspectRatio];

  const tapeColors = {
    none: '',
    white: 'bg-white/20 border-white/40',
    amber: 'bg-[#FF9F1C]/40 border-white/50',
    red: 'bg-[#FF3B00]/40 border-white/50',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, rotate: rotation + 1.5, zIndex: 30 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={onClick}
      style={{ transform: `rotate(${rotation}deg)` }}
      className={`relative polaroid-card p-3 rounded-sm cursor-pointer group select-none ${className}`}
    >
      {/* Tape strip */}
      {tapeVariant !== 'none' && (
        <div
          className={`absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 border-x-2 border-dashed z-20 shadow-sm pointer-events-none ${tapeColors[tapeVariant]}`}
          style={{ transform: 'translateX(-50%) rotate(-2deg)' }}
        />
      )}

      {/* Image frame */}
      <div className={`relative w-full overflow-hidden bg-black/50 rounded-xs ${aspectClass}`}>
        <Image
          src={imageUrl}
          alt={caption}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Caption footer */}
      <div className="mt-3 px-1 flex items-end justify-between gap-2">
        <p className="font-handwriting text-lg text-neutral-200 leading-snug font-semibold group-hover:text-[#FF3B00] transition-colors">
          {caption}
        </p>
        {date && (
          <span className="font-mono-tech text-[10px] uppercase text-neutral-500 tracking-wider shrink-0">
            {date}
          </span>
        )}
      </div>
    </motion.div>
  );
};
