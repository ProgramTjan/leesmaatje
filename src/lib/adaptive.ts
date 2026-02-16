/**
 * Adaptive difficulty engine.
 *
 * Tracks recent performance per exercise level and determines
 * when a child has "mastered" a level (ready for harder content).
 */

import type { ExerciseProgress } from '@/store/useGameStore';

const MASTERY_THRESHOLD = 0.85; // 85% correct
const MIN_ATTEMPTS = 15; // need at least 15 answers at a level

export type ExerciseType = 'woorden' | 'zinnen' | 'spellingregels' | 'flitslezen' | 'woorddelen';

/** Max statically available level per exercise type */
export const maxStaticLevel: Record<ExerciseType, number> = {
  woorden: 5,
  zinnen: 5,
  spellingregels: 3,
  flitslezen: 3,
  woorddelen: 3,
};

/**
 * Check if a level is "mastered" based on recent performance.
 */
export function isLevelMastered(progress: ExerciseProgress, level: number): boolean {
  const recent = progress.recentByLevel?.[level];
  if (!recent || recent.total < MIN_ATTEMPTS) return false;
  return recent.correct / recent.total >= MASTERY_THRESHOLD;
}

/**
 * Get the highest AI level that should be available.
 * Returns null if the max static level isn't mastered yet.
 */
export function getAvailableAILevel(
  progress: ExerciseProgress,
  exerciseType: ExerciseType
): number | null {
  const maxStatic = maxStaticLevel[exerciseType];

  if (!isLevelMastered(progress, maxStatic)) return null;

  // Find the highest AI level that's been mastered, then offer one above
  let highestMastered = maxStatic;
  for (let lvl = maxStatic + 1; lvl <= maxStatic + 10; lvl++) {
    if (isLevelMastered(progress, lvl)) {
      highestMastered = lvl;
    } else {
      break;
    }
  }

  return highestMastered + 1;
}

/**
 * Check whether AI exercises are available (API key configured).
 * This is a client-side check that hits our own API route.
 */
export async function checkAIAvailable(): Promise<boolean> {
  try {
    const res = await fetch('/api/generate', { method: 'HEAD' });
    return res.status !== 501; // 501 = no API key
  } catch {
    return false;
  }
}
