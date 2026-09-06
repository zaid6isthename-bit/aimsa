'use client';

import React from 'react';

interface StampBadgeProps {
  text?: string;
  size?: number;
  className?: string;
  variant?: 'red' | 'amber' | 'silver';
}

export const StampBadge: React.FC<StampBadgeProps> = ({
  text = '• AIMSA • EST 2024 • AI & ML COMMUNITY • CREATIVE MINDS ',
  size = 110,
  className = '',
  variant = 'red',
}) => {
  const colorStyles = {
    red: 'border-[#FF3B00] text-[#FF3B00]',
    amber: 'border-[#FF9F1C] text-[#FF9F1C]',
    silver: 'border-white/30 text-white/70',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full border-2 border-dashed ${colorStyles[variant]} ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg
        className="absolute inset-0 w-full h-full animate-spin-slow pointer-events-none"
        viewBox="0 0 100 100"
      >
        <path
          id="stampCircle"
          d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
          fill="none"
        />
        <text className="text-[9.5px] font-mono-tech tracking-[0.2em] uppercase font-bold fill-current">
          <textPath href="#stampCircle">{text}</textPath>
        </text>
      </svg>
      <div className="text-center font-syne font-extrabold text-[11px] tracking-wider leading-none uppercase">
        AIMSA
      </div>
    </div>
  );
};
