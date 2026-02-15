/**
 * Dutch letter data for phonics exercises.
 *
 * Based on structured literacy approach:
 * - Start with most common, visually distinct letters
 * - Group by difficulty level
 * - Include example words and visual cues
 */

export interface LetterData {
  letter: string;
  sound: string; // How to pronounce the letter sound
  exampleWord: string;
  exampleEmoji: string;
  level: number; // 1 = easiest, 3 = hardest
}

export const letters: LetterData[] = [
  // Level 1: Most common, easy to distinguish
  { letter: 'a', sound: 'aa', exampleWord: 'aap', exampleEmoji: '🐒', level: 1 },
  { letter: 'e', sound: 'ee', exampleWord: 'eend', exampleEmoji: '🦆', level: 1 },
  { letter: 'i', sound: 'ie', exampleWord: 'inkt', exampleEmoji: '🖊️', level: 1 },
  { letter: 'o', sound: 'oo', exampleWord: 'olifant', exampleEmoji: '🐘', level: 1 },
  { letter: 'm', sound: 'mm', exampleWord: 'maan', exampleEmoji: '🌙', level: 1 },
  { letter: 's', sound: 'ss', exampleWord: 'slang', exampleEmoji: '🐍', level: 1 },
  { letter: 'r', sound: 'rr', exampleWord: 'roos', exampleEmoji: '🌹', level: 1 },
  { letter: 'n', sound: 'nn', exampleWord: 'neus', exampleEmoji: '👃', level: 1 },
  { letter: 't', sound: 'tt', exampleWord: 'taart', exampleEmoji: '🎂', level: 1 },
  { letter: 'l', sound: 'll', exampleWord: 'leeuw', exampleEmoji: '🦁', level: 1 },

  // Level 2: Less common, some look similar
  { letter: 'b', sound: 'bb', exampleWord: 'beer', exampleEmoji: '🐻', level: 2 },
  { letter: 'd', sound: 'dd', exampleWord: 'dier', exampleEmoji: '🦌', level: 2 },
  { letter: 'p', sound: 'pp', exampleWord: 'poes', exampleEmoji: '🐱', level: 2 },
  { letter: 'k', sound: 'kk', exampleWord: 'kat', exampleEmoji: '😺', level: 2 },
  { letter: 'v', sound: 'vv', exampleWord: 'vis', exampleEmoji: '🐟', level: 2 },
  { letter: 'h', sound: 'hh', exampleWord: 'hond', exampleEmoji: '🐕', level: 2 },
  { letter: 'g', sound: 'gg', exampleWord: 'geit', exampleEmoji: '🐐', level: 2 },
  { letter: 'w', sound: 'ww', exampleWord: 'wolk', exampleEmoji: '☁️', level: 2 },
  { letter: 'j', sound: 'jj', exampleWord: 'jas', exampleEmoji: '🧥', level: 2 },
  { letter: 'z', sound: 'zz', exampleWord: 'zon', exampleEmoji: '☀️', level: 2 },
  { letter: 'u', sound: 'uu', exampleWord: 'uil', exampleEmoji: '🦉', level: 2 },
  { letter: 'f', sound: 'ff', exampleWord: 'fiets', exampleEmoji: '🚲', level: 2 },

  // Level 3: Confusing pairs and rare letters
  { letter: 'c', sound: 'ss', exampleWord: 'citroen', exampleEmoji: '🍋', level: 3 },
  { letter: 'x', sound: 'ks', exampleWord: 'xylofoon', exampleEmoji: '🎵', level: 3 },
  { letter: 'y', sound: 'ij', exampleWord: 'yoga', exampleEmoji: '🧘', level: 3 },
  { letter: 'q', sound: 'ku', exampleWord: 'quiz', exampleEmoji: '❓', level: 3 },
];

/**
 * Dutch letter combinations (digraphs/trigraphs)
 * These are important for reading in Dutch
 */
export interface LetterComboData {
  combo: string;
  sound: string;
  exampleWord: string;
  exampleEmoji: string;
  level: number;
}

export const letterCombos: LetterComboData[] = [
  // Level 2: Common combos
  { combo: 'oo', sound: 'oo', exampleWord: 'boom', exampleEmoji: '🌳', level: 2 },
  { combo: 'ee', sound: 'ee', exampleWord: 'been', exampleEmoji: '🦵', level: 2 },
  { combo: 'aa', sound: 'aa', exampleWord: 'maan', exampleEmoji: '🌙', level: 2 },
  { combo: 'ie', sound: 'ie', exampleWord: 'bier', exampleEmoji: '🥤', level: 2 },
  { combo: 'oe', sound: 'oe', exampleWord: 'boek', exampleEmoji: '📖', level: 2 },
  { combo: 'uu', sound: 'uu', exampleWord: 'vuur', exampleEmoji: '🔥', level: 2 },
  { combo: 'eu', sound: 'eu', exampleWord: 'neus', exampleEmoji: '👃', level: 2 },
  { combo: 'ui', sound: 'ui', exampleWord: 'huis', exampleEmoji: '🏠', level: 2 },
  { combo: 'an', sound: 'an', exampleWord: 'pan', exampleEmoji: '🍳', level: 2 },
  { combo: 'en', sound: 'en', exampleWord: 'pen', exampleEmoji: '🖊️', level: 2 },
  { combo: 'in', sound: 'in', exampleWord: 'kin', exampleEmoji: '😊', level: 2 },
  { combo: 'on', sound: 'on', exampleWord: 'ton', exampleEmoji: '🛢️', level: 2 },

  // Level 3: Trickier combos
  { combo: 'ou', sound: 'ou', exampleWord: 'hout', exampleEmoji: '🪵', level: 3 },
  { combo: 'au', sound: 'au', exampleWord: 'blauw', exampleEmoji: '🔵', level: 3 },
  { combo: 'ei', sound: 'ei', exampleWord: 'ei', exampleEmoji: '🥚', level: 3 },
  { combo: 'ij', sound: 'ij', exampleWord: 'ijs', exampleEmoji: '🍦', level: 3 },
  { combo: 'ch', sound: 'ch', exampleWord: 'chocola', exampleEmoji: '🍫', level: 3 },
  { combo: 'sch', sound: 'sch', exampleWord: 'school', exampleEmoji: '🏫', level: 3 },
  { combo: 'ng', sound: 'ng', exampleWord: 'ring', exampleEmoji: '💍', level: 3 },
  { combo: 'nk', sound: 'nk', exampleWord: 'bank', exampleEmoji: '🪑', level: 3 },
  { combo: 'aai', sound: 'aai', exampleWord: 'draai', exampleEmoji: '🔄', level: 3 },
  { combo: 'ooi', sound: 'ooi', exampleWord: 'mooi', exampleEmoji: '✨', level: 3 },
  { combo: 'oei', sound: 'oei', exampleWord: 'groei', exampleEmoji: '🌱', level: 3 },
  { combo: 'ouw', sound: 'ouw', exampleWord: 'vrouw', exampleEmoji: '👩', level: 3 },
  { combo: 'auw', sound: 'auw', exampleWord: 'pauw', exampleEmoji: '🦚', level: 3 },
  { combo: 'ieuw', sound: 'ieuw', exampleWord: 'nieuw', exampleEmoji: '🆕', level: 3 },
  { combo: 'uw', sound: 'uw', exampleWord: 'duw', exampleEmoji: '👋', level: 3 },
  { combo: 'bl', sound: 'bl', exampleWord: 'bloem', exampleEmoji: '🌸', level: 3 },
  { combo: 'br', sound: 'br', exampleWord: 'brood', exampleEmoji: '🍞', level: 3 },
  { combo: 'dr', sound: 'dr', exampleWord: 'draak', exampleEmoji: '🐉', level: 3 },
  { combo: 'fl', sound: 'fl', exampleWord: 'fluit', exampleEmoji: '🎶', level: 3 },
  { combo: 'fr', sound: 'fr', exampleWord: 'fruit', exampleEmoji: '🍎', level: 3 },
  { combo: 'gl', sound: 'gl', exampleWord: 'glas', exampleEmoji: '🥛', level: 3 },
  { combo: 'gr', sound: 'gr', exampleWord: 'gras', exampleEmoji: '🌿', level: 3 },
  { combo: 'kl', sound: 'kl', exampleWord: 'klok', exampleEmoji: '🕐', level: 3 },
  { combo: 'kr', sound: 'kr', exampleWord: 'kroon', exampleEmoji: '👑', level: 3 },
  { combo: 'pl', sound: 'pl', exampleWord: 'plant', exampleEmoji: '🌿', level: 3 },
  { combo: 'pr', sound: 'pr', exampleWord: 'prins', exampleEmoji: '🤴', level: 3 },
  { combo: 'sl', sound: 'sl', exampleWord: 'slak', exampleEmoji: '🐌', level: 3 },
  { combo: 'sn', sound: 'sn', exampleWord: 'sneeuw', exampleEmoji: '❄️', level: 3 },
  { combo: 'sp', sound: 'sp', exampleWord: 'spin', exampleEmoji: '🕷️', level: 3 },
  { combo: 'st', sound: 'st', exampleWord: 'ster', exampleEmoji: '⭐', level: 3 },
  { combo: 'tr', sound: 'tr', exampleWord: 'trein', exampleEmoji: '🚂', level: 3 },
  { combo: 'vl', sound: 'vl', exampleWord: 'vlieg', exampleEmoji: '🪰', level: 3 },
  { combo: 'zw', sound: 'zw', exampleWord: 'zwaan', exampleEmoji: '🦢', level: 3 },
];

/**
 * Get letters for a specific level
 */
export function getLettersByLevel(level: number): LetterData[] {
  return letters.filter(l => l.level <= level);
}

/**
 * Get random wrong options for a letter quiz
 * Ensures visually/phonetically similar letters are included as distractors
 */
export function getDistractors(
  correctLetter: LetterData,
  count: number = 3,
  pool?: LetterData[]
): LetterData[] {
  const available = (pool || letters).filter(l => l.letter !== correctLetter.letter);

  // Confusing pairs for dyslexic readers
  const confusingPairs: Record<string, string[]> = {
    'b': ['d', 'p'],
    'd': ['b', 'p'],
    'p': ['b', 'd', 'q'],
    'q': ['p', 'b', 'd'],
    'm': ['n', 'w'],
    'n': ['m', 'u'],
    'u': ['n', 'v'],
    'v': ['u', 'w'],
    'w': ['v', 'm'],
    'i': ['l', 'j'],
    'l': ['i', 'j'],
    'j': ['i', 'l'],
    'a': ['e', 'o'],
    'e': ['a', 'i'],
    'o': ['a', 'e'],
    's': ['z'],
    'z': ['s'],
    'f': ['v'],
  };

  const distractors: LetterData[] = [];

  // First, try to include confusing pairs
  const confusing = confusingPairs[correctLetter.letter] || [];
  for (const c of confusing) {
    if (distractors.length >= count) break;
    const found = available.find(l => l.letter === c);
    if (found) {
      distractors.push(found);
    }
  }

  // Fill remaining with random letters
  const remaining = available.filter(l => !distractors.includes(l));
  while (distractors.length < count && remaining.length > 0) {
    const idx = Math.floor(Math.random() * remaining.length);
    distractors.push(remaining[idx]);
    remaining.splice(idx, 1);
  }

  return distractors;
}
