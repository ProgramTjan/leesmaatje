/**
 * Sentence building data.
 *
 * Progresses from simple 3-word sentences to longer ones.
 * Uses common vocabulary and relatable themes for kids.
 * Each sentence has a picture (emoji) clue for context.
 */

export interface SentenceData {
  words: string[]; // Words in correct order
  emoji: string;
  level: number;
  category: string;
}

export const sentences: SentenceData[] = [
  // Level 1: 3-word sentences
  { words: ['de', 'kat', 'slaapt'], emoji: '😺💤', level: 1, category: 'dieren' },
  { words: ['ik', 'ben', 'blij'], emoji: '😊', level: 1, category: 'gevoel' },
  { words: ['de', 'zon', 'schijnt'], emoji: '☀️', level: 1, category: 'weer' },
  { words: ['ik', 'drink', 'melk'], emoji: '🥛', level: 1, category: 'eten' },
  { words: ['de', 'hond', 'blaft'], emoji: '🐕', level: 1, category: 'dieren' },
  { words: ['hij', 'rent', 'hard'], emoji: '🏃', level: 1, category: 'actie' },
  { words: ['ik', 'heb', 'honger'], emoji: '🍽️', level: 1, category: 'gevoel' },
  { words: ['het', 'is', 'koud'], emoji: '🥶', level: 1, category: 'weer' },
  { words: ['de', 'baby', 'lacht'], emoji: '👶😄', level: 1, category: 'familie' },
  { words: ['ik', 'ga', 'slapen'], emoji: '😴', level: 1, category: 'actie' },

  // Level 2: 4-5 word sentences
  { words: ['de', 'vogel', 'zingt', 'een', 'lied'], emoji: '🐦🎵', level: 2, category: 'dieren' },
  { words: ['ik', 'eet', 'een', 'appel'], emoji: '🍎', level: 2, category: 'eten' },
  { words: ['mama', 'leest', 'een', 'boek'], emoji: '👩📖', level: 2, category: 'familie' },
  { words: ['de', 'vis', 'zwemt', 'in', 'water'], emoji: '🐟💧', level: 2, category: 'dieren' },
  { words: ['we', 'gaan', 'naar', 'de', 'school'], emoji: '🏫', level: 2, category: 'school' },
  { words: ['de', 'kat', 'drinkt', 'haar', 'melk'], emoji: '🐱🥛', level: 2, category: 'dieren' },
  { words: ['papa', 'bakt', 'een', 'taart'], emoji: '👨🎂', level: 2, category: 'familie' },
  { words: ['het', 'regent', 'heel', 'erg', 'hard'], emoji: '🌧️', level: 2, category: 'weer' },
  { words: ['ik', 'speel', 'met', 'mijn', 'bal'], emoji: '⚽', level: 2, category: 'spelen' },
  { words: ['de', 'maan', 'schijnt', 'heel', 'mooi'], emoji: '🌙✨', level: 2, category: 'natuur' },

  // Level 3: 5-7 word sentences
  { words: ['de', 'piraat', 'zoekt', 'naar', 'een', 'schat'], emoji: '🏴‍☠️💎', level: 3, category: 'avontuur' },
  { words: ['de', 'vlinder', 'vliegt', 'over', 'de', 'bloemen'], emoji: '🦋🌸', level: 3, category: 'natuur' },
  { words: ['wij', 'gaan', 'morgen', 'naar', 'het', 'strand'], emoji: '🏖️', level: 3, category: 'vakantie' },
  { words: ['de', 'olifant', 'heeft', 'een', 'lange', 'neus'], emoji: '🐘', level: 3, category: 'dieren' },
  { words: ['ik', 'heb', 'een', 'mooie', 'tekening', 'gemaakt'], emoji: '🎨', level: 3, category: 'school' },
  { words: ['de', 'draak', 'vliegt', 'hoog', 'in', 'de', 'lucht'], emoji: '🐉☁️', level: 3, category: 'fantasie' },
  { words: ['mijn', 'konijn', 'eet', 'graag', 'een', 'wortel'], emoji: '🐰🥕', level: 3, category: 'dieren' },
  { words: ['we', 'vieren', 'vandaag', 'een', 'groot', 'feest'], emoji: '🎉🎈', level: 3, category: 'feest' },
  { words: ['de', 'ridder', 'beschermt', 'het', 'mooie', 'kasteel'], emoji: '⚔️🏰', level: 3, category: 'fantasie' },
  { words: ['er', 'staat', 'een', 'regenboog', 'aan', 'de', 'hemel'], emoji: '🌈', level: 3, category: 'natuur' },

  // Level 4: Complex sentences with subordinate clauses (groep 6-8)
  { words: ['de', 'jongen', 'die', 'het', 'boek', 'las', 'was', 'blij'], emoji: '📖😊', level: 4, category: 'school' },
  { words: ['omdat', 'het', 'regende', 'bleven', 'we', 'binnen'], emoji: '🌧️🏠', level: 4, category: 'weer' },
  { words: ['het', 'meisje', 'wist', 'niet', 'waar', 'ze', 'moest', 'zoeken'], emoji: '🔍', level: 4, category: 'avontuur' },
  { words: ['de', 'wetenschapper', 'ontdekte', 'een', 'nieuw', 'planeet'], emoji: '🔬🪐', level: 4, category: 'ruimte' },
  { words: ['nadat', 'de', 'zon', 'was', 'ondergegaan', 'werden', 'de', 'sterren', 'zichtbaar'], emoji: '🌅⭐', level: 4, category: 'natuur' },
  { words: ['de', 'ridder', 'reed', 'op', 'zijn', 'paard', 'door', 'het', 'bos'], emoji: '🏇🌲', level: 4, category: 'fantasie' },
  { words: ['zij', 'besloot', 'om', 'een', 'brief', 'te', 'schrijven'], emoji: '✉️', level: 4, category: 'actie' },
  { words: ['het', 'geheimzinnige', 'geluid', 'kwam', 'uit', 'de', 'kelder'], emoji: '👂🔮', level: 4, category: 'fantasie' },

  // Level 5: Long complex sentences
  { words: ['hoewel', 'het', 'moeilijk', 'was', 'gaf', 'hij', 'niet', 'op'], emoji: '💪', level: 5, category: 'gevoel' },
  { words: ['de', 'ontdekkingsreizigers', 'vonden', 'een', 'schat', 'die', 'al', 'eeuwen', 'verborgen', 'lag'], emoji: '🏴‍☠️💎', level: 5, category: 'avontuur' },
  { words: ['ze', 'had', 'nooit', 'gedacht', 'dat', 'ze', 'dit', 'zou', 'kunnen'], emoji: '🤯', level: 5, category: 'gevoel' },
  { words: ['de', 'robot', 'die', 'was', 'gebouwd', 'kon', 'zelf', 'nadenken', 'en', 'leren'], emoji: '🤖', level: 5, category: 'technologie' },
];

/**
 * Shuffle words for an exercise
 */
export function shuffleSentence(words: string[]): string[] {
  const shuffled = [...words];
  // Keep shuffling until different from original
  do {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  } while (
    shuffled.every((w, i) => w === words[i]) && words.length > 1
  );

  return shuffled;
}

/**
 * Get sentences by level
 */
export function getSentencesByLevel(level: number): SentenceData[] {
  return sentences.filter(s => s.level <= level);
}

/**
 * Get exercise sentences for a round
 */
export function getExerciseSentences(level: number, count: number = 8): SentenceData[] {
  const available = getSentencesByLevel(level);
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
