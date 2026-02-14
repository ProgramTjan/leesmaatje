'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import { getThemesForAgeGroup, type ColorTheme } from '@/data/themes';

export default function SettingsToggle() {
  const { dyslexicFont, toggleDyslexicFont, soundEnabled, toggleSound, profiles, activeProfileId, setColorTheme } = useGameStore();
  const [showThemePicker, setShowThemePicker] = useState(false);

  const activeProfile = profiles.find((p) => p.id === activeProfileId);
  const ageGroup = activeProfile?.ageGroup ?? 'groep3-5';
  const currentThemeId = activeProfile?.colorTheme ?? '';
  const themes = getThemesForAgeGroup(ageGroup);
  const isSenior = ageGroup === 'groep6-8';

  const handleThemeChange = (theme: ColorTheme) => {
    setColorTheme(theme.id);
    setShowThemePicker(false);
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Theme picker button */}
      <motion.button
        onClick={() => setShowThemePicker(!showThemePicker)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-md font-bold text-sm transition-colors ${
          showThemePicker
            ? 'bg-primary text-white'
            : isSenior
              ? 'bg-card-bg text-foreground'
              : 'bg-white/80 text-foreground'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Kleurthema"
      >
        🎨
      </motion.button>

      {/* Dyslexic font toggle */}
      <motion.button
        onClick={toggleDyslexicFont}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-md font-bold text-sm transition-colors ${
          dyslexicFont
            ? 'bg-primary text-white'
            : isSenior
              ? 'bg-card-bg text-foreground'
              : 'bg-white/80 text-foreground'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Dyslexie lettertype"
      >
        Aa
      </motion.button>

      {/* Sound toggle */}
      <motion.button
        onClick={toggleSound}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-md text-xl transition-colors ${
          isSenior
            ? soundEnabled ? 'bg-card-bg' : 'bg-card-bg opacity-50'
            : soundEnabled ? 'bg-white/80' : 'bg-gray-300'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={soundEnabled ? 'Geluid uit' : 'Geluid aan'}
      >
        {soundEnabled ? '🔊' : '🔇'}
      </motion.button>

      {/* Theme picker dropdown */}
      <AnimatePresence>
        {showThemePicker && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowThemePicker(false)}
            />

            <motion.div
              className={`absolute right-0 top-12 z-50 rounded-2xl shadow-2xl p-3 w-56 ${
                isSenior ? 'bg-[#1e1f33] border border-[#2d2e4a]' : 'bg-white border border-gray-100'
              }`}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <p className={`text-xs font-bold mb-2 px-1 ${isSenior ? 'text-gray-400' : 'text-gray-500'}`}>
                Kleurthema
              </p>
              <div className="flex flex-col gap-1.5">
                {themes.map((theme) => {
                  const isActive = theme.id === currentThemeId;
                  return (
                    <motion.button
                      key={theme.id}
                      onClick={() => handleThemeChange(theme)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                        isActive
                          ? 'ring-2 ring-primary shadow-md'
                          : isSenior
                            ? 'hover:bg-[#252640]'
                            : 'hover:bg-gray-50'
                      }`}
                      whileTap={{ scale: 0.97 }}
                    >
                      {/* Color preview swatch */}
                      <div className="flex gap-0.5 flex-shrink-0">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.vars.primary }} />
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.vars.secondary }} />
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.vars.background, border: '1px solid rgba(128,128,128,0.2)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-bold truncate ${isSenior ? 'text-[#e8e6f0]' : 'text-[#2d2a26]'}`}>
                          {theme.emoji} {theme.name}
                        </div>
                      </div>
                      {isActive && (
                        <span className="text-primary text-sm">✓</span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
