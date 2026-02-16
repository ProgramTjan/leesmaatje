'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '@/components/BackButton';
import ProgressBar from '@/components/ProgressBar';
import ScoreBoard from '@/components/ScoreBoard';
import StarReward from '@/components/StarReward';
import BadgeNotification from '@/components/BadgeNotification';
import { getFlashExercise, getFlashWordsByLevel, flashDurations, type FlashWord } from '@/data/flitslezen';
import { useGameStore } from '@/store/useGameStore';
import { getAvailableAILevel, maxStaticLevel, checkAIAvailable } from '@/lib/adaptive';
import { fetchAIExercises } from '@/lib/aiExercises';

const QUESTIONS_PER_ROUND = 10;
type GamePhase = 'intro' | 'flash' | 'answer' | 'result';
type Speed = 'easy' | 'medium' | 'hard';

const speedLabels: Record<Speed, string> = { easy: 'Rustig (2s)', medium: 'Normaal (1.2s)', hard: 'Snel (0.6s)' };

export default function FlitslezenPage() {
  const { level, flitslezenProgress, updateFlitslezenProgress, addStars, addXP, incrementStreak, resetStreak, addPerfectRound, checkAndUnlockBadges } = useGameStore();

  const [gamePhase, setGamePhase] = useState<GamePhase>('intro');
  const [selectedLevel, setSelectedLevel] = useState(Math.min(level, 3));
  const [speed, setSpeed] = useState<Speed>('easy');
  const [questions, setQuestions] = useState<FlashWord[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showStar, setShowStar] = useState(false);
  const [roundScore, setRoundScore] = useState(0);
  const [aiAvailable, setAiAvailable] = useState(false);
  const [aiLevel, setAiLevel] = useState<number | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const isAIMode = selectedLevel > maxStaticLevel.flitslezen;

  useEffect(() => { checkAIAvailable().then(setAiAvailable); }, []);
  useEffect(() => {
    if (aiAvailable) {
      const lvl = getAvailableAILevel(flitslezenProgress, 'flitslezen');
      setAiLevel(lvl);
    }
  }, [aiAvailable, flitslezenProgress]);

  const startGame = useCallback(async () => {
    if (isAIMode) {
      setAiLoading(true);
      try {
        const aiData = await fetchAIExercises('flitslezen', selectedLevel, QUESTIONS_PER_ROUND);
        setQuestions(aiData as FlashWord[]);
      } catch {
        setQuestions(getFlashExercise(maxStaticLevel.flitslezen, QUESTIONS_PER_ROUND));
      } finally {
        setAiLoading(false);
      }
    } else {
      setQuestions(getFlashExercise(selectedLevel, QUESTIONS_PER_ROUND));
    }
    setCurrentQuestion(0);
    setRoundScore(0);
    setGamePhase('flash');
  }, [selectedLevel, isAIMode]);

  const currentQ = questions[currentQuestion];

  // Generate options when entering answer phase
  useEffect(() => {
    if (gamePhase === 'answer' && currentQ) {
      const pool = getFlashWordsByLevel(selectedLevel);
      const distractors = pool
        .filter((w) => w.word !== currentQ.word && Math.abs(w.word.length - currentQ.word.length) <= 3)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((w) => w.word);
      const allOptions = [currentQ.word, ...distractors].sort(() => Math.random() - 0.5);
      setOptions(allOptions);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  }, [gamePhase, currentQuestion, currentQ, selectedLevel]);

  // Auto-transition from flash to answer
  useEffect(() => {
    if (gamePhase === 'flash' && currentQ) {
      const timer = setTimeout(() => setGamePhase('answer'), flashDurations[speed]);
      return () => clearTimeout(timer);
    }
  }, [gamePhase, currentQ, speed]);

  const handleAnswer = useCallback((word: string) => {
    if (selectedAnswer !== null) return;
    const correct = word === currentQ.word;
    setSelectedAnswer(word);
    setIsCorrect(correct);

    if (correct) {
      setRoundScore((s) => s + 1);
      setShowStar(true);
      updateFlitslezenProgress(true, selectedLevel);
      addStars(2);
      addXP(isAIMode ? 25 : 15);
      incrementStreak();
    } else {
      updateFlitslezenProgress(false, selectedLevel);
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
        setGamePhase('flash');
      }
    }, 1500);
  }, [selectedAnswer, currentQ, currentQuestion, roundScore, selectedLevel, isAIMode, updateFlitslezenProgress, addStars, addXP, incrementStreak, resetStreak, addPerfectRound, checkAndUnlockBadges]);

  // ── Intro ──
  if (gamePhase === 'intro') {
    return (
      <div className="min-h-screen p-4 sm:p-6 max-w-2xl mx-auto">
        <BadgeNotification />
        <div className="mb-6"><BackButton /></div>
        <motion.div className="text-center" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="text-6xl mb-4">&#9889;</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Flitslezen</h1>
          <p className="text-lg text-gray-500 mb-6">Een woord flitst op het scherm. Welk woord was het?</p>

          {/* Speed selector */}
          <div className="mb-6">
            <label className="text-sm font-bold text-gray-400 mb-2 block">Snelheid</label>
            <div className="flex gap-2 justify-center">
              {(['easy', 'medium', 'hard'] as Speed[]).map((s) => (
                <button key={s} onClick={() => setSpeed(s)}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${speed === s ? 'bg-primary text-white shadow-lg' : 'bg-card-bg text-foreground shadow-md hover:shadow-lg'}`}>
                  {speedLabels[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Level selector */}
          <div className="grid gap-3 max-w-md mx-auto mb-8">
            {[1, 2, 3].map((lvl) => (
              <motion.button key={lvl} onClick={() => setSelectedLevel(lvl)}
                className={`p-4 rounded-2xl font-bold text-lg transition-all ${selectedLevel === lvl ? 'bg-primary text-white shadow-lg scale-105' : 'bg-card-bg text-foreground shadow-md'}`}
                whileTap={{ scale: 0.98 }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lvl === 1 ? '1' : lvl === 2 ? '2' : '3'}</span>
                  <div className="text-left">
                    <div>Niveau {lvl}</div>
                    <div className={`text-sm font-normal ${selectedLevel === lvl ? 'text-white/70' : 'text-gray-400'}`}>
                      {lvl === 1 ? 'Korte woorden' : lvl === 2 ? 'Middellange woorden' : 'Lange, moeilijke woorden'}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
            {aiAvailable && aiLevel && (
              <motion.button onClick={() => setSelectedLevel(aiLevel)}
                className={`p-4 rounded-2xl font-bold text-lg transition-all ${selectedLevel === aiLevel ? 'bg-gradient-to-r from-accent-purple to-primary text-white shadow-lg scale-105' : 'bg-card-bg text-foreground shadow-md border-2 border-dashed border-accent-purple/30'}`}
                whileTap={{ scale: 0.98 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🤖</span>
                  <div className="text-left">
                    <div>Niveau {aiLevel} <span className="text-xs font-normal opacity-70">(AI)</span></div>
                    <div className={`text-sm font-normal ${selectedLevel === aiLevel ? 'text-white/70' : 'text-gray-400'}`}>Extra uitdaging, door AI gegenereerd</div>
                  </div>
                </div>
              </motion.button>
            )}
          </div>

          <motion.button onClick={startGame} disabled={aiLoading}
            className="bg-gradient-to-r from-[#7c6aff] to-[#38bdf8] text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            whileHover={{ scale: aiLoading ? 1 : 1.05 }} whileTap={{ scale: aiLoading ? 1 : 0.95 }}>
            {aiLoading ? 'Laden...' : 'Start!'}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ── Result ──
  if (gamePhase === 'result') {
    const pct = Math.round((roundScore / QUESTIONS_PER_ROUND) * 100);
    const msg = pct === 100 ? 'Perfect! Bliksemsnelle ogen!' : pct >= 80 ? 'Super scherp!' : pct >= 60 ? 'Goed bezig!' : 'Oefening maakt de meester!';
    return (
      <div className="min-h-screen p-4 sm:p-6 max-w-2xl mx-auto flex items-center justify-center">
        <BadgeNotification />
        <motion.div className="bg-card-bg rounded-3xl shadow-2xl p-8 max-w-md w-full text-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
          {isAIMode && <p className="text-accent-purple text-sm font-bold mb-1">🤖 AI Niveau {selectedLevel}</p>}
          <div className="text-7xl mb-4">{pct >= 80 ? '⚡' : '💪'}</div>
          <h2 className="text-3xl font-bold mb-2">Klaar!</h2>
          <p className="text-lg text-gray-500 mb-6">{msg}</p>
          <div className="bg-background rounded-2xl p-4 mb-6">
            <div className="text-5xl font-bold text-primary mb-1">{roundScore}/{QUESTIONS_PER_ROUND}</div>
            <div className="text-gray-400">goed herkend</div>
          </div>
          <div className="flex flex-col gap-3">
            <motion.button onClick={startGame} className="bg-gradient-to-r from-[#7c6aff] to-[#38bdf8] text-white text-lg font-bold py-3 rounded-2xl shadow-lg" whileTap={{ scale: 0.98 }}>Nog een keer!</motion.button>
            <motion.button onClick={() => setGamePhase('intro')} className="bg-gray-100 text-foreground text-lg font-bold py-3 rounded-2xl" whileTap={{ scale: 0.98 }}>Instellingen</motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentQ) return null;

  // ── Flash / Answer ──
  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-2xl mx-auto">
      <StarReward show={showStar} />
      <BadgeNotification />
      <div className="flex items-center justify-between mb-4"><BackButton /><ScoreBoard /></div>
      <div className="mb-6"><ProgressBar current={currentQuestion + 1} total={QUESTIONS_PER_ROUND} color="#7c6aff" /></div>

      <AnimatePresence mode="wait">
        {gamePhase === 'flash' && (
          <motion.div key={`flash-${currentQuestion}`} className="text-center mt-16" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="bg-card-bg rounded-3xl shadow-2xl inline-block px-12 py-10">
              <span className="text-4xl sm:text-5xl font-bold text-primary">{currentQ.word}</span>
            </div>
            <p className="text-sm text-gray-400 mt-4">Kijk goed!</p>
          </motion.div>
        )}

        {gamePhase === 'answer' && (
          <motion.div key={`answer-${currentQuestion}`} className="text-center" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <p className="text-xl text-gray-500 mb-6 font-bold mt-4">Welk woord was het?</p>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {options.map((word, i) => {
                const isSelected = selectedAnswer === word;
                const isCorrectOpt = word === currentQ.word;
                let style = 'bg-card-bg shadow-lg';
                if (selectedAnswer !== null) {
                  if (isCorrectOpt) style = 'bg-green-100 shadow-lg ring-4 ring-green-400';
                  else if (isSelected) style = 'bg-red-100 shadow-lg ring-4 ring-red-400';
                  else style = 'bg-card-bg/50 shadow';
                }
                return (
                  <motion.button key={word + i} onClick={() => handleAnswer(word)} disabled={selectedAnswer !== null}
                    className={`${style} rounded-2xl p-4 sm:p-5 transition-all text-lg sm:text-xl font-bold text-foreground`}
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.08 }}
                    whileHover={selectedAnswer === null ? { scale: 1.05 } : {}} whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}>
                    {word}
                  </motion.button>
                );
              })}
            </div>
            <AnimatePresence>
              {isCorrect !== null && (
                <motion.div className={`mt-6 text-xl font-bold ${isCorrect ? 'text-green-500' : 'text-orange-500'}`} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                  {isCorrect ? 'Goed gezien!' : `Het was: ${currentQ.word}`}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
