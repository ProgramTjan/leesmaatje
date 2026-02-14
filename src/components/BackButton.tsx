'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function BackButton() {
  const router = useRouter();

  return (
    <motion.button
      onClick={() => router.push('/')}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 shadow-md text-foreground font-bold text-lg hover:bg-white transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-2xl">←</span>
      <span>Terug</span>
    </motion.button>
  );
}
