'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

interface StarRewardProps {
  show: boolean;
  onComplete?: () => void;
}

const REWARD_SPRITES = [
  { emoji: '⭐', label: 'ster' },
  { emoji: '👍', label: 'duimpje' },
  { emoji: '🚀', label: 'raket' },
  { emoji: '🎉', label: 'confetti' },
  { emoji: '💪', label: 'sterk' },
  { emoji: '🌟', label: 'glitter' },
  { emoji: '🏆', label: 'trofee' },
  { emoji: '✨', label: 'sparkles' },
  { emoji: '🦸', label: 'superheld' },
  { emoji: '🎯', label: 'bullseye' },
];

const PARTICLE_COLORS = ['#ffe66d', '#ff6b9d', '#6c63ff', '#4ecdc4', '#ff8a5c', '#45b7d1'];

export default function StarReward({ show, onComplete }: StarRewardProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; size: number }>>([]);

  // Pick a random sprite each time show becomes true
  const sprite = useMemo(() => {
    if (!show) return REWARD_SPRITES[0];
    return REWARD_SPRITES[Math.floor(Math.random() * REWARD_SPRITES.length)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  useEffect(() => {
    if (show) {
      const newParticles = Array.from({ length: 16 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 250,
        y: (Math.random() - 0.5) * 250,
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
        size: Math.random() * 8 + 4,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        onComplete?.();
      }, 1400);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-x-0 top-[35%] flex justify-center z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Main reward sprite */}
          <motion.div
            className="text-8xl drop-shadow-lg"
            initial={{ scale: 0, rotate: -180, y: 40 }}
            animate={{ scale: 1, rotate: 0, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: -30 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          >
            {sprite.emoji}
          </motion.div>

          {/* Confetti particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                backgroundColor: particle.color,
                width: particle.size,
                height: particle.size,
                top: '50%',
                left: '50%',
              }}
              initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
              animate={{
                x: particle.x,
                y: particle.y,
                scale: [0, 1.8, 0],
                opacity: [1, 1, 0],
              }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
