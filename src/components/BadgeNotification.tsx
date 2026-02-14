'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import { useEffect } from 'react';

export default function BadgeNotification() {
  const { newBadgeQueue, dismissBadge, checkAndUnlockBadges } = useGameStore();
  const currentBadge = newBadgeQueue[0] || null;

  // Check for new badges whenever relevant state changes
  const { stars, level, bestStreak, lettersProgress, lettergrepenProgress, woordenProgress, zinnenProgress, perfectRounds } = useGameStore();
  
  useEffect(() => {
    checkAndUnlockBadges();
  }, [
    stars, level, bestStreak, perfectRounds,
    lettersProgress.total, lettergrepenProgress.total,
    woordenProgress.total, zinnenProgress.total,
    checkAndUnlockBadges,
  ]);

  return (
    <AnimatePresence>
      {currentBadge && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismissBadge}
        >
          <motion.div
            className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-[90%] text-center relative overflow-hidden"
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sparkle background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  initial={{
                    x: '50%',
                    y: '50%',
                    opacity: 0,
                  }}
                  animate={{
                    x: `${20 + Math.random() * 60}%`,
                    y: `${10 + Math.random() * 80}%`,
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.15,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </div>

            <motion.div
              className="text-sm font-bold text-primary uppercase tracking-wider mb-2"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Nieuwe badge!
            </motion.div>

            <motion.div
              className="text-7xl mb-3"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
            >
              {currentBadge.emoji}
            </motion.div>

            <motion.h3
              className="text-2xl font-bold text-foreground mb-1"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {currentBadge.name}
            </motion.h3>

            <motion.p
              className="text-gray-500 mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {currentBadge.description}
            </motion.p>

            <motion.button
              className="bg-gradient-to-r from-[#6c63ff] to-[#a06cd5] text-white font-bold py-3 px-8 rounded-2xl shadow-lg text-lg"
              onClick={dismissBadge}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Cool! 🎉
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
