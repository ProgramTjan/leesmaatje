/**
 * Client-side helper to fetch AI-generated exercises.
 * Includes localStorage caching to minimize API calls.
 */

import type { ExerciseType } from './adaptive';

const CACHE_PREFIX = 'ai-cache';
const BATCH_SIZE = 10;
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CachedBatch {
  exercises: unknown[];
  createdAt: number;
  usedCount: number;
}

function getCacheKey(type: ExerciseType, level: number): string {
  return `${CACHE_PREFIX}-${type}-${level}`;
}

function getFromCache(type: ExerciseType, level: number): unknown[] | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(getCacheKey(type, level));
    if (!raw) return null;

    const batch: CachedBatch = JSON.parse(raw);

    // Check TTL
    if (Date.now() - batch.createdAt > CACHE_TTL_MS) {
      localStorage.removeItem(getCacheKey(type, level));
      return null;
    }

    // Return unused exercises
    if (batch.usedCount < batch.exercises.length) {
      return batch.exercises;
    }

    // All used up -- will need a fresh batch
    return null;
  } catch {
    return null;
  }
}

function saveToCache(type: ExerciseType, level: number, exercises: unknown[]): void {
  if (typeof window === 'undefined') return;

  try {
    const batch: CachedBatch = {
      exercises,
      createdAt: Date.now(),
      usedCount: 0,
    };
    localStorage.setItem(getCacheKey(type, level), JSON.stringify(batch));
  } catch {
    // localStorage full or unavailable
  }
}

function markUsed(type: ExerciseType, level: number, count: number): void {
  if (typeof window === 'undefined') return;

  try {
    const raw = localStorage.getItem(getCacheKey(type, level));
    if (!raw) return;
    const batch: CachedBatch = JSON.parse(raw);
    batch.usedCount = Math.min(batch.usedCount + count, batch.exercises.length);
    localStorage.setItem(getCacheKey(type, level), JSON.stringify(batch));
  } catch {
    // ignore
  }
}

/**
 * Fetch AI-generated exercises. Uses cache first, then API.
 * Returns exercises in the same format as the static data arrays.
 */
export async function fetchAIExercises(
  type: ExerciseType,
  level: number,
  count: number = 8
): Promise<unknown[]> {
  // Try cache first
  const cached = getFromCache(type, level);
  if (cached && cached.length >= count) {
    const slice = cached.slice(0, count);
    markUsed(type, level, count);
    return shuffleArray(slice);
  }

  // Fetch from API
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, level, count: BATCH_SIZE }),
  });

  if (!res.ok) {
    throw new Error(`AI generation failed: ${res.status}`);
  }

  const data = await res.json();
  const exercises = data.exercises as unknown[];

  // Cache the full batch
  saveToCache(type, level, exercises);
  markUsed(type, level, count);

  // Return requested amount
  return shuffleArray(exercises.slice(0, count));
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
