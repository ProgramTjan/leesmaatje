'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';

export default function ScoreBoard() {
  const { stars, level, xp, xpToNextLevel, currentStreak } = useGameStore();

  return (
    <motion.div
      className="flex flex-wrap items-center gap-3 sm:gap-4"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      {/* Stars */}
      <div className="flex items-center gap-1 bg-white/80 rounded-full px-3 py-1.5 shadow-md">
        <span className="text-xl">⭐</span>
        <span className="font-bold text-lg">{stars}</span>
      </div>

      {/* Level */}
      <div className="flex items-center gap-1 bg-white/80 rounded-full px-3 py-1.5 shadow-md">
        <span className="text-xl">🏆</span>
        <span className="font-bold text-lg">Level {level}</span>
        <div className="w-12 h-2 bg-gray-200 rounded-full ml-1 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(xp / xpToNextLevel) * 100}%` }}
          />
        </div>
      </div>

      {/* Streak */}
      {currentStreak > 0 && (
        <motion.div
          className="flex items-center gap-1 bg-white/80 rounded-full px-3 py-1.5 shadow-md"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
        >
          <span className="text-xl">🔥</span>
          <span className="font-bold text-lg">{currentStreak}</span>
        </motion.div>
      )}
    </motion.div>
  );
}
