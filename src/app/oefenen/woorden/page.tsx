'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import BackButton from '@/components/BackButton';
import ProgressBar from '@/components/ProgressBar';
import ScoreBoard from '@/components/ScoreBoard';
import StarReward from '@/components/StarReward';
import BadgeNotification from '@/components/BadgeNotification';
import { getBuildExerciseWords, shuffleWord, type BuildWordData } from '@/data/woorden';
import { useGameStore } from '@/store/useGameStore';
import { speakWord, stopSpeaking } from '@/lib/speech';

const QUESTIONS_PER_ROUND = 8;

type GamePhase = 'intro' | 'playing' | 'result';

interface Question {
  word: BuildWordData;
  shuffledLetters: string[];
}

function generateQuestions(level: number): Question[] {
  const words = getBuildExerciseWords(level, QUESTIONS_PER_ROUND);
  return words.map((word) => ({
    word,
    shuffledLetters: shuffleWord(word.word),
  }));
}

export default function WoordenPage() {
  const {
    level,
    soundEnabled,
    updateWoordenProgress,
    addStars,
    addXP,
    incrementStreak,
    resetStreak,
    addPerfectRound,
    checkAndUnlockBadges,
  } = useGameStore();

  const [gamePhase, setGamePhase] = useState<GamePhase>('intro');
  const [selectedLevel, setSelectedLevel] = useState(Math.min(level, 3));
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<{ letter: string; origIdx: number }[]>([]);
  const [availableLetters, setAvailableLetters] = useState<{ letter: string; origIdx: number }[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showStar, setShowStar] = useState(false);
  const [roundScore, setRoundScore] = useState(0);
  const [hasChecked, setHasChecked] = useState(false);

  const startGame = useCallback(() => {
    const newQuestions = generateQuestions(selectedLevel);
    setQuestions(newQuestions);
    setCurrentQuestion(0);
    setRoundScore(0);
    setGamePhase('playing');
  }, [selectedLevel]);

  const currentQ = questions[currentQuestion];

  // Setup letters for current question
  useEffect(() => {
    if (gamePhase === 'playing' && currentQ) {
      const letters = currentQ.shuffledLetters.map((l, i) => ({ letter: l, origIdx: i }));
      setAvailableLetters(letters);
      setSelectedLetters([]);
      setIsCorrect(null);
      setHasChecked(false);
    }
  }, [gamePhase, currentQuestion, currentQ]);

  // Auto-speak word when question changes
  useEffect(() => {
    if (gamePhase === 'playing' && currentQ && soundEnabled) {
      const timer = setTimeout(() => {
        speakWord(currentQ.word.word);
      }, 400);
      return () => {
        clearTimeout(timer);
        stopSpeaking();
      };
    }
  }, [gamePhase, currentQuestion, currentQ, soundEnabled]);

  const selectLetter = (item: { letter: string; origIdx: number }) => {
    if (hasChecked) return;
    setAvailableLetters((prev) => prev.filter((l) => l.origIdx !== item.origIdx));
    setSelectedLetters((prev) => [...prev, item]);
  };

  const deselectLetter = (item: { letter: string; origIdx: number }) => {
    if (hasChecked) return;
    setSelectedLetters((prev) => prev.filter((l) => l.origIdx !== item.origIdx));
    setAvailableLetters((prev) => [...prev, item]);
  };

  const checkAnswer = useCallback(() => {
    if (hasChecked || selectedLetters.length !== currentQ.word.word.length) return;
    setHasChecked(true);

    const builtWord = selectedLetters.map((l) => l.letter).join('');
    const correct = builtWord === currentQ.word.word;
    setIsCorrect(correct);

    if (correct) {
      setRoundScore((s) => s + 1);
      setShowStar(true);
      updateWoordenProgress(true);
      addStars(2); // Building words is harder, so more stars
      addXP(15);
      incrementStreak();
    } else {
      updateWoordenProgress(false);
      resetStreak();
    }

    setTimeout(() => {
      setShowStar(false);
      if (currentQuestion + 1 >= QUESTIONS_PER_ROUND) {
        // Check for perfect round
        const finalScore = correct ? roundScore + 1 : roundScore;
        if (finalScore === QUESTIONS_PER_ROUND) {
          addPerfectRound();
        }
        checkAndUnlockBadges();
        setGamePhase('result');
      } else {
        setCurrentQuestion((q) => q + 1);
      }
    }, 2000);
  }, [
    hasChecked, selectedLetters, currentQ, currentQuestion, roundScore,
    updateWoordenProgress, addStars, addXP, incrementStreak, resetStreak,
    addPerfectRound, checkAndUnlockBadges,
  ]);

  // Auto-check when all letters are placed
  useEffect(() => {
    if (
      gamePhase === 'playing' &&
      currentQ &&
      selectedLetters.length === currentQ.word.word.length &&
      !hasChecked
    ) {
      const timer = setTimeout(checkAnswer, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedLetters, currentQ, hasChecked, gamePhase, checkAnswer]);

  // Intro screen
  if (gamePhase === 'intro') {
    return (
      <div className="min-h-screen p-4 sm:p-6 max-w-2xl mx-auto">
        <BadgeNotification />
        <div className="mb-6">
          <BackButton />
        </div>

        <motion.div
          className="text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="text-6xl mb-4">🧩</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Woorden Bouwen</h1>
          <p className="text-lg text-gray-500 mb-4">
            Luister naar het woord en bouw het met letters!
          </p>

          {/* Example */}
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-8 max-w-sm mx-auto">
            <p className="text-sm text-gray-400 mb-2">Voorbeeld: 🐱</p>
            <div className="flex justify-center gap-2 mb-2">
              {['k', 'a', 't'].map((l, i) => (
                <motion.div
                  key={i}
                  className="w-12 h-12 bg-accent-green/20 rounded-xl flex items-center justify-center text-2xl font-bold text-accent-green"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.2 }}
                >
                  {l}
                </motion.div>
              ))}
            </div>
            <p className="text-sm text-gray-400">= kat!</p>
          </div>

          <div className="grid gap-4 max-w-md mx-auto mb-8">
            {[1, 2, 3].map((lvl) => (
              <motion.button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`p-4 rounded-2xl font-bold text-lg transition-all ${
                  selectedLevel === lvl
                    ? 'bg-accent-green text-white shadow-lg scale-105'
                    : 'bg-white text-foreground shadow-md hover:shadow-lg'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {lvl === 1 ? '🌟' : lvl === 2 ? '⭐' : '💫'}
                  </span>
                  <div className="text-left">
                    <div>Niveau {lvl}</div>
                    <div className={`text-sm font-normal ${selectedLevel === lvl ? 'text-white/70' : 'text-gray-400'}`}>
                      {lvl === 1
                        ? 'Korte woorden (kat, zon, bed...)'
                        : lvl === 2
                        ? 'Langere woorden (bloem, trein...)'
                        : 'Moeilijke woorden (vlinder, kasteel...)'}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={startGame}
            className="bg-gradient-to-r from-[#4ecdc4] to-[#45b7d1] text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start! 🧩
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Result screen
  if (gamePhase === 'result') {
    const percentage = Math.round((roundScore / QUESTIONS_PER_ROUND) * 100);
    const emoji = percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪';
    const message =
      percentage === 100
        ? 'Perfecte ronde! Ongelooflijk!'
        : percentage >= 80
        ? 'Wat knap! Jij kunt goed spellen!'
        : percentage >= 60
        ? 'Lekker bezig! Ga zo door!'
        : 'Oefenen maakt de meester!';

    return (
      <div className="min-h-screen p-4 sm:p-6 max-w-2xl mx-auto flex items-center justify-center">
        <BadgeNotification />
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring' }}
        >
          <motion.div
            className="text-7xl mb-4"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: 2 }}
          >
            {emoji}
          </motion.div>

          <h2 className="text-3xl font-bold mb-2">Klaar!</h2>
          <p className="text-lg text-gray-500 mb-6">{message}</p>

          <div className="bg-background rounded-2xl p-4 mb-6">
            <div className="text-5xl font-bold text-accent-green mb-1">
              {roundScore}/{QUESTIONS_PER_ROUND}
            </div>
            <div className="text-gray-400">goed gebouwd</div>
            <div className="flex justify-center gap-4 mt-3">
              <div className="text-center">
                <div className="text-2xl">⭐</div>
                <div className="font-bold text-sm">+{roundScore * 2} sterren</div>
              </div>
              <div className="text-center">
                <div className="text-2xl">✨</div>
                <div className="font-bold text-sm">+{roundScore * 15} XP</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <motion.button
              onClick={startGame}
              className="bg-gradient-to-r from-[#4ecdc4] to-[#45b7d1] text-white text-lg font-bold py-3 rounded-2xl shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Nog een keer! 🔄
            </motion.button>
            <motion.button
              onClick={() => setGamePhase('intro')}
              className="bg-gray-100 text-foreground text-lg font-bold py-3 rounded-2xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Kies ander niveau
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Playing screen
  if (!currentQ) return null;

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-2xl mx-auto">
      <StarReward show={showStar} />
      <BadgeNotification />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <BackButton />
        <ScoreBoard />
      </div>

      {/* Progress */}
      <div className="mb-6">
        <ProgressBar current={currentQuestion + 1} total={QUESTIONS_PER_ROUND} color="#4ecdc4" />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          className="text-center"
        >
          {/* Emoji and hint */}
          <motion.div
            className="text-5xl mb-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
          >
            {currentQ.word.emoji}
          </motion.div>

          <p className="text-gray-500 mb-1 text-base italic">{currentQ.word.hint}</p>

          {/* Listen button */}
          <motion.button
            onClick={() => soundEnabled && speakWord(currentQ.word.word)}
            className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md mb-4 text-lg font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔊 Luister
          </motion.button>

          {/* Build area - where selected letters appear */}
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-4 min-h-[72px]">
            <div className="flex justify-center gap-2 flex-wrap">
              {/* Letter slots */}
              {Array.from({ length: currentQ.word.word.length }).map((_, i) => {
                const placedLetter = selectedLetters[i];
                const isWrong =
                  isCorrect === false &&
                  placedLetter &&
                  placedLetter.letter !== currentQ.word.word[i];

                return (
                  <motion.div
                    key={i}
                    className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 border-dashed flex items-center justify-center text-2xl sm:text-3xl font-bold transition-all ${
                      placedLetter
                        ? isCorrect === true
                          ? 'bg-green-100 border-green-400 text-green-600'
                          : isWrong
                          ? 'bg-red-100 border-red-400 text-red-600'
                          : 'bg-accent-green/10 border-accent-green text-foreground'
                        : 'border-gray-300 text-gray-300'
                    }`}
                    layout
                    onClick={() => placedLetter && deselectLetter(placedLetter)}
                  >
                    {placedLetter ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        {placedLetter.letter}
                      </motion.span>
                    ) : (
                      <span className="text-lg">_</span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Show correct word on wrong answer */}
            {isCorrect === false && (
              <motion.div
                className="mt-3 text-lg font-bold text-orange-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Het juiste woord is: <span className="text-accent-green">{currentQ.word.word}</span>
              </motion.div>
            )}
          </div>

          {/* Available letters pool */}
          <div className="flex justify-center gap-2 flex-wrap mb-4">
            {availableLetters.map((item) => (
              <motion.button
                key={item.origIdx}
                onClick={() => selectLetter(item)}
                disabled={hasChecked}
                className="w-12 h-14 sm:w-14 sm:h-16 bg-white rounded-xl shadow-lg flex items-center justify-center text-2xl sm:text-3xl font-bold text-foreground hover:bg-accent-green/10 hover:shadow-xl transition-all disabled:opacity-50"
                layout
                whileHover={!hasChecked ? { scale: 1.1, y: -4 } : {}}
                whileTap={!hasChecked ? { scale: 0.9 } : {}}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                {item.letter}
              </motion.button>
            ))}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {isCorrect !== null && (
              <motion.div
                className={`text-xl font-bold ${isCorrect ? 'text-green-500' : 'text-orange-500'}`}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {isCorrect ? 'Goed gespeld! ✅' : 'Volgende keer beter! 💪'}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
