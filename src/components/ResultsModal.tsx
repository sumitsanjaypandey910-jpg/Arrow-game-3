import React, { useEffect } from 'react';
import { Trophy, Zap, Target, Flame, ArrowRight, RotateCcw, Home, Sparkles } from 'lucide-react';
import { GameResult, LevelConfig } from '../types/game';
import { sound } from '../utils/sound';

interface ResultsModalProps {
  result: GameResult;
  config: LevelConfig;
  onPlayAgain: () => void;
  onNextLevel?: () => void;
  onGoHome: () => void;
  hasNextLevel: boolean;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  result,
  config,
  onPlayAgain,
  onNextLevel,
  onGoHome,
  hasNextLevel,
}) => {
  useEffect(() => {
    if (result.isLevelPassed || result.isNewBest) {
      sound.playLevelUp();
    }
  }, [result]);

  const getSpeedRating = (ms: number) => {
    if (ms === 0) return 'Analyzing';
    if (ms < 300) return '⚡ Lightning Fast';
    if (ms < 420) return '🔥 Elite Reflexes';
    if (ms < 600) return '✨ Swift & Steady';
    return '🎯 Focused';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#281d59] via-[#21174c] to-[#18103d] border border-indigo-400/35 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-white overflow-hidden flex flex-col items-center text-center">
        {/* Top Glow & Confetti accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Celebration Header */}
        <div className="relative z-10 mb-4">
          {result.isLevelPassed ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2 animate-bounce">
              <Sparkles className="w-3.5 h-3.5" />
              Level {result.level} Cleared!
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-bold uppercase tracking-wider mb-2">
              Round Complete
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {result.isLevelPassed ? 'Outstanding Work!' : 'Good Effort!'}
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200/80 mt-1">
            {result.isLevelPassed
              ? `You beat the ${config.targetScore} pt goal in Level ${result.level}!`
              : `Target was ${config.targetScore} pts. You can do it next try!`}
          </p>
        </div>

        {/* Score Readout Card */}
        <div className="relative w-full rounded-2xl bg-white/5 border border-white/10 py-5 px-4 mb-5 shadow-inner">
          <span className="text-[11px] font-bold tracking-widest text-indigo-300 uppercase block mb-1">
            Final Score
          </span>
          <div className="text-5xl sm:text-6xl font-black font-display text-white tracking-tight leading-none mb-1">
            {result.score.toLocaleString()}
          </div>

          {result.isNewBest && (
            <div className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
              <Trophy className="w-3.5 h-3.5" /> New Personal Best!
            </div>
          )}
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 w-full mb-5 text-left">
          {/* Accuracy */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4 text-cyan-300" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-indigo-300 uppercase block">
                Accuracy
              </span>
              <span className="text-base font-bold text-white tabular-nums">
                {result.accuracy}%
              </span>
              <span className="text-[10px] text-white/50 block">
                {result.correctCount}/{result.totalAnswered}
                {result.timeoutsCount > 0 ? ` • ${result.timeoutsCount} timed out` : ''}
              </span>
            </div>
          </div>

          {/* Speed */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-indigo-300 uppercase block">
                Avg Speed
              </span>
              <span className="text-base font-bold text-white tabular-nums">
                {result.avgReactionMs} ms
              </span>
              <span className="text-[10px] text-emerald-300 block truncate">
                {getSpeedRating(result.avgReactionMs)}
              </span>
            </div>
          </div>

          {/* Max Streak */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4 text-rose-300" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-indigo-300 uppercase block">
                Best Streak
              </span>
              <span className="text-base font-bold text-white tabular-nums">
                {result.maxStreak} in a row
              </span>
            </div>
          </div>

          {/* XP Gained */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-teal-300" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-indigo-300 uppercase block">
                Brain XP
              </span>
              <span className="text-base font-bold text-white tabular-nums">
                +{result.concentrationXP + result.visualSpeedXP} XP
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2.5">
          {result.isLevelPassed && hasNextLevel && onNextLevel ? (
            <button
              onClick={() => {
                sound.playTap();
                onNextLevel();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 text-[#140c31] font-extrabold text-base tracking-wide shadow-lg shadow-cyan-500/30 hover:opacity-95 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Next Level ({result.level + 1})</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playTap();
                onPlayAgain();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 text-[#140c31] font-extrabold text-base tracking-wide shadow-lg shadow-cyan-500/30 hover:opacity-95 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Play Again</span>
            </button>
          )}

          <div className="flex gap-2 w-full">
            {result.isLevelPassed && hasNextLevel && (
              <button
                onClick={() => {
                  sound.playTap();
                  onPlayAgain();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition flex items-center justify-center gap-2 border border-white/10 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Replay</span>
              </button>
            )}

            <button
              onClick={() => {
                sound.playTap();
                onGoHome();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition flex items-center justify-center gap-2 border border-white/10 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
