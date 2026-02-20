'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '@/components/BackButton';
import ProgressBar from '@/components/ProgressBar';
import ScoreBoard from '@/components/ScoreBoard';
import StarReward from '@/components/StarReward';
import BadgeNotification from '@/components/BadgeNotification';
import { getRijmItems, buildRijmQuestion, type RijmItem } from '@/data/rijmen';
import { useGameStore } from '@/store/useGameStore';
import { speakWord, speakEncouragement, stopSpeaking } from '@/lib/speech';

const QUESTIONS_PER_ROUND = 8;

type GamePhase = 'intro' | 'playing' | 'result';

interface RijmQuestion {
  item: RijmItem;
  correct: string;
  options: string[];
}

function generateQuestions(level: 1 | 2 | 3): RijmQuestion[] {
  const items = getRijmItems(level, QUESTIONS_PER_ROUND);
  return items.map((item) => {
    const { correct, options } = buildRijmQuestion(item);
    return { item, correct, options };
  });
}

export default function RijmenPage() {
  const {
    soundEnabled,
    currentStreak,
    rijmenProgress,
    updateRijmenProgress,
    addStars,
    addXP,
    incrementStreak,
    resetStreak,
    addPerfectRound,
    checkAndUnlockBadges,
  } = useGameStore();

  const [gamePhase, setGamePhase] = useState<GamePhase>('intro');
  const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3>(1);
  const [questions, setQuestions] = useState<RijmQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showStar, setShowStar] = useState(false);
  const [roundScore, setRoundScore] = useState(0);

  // Suppress unused warning — rijmenProgress used for display in intro
  void rijmenProgress;

  const startGame = useCallback(() => {
    setQuestions(generateQuestions(selectedLevel));
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setRoundScore(0);
    setGamePhase('playing');
  }, [selectedLevel]);

  const currentQ = questions[currentQuestion];

  // Speak the target word when question changes
  useEffect(() => {
    if (gamePhase === 'playing' && currentQ && soundEnabled) {
      const timer = setTimeout(() => speakWord(currentQ.item.word), 500);
      return () => { clearTimeout(timer); stopSpeaking(); };
    }
  }, [gamePhase, currentQuestion, currentQ, soundEnabled]);

  const handleAnswer = useCallback((answer: string) => {
    if (selectedAnswer !== null || !currentQ) return;

    const correct = answer === currentQ.correct;
    setSelectedAnswer(answer);
    setIsCorrect(correct);

    if (correct) {
      setRoundScore((s) => s + 1);
      setShowStar(true);
      updateRijmenProgress(true, selectedLevel);
      addStars(2);
      addXP(15);
      incrementStreak();
      if (soundEnabled && (currentStreak + 1) % 5 === 0) {
        speakEncouragement();
      }
    } else {
      updateRijmenProgress(false, selectedLevel);
      resetStreak();
    }

    setTimeout(() => {
      setShowStar(false);
      if (currentQuestion + 1 >= QUESTIONS_PER_ROUND) {
        const finalScore = correct ? roundScore + 1 : roundScore;
        if (finalScore === QUESTIONS_PER_ROUND) addPerfectRound();
        checkAndUnlockBadges();
        setGamePhase('result');
      } else {
        setCurrentQuestion((q) => q + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      }
    }, 2000);
  }, [selectedAnswer, currentQ, currentQuestion, roundScore, selectedLevel, updateRijmenProgress, addStars, addXP, incrementStreak, resetStreak, addPerfectRound, checkAndUnlockBadges, soundEnabled, currentStreak]);

  // ── Intro ──
  if (gamePhase === 'intro') {
    const levels: { level: 1 | 2 | 3; label: string; description: string; emoji: string }[] = [
      { level: 1, label: 'Niveau 1', description: 'Korte woorden (kat, bal, vis...)', emoji: '🌟' },
      { level: 2, label: 'Niveau 2', description: 'Langere woorden (fiets, boom...)', emoji: '⭐' },
      { level: 3, label: 'Niveau 3', description: 'Moeilijke woorden (vliegen...)', emoji: '💫' },
    ];

    return (
      <div className="min-h-screen p-4 sm:p-6 max-w-2xl mx-auto">
        <BadgeNotification />
        <div className="mb-6"><BackButton /></div>

        <motion.div className="text-center" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="text-6xl mb-4">🎵</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Rijmwoorden</h1>
          <p className="text-lg text-gray-500 mb-4">
            Welk woord rijmt? Luister goed en kies het juiste antwoord!
          </p>

          {/* Voorbeeld */}
          <div className="bg-card-bg rounded-2xl shadow-lg p-4 mb-8 max-w-sm mx-auto text-sm text-gray-500">
            <p className="mb-2 font-medium">Voorbeeld:</p>
            <p>🐱 <strong>kat</strong> rijmt met... <strong>mat</strong>!</p>
            <p className="text-xs mt-1 text-gray-400">(niet met hond, boom of vis)</p>
          </div>

          <div className="grid gap-3 max-w-md mx-auto mb-8">
            {levels.map(({ level, label, description, emoji }) => (
              <motion.button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`p-4 rounded-2xl font-bold text-lg transition-all ${
                  selectedLevel === level
                    ? 'bg-[#ff6b9d] text-white shadow-lg scale-105'
                    : 'bg-card-bg text-foreground shadow-md'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{emoji}</span>
                  <div className="text-left">
                    <div>{label}</div>
                    <div className={`text-sm font-normal ${selectedLevel === level ? 'text-white/70' : 'text-gray-400'}`}>
                      {description}
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
            Start! 🎵
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ── Result ──
  if (gamePhase === 'result') {
    const pct = Math.round((roundScore / QUESTIONS_PER_ROUND) * 100);
    const msg =
      pct === 100 ? 'Perfecte ronde! Je bent een rijmkampioen! 🏆' :
      pct >= 80 ? 'Super goed! Jij kunt rijmen! 🎉' :
      pct >= 60 ? 'Goed bezig! Nog even oefenen!' :
      'Oefening baart kunst! Probeer het nog eens!';

    return (
      <div className="min-h-screen p-4 sm:p-6 max-w-2xl mx-auto flex items-center justify-center">
        <BadgeNotification />
        <motion.div
          className="bg-card-bg rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring' }}
        >
          <motion.div
            className="text-7xl mb-4"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: 2 }}
          >
            {pct >= 80 ? '🎉' : '💪'}
          </motion.div>
          <h2 className="text-3xl font-bold mb-2">Klaar!</h2>
          <p className="text-lg text-gray-500 mb-6">{msg}</p>

          <div className="bg-background rounded-2xl p-4 mb-6">
            <div className="text-5xl font-bold text-[#ff6b9d] mb-1">{roundScore}/{QUESTIONS_PER_ROUND}</div>
            <div className="text-gray-400">goed geraden</div>
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
              className="bg-gradient-to-r from-[#ff6b9d] to-[#ff8a5c] text-white text-lg font-bold py-3 rounded-2xl shadow-lg"
              whileTap={{ scale: 0.98 }}
            >
              Nog een keer! 🎵
            </motion.button>
            <motion.button
              onClick={() => setGamePhase('intro')}
              className="bg-gray-100 text-foreground text-lg font-bold py-3 rounded-2xl"
              whileTap={{ scale: 0.98 }}
            >
              Ander niveau
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

  if (!currentQ) return null;

  // ── Playing ──
  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-2xl mx-auto">
      <StarReward show={showStar} />
      <BadgeNotification />

      <div className="flex items-center justify-between mb-4">
        <BackButton />
        <ScoreBoard />
      </div>

      <div className="mb-6">
        <ProgressBar current={currentQuestion + 1} total={QUESTIONS_PER_ROUND} color="#ff6b9d" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          className="text-center"
        >
          {/* Target word */}
          <p className="text-xl text-gray-500 mb-3 font-bold">Welk woord rijmt met...? 🎵</p>

          <motion.div
            className="bg-card-bg rounded-3xl shadow-xl inline-block px-10 py-6 mb-2"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="text-5xl mb-2">{currentQ.item.emoji}</div>
            <div className="text-4xl font-bold text-foreground">{currentQ.item.word}</div>
          </motion.div>

          {/* Herspelen knop */}
          <div className="mb-6">
            <motion.button
              onClick={() => soundEnabled && speakWord(currentQ.item.word)}
              className="inline-flex items-center gap-2 bg-card-bg rounded-full px-4 py-2 shadow-md text-base font-medium text-gray-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔊 Herhaal
            </motion.button>
          </div>

          {/* Opties */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = option === currentQ.correct;

              let style = 'bg-card-bg shadow-lg hover:shadow-xl';
              if (selectedAnswer !== null) {
                if (isCorrectOption) style = 'bg-green-100 shadow-lg ring-4 ring-green-400';
                else if (isSelected) style = 'bg-red-100 shadow-lg ring-4 ring-red-400';
                else style = 'bg-card-bg/50 shadow opacity-60';
              }

              return (
                <motion.button
                  key={`${currentQuestion}-${option}`}
                  onClick={() => handleAnswer(option)}
                  disabled={selectedAnswer !== null}
                  className={`${style} rounded-2xl p-5 transition-all text-2xl font-bold text-foreground`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={selectedAnswer === null ? { scale: 1.05 } : {}}
                  whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
                >
                  {option}
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
                {isCorrect
                  ? `Ja! "${currentQ.item.word}" rijmt met "${currentQ.correct}"! 🎵`
                  : `Het juiste antwoord was "${currentQ.correct}" — dat rijmt met "${currentQ.item.word}"`}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
