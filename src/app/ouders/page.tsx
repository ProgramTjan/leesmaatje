'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGameStore, type ProfileData, type Profile } from '@/store/useGameStore';
import { badges } from '@/data/badges';
import PinCode from '@/components/PinCode';

type ProgressKey =
  | 'lettersProgress'
  | 'lettergrepenProgress'
  | 'woordenProgress'
  | 'zinnenProgress'
  | 'flitslezenProgress'
  | 'spellingregelsProgress'
  | 'woorddelenProgress';

const exerciseLabels: Record<ProgressKey, { label: string; color: string }> = {
  lettersProgress: { label: 'Letters', color: '#6c63ff' },
  lettergrepenProgress: { label: 'Lettergrepen', color: '#ff6b9d' },
  woordenProgress: { label: 'Woorden', color: '#4ecdc4' },
  zinnenProgress: { label: 'Zinnen', color: '#ff8a5c' },
  flitslezenProgress: { label: 'Flitslezen', color: '#7c6aff' },
  spellingregelsProgress: { label: 'Spelling', color: '#a06cd5' },
  woorddelenProgress: { label: 'Woorddelen', color: '#34d399' },
};

const progressKeys: ProgressKey[] = [
  'lettersProgress',
  'lettergrepenProgress',
  'woordenProgress',
  'zinnenProgress',
  'flitslezenProgress',
  'spellingregelsProgress',
  'woorddelenProgress',
];

function ProfileCard({ profile, data, onClick }: { profile: Profile; data: ProfileData; onClick: () => void }) {
  const totalExercises = progressKeys.reduce((sum, key) => sum + data[key].total, 0);
  const totalCorrect = progressKeys.reduce((sum, key) => sum + data[key].correct, 0);
  const accuracy = totalExercises > 0 ? Math.round((totalCorrect / totalExercises) * 100) : 0;

  return (
    <motion.button
      onClick={onClick}
      className="w-full bg-white rounded-2xl shadow-lg p-5 text-left hover:shadow-xl transition-shadow"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">
          {profile.avatar}
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-lg">{profile.name}</h3>
          <p className="text-gray-400 text-sm">
            {profile.ageGroup === 'groep3-5' ? 'Groep 3-5' : 'Groep 6-8'}
          </p>
        </div>
        <div className="ml-auto text-right">
          <div className="text-sm font-bold text-[#6c63ff]">Level {data.level}</div>
          <div className="text-xs text-gray-400">{data.xp} XP</div>
        </div>
      </div>
      <div className="flex gap-4 text-sm text-gray-500">
        <span>{totalExercises} oefeningen</span>
        <span>{accuracy}% goed</span>
        <span>{data.stars} sterren</span>
      </div>
    </motion.button>
  );
}

function ProfileDetail({ profile, data, onBack }: { profile: Profile; data: ProfileData; onBack: () => void }) {
  const totalExercises = progressKeys.reduce((sum, key) => sum + data[key].total, 0);
  const totalCorrect = progressKeys.reduce((sum, key) => sum + data[key].correct, 0);
  const accuracy = totalExercises > 0 ? Math.round((totalCorrect / totalExercises) * 100) : 0;

  const maxExercises = Math.max(...progressKeys.map((key) => data[key].total), 1);

  const unlockedBadgeObjects = badges.filter((b) => data.unlockedBadges.includes(b.id));

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      {/* Header */}
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-4 text-sm font-medium">
        <span>←</span> Alle profielen
      </button>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl">
          {profile.avatar}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
          <p className="text-gray-400">
            {profile.ageGroup === 'groep3-5' ? 'Groep 3-5' : 'Groep 6-8'} &middot; Level {data.level}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Oefeningen', value: totalExercises, icon: '📝' },
          { label: 'Goed', value: `${accuracy}%`, icon: '✅' },
          { label: 'Streak', value: `${data.currentStreak} (best: ${data.bestStreak})`, icon: '🔥' },
          { label: 'Sterren', value: data.stars, icon: '⭐' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-3 shadow-sm text-center">
            <div className="text-xl mb-1">{stat.icon}</div>
            <div className="font-bold text-gray-800 text-sm">{stat.value}</div>
            <div className="text-xs text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Level & XP */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-bold text-gray-700">Level {data.level}</span>
          <span className="text-gray-400">{data.xp} / {data.xpToNextLevel} XP</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#6c63ff] to-[#a06cd5] rounded-full transition-all"
            style={{ width: `${(data.xp / data.xpToNextLevel) * 100}%` }}
          />
        </div>
      </div>

      {/* Bar chart per exercise */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <h3 className="font-bold text-gray-700 mb-4">Voortgang per oefening</h3>
        <div className="space-y-3">
          {progressKeys.map((key) => {
            const progress = data[key];
            const { label, color } = exerciseLabels[key];
            const pct = maxExercises > 0 ? (progress.total / maxExercises) * 100 : 0;
            const acc = progress.total > 0 ? Math.round((progress.correct / progress.total) * 100) : 0;

            return (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 font-medium">{label}</span>
                  <span className="text-gray-400 text-xs">
                    {progress.total}x &middot; {acc}% goed
                    {progress.lastPlayed && (
                      <> &middot; {new Date(progress.lastPlayed).toLocaleDateString('nl-NL')}</>
                    )}
                  </span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      {unlockedBadgeObjects.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <h3 className="font-bold text-gray-700 mb-3">
            Verdiende badges ({unlockedBadgeObjects.length}/{badges.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {unlockedBadgeObjects.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-1.5 bg-gray-50 rounded-full px-3 py-1.5 text-sm"
                title={badge.description}
              >
                <span>{badge.emoji}</span>
                <span className="text-gray-600 font-medium">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function OudersDashboard() {
  const router = useRouter();
  const { profiles, parentPin, setParentPin, getProfileData } = useGameStore();
  const [hydrated, setHydrated] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  useEffect(() => { setHydrated(true); }, []);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div className="text-4xl" animate={{ rotate: [0, -5, 5, -5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          📊
        </motion.div>
      </div>
    );
  }

  // Not authenticated yet
  if (!authenticated) {
    return (
      <PinCode
        mode={parentPin ? 'verify' : 'set'}
        correctPin={parentPin}
        onSuccess={(pin) => {
          if (!parentPin) setParentPin(pin);
          setAuthenticated(true);
        }}
        onCancel={() => router.push('/')}
      />
    );
  }

  const selectedProfile = selectedProfileId ? profiles.find((p) => p.id === selectedProfileId) : null;
  const selectedData = selectedProfileId ? getProfileData(selectedProfileId) : null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 max-w-2xl mx-auto pb-12">
      {/* Header */}
      <motion.header
        className="flex items-center justify-between mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ouder-dashboard</h1>
          <p className="text-gray-400 text-sm">Voortgang van alle profielen</p>
        </div>
        <motion.button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-white rounded-xl shadow-sm text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Terug
        </motion.button>
      </motion.header>

      {/* Content */}
      {selectedProfile && selectedData ? (
        <ProfileDetail
          profile={selectedProfile}
          data={selectedData}
          onBack={() => setSelectedProfileId(null)}
        />
      ) : (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {profiles.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">📭</div>
              <p>Er zijn nog geen profielen aangemaakt.</p>
            </div>
          ) : (
            profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                data={getProfileData(profile.id)}
                onClick={() => setSelectedProfileId(profile.id)}
              />
            ))
          )}
        </motion.div>
      )}
    </div>
  );
}
