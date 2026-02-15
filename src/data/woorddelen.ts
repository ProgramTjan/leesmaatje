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
  { word: 'badkamer', parts: ['bad', 'kamer'], type: 'samenstelling', hint: 'Hier neem je een bad of douche', level: 1 },
  { word: 'regenboog', parts: ['regen', 'boog'], type: 'samenstelling', hint: 'Kleuren aan de hemel na de regen', level: 1 },
  { word: 'vliegtuig', parts: ['vlieg', 'tuig'], type: 'samenstelling', hint: 'Vliegt door de lucht', level: 1 },
  { word: 'handschoen', parts: ['hand', 'schoen'], type: 'samenstelling', hint: 'Draag je om je handen warm te houden', level: 1 },
  { word: 'kerstboom', parts: ['kerst', 'boom'], type: 'samenstelling', hint: 'Versier je met kerst', level: 1 },
  { word: 'appelsap', parts: ['appel', 'sap'], type: 'samenstelling', hint: 'Drankje gemaakt van appels', level: 1 },
  { word: 'rugzak', parts: ['rug', 'zak'], type: 'samenstelling', hint: 'Draag je op je rug', level: 1 },
  { word: 'schoorsteen', parts: ['schoor', 'steen'], type: 'samenstelling', hint: 'Zit bovenop het dak', level: 1 },
  { word: 'waterval', parts: ['water', 'val'], type: 'samenstelling', hint: 'Water dat naar beneden valt', level: 1 },
  { word: 'dierentuin', parts: ['dieren', 'tuin'], type: 'samenstelling', hint: 'Hier kun je wilde dieren bekijken', level: 1 },
  { word: 'pannkoek', parts: ['pan', 'koek'], type: 'samenstelling', hint: 'Bak je in een pan', level: 1 },
  { word: 'vuurwerk', parts: ['vuur', 'werk'], type: 'samenstelling', hint: 'Mooi licht met oud en nieuw', level: 1 },
  { word: 'ijsbeer', parts: ['ijs', 'beer'], type: 'samenstelling', hint: 'Grote witte beer op het ijs', level: 1 },
  { word: 'zeepaard', parts: ['zee', 'paard'], type: 'samenstelling', hint: 'Klein diertje in de zee', level: 1 },
  { word: 'tandenborstel', parts: ['tanden', 'borstel'], type: 'samenstelling', hint: 'Poets je je tanden mee', level: 1 },

  // ─── Level 2: Voorvoegsels (prefixes) ───
  { word: 'onmogelijk', parts: ['on', 'mogelijk'], type: 'voorvoegsel', hint: '"on-" maakt het tegenovergestelde', level: 2 },
  { word: 'verhuizen', parts: ['ver', 'huizen'], type: 'voorvoegsel', hint: '"ver-" betekent: ergens anders heen', level: 2 },
  { word: 'bekijken', parts: ['be', 'kijken'], type: 'voorvoegsel', hint: '"be-" = iets goed doen', level: 2 },
  { word: 'ontsnappen', parts: ['ont', 'snappen'], type: 'voorvoegsel', hint: '"ont-" = weg/los van', level: 2 },
  { word: 'herhalen', parts: ['her', 'halen'], type: 'voorvoegsel', hint: '"her-" = opnieuw', level: 2 },
  { word: 'oneerlijk', parts: ['on', 'eerlijk'], type: 'voorvoegsel', hint: '"on-" maakt het tegenovergestelde', level: 2 },
  { word: 'vergeten', parts: ['ver', 'geten'], type: 'voorvoegsel', hint: '"ver-" verandert de betekenis', level: 2 },
  { word: 'beginnen', parts: ['be', 'ginnen'], type: 'voorvoegsel', hint: '"be-" maakt een werkwoord', level: 2 },
  { word: 'ontdekken', parts: ['ont', 'dekken'], type: 'voorvoegsel', hint: '"ont-" = blootleggen, vinden', level: 2 },
  { word: 'onzichtbaar', parts: ['on', 'zichtbaar'], type: 'voorvoegsel', hint: '"on-" = niet, tegenovergestelde', level: 2 },
  { word: 'verdwalen', parts: ['ver', 'dwalen'], type: 'voorvoegsel', hint: '"ver-" verandert de betekenis', level: 2 },
  { word: 'herkennen', parts: ['her', 'kennen'], type: 'voorvoegsel', hint: '"her-" = opnieuw kennen', level: 2 },
  { word: 'bewaken', parts: ['be', 'waken'], type: 'voorvoegsel', hint: '"be-" = ergens op letten', level: 2 },
  { word: 'onbekend', parts: ['on', 'bekend'], type: 'voorvoegsel', hint: '"on-" maakt het tegenovergestelde', level: 2 },
  { word: 'vertellen', parts: ['ver', 'tellen'], type: 'voorvoegsel', hint: '"ver-" = een verhaal doen', level: 2 },

  // ─── Level 2: Achtervoegsel (suffixes) ───
  { word: 'vrolijk', parts: ['vrool', 'ijk'], type: 'achtervoegsel', hint: '"-lijk" maakt een bijvoeglijk naamwoord', level: 2 },
  { word: 'vriendschap', parts: ['vriend', 'schap'], type: 'achtervoegsel', hint: '"-schap" = een toestand of groep', level: 2 },
  { word: 'speelbaar', parts: ['speel', 'baar'], type: 'achtervoegsel', hint: '"-baar" = het kan gedaan worden', level: 2 },
  { word: 'snelheid', parts: ['snel', 'heid'], type: 'achtervoegsel', hint: '"-heid" maakt een zelfstandig naamwoord', level: 2 },
  { word: 'dankbaar', parts: ['dank', 'baar'], type: 'achtervoegsel', hint: '"-baar" = vol van dank', level: 2 },
  { word: 'leesbaar', parts: ['lees', 'baar'], type: 'achtervoegsel', hint: '"-baar" = het kan gelezen worden', level: 2 },
  { word: 'vrijheid', parts: ['vrij', 'heid'], type: 'achtervoegsel', hint: '"-heid" maakt een zelfstandig naamwoord', level: 2 },
  { word: 'landschap', parts: ['land', 'schap'], type: 'achtervoegsel', hint: '"-schap" = hoe het land eruitziet', level: 2 },
  { word: 'eerlijk', parts: ['eer', 'lijk'], type: 'achtervoegsel', hint: '"-lijk" maakt een bijvoeglijk naamwoord', level: 2 },
  { word: 'zichtbaar', parts: ['zicht', 'baar'], type: 'achtervoegsel', hint: '"-baar" = het kan gezien worden', level: 2 },

  // ─── Level 3: Complex samenstellingen ───
  { word: 'voetbalveld', parts: ['voetbal', 'veld'], type: 'samenstelling', hint: 'Het veld waar je voetbalt', level: 3 },
  { word: 'ziekenhuisbed', parts: ['ziekenhuis', 'bed'], type: 'samenstelling', hint: 'Een bed in het ziekenhuis', level: 3 },
  { word: 'verjaardagsfeest', parts: ['verjaardags', 'feest'], type: 'samenstelling', hint: 'Een feest voor je verjaardag', level: 3 },
  { word: 'onderwaterwereld', parts: ['onderwater', 'wereld'], type: 'samenstelling', hint: 'De wereld onder water', level: 3 },
  { word: 'schoolmeester', parts: ['school', 'meester'], type: 'samenstelling', hint: 'De meester op school', level: 3 },
  { word: 'brandweerauto', parts: ['brandweer', 'auto'], type: 'samenstelling', hint: 'De auto van de brandweer', level: 3 },
  { word: 'speelgoedwinkel', parts: ['speelgoed', 'winkel'], type: 'samenstelling', hint: 'Een winkel met speelgoed', level: 3 },
  { word: 'sneeuwvlokken', parts: ['sneeuw', 'vlokken'], type: 'samenstelling', hint: 'Kleine stukjes sneeuw', level: 3 },
  { word: 'sprookjesboek', parts: ['sprookjes', 'boek'], type: 'samenstelling', hint: 'Een boek met sprookjes', level: 3 },
  { word: 'zonsondergang', parts: ['zons', 'ondergang'], type: 'samenstelling', hint: 'Als de zon ondergaat', level: 3 },

  // ─── Level 3: Complex voor-/achtervoegsel ───
  { word: 'ongelooflijk', parts: ['on', 'geloof', 'lijk'], type: 'voorvoegsel', hint: '"on-" + "geloof" + "-lijk"', level: 3 },
  { word: 'onvergetelijk', parts: ['on', 'vergetel', 'ijk'], type: 'voorvoegsel', hint: 'Iets dat je nooit vergeet', level: 3 },
  { word: 'herbruikbaar', parts: ['her', 'bruik', 'baar'], type: 'voorvoegsel', hint: 'Opnieuw te gebruiken', level: 3 },
  { word: 'onbreekbaar', parts: ['on', 'breek', 'baar'], type: 'voorvoegsel', hint: 'Kan niet breken', level: 3 },
  { word: 'betoverend', parts: ['be', 'tover', 'end'], type: 'voorvoegsel', hint: 'Alsof er toverij in zit', level: 3 },
  { word: 'onverwacht', parts: ['on', 'verwacht'], type: 'voorvoegsel', hint: 'Niet verwacht, verrassing', level: 3 },
  { word: 'onzorgvuldig', parts: ['on', 'zorgvuldig'], type: 'voorvoegsel', hint: 'Niet goed oplettend', level: 3 },
  { word: 'verbeelding', parts: ['ver', 'beelding'], type: 'voorvoegsel', hint: 'Wat je in je hoofd ziet', level: 3 },
  { word: 'ontwikkeling', parts: ['ont', 'wikkeling'], type: 'voorvoegsel', hint: 'Groeien en leren', level: 3 },
  { word: 'onafhankelijk', parts: ['on', 'afhankelijk'], type: 'voorvoegsel', hint: 'Niet van iemand anders afhankelijk', level: 3 },
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
