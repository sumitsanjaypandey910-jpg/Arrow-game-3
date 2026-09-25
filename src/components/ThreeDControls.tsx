import React from 'react';
import { Direction } from '../types/game';
import { sound } from '../utils/sound';

interface ThreeDControlsProps {
  onInput: (direction: Direction) => void;
  disabled?: boolean;
}

interface ButtonConfig {
  direction: Direction;
  label: string;
  keyLabel: string;
  iconRotation: number;
}

const BUTTONS: Record<Direction, ButtonConfig> = {
  UP: { direction: 'UP', label: 'Up', keyLabel: 'W / ↑', iconRotation: 0 },
  DOWN: { direction: 'DOWN', label: 'Down', keyLabel: 'S / ↓', iconRotation: 180 },
  LEFT: { direction: 'LEFT', label: 'Left', keyLabel: 'A / ←', iconRotation: 270 },
  RIGHT: { direction: 'RIGHT', label: 'Right', keyLabel: 'D / →', iconRotation: 90 },
};

/**
 * 3D Embossed Arrow Icon for the tactile button face
 */
const ButtonArrowIcon: React.FC<{ rotation: number }> = ({ rotation }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 40 40"
    style={{ transform: `rotate(${rotation}deg)` }}
    className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] transition-transform"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id={`btnArrowLit-${rotation}`} x1="20" y1="4" x2="20" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="60%" stopColor="#e0f2fe" />
        <stop offset="100%" stopColor="#7dd3fc" />
      </linearGradient>
    </defs>
    {/* 3D Arrow Embossed Shadow Underneath */}
    <path
      d="M20 7L33 20H25V33H15V20H7L20 7Z"
      fill="#0c4a6e"
      transform="translate(0, 2)"
    />
    {/* 3D Arrow Face */}
    <path
      d="M20 6L33 19H25V32H15V19H7L20 6Z"
      fill={`url(#btnArrowLit-${rotation})`}
      stroke="#ffffff"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    {/* Specular Ridge */}
    <line x1="20" y1="8" x2="20" y2="30" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
  </svg>
);

export const ThreeDControls: React.FC<ThreeDControlsProps> = ({ onInput, disabled = false }) => {
  const handlePress = (e: React.MouseEvent | React.TouchEvent, direction: Direction) => {
    e.preventDefault();
    e.stopPropagation(); // Critical: stops touch/drag events on arena container

    if (disabled) return;

    // Trigger haptic vibration if supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch {
        // Ignore haptic failures
      }
    }

    sound.playTap();
    onInput(direction);
  };

  const render3DButton = (dir: Direction) => {
    const config = BUTTONS[dir];

    return (
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => handlePress(e, dir)}
        onTouchStart={(e) => handlePress(e, dir)}
        onMouseDown={(e) => e.stopPropagation()}
        aria-label={`Control ${config.label}`}
        className="group relative w-full max-w-[84px] sm:max-w-[96px] h-16 sm:h-[72px] rounded-2xl cursor-pointer select-none transition-all duration-75 active:translate-y-[6px] focus:outline-none"
      >
        {/* 3D Extruded Base / Depth Pedestal */}
        <div className="absolute inset-0 rounded-2xl bg-[#090f24] shadow-[0_8px_0_#050816,0_14px_20px_rgba(0,0,0,0.65)] group-active:shadow-[0_2px_0_#050816,0_4px_10px_rgba(0,0,0,0.5)] transition-all" />

        {/* 3D Keycap Front Surface with Metallic / Arcade Sheen */}
        <div className="absolute inset-x-0 top-0 bottom-[6px] rounded-2xl bg-gradient-to-b from-[#34447d] via-[#24315f] to-[#182143] border-t-2 border-indigo-200/50 border-x border-indigo-400/25 flex flex-col items-center justify-center p-1 group-hover:from-[#3e5296] group-hover:to-[#1e2a56] group-active:bottom-[2px] transition-all overflow-hidden">
          {/* Top Edge Specular Reflection */}
          <div className="absolute top-0 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

          {/* 3D Embossed Arrow */}
          <div className="transform group-hover:scale-105 group-active:scale-95 transition-transform">
            <ButtonArrowIcon rotation={config.iconRotation} />
          </div>

          {/* Subtle Keycap Keyboard Hint */}
          <span className="text-[9px] font-bold text-indigo-200/70 tracking-tight leading-none mt-0.5 pointer-events-none">
            {config.keyLabel}
          </span>
        </div>
      </button>
    );
  };

  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      className="w-full max-w-sm mx-auto flex flex-col items-center justify-center pt-1 pb-1 z-20"
    >
      <div className="flex items-center justify-center gap-2 mb-2 text-indigo-200/75 text-[11px] font-semibold tracking-wide">
        <span>🎮 Tap 3D keys or swipe screen</span>
      </div>

      {/* 3D Keypad Grid (Ergonomic Cross Layout) */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full px-2 place-items-center">
        {/* Row 1: Top spacer, UP, Top spacer */}
        <div />
        {render3DButton('UP')}
        <div />

        {/* Row 2: LEFT, DOWN, RIGHT */}
        {render3DButton('LEFT')}
        {render3DButton('DOWN')}
        {render3DButton('RIGHT')}
      </div>
    </div>
  );
};
