import React from 'react';
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

const ArrowSvg: React.FC<{
  size?: number;
  isInverted?: boolean;
  isCenterTarget?: boolean;
  className?: string;
}> = ({ size = 68, isInverted = false, isCenterTarget = false, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${className} transition-transform drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Glow filter definition */}
      <defs>
        <filter id={`arrow-glow-${isInverted ? 'inv' : 'dir'}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="directGradient" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="invertedGradient" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>

      {/* Modern aerodynamic chunky arrow pointing UP */}
      <path
        d="M50 14L84 48C86.5 50.5 84.7 55 81.2 55H63V80C63 83.3 60.3 86 57 86H43C39.7 86 37 83.3 37 80V55H18.8C15.3 55 13.5 50.5 16 48L50 14Z"
        fill={isInverted ? 'url(#invertedGradient)' : 'url(#directGradient)'}
        stroke={isCenterTarget ? '#ffffff' : 'rgba(255,255,255,0.6)'}
        strokeWidth={isCenterTarget ? 3.5 : 2}
        strokeLinejoin="round"
      />
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
    ? 'text-rose-400'
    : isWarning
    ? 'text-amber-400'
    : 'text-cyan-300';

  // Compute transform when animating out
  const getFeedbackTransform = () => {
    if (isTimedOut) return 'scale(0.92) rotate(-2deg)';
    if (!animationState) return 'translate(0, 0) scale(1)';
    const dist = 70;
    const { direction } = animationState;
    if (direction === 'UP') return `translate(0, -${dist}px) scale(0.92)`;
    if (direction === 'DOWN') return `translate(0, ${dist}px) scale(0.92)`;
    if (direction === 'LEFT') return `translate(-${dist}px, 0) scale(0.92)`;
    if (direction === 'RIGHT') return `translate(${dist}px, 0) scale(0.92)`;
    return 'scale(0.95)';
  };

  // Perimeter calculation for card's glowing border gauge (width ~250, height ~250, rx=24)
  // Perimeter of rect with w=246, h=246, r=24 is approx 2*(246+246) - 8*24 + 2*PI*24 = 984 - 192 + 150.8 = 942.8
  const CARD_PERIMETER = 942;
  const strokeDashoffset = timerEnabled
    ? CARD_PERIMETER * (1 - Math.max(0, Math.min(100, gaugePercent)) / 100)
    : 0;

  return (
    <div className="relative w-full max-w-sm mx-auto flex flex-col items-center justify-center min-h-[270px] py-2">
      {/* Top Helper Badge & Per-Question Timer Gauge Readout */}
      <div className="flex flex-col items-center gap-1.5 mb-3 w-full px-4">
        {/* Helper directive */}
        <div className="flex items-center justify-center gap-2">
          {isInverted ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold tracking-wide uppercase shadow-[0_0_15px_rgba(239,68,68,0.25)] animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              Inverted: Swipe Opposite
            </div>
          ) : type === 'FLANKER' || type === 'HYBRID_FLANKER_INVERTED' ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 text-xs font-bold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Center Arrow Only
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-medium tracking-wide">
              Swipe In Arrow Direction
            </div>
          )}
        </div>

        {/* Per-Answer Dynamic Speed Gauge Bar that creates the urge to answer fast */}
        {timerEnabled && (
          <div className="w-full max-w-[240px] flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-[11px] font-bold px-1 mb-1">
              <div className="flex items-center gap-1 text-indigo-300">
                <Timer className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-wider">Answer Urgency</span>
              </div>
              <div className={`flex items-center gap-1 ${gaugeTextColor} tabular-nums font-mono`}>
                {isUrgent ? (
                  <Flame className="w-3 h-3 text-rose-400 animate-bounce" />
                ) : (
                  <Zap className="w-3 h-3 text-amber-300" />
                )}
                <span>{(Math.max(0, timeRemainingMs) / 1000).toFixed(1)}s</span>
              </div>
            </div>

            {/* Shrinking urgency progress bar */}
            <div className="w-full h-2 rounded-full bg-black/40 border border-white/10 overflow-hidden relative shadow-inner">
              <div
                style={{
                  width: `${Math.max(0, Math.min(100, gaugePercent))}%`,
                  backgroundColor: gaugeColor,
                  boxShadow: `0 0 10px ${gaugeColor}`,
                }}
                className={`h-full transition-all duration-75 ease-linear rounded-full ${
                  isUrgent ? 'animate-pulse' : ''
                }`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Stimulus Card Container with surrounding Animated Countdown Perimeter Gauge */}
      <div className="relative w-full aspect-square max-w-[240px] sm:max-w-[260px] flex items-center justify-center">
        {/* Perimeter SVG Urgency Gauge Ring */}
        {timerEnabled && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
            viewBox="0 0 250 250"
          >
            {/* Background inactive track */}
            <rect
              x="3"
              y="3"
              width="244"
              height="244"
              rx="24"
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="4"
            />
            {/* Active depleting perimeter gauge */}
            <rect
              x="3"
              y="3"
              width="244"
              height="244"
              rx="24"
              fill="none"
              stroke={gaugeColor}
              strokeWidth={isUrgent ? 5 : 4}
              strokeDasharray={CARD_PERIMETER}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-75 ease-linear drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
              style={{
                filter: isUrgent
                  ? 'drop-shadow(0 0 12px rgba(244,63,94,0.8))'
                  : isWarning
                  ? 'drop-shadow(0 0 8px rgba(245,158,11,0.6))'
                  : 'drop-shadow(0 0 8px rgba(6,182,212,0.6))',
              }}
            />
          </svg>
        )}

        {/* Card Body */}
        <div
          style={{
            transform: getFeedbackTransform(),
            transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className={`relative w-full h-full rounded-3xl p-5 flex items-center justify-center border transition-all duration-150 backdrop-blur-xl ${
            isTimedOut
              ? 'bg-rose-500/25 border-rose-500 shadow-[0_0_40px_rgba(239,68,68,0.5)] animate-shake'
              : animationState
              ? animationState.isCorrect
                ? 'bg-emerald-500/15 border-emerald-400/60 shadow-[0_0_35px_rgba(16,185,129,0.35)]'
                : 'bg-rose-500/15 border-rose-400/60 shadow-[0_0_35px_rgba(239,68,68,0.35)]'
              : isInverted
              ? 'bg-gradient-to-b from-[#2e1534]/90 via-[#26122d]/90 to-[#1d0d24]/90 border-rose-400/30 shadow-[0_8px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(239,68,68,0.15)]'
              : isUrgent
              ? 'bg-gradient-to-b from-[#341829]/90 via-[#281329]/90 to-[#1b0b23]/90 border-rose-400/50 shadow-[0_0_25px_rgba(244,63,94,0.35)]'
              : 'bg-gradient-to-b from-[#251d54]/90 via-[#1f1747]/90 to-[#18113c]/90 border-indigo-400/30 shadow-[0_8px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(79,70,229,0.15)]'
          }`}
        >
          {/* Subtle grid pattern inside */}
          <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Time Out Splash Overlay */}
          {isTimedOut && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 rounded-3xl backdrop-blur-xs">
              <span className="text-xl sm:text-2xl font-black text-rose-400 uppercase tracking-wider drop-shadow-md">
                Too Slow! ⏳
              </span>
              <span className="text-xs text-rose-200/90 font-semibold mt-1">
                Streak Reset
              </span>
            </div>
          )}

          {/* Display based on Type */}
          {type === 'SINGLE_DIRECT' || type === 'INVERTED' ? (
            <div
              style={{
                transform: `rotate(${ROTATION_MAP[targetDirection]}deg)`,
              }}
              className="transition-transform duration-75 flex items-center justify-center"
            >
              <ArrowSvg
                size={96}
                isInverted={isInverted}
                isCenterTarget={true}
              />
            </div>
          ) : (
            /* Flanker Mode: 5 arrows in a line */
            <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 w-full">
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
                        ? 'scale-110 z-10'
                        : 'opacity-65 scale-90'
                    }`}
                  >
                    {/* Subtle target ring indicator for the middle arrow */}
                    {isCenter && (
                      <div className="absolute -inset-1.5 rounded-full border border-white/40 border-dashed animate-spin [animation-duration:12s] pointer-events-none" />
                    )}
                    <ArrowSvg
                      size={isCenter ? 54 : 38}
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

