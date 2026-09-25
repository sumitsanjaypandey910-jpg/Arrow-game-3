import React from 'react';

interface ElevateArrowIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ElevateArrowIcon: React.FC<ElevateArrowIconProps> = ({ size = 'xl', className = '' }) => {
  const containerSizes = {
    sm: 'w-16 h-16 rounded-2xl p-2',
    md: 'w-24 h-24 rounded-2xl p-2.5',
    lg: 'w-36 h-36 rounded-3xl p-3',
    xl: 'w-44 h-44 sm:w-52 sm:h-52 rounded-[36px] p-4',
  };

  const circleSizes = {
    sm: 'w-12 h-12',
    md: 'w-19 h-19',
    lg: 'w-30 h-30',
    xl: 'w-36 h-36 sm:w-44 sm:h-44',
  };

  return (
    <div
      style={{ perspective: '800px' }}
      className={`relative flex items-center justify-center ${className}`}
    >
      {/* 3D Atmospheric outer glow */}
      <div className="absolute inset-0 rounded-[40px] bg-gradient-to-tr from-cyan-500/20 via-indigo-500/30 to-purple-500/20 blur-xl scale-110 pointer-events-none animate-pulse-glow" />

      {/* Main 3D Squircle Base with layered depth */}
      <div
        className={`relative flex items-center justify-center bg-gradient-to-b from-[#342878] via-[#241a5c] to-[#181042] border-2 border-indigo-300/30 shadow-[0_20px_45px_rgba(0,0,0,0.65),0_8px_16px_rgba(79,70,229,0.3),inset_0_2px_4px_rgba(255,255,255,0.25)] ${containerSizes[size]} transition-transform duration-300 hover:scale-105`}
      >
        {/* 3D Specular Top Bevel Highlight */}
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/20 via-transparent to-black/30 pointer-events-none" />

        {/* Outer 3D Ring with metallic accent */}
        <div className="absolute inset-2 sm:inset-2.5 rounded-[30px] border border-cyan-400/20 pointer-events-none" />

        {/* 3D Radiant Core Sphere */}
        <div
          className={`relative ${circleSizes[size]} rounded-full bg-gradient-to-tr from-[#0891b2] via-[#06b6d4] to-[#67e8f9] shadow-[0_12px_36px_rgba(6,182,212,0.5),inset_0_3px_8px_rgba(255,255,255,0.8),inset_0_-4px_8px_rgba(8,145,178,0.7)] flex items-center justify-center overflow-hidden`}
        >
          {/* Internal 3D sphere specular highlights */}
          <div className="absolute -top-10 -left-10 w-28 h-28 bg-white/40 rounded-full blur-md pointer-events-none" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/25 via-transparent to-black/20 pointer-events-none" />

          {/* 3D Opposing Arrows (Full dimensional extruded style) */}
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full p-2 drop-shadow-[0_8px_14px_rgba(0,0,0,0.4)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* 3D Arrow 1 Gradient (Direct Cyan-White) */}
              <linearGradient id="heroArrow1Grad" x1="20" y1="90" x2="90" y2="20" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#f0fdf4" />
              </linearGradient>

              {/* 3D Arrow 2 Gradient (Deep Contrast Teal-Cyan) */}
              <linearGradient id="heroArrow2Grad" x1="90" y1="20" x2="20" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0e7490" />
                <stop offset="100%" stopColor="#083344" />
              </linearGradient>

              {/* 3D Extrusion Shadows */}
              <linearGradient id="heroExtrusion1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
            </defs>

            {/* --- ARROW 2 (Pointing Bottom-Left) with 3D Depth Layer --- */}
            {/* Extruded Depth under Arrow 2 */}
            <g transform="translate(-2, 3)">
              <line x1="72" y1="44" x2="40" y2="76" stroke="#042f2e" strokeWidth="12" strokeLinecap="round" />
              <path d="M60 78H36V54" stroke="#042f2e" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            {/* Main Arrow 2 Body */}
            <g>
              <line x1="72" y1="44" x2="40" y2="76" stroke="url(#heroArrow2Grad)" strokeWidth="11" strokeLinecap="round" />
              <path d="M60 78H36V54" stroke="url(#heroArrow2Grad)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
              {/* Arrow 2 Inner bevel line */}
              <line x1="70" y1="45" x2="42" y2="73" stroke="#155e75" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            </g>

            {/* --- ARROW 1 (Pointing Top-Right) with 3D Depth Layer --- */}
            {/* Extruded Depth under Arrow 1 */}
            <g transform="translate(2, 4)">
              <line x1="44" y1="72" x2="76" y2="40" stroke="#0e7490" strokeWidth="12" strokeLinecap="round" />
              <path d="M54 36H78V60" stroke="#0e7490" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            {/* Main Arrow 1 Body */}
            <g>
              <line x1="44" y1="72" x2="76" y2="40" stroke="url(#heroArrow1Grad)" strokeWidth="11" strokeLinecap="round" />
              <path d="M54 36H78V60" stroke="url(#heroArrow1Grad)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
              {/* 3D Specular reflection ridge on Arrow 1 */}
              <line x1="46" y1="70" x2="74" y2="42" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" opacity="0.9" />
              <path d="M56 38H76V58" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
