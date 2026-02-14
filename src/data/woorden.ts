/**
 * Word building data for spelling exercises.
 *
 * Based on Orton-Gillingham encoding principle:
 * - Child hears/sees a word and must build it from scrambled letters
 * - Strengthens phoneme-grapheme connection in "reverse"
 * - Progresses from CVC words to longer, more complex words
 */

export interface BuildWordData {
  word: string;
  emoji: string;
  hint: string; // A short clue
  level: number;
  category: string;
}

export const buildWords: BuildWordData[] = [
  // Level 1: 3-letter CVC words (consonant-vowel-consonant)
  { word: 'kat', emoji: '🐱', hint: 'Zegt miauw', level: 1, category: 'dieren' },
  { word: 'hond', emoji: '🐕', hint: 'Zegt woef', level: 1, category: 'dieren' },
  { word: 'vis', emoji: '🐟', hint: 'Zwemt in het water', level: 1, category: 'dieren' },
  { word: 'zon', emoji: '☀️', hint: 'Schijnt aan de hemel', level: 1, category: 'natuur' },
  { word: 'bal', emoji: '⚽', hint: 'Kun je mee trappen', level: 1, category: 'spelen' },
  { word: 'bus', emoji: '🚌', hint: 'Rijdt op de weg', level: 1, category: 'voertuigen' },
  { word: 'bed', emoji: '🛏️', hint: 'Hierin slaap je', level: 1, category: 'huis' },
  { word: 'dak', emoji: '🏠', hint: 'Zit bovenop een huis', level: 1, category: 'huis' },
  { word: 'muis', emoji: '🐭', hint: 'Klein diertje met een staart', level: 1, category: 'dieren' },
  { word: 'neus', emoji: '👃', hint: 'Zit in je gezicht', level: 1, category: 'lichaam' },
  { word: 'boom', emoji: '🌳', hint: 'Heeft bladeren', level: 1, category: 'natuur' },
  { word: 'roos', emoji: '🌹', hint: 'Een mooie bloem', level: 1, category: 'natuur' },
  { word: 'pen', emoji: '🖊️', hint: 'Schrijf je mee', level: 1, category: 'school' },
  { word: 'ijs', emoji: '🍦', hint: 'Koud en lekker', level: 1, category: 'eten' },
  { word: 'hut', emoji: '🛖', hint: 'Een klein huisje', level: 1, category: 'huis' },

  // Level 2: 4-5 letter words with blends
  { word: 'boek', emoji: '📖', hint: 'Kun je lezen', level: 2, category: 'school' },
  { word: 'melk', emoji: '🥛', hint: 'Wit drankje', level: 2, category: 'eten' },
  { word: 'taart', emoji: '🎂', hint: 'Eet je op je verjaardag', level: 2, category: 'eten' },
  { word: 'vlieg', emoji: '🪰', hint: 'Zoemt rond', level: 2, category: 'dieren' },
  { word: 'blauw', emoji: '🔵', hint: 'De kleur van de lucht', level: 2, category: 'kleuren' },
  { word: 'trein', emoji: '🚂', hint: 'Rijdt op rails', level: 2, category: 'voertuigen' },
  { word: 'vogel', emoji: '🐦', hint: 'Kan vliegen', level: 2, category: 'dieren' },
  { word: 'bloem', emoji: '🌸', hint: 'Groeit in de tuin', level: 2, category: 'natuur' },
  { word: 'stoel', emoji: '🪑', hint: 'Zit je op', level: 2, category: 'huis' },
  { word: 'fiets', emoji: '🚲', hint: 'Heeft twee wielen', level: 2, category: 'voertuigen' },
  { word: 'draak', emoji: '🐉', hint: 'Spuugt vuur', level: 2, category: 'fantasie' },
  { word: 'slang', emoji: '🐍', hint: 'Kruipt over de grond', level: 2, category: 'dieren' },
  { word: 'kaars', emoji: '🕯️', hint: 'Geeft licht', level: 2, category: 'huis' },
  { word: 'vuur', emoji: '🔥', hint: 'Is heet en brandt', level: 2, category: 'natuur' },
  { word: 'fruit', emoji: '🍎', hint: 'Gezond om te eten', level: 2, category: 'eten' },

  // Level 3: 5-7 letter words
  { word: 'school', emoji: '🏫', hint: 'Daar leer je', level: 3, category: 'school' },
  { word: 'piraat', emoji: '🏴‍☠️', hint: 'Zoekt schatten', level: 3, category: 'avontuur' },
  { word: 'schaap', emoji: '🐑', hint: 'Zegt baa', level: 3, category: 'dieren' },
  { word: 'vlinder', emoji: '🦋', hint: 'Mooie vleugels', level: 3, category: 'dieren' },
  { word: 'aardbei', emoji: '🍓', hint: 'Rood fruitje', level: 3, category: 'eten' },
  { word: 'kasteel', emoji: '🏰', hint: 'Woont een koning in', level: 3, category: 'gebouwen' },
  { word: 'gitaar', emoji: '🎸', hint: 'Muziekinstrument', level: 3, category: 'muziek' },
  { word: 'chocola', emoji: '🍫', hint: 'Zoet en bruin', level: 3, category: 'eten' },
  { word: 'konijn', emoji: '🐰', hint: 'Heeft lange oren', level: 3, category: 'dieren' },
  { word: 'raket', emoji: '🚀', hint: 'Vliegt naar de ruimte', level: 3, category: 'ruimte' },

  // Level 4: Complex words for groep 6-8
  { word: 'bibliotheek', emoji: '📚', hint: 'Hier leen je boeken', level: 4, category: 'gebouwen' },
  { word: 'avontuur', emoji: '🗺️', hint: 'Een spannende reis', level: 4, category: 'avontuur' },
  { word: 'middernacht', emoji: '🌙', hint: 'Midden in de nacht', level: 4, category: 'tijd' },
  { word: 'ontdekking', emoji: '🔍', hint: 'Iets nieuws vinden', level: 4, category: 'avontuur' },
  { word: 'geheimzinnig', emoji: '🔮', hint: 'Vol met geheimen', level: 4, category: 'fantasie' },
  { word: 'bescherming', emoji: '🛡️', hint: 'Iets of iemand beschermen', level: 4, category: 'avontuur' },
  { word: 'verschijnen', emoji: '👻', hint: 'Plotseling ergens zijn', level: 4, category: 'fantasie' },
  { word: 'schrijven', emoji: '✍️', hint: 'Woorden op papier zetten', level: 4, category: 'school' },
  { word: 'verdwijnen', emoji: '💨', hint: 'Weggaan, niet meer zien', level: 4, category: 'fantasie' },
  { word: 'ongelooflijk', emoji: '😲', hint: 'Moeilijk te geloven', level: 4, category: 'gevoel' },

  // Level 5: Very complex words
  { word: 'sterrenstelsel', emoji: '🌌', hint: 'Een groep sterren in de ruimte', level: 5, category: 'ruimte' },
  { word: 'wetenschapper', emoji: '🔬', hint: 'Iemand die onderzoek doet', level: 5, category: 'beroepen' },
  { word: 'achtergrond', emoji: '🖼️', hint: 'Wat je achter iets ziet', level: 5, category: 'kunst' },
  { word: 'vergelijkbaar', emoji: '⚖️', hint: 'Bijna hetzelfde als iets anders', level: 5, category: 'taal' },
  { word: 'onvergetelijk', emoji: '❤️', hint: 'Iets dat je nooit vergeet', level: 5, category: 'gevoel' },
  { word: 'verantwoordelijk', emoji: '📋', hint: 'Ergens voor zorgen', level: 5, category: 'taal' },
  { word: 'waarschijnlijk', emoji: '🤔', hint: 'Het zal wel zo zijn', level: 5, category: 'taal' },
  { word: 'tegenwoordig', emoji: '📅', hint: 'In deze tijd', level: 5, category: 'tijd' },
  { word: 'ondergronds', emoji: '🚇', hint: 'Onder de grond', level: 5, category: 'spullen' },
  { word: 'sprookjesachtig', emoji: '🏰', hint: 'Alsof het uit een sprookje komt', level: 5, category: 'fantasie' },
];

/**
 * Shuffle letters of a word
 * Makes sure the shuffled version is different from the original
 */
export function shuffleWord(word: string): string[] {
  const letters = word.split('');
  let shuffled: string[];

  do {
    shuffled = [...letters].sort(() => Math.random() - 0.5);
  } while (shuffled.join('') === word && word.length > 1);

  return shuffled;
}

/**
 * Get words by level
 */
export function getBuildWordsByLevel(level: number): BuildWordData[] {
  return buildWords.filter(w => w.level <= level);
}

/**
 * Get exercise words for a round
 */
export function getBuildExerciseWords(level: number, count: number = 8): BuildWordData[] {
  const available = getBuildWordsByLevel(level);
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
