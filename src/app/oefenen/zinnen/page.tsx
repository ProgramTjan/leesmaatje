'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '@/components/BackButton';
import ProgressBar from '@/components/ProgressBar';
import ScoreBoard from '@/components/ScoreBoard';
import StarReward from '@/components/StarReward';
import BadgeNotification from '@/components/BadgeNotification';
import { getExerciseSentences, shuffleSentence, type SentenceData } from '@/data/zinnen';
import { useGameStore } from '@/store/useGameStore';
import { speak, speakEncouragement, stopSpeaking } from '@/lib/speech';
import { getAvailableAILevel, maxStaticLevel, checkAIAvailable } from '@/lib/adaptive';
import { fetchAIExercises } from '@/lib/aiExercises';

const QUESTIONS_PER_ROUND = 8;

type GamePhase = 'intro' | 'playing' | 'result';

interface Question {
  sentence: SentenceData;
  shuffledWords: string[];
}

function generateQuestions(level: number): Question[] {
  const sents = getExerciseSentences(level, QUESTIONS_PER_ROUND);
  return sents.map((sentence) => ({
    sentence,
    shuffledWords: shuffleSentence(sentence.words),
  }));
}

export default function ZinnenPage() {
  const {
    level,
    soundEnabled,
    currentStreak,
    zinnenProgress,
    updateZinnenProgress,
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
  const [selectedWords, setSelectedWords] = useState<{ word: string; origIdx: number }[]>([]);
  const [availableWords, setAvailableWords] = useState<{ word: string; origIdx: number }[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showStar, setShowStar] = useState(false);
  const [roundScore, setRoundScore] = useState(0);
  const [hasChecked, setHasChecked] = useState(false);

  // AI state
  const [aiAvailable, setAiAvailable] = useState(false);
  const [aiLevel, setAiLevel] = useState<number | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const isAIMode = selectedLevel > maxStaticLevel.zinnen;

  useEffect(() => {
    checkAIAvailable().then(setAiAvailable);
  }, []);

  useEffect(() => {
    if (aiAvailable) {
      const lvl = getAvailableAILevel(zinnenProgress, 'zinnen');
      setAiLevel(lvl);
    }
  }, [aiAvailable, zinnenProgress]);

  const startGame = useCallback(async () => {
    if (isAIMode) {
      setAiLoading(true);
      try {
        const aiData = await fetchAIExercises('zinnen', selectedLevel, QUESTIONS_PER_ROUND);
        const qs: Question[] = (aiData as SentenceData[]).map((s) => ({
          sentence: { ...s, level: selectedLevel },
          shuffledWords: shuffleSentence(s.words),
        }));
        setQuestions(qs);
      } catch {
        setQuestions(generateQuestions(maxStaticLevel.zinnen));
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
      const words = currentQ.shuffledWords.map((w, i) => ({ word: w, origIdx: i }));
      setAvailableWords(words);
      setSelectedWords([]);
      setIsCorrect(null);
      setHasChecked(false);
    }
  }, [gamePhase, currentQuestion, currentQ]);

  useEffect(() => {
    if (gamePhase === 'playing' && currentQ && soundEnabled) {
      const timer = setTimeout(() => speak(currentQ.sentence.words.join(' '), 0.8), 400);
      return () => { clearTimeout(timer); stopSpeaking(); };
    }
  }, [gamePhase, currentQuestion, currentQ, soundEnabled]);

  const selectWord = (item: { word: string; origIdx: number }) => {
    if (hasChecked) return;
    setAvailableWords((prev) => prev.filter((w) => w.origIdx !== item.origIdx));
    setSelectedWords((prev) => [...prev, item]);
  };

  const deselectWord = (item: { word: string; origIdx: number }) => {
    if (hasChecked) return;
    setSelectedWords((prev) => prev.filter((w) => w.origIdx !== item.origIdx));
    setAvailableWords((prev) => [...prev, item]);
  };

  const checkAnswer = useCallback(() => {
    if (hasChecked || selectedWords.length !== currentQ.sentence.words.length) return;
    setHasChecked(true);
    const builtSentence = selectedWords.map((w) => w.word);
    const correct = builtSentence.every((w, i) => w === currentQ.sentence.words[i]);
    setIsCorrect(correct);

    if (correct) {
      setRoundScore((s) => s + 1);
      setShowStar(true);
      updateZinnenProgress(true, selectedLevel);
      addStars(3);
      addXP(isAIMode ? 30 : 20);
      incrementStreak();
      if (soundEnabled && (currentStreak + 1) % 5 === 0) {
        speakEncouragement();
      }
    } else {
      updateZinnenProgress(false, selectedLevel);
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
    }, 2500);
  }, [hasChecked, selectedWords, currentQ, currentQuestion, roundScore, selectedLevel, isAIMode, updateZinnenProgress, addStars, addXP, incrementStreak, resetStreak, addPerfectRound, checkAndUnlockBadges]);

  useEffect(() => {
    if (gamePhase === 'playing' && currentQ && selectedWords.length === currentQ.sentence.words.length && !hasChecked) {
      const timer = setTimeout(checkAnswer, 600);
      return () => clearTimeout(timer);
    }
  }, [selectedWords, currentQ, hasChecked, gamePhase, checkAnswer]);

  // ── Intro ──
  if (gamePhase === 'intro') {
    const staticLevels = [1, 2, 3, 4, 5];
    return (
      <div className="min-h-screen p-4 sm:p-6 max-w-2xl mx-auto">
        <BadgeNotification />
        <div className="mb-6"><BackButton /></div>
        <motion.div className="text-center" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Zinnen Bouwen</h1>
          <p className="text-lg text-gray-500 mb-4">Zet de woorden in de goede volgorde!</p>

          <div className="bg-card-bg rounded-2xl shadow-lg p-4 mb-8 max-w-sm mx-auto">
            <p className="text-sm text-gray-400 mb-2">Voorbeeld: 😺💤</p>
            <div className="flex justify-center gap-2 flex-wrap mb-2">
              {['de', 'kat', 'slaapt'].map((w, i) => (
                <motion.div key={i} className="px-3 py-2 bg-accent-orange/20 rounded-xl text-lg font-bold text-accent-orange"
                  initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 + i * 0.2 }}>
                  {w}
                </motion.div>
              ))}
            </div>
            <p className="text-sm text-gray-400">= De kat slaapt!</p>
          </div>

          <div className="grid gap-3 max-w-md mx-auto mb-8">
            {staticLevels.map((lvl) => (
              <motion.button key={lvl} onClick={() => setSelectedLevel(lvl)}
                className={`p-4 rounded-2xl font-bold text-lg transition-all ${selectedLevel === lvl ? 'bg-accent-orange text-white shadow-lg scale-105' : 'bg-card-bg text-foreground shadow-md'}`}
                whileTap={{ scale: 0.98 }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lvl}</span>
                  <div className="text-left">
                    <div>Niveau {lvl}</div>
                    <div className={`text-sm font-normal ${selectedLevel === lvl ? 'text-white/70' : 'text-gray-400'}`}>
                      {lvl <= 2 ? 'Korte zinnen' : lvl === 3 ? 'Langere zinnen' : lvl === 4 ? 'Complexe zinnen' : 'Zeer moeilijk'}
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
            className="bg-gradient-to-r from-[#ff8a5c] to-[#ff6b9d] text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-lg disabled:opacity-50"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {aiLoading ? 'Laden...' : 'Start! 📝'}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ── Result ──
  if (gamePhase === 'result') {
    const pct = Math.round((roundScore / QUESTIONS_PER_ROUND) * 100);
    const msg = pct === 100 ? 'Alle zinnen goed!' : pct >= 80 ? 'Super!' : pct >= 60 ? 'Goed bezig!' : 'Oefening baart kunst!';
    return (
      <div className="min-h-screen p-4 sm:p-6 max-w-2xl mx-auto flex items-center justify-center">
        <BadgeNotification />
        <motion.div className="bg-card-bg rounded-3xl shadow-2xl p-8 max-w-md w-full text-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
          <div className="text-7xl mb-4">{pct >= 80 ? '🎉' : '💪'}</div>
          <h2 className="text-3xl font-bold mb-2">Klaar!</h2>
          {isAIMode && <p className="text-accent-purple text-sm font-bold mb-1">🤖 AI Niveau {selectedLevel}</p>}
          <p className="text-lg text-gray-500 mb-6">{msg}</p>
          <div className="bg-background rounded-2xl p-4 mb-6">
            <div className="text-5xl font-bold text-accent-orange mb-1">{roundScore}/{QUESTIONS_PER_ROUND}</div>
          </div>
          <div className="flex flex-col gap-3">
            <motion.button onClick={startGame} disabled={aiLoading}
              className="bg-gradient-to-r from-[#ff8a5c] to-[#ff6b9d] text-white text-lg font-bold py-3 rounded-2xl shadow-lg disabled:opacity-50"
              whileTap={{ scale: 0.98 }}>
              {aiLoading ? 'Laden...' : 'Nog een keer!'}
            </motion.button>
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
      <div className="mb-6"><ProgressBar current={currentQuestion + 1} total={QUESTIONS_PER_ROUND} color="#ff8a5c" /></div>

      <AnimatePresence mode="wait">
        <motion.div key={currentQuestion} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="text-center">
          <motion.div className="text-5xl mb-2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}>
            {currentQ.sentence.emoji}
          </motion.div>

          <motion.button onClick={() => soundEnabled && speak(currentQ.sentence.words.join(' '), 0.8)}
            className="inline-flex items-center gap-2 bg-card-bg rounded-full px-4 py-2 shadow-md mb-4 text-lg font-bold"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            🔊 Luister naar de zin
          </motion.button>

          <p className="text-lg text-gray-500 mb-4 font-bold">Zet de woorden in de goede volgorde!</p>

          <div className="bg-card-bg rounded-2xl shadow-lg p-4 mb-4 min-h-[64px]">
            <div className="flex justify-center gap-2 flex-wrap">
              {selectedWords.length === 0 ? (
                <span className="text-gray-300 text-lg py-2">Tik op de woorden hieronder...</span>
              ) : (
                selectedWords.map((item, i) => {
                  const isWrong = isCorrect === false && item.word !== currentQ.sentence.words[i];
                  return (
                    <motion.button key={`sel-${item.origIdx}`} onClick={() => deselectWord(item)} disabled={hasChecked}
                      className={`px-4 py-2 rounded-xl text-lg font-bold transition-all ${isCorrect === true ? 'bg-green-100 text-green-600' : isWrong ? 'bg-red-100 text-red-600' : 'bg-accent-orange/15 text-accent-orange hover:bg-accent-orange/25'}`}
                      layout initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                      {item.word}
                    </motion.button>
                  );
                })
              )}
            </div>
            {isCorrect === false && (
              <motion.div className="mt-3 text-base font-bold text-orange-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                De goede zin is: <span className="text-accent-green">{currentQ.sentence.words.join(' ')}</span>
              </motion.div>
            )}
          </div>

          <div className="flex justify-center gap-2 flex-wrap mb-4">
            {availableWords.map((item) => (
              <motion.button key={`avail-${item.origIdx}`} onClick={() => selectWord(item)} disabled={hasChecked}
                className="px-4 py-3 bg-card-bg rounded-xl shadow-lg text-lg font-bold text-foreground hover:bg-accent-orange/10 hover:shadow-xl transition-all disabled:opacity-50"
                layout whileHover={!hasChecked ? { scale: 1.05, y: -4 } : {}} whileTap={!hasChecked ? { scale: 0.95 } : {}}
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                {item.word}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {isCorrect !== null && (
              <motion.div className={`text-xl font-bold ${isCorrect ? 'text-green-500' : 'text-orange-500'}`} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>
                {isCorrect ? 'Geweldige zin!' : 'Bijna! Kijk goed naar de volgorde'}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
