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
  { words: ['het', 'is', 'warm'], emoji: '🌡️', level: 1, category: 'weer' },
  { words: ['zij', 'leest', 'graag'], emoji: '📖', level: 1, category: 'actie' },
  { words: ['de', 'vis', 'zwemt'], emoji: '🐟', level: 1, category: 'dieren' },
  { words: ['wij', 'zijn', 'thuis'], emoji: '🏠', level: 1, category: 'huis' },
  { words: ['de', 'bal', 'rolt'], emoji: '⚽', level: 1, category: 'spelen' },
  { words: ['ik', 'eet', 'brood'], emoji: '🍞', level: 1, category: 'eten' },
  { words: ['het', 'regent', 'hard'], emoji: '🌧️', level: 1, category: 'weer' },
  { words: ['mama', 'kookt', 'eten'], emoji: '🍳', level: 1, category: 'familie' },
  { words: ['de', 'vogel', 'zingt'], emoji: '🐦', level: 1, category: 'dieren' },
  { words: ['ik', 'kan', 'lezen'], emoji: '📚', level: 1, category: 'school' },
  { words: ['hij', 'is', 'groot'], emoji: '🧍', level: 1, category: 'gevoel' },
  { words: ['de', 'maan', 'schijnt'], emoji: '🌙', level: 1, category: 'natuur' },

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
  { words: ['de', 'hond', 'eet', 'zijn', 'brokjes'], emoji: '🐕🍖', level: 2, category: 'dieren' },
  { words: ['ik', 'heb', 'een', 'rode', 'fiets'], emoji: '🚲', level: 2, category: 'spullen' },
  { words: ['wij', 'spelen', 'in', 'de', 'tuin'], emoji: '🌳', level: 2, category: 'spelen' },
  { words: ['de', 'boom', 'is', 'heel', 'groot'], emoji: '🌳', level: 2, category: 'natuur' },
  { words: ['hij', 'gaat', 'naar', 'de', 'winkel'], emoji: '🏪', level: 2, category: 'actie' },
  { words: ['ik', 'vind', 'lezen', 'erg', 'leuk'], emoji: '📖😊', level: 2, category: 'school' },
  { words: ['de', 'trein', 'rijdt', 'heel', 'snel'], emoji: '🚂💨', level: 2, category: 'voertuigen' },
  { words: ['zij', 'draagt', 'een', 'mooie', 'jurk'], emoji: '👗', level: 2, category: 'kleding' },
  { words: ['het', 'eten', 'is', 'heel', 'lekker'], emoji: '😋', level: 2, category: 'eten' },
  { words: ['de', 'ster', 'schijnt', 'heel', 'helder'], emoji: '⭐', level: 2, category: 'natuur' },
  { words: ['ik', 'tekenen', 'met', 'mooie', 'kleuren'], emoji: '🎨', level: 2, category: 'school' },
  { words: ['mama', 'zingt', 'een', 'mooi', 'lied'], emoji: '🎵', level: 2, category: 'familie' },

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
  { words: ['de', 'kinderen', 'spelen', 'buiten', 'in', 'de', 'sneeuw'], emoji: '❄️👧', level: 3, category: 'spelen' },
  { words: ['mijn', 'broer', 'leert', 'gitaar', 'spelen', 'op', 'school'], emoji: '🎸', level: 3, category: 'school' },
  { words: ['de', 'prinses', 'woont', 'in', 'een', 'groot', 'kasteel'], emoji: '👸🏰', level: 3, category: 'fantasie' },
  { words: ['we', 'gaan', 'met', 'de', 'auto', 'naar', 'oma'], emoji: '🚗👵', level: 3, category: 'familie' },
  { words: ['de', 'kok', 'maakt', 'heerlijke', 'soep', 'in', 'de', 'keuken'], emoji: '👨‍🍳🍲', level: 3, category: 'eten' },
  { words: ['ik', 'wil', 'graag', 'naar', 'de', 'dierentuin'], emoji: '🦁', level: 3, category: 'avontuur' },
  { words: ['de', 'slak', 'kruipt', 'langzaam', 'over', 'het', 'pad'], emoji: '🐌', level: 3, category: 'dieren' },
  { words: ['papa', 'leest', 'een', 'verhaal', 'voor', 'het', 'slapen'], emoji: '📖💤', level: 3, category: 'familie' },
  { words: ['de', 'muis', 'verstopt', 'zich', 'achter', 'de', 'kast'], emoji: '🐭', level: 3, category: 'dieren' },
  { words: ['wij', 'maken', 'een', 'sneeuwpop', 'in', 'de', 'tuin'], emoji: '⛄', level: 3, category: 'spelen' },
  { words: ['het', 'vogeltje', 'bouwt', 'een', 'nestje', 'in', 'de', 'boom'], emoji: '🐦🌳', level: 3, category: 'natuur' },
  { words: ['ik', 'ga', 'vandaag', 'zwemmen', 'in', 'het', 'zwembad'], emoji: '🏊', level: 3, category: 'sport' },

  // Level 4: Complex sentences with subordinate clauses (groep 6-8)
  { words: ['de', 'jongen', 'die', 'het', 'boek', 'las', 'was', 'blij'], emoji: '📖😊', level: 4, category: 'school' },
  { words: ['omdat', 'het', 'regende', 'bleven', 'we', 'binnen'], emoji: '🌧️🏠', level: 4, category: 'weer' },
  { words: ['het', 'meisje', 'wist', 'niet', 'waar', 'ze', 'moest', 'zoeken'], emoji: '🔍', level: 4, category: 'avontuur' },
  { words: ['de', 'wetenschapper', 'ontdekte', 'een', 'nieuw', 'planeet'], emoji: '🔬🪐', level: 4, category: 'ruimte' },
  { words: ['nadat', 'de', 'zon', 'was', 'ondergegaan', 'werden', 'de', 'sterren', 'zichtbaar'], emoji: '🌅⭐', level: 4, category: 'natuur' },
  { words: ['de', 'ridder', 'reed', 'op', 'zijn', 'paard', 'door', 'het', 'bos'], emoji: '🏇🌲', level: 4, category: 'fantasie' },
  { words: ['zij', 'besloot', 'om', 'een', 'brief', 'te', 'schrijven'], emoji: '✉️', level: 4, category: 'actie' },
  { words: ['het', 'geheimzinnige', 'geluid', 'kwam', 'uit', 'de', 'kelder'], emoji: '👂🔮', level: 4, category: 'fantasie' },
  { words: ['de', 'kapitein', 'stuurde', 'het', 'schip', 'door', 'de', 'storm'], emoji: '⛵🌊', level: 4, category: 'avontuur' },
  { words: ['terwijl', 'iedereen', 'sliep', 'gloeide', 'de', 'schat', 'in', 'het', 'donker'], emoji: '💎🌙', level: 4, category: 'fantasie' },
  { words: ['als', 'het', 'donker', 'wordt', 'gaan', 'de', 'uilen', 'jagen'], emoji: '🦉🌙', level: 4, category: 'dieren' },
  { words: ['de', 'dappere', 'ridder', 'versloeg', 'de', 'boze', 'draak'], emoji: '⚔️🐉', level: 4, category: 'fantasie' },
  { words: ['hoewel', 'het', 'koud', 'was', 'gingen', 'ze', 'toch', 'naar', 'buiten'], emoji: '🥶🌳', level: 4, category: 'weer' },
  { words: ['de', 'tovenaar', 'sprak', 'een', 'geheime', 'spreuk', 'uit'], emoji: '🧙‍♂️✨', level: 4, category: 'fantasie' },
  { words: ['na', 'het', 'eten', 'hielpen', 'de', 'kinderen', 'met', 'afwassen'], emoji: '🍽️🧼', level: 4, category: 'huis' },
  { words: ['de', 'astronaut', 'zweefde', 'door', 'de', 'ruimte'], emoji: '👨‍🚀🌌', level: 4, category: 'ruimte' },
  { words: ['toen', 'het', 'begon', 'te', 'sneeuwen', 'juichten', 'de', 'kinderen'], emoji: '❄️🎉', level: 4, category: 'weer' },
  { words: ['het', 'spookhuis', 'was', 'donker', 'en', 'heel', 'eng'], emoji: '👻🏚️', level: 4, category: 'fantasie' },

  // Level 5: Long complex sentences
  { words: ['hoewel', 'het', 'moeilijk', 'was', 'gaf', 'hij', 'niet', 'op'], emoji: '💪', level: 5, category: 'gevoel' },
  { words: ['de', 'ontdekkingsreizigers', 'vonden', 'een', 'schat', 'die', 'al', 'eeuwen', 'verborgen', 'lag'], emoji: '🏴‍☠️💎', level: 5, category: 'avontuur' },
  { words: ['ze', 'had', 'nooit', 'gedacht', 'dat', 'ze', 'dit', 'zou', 'kunnen'], emoji: '🤯', level: 5, category: 'gevoel' },
  { words: ['de', 'robot', 'die', 'was', 'gebouwd', 'kon', 'zelf', 'nadenken', 'en', 'leren'], emoji: '🤖', level: 5, category: 'technologie' },
  { words: ['ondanks', 'de', 'regen', 'gingen', 'ze', 'toch', 'op', 'avontuur', 'in', 'het', 'bos'], emoji: '🌧️🌲', level: 5, category: 'avontuur' },
  { words: ['de', 'professor', 'legde', 'uit', 'hoe', 'de', 'aarde', 'om', 'de', 'zon', 'draait'], emoji: '🌍☀️', level: 5, category: 'ruimte' },
  { words: ['na', 'een', 'lange', 'reis', 'kwamen', 'ze', 'eindelijk', 'aan', 'bij', 'de', 'schat'], emoji: '🗺️💎', level: 5, category: 'avontuur' },
  { words: ['het', 'magische', 'zwaard', 'begon', 'te', 'gloeien', 'toen', 'de', 'held', 'het', 'oppakte'], emoji: '⚔️✨', level: 5, category: 'fantasie' },
  { words: ['de', 'kinderen', 'ontdekten', 'een', 'geheime', 'gang', 'achter', 'de', 'boekenkast'], emoji: '🔍📚', level: 5, category: 'avontuur' },
  { words: ['als', 'je', 'goed', 'je', 'best', 'doet', 'kun', 'je', 'alles', 'bereiken'], emoji: '⭐💪', level: 5, category: 'gevoel' },
  { words: ['de', 'walvis', 'zwom', 'door', 'de', 'diepe', 'oceaan', 'op', 'zoek', 'naar', 'voedsel'], emoji: '🐋🌊', level: 5, category: 'dieren' },
  { words: ['niemand', 'wist', 'waar', 'de', 'verdwenen', 'schat', 'verborgen', 'was'], emoji: '❓💎', level: 5, category: 'avontuur' },
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
