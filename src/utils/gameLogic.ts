import { Direction, ArrowMode, Stimulus, LevelConfig, UserStats, GameResult } from '../types/game';

export const DIRECTIONS: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

export const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    level: 1,
    title: 'Basic Direction',
    subtitle: 'Score more than 1000 points in 50 seconds to level up',
    targetScore: 1000,
    durationSeconds: 50,
    timePerQuestionMs: 2200, // 2.2s per arrow countdown gauge
    modesAllowed: ['SINGLE_DIRECT'],
    description: 'React instantly to the arrow direction. Swipe or press arrow keys matching the arrow.',
    iconHint: 'Direct arrows',
  },
  {
    level: 2,
    title: 'Flanker Focus',
    subtitle: 'Score more than 1400 points in 50 seconds to level up',
    targetScore: 1400,
    durationSeconds: 50,
    timePerQuestionMs: 2000, // 2.0s per arrow
    modesAllowed: ['SINGLE_DIRECT', 'FLANKER'],
    description: 'Ignore the distracting outer flanker arrows. Focus strictly on the CENTER arrow!',
    iconHint: 'Center arrow matters',
  },
  {
    level: 3,
    title: 'Inversion Control',
    subtitle: 'Score more than 1800 points in 50 seconds to level up',
    targetScore: 1800,
    durationSeconds: 50,
    timePerQuestionMs: 1800, // 1.8s per arrow
    modesAllowed: ['SINGLE_DIRECT', 'INVERTED'],
    description: 'Cyan arrows = swipe same direction. Amber/Coral arrows = swipe OPPOSITE direction!',
    iconHint: 'Inverted colors',
  },
  {
    level: 4,
    title: 'Dual Challenge',
    subtitle: 'Score more than 2200 points in 50 seconds to level up',
    targetScore: 2200,
    durationSeconds: 50,
    timePerQuestionMs: 1600, // 1.6s per arrow
    modesAllowed: ['FLANKER', 'INVERTED', 'HYBRID_FLANKER_INVERTED'],
    description: 'Flankers + Color Inversions mixed together. Test top-tier inhibition control.',
    iconHint: 'Flanker & Inversions',
  },
  {
    level: 5,
    title: 'Cognitive Flow',
    subtitle: 'Score more than 2600 points in 50 seconds to master',
    targetScore: 2600,
    durationSeconds: 50,
    timePerQuestionMs: 1400, // 1.4s per arrow
    modesAllowed: ['SINGLE_DIRECT', 'FLANKER', 'INVERTED', 'HYBRID_FLANKER_INVERTED'],
    description: 'Rapid stimuli, dynamic variations, maximum speed, and precision reflexes.',
    iconHint: 'Master level',
  },
];

export function getRandomDirection(exclude?: Direction): Direction {
  const options = exclude ? DIRECTIONS.filter(d => d !== exclude) : DIRECTIONS;
  return options[Math.floor(Math.random() * options.length)];
}

export function generateStimulus(level: number, previousTarget?: Direction): Stimulus {
  const config = LEVEL_CONFIGS.find(l => l.level === level) || LEVEL_CONFIGS[0];
  const mode = config.modesAllowed[Math.floor(Math.random() * config.modesAllowed.length)];
  
  // Pick random target direction (prefer variation from previous if possible)
  const target = getRandomDirection(previousTarget);

  let isInverted = false;
  let flankers: Direction[] | undefined;
  let orientation: 'horizontal' | 'vertical' = 'horizontal';
  let flankersCongruent: boolean | undefined;

  if (mode === 'SINGLE_DIRECT') {
    isInverted = false;
  } else if (mode === 'INVERTED') {
    // 60% chance of inverted, 40% normal to keep brain actively switching
    isInverted = Math.random() < 0.65;
  } else if (mode === 'FLANKER') {
    // Flanker task: 5 arrows in a line (index 2 is center target)
    orientation = (target === 'UP' || target === 'DOWN') ? (Math.random() < 0.5 ? 'vertical' : 'horizontal') : 'horizontal';
    
    // 50% congruent (same direction), 50% incongruent (opposite or distracting)
    const isCongruent = Math.random() < 0.45;
    flankersCongruent = isCongruent;
    const flankerDir = isCongruent ? target : (
      (target === 'LEFT' || target === 'RIGHT') 
        ? (target === 'LEFT' ? 'RIGHT' : 'LEFT')
        : (target === 'UP' ? 'DOWN' : 'UP')
    );

    flankers = [flankerDir, flankerDir, target, flankerDir, flankerDir];
    isInverted = false;
  } else if (mode === 'HYBRID_FLANKER_INVERTED') {
    orientation = 'horizontal';
    const isCongruent = Math.random() < 0.4;
    flankersCongruent = isCongruent;
    const flankerDir = isCongruent ? target : OPPOSITE_DIRECTIONS[target];
    flankers = [flankerDir, flankerDir, target, flankerDir, flankerDir];
    // Inverted color applies to center target!
    isInverted = Math.random() < 0.5;
  }

  const correctResponse = isInverted ? OPPOSITE_DIRECTIONS[target] : target;

  return {
    id: `stim-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type: mode,
    targetDirection: target,
    correctResponse,
    isInverted,
    flankers,
    orientation,
    flankersCongruent,
    timestamp: Date.now(),
  };
}

export function calculatePoints(
  reactionMs: number,
  streak: number,
  gaugePercentLeft: number = 0
): { points: number; bonus: number } {
  // Base points: 40 pts
  const base = 40;
  
  // Speed bonus based on remaining urgency gauge and millisecond reaction
  let speedBonus = 0;
  if (gaugePercentLeft > 70 || reactionMs < 320) {
    speedBonus = 35;
  } else if (gaugePercentLeft > 45 || reactionMs < 480) {
    speedBonus = 25;
  } else if (gaugePercentLeft > 25 || reactionMs < 700) {
    speedBonus = 15;
  } else if (reactionMs < 1000) {
    speedBonus = 5;
  }

  // Streak multiplier: 1x, 1.5x (streak >= 3), 2x (streak >= 6), 2.5x (streak >= 10), 3x (streak >= 15)
  let multiplier = 1.0;
  if (streak >= 15) multiplier = 3.0;
  else if (streak >= 10) multiplier = 2.5;
  else if (streak >= 6) multiplier = 2.0;
  else if (streak >= 3) multiplier = 1.5;

  const total = Math.round((base + speedBonus) * multiplier);
  return { points: total, bonus: speedBonus };
}

export function getRankFromStats(bestScore: number, highestLevel: number): string {
  if (bestScore >= 2400 || highestLevel >= 5) return 'Grandmaster';
  if (bestScore >= 1900 || highestLevel >= 4) return 'Master';
  if (bestScore >= 1400 || highestLevel >= 3) return 'Diamond';
  if (bestScore >= 1000 || highestLevel >= 2) return 'Platinum';
  if (bestScore >= 600) return 'Gold';
  if (bestScore > 0) return 'Silver';
  return '-';
}

const STATS_KEY = 'elevate_arrows_game_stats';

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        bestScore: parsed.bestScore || 0,
        highestLevelUnlocked: parsed.highestLevelUnlocked || 1,
        gamesPlayed: parsed.gamesPlayed || 0,
        totalCorrect: parsed.totalCorrect || 0,
        totalErrors: parsed.totalErrors || 0,
        bestStreak: parsed.bestStreak || 0,
        avgReactionMs: parsed.avgReactionMs || 0,
        rankTitle: getRankFromStats(parsed.bestScore || 0, parsed.highestLevelUnlocked || 1),
      };
    }
  } catch {
    // ignore
  }

  return {
    bestScore: 0,
    highestLevelUnlocked: 1,
    gamesPlayed: 0,
    totalCorrect: 0,
    totalErrors: 0,
    totalTimeouts: 0,
    bestStreak: 0,
    avgReactionMs: 0,
    rankTitle: '-',
  };
}

export function saveUserStats(current: UserStats, newResult: GameResult): UserStats {
  const newBestScore = Math.max(current.bestScore, newResult.score);
  const newHighestLevel = newResult.isLevelPassed 
    ? Math.max(current.highestLevelUnlocked, Math.min(newResult.level + 1, LEVEL_CONFIGS.length))
    : current.highestLevelUnlocked;

  const updated: UserStats = {
    bestScore: newBestScore,
    highestLevelUnlocked: newHighestLevel,
    gamesPlayed: current.gamesPlayed + 1,
    totalCorrect: current.totalCorrect + newResult.correctCount,
    totalErrors: current.totalErrors + newResult.errorCount,
    totalTimeouts: (current.totalTimeouts || 0) + newResult.timeoutsCount,
    bestStreak: Math.max(current.bestStreak, newResult.maxStreak),
    avgReactionMs: current.avgReactionMs === 0 
      ? newResult.avgReactionMs 
      : Math.round((current.avgReactionMs + newResult.avgReactionMs) / 2),
    rankTitle: getRankFromStats(newBestScore, newHighestLevel),
  };

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  return updated;
}
