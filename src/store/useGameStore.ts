import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { checkBadgeUnlocks, type Badge } from '@/data/badges';

/* ─── Data types ─── */

export type AgeGroup = 'groep3-5' | 'groep6-8';

export interface LevelStats {
  correct: number;
  total: number;
}

export interface ExerciseProgress {
  completed: number;
  correct: number;
  total: number;
  lastPlayed: string | null;
  /** Rolling window of recent answers per level (for adaptive difficulty) */
  recentByLevel: Record<number, LevelStats>;
}

const emptyProgress = (): ExerciseProgress => ({
  completed: 0,
  correct: 0,
  total: 0,
  lastPlayed: null,
  recentByLevel: {},
});

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  ageGroup: AgeGroup;
  colorTheme: string; // theme id from themes.ts
  createdAt: string;
}

/** All per-profile game data (what gets saved / swapped on switch) */
export interface ProfileData {
  stars: number;
  currentStreak: number;
  bestStreak: number;
  lettersProgress: ExerciseProgress;
  lettergrepenProgress: ExerciseProgress;
  woordenProgress: ExerciseProgress;
  zinnenProgress: ExerciseProgress;
  flitslezenProgress: ExerciseProgress;
  spellingregelsProgress: ExerciseProgress;
  woorddelenProgress: ExerciseProgress;
  perfectRounds: number;
  unlockedBadges: string[];
  dyslexicFont: boolean;
  soundEnabled: boolean;
  level: number;
  xp: number;
  xpToNextLevel: number;
}

const defaultProfileData = (): ProfileData => ({
  stars: 0,
  currentStreak: 0,
  bestStreak: 0,
  lettersProgress: emptyProgress(),
  lettergrepenProgress: emptyProgress(),
  woordenProgress: emptyProgress(),
  zinnenProgress: emptyProgress(),
  flitslezenProgress: emptyProgress(),
  spellingregelsProgress: emptyProgress(),
  woorddelenProgress: emptyProgress(),
  perfectRounds: 0,
  unlockedBadges: [],
  dyslexicFont: false,
  soundEnabled: true,
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
});

/* ─── Helpers ─── */

function extractProfileData(state: GameState): ProfileData {
  return {
    stars: state.stars,
    currentStreak: state.currentStreak,
    bestStreak: state.bestStreak,
    lettersProgress: state.lettersProgress,
    lettergrepenProgress: state.lettergrepenProgress,
    woordenProgress: state.woordenProgress,
    zinnenProgress: state.zinnenProgress,
    flitslezenProgress: state.flitslezenProgress,
    spellingregelsProgress: state.spellingregelsProgress,
    woorddelenProgress: state.woorddelenProgress,
    perfectRounds: state.perfectRounds,
    unlockedBadges: state.unlockedBadges,
    dyslexicFont: state.dyslexicFont,
    soundEnabled: state.soundEnabled,
    level: state.level,
    xp: state.xp,
    xpToNextLevel: state.xpToNextLevel,
  };
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

const XP_PER_LEVEL = 100;

/* ─── Store interface ─── */

type ProgressKey =
  | 'lettersProgress'
  | 'lettergrepenProgress'
  | 'woordenProgress'
  | 'zinnenProgress'
  | 'flitslezenProgress'
  | 'spellingregelsProgress'
  | 'woorddelenProgress';

interface GameState extends ProfileData {
  // ── Profile management ──
  profiles: Profile[];
  activeProfileId: string | null;
  playerName: string;
  _savedProfiles: Record<string, ProfileData>;

  // ── Parent dashboard ──
  parentPin: string | null;
  setParentPin: (pin: string) => void;
  getProfileData: (profileId: string) => ProfileData;

  createProfile: (name: string, avatar: string, ageGroup: AgeGroup, colorTheme?: string) => void;
  selectProfile: (id: string) => void;
  logout: () => void;
  deleteProfile: (id: string) => void;
  setColorTheme: (themeId: string) => void;
  getActiveAgeGroup: () => AgeGroup;

  // ── Game actions ──
  addStars: (amount: number) => void;

  incrementStreak: () => void;
  resetStreak: () => void;

  updateLettersProgress: (correct: boolean, level?: number) => void;
  updateLettergrepenProgress: (correct: boolean, level?: number) => void;
  updateWoordenProgress: (correct: boolean, level?: number) => void;
  updateZinnenProgress: (correct: boolean, level?: number) => void;
  updateFlitslezenProgress: (correct: boolean, level?: number) => void;
  updateSpellingregelsProgress: (correct: boolean, level?: number) => void;
  updateWoorddelenProgress: (correct: boolean, level?: number) => void;

  addPerfectRound: () => void;

  newBadgeQueue: Badge[];
  checkAndUnlockBadges: () => void;
  dismissBadge: () => void;

  toggleDyslexicFont: () => void;
  toggleSound: () => void;

  addXP: (amount: number) => void;

  getTotalExercises: () => number;
  getTotalCorrect: () => number;

  resetProgress: () => void;
}

/* ─── Progress updater helper ─── */

const RECENT_WINDOW = 20; // keep last 20 answers per level

function makeProgressUpdater(progressKey: ProgressKey) {
  return (correct: boolean, level?: number) =>
    (state: GameState) => {
      const prev = state[progressKey];
      const recentByLevel = { ...prev.recentByLevel };

      // Track per-level stats if level is provided
      if (level !== undefined) {
        const existing = recentByLevel[level] ?? { correct: 0, total: 0 };
        const newTotal = existing.total + 1;
        const newCorrect = existing.correct + (correct ? 1 : 0);

        // If we exceed the window, scale down proportionally to keep the ratio meaningful
        if (newTotal > RECENT_WINDOW) {
          const scale = RECENT_WINDOW / newTotal;
          recentByLevel[level] = {
            correct: Math.round(newCorrect * scale),
            total: RECENT_WINDOW,
          };
        } else {
          recentByLevel[level] = { correct: newCorrect, total: newTotal };
        }
      }

      return {
        [progressKey]: {
          ...prev,
          completed: prev.completed + 1,
          correct: prev.correct + (correct ? 1 : 0),
          total: prev.total + 1,
          lastPlayed: new Date().toISOString(),
          recentByLevel,
        },
      };
    };
}

/* ─── Store ─── */

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // ── Profile management ──
      profiles: [],
      activeProfileId: null,
      playerName: '',
      _savedProfiles: {},

      // ── Parent dashboard ──
      parentPin: null,
      setParentPin: (pin) => set({ parentPin: pin }),
      getProfileData: (profileId) => {
        const state = get();
        // If it's the active profile, return current state
        if (state.activeProfileId === profileId) {
          return extractProfileData(state);
        }
        // Otherwise return saved data
        return state._savedProfiles[profileId] || defaultProfileData();
      },

      createProfile: (name, avatar, ageGroup, colorTheme) => {
        const state = get();
        const id = generateId();
        const defaultTheme = ageGroup === 'groep3-5' ? 'junior-warm' : 'senior-midnight';
        const newProfile: Profile = {
          id,
          name,
          avatar,
          ageGroup,
          colorTheme: colorTheme || defaultTheme,
          createdAt: new Date().toISOString(),
        };

        const updatedSaved = { ...state._savedProfiles };
        if (state.activeProfileId) {
          updatedSaved[state.activeProfileId] = extractProfileData(state);
        }

        const fresh = defaultProfileData();
        updatedSaved[id] = fresh;

        set({
          profiles: [...state.profiles, newProfile],
          activeProfileId: id,
          playerName: name,
          _savedProfiles: updatedSaved,
          ...fresh,
          newBadgeQueue: [],
        });
      },

      selectProfile: (id) => {
        const state = get();
        const profile = state.profiles.find((p) => p.id === id);
        if (!profile) return;

        const updatedSaved = { ...state._savedProfiles };
        if (state.activeProfileId) {
          updatedSaved[state.activeProfileId] = extractProfileData(state);
        }

        const data = updatedSaved[id] || defaultProfileData();

        set({
          activeProfileId: id,
          playerName: profile.name,
          _savedProfiles: updatedSaved,
          ...data,
          newBadgeQueue: [],
        });
      },

      logout: () => {
        const state = get();
        const updatedSaved = { ...state._savedProfiles };
        if (state.activeProfileId) {
          updatedSaved[state.activeProfileId] = extractProfileData(state);
        }
        set({
          activeProfileId: null,
          playerName: '',
          _savedProfiles: updatedSaved,
          newBadgeQueue: [],
        });
      },

      deleteProfile: (id) => {
        const state = get();
        const updatedSaved = { ...state._savedProfiles };
        delete updatedSaved[id];
        const updatedProfiles = state.profiles.filter((p) => p.id !== id);

        if (state.activeProfileId === id) {
          set({
            profiles: updatedProfiles,
            activeProfileId: null,
            playerName: '',
            _savedProfiles: updatedSaved,
            ...defaultProfileData(),
            newBadgeQueue: [],
          });
        } else {
          set({ profiles: updatedProfiles, _savedProfiles: updatedSaved });
        }
      },

      setColorTheme: (themeId) => {
        const state = get();
        if (!state.activeProfileId) return;
        set({
          profiles: state.profiles.map((p) =>
            p.id === state.activeProfileId ? { ...p, colorTheme: themeId } : p
          ),
        });
      },

      getActiveAgeGroup: () => {
        const s = get();
        const profile = s.profiles.find((p) => p.id === s.activeProfileId);
        return profile?.ageGroup ?? 'groep3-5';
      },

      // ── Game data ──
      ...defaultProfileData(),

      addStars: (amount) => set((s) => ({ stars: s.stars + amount })),

      incrementStreak: () =>
        set((s) => ({
          currentStreak: s.currentStreak + 1,
          bestStreak: Math.max(s.bestStreak, s.currentStreak + 1),
        })),
      resetStreak: () => set({ currentStreak: 0 }),

      updateLettersProgress: (c, lvl) => set(makeProgressUpdater('lettersProgress')(c, lvl)),
      updateLettergrepenProgress: (c, lvl) => set(makeProgressUpdater('lettergrepenProgress')(c, lvl)),
      updateWoordenProgress: (c, lvl) => set(makeProgressUpdater('woordenProgress')(c, lvl)),
      updateZinnenProgress: (c, lvl) => set(makeProgressUpdater('zinnenProgress')(c, lvl)),
      updateFlitslezenProgress: (c, lvl) => set(makeProgressUpdater('flitslezenProgress')(c, lvl)),
      updateSpellingregelsProgress: (c, lvl) => set(makeProgressUpdater('spellingregelsProgress')(c, lvl)),
      updateWoorddelenProgress: (c, lvl) => set(makeProgressUpdater('woorddelenProgress')(c, lvl)),

      addPerfectRound: () => set((s) => ({ perfectRounds: s.perfectRounds + 1 })),

      // Badges
      newBadgeQueue: [],
      checkAndUnlockBadges: () => {
        const state = get();
        const totalExercises = state.getTotalExercises();
        const totalCorrect = state.getTotalCorrect();
        const newBadges = checkBadgeUnlocks({
          totalExercises,
          totalCorrect,
          bestStreak: state.bestStreak,
          stars: state.stars,
          level: state.level,
          perfectRounds: state.perfectRounds,
          unlockedBadges: state.unlockedBadges,
        });
        if (newBadges.length > 0) {
          set({
            unlockedBadges: [...state.unlockedBadges, ...newBadges.map((b) => b.id)],
            newBadgeQueue: [...state.newBadgeQueue, ...newBadges],
          });
        }
      },
      dismissBadge: () => set((s) => ({ newBadgeQueue: s.newBadgeQueue.slice(1) })),

      // Settings
      toggleDyslexicFont: () => set((s) => ({ dyslexicFont: !s.dyslexicFont })),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

      // Level
      addXP: (amount) =>
        set((s) => {
          let newXP = s.xp + amount;
          let newLevel = s.level;
          let newXPToNext = s.xpToNextLevel;
          while (newXP >= newXPToNext) {
            newXP -= newXPToNext;
            newLevel++;
            newXPToNext = newLevel * XP_PER_LEVEL;
          }
          return { xp: newXP, level: newLevel, xpToNextLevel: newXPToNext };
        }),

      // Helpers
      getTotalExercises: () => {
        const s = get();
        return (
          s.lettersProgress.total + s.lettergrepenProgress.total +
          s.woordenProgress.total + s.zinnenProgress.total +
          s.flitslezenProgress.total + s.spellingregelsProgress.total +
          s.woorddelenProgress.total
        );
      },
      getTotalCorrect: () => {
        const s = get();
        return (
          s.lettersProgress.correct + s.lettergrepenProgress.correct +
          s.woordenProgress.correct + s.zinnenProgress.correct +
          s.flitslezenProgress.correct + s.spellingregelsProgress.correct +
          s.woorddelenProgress.correct
        );
      },

      resetProgress: () => set({ ...defaultProfileData(), newBadgeQueue: [] }),
    }),
    {
      name: 'leesmaatje-storage',
      version: 4,
      partialize: (state) => {
        const savedProfiles = { ...state._savedProfiles };
        if (state.activeProfileId) {
          savedProfiles[state.activeProfileId] = extractProfileData(state);
        }
        return {
          profiles: state.profiles,
          activeProfileId: state.activeProfileId,
          playerName: state.playerName,
          parentPin: state.parentPin,
          _savedProfiles: savedProfiles,
          stars: state.stars,
          currentStreak: state.currentStreak,
          bestStreak: state.bestStreak,
          lettersProgress: state.lettersProgress,
          lettergrepenProgress: state.lettergrepenProgress,
          woordenProgress: state.woordenProgress,
          zinnenProgress: state.zinnenProgress,
          flitslezenProgress: state.flitslezenProgress,
          spellingregelsProgress: state.spellingregelsProgress,
          woorddelenProgress: state.woorddelenProgress,
          perfectRounds: state.perfectRounds,
          unlockedBadges: state.unlockedBadges,
          dyslexicFont: state.dyslexicFont,
          soundEnabled: state.soundEnabled,
          level: state.level,
          xp: state.xp,
          xpToNextLevel: state.xpToNextLevel,
        };
      },
      migrate: (persisted: unknown, version: number) => {
        const old = persisted as Record<string, unknown>;

        if (version < 2) {
          // v1 -> v2: single-player to multi-profile
          if (old.playerName && typeof old.playerName === 'string' && old.playerName.trim()) {
            const id = generateId();
            const profile: Profile = { id, name: old.playerName as string, avatar: '🦉', ageGroup: 'groep3-5', colorTheme: 'junior-warm', createdAt: new Date().toISOString() };
            const pd: ProfileData = {
              stars: (old.stars as number) || 0, currentStreak: (old.currentStreak as number) || 0, bestStreak: (old.bestStreak as number) || 0,
              lettersProgress: (old.lettersProgress as ExerciseProgress) || emptyProgress(), lettergrepenProgress: (old.lettergrepenProgress as ExerciseProgress) || emptyProgress(),
              woordenProgress: (old.woordenProgress as ExerciseProgress) || emptyProgress(), zinnenProgress: (old.zinnenProgress as ExerciseProgress) || emptyProgress(),
              flitslezenProgress: emptyProgress(), spellingregelsProgress: emptyProgress(), woorddelenProgress: emptyProgress(),
              perfectRounds: (old.perfectRounds as number) || 0, unlockedBadges: (old.unlockedBadges as string[]) || [],
              dyslexicFont: (old.dyslexicFont as boolean) || false, soundEnabled: old.soundEnabled !== undefined ? (old.soundEnabled as boolean) : true,
              level: (old.level as number) || 1, xp: (old.xp as number) || 0, xpToNextLevel: (old.xpToNextLevel as number) || 100,
            };
            return { ...old, profiles: [profile], activeProfileId: id, _savedProfiles: { [id]: pd }, ...pd };
          }
          return { ...old, profiles: [], activeProfileId: null, _savedProfiles: {} };
        }

        if (version < 3) {
          // v2 -> v3: add ageGroup to profiles + new progress fields
          const profiles = (old.profiles as Profile[]) || [];
          const migratedProfiles = profiles.map((p) => ({
            ...p,
            ageGroup: p.ageGroup || ('groep3-5' as AgeGroup),
            colorTheme: p.colorTheme || (p.ageGroup === 'groep6-8' ? 'senior-midnight' : 'junior-warm'),
          }));
          const saved = (old._savedProfiles as Record<string, ProfileData>) || {};
          const migratedSaved: Record<string, ProfileData> = {};
          for (const [id, pd] of Object.entries(saved)) {
            migratedSaved[id] = {
              ...pd,
              flitslezenProgress: pd.flitslezenProgress || emptyProgress(),
              spellingregelsProgress: pd.spellingregelsProgress || emptyProgress(),
              woorddelenProgress: pd.woorddelenProgress || emptyProgress(),
            };
          }
          return {
            ...old,
            profiles: migratedProfiles,
            _savedProfiles: migratedSaved,
            flitslezenProgress: (old.flitslezenProgress as ExerciseProgress) || emptyProgress(),
            spellingregelsProgress: (old.spellingregelsProgress as ExerciseProgress) || emptyProgress(),
            woorddelenProgress: (old.woorddelenProgress as ExerciseProgress) || emptyProgress(),
          };
        }

        if (version < 4) {
          // v3 -> v4: add recentByLevel to all ExerciseProgress fields
          const progressFields: ProgressKey[] = [
            'lettersProgress', 'lettergrepenProgress', 'woordenProgress',
            'zinnenProgress', 'flitslezenProgress', 'spellingregelsProgress', 'woorddelenProgress',
          ];
          for (const key of progressFields) {
            const p = old[key] as ExerciseProgress | undefined;
            if (p && !p.recentByLevel) {
              (old[key] as ExerciseProgress).recentByLevel = {};
            }
          }
          const saved = (old._savedProfiles as Record<string, ProfileData>) || {};
          for (const pd of Object.values(saved)) {
            for (const key of progressFields) {
              const p = pd[key] as ExerciseProgress | undefined;
              if (p && !p.recentByLevel) {
                p.recentByLevel = {};
              }
            }
          }
          return old;
        }

        return persisted;
      },
    }
  )
);
