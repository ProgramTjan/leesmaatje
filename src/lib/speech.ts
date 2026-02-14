/**
 * Text-to-Speech utility using the Web Speech API
 * Configured for Dutch (nl-NL) pronunciation
 */

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speak(text: string, rate: number = 0.85): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve();
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'nl-NL';
    utterance.rate = rate;
    utterance.pitch = 1.1; // Slightly higher pitch, friendlier for kids
    utterance.volume = 1;

    // Try to find a Dutch voice
    const voices = window.speechSynthesis.getVoices();
    const dutchVoice = voices.find(v => v.lang.startsWith('nl'));
    if (dutchVoice) {
      utterance.voice = dutchVoice;
    }

    utterance.onend = () => {
      currentUtterance = null;
      resolve();
    };
    utterance.onerror = (e) => {
      currentUtterance = null;
      // Don't reject on cancel
      if (e.error === 'canceled') {
        resolve();
      } else {
        reject(e);
      }
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  });
}

export function speakLetter(letter: string): Promise<void> {
  // For individual letters, speak them more slowly and clearly
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
  ];
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  return speak(phrase, 0.9);
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
  currentUtterance = null;
}
