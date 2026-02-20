/**
 * Rijmwoorden oefendata voor groep 3-5
 *
 * Elk item heeft:
 *   - word: het doelwoord
 *   - emoji: visuele hint
 *   - rhymes: woorden die rijmen (keuze-opties)
 *   - distractors: woorden die NIET rijmen (keuze-opties)
 *
 * Niveaus:
 *   1 – Korte CVC-woorden (3-4 letters), sterke rijmen
 *   2 – 4-5 letter woorden, lichtere variatie
 *   3 – Langere woorden, complexere rijmen
 */

export interface RijmItem {
  word: string;
  emoji: string;
  rhymes: string[];    // minstens 3 opties
  distractors: string[]; // minstens 3 opties
  level: 1 | 2 | 3;
}

export const rijmData: RijmItem[] = [
  // ── Niveau 1 ──
  { word: 'kat', emoji: '🐱', rhymes: ['mat', 'rat', 'bat', 'hat'], distractors: ['hond', 'boom', 'vis', 'neus'], level: 1 },
  { word: 'bal', emoji: '⚽', rhymes: ['dal', 'wal', 'hal', 'val'], distractors: ['boot', 'roos', 'maan', 'tafel'], level: 1 },
  { word: 'vis', emoji: '🐟', rhymes: ['dis', 'wis', 'lis', 'his'], distractors: ['beer', 'zon', 'lamp', 'boom'], level: 1 },
  { word: 'maan', emoji: '🌙', rhymes: ['baan', 'taan', 'raan', 'vaan'], distractors: ['kat', 'vis', 'huis', 'ring'], level: 1 },
  { word: 'roos', emoji: '🌹', rhymes: ['boos', 'goos', 'loos', 'noos'], distractors: ['hond', 'fiets', 'lamp', 'bed'], level: 1 },
  { word: 'boot', emoji: '⛵', rhymes: ['moot', 'noot', 'root', 'zoot'], distractors: ['kat', 'vis', 'maan', 'bal'], level: 1 },
  { word: 'beer', emoji: '🐻', rhymes: ['meer', 'veer', 'leer', 'peer'], distractors: ['bal', 'roos', 'hond', 'dak'], level: 1 },
  { word: 'hond', emoji: '🐶', rhymes: ['bond', 'fond', 'lond', 'mond'], distractors: ['boot', 'maan', 'kat', 'vis'], level: 1 },
  { word: 'zon', emoji: '☀️', rhymes: ['bon', 'ton', 'von', 'kon'], distractors: ['maan', 'roos', 'hond', 'bal'], level: 1 },
  { word: 'bed', emoji: '🛏️', rhymes: ['red', 'ned', 'wed', 'ked'], distractors: ['zon', 'bal', 'vis', 'roos'], level: 1 },

  // ── Niveau 2 ──
  { word: 'fiets', emoji: '🚲', rhymes: ['diets', 'niets', 'riets', 'wiets'], distractors: ['hond', 'boom', 'stoel', 'lamp'], level: 2 },
  { word: 'boom', emoji: '🌳', rhymes: ['room', 'zoom', 'loom', 'droom'], distractors: ['fiets', 'hond', 'kat', 'vis'], level: 2 },
  { word: 'huis', emoji: '🏠', rhymes: ['muis', 'tuis', 'luis', 'buis'], distractors: ['boom', 'zon', 'bal', 'maan'], level: 2 },
  { word: 'boek', emoji: '📚', rhymes: ['koek', 'loek', 'moek', 'zoek'], distractors: ['huis', 'boom', 'kat', 'bal'], level: 2 },
  { word: 'brief', emoji: '✉️', rhymes: ['lief', 'dief', 'rief', 'sief'], distractors: ['boek', 'huis', 'boom', 'vis'], level: 2 },
  { word: 'stoel', emoji: '🪑', rhymes: ['doel', 'moel', 'roel', 'voel'], distractors: ['brief', 'huis', 'boom', 'vis'], level: 2 },
  { word: 'tafel', emoji: '🪵', rhymes: ['kafel', 'wafel', 'rafel', 'mafel'], distractors: ['stoel', 'boom', 'kat', 'huis'], level: 2 },
  { word: 'trein', emoji: '🚂', rhymes: ['klein', 'rein', 'wein', 'pein'], distractors: ['fiets', 'boom', 'hond', 'kat'], level: 2 },
  { word: 'school', emoji: '🏫', rhymes: ['pool', 'tool', 'dool', 'fool'], distractors: ['trein', 'boom', 'huis', 'kat'], level: 2 },
  { word: 'appel', emoji: '🍎', rhymes: ['chapel', 'rappel', 'tappel', 'kappel'], distractors: ['school', 'boom', 'hond', 'vis'], level: 2 },

  // ── Niveau 3 ──
  { word: 'vliegen', emoji: '✈️', rhymes: ['liegen', 'biegen', 'niegen', 'ziegen'], distractors: ['rennen', 'slapen', 'wonen', 'bakken'], level: 3 },
  { word: 'koning', emoji: '👑', rhymes: ['honing', 'toning', 'boning', 'zoning'], distractors: ['vogel', 'school', 'appel', 'trein'], level: 3 },
  { word: 'bloemen', emoji: '💐', rhymes: ['groemen', 'roemen', 'zoemen', 'doemen'], distractors: ['koning', 'school', 'appel', 'boom'], level: 3 },
  { word: 'vlinder', emoji: '🦋', rhymes: ['kinder', 'minder', 'binder', 'hinder'], distractors: ['bloemen', 'boom', 'school', 'trein'], level: 3 },
  { word: 'slapen', emoji: '😴', rhymes: ['happen', 'rapen', 'kapen', 'tapen'], distractors: ['vlinder', 'bloemen', 'school', 'fiets'], level: 3 },
  { word: 'spelen', emoji: '🎮', rhymes: ['delen', 'helen', 'belen', 'velen'], distractors: ['slapen', 'vlinder', 'boom', 'huis'], level: 3 },
  { word: 'kijken', emoji: '👀', rhymes: ['lijken', 'rijken', 'bijken', 'dijken'], distractors: ['spelen', 'slapen', 'bloemen', 'school'], level: 3 },
  { word: 'werken', emoji: '🔨', rhymes: ['merken', 'kerken', 'berken', 'terken'], distractors: ['kijken', 'spelen', 'vlinder', 'boom'], level: 3 },
];

export function getRijmItems(level: 1 | 2 | 3, count: number): RijmItem[] {
  const pool = rijmData.filter((r) => r.level === level);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/** Bouw een vraag: 1 rijmwoord + 3 afleiders, gemengd */
export function buildRijmQuestion(item: RijmItem): { correct: string; options: string[] } {
  const correct = item.rhymes[Math.floor(Math.random() * item.rhymes.length)];
  const distractorPool = [...item.distractors].sort(() => Math.random() - 0.5);
  const options = [correct, ...distractorPool.slice(0, 3)].sort(() => Math.random() - 0.5);
  return { correct, options };
}
