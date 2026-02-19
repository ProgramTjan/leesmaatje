'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '@/components/BackButton';
import ProgressBar from '@/components/ProgressBar';
import ScoreBoard from '@/components/ScoreBoard';
import StarReward from '@/components/StarReward';
import BadgeNotification from '@/components/BadgeNotification';
import { getBuildExerciseWords, shuffleWord, type BuildWordData } from '@/data/woorden';
import { useGameStore } from '@/store/useGameStore';
import { speakWord, speakEncouragement, stopSpeaking } from '@/lib/speech';
import { getAvailableAILevel, maxStaticLevel, checkAIAvailable } from '@/lib/adaptive';
import { fetchAIExercises } from '@/lib/aiExercises';

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

function shuffleWordLetters(word: string): string[] {
  const letters = word.split('');
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  if (letters.join('') === word && word.length > 1) {
    [letters[0], letters[letters.length - 1]] = [letters[letters.length - 1], letters[0]];
  }
  return letters;
}

export default function WoordenPage() {
  const {
    level,
    soundEnabled,
    currentStreak,
    woordenProgress,
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

  // AI state
  const [aiAvailable, setAiAvailable] = useState(false);
  const [aiLevel, setAiLevel] = useState<number | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const isAIMode = selectedLevel > maxStaticLevel.woorden;

  useEffect(() => {
    checkAIAvailable().then(setAiAvailable);
  }, []);

  useEffect(() => {
    if (aiAvailable) {
      const lvl = getAvailableAILevel(woordenProgress, 'woorden');
      setAiLevel(lvl);
    }
  }, [aiAvailable, woordenProgress]);

  const startGame = useCallback(async () => {
    if (isAIMode) {
      setAiLoading(true);
      try {
        const aiData = await fetchAIExercises('woorden', selectedLevel, QUESTIONS_PER_ROUND);
        const qs: Question[] = (aiData as BuildWordData[]).map((w) => ({
          word: { ...w, level: selectedLevel },
          shuffledLetters: shuffleWordLetters(w.word),
        }));
        setQuestions(qs);
      } catch {
        // Fallback to max static level
        setQuestions(generateQuestions(maxStaticLevel.woorden));
      } finally {
        setAiLoading(false);
      }
    } else {
      setQuestions(generateQuestions(selectedLevel));
    }
    setCurrentQuestion(0);
    setRoundScore(0);
    setGamePhase('playing');
  }, [selectedLevel, isAIMode]);

  const currentQ = questions[currentQuestion];

  useEffect(() => {
    if (gamePhase === 'playing' && currentQ) {
      const letters = currentQ.shuffledLetters.map((l, i) => ({ letter: l, origIdx: i }));
      setAvailableLetters(letters);
      setSelectedLetters([]);
      setIsCorrect(null);
      setHasChecked(false);
    }
  }, [gamePhase, currentQuestion, currentQ]);

  useEffect(() => {
    if (gamePhase === 'playing' && currentQ && soundEnabled) {
      const timer = setTimeout(() => speakWord(currentQ.word.word), 400);
      return () => { clearTimeout(timer); stopSpeaking(); };
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
      updateWoordenProgress(true, selectedLevel);
      addStars(2);
      addXP(isAIMode ? 25 : 15);
      incrementStreak();
      if (soundEnabled && (currentStreak + 1) % 5 === 0) {
        speakEncouragement();
      }
    } else {
      updateWoordenProgress(false, selectedLevel);
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
      }
    }, 2000);
  }, [hasChecked, selectedLetters, currentQ, currentQuestion, roundScore, selectedLevel, isAIMode, updateWoordenProgress, addStars, addXP, incrementStreak, resetStreak, addPerfectRound, checkAndUnlockBadges]);

  useEffect(() => {
    if (gamePhase === 'playing' && currentQ && selectedLetters.length === currentQ.word.word.length && !hasChecked) {
      const timer = setTimeout(checkAnswer, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedLetters, currentQ, hasChecked, gamePhase, checkAnswer]);

  // ── Intro ──
  if (gamePhase === 'intro') {
    const staticLevels = [1, 2, 3, 4, 5];

    return (
      <div className="min-h-screen p-4 sm:p-6 max-w-2xl mx-auto">
        <BadgeNotification />
        <div className="mb-6"><BackButton /></div>
        <motion.div className="text-center" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="text-6xl mb-4">🧩</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Woorden Bouwen</h1>
          <p className="text-lg text-gray-500 mb-4">Luister naar het woord en bouw het met letters!</p>

          <div className="bg-card-bg rounded-2xl shadow-lg p-4 mb-8 max-w-sm mx-auto">
            <p className="text-sm text-gray-400 mb-2">Voorbeeld: 🐱</p>
            <div className="flex justify-center gap-2 mb-2">
              {['k', 'a', 't'].map((l, i) => (
                <motion.div key={i} className="w-12 h-12 bg-accent-green/20 rounded-xl flex items-center justify-center text-2xl font-bold text-accent-green"
                  initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 + i * 0.2 }}>
                  {l}
                </motion.div>
              ))}
            </div>
            <p className="text-sm text-gray-400">= kat!</p>
          </div>

          <div className="grid gap-3 max-w-md mx-auto mb-8">
            {staticLevels.map((lvl) => (
              <motion.button key={lvl} onClick={() => setSelectedLevel(lvl)}
                className={`p-4 rounded-2xl font-bold text-lg transition-all ${selectedLevel === lvl ? 'bg-accent-green text-white shadow-lg scale-105' : 'bg-card-bg text-foreground shadow-md'}`}
                whileTap={{ scale: 0.98 }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lvl}</span>
                  <div className="text-left">
                    <div>Niveau {lvl}</div>
                    <div className={`text-sm font-normal ${selectedLevel === lvl ? 'text-white/70' : 'text-gray-400'}`}>
                      {lvl <= 2 ? 'Korte woorden' : lvl === 3 ? 'Langere woorden' : lvl === 4 ? 'Complexe woorden' : 'Zeer moeilijk'}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}

            {/* AI level */}
            {aiAvailable && aiLevel && (
              <motion.button onClick={() => setSelectedLevel(aiLevel)}
                className={`p-4 rounded-2xl font-bold text-lg transition-all ${selectedLevel === aiLevel ? 'bg-gradient-to-r from-accent-purple to-primary text-white shadow-lg scale-105' : 'bg-card-bg text-foreground shadow-md border-2 border-dashed border-accent-purple/30'}`}
                whileTap={{ scale: 0.98 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🤖</span>
                  <div className="text-left">
                    <div>Niveau {aiLevel} <span className="text-xs font-normal opacity-70">(AI)</span></div>
                    <div className={`text-sm font-normal ${selectedLevel === aiLevel ? 'text-white/70' : 'text-gray-400'}`}>
                      Extra uitdaging, door AI gegenereerd
                    </div>
                  </div>
                </div>
              </motion.button>
            )}
          </div>

          <motion.button onClick={startGame} disabled={aiLoading}
            className="bg-gradient-to-r from-[#4ecdc4] to-[#45b7d1] text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-lg disabled:opacity-50"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {aiLoading ? 'Laden...' : 'Start!'}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ── Result ──
  if (gamePhase === 'result') {
    const pct = Math.round((roundScore / QUESTIONS_PER_ROUND) * 100);
    const msg = pct === 100 ? 'Perfecte ronde!' : pct >= 80 ? 'Wat knap!' : pct >= 60 ? 'Lekker bezig!' : 'Oefenen maakt de meester!';
    return (
      <div className="min-h-screen p-4 sm:p-6 max-w-2xl mx-auto flex items-center justify-center">
        <BadgeNotification />
        <motion.div className="bg-card-bg rounded-3xl shadow-2xl p-8 max-w-md w-full text-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
          <div className="text-7xl mb-4">{pct >= 80 ? '🎉' : '💪'}</div>
          <h2 className="text-3xl font-bold mb-2">Klaar!</h2>
          {isAIMode && <p className="text-accent-purple text-sm font-bold mb-1">🤖 AI Niveau {selectedLevel}</p>}
          <p className="text-lg text-gray-500 mb-6">{msg}</p>
          <div className="bg-background rounded-2xl p-4 mb-6">
            <div className="text-5xl font-bold text-accent-green mb-1">{roundScore}/{QUESTIONS_PER_ROUND}</div>
          </div>
          <div className="flex flex-col gap-3">
            <motion.button onClick={startGame} className="bg-gradient-to-r from-[#4ecdc4] to-[#45b7d1] text-white text-lg font-bold py-3 rounded-2xl shadow-lg" whileTap={{ scale: 0.98 }}>Nog een keer!</motion.button>
            <motion.button onClick={() => setGamePhase('intro')} className="bg-gray-100 text-foreground text-lg font-bold py-3 rounded-2xl" whileTap={{ scale: 0.98 }}>Ander niveau</motion.button>
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
      <div className="flex items-center justify-between mb-4"><BackButton /><ScoreBoard /></div>
      <div className="mb-6"><ProgressBar current={currentQuestion + 1} total={QUESTIONS_PER_ROUND} color="#4ecdc4" /></div>

      <AnimatePresence mode="wait">
        <motion.div key={currentQuestion} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="text-center">
          <motion.div className="text-5xl mb-2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}>
            {currentQ.word.emoji}
          </motion.div>
          <p className="text-gray-500 mb-1 text-base italic">{currentQ.word.hint}</p>

          <motion.button onClick={() => soundEnabled && speakWord(currentQ.word.word)}
            className="inline-flex items-center gap-2 bg-card-bg rounded-full px-4 py-2 shadow-md mb-4 text-lg font-bold"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            🔊 Luister
          </motion.button>

          <div className="bg-card-bg rounded-2xl shadow-lg p-4 mb-4 min-h-[72px]">
            <div className="flex justify-center gap-2 flex-wrap">
              {Array.from({ length: currentQ.word.word.length }).map((_, i) => {
                const pl = selectedLetters[i];
                const isWrong = isCorrect === false && pl && pl.letter !== currentQ.word.word[i];
                return (
                  <motion.div key={i} layout onClick={() => pl && deselectLetter(pl)}
                    className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 border-dashed flex items-center justify-center text-2xl sm:text-3xl font-bold transition-all ${
                      pl ? isCorrect === true ? 'bg-green-100 border-green-400 text-green-600' : isWrong ? 'bg-red-100 border-red-400 text-red-600' : 'bg-accent-green/10 border-accent-green text-foreground' : 'border-gray-300 text-gray-300'
                    }`}>
                    {pl ? <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>{pl.letter}</motion.span> : <span className="text-lg">_</span>}
                  </motion.div>
                );
              })}
            </div>
            {isCorrect === false && (
              <motion.div className="mt-3 text-lg font-bold text-orange-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Het juiste woord is: <span className="text-accent-green">{currentQ.word.word}</span>
              </motion.div>
            )}
          </div>

          <div className="flex justify-center gap-2 flex-wrap mb-4">
            {availableLetters.map((item) => (
              <motion.button key={item.origIdx} onClick={() => selectLetter(item)} disabled={hasChecked}
                className="w-12 h-14 sm:w-14 sm:h-16 bg-card-bg rounded-xl shadow-lg flex items-center justify-center text-2xl sm:text-3xl font-bold text-foreground hover:bg-accent-green/10 hover:shadow-xl transition-all disabled:opacity-50"
                layout whileHover={!hasChecked ? { scale: 1.1, y: -4 } : {}} whileTap={!hasChecked ? { scale: 0.9 } : {}}
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                {item.letter}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {isCorrect !== null && (
              <motion.div className={`text-xl font-bold ${isCorrect ? 'text-green-500' : 'text-orange-500'}`} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>
                {isCorrect ? 'Goed gespeld!' : 'Volgende keer beter!'}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
