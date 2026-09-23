import React from 'react';

interface ElevateArrowIconProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ElevateArrowIcon: React.FC<ElevateArrowIconProps> = ({ size = 'lg', className = '' }) => {
  const containerSizes = {
    sm: 'w-16 h-16 rounded-2xl p-2',
    md: 'w-24 h-24 rounded-2xl p-2.5',
    lg: 'w-32 h-32 sm:w-36 sm:h-36 rounded-3xl p-3.5',
  };

  const circleSizes = {
    sm: 'w-12 h-12',
    md: 'w-19 h-19',
    lg: 'w-25 h-25 sm:w-28 sm:h-28',
  };

  return (
    <div
      className={`relative flex items-center justify-center bg-gradient-to-b from-[#2e2365] via-[#231a52] to-[#1c1445] border border-indigo-400/25 shadow-[0_12px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(79,70,229,0.15)] ${containerSizes[size]} ${className}`}
    >
      {/* Subtle outer squircle rim highlight */}
      <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

      {/* Glowing cyan inner circle */}
      <div
        className={`relative ${circleSizes[size]} rounded-full bg-gradient-to-tr from-[#06b6d4] via-[#22d3ee] to-[#67e8f9] shadow-[0_0_28px_rgba(6,182,212,0.45),inset_0_2px_4px_rgba(255,255,255,0.6)] flex items-center justify-center overflow-hidden`}
      >
        {/* Subtle radial shine inside circle */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 via-transparent to-black/10 pointer-events-none" />

        {/* Two arrows pointing diagonally in opposite directions (matching screenshot badge) */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full p-2.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top-Right Arrow (crisp white with slight teal shadow) */}
          <g>
            {/* Arrow shaft */}
            <line
              x1="38"
              y1="62"
              x2="66"
              y2="34"
              stroke="#ffffff"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Arrow head */}
            <path
              d="M48 33H68V53"
              stroke="#ffffff"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Bottom-Left Arrow (deep teal tone in opposing configuration) */}
          <g opacity="0.95">
            {/* Arrow shaft */}
            <line
              x1="62"
              y1="38"
              x2="34"
              y2="66"
              stroke="#0891b2"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Arrow head */}
            <path
              d="M52 67H32V47"
              stroke="#0891b2"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};
