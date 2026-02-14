'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface MascotProps {
  message?: string;
  mood?: 'happy' | 'excited' | 'thinking' | 'sleeping' | 'cheering';
  size?: 'sm' | 'md' | 'lg';
}

const moodEmojis: Record<string, string> = {
  happy: '🦉',
  excited: '🦉',
  thinking: '🦉',
  sleeping: '🦉',
  cheering: '🦉',
};

const idleMessages = [
  'Oehoe! Wat ga je oefenen?',
  'Je doet het super!',
  'Lezen is een avontuur!',
  'Ik ben trots op je!',
  'Samen worden we beter!',
  'Elke dag een beetje beter!',
  'Jij bent een ster!',
];

export default function Mascot({ message, mood = 'happy', size = 'md' }: MascotProps) {
  const [currentMessage, setCurrentMessage] = useState(message || idleMessages[0]);
  const [showBubble, setShowBubble] = useState(!!message);

  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
      setShowBubble(true);
      return;
    }

    // Cycle through idle messages
    const interval = setInterval(() => {
      const randomMsg = idleMessages[Math.floor(Math.random() * idleMessages.length)];
      setCurrentMessage(randomMsg);
      setShowBubble(true);

      setTimeout(() => setShowBubble(false), 4000);
    }, 8000);

    // Show first message
    setShowBubble(true);
    const hideFirst = setTimeout(() => setShowBubble(false), 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(hideFirst);
    };
  }, [message]);

  const sizeClasses = {
    sm: 'text-4xl',
    md: 'text-6xl',
    lg: 'text-8xl',
  };

  const moodAnimations = {
    happy: { y: [0, -8, 0] },
    excited: { y: [0, -15, 0], rotate: [0, -5, 5, -5, 0] },
    thinking: { rotate: [0, 10, 0] },
    sleeping: { y: [0, -3, 0] },
    cheering: { y: [0, -20, 0], scale: [1, 1.1, 1] },
  };

  return (
    <div className="flex flex-col items-center relative">
      {/* Speech bubble */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg px-4 py-2 mb-2 text-sm sm:text-base font-bold text-center max-w-[200px] relative"
        initial={{ opacity: 0, y: 10, scale: 0.8 }}
        animate={showBubble ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {currentMessage}
        {/* Triangle */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 shadow-sm" />
      </motion.div>

      {/* Owl */}
      <motion.div
        className={`${sizeClasses[size]} cursor-pointer select-none`}
        animate={moodAnimations[mood]}
        transition={{
          duration: mood === 'sleeping' ? 3 : 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          const randomMsg = idleMessages[Math.floor(Math.random() * idleMessages.length)];
          setCurrentMessage(randomMsg);
          setShowBubble(true);
          setTimeout(() => {
            if (!message) setShowBubble(false);
          }, 3000);
        }}
      >
        {moodEmojis[mood]}
      </motion.div>
    </div>
  );
}
