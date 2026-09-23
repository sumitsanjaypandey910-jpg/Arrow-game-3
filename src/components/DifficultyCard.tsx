import React from 'react';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { LEVEL_CONFIGS } from '../utils/gameLogic';
import { sound } from '../utils/sound';

interface DifficultyCardProps {
  currentLevel: number;
  highestLevelUnlocked: number;
  onSelectLevel: (lvl: number) => void;
}

export const DifficultyCard: React.FC<DifficultyCardProps> = ({
  currentLevel,
  highestLevelUnlocked,
  onSelectLevel,
}) => {
  const currentConfig = LEVEL_CONFIGS.find((l) => l.level === currentLevel) || LEVEL_CONFIGS[0];
  const hasPrev = currentLevel > 1;
  const hasNext = currentLevel < LEVEL_CONFIGS.length;
  const isNextUnlocked = currentLevel + 1 <= highestLevelUnlocked;

  const handlePrev = () => {
    if (hasPrev) {
      sound.playTap();
      onSelectLevel(currentLevel - 1);
    }
  };

  const handleNext = () => {
    if (hasNext && isNextUnlocked) {
      sound.playTap();
      onSelectLevel(currentLevel + 1);
    }
  };

  return (
    <div className="w-full">
      <div className="text-[11px] font-bold tracking-widest text-indigo-300/80 uppercase mb-2 px-1">
        Difficulty
      </div>

      <div className="relative w-full rounded-2xl bg-gradient-to-r from-[#2a1e5c]/90 via-[#31246b]/90 to-[#2a1e5c]/90 border border-indigo-400/20 shadow-md backdrop-blur-md overflow-hidden flex items-stretch min-h-[92px]">
        {/* Previous Level Chevron */}
        <button
          onClick={handlePrev}
          disabled={!hasPrev}
          aria-label="Previous difficulty level"
          className={`w-9 flex items-center justify-center transition-colors cursor-pointer ${
            hasPrev
              ? 'text-indigo-200/70 hover:text-white hover:bg-white/5 active:scale-95'
              : 'text-indigo-400/20 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Level Number and Divider */}
        <div className="flex items-center gap-4 py-3.5 px-2 flex-1">
          <div className="flex flex-col items-center justify-center min-w-[48px]">
            <span className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight leading-none">
              {currentLevel}
            </span>
            {currentLevel > highestLevelUnlocked && (
              <span className="flex items-center gap-1 text-[10px] text-amber-300 font-medium mt-1">
                <Lock className="w-3 h-3" /> Locked
              </span>
            )}
          </div>

          <div className="w-[1px] h-11 bg-indigo-300/20" />

          {/* Target rule description */}
          <div className="flex-1 pr-1">
            <p className="text-sm sm:text-[15px] font-medium text-white/95 leading-snug">
              Score more than{' '}
              <span className="font-bold text-white tracking-tight">
                {currentConfig.targetScore}
              </span>{' '}
              points in{' '}
              <span className="font-bold text-white tracking-tight">
                {currentConfig.durationSeconds} seconds
              </span>{' '}
              to level up
            </p>
          </div>
        </div>

        {/* Next Level Chevron */}
        <button
          onClick={handleNext}
          disabled={!hasNext || !isNextUnlocked}
          aria-label="Next difficulty level"
          className={`w-9 flex items-center justify-center transition-colors ${
            hasNext && isNextUnlocked
              ? 'text-indigo-200/70 hover:text-white hover:bg-white/5 active:scale-95 cursor-pointer'
              : 'text-indigo-400/20 cursor-not-allowed'
          }`}
        >
          {hasNext && !isNextUnlocked ? (
            <Lock className="w-4 h-4 text-indigo-400/40" />
          ) : (
            <ChevronRight className="w-6 h-6" />
          )}
        </button>

        {/* Decorative subtle slant / chevron effect on the background */}
        <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none bg-gradient-to-l from-white/[0.03] to-transparent" />
      </div>
    </div>
  );
};
