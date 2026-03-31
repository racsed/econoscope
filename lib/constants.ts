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
  intermediate: 'Intermediaire',
  advanced: 'Avance',
} as const;

export type ThemeType = keyof typeof THEME_COLORS;
export type LevelType = keyof typeof LEVEL_LABELS;

export const NAV_LINKS = [
  { href: '/explorer', label: 'Explorer' },
  { href: '/scenarios', label: 'Scenarios' },
  { href: '/glossaire', label: 'Glossaire' },
  { href: '/a-propos', label: 'A propos' },
] as const;
