/**
 * Dutch spelling-rules exercises.
 *
 * Categories based on the most common spelling difficulties
 * for dyslexic readers in Dutch:
 *  - d/t at end of words
 *  - ei / ij confusion
 *  - au / ou confusion
 *  - open vs closed syllables (single vs double consonants)
 */

export type SpellingCategory = 'dt' | 'ei_ij' | 'au_ou' | 'open_gesloten';

export interface SpellingQuestion {
  /** The sentence with a blank: use ___ for the blank */
  sentence: string;
  /** The correct answer */
  correct: string;
  /** Wrong option(s) */
  wrong: string[];
  /** Short explanation shown after answering */
  explanation: string;
  category: SpellingCategory;
  level: number;
}

export const spellingQuestions: SpellingQuestion[] = [
  // ─── D / T ───
  {
    sentence: 'De hond ___ in de tuin.',
    correct: 'rent',
    wrong: ['rend'],
    explanation: 'Na hij/zij/het gebruik je -t. "Hij rent" (stam = ren + t).',
    category: 'dt',
    level: 1,
  },
  {
    sentence: 'Ik ___ een boek.',
    correct: 'lees',
    wrong: ['leest'],
    explanation: 'Na "ik" gebruik je de stam: "ik lees".',
    category: 'dt',
    level: 1,
  },
  {
    sentence: 'Zij ___ naar school.',
    correct: 'fietst',
    wrong: ['fietsd', 'fiest'],
    explanation: 'Stam = fiets + t. De s en t staan allebei in het woord.',
    category: 'dt',
    level: 1,
  },
  {
    sentence: 'Het paard ___ door het weiland.',
    correct: 'draaft',
    wrong: ['draafd'],
    explanation: 'Stam = draaf + t. Bij hij/zij/het voeg je -t toe.',
    category: 'dt',
    level: 2,
  },
  {
    sentence: 'Mijn vader ___ de auto.',
    correct: 'wast',
    wrong: ['wasd'],
    explanation: 'Stam = was + t. Bij hij/zij/het voeg je -t toe.',
    category: 'dt',
    level: 2,
  },
  {
    sentence: 'Het boek ___ op tafel gelegd.',
    correct: 'wordt',
    wrong: ['word'],
    explanation: '"Wordt" met -dt als het bij hij/zij/het hoort.',
    category: 'dt',
    level: 3,
  },
  {
    sentence: 'De brief ___ vandaag verstuurd.',
    correct: 'wordt',
    wrong: ['word', 'word'],
    explanation: '"Wordt" met -dt in de tegenwoordige tijd, lijdende vorm.',
    category: 'dt',
    level: 3,
  },

  // ─── EI / IJ ───
  {
    sentence: 'We gaan met de ___ naar Oma.',
    correct: 'trein',
    wrong: ['trijn'],
    explanation: '"Trein" schrijf je met ei. Onthoud: trein rijdt op het spoor.',
    category: 'ei_ij',
    level: 1,
  },
  {
    sentence: 'In de winter is het ___.',
    correct: 'ijskoud',
    wrong: ['eiskoud'],
    explanation: '"IJs" schrijf je met ij. Denk aan: ijs in de ijskast.',
    category: 'ei_ij',
    level: 1,
  },
  {
    sentence: 'Ik ga graag ___.',
    correct: 'rijden',
    wrong: ['reiden'],
    explanation: '"Rijden" schrijf je met ij.',
    category: 'ei_ij',
    level: 1,
  },
  {
    sentence: 'Het ___ is in de klas.',
    correct: 'meisje',
    wrong: ['mijsje'],
    explanation: '"Meisje" schrijf je met ei.',
    category: 'ei_ij',
    level: 2,
  },
  {
    sentence: 'De ___ was erg spannend.',
    correct: 'reis',
    wrong: ['rijs'],
    explanation: '"Reis" schrijf je met ei. Je maakt een reis.',
    category: 'ei_ij',
    level: 2,
  },
  {
    sentence: 'Hij heeft veel ___.',
    correct: 'tijd',
    wrong: ['teid'],
    explanation: '"Tijd" schrijf je met ij.',
    category: 'ei_ij',
    level: 2,
  },

  // ─── AU / OU ───
  {
    sentence: 'De lucht is ___.',
    correct: 'blauw',
    wrong: ['blouw'],
    explanation: '"Blauw" schrijf je met au + w.',
    category: 'au_ou',
    level: 1,
  },
  {
    sentence: 'De tafel is van ___.',
    correct: 'hout',
    wrong: ['haut'],
    explanation: '"Hout" schrijf je met ou.',
    category: 'au_ou',
    level: 1,
  },
  {
    sentence: 'Hij is erg ___.',
    correct: 'oud',
    wrong: ['aud'],
    explanation: '"Oud" schrijf je met ou.',
    category: 'au_ou',
    level: 2,
  },
  {
    sentence: 'De ___ houdt van pauzes.',
    correct: 'juf',
    wrong: ['juv'],
    explanation: 'Let op: "juf" is een gewoon woord, niet met au/ou!',
    category: 'au_ou',
    level: 2,
  },
  {
    sentence: 'De pauw heeft mooie ___.',
    correct: 'veren',
    wrong: ['veeren'],
    explanation: '"Veren" met enkele e. De pauw (met au+w) heeft veren.',
    category: 'au_ou',
    level: 3,
  },

  // ─── Open / gesloten lettergreep ───
  {
    sentence: 'Er staan veel ___ aan de hemel.',
    correct: 'manen',
    wrong: ['mannen'],
    explanation: '"Manen" (van de maan) = open lettergreep: ma-nen. "Mannen" = man-nen (meer dan 1 man).',
    category: 'open_gesloten',
    level: 1,
  },
  {
    sentence: 'De ___ zit in een kooi.',
    correct: 'vogel',
    wrong: ['voggel'],
    explanation: '"Vogel" = vo-gel. De o klinkt lang (open lettergreep), dus geen dubbele g.',
    category: 'open_gesloten',
    level: 1,
  },
  {
    sentence: 'Wij gaan vandaag ___.',
    correct: 'lopen',
    wrong: ['loppen'],
    explanation: '"Lopen" = lo-pen. Open lettergreep, de o klinkt lang.',
    category: 'open_gesloten',
    level: 2,
  },
  {
    sentence: 'De hond heeft vier ___.',
    correct: 'poten',
    wrong: ['potten'],
    explanation: '"Poten" (voeten van een dier) = po-ten. "Potten" = pot-ten (meerdere potten).',
    category: 'open_gesloten',
    level: 2,
  },
  {
    sentence: 'De ___ gaan we naar het bos.',
    correct: 'bomen',
    wrong: ['bommen'],
    explanation: '"Bomen" = bo-men (open lettergreep). "Bommen" = bom-men (explosief).',
    category: 'open_gesloten',
    level: 3,
  },
  {
    sentence: 'Ik heb twee ___.',
    correct: 'noten',
    wrong: ['notten'],
    explanation: '"Noten" = no-ten (open lettergreep). Lang klinkende o.',
    category: 'open_gesloten',
    level: 3,
  },
];

export function getSpellingByCategory(category: SpellingCategory): SpellingQuestion[] {
  return spellingQuestions.filter((q) => q.category === category);
}

export function getSpellingByLevel(level: number): SpellingQuestion[] {
  return spellingQuestions.filter((q) => q.level <= level);
}

export function getSpellingExercise(level: number, count: number = 8): SpellingQuestion[] {
  const pool = getSpellingByLevel(level);
  return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
}

export const categoryLabels: Record<SpellingCategory, string> = {
  dt: 'd of t?',
  ei_ij: 'ei of ij?',
  au_ou: 'au of ou?',
  open_gesloten: 'Open of gesloten?',
};
