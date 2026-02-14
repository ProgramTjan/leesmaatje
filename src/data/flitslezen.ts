/**
 * Flash reading data for fluency training.
 *
 * Words flash on screen briefly; child must recognise them.
 * Based on repeated-reading research for automaticity.
 * Levels control word length and complexity.
 */

export interface FlashWord {
  word: string;
  level: number; // 1 = short common, 2 = medium, 3 = long/complex
}

export const flashWords: FlashWord[] = [
  // Level 1 — short, high-frequency words (3-4 letters)
  { word: 'huis', level: 1 },
  { word: 'boom', level: 1 },
  { word: 'maan', level: 1 },
  { word: 'boot', level: 1 },
  { word: 'poes', level: 1 },
  { word: 'rood', level: 1 },
  { word: 'geel', level: 1 },
  { word: 'been', level: 1 },
  { word: 'deur', level: 1 },
  { word: 'hand', level: 1 },
  { word: 'lamp', level: 1 },
  { word: 'berg', level: 1 },
  { word: 'fles', level: 1 },
  { word: 'klok', level: 1 },
  { word: 'wind', level: 1 },

  // Level 2 — medium words (5-6 letters), some blends
  { word: 'school', level: 2 },
  { word: 'straat', level: 2 },
  { word: 'groep', level: 2 },
  { word: 'vliegtuig', level: 2 },
  { word: 'spring', level: 2 },
  { word: 'strand', level: 2 },
  { word: 'sterren', level: 2 },
  { word: 'donker', level: 2 },
  { word: 'bloemen', level: 2 },
  { word: 'verhaal', level: 2 },
  { word: 'gordijn', level: 2 },
  { word: 'zwembad', level: 2 },
  { word: 'dochter', level: 2 },
  { word: 'bruiloft', level: 2 },
  { word: 'plafond', level: 2 },

  // Level 3 — long/complex words (7+ letters), tricky spelling
  { word: 'verjaardag', level: 3 },
  { word: 'bibliotheek', level: 3 },
  { word: 'avontuurlijk', level: 3 },
  { word: 'middernacht', level: 3 },
  { word: 'schatkist', level: 3 },
  { word: 'ontdekking', level: 3 },
  { word: 'regenboog', level: 3 },
  { word: 'schrijven', level: 3 },
  { word: 'verschijnen', level: 3 },
  { word: 'geheimzinnig', level: 3 },
  { word: 'riddertijd', level: 3 },
  { word: 'bescherming', level: 3 },
  { word: 'wereldkaart', level: 3 },
  { word: 'sterrenstelsel', level: 3 },
  { word: 'spannend', level: 3 },
];

/**
 * Generate distractor words that look similar to the target word.
 * We tweak 1-2 letters to create plausible wrong answers.
 */
export function generateDistractors(target: string, pool: FlashWord[], count: number = 3): string[] {
  // First try to find words of similar length from the pool
  const similar = pool
    .filter((w) => w.word !== target && Math.abs(w.word.length - target.length) <= 2)
    .map((w) => w.word);

  const shuffled = [...similar].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get words by level
 */
export function getFlashWordsByLevel(level: number): FlashWord[] {
  return flashWords.filter((w) => w.level <= level);
}

/**
 * Get a random exercise set
 */
export function getFlashExercise(level: number, count: number = 10): FlashWord[] {
  const pool = getFlashWordsByLevel(level);
  return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
}

/**
 * Flash durations per difficulty tier (ms)
 */
export const flashDurations = {
  easy: 2000,
  medium: 1200,
  hard: 600,
};
