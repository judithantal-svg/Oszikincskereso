export type ConceptId =
  | 'oszi-level'
  | 'gesztenye'
  | 'makk'
  | 'alma'
  | 'korte'
  | 'szolo'
  | 'tok'
  | 'eso'
  | 'esernyo'
  | 'gumicsizma';

export interface ConceptItem {
  id: ConceptId;
  name: string; // e.g. "őszi levél"
  article: string; // "az" or "a"
  accusative: string; // e.g. "az őszi levelet", "az almát"
  nominativeWithArticle: string; // e.g. "az őszi levél", "az alma"
  description: string; // Short explanation for learners
  accentColor: string; // Harmonious autumn accent color for card details
}

export interface TeacherSettings {
  timeLimitEnabled: boolean;
  levelDurations: {
    1: number; // default 120s
    2: number; // default 150s
    3: number; // default 180s
  };
  speechEnabled: boolean;
  soundEffectsEnabled: boolean;
}

export interface ChoiceLog {
  targetId: ConceptId;
  selectedId: ConceptId;
  isCorrect: boolean;
  timestamp: number;
}

export interface LevelStats {
  levelNumber: number;
  totalItems: number;
  foundItems: ConceptId[];
  wrongAttemptsCount: number;
  firstTrySuccesses: ConceptId[];
  mistakePairs: { target: ConceptId; chosen: ConceptId }[];
  isRestartedAttempt: boolean;
  earnedBadges: BadgeType[];
  score: number;
}

export type BadgeType = 'pontos_megfigyelo' | 'kitarto_felfedezo';

export interface BadgeInfo {
  id: BadgeType;
  title: string;
  description: string;
  icon: string;
}

export type GameView = 'start' | 'playing' | 'settings' | 'level_complete' | 'all_complete';
