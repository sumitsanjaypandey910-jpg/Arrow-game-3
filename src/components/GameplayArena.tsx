import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Flame, Pause, Play, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { Direction, Stimulus, GameResult, LevelConfig } from '../types/game';
import { generateStimulus, calculatePoints } from '../utils/gameLogic';
import { sound } from '../utils/sound';
import { ArrowDisplay } from './ArrowDisplay';

interface GameplayArenaProps {
  config: LevelConfig;
  onExit: () => void;
  onGameOver: (result: GameResult) => void;
  isSoundMuted: boolean;
  onToggleSound: () => void;
}

export const GameplayArena: React.FC<GameplayArenaProps> = ({
  config,
  onExit,
  onGameOver,
}) => {
  // Game states
  const [countdown, setCountdown] = useState<number | null>(3);
  const [timeLeft, setTimeLeft] = useState<number>(config.durationSeconds);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);

  // Stats collection
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [timeoutsCount, setTimeoutsCount] = useState<number>(0);
  const reactionTimesRef = useRef<number[]>([]);

  // Per-Question Response Urgency Timer / Gauge
  const [timerEnabled, setTimerEnabled] = useState<boolean>(true);
  const maxQuestionTimeMs = config.timePerQuestionMs || 2000;
  const [questionRemainingMs, setQuestionRemainingMs] = useState<number>(maxQuestionTimeMs);
  const [gaugePercent, setGaugePercent] = useState<number>(100);
  const [isTimedOut, setIsTimedOut] = useState<boolean>(false);

  // Stimulus & Timers
  const [stimulus, setStimulus] = useState<Stimulus>(() => generateStimulus(config.level));
  const stimulusStartTimeRef = useRef<number>(performance.now());
  const [animState, setAnimState] = useState<{ direction: Direction; isCorrect: boolean } | null>(null);
  const [floatingBonus, setFloatingBonus] = useState<{ id: number; text: string; isError?: boolean } | null>(null);

  // Gesture tracking & control refs
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isInputLockedRef = useRef<boolean>(false);
  const urgentTickPlayedRef = useRef<boolean>(false);
  const timeoutHandledRef = useRef<boolean>(false);
  const isGameOverCalledRef = useRef<boolean>(false);

  // Reset per-stimulus timer and gauge
  const resetQuestionTimer = useCallback(() => {
    stimulusStartTimeRef.current = performance.now();
    setQuestionRemainingMs(maxQuestionTimeMs);
    setGaugePercent(100);
    setIsTimedOut(false);
    urgentTickPlayedRef.current = false;
    timeoutHandledRef.current = false;
  }, [maxQuestionTimeMs]);

  // Countdown timer effect
  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      sound.playCountdown(countdown);
      const timer = setTimeout(() => {
        setCountdown((c) => (c !== null ? c - 1 : null));
      }, 750);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      sound.playCountdown(0);
      const timer = setTimeout(() => {
        setCountdown(null);
        resetQuestionTimer();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [countdown, resetQuestionTimer]);

  // Per-stimulus urgency timer countdown interval (generates urge to answer quickly!)
  useEffect(() => {
    if (countdown !== null || isPaused || !timerEnabled || timeLeft <= 0) {
      return;
    }

    const interval = setInterval(() => {
      if (isInputLockedRef.current || timeoutHandledRef.current) return;

      const elapsed = performance.now() - stimulusStartTimeRef.current;
      const remaining = Math.max(0, maxQuestionTimeMs - elapsed);
      const percent = Math.max(0, (remaining / maxQuestionTimeMs) * 100);

      setQuestionRemainingMs(remaining);
      setGaugePercent(percent);

      // Play soft urgent tick sound when entering critical zone (< 28%)
      if (percent <= 28 && !urgentTickPlayedRef.current && remaining > 60) {
        sound.playUrgentTick();
        urgentTickPlayedRef.current = true;
      }

      // Check if time has run out on this arrow
      if (remaining <= 0 && !timeoutHandledRef.current) {
        timeoutHandledRef.current = true;
        isInputLockedRef.current = true;
        setIsTimedOut(true);
        setTimeoutsCount((t) => t + 1);
        setErrorCount((e) => e + 1);
        setStreak(0);
        sound.playTimeout();

        setFloatingBonus({
          id: Date.now(),
          text: '⏳ Too Slow!',
          isError: true,
        });

        // Advance to next stimulus after short feedback delay
        setTimeout(() => {
          setStimulus(generateStimulus(config.level, stimulus.targetDirection));
          resetQuestionTimer();
          setAnimState(null);
          isInputLockedRef.current = false;
        }, 360);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [
    countdown,
    isPaused,
    timerEnabled,
    timeLeft,
    maxQuestionTimeMs,
    config.level,
    stimulus.targetDirection,
    resetQuestionTimer,
  ]);

  // Main 50-second round clock interval
  useEffect(() => {
    if (countdown !== null || isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown, isPaused]);

  // Trigger Game Over ONCE when round time expires
  useEffect(() => {
    if (countdown !== null || timeLeft > 0 || isGameOverCalledRef.current) return;
    isGameOverCalledRef.current = true;

    // Game Over stats calculation
    const totalAnswered = correctCount + errorCount;
    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    const avgReaction =
      reactionTimesRef.current.length > 0
        ? Math.round(
            reactionTimesRef.current.reduce((a, b) => a + b, 0) /
              reactionTimesRef.current.length
          )
        : 0;
    const fastestReaction =
      reactionTimesRef.current.length > 0
        ? Math.min(...reactionTimesRef.current)
        : 0;

    const isLevelPassed = score >= config.targetScore;

    const result: GameResult = {
      score,
      level: config.level,
      isLevelPassed,
      totalAnswered,
      correctCount,
      errorCount,
      timeoutsCount,
      accuracy,
      avgReactionMs: avgReaction,
      fastestReactionMs: fastestReaction,
      maxStreak,
      concentrationXP: Math.round(score * 0.04) + correctCount * 2,
      visualSpeedXP: Math.round(score * 0.05) + Math.max(0, 100 - Math.round(avgReaction / 10)),
      isNewBest: false,
    };

    onGameOver(result);
  }, [
    countdown,
    timeLeft,
    correctCount,
    errorCount,
    timeoutsCount,
    score,
    maxStreak,
    config,
    onGameOver,
  ]);

  // Handle player answer (via swipe, keyboard, or button)
  const handleAnswer = useCallback(
    (inputDirection: Direction) => {
      if (
        countdown !== null ||
        isPaused ||
        isInputLockedRef.current ||
        isTimedOut ||
        timeoutHandledRef.current
      )
        return;

      const reactionMs = Math.round(performance.now() - stimulusStartTimeRef.current);
      const isCorrect = inputDirection === stimulus.correctResponse;

      isInputLockedRef.current = true;
      setAnimState({ direction: inputDirection, isCorrect });

      if (isCorrect) {
        reactionTimesRef.current.push(reactionMs);
        const newStreak = streak + 1;
        setStreak(newStreak);
        setMaxStreak((prev) => Math.max(prev, newStreak));
        setCorrectCount((c) => c + 1);

        const elapsed = performance.now() - stimulusStartTimeRef.current;
        const remaining = Math.max(0, maxQuestionTimeMs - elapsed);
        const currentGauge = timerEnabled
          ? Math.max(0, Math.min(100, (remaining / maxQuestionTimeMs) * 100))
          : 50;

        const { points, bonus } = calculatePoints(reactionMs, newStreak, currentGauge);
        setScore((s) => s + points);

        sound.playCorrect(newStreak);

        // Visual floating points cue with speed bonus indication
        const speedTag = currentGauge > 70 ? ' ⚡ Lightning!' : bonus > 20 ? ' ⚡ Speed!' : '';
        const streakTag = newStreak >= 5 ? ` (x${newStreak >= 10 ? '2.5' : '2.0'})` : '';

        setFloatingBonus({
          id: Date.now(),
          text: `+${points}${speedTag}${streakTag}`,
          isError: false,
        });
      } else {
        setStreak(0);
        setErrorCount((e) => e + 1);
        sound.playWrong();

        setFloatingBonus({
          id: Date.now(),
          text: 'Miss',
          isError: true,
        });
      }

      // Transition to next arrow stimulus quickly
      setTimeout(() => {
        setStimulus(generateStimulus(config.level, stimulus.targetDirection));
        resetQuestionTimer();
        setAnimState(null);
        isInputLockedRef.current = false;
      }, 130);
    },
    [
      countdown,
      isPaused,
      isTimedOut,
      stimulus,
      streak,
      timerEnabled,
      maxQuestionTimeMs,
      config.level,
      resetQuestionTimer,
    ]
  );

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (countdown !== null || isPaused) return;

      let dir: Direction | null = null;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') dir = 'UP';
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') dir = 'DOWN';
      else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') dir = 'LEFT';
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') dir = 'RIGHT';

      if (dir) {
        e.preventDefault();
        handleAnswer(dir);
      } else if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        setIsPaused((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [countdown, isPaused, handleAnswer]);

  // Touch & Pointer Gesture Listeners
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (countdown !== null || isPaused) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    touchStartRef.current = { x: clientX, y: clientY, time: Date.now() };
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!touchStartRef.current || countdown !== null || isPaused) return;

    const clientX =
      'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const clientY =
      'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;

    const dx = clientX - touchStartRef.current.x;
    const dy = clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const minSwipeDist = 26;

    if (Math.max(absX, absY) > minSwipeDist) {
      if (absX > absY) {
        // Horizontal swipe
        handleAnswer(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        // Vertical swipe
        handleAnswer(dy > 0 ? 'DOWN' : 'UP');
      }
    }

    touchStartRef.current = null;
  };

  // Format time as 00:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const timerPercent = (timeLeft / config.durationSeconds) * 100;
  const isTimeCritical = timeLeft <= 10;

  return (
    <div
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-full flex flex-col justify-between py-2 sm:py-3 px-4 select-none touch-none overflow-hidden max-w-md mx-auto"
    >
      {/* Top HUD: Exit, Score, Urgency Mode Indicator, Global Timer */}
      <div className="w-full flex items-center justify-between gap-2 pt-2 pb-2.5 border-b border-white/10 z-20">
        <button
          onClick={() => {
            sound.playTap();
            onExit();
          }}
          className="text-xs font-semibold text-indigo-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 transition active:scale-95 cursor-pointer"
        >
          Exit
        </button>

        {/* Urge Timer Mode Toggle Button */}
        <button
          onClick={() => {
            sound.playTap();
            setTimerEnabled((t) => !t);
          }}
          title={timerEnabled ? 'Response limit active' : 'Response limit paused'}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer active:scale-95 ${
            timerEnabled
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-sm shadow-cyan-500/20'
              : 'bg-white/5 text-white/50 border-white/10'
          }`}
        >
          <Zap className={`w-3 h-3 ${timerEnabled ? 'text-amber-300 fill-amber-300' : 'text-white/40'}`} />
          <span>{timerEnabled ? 'Urge Gauge ON' : 'Gauge OFF'}</span>
        </button>

        {/* Running Score */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest leading-none mb-0.5">
            Score
          </span>
          <div className="relative">
            <span className="text-2xl sm:text-3xl font-black font-display text-white tabular-nums tracking-tight">
              {score}
            </span>

            {/* Floating bonus notification */}
            {floatingBonus && (
              <span
                key={floatingBonus.id}
                className={`absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold pointer-events-none animate-out fade-out slide-out-to-top duration-700 ${
                  floatingBonus.isError ? 'text-rose-400 font-extrabold' : 'text-cyan-300'
                }`}
              >
                {floatingBonus.text}
              </span>
            )}
          </div>
        </div>

        {/* Global Round Timer readout */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest leading-none mb-0.5">
              Round
            </span>
            <span
              className={`text-lg sm:text-xl font-black font-display tabular-nums tracking-tight ${
                isTimeCritical ? 'text-rose-400 animate-pulse' : 'text-white'
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>

          <button
            onClick={() => {
              sound.playTap();
              setIsPaused((p) => !p);
            }}
            aria-label="Pause game"
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-white cursor-pointer active:scale-95 transition"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-white" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Progress Bar under HUD for 50-second round */}
      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1.5">
        <div
          style={{ width: `${timerPercent}%` }}
          className={`h-full transition-all duration-1000 ${
            isTimeCritical ? 'bg-rose-500' : 'bg-gradient-to-r from-teal-400 to-cyan-400'
          }`}
        />
      </div>

      {/* Streak and Level Indicator */}
      <div className="flex items-center justify-between text-xs px-2 mt-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-indigo-300/80 font-medium">Level {config.level}:</span>
          <span className="text-white font-bold">{config.title}</span>
        </div>

        {streak >= 2 && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-xs shadow-sm animate-pulse">
            <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>
              {streak} streak ({streak >= 10 ? '2.5x' : streak >= 6 ? '2.0x' : '1.5x'})
            </span>
          </div>
        )}
      </div>

      {/* Center Interactive Stimulus Area with Dynamic Urgency Gauge */}
      <div className="flex-1 flex flex-col items-center justify-center relative my-1">
        <ArrowDisplay
          stimulus={stimulus}
          animationState={animState}
          gaugePercent={gaugePercent}
          timeRemainingMs={questionRemainingMs}
          maxTimeMs={maxQuestionTimeMs}
          isTimedOut={isTimedOut}
          timerEnabled={timerEnabled}
        />
      </div>

      {/* Bottom Directional Controls (Touch D-Pad or Taps) */}
      <div className="w-full max-w-xs mx-auto pb-1 z-20">
        <div className="text-center text-[10px] text-indigo-300/70 font-medium mb-1.5">
          Swipe screen or tap directional pad
        </div>

        <div className="grid grid-cols-3 gap-2 place-items-center">
          {/* Row 1: UP */}
          <div />
          <button
            onClick={() => handleAnswer('UP')}
            aria-label="Swipe Up"
            className="w-14 h-11 rounded-xl bg-white/10 hover:bg-white/20 active:scale-90 active:bg-cyan-500/30 border border-white/15 flex items-center justify-center text-white transition cursor-pointer shadow-md"
          >
            <ChevronUp className="w-6 h-6" strokeWidth={3} />
          </button>
          <div />

          {/* Row 2: LEFT, DOWN, RIGHT */}
          <button
            onClick={() => handleAnswer('LEFT')}
            aria-label="Swipe Left"
            className="w-14 h-11 rounded-xl bg-white/10 hover:bg-white/20 active:scale-90 active:bg-cyan-500/30 border border-white/15 flex items-center justify-center text-white transition cursor-pointer shadow-md"
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={3} />
          </button>

          <button
            onClick={() => handleAnswer('DOWN')}
            aria-label="Swipe Down"
            className="w-14 h-11 rounded-xl bg-white/10 hover:bg-white/20 active:scale-90 active:bg-cyan-500/30 border border-white/15 flex items-center justify-center text-white transition cursor-pointer shadow-md"
          >
            <ChevronDown className="w-6 h-6" strokeWidth={3} />
          </button>

          <button
            onClick={() => handleAnswer('RIGHT')}
            aria-label="Swipe Right"
            className="w-14 h-11 rounded-xl bg-white/10 hover:bg-white/20 active:scale-90 active:bg-cyan-500/30 border border-white/15 flex items-center justify-center text-white transition cursor-pointer shadow-md"
          >
            <ChevronRight className="w-6 h-6" strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* 3, 2, 1 Countdown Overlay */}
      {countdown !== null && (
        <div className="absolute inset-0 z-50 bg-[#160e33]/90 backdrop-blur-md flex flex-col items-center justify-center text-center">
          <div className="text-indigo-300 text-sm font-bold uppercase tracking-widest mb-3">
            Get Ready
          </div>
          <div className="text-8xl sm:text-9xl font-black font-display text-white tracking-tighter animate-ping [animation-duration:0.8s]">
            {countdown === 0 ? 'GO!' : countdown}
          </div>
          <div className="mt-8 text-xs text-indigo-200/70 max-w-xs px-4">
            {config.description}
          </div>
        </div>
      )}

      {/* Pause Screen Overlay */}
      {isPaused && (
        <div className="absolute inset-0 z-40 bg-[#160e33]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Game Paused</h3>
          <p className="text-sm text-indigo-200/80 mb-6">Take a breath and resume when ready.</p>
          <div className="space-y-3 w-48">
            <button
              onClick={() => setIsPaused(false)}
              className="w-full py-3 rounded-full bg-cyan-400 hover:bg-cyan-300 text-[#160e33] font-bold text-sm transition active:scale-95 cursor-pointer"
            >
              Resume
            </button>
            <button
              onClick={onExit}
              className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition cursor-pointer"
            >
              Quit to Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
