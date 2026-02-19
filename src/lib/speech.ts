/**
 * Text-to-Speech utility using the Web Speech API
 * Configured for Dutch (nl-NL) pronunciation
 *
 * Improvements:
 * - Async voice loading via onvoiceschanged
 * - Prefers high-quality / online Dutch voices
 * - Caches the selected voice for performance
 */

let cachedVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

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

function ensureVoicesLoaded(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve();
      return;
    }

    // Voices already loaded
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      if (!voicesLoaded) {
        cachedVoice = selectBestDutchVoice();
        voicesLoaded = true;
      }
      resolve();
      return;
    }

    // Wait for voices to become available
    const handler = () => {
      cachedVoice = selectBestDutchVoice();
      voicesLoaded = true;
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      resolve();
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler);

    // Timeout fallback — some browsers never fire voiceschanged
    setTimeout(() => {
      if (!voicesLoaded) {
        cachedVoice = selectBestDutchVoice();
        voicesLoaded = true;
        window.speechSynthesis.removeEventListener('voiceschanged', handler);
      }
      resolve();
    }, 1000);
  });
}

// Kick off voice loading immediately on import
if (typeof window !== 'undefined') {
  ensureVoicesLoaded();
}

export async function speak(text: string, rate: number = 0.85): Promise<void> {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  // Make sure we have the best voice selected
  await ensureVoicesLoaded();

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'nl-NL';
    utterance.rate = rate;
    utterance.pitch = 1.1; // Slightly higher pitch, friendlier for kids
    utterance.volume = 1;

    if (cachedVoice) {
      utterance.voice = cachedVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve(); // Don't break the app on speech errors

    // Chrome bug workaround: speechSynthesis can get stuck.
    // Pausing and resuming prevents silent failures.
    window.speechSynthesis.speak(utterance);

    // Chrome pause/resume workaround for long utterances
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
