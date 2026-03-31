export const THEME_COLORS = {
  micro: '#8B5CF6',
  macro: '#6366F1',
  monetary: '#22D3EE',
  international: '#F59E0B',
  inequality: '#EC4899',
  fiscal: '#34D399',
} as const;

export const LEVEL_LABELS = {
  accessible: 'Accessible',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé',
} as const;

export type ThemeType = keyof typeof THEME_COLORS;
export type LevelType = keyof typeof LEVEL_LABELS;

export const NAV_LINKS = [
  { href: '/explorer', label: 'Explorer' },
  { href: '/faits', label: 'Faits' },
  { href: '/scenarios', label: 'Scénarios' },
  { href: '/glossaire', label: 'Glossaire' },
  { href: '/a-propos', label: 'À propos' },
] as const;
