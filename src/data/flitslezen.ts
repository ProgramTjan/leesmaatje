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
  { word: 'vis', level: 1 },
  { word: 'zon', level: 1 },
  { word: 'bal', level: 1 },
  { word: 'pen', level: 1 },
  { word: 'kat', level: 1 },
  { word: 'hond', level: 1 },
  { word: 'boek', level: 1 },
  { word: 'melk', level: 1 },
  { word: 'ring', level: 1 },
  { word: 'soep', level: 1 },
  { word: 'beer', level: 1 },
  { word: 'vuur', level: 1 },
  { word: 'neus', level: 1 },
  { word: 'doos', level: 1 },
  { word: 'bord', level: 1 },
  { word: 'tuin', level: 1 },
  { word: 'mes', level: 1 },
  { word: 'leeuw', level: 1 },
  { word: 'stoel', level: 1 },
  { word: 'trap', level: 1 },
  { word: 'park', level: 1 },
  { word: 'muur', level: 1 },
  { word: 'tas', level: 1 },
  { word: 'bed', level: 1 },
  { word: 'raam', level: 1 },
  { word: 'wiel', level: 1 },
  { word: 'voet', level: 1 },
  { word: 'kaas', level: 1 },
  { word: 'goud', level: 1 },
  { word: 'pijn', level: 1 },

  // Level 2 — medium words (5-7 letters), some blends
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
  { word: 'moeder', level: 2 },
  { word: 'kinderen', level: 2 },
  { word: 'speeltuin', level: 2 },
  { word: 'ridder', level: 2 },
  { word: 'kasteel', level: 2 },
  { word: 'vlinder', level: 2 },
  { word: 'piraat', level: 2 },
  { word: 'gitaar', level: 2 },
  { word: 'dokter', level: 2 },
  { word: 'banaan', level: 2 },
  { word: 'konijn', level: 2 },
  { word: 'panter', level: 2 },
  { word: 'vakantie', level: 2 },
  { word: 'spiegel', level: 2 },
  { word: 'dolfijn', level: 2 },
  { word: 'hertje', level: 2 },
  { word: 'puzzel', level: 2 },
  { word: 'trompet', level: 2 },
  { word: 'giraf', level: 2 },
  { word: 'wolken', level: 2 },
  { word: 'ballon', level: 2 },
  { word: 'sleutel', level: 2 },
  { word: 'telefoon', level: 2 },
  { word: 'raket', level: 2 },
  { word: 'prinses', level: 2 },
  { word: 'schaap', level: 2 },
  { word: 'muziek', level: 2 },
  { word: 'koffer', level: 2 },
  { word: 'wortel', level: 2 },
  { word: 'tomaat', level: 2 },

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
  { word: 'vliegtuig', level: 3 },
  { word: 'helikopter', level: 3 },
  { word: 'dinosaurus', level: 3 },
  { word: 'supermarkt', level: 3 },
  { word: 'telescoop', level: 3 },
  { word: 'watermeloen', level: 3 },
  { word: 'brandweerauto', level: 3 },
  { word: 'verdwijnen', level: 3 },
  { word: 'onderzeeboot', level: 3 },
  { word: 'sprookjesboek', level: 3 },
  { word: 'verjaardagsfeest', level: 3 },
  { word: 'wetenschapper', level: 3 },
  { word: 'zonsondergang', level: 3 },
  { word: 'pannenkoek', level: 3 },
  { word: 'ongelooflijk', level: 3 },
  { word: 'achtergrond', level: 3 },
  { word: 'verantwoordelijk', level: 3 },
  { word: 'waarschijnlijk', level: 3 },
  { word: 'tegenwoordig', level: 3 },
  { word: 'samenwerking', level: 3 },
  { word: 'zelfvertrouwen', level: 3 },
  { word: 'dierentuin', level: 3 },
  { word: 'schoolmeester', level: 3 },
  { word: 'speelgoedwinkel', level: 3 },
  { word: 'ochtendgloren', level: 3 },
  { word: 'slaapkamer', level: 3 },
  { word: 'kampvuur', level: 3 },
  { word: 'zwaartekracht', level: 3 },
  { word: 'ontdekkingsreis', level: 3 },
  { word: 'middeleeuwen', level: 3 },
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
