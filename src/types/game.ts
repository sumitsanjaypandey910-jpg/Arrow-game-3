export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type ArrowMode = 'SINGLE_DIRECT' | 'FLANKER' | 'INVERTED' | 'HYBRID_FLANKER_INVERTED';

export interface Stimulus {
  id: string;
  type: ArrowMode;
  targetDirection: Direction; // The direction of the target arrow
  correctResponse: Direction; // The required swipe response (may be opposite if inverted)
  isInverted: boolean; // True if player must swipe opposite
  flankers?: Direction[]; // For flanker task: 5 arrows where index 2 is target
  orientation?: 'horizontal' | 'vertical'; // Array layout
  flankersCongruent?: boolean; // For statistics
  timestamp: number;
}

export interface LevelConfig {
  level: number;
  title: string;
  subtitle: string;
  targetScore: number;
  durationSeconds: number;
  timePerQuestionMs: number; // Max allowed ms per arrow before timeout
  modesAllowed: ArrowMode[];
  description: string;
  iconHint: string;
}

export interface UserStats {
  bestScore: number;
  highestLevelUnlocked: number;
  gamesPlayed: number;
  totalCorrect: number;
  totalErrors: number;
  totalTimeouts?: number;
  bestStreak: number;
  avgReactionMs: number;
  rankTitle: string;
}

export interface GameResult {
  score: number;
  level: number;
  isLevelPassed: boolean;
  totalAnswered: number;
  correctCount: number;
  errorCount: number;
  timeoutsCount: number;
  accuracy: number;
  avgReactionMs: number;
  fastestReactionMs: number;
  maxStreak: number;
  concentrationXP: number;
  visualSpeedXP: number;
  isNewBest: boolean;
}
