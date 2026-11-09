import { ConceptId, ConceptItem, BadgeInfo, TeacherSettings } from '../types';

export const CONCEPTS: Record<ConceptId, ConceptItem> = {
  'oszi-level': {
    id: 'oszi-level',
    name: 'őszi levél',
    article: 'az',
    accusative: 'az őszi levelet',
    nominativeWithArticle: 'az őszi levél',
    description: 'Színes falevél a fáról',
    accentColor: '#e06d28',
  },
  'gesztenye': {
    id: 'gesztenye',
    name: 'gesztenye',
    article: 'a',
    accusative: 'a gesztenyét',
    nominativeWithArticle: 'a gesztenye',
    description: 'Fényes barna vadgesztenye tüskés burokban',
    accentColor: '#8a4b27',
  },
  'makk': {
    id: 'makk',
    name: 'makk',
    article: 'a',
    accusative: 'a makkot',
    nominativeWithArticle: 'a makk',
    description: 'Tölgyfa kis kalapos termése',
    accentColor: '#b5833a',
  },
  'alma': {
    id: 'alma',
    name: 'alma',
    article: 'az',
    accusative: 'az almát',
    nominativeWithArticle: 'az alma',
    description: 'Zamatos piros őszi gyümölcs',
    accentColor: '#d63031',
  },
  'korte': {
    id: 'korte',
    name: 'körte',
    article: 'a',
    accusative: 'a körtét',
    nominativeWithArticle: 'a körte',
    description: 'Édes sárgás-zöld gyümölcs',
    accentColor: '#88a825',
  },
  'szolo': {
    id: 'szolo',
    name: 'szőlő',
    article: 'a',
    accusative: 'a szőlőt',
    nominativeWithArticle: 'a szőlő',
    description: 'Lédús lila szőlőfürt',
    accentColor: '#7a3b8d',
  },
  'tok': {
    id: 'tok',
    name: 'tök',
    article: 'a',
    accusative: 'a tököt',
    nominativeWithArticle: 'a tök',
    description: 'Kerek, narancssárga őszi sütőtök',
    accentColor: '#e67e22',
  },
  'eso': {
    id: 'eso',
    name: 'eső',
    article: 'az',
    accusative: 'az esőt',
    nominativeWithArticle: 'az eső',
    description: 'Őszi esőfelhő lehulló esőcseppekkel',
    accentColor: '#3498db',
  },
  'esernyo': {
    id: 'esernyo',
    name: 'esernyő',
    article: 'az',
    accusative: 'az esernyőt',
    nominativeWithArticle: 'az esernyő',
    description: 'Nyitott esernyő, ami megvéd az esőtől',
    accentColor: '#e74c3c',
  },
  'gumicsizma': {
    id: 'gumicsizma',
    name: 'gumicsizma',
    article: 'a',
    accusative: 'a gumicsizmát',
    nominativeWithArticle: 'a gumicsizma',
    description: 'Vízhatlan sárga lábbeli a tócsákhoz',
    accentColor: '#f1c40f',
  },
};

export const LEVEL_CONCEPTS: Record<number, ConceptId[]> = {
  1: ['oszi-level', 'gesztenye', 'makk', 'alma', 'korte', 'szolo'],
  2: ['oszi-level', 'gesztenye', 'makk', 'alma', 'korte', 'szolo', 'tok', 'eso'],
  3: ['oszi-level', 'gesztenye', 'makk', 'alma', 'korte', 'szolo', 'tok', 'eso', 'esernyo', 'gumicsizma'],
};

export const DEFAULT_SETTINGS: TeacherSettings = {
  timeLimitEnabled: true,
  levelDurations: {
    1: 120,
    2: 150,
    3: 180,
  },
  speechEnabled: true,
  soundEffectsEnabled: true,
};

export const BADGES: Record<string, BadgeInfo> = {
  pontos_megfigyelo: {
    id: 'pontos_megfigyelo',
    title: 'Pontos megfigyelő',
    description: 'A szint összes tárgyát téves választás nélkül megtaláltad!',
    icon: '🎯',
  },
  kitarto_felfedezo: {
    id: 'kitarto_felfedezo',
    title: 'Kitartó felfedező',
    description: 'Egy újraindított szintet kitartó munkával sikeresen befejeztél!',
    icon: '🌟',
  },
};
