'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '@/components/BackButton';
import ProgressBar from '@/components/ProgressBar';
import ScoreBoard from '@/components/ScoreBoard';
import StarReward from '@/components/StarReward';
import BadgeNotification from '@/components/BadgeNotification';
import { getExerciseWords, syllableColors, type WordData } from '@/data/lettergrepen';
import { useGameStore } from '@/store/useGameStore';
import { speakWord, speakSyllable, speakEncouragement, stopSpeaking } from '@/lib/speech';

const QUESTIONS_PER_ROUND = 10;

type GamePhase = 'intro' | 'playing' | 'result';

interface Question {
  word: WordData;
  options: number[]; // syllable count options
}

function generateQuestions(level: number, count: number): Question[] {
  const exerciseWords = getExerciseWords(level, count);
  
  return exerciseWords.map(word => {
    const correctCount = word.syllables.length;
    
    // Generate wrong options
    const options = new Set<number>([correctCount]);
    const possibleOptions = [1, 2, 3, 4, 5].filter(n => n !== correctCount);
    
    while (options.size < 4 && possibleOptions.length > 0) {
      // Prefer nearby numbers as they're more challenging
      const nearby = possibleOptions.filter(n => Math.abs(n - correctCount) <= 1);
      const pool = nearby.length > 0 && options.size < 3 ? nearby : possibleOptions;
      const idx = Math.floor(Math.random() * pool.length);
      options.add(pool[idx]);
      possibleOptions.splice(possibleOptions.indexOf(pool[idx]), 1);
    }

    return {
      word,
      options: Array.from(options).sort(() => Math.random() - 0.5),
    };
  });
}

export default function LettergrepenPage() {
  const { level, soundEnabled, currentStreak, updateLettergrepenProgress, addStars, addXP, incrementStreak, resetStreak, addPerfectRound, checkAndUnlockBadges } = useGameStore();

  const [gamePhase, setGamePhase] = useState<GamePhase>('intro');
  const [selectedLevel, setSelectedLevel] = useState(Math.min(level, 3));
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showStar, setShowStar] = useState(false);
  const [roundScore, setRoundScore] = useState(0);
  const [revealSyllables, setRevealSyllables] = useState(false);
  const [tappedSyllables, setTappedSyllables] = useState<Set<number>>(new Set());

  const startGame = useCallback(() => {
    const newQuestions = generateQuestions(selectedLevel, QUESTIONS_PER_ROUND);
    setQuestions(newQuestions);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setRoundScore(0);
    setRevealSyllables(false);
    setTappedSyllables(new Set());
    setGamePhase('playing');
  }, [selectedLevel]);

  const currentQ = questions[currentQuestion];

  // Auto-speak word when question changes
  useEffect(() => {
    if (gamePhase === 'playing' && currentQ && soundEnabled) {
      const timer = setTimeout(() => {
        speakWord(currentQ.word.word);
      }, 500);
      return () => {
        clearTimeout(timer);
        stopSpeaking();
      };
    }
  }, [gamePhase, currentQuestion, currentQ, soundEnabled]);

  const handleSyllableTap = (syllable: string, index: number) => {
    setTappedSyllables(prev => new Set(prev).add(index));
    if (soundEnabled) {
      speakSyllable(syllable);
    }
  };

  const handleAnswer = useCallback((count: number) => {
    if (selectedAnswer !== null) return;

    const correct = count === currentQ.word.syllables.length;
    setSelectedAnswer(count);
    setIsCorrect(correct);
    setRevealSyllables(true);

    if (correct) {
      setRoundScore(s => s + 1);
      setShowStar(true);
      updateLettergrepenProgress(true);
      addStars(1);
      addXP(10);
      incrementStreak();
      if (soundEnabled && (currentStreak + 1) % 5 === 0) {
        speakEncouragement();
      }

    } else {
      updateLettergrepenProgress(false);
      resetStreak();
    }

    // Move to next question after delay
    setTimeout(() => {
      setShowStar(false);
      if (currentQuestion + 1 >= QUESTIONS_PER_ROUND) {
        const finalScore = correct ? roundScore + 1 : roundScore;
        if (finalScore === QUESTIONS_PER_ROUND) addPerfectRound();
        checkAndUnlockBadges();
        setGamePhase('result');
      } else {
        setCurrentQuestion(q => q + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setRevealSyllables(false);
        setTappedSyllables(new Set());
      }
    }, 2500);
  }, [selectedAnswer, currentQ, currentQuestion, roundScore, updateLettergrepenProgress, addStars, addXP, incrementStreak, resetStreak, addPerfectRound, checkAndUnlockBadges]);

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
          <div className="text-6xl mb-4">✂️</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Lettergrepen</h1>
          <p className="text-lg text-gray-500 mb-4">
            Splits woorden op in stukjes en tel de lettergrepen!
          </p>
          
          {/* Example */}
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-8 max-w-sm mx-auto">
            <p className="text-sm text-gray-400 mb-2">Voorbeeld:</p>
            <div className="flex items-center justify-center gap-1 text-2xl font-bold">
              <span className="px-2 py-1 rounded-lg" style={{ backgroundColor: `${syllableColors[0]}20`, color: syllableColors[0] }}>o</span>
              <span className="text-gray-300">-</span>
              <span className="px-2 py-1 rounded-lg" style={{ backgroundColor: `${syllableColors[1]}20`, color: syllableColors[1] }}>li</span>
              <span className="text-gray-300">-</span>
              <span className="px-2 py-1 rounded-lg" style={{ backgroundColor: `${syllableColors[2]}20`, color: syllableColors[2] }}>fant</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">= 3 lettergrepen 🐘</p>
          </div>

          <div className="grid gap-4 max-w-md mx-auto mb-8">
            {[1, 2, 3].map((lvl) => (
              <motion.button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`p-4 rounded-2xl font-bold text-lg transition-all ${
                  selectedLevel === lvl
                    ? 'bg-secondary text-white shadow-lg scale-105'
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
                      {lvl === 1 ? 'Korte woorden (mama, water...)' :
                       lvl === 2 ? 'Langere woorden (konijn, olifant...)' :
                       'Moeilijke woorden (dinosaurus...)'}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={startGame}
            className="bg-gradient-to-r from-[#ff6b9d] to-[#ff8a5c] text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start! ✂️
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Result screen
  if (gamePhase === 'result') {
    const percentage = Math.round((roundScore / QUESTIONS_PER_ROUND) * 100);
    const emoji = percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪';
    const message = percentage >= 80 ? 'Wat knap! Jij bent een ster!' :
                    percentage >= 60 ? 'Lekker bezig! Ga zo door!' :
                    'Oefening baart kunst! Je wordt steeds beter!';

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
            <div className="text-5xl font-bold text-secondary mb-1">{roundScore}/{QUESTIONS_PER_ROUND}</div>
            <div className="text-gray-400">goed beantwoord</div>
            <div className="flex justify-center gap-4 mt-3">
              <div className="text-center">
                <div className="text-2xl">⭐</div>
                <div className="font-bold text-sm">+{roundScore} sterren</div>
              </div>
              <div className="text-center">
                <div className="text-2xl">✨</div>
                <div className="font-bold text-sm">+{roundScore * 10} XP</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <motion.button
              onClick={startGame}
              className="bg-gradient-to-r from-[#ff6b9d] to-[#ff8a5c] text-white text-lg font-bold py-3 rounded-2xl shadow-lg"
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
            <motion.a
              href="/"
              className="block text-center text-gray-400 text-base font-semibold py-2 rounded-2xl hover:text-foreground transition-colors"
              whileTap={{ scale: 0.98 }}
            >
              Terug naar menu
            </motion.a>
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
        <ProgressBar current={currentQuestion + 1} total={QUESTIONS_PER_ROUND} color="#ff6b9d" />
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
          {/* Word display with emoji */}
          <div className="mb-2">
            <motion.span
              className="text-5xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              {currentQ.word.emoji}
            </motion.span>
          </div>

          {/* Word - tap to hear */}
          <motion.button
            onClick={() => soundEnabled && speakWord(currentQ.word.word)}
            className="mb-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {!revealSyllables ? (
              <span className="text-4xl sm:text-5xl font-bold text-foreground">
                {currentQ.word.word}
              </span>
            ) : (
              <div className="flex items-center justify-center gap-1 flex-wrap">
                {currentQ.word.syllables.map((syl, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <span className="text-gray-300 text-3xl">-</span>}
                    <motion.span
                      className="text-3xl sm:text-4xl font-bold px-2 py-1 rounded-xl cursor-pointer"
                      style={{
                        backgroundColor: `${syllableColors[i % syllableColors.length]}20`,
                        color: syllableColors[i % syllableColors.length],
                      }}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.15 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSyllableTap(syl, i);
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {syl}
                    </motion.span>
                  </span>
                ))}
              </div>
            )}
          </motion.button>

          <p className="text-lg text-gray-500 mb-6 font-bold mt-4">
            Hoeveel lettergrepen heeft dit woord? 🤔
          </p>

          {/* Syllable tap hint */}
          {!revealSyllables && (
            <p className="text-sm text-gray-400 mb-4">
              💡 Tip: Klap in je handen bij elke lettergreep!
            </p>
          )}

          {/* Answer options - numbers */}
          <div className="flex justify-center gap-3 sm:gap-4 mb-6">
            {currentQ.options.map((count, index) => {
              const isSelected = selectedAnswer === count;
              const isCorrectOption = count === currentQ.word.syllables.length;

              let buttonStyle = 'bg-white shadow-lg hover:shadow-xl';
              if (selectedAnswer !== null) {
                if (isCorrectOption) {
                  buttonStyle = 'bg-green-100 shadow-lg ring-4 ring-green-400';
                } else if (isSelected && !isCorrectOption) {
                  buttonStyle = 'bg-red-100 shadow-lg ring-4 ring-red-400';
                } else {
                  buttonStyle = 'bg-white/50 shadow';
                }
              }

              return (
                <motion.button
                  key={`${currentQuestion}-${count}`}
                  onClick={() => handleAnswer(count)}
                  disabled={selectedAnswer !== null}
                  className={`${buttonStyle} rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center transition-all`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                  whileHover={selectedAnswer === null ? { scale: 1.1 } : {}}
                  whileTap={selectedAnswer === null ? { scale: 0.9 } : {}}
                >
                  <span className="text-3xl sm:text-4xl font-bold text-foreground">{count}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {isCorrect !== null && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className={`text-xl font-bold ${isCorrect ? 'text-green-500' : 'text-orange-500'}`}>
                  {isCorrect ? (
                    <span>Goed zo! ✅</span>
                  ) : (
                    <span>Het waren {currentQ.word.syllables.length} lettergrepen!</span>
                  )}
                </div>
                <div className="mt-2 text-gray-500">
                  Tik op de lettergrepen om ze te horen! 👆
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
