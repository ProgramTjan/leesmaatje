/**
 * Text-to-Speech utility using the Web Speech API
 * Configured for Dutch (nl-NL) pronunciation
 *
 * - Async voice loading via onvoiceschanged
 * - Prefers high-quality / online Dutch voices
 * - Retries voice selection if no Dutch voice was found initially
 * - Chrome workaround for stuck speechSynthesis
 */

let cachedVoice: SpeechSynthesisVoice | null = null;
let voiceLoadPromise: Promise<void> | null = null;

/**
 * Quality ranking for Dutch voices.
 * Higher score = better quality. Online / premium voices score highest.
 */
function scoreVoice(v: SpeechSynthesisVoice): number {
  let score = 0;
  const name = v.name.toLowerCase();

  // Prefer nl-NL over nl-BE for standard Dutch
  if (v.lang === 'nl-NL') score += 10;
  else if (v.lang.startsWith('nl')) score += 5;

  // Online / remote voices are generally higher quality
  if (!v.localService) score += 20;

  // Premium voice indicators (Google, Microsoft, Apple)
  if (name.includes('google')) score += 15;
  if (name.includes('microsoft') && name.includes('online')) score += 15;
  if (name.includes('microsoft')) score += 8;

  // Female voices tend to sound friendlier for children
  if (name.includes('female') || name.includes('vrouw')) score += 3;

  // Known good Dutch voice names
  if (name.includes('lotte') || name.includes('fleur')) score += 5;

  return score;
}

function selectBestDutchVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  const dutchVoices = voices.filter(v => v.lang.startsWith('nl'));

  if (dutchVoices.length === 0) return null;

  // Sort by quality score, pick the best
  dutchVoices.sort((a, b) => scoreVoice(b) - scoreVoice(a));
  return dutchVoices[0];
}

function loadVoices(): Promise<void> {
  if (voiceLoadPromise) return voiceLoadPromise;

  voiceLoadPromise = new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve();
      return;
    }

    // Try immediately — some browsers have voices ready synchronously
    cachedVoice = selectBestDutchVoice();
    if (cachedVoice) {
      resolve();
      return;
    }

    // Wait for voices to become available (Chrome loads them async)
    const handler = () => {
      cachedVoice = selectBestDutchVoice();
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      resolve();
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler);

    // Timeout fallback — some browsers never fire voiceschanged
    setTimeout(() => {
      cachedVoice = selectBestDutchVoice();
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      resolve();
    }, 2000);
  });

  return voiceLoadPromise;
}

// Keep listening for new voices even after initial load.
// Some browsers add higher quality voices after the first batch.
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    const better = selectBestDutchVoice();
    if (better) cachedVoice = better;
  });
  loadVoices();
}

export async function speak(text: string, rate: number = 0.85): Promise<void> {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  // Wait for initial voice loading
  await loadVoices();

  // If we still don't have a Dutch voice, try once more (voices may have loaded late)
  if (!cachedVoice) {
    cachedVoice = selectBestDutchVoice();
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'nl-NL';
    utterance.rate = rate;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    // Explicitly set the Dutch voice — without this, browsers fall back to
    // the system default which is usually English.
    if (cachedVoice) {
      utterance.voice = cachedVoice;
    }

    window.speechSynthesis.speak(utterance);

    // Chrome workaround: pause/resume prevents speechSynthesis from going silent
    const watchdog = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        clearInterval(watchdog);
      } else {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 5000);

    utterance.onend = () => {
      clearInterval(watchdog);
      resolve();
    };
    utterance.onerror = () => {
      clearInterval(watchdog);
      resolve();
    };
  });
}

export function speakLetter(letter: string): Promise<void> {
  return speak(letter, 0.7);
}

export function speakWord(word: string): Promise<void> {
  return speak(word, 0.75);
}

export function speakSyllable(syllable: string): Promise<void> {
  return speak(syllable, 0.6);
}

export function speakEncouragement(): Promise<void> {
  const phrases = [
    'Goed zo!',
    'Super!',
    'Fantastisch!',
    'Heel knap!',
    'Geweldig!',
    'Wat goed!',
    'Prima!',
    'Top!',
    'Je bent een ster!',
    'Lekker bezig!',
    'Wauw, wat knap!',
    'Ga zo door!',
  ];
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  return speak(phrase, 0.95);
}

export function speakTryAgain(): Promise<void> {
  const phrases = [
    'Probeer het nog eens!',
    'Bijna! Nog een keer.',
    'Dat was niet helemaal goed. Probeer nog eens!',
  ];
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  return speak(phrase, 0.85);
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
