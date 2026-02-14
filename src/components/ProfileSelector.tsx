'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, type Profile, type AgeGroup } from '@/store/useGameStore';

const avatarOptions = ['🦉', '🐼', '🦊', '🐱', '🐶', '🦁', '🐸', '🦋', '🐰', '🐻', '🦄', '🐧', '🐯', '🐲', '🦖', '🐬'];

type Screen = 'choose' | 'create';

export default function ProfileSelector() {
  const { profiles, createProfile, selectProfile, deleteProfile } = useGameStore();
  const [screen, setScreen] = useState<Screen>(profiles.length > 0 ? 'choose' : 'create');
  const [nameInput, setNameInput] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🦉');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>('groep3-5');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameInput.trim();
    if (!name) return;
    if (profiles.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      alert('Er is al iemand met deze naam! Kies een andere naam.');
      return;
    }
    createProfile(name, selectedAvatar, selectedAgeGroup);
  };

  const handleSelect = (id: string) => selectProfile(id);

  const handleDelete = (id: string) => {
    deleteProfile(id);
    setConfirmDelete(null);
    if (profiles.length <= 1) setScreen('create');
  };

  const ageGroupLabel = (ag: AgeGroup) =>
    ag === 'groep3-5' ? 'Groep 3-5' : 'Groep 6-8';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <motion.div
          className="text-6xl mb-3"
          animate={{ rotate: [0, -8, 8, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
        >
          📖
        </motion.div>

        <h1 className="text-3xl font-bold mb-1 text-[#2d2a26]">
          <span className="text-[#6c63ff]">LeesmaatJE</span>
        </h1>

        <AnimatePresence mode="wait">
          {/* ─── Choose existing profile ─── */}
          {screen === 'choose' && (
            <motion.div
              key="choose"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 30, opacity: 0 }}
            >
              <p className="text-gray-500 mb-5 text-lg">Wie gaat er oefenen?</p>

              <div className="flex flex-col gap-3 mb-5 max-h-[320px] overflow-y-auto pr-1">
                {profiles.map((profile, index) => {
                  const data = useGameStore.getState()._savedProfiles[profile.id];
                  const level = data?.level || 1;
                  const stars = data?.stars || 0;

                  return (
                    <motion.div
                      key={profile.id}
                      className="relative"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <motion.button
                        onClick={() => handleSelect(profile.id)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#6c63ff]/5 to-[#6c63ff]/10 hover:from-[#6c63ff]/10 hover:to-[#6c63ff]/20 transition-all text-left shadow-sm hover:shadow-md"
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="w-14 h-14 bg-white rounded-xl shadow flex items-center justify-center text-3xl flex-shrink-0">
                          {profile.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-lg font-bold text-[#2d2a26] truncate">
                            {profile.name}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-bold">
                              {ageGroupLabel(profile.ageGroup)}
                            </span>
                            <span>Lv.{level}</span>
                            <span>{stars} st.</span>
                          </div>
                        </div>
                        <span className="text-2xl text-[#6c63ff]/50">→</span>
                      </motion.button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDelete(confirmDelete === profile.id ? null : profile.id);
                        }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 hover:bg-red-100 flex items-center justify-center text-sm text-gray-400 hover:text-red-500 transition-colors shadow-sm"
                        title="Verwijderen"
                      >
                        ✕
                      </button>

                      <AnimatePresence>
                        {confirmDelete === profile.id && (
                          <motion.div
                            className="mt-2 bg-red-50 rounded-xl p-3 flex items-center gap-2"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                          >
                            <span className="text-sm text-red-600 flex-1">
                              {profile.name} verwijderen? Alle voortgang gaat verloren!
                            </span>
                            <button onClick={() => handleDelete(profile.id)} className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg hover:bg-red-600">Ja</button>
                            <button onClick={() => setConfirmDelete(null)} className="bg-gray-200 text-gray-600 text-sm font-bold px-3 py-1 rounded-lg hover:bg-gray-300">Nee</button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              <motion.button
                onClick={() => { setScreen('create'); setNameInput(''); setSelectedAvatar('🦉'); }}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-[#6c63ff]/30 hover:border-[#6c63ff]/60 text-[#6c63ff] font-bold text-lg transition-all hover:bg-[#6c63ff]/5"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-2xl">+</span>
                <span>Nieuw profiel</span>
              </motion.button>
            </motion.div>
          )}

          {/* ─── Create new profile ─── */}
          {screen === 'create' && (
            <motion.div
              key="create"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
            >
              <p className="text-gray-500 mb-5 text-lg">Maak je profiel aan!</p>

              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                {/* Name */}
                <div>
                  <label className="text-sm font-bold text-gray-400 mb-1 block text-left">Jouw naam</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Typ je naam..."
                    className="w-full text-xl text-center px-6 py-4 rounded-2xl border-3 border-[#6c63ff]/30 focus:border-[#6c63ff] focus:outline-none transition-colors bg-[#fef9f0]"
                    autoFocus
                    maxLength={20}
                  />
                </div>

                {/* Age group */}
                <div>
                  <label className="text-sm font-bold text-gray-400 mb-2 block text-left">In welke groep zit je?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      type="button"
                      onClick={() => setSelectedAgeGroup('groep3-5')}
                      className={`p-3 rounded-2xl font-bold text-left transition-all ${
                        selectedAgeGroup === 'groep3-5'
                          ? 'bg-[#6c63ff] text-white shadow-lg ring-2 ring-[#6c63ff]'
                          : 'bg-gray-100 text-[#2d2a26] hover:bg-gray-200'
                      }`}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div className="text-2xl mb-1">🌈</div>
                      <div className="text-sm font-bold">Groep 3-5</div>
                      <div className={`text-xs ${selectedAgeGroup === 'groep3-5' ? 'text-white/70' : 'text-gray-400'}`}>6 - 9 jaar</div>
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setSelectedAgeGroup('groep6-8')}
                      className={`p-3 rounded-2xl font-bold text-left transition-all ${
                        selectedAgeGroup === 'groep6-8'
                          ? 'bg-[#1a1b2e] text-white shadow-lg ring-2 ring-[#7c6aff]'
                          : 'bg-gray-100 text-[#2d2a26] hover:bg-gray-200'
                      }`}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div className="text-2xl mb-1">🚀</div>
                      <div className="text-sm font-bold">Groep 6-8</div>
                      <div className={`text-xs ${selectedAgeGroup === 'groep6-8' ? 'text-white/70' : 'text-gray-400'}`}>9 - 12 jaar</div>
                    </motion.button>
                  </div>
                </div>

                {/* Avatar */}
                <div>
                  <label className="text-sm font-bold text-gray-400 mb-2 block text-left">Kies je avatar</label>
                  <div className="grid grid-cols-8 gap-2">
                    {avatarOptions.map((emoji) => (
                      <motion.button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedAvatar(emoji)}
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-xl transition-all ${
                          selectedAvatar === emoji
                            ? 'bg-[#6c63ff]/20 ring-2 ring-[#6c63ff] scale-110 shadow-md'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        whileTap={{ scale: 0.85 }}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                {nameInput.trim() && (
                  <motion.div
                    className="flex items-center justify-center gap-3 py-3 bg-[#6c63ff]/5 rounded-2xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span className="text-3xl">{selectedAvatar}</span>
                    <div>
                      <span className="text-xl font-bold text-[#2d2a26]">{nameInput.trim()}</span>
                      <span className="text-sm text-gray-400 ml-2">({ageGroupLabel(selectedAgeGroup)})</span>
                    </div>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  className="bg-gradient-to-r from-[#6c63ff] to-[#a06cd5] text-white text-xl font-bold py-4 rounded-2xl shadow-lg disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!nameInput.trim()}
                >
                  Laten we beginnen!
                </motion.button>

                {profiles.length > 0 && (
                  <motion.button
                    type="button"
                    onClick={() => setScreen('choose')}
                    className="text-gray-400 font-bold py-2 hover:text-gray-600 transition-colors"
                    whileTap={{ scale: 0.98 }}
                  >
                    Terug naar profielen
                  </motion.button>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
