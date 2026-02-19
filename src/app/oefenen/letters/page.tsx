'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '@/components/BackButton';
import ProgressBar from '@/components/ProgressBar';
import ScoreBoard from '@/components/ScoreBoard';
import StarReward from '@/components/StarReward';
import BadgeNotification from '@/components/BadgeNotification';
import { letters, getLettersByLevel, getDistractors, type LetterData } from '@/data/letters';
import { useGameStore } from '@/store/useGameStore';
import { speakLetter, speakWord, speakEncouragement, stopSpeaking } from '@/lib/speech';

const QUESTIONS_PER_ROUND = 10;

type GamePhase = 'intro' | 'playing' | 'result';
type QuestionType = 'hear-pick-letter' | 'see-letter-pick-word';

interface Question {
  type: QuestionType;
  correctLetter: LetterData;
  options: LetterData[];
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateQuestions(level: number, count: number): Question[] {
  const pool = getLettersByLevel(level);
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    const correctLetter = pool[Math.floor(Math.random() * pool.length)];
    const distractors = getDistractors(correctLetter, 3, pool);
    const options = shuffleArray([correctLetter, ...distractors]);

    // Alternate between question types
    const type: QuestionType = i % 2 === 0 ? 'hear-pick-letter' : 'see-letter-pick-word';

    questions.push({ type, correctLetter, options });
  }

  return questions;
}

export default function LettersPage() {
  const { level, soundEnabled, currentStreak, updateLettersProgress, addStars, addXP, incrementStreak, resetStreak, addPerfectRound, checkAndUnlockBadges } = useGameStore();

  const [gamePhase, setGamePhase] = useState<GamePhase>('intro');
  const [selectedLevel, setSelectedLevel] = useState(Math.min(level, 3));
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showStar, setShowStar] = useState(false);
  const [score, setScore] = useState(0);
  const [roundScore, setRoundScore] = useState(0);

  const startGame = useCallback(() => {
    const newQuestions = generateQuestions(selectedLevel, QUESTIONS_PER_ROUND);
    setQuestions(newQuestions);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setRoundScore(0);
    setGamePhase('playing');
  }, [selectedLevel]);

  const currentQ = questions[currentQuestion];

  // Auto-speak the letter when question changes
  useEffect(() => {
    if (gamePhase === 'playing' && currentQ && soundEnabled) {
      const timer = setTimeout(() => {
        if (currentQ.type === 'hear-pick-letter') {
          speakLetter(currentQ.correctLetter.sound);
        }
      }, 500);
      return () => {
        clearTimeout(timer);
        stopSpeaking();
      };
    }
  }, [gamePhase, currentQuestion, currentQ, soundEnabled]);

  const handleAnswer = useCallback((letter: LetterData) => {
    if (selectedAnswer !== null) return; // Prevent double-click

    const correct = letter.letter === currentQ.correctLetter.letter;
    setSelectedAnswer(letter.letter);
    setIsCorrect(correct);

    if (correct) {
      setScore(s => s + 1);
      setRoundScore(s => s + 1);
      setShowStar(true);
      updateLettersProgress(true);
      addStars(1);
      addXP(10);
      incrementStreak();
      if (soundEnabled && (currentStreak + 1) % 5 === 0) {
        speakEncouragement();
      }

    } else {
      updateLettersProgress(false);
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
      }
    }, 1800);
  }, [selectedAnswer, currentQ, currentQuestion, roundScore, updateLettersProgress, addStars, addXP, incrementStreak, resetStreak, addPerfectRound, checkAndUnlockBadges]);

  const replaySound = () => {
    if (currentQ && soundEnabled) {
      if (currentQ.type === 'hear-pick-letter') {
        speakLetter(currentQ.correctLetter.sound);
      } else {
        speakWord(currentQ.correctLetter.exampleWord);
      }
    }
  };

  // Intro screen - level selection
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
          <div className="text-6xl mb-4">🔤</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Letters & Klanken</h1>
          <p className="text-lg text-gray-500 mb-8">
            Luister naar de klank en kies de juiste letter!
          </p>

          <div className="grid gap-4 max-w-md mx-auto mb-8">
            {[1, 2, 3].map((lvl) => (
              <motion.button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`p-4 rounded-2xl font-bold text-lg transition-all ${
                  selectedLevel === lvl
                    ? 'bg-primary text-white shadow-lg scale-105'
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
                      {lvl === 1 ? 'Basis letters (a, e, i, o, m, s...)' :
                       lvl === 2 ? 'Alle letters (+ b, d, p, g, w...)' :
                       'Lastige letters (c, x, y, q)'}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={startGame}
            className="bg-gradient-to-r from-[#6c63ff] to-[#a06cd5] text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start! 🎮
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Result screen
  if (gamePhase === 'result') {
    const percentage = Math.round((roundScore / QUESTIONS_PER_ROUND) * 100);
    const emoji = percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪';
    const message = percentage >= 80 ? 'Super goed gedaan!' :
                    percentage >= 60 ? 'Goed bezig! Ga zo door!' :
                    'Oefening baart kunst! Probeer het nog eens!';

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
            <div className="text-5xl font-bold text-primary mb-1">{roundScore}/{QUESTIONS_PER_ROUND}</div>
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
              className="bg-gradient-to-r from-[#6c63ff] to-[#a06cd5] text-white text-lg font-bold py-3 rounded-2xl shadow-lg"
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
        <ProgressBar current={currentQuestion + 1} total={QUESTIONS_PER_ROUND} />
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
          {currentQ.type === 'hear-pick-letter' ? (
            <>
              {/* Listen and pick the letter */}
              <p className="text-xl text-gray-500 mb-4 font-bold">
                Welke letter hoor je? 👂
              </p>

              <motion.button
                onClick={replaySound}
                className="bg-white rounded-full w-24 h-24 shadow-xl flex items-center justify-center mx-auto mb-8 text-5xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ boxShadow: ['0 4px 20px rgba(108,99,255,0.2)', '0 4px 40px rgba(108,99,255,0.4)', '0 4px 20px rgba(108,99,255,0.2)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔊
              </motion.button>
            </>
          ) : (
            <>
              {/* See letter, pick the matching word */}
              <p className="text-xl text-gray-500 mb-4 font-bold">
                Welk plaatje begint met deze letter?
              </p>

              <motion.div
                className="bg-white rounded-3xl w-32 h-32 shadow-xl flex items-center justify-center mx-auto mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <span className="text-7xl font-bold text-primary">
                  {currentQ.correctLetter.letter}
                </span>
              </motion.div>
            </>
          )}

          {/* Answer options */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswer === option.letter;
              const isCorrectOption = option.letter === currentQ.correctLetter.letter;
              
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
                  key={`${currentQuestion}-${option.letter}`}
                  onClick={() => handleAnswer(option)}
                  disabled={selectedAnswer !== null}
                  className={`${buttonStyle} rounded-2xl p-4 sm:p-6 transition-all`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={selectedAnswer === null ? { scale: 1.05 } : {}}
                  whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
                >
                  {currentQ.type === 'hear-pick-letter' ? (
                    <span className="text-4xl sm:text-5xl font-bold text-foreground">
                      {option.letter}
                    </span>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-3xl sm:text-4xl">{option.exampleEmoji}</span>
                      <span className="text-base sm:text-lg font-bold text-foreground">
                        {option.exampleWord}
                      </span>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {isCorrect !== null && (
              <motion.div
                className={`mt-6 text-xl font-bold ${isCorrect ? 'text-green-500' : 'text-orange-500'}`}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {isCorrect ? (
                  <span>Goed zo! ✅ De letter &quot;{currentQ.correctLetter.letter}&quot; klinkt als &quot;{currentQ.correctLetter.sound}&quot;</span>
                ) : (
                  <span>Het was de letter &quot;{currentQ.correctLetter.letter}&quot; ({currentQ.correctLetter.exampleEmoji} {currentQ.correctLetter.exampleWord})</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
