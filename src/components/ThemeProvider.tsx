'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { getThemeById, getDefaultThemeId } from '@/data/themes';

/**
 * Applies color theme CSS variables to <body> based on the active profile's
 * chosen color theme. Also manages the dyslexic-font class.
 */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const activeProfile = useGameStore((s) =>
    s.profiles.find((p) => p.id === s.activeProfileId) ?? null
  );
  const dyslexicFont = useGameStore((s) => s.dyslexicFont);

  useEffect(() => {
    const body = document.body;
    const ageGroup = activeProfile?.ageGroup ?? 'groep3-5';
    const themeId = activeProfile?.colorTheme ?? getDefaultThemeId(ageGroup);
    const theme = getThemeById(themeId);

    if (!theme) return;

    // Set CSS variables
    body.style.setProperty('--background', theme.vars.background);
    body.style.setProperty('--foreground', theme.vars.foreground);
    body.style.setProperty('--primary', theme.vars.primary);
    body.style.setProperty('--primary-light', theme.vars.primaryLight);
    body.style.setProperty('--secondary', theme.vars.secondary);
    body.style.setProperty('--accent-green', theme.vars.accentGreen);
    body.style.setProperty('--accent-yellow', theme.vars.accentYellow);
    body.style.setProperty('--accent-orange', theme.vars.accentOrange);
    body.style.setProperty('--accent-blue', theme.vars.accentBlue);
    body.style.setProperty('--accent-purple', theme.vars.accentPurple);
    body.style.setProperty('--card-bg', theme.vars.cardBg);
    body.style.setProperty('--card-shadow', theme.vars.cardShadow);
    body.style.fontFamily = theme.font;

    // Apply dark/light mode class for component overrides
    body.classList.remove('theme-junior', 'theme-senior');
    if (ageGroup === 'groep6-8') {
      body.classList.add('theme-senior');
    } else {
      body.classList.add('theme-junior');
    }
  }, [activeProfile?.ageGroup, activeProfile?.colorTheme]);

  useEffect(() => {
    if (dyslexicFont) {
      document.body.classList.add('dyslexic-font');
    } else {
      document.body.classList.remove('dyslexic-font');
    }
  }, [dyslexicFont]);

  return <>{children}</>;
}
