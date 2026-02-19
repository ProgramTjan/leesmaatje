'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '@/components/BackButton';
import ProgressBar from '@/components/ProgressBar';
import ScoreBoard from '@/components/ScoreBoard';
import StarReward from '@/components/StarReward';
import BadgeNotification from '@/components/BadgeNotification';
import { getSpellingExercise, categoryLabels, type SpellingQuestion } from '@/data/spellingregels';
import { useGameStore } from '@/store/useGameStore';
import { getAvailableAILevel, maxStaticLevel, checkAIAvailable } from '@/lib/adaptive';
import { fetchAIExercises } from '@/lib/aiExercises';
import { speakEncouragement } from '@/lib/speech';

const QUESTIONS_PER_ROUND = 8;
type GamePhase = 'intro' | 'playing' | 'result';

export default function SpellingregelsPage() {
  const { level, soundEnabled, currentStreak, spellingregelsProgress, updateSpellingregelsProgress, addStars, addXP, incrementStreak, resetStreak, addPerfectRound, checkAndUnlockBadges } = useGameStore();

  const [gamePhase, setGamePhase] = useState<GamePhase>('intro');
  const [selectedLevel, setSelectedLevel] = useState(Math.min(level, 3));
  const [questions, setQuestions] = useState<SpellingQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showStar, setShowStar] = useState(false);
  const [roundScore, setRoundScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const [aiAvailable, setAiAvailable] = useState(false);
  const [aiLevel, setAiLevel] = useState<number | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const isAIMode = selectedLevel > maxStaticLevel.spellingregels;

  useEffect(() => {
    checkAIAvailable().then(setAiAvailable);
  }, []);

  useEffect(() => {
    if (aiAvailable) {
      setAiLevel(getAvailableAILevel(spellingregelsProgress, 'spellingregels'));
    } else {
      setAiLevel(null);
    }
  }, [aiAvailable, spellingregelsProgress]);

  const startGame = useCallback(async () => {
    if (isAIMode) {
      setAiLoading(true);
      try {
        const fetched = await fetchAIExercises('spellingregels', selectedLevel, QUESTIONS_PER_ROUND);
        const typed = fetched as SpellingQuestion[];
        if (typed.length >= QUESTIONS_PER_ROUND) {
          setQuestions(typed.slice(0, QUESTIONS_PER_ROUND));
          setCurrentQuestion(0);
          setRoundScore(0);
          setGamePhase('playing');
        } else {
          setQuestions(getSpellingExercise(maxStaticLevel.spellingregels, QUESTIONS_PER_ROUND));
          setCurrentQuestion(0);
          setRoundScore(0);
          setGamePhase('playing');
        }
      } catch {
        setQuestions(getSpellingExercise(maxStaticLevel.spellingregels, QUESTIONS_PER_ROUND));
        setCurrentQuestion(0);
        setRoundScore(0);
        setGamePhase('playing');
      } finally {
        setAiLoading(false);
      }
    } else {
      setQuestions(getSpellingExercise(selectedLevel, QUESTIONS_PER_ROUND));
      setCurrentQuestion(0);
      setRoundScore(0);
      setGamePhase('playing');
    }
  }, [selectedLevel, isAIMode]);

  const currentQ = questions[currentQuestion];

  const handleAnswer = useCallback((answer: string) => {
    if (selectedAnswer !== null) return;
    const correct = answer === currentQ.correct;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowExplanation(true);

    if (correct) {
      setRoundScore((s) => s + 1);
      setShowStar(true);
      updateSpellingregelsProgress(true, selectedLevel);
      addStars(2);
      addXP(isAIMode ? 25 : 15);
      incrementStreak();
      if (soundEnabled && (currentStreak + 1) % 5 === 0) {
        speakEncouragement();
      }
    } else {
      updateSpellingregelsProgress(false, selectedLevel);
      resetStreak();
    }

    setTimeout(() => {
      setShowStar(false);
      setShowExplanation(false);
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
    }, 3000);
  }, [selectedAnswer, currentQ, currentQuestion, roundScore, selectedLevel, isAIMode, updateSpellingregelsProgress, addStars, addXP, incrementStreak, resetStreak, addPerfectRound, checkAndUnlockBadges]);

  // Intro
  if (gamePhase === 'intro') {
    return (
      <div className="min-h-screen p-4 sm:p-6 max-w-2xl mx-auto">
        <BadgeNotification />
        <div className="mb-6"><BackButton /></div>
        <motion.div className="text-center" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="text-6xl mb-4">&#128221;</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Spellingregels</h1>
          <p className="text-lg text-gray-500 mb-6">Kies het woord met de goede spelling!</p>

          <div className="grid gap-3 max-w-md mx-auto mb-8">
            {[1, 2, 3].map((lvl) => (
              <motion.button key={lvl} onClick={() => setSelectedLevel(lvl)}
                className={`p-4 rounded-2xl font-bold text-lg transition-all ${selectedLevel === lvl ? 'bg-accent-purple text-white shadow-lg scale-105' : 'bg-card-bg text-foreground shadow-md'}`}
                whileTap={{ scale: 0.98 }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lvl}</span>
                  <div className="text-left">
                    <div>Niveau {lvl}</div>
                    <div className={`text-sm font-normal ${selectedLevel === lvl ? 'text-white/70' : 'text-gray-400'}`}>
                      {lvl === 1 ? 'Basis regels' : lvl === 2 ? 'Lastiger regels' : 'Alle regels door elkaar'}
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

          <motion.button
            onClick={startGame}
            disabled={aiLoading}
            className="bg-gradient-to-r from-[#a06cd5] to-[#c084fc] text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
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
    const msg = pct === 100 ? 'Alles goed! Spellingkampioen!' : pct >= 70 ? 'Goed bezig!' : 'Oefening baart kunst!';
    return (
      <div className="min-h-screen p-4 sm:p-6 max-w-2xl mx-auto flex items-center justify-center">
        <BadgeNotification />
        <motion.div className="bg-card-bg rounded-3xl shadow-2xl p-8 max-w-md w-full text-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
          <div className="text-7xl mb-4">{pct >= 70 ? '🏆' : '💪'}</div>
          <h2 className="text-3xl font-bold mb-2">Klaar!</h2>
          {isAIMode && (
            <div className="inline-block bg-accent-purple/15 text-accent-purple px-3 py-1 rounded-full text-sm font-bold mb-2">🤖 AI-niveau</div>
          )}
          <p className="text-lg text-gray-500 mb-6">{msg}</p>
          <div className="bg-background rounded-2xl p-4 mb-6">
            <div className="text-5xl font-bold text-accent-purple mb-1">{roundScore}/{QUESTIONS_PER_ROUND}</div>
          </div>
          <div className="flex flex-col gap-3">
            <motion.button onClick={startGame} className="bg-gradient-to-r from-[#a06cd5] to-[#c084fc] text-white text-lg font-bold py-3 rounded-2xl shadow-lg" whileTap={{ scale: 0.98 }}>Nog een keer!</motion.button>
            <motion.button onClick={() => setGamePhase('intro')} className="bg-gray-100 text-foreground text-lg font-bold py-3 rounded-2xl" whileTap={{ scale: 0.98 }}>Ander niveau</motion.button>
            <motion.a href="/" className="block text-center text-gray-400 text-base font-semibold py-2 rounded-2xl hover:text-foreground transition-colors" whileTap={{ scale: 0.98 }}>Terug naar menu</motion.a>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentQ) return null;

  // Playing
  const allOptions = [currentQ.correct, ...currentQ.wrong].sort(() => Math.random() - 0.5);
  // Stable options — we use a key trick to avoid re-sorting on re-render
  const optionsKey = `${currentQuestion}`;

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-2xl mx-auto">
      <StarReward show={showStar} />
      <BadgeNotification />
      <div className="flex items-center justify-between mb-4"><BackButton /><ScoreBoard /></div>
      <div className="mb-6"><ProgressBar current={currentQuestion + 1} total={QUESTIONS_PER_ROUND} color="#a06cd5" /></div>

      <AnimatePresence mode="wait">
        <motion.div key={currentQuestion} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="text-center">
          {/* Category tag */}
          <div className="inline-block bg-accent-purple/15 text-accent-purple px-3 py-1 rounded-full text-sm font-bold mb-3">
            {categoryLabels[currentQ.category]}
          </div>

          {/* Sentence with blank */}
          <div className="bg-card-bg rounded-2xl shadow-lg p-5 mb-6">
            <p className="text-xl sm:text-2xl font-bold text-foreground leading-relaxed">
              {currentQ.sentence.replace('___', '______')}
            </p>
          </div>

          {/* Options */}
          <AnswerOptions
            key={optionsKey}
            question={currentQ}
            selectedAnswer={selectedAnswer}
            onSelect={handleAnswer}
          />

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                className={`mt-5 p-4 rounded-2xl text-left ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}
                initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>
                <div className={`font-bold mb-1 ${isCorrect ? 'text-green-600' : 'text-orange-600'}`}>
                  {isCorrect ? 'Goed!' : `Het juiste antwoord is: ${currentQ.correct}`}
                </div>
                <p className="text-sm text-gray-600">{currentQ.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** Stable options component that doesn't re-shuffle on re-render */
function AnswerOptions({ question, selectedAnswer, onSelect }: {
  question: SpellingQuestion;
  selectedAnswer: string | null;
  onSelect: (answer: string) => void;
}) {
  const [options] = useState(() =>
    [question.correct, ...question.wrong].sort(() => Math.random() - 0.5)
  );

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {options.map((opt, i) => {
        const isSelected = selectedAnswer === opt;
        const isCorrectOpt = opt === question.correct;
        let style = 'bg-card-bg shadow-lg';
        if (selectedAnswer !== null) {
          if (isCorrectOpt) style = 'bg-green-100 shadow-lg ring-4 ring-green-400';
          else if (isSelected) style = 'bg-red-100 shadow-lg ring-4 ring-red-400';
          else style = 'bg-card-bg/50 shadow';
        }
        return (
          <motion.button key={opt} onClick={() => onSelect(opt)} disabled={selectedAnswer !== null}
            className={`${style} rounded-2xl px-6 py-3 text-xl font-bold text-foreground transition-all`}
            initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.08 }}
            whileHover={selectedAnswer === null ? { scale: 1.05 } : {}} whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}>
            {opt}
          </motion.button>
        );
      })}
    </div>
  );
}
