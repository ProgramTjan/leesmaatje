/**
 * Word-parts (morphology) exercises.
 *
 * Children split compound words or identify prefixes/suffixes.
 * Strengthens morphological awareness — proven effective for
 * older dyslexic readers (Goodwin & Ahn, 2013).
 */

export type WordPartType = 'samenstelling' | 'voorvoegsel' | 'achtervoegsel';

export interface WordPartData {
  word: string;
  parts: string[]; // correct split, e.g. ['voet', 'bal']
  type: WordPartType;
  hint: string;
  level: number;
}

export const wordParts: WordPartData[] = [
  // ─── Level 1: Samenstellingen (compound words) — easy ───
  { word: 'voetbal', parts: ['voet', 'bal'], type: 'samenstelling', hint: 'Een sport met je voeten en een bal', level: 1 },
  { word: 'zonnebril', parts: ['zonne', 'bril'], type: 'samenstelling', hint: 'Draag je als de zon schijnt', level: 1 },
  { word: 'schooltas', parts: ['school', 'tas'], type: 'samenstelling', hint: 'Neem je mee naar school', level: 1 },
  { word: 'huisdier', parts: ['huis', 'dier'], type: 'samenstelling', hint: 'Een dier dat in je huis woont', level: 1 },
  { word: 'boterham', parts: ['boter', 'ham'], type: 'samenstelling', hint: 'Eet je als lunch', level: 1 },
  { word: 'slaapkamer', parts: ['slaap', 'kamer'], type: 'samenstelling', hint: 'De kamer waar je slaapt', level: 1 },
  { word: 'speeltuin', parts: ['speel', 'tuin'], type: 'samenstelling', hint: 'Hier kun je buiten spelen', level: 1 },
  { word: 'sneeuwpop', parts: ['sneeuw', 'pop'], type: 'samenstelling', hint: 'Maak je in de winter', level: 1 },
  { word: 'fietspad', parts: ['fiets', 'pad'], type: 'samenstelling', hint: 'Hier fiets je op', level: 1 },
  { word: 'broodtrommel', parts: ['brood', 'trommel'], type: 'samenstelling', hint: 'Hier bewaar je je boterham in', level: 1 },

  // ─── Level 2: Voorvoegsels (prefixes) ───
  { word: 'onmogelijk', parts: ['on', 'mogelijk'], type: 'voorvoegsel', hint: '"on-" maakt het tegenovergestelde', level: 2 },
  { word: 'verhuizen', parts: ['ver', 'huizen'], type: 'voorvoegsel', hint: '"ver-" betekent: ergens anders heen', level: 2 },
  { word: 'bekijken', parts: ['be', 'kijken'], type: 'voorvoegsel', hint: '"be-" = iets goed doen', level: 2 },
  { word: 'ontsnappen', parts: ['ont', 'snappen'], type: 'voorvoegsel', hint: '"ont-" = weg/los van', level: 2 },
  { word: 'herhalen', parts: ['her', 'halen'], type: 'voorvoegsel', hint: '"her-" = opnieuw', level: 2 },
  { word: 'oneerlijk', parts: ['on', 'eerlijk'], type: 'voorvoegsel', hint: '"on-" maakt het tegenovergestelde', level: 2 },
  { word: 'vergeten', parts: ['ver', 'geten'], type: 'voorvoegsel', hint: '"ver-" verandert de betekenis', level: 2 },
  { word: 'beginnen', parts: ['be', 'ginnen'], type: 'voorvoegsel', hint: '"be-" maakt een werkwoord', level: 2 },

  // ─── Level 2: Achtervoegsel (suffixes) ───
  { word: 'vrolijk', parts: ['vrool', 'ijk'], type: 'achtervoegsel', hint: '"-lijk" maakt een bijvoeglijk naamwoord', level: 2 },
  { word: 'vriendschap', parts: ['vriend', 'schap'], type: 'achtervoegsel', hint: '"-schap" = een toestand of groep', level: 2 },
  { word: 'speelbaar', parts: ['speel', 'baar'], type: 'achtervoegsel', hint: '"-baar" = het kan gedaan worden', level: 2 },
  { word: 'snelheid', parts: ['snel', 'heid'], type: 'achtervoegsel', hint: '"-heid" maakt een zelfstandig naamwoord', level: 2 },

  // ─── Level 3: Complex samenstellingen ───
  { word: 'voetbalveld', parts: ['voetbal', 'veld'], type: 'samenstelling', hint: 'Het veld waar je voetbalt', level: 3 },
  { word: 'ziekenhuisbed', parts: ['ziekenhuis', 'bed'], type: 'samenstelling', hint: 'Een bed in het ziekenhuis', level: 3 },
  { word: 'verjaardagsfeest', parts: ['verjaardags', 'feest'], type: 'samenstelling', hint: 'Een feest voor je verjaardag', level: 3 },
  { word: 'onderwaterwereld', parts: ['onderwater', 'wereld'], type: 'samenstelling', hint: 'De wereld onder water', level: 3 },

  // ─── Level 3: Complex voor-/achtervoegsel ───
  { word: 'ongelooflijk', parts: ['on', 'geloof', 'lijk'], type: 'voorvoegsel', hint: '"on-" + "geloof" + "-lijk"', level: 3 },
  { word: 'onvergetelijk', parts: ['on', 'vergetel', 'ijk'], type: 'voorvoegsel', hint: 'Iets dat je nooit vergeet', level: 3 },
  { word: 'herbruikbaar', parts: ['her', 'bruik', 'baar'], type: 'voorvoegsel', hint: 'Opnieuw te gebruiken', level: 3 },
  { word: 'onbreekbaar', parts: ['on', 'breek', 'baar'], type: 'voorvoegsel', hint: 'Kan niet breken', level: 3 },
  { word: 'betoverend', parts: ['be', 'tover', 'end'], type: 'voorvoegsel', hint: 'Alsof er toverij in zit', level: 3 },
];

export function getWordPartsByLevel(level: number): WordPartData[] {
  return wordParts.filter((w) => w.level <= level);
}

export function getWordPartsExercise(level: number, count: number = 8): WordPartData[] {
  const pool = getWordPartsByLevel(level);
  return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
}

export const typeLabels: Record<WordPartType, string> = {
  samenstelling: 'Samenstelling',
  voorvoegsel: 'Voorvoegsel',
  achtervoegsel: 'Achtervoegsel',
};
