'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '@/components/BackButton';
import ProgressBar from '@/components/ProgressBar';
import ScoreBoard from '@/components/ScoreBoard';
import StarReward from '@/components/StarReward';
import BadgeNotification from '@/components/BadgeNotification';
import { getWordPartsExercise, typeLabels, type WordPartData } from '@/data/woorddelen';
import { useGameStore } from '@/store/useGameStore';
import { speakWord, stopSpeaking } from '@/lib/speech';
import { getAvailableAILevel, maxStaticLevel, checkAIAvailable } from '@/lib/adaptive';
import { fetchAIExercises } from '@/lib/aiExercises';

const QUESTIONS_PER_ROUND = 8;
type GamePhase = 'intro' | 'playing' | 'result';

const partColors = ['#7c6aff', '#ff5c8a', '#34d399', '#fbbf24', '#38bdf8', '#c084fc'];

export default function WoorddelenPage() {
  const { level, soundEnabled, woorddelenProgress, updateWoorddelenProgress, addStars, addXP, incrementStreak, resetStreak, addPerfectRound, checkAndUnlockBadges } = useGameStore();

  const [gamePhase, setGamePhase] = useState<GamePhase>('intro');
  const [selectedLevel, setSelectedLevel] = useState(Math.min(level, 3));
  const [questions, setQuestions] = useState<WordPartData[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedSplitIndex, setSelectedSplitIndex] = useState<number | null>(null);
  const [splitOptions, setSplitOptions] = useState<string[][]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showStar, setShowStar] = useState(false);
  const [roundScore, setRoundScore] = useState(0);

  const [aiAvailable, setAiAvailable] = useState(false);
  const [aiLevel, setAiLevel] = useState<number | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const isAIMode = selectedLevel > maxStaticLevel.woorddelen;

  useEffect(() => {
    checkAIAvailable().then(setAiAvailable);
  }, []);

  useEffect(() => {
    if (aiAvailable) {
      setAiLevel(getAvailableAILevel(woorddelenProgress, 'woorddelen'));
    } else {
      setAiLevel(null);
    }
  }, [aiAvailable, woorddelenProgress]);

  const startGame = useCallback(async () => {
    if (isAIMode) {
      setAiLoading(true);
      try {
        const fetched = await fetchAIExercises('woorddelen', selectedLevel, QUESTIONS_PER_ROUND);
        const typed = fetched as WordPartData[];
        if (typed.length >= QUESTIONS_PER_ROUND) {
          setQuestions(typed.slice(0, QUESTIONS_PER_ROUND));
          setCurrentQuestion(0);
          setRoundScore(0);
          setGamePhase('playing');
        } else {
          setQuestions(getWordPartsExercise(maxStaticLevel.woorddelen, QUESTIONS_PER_ROUND));
          setCurrentQuestion(0);
          setRoundScore(0);
          setGamePhase('playing');
        }
      } catch {
        setQuestions(getWordPartsExercise(maxStaticLevel.woorddelen, QUESTIONS_PER_ROUND));
        setCurrentQuestion(0);
        setRoundScore(0);
        setGamePhase('playing');
      } finally {
        setAiLoading(false);
      }
    } else {
      setQuestions(getWordPartsExercise(selectedLevel, QUESTIONS_PER_ROUND));
      setCurrentQuestion(0);
      setRoundScore(0);
      setGamePhase('playing');
    }
  }, [selectedLevel, isAIMode]);

  const currentQ = questions[currentQuestion];

  // Generate split options for current question
  useEffect(() => {
    if (gamePhase === 'playing' && currentQ) {
      const correct = currentQ.parts;
      const word = currentQ.word;

      // Generate wrong splits by splitting at different positions
      const wrongSplits: string[][] = [];
      for (let i = 1; i < word.length; i++) {
        const split = [word.slice(0, i), word.slice(i)];
        const splitStr = split.join('|');
        const correctStr = correct.join('|');
        if (splitStr !== correctStr) {
          wrongSplits.push(split);
        }
      }

      // For 3-part words, also generate some 2-part wrong answers
      if (correct.length === 3) {
        // Already have 2-part wrong splits above, which is good contrast
      }

      // Shuffle and pick 3 wrong ones
      const picked = wrongSplits.sort(() => Math.random() - 0.5).slice(0, 3);
      const all = [correct, ...picked].sort(() => Math.random() - 0.5);
      setSplitOptions(all);
      setSelectedSplitIndex(null);
      setIsCorrect(null);
    }
  }, [gamePhase, currentQuestion, currentQ]);

  // Auto-speak word on new question
  useEffect(() => {
    if (gamePhase === 'playing' && currentQ && soundEnabled) {
      const timer = setTimeout(() => speakWord(currentQ.word), 400);
      return () => { clearTimeout(timer); stopSpeaking(); };
    }
  }, [gamePhase, currentQuestion, currentQ, soundEnabled]);

  const handleAnswer = useCallback((idx: number) => {
    if (selectedSplitIndex !== null) return;
    const selected = splitOptions[idx];
    const correct = selected.join('') === currentQ.parts.join('') && selected.length === currentQ.parts.length && selected.every((p, i) => p === currentQ.parts[i]);
    setSelectedSplitIndex(idx);
    setIsCorrect(correct);

    if (correct) {
      setRoundScore((s) => s + 1);
      setShowStar(true);
      updateWoorddelenProgress(true, selectedLevel);
      addStars(2);
      addXP(isAIMode ? 25 : 15);
      incrementStreak();
    } else {
      updateWoorddelenProgress(false, selectedLevel);
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
  }, [selectedSplitIndex, splitOptions, currentQ, currentQuestion, roundScore, selectedLevel, isAIMode, updateWoorddelenProgress, addStars, addXP, incrementStreak, resetStreak, addPerfectRound, checkAndUnlockBadges]);

  // Intro
  if (gamePhase === 'intro') {
    return (
      <div className="min-h-screen p-4 sm:p-6 max-w-2xl mx-auto">
        <BadgeNotification />
        <div className="mb-6"><BackButton /></div>
        <motion.div className="text-center" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="text-6xl mb-4">&#128270;</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Woorddelen</h1>
          <p className="text-lg text-gray-500 mb-4">Hoe is dit woord opgebouwd? Splits het in delen!</p>

          <div className="bg-card-bg rounded-2xl shadow-lg p-4 mb-6 max-w-sm mx-auto">
            <p className="text-sm text-gray-400 mb-2">Voorbeeld:</p>
            <div className="flex items-center justify-center gap-1 text-xl font-bold">
              <span className="px-2 py-1 rounded-lg" style={{ backgroundColor: `${partColors[0]}20`, color: partColors[0] }}>voet</span>
              <span className="text-gray-300">+</span>
              <span className="px-2 py-1 rounded-lg" style={{ backgroundColor: `${partColors[1]}20`, color: partColors[1] }}>bal</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">= voetbal (samenstelling)</p>
          </div>

          <div className="grid gap-3 max-w-md mx-auto mb-8">
            {[1, 2, 3].map((lvl) => (
              <motion.button key={lvl} onClick={() => setSelectedLevel(lvl)}
                className={`p-4 rounded-2xl font-bold text-lg transition-all ${selectedLevel === lvl ? 'bg-accent-green text-white shadow-lg scale-105' : 'bg-card-bg text-foreground shadow-md'}`}
                whileTap={{ scale: 0.98 }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lvl}</span>
                  <div className="text-left">
                    <div>Niveau {lvl}</div>
                    <div className={`text-sm font-normal ${selectedLevel === lvl ? 'text-white/70' : 'text-gray-400'}`}>
                      {lvl === 1 ? 'Samenstellingen' : lvl === 2 ? 'Voor- en achtervoegels' : 'Complex (3 delen)'}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
            {aiAvailable && aiLevel && (
              <motion.button onClick={() => setSelectedLevel(aiLevel)}
                className={`p-4 rounded-2xl font-bold text-lg transition-all ${selectedLevel === aiLevel ? 'bg-gradient-to-r from-accent-green to-primary text-white shadow-lg scale-105' : 'bg-card-bg text-foreground shadow-md border-2 border-dashed border-accent-green/30'}`}
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

          <motion.button
            onClick={startGame}
            disabled={aiLoading}
            className="bg-gradient-to-r from-[#34d399] to-[#38bdf8] text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            whileHover={!aiLoading ? { scale: 1.05 } : {}} whileTap={!aiLoading ? { scale: 0.95 } : {}}>
            {aiLoading ? 'Laden...' : 'Start!'}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Result
  if (gamePhase === 'result') {
    const pct = Math.round((roundScore / QUESTIONS_PER_ROUND) * 100);
    const msg = pct === 100 ? 'Perfect! Jij snapt hoe woorden werken!' : pct >= 70 ? 'Goed gedaan!' : 'Volhouden!';
    return (
      <div className="min-h-screen p-4 sm:p-6 max-w-2xl mx-auto flex items-center justify-center">
        <BadgeNotification />
        <motion.div className="bg-card-bg rounded-3xl shadow-2xl p-8 max-w-md w-full text-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
          <div className="text-7xl mb-4">{pct >= 70 ? '🧠' : '💪'}</div>
          <h2 className="text-3xl font-bold mb-2">Klaar!</h2>
          {isAIMode && (
            <div className="inline-block bg-accent-green/15 text-accent-green px-3 py-1 rounded-full text-sm font-bold mb-2">🤖 AI-niveau</div>
          )}
          <p className="text-lg text-gray-500 mb-6">{msg}</p>
          <div className="bg-background rounded-2xl p-4 mb-6">
            <div className="text-5xl font-bold text-accent-green mb-1">{roundScore}/{QUESTIONS_PER_ROUND}</div>
          </div>
          <div className="flex flex-col gap-3">
            <motion.button onClick={startGame} className="bg-gradient-to-r from-[#34d399] to-[#38bdf8] text-white text-lg font-bold py-3 rounded-2xl shadow-lg" whileTap={{ scale: 0.98 }}>Nog een keer!</motion.button>
            <motion.button onClick={() => setGamePhase('intro')} className="bg-gray-100 text-foreground text-lg font-bold py-3 rounded-2xl" whileTap={{ scale: 0.98 }}>Ander niveau</motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentQ) return null;

  // Playing
  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-2xl mx-auto">
      <StarReward show={showStar} />
      <BadgeNotification />
      <div className="flex items-center justify-between mb-4"><BackButton /><ScoreBoard /></div>
      <div className="mb-6"><ProgressBar current={currentQuestion + 1} total={QUESTIONS_PER_ROUND} color="#34d399" /></div>

      <AnimatePresence mode="wait">
        <motion.div key={currentQuestion} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="text-center">
          {/* Type label */}
          <div className="inline-block bg-accent-green/15 text-accent-green px-3 py-1 rounded-full text-sm font-bold mb-3">
            {typeLabels[currentQ.type]}
          </div>

          {/* Word */}
          <motion.button onClick={() => soundEnabled && speakWord(currentQ.word)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <div className="bg-card-bg rounded-2xl shadow-lg px-8 py-5 inline-block mb-2">
              <span className="text-3xl sm:text-4xl font-bold text-foreground">{currentQ.word}</span>
            </div>
          </motion.button>
          <p className="text-gray-500 mb-1 text-sm italic">{currentQ.hint}</p>
          <p className="text-lg text-gray-500 mb-5 font-bold">Hoe splits je dit woord?</p>

          {/* Split options */}
          <div className="flex flex-col gap-3 max-w-md mx-auto">
            {splitOptions.map((option, idx) => {
              const isSelected = selectedSplitIndex === idx;
              const isCorrectOpt = option.join('') === currentQ.parts.join('') && option.length === currentQ.parts.length && option.every((p, i) => p === currentQ.parts[i]);

              let style = 'bg-card-bg shadow-lg';
              if (selectedSplitIndex !== null) {
                if (isCorrectOpt) style = 'bg-green-100 shadow-lg ring-4 ring-green-400';
                else if (isSelected) style = 'bg-red-100 shadow-lg ring-4 ring-red-400';
                else style = 'bg-card-bg/50 shadow';
              }

              return (
                <motion.button key={idx} onClick={() => handleAnswer(idx)} disabled={selectedSplitIndex !== null}
                  className={`${style} rounded-2xl p-4 transition-all`}
                  initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: idx * 0.08 }}
                  whileHover={selectedSplitIndex === null ? { scale: 1.03 } : {}} whileTap={selectedSplitIndex === null ? { scale: 0.97 } : {}}>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {option.map((part, pi) => (
                      <span key={pi} className="flex items-center gap-2">
                        {pi > 0 && <span className="text-gray-300 text-lg">+</span>}
                        <span className="px-3 py-1 rounded-lg text-lg font-bold" style={{
                          backgroundColor: `${partColors[pi % partColors.length]}15`,
                          color: partColors[pi % partColors.length],
                        }}>
                          {part}
                        </span>
                      </span>
                    ))}
                  </div>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {isCorrect !== null && (
              <motion.div className={`mt-5 text-xl font-bold ${isCorrect ? 'text-green-500' : 'text-orange-500'}`} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                {isCorrect ? 'Goed gesplitst!' : `Het was: ${currentQ.parts.join(' + ')}`}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
