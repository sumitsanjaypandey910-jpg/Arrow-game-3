import React, { useState, useCallback } from 'react';
import { Trophy, Shield } from 'lucide-react';
import { HeaderBar } from './components/HeaderBar';
import { ElevateArrowIcon } from './components/ElevateArrowIcon';
import { DifficultyCard } from './components/DifficultyCard';
import { SkillsTrained } from './components/SkillsTrained';
import { GameplayArena } from './components/GameplayArena';
import { TutorialModal } from './components/TutorialModal';
import { ResultsModal } from './components/ResultsModal';
import { LEVEL_CONFIGS, loadUserStats, saveUserStats } from './utils/gameLogic';
import { sound } from './utils/sound';
import { GameResult, UserStats } from './types/game';
import backdropImg from './assets/images/night_road_backdrop_1790198787282.jpg';

export default function App() {
  const [view, setView] = useState<'MENU' | 'PLAYING'>('MENU');
  const [userStats, setUserStats] = useState<UserStats>(() => loadUserStats());
  const [currentLevel, setCurrentLevel] = useState<number>(() => {
    const stats = loadUserStats();
    return stats.highestLevelUnlocked > 1 ? stats.highestLevelUnlocked : 1;
  });
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(sound.getMuted());
  const [lastResult, setLastResult] = useState<GameResult | null>(null);

  const handleToggleSound = useCallback(() => {
    const muted = sound.toggleMute();
    setIsSoundMuted(muted);
  }, []);

  const handleStartGame = useCallback((lvl?: number) => {
    sound.playTap();
    if (lvl) setCurrentLevel(lvl);
    setLastResult(null);
    setView('PLAYING');
  }, []);

  const handleGameOver = useCallback((result: GameResult) => {
    setUserStats((prevStats) => {
      const isNewBest = result.score > prevStats.bestScore;
      const finalResult = { ...result, isNewBest };
      const updated = saveUserStats(prevStats, finalResult);
      setLastResult(finalResult);
      return updated;
    });
  }, []);

  const currentConfig =
    LEVEL_CONFIGS.find((l) => l.level === currentLevel) || LEVEL_CONFIGS[0];

  return (
    <div className="min-h-screen w-full bg-[#120a2b] text-white flex items-center justify-center p-0 sm:p-4 md:p-6 antialiased font-sans select-none overflow-x-hidden">
      {/* Outer Glow on Desktop */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.12)_0%,transparent_70%)]" />

      {/* Mobile Device Enclosure Frame */}
      <div className="relative w-full h-[100dvh] sm:h-[844px] sm:max-w-[390px] sm:rounded-[44px] bg-[#1a113d] sm:border-[6px] sm:border-[#2e2365] sm:shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(79,70,229,0.15)] flex flex-col overflow-hidden">
        {/* Dynamic Island / Speaker Notch on Desktop Mockup */}
        <div className="hidden sm:flex absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 items-center justify-between px-3 pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="text-[10px] font-mono text-white/40">00:00</span>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        </div>

        {/* View Mode Switching */}
        {view === 'PLAYING' ? (
          <div className="relative w-full h-full flex flex-col pt-2 sm:pt-6">
            <GameplayArena
              config={currentConfig}
              onExit={() => setView('MENU')}
              onGameOver={handleGameOver}
              isSoundMuted={isSoundMuted}
              onToggleSound={handleToggleSound}
            />

            {/* Results Modal appears when game finishes */}
            {lastResult && (
              <ResultsModal
                result={lastResult}
                config={currentConfig}
                onPlayAgain={() => {
                  setLastResult(null);
                  handleStartGame();
                }}
                onNextLevel={() => {
                  const nextLevel = currentLevel + 1;
                  setCurrentLevel(nextLevel);
                  setLastResult(null);
                  handleStartGame(nextLevel);
                }}
                onGoHome={() => {
                  setLastResult(null);
                  setView('MENU');
                }}
                hasNextLevel={currentLevel < LEVEL_CONFIGS.length}
              />
            )}
          </div>
        ) : (
          /* MENU VIEW (Exact Replica of Provided Screenshot) */
          <div className="relative w-full h-full flex flex-col justify-between overflow-y-auto overflow-x-hidden pt-2 sm:pt-6 pb-6 px-5 sm:px-6">
            {/* Top Atmospheric Road Backdrop */}
            <div className="absolute top-0 left-0 right-0 h-72 overflow-hidden pointer-events-none z-0">
              <img
                src={backdropImg}
                alt="City night background"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top opacity-35 mix-blend-luminosity filter blur-[0.5px]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#1a113d]/40 via-[#1a113d]/85 to-[#1a113d]" />
            </div>

            {/* Top Bar with X and ? */}
            <HeaderBar
              showBack={false}
              onOpenHelp={() => setIsHelpOpen(true)}
              isSoundMuted={isSoundMuted}
              onToggleSound={handleToggleSound}
            />

            {/* Hero Badge & Title Area */}
            <div className="relative z-10 flex flex-col items-center text-center mt-1 sm:mt-2">
              {/* Elevated Opposing Arrows Icon */}
              <div className="mb-4 animate-float-slow">
                <ElevateArrowIcon size="lg" />
              </div>

              {/* Category Kicker */}
              <span className="text-[11px] sm:text-xs font-extrabold tracking-widest text-indigo-300/80 uppercase mb-1">
                Problem Solving
              </span>

              {/* Main Game Title */}
              <h1 className="text-3xl sm:text-[34px] font-black text-white tracking-tight leading-tight mb-4">
                Arrows direction
              </h1>

              {/* Best Score & Rank Stats Row */}
              <div className="flex items-center justify-center gap-12 sm:gap-16 w-full max-w-xs pb-1">
                {/* Best Score */}
                <div className="flex items-center gap-2.5">
                  <Trophy className="w-6 h-6 text-indigo-300/70" strokeWidth={1.8} />
                  <div className="text-left">
                    <span className="text-[10px] font-bold tracking-wider text-indigo-300/70 uppercase block leading-none mb-1">
                      Best Score
                    </span>
                    <span className="text-base sm:text-lg font-bold text-white leading-none tabular-nums">
                      {userStats.bestScore > 0 ? userStats.bestScore.toLocaleString() : '-'}
                    </span>
                  </div>
                </div>

                {/* Rank */}
                <div className="flex items-center gap-2.5">
                  <Shield className="w-6 h-6 text-indigo-300/70" strokeWidth={1.8} />
                  <div className="text-left">
                    <span className="text-[10px] font-bold tracking-wider text-indigo-300/70 uppercase block leading-none mb-1">
                      Rank
                    </span>
                    <span className="text-base sm:text-lg font-bold text-white leading-none">
                      {userStats.rankTitle || '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Section: Difficulty Card + Skills Trained */}
            <div className="relative z-10 space-y-5 my-4">
              <DifficultyCard
                currentLevel={currentLevel}
                highestLevelUnlocked={userStats.highestLevelUnlocked}
                onSelectLevel={setCurrentLevel}
              />

              <SkillsTrained />
            </div>

            {/* Bottom Start Action Button */}
            <div className="relative z-10 pt-2 pb-1">
              <button
                onClick={() => handleStartGame()}
                className="w-full h-14 rounded-full bg-gradient-to-r from-[#cbd5e1] via-[#e2e8f0] to-[#cbd5e1] hover:from-white hover:to-slate-200 active:scale-[0.98] text-[#1e1548] font-black text-lg tracking-wide shadow-[0_8px_20px_rgba(0,0,0,0.35),0_0_15px_rgba(255,255,255,0.2)] flex items-center justify-center relative overflow-hidden transition cursor-pointer"
              >
                {/* Subtle glass reflection highlight */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

                {/* Centered subtle glowing dot just like in the screenshot's Start button */}
                <div className="flex items-center gap-2 z-10">
                  <span>Start</span>
                  <div className="w-3.5 h-3.5 rounded-full bg-indigo-500/25 border border-indigo-400/30 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600/70" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Tutorial / Help Modal */}
        <TutorialModal
          isOpen={isHelpOpen}
          onClose={() => setIsHelpOpen(false)}
          onStartGame={() => {
            setIsHelpOpen(false);
            handleStartGame();
          }}
        />

        {/* Mobile home bar indicator */}
        <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mb-2 mt-auto shrink-0" />
      </div>

      {/* Helpful Desktop Controls Badge on Wide Screens */}
      <aside className="hidden lg:flex flex-col ml-8 max-w-xs text-xs text-indigo-200/75 space-y-3 bg-[#1e1445]/60 border border-indigo-400/20 rounded-2xl p-5 backdrop-blur-md">
        <div className="text-white font-bold text-sm flex items-center gap-2">
          <span>🧠 Cognitive Brain Training</span>
        </div>
        <p className="leading-relaxed">
          Based on the classic Eriksen Flanker Task & Directional Stroop effect used in Elevate and cognitive psychology to sharpen focus and cognitive inhibition.
        </p>
        <div className="border-t border-white/10 pt-2 space-y-1.5">
          <div className="font-semibold text-white">Controls:</div>
          <div className="flex items-center justify-between">
            <span>Swipe (Touch / Mouse):</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[11px] text-white">Drag</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span>Arrow Keys:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[11px] text-white">↑ ↓ ← →</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span>WASD Keys:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[11px] text-white">W A S D</kbd>
          </div>
        </div>
      </aside>
    </div>
  );
}
