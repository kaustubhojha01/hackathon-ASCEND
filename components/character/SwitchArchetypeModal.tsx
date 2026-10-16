'use client';

// ==============================================================================
// ASCEND - SWITCH ARCHETYPE MODAL
// Clean Apple Minimalist Theme Modal for Archetype Selection
// ==============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles, Shield, Zap } from 'lucide-react';
import { ARCHETYPE_LIST, ARCHETYPES } from '@/lib/progression/archetypes';
import { Archetype } from '@/types/rpg';
import { useGame } from '@/lib/context/game-context';
import { ArchetypeAvatar } from '@/components/character/ArchetypeAvatar';

interface SwitchArchetypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SwitchArchetypeModal({ isOpen, onClose }: SwitchArchetypeModalProps) {
  const { profile, updateUserProfile } = useGame();
  const [selected, setSelected] = useState<Archetype>(profile.archetype || 'Cyber Mage');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await updateUserProfile({ archetype: selected });
      onClose();
    } catch (err) {
      console.error('Failed to switch archetype:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl border border-[#E5E5EA] shadow-2xl max-w-2xl w-full p-6 sm:p-8 overflow-hidden relative"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1D1D1F] tracking-tight">Switch Hero Archetype</h2>
              <p className="text-xs text-[#86868B] mt-0.5">Change your hero class and unlock unique archetype perks</p>
            </div>
          </div>

          {/* Archetype List Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1 py-1">
            {ARCHETYPE_LIST.map((arch) => {
              const isCurrent = selected === arch.id;
              const isCurrentlyActive = profile.archetype === arch.id;

              return (
                <div
                  key={arch.id}
                  onClick={() => setSelected(arch.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isCurrent
                      ? 'border-[#7C3AED] bg-purple-50/50 shadow-xs ring-1 ring-[#7C3AED]'
                      : 'border-[#E5E5EA] bg-[#FAF9F5] hover:border-[#D1D1D6] hover:bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0">
                      <ArchetypeAvatar archetype={arch.id} size="md" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-mono text-sm font-bold text-[#1D1D1F] truncate">{arch.name}</h4>
                        {isCurrent && (
                          <span className="w-4 h-4 rounded-full bg-[#7C3AED] text-white flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-purple-600 font-semibold">{arch.role}</div>
                      <p className="text-[11px] text-[#6E6E73] mt-1.5 line-clamp-2">{arch.description}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#E5E5EA] flex items-center justify-between text-[10px] font-mono">
                    <span className="text-purple-700 font-semibold flex items-center gap-1">
                      <Zap className="w-3 h-3 text-[#7C3AED]" /> {arch.perk}
                    </span>
                    {isCurrentlyActive && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="mt-6 pt-4 border-t border-[#E5E5EA] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting || selected === profile.archetype}
              className="px-6 py-2.5 btn-primary-gradient text-white font-semibold text-xs rounded-xl shadow-sm hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
            >
              {isSubmitting ? 'Updating...' : selected === profile.archetype ? 'Already Selected' : 'Confirm Class Change'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
