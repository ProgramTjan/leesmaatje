import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 10;

const requestLog = new Map<string, number[]>();

function isRateLimited(clientId: string): boolean {
  const now = Date.now();
  const timestamps = requestLog.get(clientId) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  requestLog.set(clientId, recent);
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) return true;
  recent.push(now);
  return false;
}

type ExerciseType = 'woorden' | 'zinnen' | 'spellingregels' | 'flitslezen' | 'woorddelen';

const VALID_TYPES: ExerciseType[] = ['woorden', 'zinnen', 'spellingregels', 'flitslezen', 'woorddelen'];

function getSystemPrompt(type: ExerciseType, level: number, count: number): string {
  const base = `Je bent een expert in Nederlandse taal en dyslexie-onderwijs. Genereer exact ${count} oefeningen op niveau ${level} in correct JSON-formaat. Antwoord ALLEEN met een JSON array, geen uitleg of markdown.`;

  switch (type) {
    case 'woorden':
      return `${base}

Genereer Nederlandse woorden om te spellen. Niveau ${level} betekent:
- Level 4-5: woorden van 8-10 letters met lastige combinaties
- Level 6+: woorden van 10+ letters, samenstellingen, leenwoorden
- Hoe hoger het level, hoe langer en complexer de woorden

Formaat (array van objecten):
[
  { "word": "bibliotheek", "emoji": "📚", "hint": "Hier leen je boeken", "level": ${level}, "category": "gebouwen" }
]

Elke entry heeft: word (string), emoji (1 emoji), hint (korte Nederlandse zin), level (${level}), category (string).`;

    case 'zinnen':
      return `${base}

Genereer Nederlandse zinnen die kinderen in de juiste volgorde moeten zetten. Niveau ${level} betekent:
- Level 4-5: zinnen van 7-9 woorden met bijzinnen
- Level 6+: complexe zinnen van 9+ woorden met bijzinnen, lijdende vorm, etc.

Formaat (array van objecten):
[
  { "words": ["de", "jongen", "die", "het", "boek", "las", "was", "blij"], "emoji": "📖😊", "level": ${level}, "category": "school" }
]

Elke entry heeft: words (array van losse woorden in correcte volgorde), emoji (1-2 emoji's als hint), level (${level}), category (string).`;

    case 'spellingregels':
      return `${base}

Genereer Nederlandse spellingoefeningen. Categorieën: "dt" (d/t keuze), "ei_ij", "au_ou", "open_gesloten" (open vs gesloten lettergreep).
Niveau ${level} betekent moeilijkere zinnen en subtielere regels.

Formaat (array van objecten):
[
  { "sentence": "De brief ___ vandaag verstuurd.", "correct": "wordt", "wrong": ["word"], "explanation": "Wordt met -dt bij hij/zij/het in lijdende vorm.", "category": "dt", "level": ${level} }
]

Elke entry heeft: sentence (zin met ___ als blank), correct (string), wrong (array van 1-2 foute opties), explanation (korte uitleg van de regel), category ("dt"|"ei_ij"|"au_ou"|"open_gesloten"), level (${level}).
Zorg dat de uitleg educatief is en de spellingregel helder uitlegt.`;

    case 'flitslezen':
      return `${base}

Genereer Nederlandse woorden voor flitslezen (snel herkennen). Niveau ${level} betekent:
- Level 4: woorden van 9-11 letters, onregelmatige spelling
- Level 5+: woorden van 11+ letters, zeldzamere woorden, leenwoorden

Formaat (array van objecten):
[
  { "word": "verantwoordelijk", "level": ${level} }
]

Elke entry heeft: word (string), level (${level}). Gebruik echte, correcte Nederlandse woorden.`;

    case 'woorddelen':
      return `${base}

Genereer Nederlandse woorden die kinderen moeten opsplitsen in woorddelen. Types: "samenstelling", "voorvoegsel", "achtervoegsel".
Niveau ${level} betekent complexere woorden met meerdere voor-/achtervoegsels.

Formaat (array van objecten):
[
  { "word": "onvergetelijk", "parts": ["on", "vergetel", "ijk"], "type": "voorvoegsel", "hint": "Iets dat je nooit vergeet", "level": ${level} }
]

Elke entry heeft: word (string), parts (array van woorddelen in correcte volgorde), type ("samenstelling"|"voorvoegsel"|"achtervoegsel"), hint (korte Nederlandse beschrijving), level (${level}).
Zorg dat de opsplitsing linguistisch correct is.`;
  }
}

export async function HEAD() {
  // Health check: returns 200 if API key is set, 501 if not
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your-api-key-here') {
    return new NextResponse(null, { status: 501 });
  }
  return new NextResponse(null, { status: 200 });
}

export async function POST(request: NextRequest) {
  // Check API key
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your-api-key-here') {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY not configured' },
      { status: 501 }
    );
  }

  // Rate limiting
  const clientId = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown';
  if (isRateLimited(clientId)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again in a minute.' },
      { status: 429 }
    );
  }

  // Parse body
  let body: { type?: string; level?: number; count?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { type, level, count = 10 } = body;

  if (!type || !VALID_TYPES.includes(type as ExerciseType)) {
    return NextResponse.json({ error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}` }, { status: 400 });
  }
  if (!level || typeof level !== 'number' || level < 1 || level > 20) {
    return NextResponse.json({ error: 'Invalid level (1-20)' }, { status: 400 });
  }
  if (count < 1 || count > 20) {
    return NextResponse.json({ error: 'Invalid count (1-20)' }, { status: 400 });
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: 'claude-3-5-haiku-latest',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: getSystemPrompt(type as ExerciseType, level, count),
        },
      ],
    });

    // Extract text content
    const textBlock = message.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No text in AI response' }, { status: 500 });
    }

    // Parse JSON from response -- handle possible markdown code fences
    let jsonStr = textBlock.text.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const exercises = JSON.parse(jsonStr);

    if (!Array.isArray(exercises)) {
      return NextResponse.json({ error: 'AI did not return an array' }, { status: 500 });
    }

    return NextResponse.json({ exercises, level, type });
  } catch (err) {
    console.error('AI generation error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `AI generation failed: ${message}` }, { status: 500 });
  }
}
