/**
 * Color theme definitions.
 *
 * 4 themes per age group. Each theme sets all CSS variables.
 * The CSS class applied to <body> is `theme-{id}`.
 */

import type { AgeGroup } from '@/store/useGameStore';

export interface ColorTheme {
  id: string;
  name: string;
  emoji: string;
  ageGroup: AgeGroup;
  /** Font stack (overrides body font-family) */
  font: string;
  vars: {
    background: string;
    foreground: string;
    primary: string;
    primaryLight: string;
    secondary: string;
    accentGreen: string;
    accentYellow: string;
    accentOrange: string;
    accentBlue: string;
    accentPurple: string;
    cardBg: string;
    cardShadow: string;
  };
}

export const colorThemes: ColorTheme[] = [
  // ════════════════════════════════════════
  //  JUNIOR THEMES  (Groep 3-5)
  // ════════════════════════════════════════

  {
    id: 'junior-warm',
    name: 'Zonneschijn',
    emoji: '☀️',
    ageGroup: 'groep3-5',
    font: "'Comic Neue', cursive, Arial, sans-serif",
    vars: {
      background: '#fef9f0',
      foreground: '#2d2a26',
      primary: '#6c63ff',
      primaryLight: '#a5a0ff',
      secondary: '#ff6b9d',
      accentGreen: '#4ecdc4',
      accentYellow: '#ffe66d',
      accentOrange: '#ff8a5c',
      accentBlue: '#45b7d1',
      accentPurple: '#a06cd5',
      cardBg: '#ffffff',
      cardShadow: 'rgba(108, 99, 255, 0.1)',
    },
  },
  {
    id: 'junior-ocean',
    name: 'Oceaan',
    emoji: '🌊',
    ageGroup: 'groep3-5',
    font: "'Comic Neue', cursive, Arial, sans-serif",
    vars: {
      background: '#f0f7ff',
      foreground: '#1e2a3a',
      primary: '#3b82f6',
      primaryLight: '#93c5fd',
      secondary: '#f472b6',
      accentGreen: '#34d399',
      accentYellow: '#fde68a',
      accentOrange: '#fb923c',
      accentBlue: '#38bdf8',
      accentPurple: '#a78bfa',
      cardBg: '#ffffff',
      cardShadow: 'rgba(59, 130, 246, 0.1)',
    },
  },
  {
    id: 'junior-forest',
    name: 'Bos',
    emoji: '🌿',
    ageGroup: 'groep3-5',
    font: "'Comic Neue', cursive, Arial, sans-serif",
    vars: {
      background: '#f0faf4',
      foreground: '#1a2e1a',
      primary: '#16a34a',
      primaryLight: '#86efac',
      secondary: '#f97316',
      accentGreen: '#22c55e',
      accentYellow: '#facc15',
      accentOrange: '#fb923c',
      accentBlue: '#06b6d4',
      accentPurple: '#a855f7',
      cardBg: '#ffffff',
      cardShadow: 'rgba(22, 163, 74, 0.1)',
    },
  },
  {
    id: 'junior-candy',
    name: 'Snoepjes',
    emoji: '🍭',
    ageGroup: 'groep3-5',
    font: "'Comic Neue', cursive, Arial, sans-serif",
    vars: {
      background: '#fdf2f8',
      foreground: '#2d1a2e',
      primary: '#ec4899',
      primaryLight: '#f9a8d4',
      secondary: '#8b5cf6',
      accentGreen: '#34d399',
      accentYellow: '#fbbf24',
      accentOrange: '#f97316',
      accentBlue: '#38bdf8',
      accentPurple: '#a855f7',
      cardBg: '#ffffff',
      cardShadow: 'rgba(236, 72, 153, 0.1)',
    },
  },

  // ════════════════════════════════════════
  //  SENIOR THEMES  (Groep 6-8)
  // ════════════════════════════════════════

  {
    id: 'senior-midnight',
    name: 'Midnight',
    emoji: '🌙',
    ageGroup: 'groep6-8',
    font: "'Inter', system-ui, sans-serif",
    vars: {
      background: '#13141f',
      foreground: '#e8e6f0',
      primary: '#7c6aff',
      primaryLight: '#a899ff',
      secondary: '#ff5c8a',
      accentGreen: '#34d399',
      accentYellow: '#fbbf24',
      accentOrange: '#fb923c',
      accentBlue: '#38bdf8',
      accentPurple: '#c084fc',
      cardBg: '#1e1f33',
      cardShadow: 'rgba(124, 106, 255, 0.15)',
    },
  },
  {
    id: 'senior-neon',
    name: 'Neon',
    emoji: '💜',
    ageGroup: 'groep6-8',
    font: "'Inter', system-ui, sans-serif",
    vars: {
      background: '#0f0f1a',
      foreground: '#f0eef8',
      primary: '#a855f7',
      primaryLight: '#c084fc',
      secondary: '#f43f5e',
      accentGreen: '#22d3ee',
      accentYellow: '#eab308',
      accentOrange: '#f97316',
      accentBlue: '#6366f1',
      accentPurple: '#d946ef',
      cardBg: '#1a1a2e',
      cardShadow: 'rgba(168, 85, 247, 0.15)',
    },
  },
  {
    id: 'senior-slate',
    name: 'Slate',
    emoji: '🪨',
    ageGroup: 'groep6-8',
    font: "'Inter', system-ui, sans-serif",
    vars: {
      background: '#0f172a',
      foreground: '#e2e8f0',
      primary: '#3b82f6',
      primaryLight: '#60a5fa',
      secondary: '#f472b6',
      accentGreen: '#34d399',
      accentYellow: '#fbbf24',
      accentOrange: '#fb923c',
      accentBlue: '#38bdf8',
      accentPurple: '#a78bfa',
      cardBg: '#1e293b',
      cardShadow: 'rgba(59, 130, 246, 0.12)',
    },
  },
  {
    id: 'senior-emerald',
    name: 'Emerald',
    emoji: '💚',
    ageGroup: 'groep6-8',
    font: "'Inter', system-ui, sans-serif",
    vars: {
      background: '#0a1a14',
      foreground: '#e0f2eb',
      primary: '#10b981',
      primaryLight: '#6ee7b7',
      secondary: '#f59e0b',
      accentGreen: '#34d399',
      accentYellow: '#fbbf24',
      accentOrange: '#fb923c',
      accentBlue: '#22d3ee',
      accentPurple: '#a78bfa',
      cardBg: '#132a1f',
      cardShadow: 'rgba(16, 185, 129, 0.12)',
    },
  },
];

export function getThemesForAgeGroup(ageGroup: AgeGroup): ColorTheme[] {
  return colorThemes.filter((t) => t.ageGroup === ageGroup);
}

export function getThemeById(id: string): ColorTheme | undefined {
  return colorThemes.find((t) => t.id === id);
}

export function getDefaultThemeId(ageGroup: AgeGroup): string {
  return ageGroup === 'groep3-5' ? 'junior-warm' : 'senior-midnight';
}
