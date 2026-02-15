'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useGameStore, type ExerciseProgress, type AgeGroup } from '@/store/useGameStore';
import ScoreBoard from '@/components/ScoreBoard';
import SettingsToggle from '@/components/SettingsToggle';
import Mascot from '@/components/Mascot';
import BadgeCollection from '@/components/BadgeCollection';
import BadgeNotification from '@/components/BadgeNotification';
import ProfileSelector from '@/components/ProfileSelector';
import { useEffect, useState } from 'react';

/* ─── Exercise definitions per age group ─── */

interface ExerciseDef {
  title: string;
  description: string;
  emoji: string;
  href: string;
  color: string;
  progressKey: keyof Pick<
    ReturnType<typeof useGameStore.getState>,
    'lettersProgress' | 'lettergrepenProgress' | 'woordenProgress' | 'zinnenProgress' | 'flitslezenProgress' | 'spellingregelsProgress' | 'woorddelenProgress'
  >;
  ageGroups: AgeGroup[];
}

const allExercises: ExerciseDef[] = [
  // ── Junior only ──
  {
    title: 'Letters & Klanken',
    description: 'Leer letters herkennen en hun klanken',
    emoji: '🔤',
    href: '/oefenen/letters',
    color: 'from-[#6c63ff] to-[#a06cd5]',
    progressKey: 'lettersProgress',
    ageGroups: ['groep3-5'],
  },
  {
    title: 'Lettergrepen',
    description: 'Splits woorden op in lettergrepen',
    emoji: '✂️',
    href: '/oefenen/lettergrepen',
    color: 'from-[#ff6b9d] to-[#ff8a5c]',
    progressKey: 'lettergrepenProgress',
    ageGroups: ['groep3-5'],
  },

  // ── Both age groups ──
  {
    title: 'Woorden Bouwen',
    description: 'Bouw woorden van losse letters',
    emoji: '🧩',
    href: '/oefenen/woorden',
    color: 'from-[#4ecdc4] to-[#45b7d1]',
    progressKey: 'woordenProgress',
    ageGroups: ['groep3-5', 'groep6-8'],
  },
  {
    title: 'Zinnen Bouwen',
    description: 'Zet woorden in de goede volgorde',
    emoji: '📝',
    href: '/oefenen/zinnen',
    color: 'from-[#ff8a5c] to-[#ffe66d]',
    progressKey: 'zinnenProgress',
    ageGroups: ['groep3-5', 'groep6-8'],
  },

  // ── Senior only ──
  {
    title: 'Flitslezen',
    description: 'Herken woorden op snelheid',
    emoji: '⚡',
    href: '/oefenen/flitslezen',
    color: 'from-[#7c6aff] to-[#38bdf8]',
    progressKey: 'flitslezenProgress',
    ageGroups: ['groep6-8'],
  },
  {
    title: 'Spellingregels',
    description: 'd/t, ei/ij en meer',
    emoji: '📋',
    href: '/oefenen/spellingregels',
    color: 'from-[#a06cd5] to-[#c084fc]',
    progressKey: 'spellingregelsProgress',
    ageGroups: ['groep6-8'],
  },
  {
    title: 'Woorddelen',
    description: 'Splits woorden in voor-/achtervoegsel',
    emoji: '🔍',
    href: '/oefenen/woorddelen',
    color: 'from-[#34d399] to-[#38bdf8]',
    progressKey: 'woorddelenProgress',
    ageGroups: ['groep6-8'],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { y: 30, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function Home() {
  const store = useGameStore();
  const { playerName, activeProfileId, profiles, logout } = store;
  const activeProfile = profiles.find((p) => p.id === activeProfileId);
  const ageGroup: AgeGroup = activeProfile?.ageGroup ?? 'groep3-5';
  const isSenior = ageGroup === 'groep6-8';

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);

  const getAccuracy = (progress: ExerciseProgress) => {
    if (progress.total === 0) return null;
    return Math.round((progress.correct / progress.total) * 100);
  };

  // Loading
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div className="text-6xl" animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          📖
        </motion.div>
      </div>
    );
  }

  // Not logged in
  if (!activeProfileId) return <ProfileSelector />;

  // Filter exercises for current age group
  const exercises = allExercises.filter((e) => e.ageGroups.includes(ageGroup));

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-2xl mx-auto pb-12">
      <BadgeNotification />

      {/* Header */}
      <motion.header
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center gap-3">
          {activeProfile && (
            <div className={`w-12 h-12 rounded-xl shadow-md flex items-center justify-center text-2xl flex-shrink-0 ${isSenior ? 'bg-card-bg' : 'bg-white'}`}>
              {activeProfile.avatar}
            </div>
          )}
          <div>
            <h1 className={`font-bold text-foreground ${isSenior ? 'text-2xl' : 'text-2xl sm:text-3xl'}`}>
              {isSenior ? (
                <>Hey <span className="text-primary">{playerName}</span></>
              ) : (
                <>Hoi <span className="text-primary">{playerName}</span>! 👋</>
              )}
            </h1>
            <p className={`text-gray-500 mt-0.5 ${isSenior ? 'text-sm' : 'text-base'}`}>
              {isSenior ? 'Wat ga je oefenen?' : 'Wat wil je vandaag oefenen?'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SettingsToggle />
          <motion.button
            onClick={logout}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-md text-sm font-bold transition-colors ${
              isSenior
                ? 'bg-card-bg text-gray-400 hover:text-foreground hover:bg-[#252640]'
                : 'bg-white/80 text-gray-500 hover:text-foreground hover:bg-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Wissel van profiel"
          >
            <span className="text-lg">👤</span>
            <span className="hidden sm:inline">Wissel</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Score board */}
      <div className="mb-6"><ScoreBoard /></div>

      {/* Exercise cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {exercises.map((exercise) => {
          const progress = store[exercise.progressKey];
          const accuracy = getAccuracy(progress);

          return (
            <motion.div key={exercise.href} variants={item}>
              <Link href={exercise.href}>
                <motion.div
                  className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${exercise.color} p-5 sm:p-6 text-white shadow-xl cursor-pointer h-full`}
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {!isSenior && (
                    <span className="text-3xl sm:text-4xl mb-2 block">{exercise.emoji}</span>
                  )}
                  <h2 className={`font-bold mb-1 ${isSenior ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'}`}>
                    {isSenior && <span className="mr-2">{exercise.emoji}</span>}
                    {exercise.title}
                  </h2>
                  <p className={`text-white/75 ${isSenior ? 'text-sm' : 'text-sm sm:text-base'}`}>
                    {exercise.description}
                  </p>

                  {progress.total > 0 && (
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <div className="bg-white/20 rounded-full px-2 py-0.5 text-xs font-bold">
                        {progress.total}x gespeeld
                      </div>
                      {accuracy !== null && (
                        <div className="bg-white/20 rounded-full px-2 py-0.5 text-xs font-bold">
                          {accuracy}% goed
                        </div>
                      )}
                    </div>
                  )}

                  {!isSenior && (
                    <motion.div
                      className="absolute right-2 bottom-2 text-4xl opacity-20"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      {exercise.emoji}
                    </motion.div>
                  )}

                  <div className={`mt-3 flex items-center gap-1 text-white/90 font-bold ${isSenior ? 'text-sm' : 'text-sm'}`}>
                    <span>{isSenior ? 'Start' : 'Spelen'}</span>
                    <span className="text-lg">→</span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Badges */}
      <motion.div className="mb-8" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
        <BadgeCollection />
      </motion.div>

      {/* Mascot — different mood per age group */}
      <motion.div className="flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <Mascot mood={isSenior ? 'thinking' : 'happy'} size={isSenior ? 'md' : 'lg'} />
      </motion.div>

      {/* Parent dashboard link */}
      <motion.div className="flex justify-center mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        <Link href="/ouders">
          <motion.div
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isSenior
                ? 'text-gray-500 hover:text-gray-300 hover:bg-[#1e1e3a]'
                : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>📊</span>
            <span>Ouder-dashboard</span>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}
