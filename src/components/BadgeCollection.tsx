'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import { badges } from '@/data/badges';

export default function BadgeCollection() {
  const { unlockedBadges } = useGameStore();

  const unlockedCount = unlockedBadges.length;
  const totalCount = badges.length;

  return (
    <div className="bg-white rounded-3xl shadow-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          🏆 Badges
        </h3>
        <span className="text-sm font-bold text-gray-400">
          {unlockedCount}/{totalCount}
        </span>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
        {badges.map((badge, index) => {
          const isUnlocked = unlockedBadges.includes(badge.id);

          return (
            <motion.div
              key={badge.id}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                isUnlocked
                  ? 'bg-gradient-to-br from-amber-50 to-yellow-50'
                  : 'bg-gray-100'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              title={isUnlocked ? `${badge.name}: ${badge.description}` : '???'}
            >
              <span
                className={`text-2xl ${isUnlocked ? '' : 'grayscale opacity-30'}`}
              >
                {isUnlocked ? badge.emoji : '🔒'}
              </span>
              {isUnlocked && (
                <span className="text-[10px] font-bold text-gray-500 text-center mt-0.5 leading-tight">
                  {badge.name}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
