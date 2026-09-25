import React, { useId } from 'react';
import { Timer, Zap, Flame } from 'lucide-react';
import { Direction, Stimulus } from '../types/game';

interface ArrowDisplayProps {
  stimulus: Stimulus;
  animationState?: {
    direction: Direction;
    isCorrect: boolean;
  } | null;
  gaugePercent?: number; // 100% down to 0%
  timeRemainingMs?: number;
  maxTimeMs?: number;
  isTimedOut?: boolean;
  timerEnabled?: boolean;
}

// Map direction to degrees rotation (assuming baseline is UP)
const ROTATION_MAP: Record<Direction, number> = {
  UP: 0,
  RIGHT: 90,
  DOWN: 180,
  LEFT: 270,
};

/**
 * High-fidelity 3D Chiseled Extruded Arrow
 */
export const ThreeDArrowSvg: React.FC<{
  size?: number;
  isInverted?: boolean;
  isCenterTarget?: boolean;
  className?: string;
}> = ({ size = 160, isInverted = false, isCenterTarget = false, className = '' }) => {
  const uid = useId().replace(/:/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={`${className} transition-transform drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)] overflow-visible`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradient for Front Face - Direct (Electric Cyan & Diamond White) */}
        <linearGradient id={`frontDirect-${uid}`} x1="60" y1="12" x2="60" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#bae6fd" />
          <stop offset="70%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        {/* Gradient for Front Face - Inverted (Vibrant Neon Rose & Coral) */}
        <linearGradient id={`frontInverted-${uid}`} x1="60" y1="12" x2="60" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#fecdd3" />
          <stop offset="70%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>

        {/* 3D Extrusion Wall Gradient - Direct */}
        <linearGradient id={`extWallDirect-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0369a1" />
          <stop offset="100%" stopColor="#082f49" />
        </linearGradient>

        {/* 3D Extrusion Wall Gradient - Inverted */}
        <linearGradient id={`extWallInverted-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9f1239" />
          <stop offset="100%" stopColor="#4c0519" />
        </linearGradient>

        {/* Chiseled bevel highlights */}
        <linearGradient id={`bevelLit-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* 1. Deep Floor Ambient Shadow under 3D Arrow */}
      <path
        d="M60 22 L98 59 C100 61 98.5 65 95 65 H77 V98 C77 101 74 103 71 103 H49 C46 103 43 101 43 98 V65 H25 C21.5 65 20 61 22 59 L60 22 Z"
        fill="black"
        opacity="0.45"
        className="blur-[5px]"
      />

      {/* 2. 3D Extrusion Depth Layer (Simulating 8px physical extrusion block) */}
      <g>
        {/* Base Extrusion Floor Plate */}
        <path
          d="M60 18 L98 56 C101 59 99 63 95 63 H76 V96 C76 99.5 73.5 102 70 102 H50 C46.5 102 44 99.5 44 96 V63 H25 C21 63 19 59 22 56 L60 18 Z"
          fill={isInverted ? `url(#extWallInverted-${uid})` : `url(#extWallDirect-${uid})`}
        />

        {/* 3D Side Walls connecting front to back */}
        {/* Right barb wall */}
        <polygon
          points="95,55 98,56 76,96 74,90"
          fill={isInverted ? '#881337' : '#0369a1'}
          opacity="0.9"
        />
        {/* Bottom stem wall */}
        <polygon
          points="46,90 50,102 70,102 74,90"
          fill={isInverted ? '#4c0519' : '#082f49'}
        />
        {/* Right stem wall */}
        <polygon
          points="74,55 76,63 76,96 74,90"
          fill={isInverted ? '#700c28' : '#075985'}
        />
        {/* Left stem wall */}
        <polygon
          points="46,55 44,63 44,96 46,90"
          fill={isInverted ? '#4c0519' : '#082f49'}
          opacity="0.6"
        />
        {/* Wing under-hang walls */}
        <polygon
          points="74,55 76,63 95,63 93,55"
          fill={isInverted ? '#5f0a22' : '#0c4a6e'}
        />
        <polygon
          points="27,55 25,63 44,63 46,55"
          fill={isInverted ? '#5f0a22' : '#0c4a6e'}
        />
      </g>

      {/* 3. Front 3D Face (Elevated Surface) */}
      <path
        d="M60 10 L98 48 C100.8 50.8 98.8 55 95 55 H74 V90 C74 93.3 71.3 96 68 96 H52 C48.7 96 46 93.3 46 90 V55 H25 C21.2 55 19.2 50.8 22 48 L60 10 Z"
        fill={isInverted ? `url(#frontInverted-${uid})` : `url(#frontDirect-${uid})`}
        stroke="#ffffff"
        strokeWidth={isCenterTarget ? 2.5 : 1.5}
        strokeLinejoin="round"
      />

      {/* 4. 3D Chiseled Center Spine & Ridge (Faceted Aero Look) */}
      {/* Left Chiseled Slope (Subtle soft shadow) */}
      <path
        d="M60 11 L22 48 C20.5 49.5 21.5 53 24 53 H47 V94 H52 C52 94 60 90 60 11 Z"
        fill="white"
        opacity="0.16"
      />

      {/* Right Chiseled Slope Highlight */}
      <path
        d="M60 11 L98 48 C99.5 49.5 98.5 53 96 53 H73 V94 H68 C68 94 60 90 60 11 Z"
        fill="black"
        opacity="0.08"
      />

      {/* Center 3D Spine Ridge Highlight */}
      <line
        x1="60"
        y1="12"
        x2="60"
        y2="92"
        stroke={`url(#bevelLit-${uid})`}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Specular Edge Gleam on Arrow tip and left wing */}
      <path
        d="M60 12 L24 48"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.85"
      />
      <circle cx="60" cy="14" r="2.5" fill="#ffffff" />
    </svg>
  );
};

export const ArrowDisplay: React.FC<ArrowDisplayProps> = ({
  stimulus,
  animationState,
  gaugePercent = 100,
  timeRemainingMs = 2000,
  isTimedOut = false,
  timerEnabled = true,
}) => {
  const { type, targetDirection, isInverted, flankers } = stimulus;

  // Determine urgency tier
  const isUrgent = timerEnabled && gaugePercent <= 28;
  const isWarning = timerEnabled && gaugePercent <= 55 && gaugePercent > 28;

  // Gauge colors
  const gaugeColor = isUrgent
    ? '#f43f5e'
    : isWarning
    ? '#f59e0b'
    : '#06b6d4';

  const gaugeTextColor = isUrgent
    ? 'text-rose-400 font-extrabold animate-pulse'
    : isWarning
    ? 'text-amber-300 font-bold'
    : 'text-cyan-300 font-bold';

  // Compute transform when animating out
  const getFeedbackTransform = () => {
    if (isTimedOut) return 'scale(0.94) rotate(-2deg)';
    if (!animationState) return 'translate(0, 0) scale(1)';
    const dist = 75;
    const { direction } = animationState;
    if (direction === 'UP') return `translate(0, -${dist}px) scale(0.94)`;
    if (direction === 'DOWN') return `translate(0, ${dist}px) scale(0.94)`;
    if (direction === 'LEFT') return `translate(-${dist}px, 0) scale(0.94)`;
    if (direction === 'RIGHT') return `translate(${dist}px, 0) scale(0.94)`;
    return 'scale(0.94)';
  };

  // Perimeter for the larger 3D stimulus card
  // Card SVG viewBox="0 0 320 300", rect w=312, h=292, r=32
  // Perimeter = 2*(312+292) - 8*32 + 2*PI*32 = 1208 - 256 + 201 = 1153
  const CARD_PERIMETER = 1153;
  const strokeDashoffset = timerEnabled
    ? CARD_PERIMETER * (1 - Math.max(0, Math.min(100, gaugePercent)) / 100)
    : 0;

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center justify-center py-1 sm:py-2 px-2 select-none">
      {/* Top Helper Badge & Per-Question Response Urgency */}
      <div className="flex flex-col items-center gap-2 mb-2 sm:mb-3 w-full px-2">
        {/* Directive Pill Badge with 3D Depth */}
        <div className="flex items-center justify-center">
          {isInverted ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-500/25 via-red-500/35 to-rose-500/25 border-2 border-rose-400/60 text-white text-xs sm:text-sm font-black tracking-wider uppercase shadow-[0_4px_16px_rgba(239,68,68,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_#f43f5e]" />
              Inverted: Swipe Opposite
            </div>
          ) : type === 'FLANKER' || type === 'HYBRID_FLANKER_INVERTED' ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 via-sky-500/30 to-cyan-500/20 border-2 border-cyan-400/50 text-cyan-100 text-xs sm:text-sm font-black tracking-wider uppercase shadow-[0_4px_16px_rgba(6,182,212,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)]">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee]" />
              Focus Center Arrow Only
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-100 text-xs font-semibold tracking-wide">
              Swipe In Arrow Direction
            </div>
          )}
        </div>

        {/* Per-Answer Dynamic Speed Gauge Bar */}
        {timerEnabled && (
          <div className="w-full max-w-[280px] flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-[11px] sm:text-xs font-bold px-1 mb-1">
              <div className="flex items-center gap-1.5 text-indigo-200">
                <Timer className="w-3.5 h-3.5 text-indigo-300" />
                <span className="text-[10px] uppercase tracking-wider">Speed Limit</span>
              </div>
              <div className={`flex items-center gap-1 ${gaugeTextColor} tabular-nums font-mono`}>
                {isUrgent ? (
                  <Flame className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                ) : (
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                )}
                <span>{(Math.max(0, timeRemainingMs) / 1000).toFixed(1)}s</span>
              </div>
            </div>

            {/* Shrinking urgency progress bar with 3D bevel and glow */}
            <div className="w-full h-2.5 rounded-full bg-black/60 border border-white/15 overflow-hidden relative shadow-inner p-0.5">
              <div
                style={{
                  width: `${Math.max(0, Math.min(100, gaugePercent))}%`,
                  backgroundColor: gaugeColor,
                  boxShadow: `0 0 12px ${gaugeColor}`,
                }}
                className={`h-full transition-all duration-75 ease-linear rounded-full ${
                  isUrgent ? 'animate-pulse' : ''
                }`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Stimulus Card Container with large format and 3D visual presence */}
      <div className="relative w-full max-w-[320px] sm:max-w-[350px] aspect-[1.08/1] flex items-center justify-center">
        {/* Animated Countdown Perimeter Ring */}
        {timerEnabled && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
            viewBox="0 0 320 300"
          >
            {/* Background inactive track */}
            <rect
              x="4"
              y="4"
              width="312"
              height="292"
              rx="32"
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="5"
            />
            {/* Active depleting perimeter gauge */}
            <rect
              x="4"
              y="4"
              width="312"
              height="292"
              rx="32"
              fill="none"
              stroke={gaugeColor}
              strokeWidth={isUrgent ? 6 : 5}
              strokeDasharray={CARD_PERIMETER}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-75 ease-linear"
              style={{
                filter: isUrgent
                  ? 'drop-shadow(0 0 14px rgba(244,63,94,0.9))'
                  : isWarning
                  ? 'drop-shadow(0 0 10px rgba(245,158,11,0.7))'
                  : 'drop-shadow(0 0 10px rgba(6,182,212,0.7))',
              }}
            />
          </svg>
        )}

        {/* 3D Card Base with Rich Depth, Rim Light and Floating Shadow */}
        <div
          style={{
            transform: getFeedbackTransform(),
            transition: 'transform 0.14s cubic-bezier(0.16, 1, 0.3, 1)',
            perspective: '1000px',
          }}
          className={`relative w-full h-full rounded-[32px] p-4 sm:p-6 flex items-center justify-center border-2 transition-all duration-150 backdrop-blur-2xl ${
            isTimedOut
              ? 'bg-rose-950/80 border-rose-500 shadow-[0_20px_50px_rgba(239,68,68,0.5),0_0_30px_rgba(239,68,68,0.3)] animate-shake'
              : animationState
              ? animationState.isCorrect
                ? 'bg-emerald-950/70 border-emerald-400 shadow-[0_20px_50px_rgba(16,185,129,0.45)]'
                : 'bg-rose-950/70 border-rose-400 shadow-[0_20px_50px_rgba(239,68,68,0.45)]'
              : isInverted
              ? 'bg-gradient-to-b from-[#3a1638]/95 via-[#29102c]/95 to-[#1c0821]/95 border-rose-400/40 shadow-[0_20px_50px_rgba(0,0,0,0.65),0_0_30px_rgba(244,63,94,0.2)]'
              : isUrgent
              ? 'bg-gradient-to-b from-[#3c172b]/95 via-[#2b1025]/95 to-[#1d081f]/95 border-rose-400/60 shadow-[0_20px_50px_rgba(244,63,94,0.4)]'
              : 'bg-gradient-to-b from-[#281e5e]/95 via-[#1d164d]/95 to-[#140e3b]/95 border-indigo-300/35 shadow-[0_20px_50px_rgba(0,0,0,0.65),0_0_30px_rgba(99,102,241,0.2)]'
          }`}
        >
          {/* 3D Top Inset Highlight */}
          <div className="absolute inset-0 rounded-[30px] bg-gradient-to-b from-white/15 via-transparent to-black/30 pointer-events-none" />

          {/* Subtle Cyber Grid */}
          <div className="absolute inset-0 rounded-[30px] bg-[radial-gradient(#ffffff0a_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />

          {/* Time Out Splash Overlay */}
          {isTimedOut && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 rounded-[30px] backdrop-blur-xs animate-in fade-in duration-100">
              <span className="text-2xl sm:text-3xl font-black text-rose-400 uppercase tracking-wider drop-shadow-lg">
                Too Slow! ⏳
              </span>
              <span className="text-xs sm:text-sm text-rose-200 font-bold mt-1 tracking-wide">
                Streak Reset
              </span>
            </div>
          )}

          {/* Large 3D Arrow Display based on Type */}
          {type === 'SINGLE_DIRECT' || type === 'INVERTED' ? (
            <div
              style={{
                transform: `rotate(${ROTATION_MAP[targetDirection]}deg)`,
              }}
              className="transition-transform duration-100 flex items-center justify-center w-full h-full"
            >
              {/* Massive 3D Arrow (180px on desktop/mobile for maximum visibility & zero blank space) */}
              <ThreeDArrowSvg
                size={185}
                isInverted={isInverted}
                isCenterTarget={true}
              />
            </div>
          ) : (
            /* Flanker Mode: 5 Large 3D Arrows Spanning the Card */
            <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 w-full px-1">
              {flankers?.map((dir, idx) => {
                const isCenter = idx === 2;
                return (
                  <div
                    key={idx}
                    style={{
                      transform: `rotate(${ROTATION_MAP[dir]}deg)`,
                    }}
                    className={`relative flex items-center justify-center transition-all ${
                      isCenter
                        ? 'scale-115 z-10'
                        : 'opacity-75 scale-90'
                    }`}
                  >
                    {/* Glowing Focus Ring behind the center arrow */}
                    {isCenter && (
                      <div className="absolute -inset-2.5 rounded-full border-2 border-cyan-300/60 border-dashed animate-spin [animation-duration:14s] pointer-events-none shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
                    )}
                    <ThreeDArrowSvg
                      size={isCenter ? 68 : 50}
                      isInverted={isCenter ? isInverted : false}
                      isCenterTarget={isCenter}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
