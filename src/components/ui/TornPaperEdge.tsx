'use client';

import React from 'react';

interface TornPaperEdgeProps {
  position?: 'top' | 'bottom';
  fillColor?: string; // Hex or CSS color matching section bg
  className?: string;
}

export const TornPaperEdge: React.FC<TornPaperEdgeProps> = ({
  position = 'top',
  fillColor = '#0E0E0D',
  className = '',
}) => {
  return (
    <div
      className={`w-full overflow-hidden leading-none pointer-events-none z-10 ${
        position === 'bottom' ? 'rotate-180' : ''
      } ${className}`}
    >
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block w-full h-8 md:h-12 lg:h-16"
      >
        <path
          d="M0,0 Q30,35 60,10 T120,40 T180,15 T240,45 T300,10 T360,35 T420,5 T480,40 T540,15 T600,35 T660,10 T720,45 T780,20 T840,40 T900,10 T960,30 T1020,15 T1080,40 T1140,20 T1200,35 L1200,0 L0,0 Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
};
