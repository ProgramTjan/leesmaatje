/**
 * Badge/achievement system.
 *
 * Badges are unlocked based on progress milestones.
 * Thresholds are set so that badges take multiple sessions to earn,
 * keeping long-term motivation high.
 */

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: 'practice' | 'mastery' | 'streak' | 'collection' | 'special';
  requirement: BadgeRequirement;
}

export interface BadgeRequirement {
  type: 'total_exercises' | 'total_correct' | 'streak' | 'level' | 'stars' | 'all_modules' | 'perfect_round';
  value: number;
}

export const badges: Badge[] = [
  // ── Practice badges — total exercises completed ──
  {
    id: 'eerste_stap',
    name: 'Eerste Stap',
    description: 'Je eerste 10 oefeningen gedaan!',
    emoji: '👣',
    category: 'practice',
    requirement: { type: 'total_exercises', value: 10 },
  },
  {
    id: 'oefenaar',
    name: 'Oefenaar',
    description: '50 oefeningen gedaan!',
    emoji: '📝',
    category: 'practice',
    requirement: { type: 'total_exercises', value: 50 },
  },
  {
    id: 'doorzetter',
    name: 'Doorzetter',
    description: '200 oefeningen gedaan!',
    emoji: '💪',
    category: 'practice',
    requirement: { type: 'total_exercises', value: 200 },
  },
  {
    id: 'lees_kampioen',
    name: 'Leeskampioen',
    description: '500 oefeningen gedaan!',
    emoji: '🏅',
    category: 'practice',
    requirement: { type: 'total_exercises', value: 500 },
  },
  {
    id: 'super_lezer',
    name: 'Superlezer',
    description: '1000 oefeningen gedaan!',
    emoji: '🦸',
    category: 'practice',
    requirement: { type: 'total_exercises', value: 1000 },
  },

  // ── Mastery badges — correct answers ──
  {
    id: 'slim_begin',
    name: 'Slim Begin',
    description: '25 goede antwoorden!',
    emoji: '🧠',
    category: 'mastery',
    requirement: { type: 'total_correct', value: 25 },
  },
  {
    id: 'briljant',
    name: 'Briljant',
    description: '100 goede antwoorden!',
    emoji: '💎',
    category: 'mastery',
    requirement: { type: 'total_correct', value: 100 },
  },
  {
    id: 'genie',
    name: 'Genie',
    description: '500 goede antwoorden!',
    emoji: '🎓',
    category: 'mastery',
    requirement: { type: 'total_correct', value: 500 },
  },

  // ── Streak badges ──
  {
    id: 'op_dreef',
    name: 'Op Dreef',
    description: '10 goed op een rij!',
    emoji: '🔥',
    category: 'streak',
    requirement: { type: 'streak', value: 10 },
  },
  {
    id: 'ongelooflijk',
    name: 'Ongelooflijk',
    description: '25 goed op een rij!',
    emoji: '⚡',
    category: 'streak',
    requirement: { type: 'streak', value: 25 },
  },
  {
    id: 'onstopbaar',
    name: 'Onstopbaar',
    description: '50 goed op een rij!',
    emoji: '🚀',
    category: 'streak',
    requirement: { type: 'streak', value: 50 },
  },

  // ── Collection badges — stars ──
  {
    id: 'sterren_verzamelaar',
    name: 'Sterrenverzamelaar',
    description: '50 sterren verdiend!',
    emoji: '⭐',
    category: 'collection',
    requirement: { type: 'stars', value: 50 },
  },
  {
    id: 'sterren_held',
    name: 'Sterrenheld',
    description: '200 sterren verdiend!',
    emoji: '🌟',
    category: 'collection',
    requirement: { type: 'stars', value: 200 },
  },
  {
    id: 'sterren_koning',
    name: 'Sterrenkoning',
    description: '500 sterren verdiend!',
    emoji: '👑',
    category: 'collection',
    requirement: { type: 'stars', value: 500 },
  },

  // ── Level badges ──
  {
    id: 'niveau_3',
    name: 'Klimmend',
    description: 'Level 3 bereikt!',
    emoji: '🧗',
    category: 'special',
    requirement: { type: 'level', value: 3 },
  },
  {
    id: 'niveau_7',
    name: 'Bergbeklimmer',
    description: 'Level 7 bereikt!',
    emoji: '⛰️',
    category: 'special',
    requirement: { type: 'level', value: 7 },
  },
  {
    id: 'niveau_15',
    name: 'Op De Top',
    description: 'Level 15 bereikt!',
    emoji: '🏔️',
    category: 'special',
    requirement: { type: 'level', value: 15 },
  },

  // ── Special badges ──
  {
    id: 'perfecte_ronde',
    name: 'Perfecte Ronde',
    description: '3 perfecte rondes!',
    emoji: '🎯',
    category: 'special',
    requirement: { type: 'perfect_round', value: 3 },
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: '10 perfecte rondes!',
    emoji: '💯',
    category: 'special',
    requirement: { type: 'perfect_round', value: 10 },
  },
];

/**
 * Check which badges should be unlocked
 */
export function checkBadgeUnlocks(state: {
  totalExercises: number;
  totalCorrect: number;
  bestStreak: number;
  stars: number;
  level: number;
  perfectRounds: number;
  unlockedBadges: string[];
}): Badge[] {
  const newBadges: Badge[] = [];

  for (const badge of badges) {
    if (state.unlockedBadges.includes(badge.id)) continue;

    let unlocked = false;

    switch (badge.requirement.type) {
      case 'total_exercises':
        unlocked = state.totalExercises >= badge.requirement.value;
        break;
      case 'total_correct':
        unlocked = state.totalCorrect >= badge.requirement.value;
        break;
      case 'streak':
        unlocked = state.bestStreak >= badge.requirement.value;
        break;
      case 'stars':
        unlocked = state.stars >= badge.requirement.value;
        break;
      case 'level':
        unlocked = state.level >= badge.requirement.value;
        break;
      case 'perfect_round':
        unlocked = state.perfectRounds >= badge.requirement.value;
        break;
    }

    if (unlocked) {
      newBadges.push(badge);
    }
  }

  return newBadges;
}
