/**
 * Dutch syllable data for reading exercises.
 * 
 * Based on structured literacy principles:
 * - Start with simple 1-2 syllable words
 * - Progress to more complex words
 * - Use common, age-appropriate vocabulary
 * - Color-coded syllable highlighting
 */

export interface WordData {
  word: string;
  syllables: string[];
  level: number; // 1 = easiest (2 syllables), 2 = medium (2-3), 3 = harder (3-4)
  emoji: string;
  category: string;
}

export const words: WordData[] = [
  // Level 1: Simple 2-syllable words (CVCV pattern)
  { word: 'mama', syllables: ['ma', 'ma'], level: 1, emoji: '👩', category: 'familie' },
  { word: 'papa', syllables: ['pa', 'pa'], level: 1, emoji: '👨', category: 'familie' },
  { word: 'baby', syllables: ['ba', 'by'], level: 1, emoji: '👶', category: 'familie' },
  { word: 'auto', syllables: ['au', 'to'], level: 1, emoji: '🚗', category: 'voertuigen' },
  { word: 'boter', syllables: ['bo', 'ter'], level: 1, emoji: '🧈', category: 'eten' },
  { word: 'water', syllables: ['wa', 'ter'], level: 1, emoji: '💧', category: 'natuur' },
  { word: 'molen', syllables: ['mo', 'len'], level: 1, emoji: '🏗️', category: 'gebouwen' },
  { word: 'appel', syllables: ['ap', 'pel'], level: 1, emoji: '🍎', category: 'eten' },
  { word: 'koala', syllables: ['ko', 'a', 'la'], level: 1, emoji: '🐨', category: 'dieren' },
  { word: 'panda', syllables: ['pan', 'da'], level: 1, emoji: '🐼', category: 'dieren' },
  { word: 'tafel', syllables: ['ta', 'fel'], level: 1, emoji: '🪑', category: 'huis' },
  { word: 'regen', syllables: ['re', 'gen'], level: 1, emoji: '🌧️', category: 'weer' },
  { word: 'vogel', syllables: ['vo', 'gel'], level: 1, emoji: '🐦', category: 'dieren' },
  { word: 'bloem', syllables: ['bloem'], level: 1, emoji: '🌸', category: 'natuur' },
  { word: 'deken', syllables: ['de', 'ken'], level: 1, emoji: '🛏️', category: 'huis' },

  // Level 2: 2-3 syllable words with more complex patterns
  { word: 'banaan', syllables: ['ba', 'naan'], level: 2, emoji: '🍌', category: 'eten' },
  { word: 'konijn', syllables: ['ko', 'nijn'], level: 2, emoji: '🐰', category: 'dieren' },
  { word: 'vlinder', syllables: ['vlin', 'der'], level: 2, emoji: '🦋', category: 'dieren' },
  { word: 'school', syllables: ['school'], level: 2, emoji: '🏫', category: 'gebouwen' },
  { word: 'verjaardag', syllables: ['ver', 'jaar', 'dag'], level: 2, emoji: '🎂', category: 'feest' },
  { word: 'olifant', syllables: ['o', 'li', 'fant'], level: 2, emoji: '🐘', category: 'dieren' },
  { word: 'chocola', syllables: ['cho', 'co', 'la'], level: 2, emoji: '🍫', category: 'eten' },
  { word: 'raket', syllables: ['ra', 'ket'], level: 2, emoji: '🚀', category: 'ruimte' },
  { word: 'piraat', syllables: ['pi', 'raat'], level: 2, emoji: '🏴‍☠️', category: 'avontuur' },
  { word: 'gitaar', syllables: ['gi', 'taar'], level: 2, emoji: '🎸', category: 'muziek' },
  { word: 'dokter', syllables: ['dok', 'ter'], level: 2, emoji: '👨‍⚕️', category: 'beroepen' },
  { word: 'kleurpotlood', syllables: ['kleur', 'pot', 'lood'], level: 2, emoji: '🖍️', category: 'school' },
  { word: 'regenboog', syllables: ['re', 'gen', 'boog'], level: 2, emoji: '🌈', category: 'weer' },
  { word: 'pompoen', syllables: ['pom', 'poen'], level: 2, emoji: '🎃', category: 'eten' },
  { word: 'kameel', syllables: ['ka', 'meel'], level: 2, emoji: '🐫', category: 'dieren' },

  // Level 3: More complex words
  { word: 'bibliotheek', syllables: ['bi', 'bli', 'o', 'theek'], level: 3, emoji: '📚', category: 'gebouwen' },
  { word: 'helikopter', syllables: ['he', 'li', 'kop', 'ter'], level: 3, emoji: '🚁', category: 'voertuigen' },
  { word: 'zonnebloem', syllables: ['zon', 'ne', 'bloem'], level: 3, emoji: '🌻', category: 'natuur' },
  { word: 'krokodil', syllables: ['kro', 'ko', 'dil'], level: 3, emoji: '🐊', category: 'dieren' },
  { word: 'dinosaurus', syllables: ['di', 'no', 'sau', 'rus'], level: 3, emoji: '🦕', category: 'dieren' },
  { word: 'supermarkt', syllables: ['su', 'per', 'markt'], level: 3, emoji: '🏪', category: 'gebouwen' },
  { word: 'avontuur', syllables: ['a', 'von', 'tuur'], level: 3, emoji: '🗺️', category: 'avontuur' },
  { word: 'telescoop', syllables: ['te', 'le', 'scoop'], level: 3, emoji: '🔭', category: 'ruimte' },
  { word: 'paraplu', syllables: ['pa', 'ra', 'plu'], level: 3, emoji: '☂️', category: 'spullen' },
  { word: 'watermeloen', syllables: ['wa', 'ter', 'me', 'loen'], level: 3, emoji: '🍉', category: 'eten' },
];

/**
 * Syllable colors for visual highlighting
 * Using warm, distinguishable colors
 */
export const syllableColors = [
  '#6c63ff', // purple
  '#ff6b9d', // pink
  '#4ecdc4', // teal
  '#ff8a5c', // orange
  '#45b7d1', // blue
  '#a06cd5', // violet
];

/**
 * Get words by level
 */
export function getWordsByLevel(level: number): WordData[] {
  return words.filter(w => w.level <= level);
}

/**
 * Get a random selection of words for an exercise
 */
export function getExerciseWords(level: number, count: number = 10): WordData[] {
  const available = getWordsByLevel(level);
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
