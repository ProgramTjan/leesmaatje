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
  { word: 'lopen', syllables: ['lo', 'pen'], level: 1, emoji: '🚶', category: 'actie' },
  { word: 'eten', syllables: ['e', 'ten'], level: 1, emoji: '🍽️', category: 'eten' },
  { word: 'lezen', syllables: ['le', 'zen'], level: 1, emoji: '📖', category: 'school' },
  { word: 'varen', syllables: ['va', 'ren'], level: 1, emoji: '⛵', category: 'voertuigen' },
  { word: 'koken', syllables: ['ko', 'ken'], level: 1, emoji: '🍳', category: 'eten' },
  { word: 'toren', syllables: ['to', 'ren'], level: 1, emoji: '🗼', category: 'gebouwen' },
  { word: 'lopen', syllables: ['lo', 'pen'], level: 1, emoji: '🚶', category: 'actie' },
  { word: 'navel', syllables: ['na', 'vel'], level: 1, emoji: '😊', category: 'lichaam' },
  { word: 'beter', syllables: ['be', 'ter'], level: 1, emoji: '👍', category: 'gevoel' },
  { word: 'lever', syllables: ['le', 'ver'], level: 1, emoji: '🏥', category: 'lichaam' },
  { word: 'rozen', syllables: ['ro', 'zen'], level: 1, emoji: '🌹', category: 'natuur' },
  { word: 'hamer', syllables: ['ha', 'mer'], level: 1, emoji: '🔨', category: 'spullen' },
  { word: 'tijger', syllables: ['tij', 'ger'], level: 1, emoji: '🐯', category: 'dieren' },
  { word: 'lepel', syllables: ['le', 'pel'], level: 1, emoji: '🥄', category: 'huis' },
  { word: 'kamer', syllables: ['ka', 'mer'], level: 1, emoji: '🚪', category: 'huis' },
  { word: 'meter', syllables: ['me', 'ter'], level: 1, emoji: '📏', category: 'school' },
  { word: 'haven', syllables: ['ha', 'ven'], level: 1, emoji: '⚓', category: 'natuur' },
  { word: 'weten', syllables: ['we', 'ten'], level: 1, emoji: '🧠', category: 'school' },
  { word: 'bever', syllables: ['be', 'ver'], level: 1, emoji: '🦫', category: 'dieren' },
  { word: 'kikker', syllables: ['kik', 'ker'], level: 1, emoji: '🐸', category: 'dieren' },
  { word: 'lachen', syllables: ['la', 'chen'], level: 1, emoji: '😄', category: 'gevoel' },
  { word: 'mango', syllables: ['man', 'go'], level: 1, emoji: '🥭', category: 'eten' },
  { word: 'zeehond', syllables: ['zee', 'hond'], level: 1, emoji: '🦭', category: 'dieren' },
  { word: 'oma', syllables: ['o', 'ma'], level: 1, emoji: '👵', category: 'familie' },
  { word: 'opa', syllables: ['o', 'pa'], level: 1, emoji: '👴', category: 'familie' },

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
  { word: 'pinguïn', syllables: ['pin', 'gu', 'in'], level: 2, emoji: '🐧', category: 'dieren' },
  { word: 'tomaat', syllables: ['to', 'maat'], level: 2, emoji: '🍅', category: 'eten' },
  { word: 'citroen', syllables: ['ci', 'troen'], level: 2, emoji: '🍋', category: 'eten' },
  { word: 'kasteel', syllables: ['kas', 'teel'], level: 2, emoji: '🏰', category: 'gebouwen' },
  { word: 'papegaai', syllables: ['pa', 'pe', 'gaai'], level: 2, emoji: '🦜', category: 'dieren' },
  { word: 'wortel', syllables: ['wor', 'tel'], level: 2, emoji: '🥕', category: 'eten' },
  { word: 'dolfijn', syllables: ['dol', 'fijn'], level: 2, emoji: '🐬', category: 'dieren' },
  { word: 'prinses', syllables: ['prin', 'ses'], level: 2, emoji: '👸', category: 'fantasie' },
  { word: 'ridder', syllables: ['rid', 'der'], level: 2, emoji: '⚔️', category: 'fantasie' },
  { word: 'giraf', syllables: ['gi', 'raf'], level: 2, emoji: '🦒', category: 'dieren' },
  { word: 'panter', syllables: ['pan', 'ter'], level: 2, emoji: '🐆', category: 'dieren' },
  { word: 'koffer', syllables: ['kof', 'fer'], level: 2, emoji: '🧳', category: 'spullen' },
  { word: 'vakantie', syllables: ['va', 'kan', 'tie'], level: 2, emoji: '🏖️', category: 'vakantie' },
  { word: 'muziek', syllables: ['mu', 'ziek'], level: 2, emoji: '🎵', category: 'muziek' },
  { word: 'telefoon', syllables: ['te', 'le', 'foon'], level: 2, emoji: '📱', category: 'spullen' },
  { word: 'computer', syllables: ['com', 'pu', 'ter'], level: 2, emoji: '💻', category: 'spullen' },
  { word: 'schildpad', syllables: ['schild', 'pad'], level: 2, emoji: '🐢', category: 'dieren' },
  { word: 'flamingo', syllables: ['fla', 'min', 'go'], level: 2, emoji: '🦩', category: 'dieren' },
  { word: 'aardbei', syllables: ['aard', 'bei'], level: 2, emoji: '🍓', category: 'eten' },
  { word: 'avontuur', syllables: ['a', 'von', 'tuur'], level: 2, emoji: '🗺️', category: 'avontuur' },
  { word: 'donder', syllables: ['don', 'der'], level: 2, emoji: '⛈️', category: 'weer' },
  { word: 'sleutel', syllables: ['sleu', 'tel'], level: 2, emoji: '🔑', category: 'spullen' },
  { word: 'toverij', syllables: ['to', 'ver', 'ij'], level: 2, emoji: '🪄', category: 'fantasie' },
  { word: 'paddenstoel', syllables: ['pad', 'den', 'stoel'], level: 2, emoji: '🍄', category: 'natuur' },
  { word: 'trompet', syllables: ['trom', 'pet'], level: 2, emoji: '🎺', category: 'muziek' },

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
  { word: 'vlinderblad', syllables: ['vlin', 'der', 'blad'], level: 3, emoji: '🍃', category: 'natuur' },
  { word: 'onderzeeboot', syllables: ['on', 'der', 'zee', 'boot'], level: 3, emoji: '🚢', category: 'voertuigen' },
  { word: 'ochtendgloren', syllables: ['och', 'tend', 'glo', 'ren'], level: 3, emoji: '🌅', category: 'natuur' },
  { word: 'vliegtuig', syllables: ['vlieg', 'tuig'], level: 3, emoji: '✈️', category: 'voertuigen' },
  { word: 'voetballen', syllables: ['voet', 'bal', 'len'], level: 3, emoji: '⚽', category: 'sport' },
  { word: 'verjaardagsfeest', syllables: ['ver', 'jaar', 'dags', 'feest'], level: 3, emoji: '🎉', category: 'feest' },
  { word: 'schoolmeester', syllables: ['school', 'mees', 'ter'], level: 3, emoji: '👨‍🏫', category: 'school' },
  { word: 'slaapkamer', syllables: ['slaap', 'ka', 'mer'], level: 3, emoji: '🛏️', category: 'huis' },
  { word: 'huiswerk', syllables: ['huis', 'werk'], level: 3, emoji: '📝', category: 'school' },
  { word: 'speelplaats', syllables: ['speel', 'plaats'], level: 3, emoji: '🏫', category: 'school' },
  { word: 'pannenkoek', syllables: ['pan', 'nen', 'koek'], level: 3, emoji: '🥞', category: 'eten' },
  { word: 'sneeuwvlok', syllables: ['sneeuw', 'vlok'], level: 3, emoji: '❄️', category: 'weer' },
  { word: 'sprookjesboek', syllables: ['sprook', 'jes', 'boek'], level: 3, emoji: '📖', category: 'fantasie' },
  { word: 'zwembad', syllables: ['zwem', 'bad'], level: 3, emoji: '🏊', category: 'sport' },
  { word: 'middernacht', syllables: ['mid', 'der', 'nacht'], level: 3, emoji: '🌙', category: 'tijd' },
  { word: 'ontbijtkoek', syllables: ['ont', 'bijt', 'koek'], level: 3, emoji: '🍰', category: 'eten' },
  { word: 'kabouter', syllables: ['ka', 'bou', 'ter'], level: 3, emoji: '🧙', category: 'fantasie' },
  { word: 'brandweerauto', syllables: ['brand', 'weer', 'au', 'to'], level: 3, emoji: '🚒', category: 'voertuigen' },
  { word: 'schatkist', syllables: ['schat', 'kist'], level: 3, emoji: '💎', category: 'avontuur' },
  { word: 'sterrenstelsel', syllables: ['ster', 'ren', 'stel', 'sel'], level: 3, emoji: '🌌', category: 'ruimte' },
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
