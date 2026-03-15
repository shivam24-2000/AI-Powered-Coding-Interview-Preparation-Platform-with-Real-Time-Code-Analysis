import React, { useState } from 'react';
import { X, Lightbulb, Lock, ChevronRight, Eye } from 'lucide-react';
import type { ProblemHint } from '../types';

interface HintPanelProps {
  hints: ProblemHint[];
  problemTitle: string;
  onClose: () => void;
}

const TIER_CONFIG = {
  1: {
    label: 'Conceptual',
    icon: '💡',
    color: '#34d399',
    bg: 'rgba(52, 211, 153, 0.08)',
    border: 'rgba(52, 211, 153, 0.2)',
    glow: 'rgba(52, 211, 153, 0.15)',
    description: 'A nudge in the right direction',
  },
  2: {
    label: 'Approach',
    icon: '🗺',
    color: '#fbbf24',
    bg: 'rgba(251, 191, 36, 0.08)',
    border: 'rgba(251, 191, 36, 0.2)',
    glow: 'rgba(251, 191, 36, 0.15)',
    description: 'The algorithm to use',
  },
  3: {
    label: 'Pseudocode',
    icon: '📋',
    color: '#f87171',
    bg: 'rgba(248, 113, 113, 0.08)',
    border: 'rgba(248, 113, 113, 0.2)',
    glow: 'rgba(248, 113, 113, 0.15)',
    description: 'Step-by-step breakdown',
  },
} as const;

export const HintPanel: React.FC<HintPanelProps> = ({ hints, problemTitle, onClose }) => {
  const [unlockedTiers, setUnlockedTiers] = useState<Set<number>>(new Set());
  const [confirmingTier, setConfirmingTier] = useState<number | null>(null);

  const unlock = (tier: number) => {
    setUnlockedTiers(prev => new Set([...prev, tier]));
    setConfirmingTier(null);
  };

  const sortedHints = [...hints].sort((a, b) => a.tier - b.tier);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '520px',
          overflow: 'hidden',
          border: '1px solid rgba(168,85,247,0.2)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(168,85,247,0.08)',
          animation: 'slideUp 0.25s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(168,85,247,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(251, 191, 36, 0.12)',
              border: '1px solid rgba(251, 191, 36, 0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px',
              boxShadow: '0 4px 12px rgba(251,191,36,0.15)',
            }}>
              <Lightbulb size={18} color="#fbbf24" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                Hints
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                {problemTitle}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-icon" style={{ color: 'var(--text-muted)', padding: '6px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Warning notice */}
        <div style={{
          margin: '16px 20px 0',
          padding: '10px 14px',
          background: 'rgba(251,191,36,0.06)',
          border: '1px solid rgba(251,191,36,0.15)',
          borderRadius: '10px',
          fontSize: '0.75rem',
          color: '#fbbf24',
          display: 'flex', alignItems: 'flex-start', gap: '8px',
          lineHeight: 1.5,
        }}>
          <span style={{ fontSize: '14px', flexShrink: 0 }}>⚠️</span>
          <span>Unlock hints only when you're stuck. Each tier gives more detail. Try solving with fewer hints for maximum learning.</span>
        </div>

        {/* Hint Cards */}
        <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sortedHints.map((hint) => {
            const cfg = TIER_CONFIG[hint.tier];
            const isUnlocked = unlockedTiers.has(hint.tier);
            const isConfirming = confirmingTier === hint.tier;
            const prevTierLocked = hint.tier > 1 && !unlockedTiers.has(hint.tier - 1);

            return (
              <div
                key={hint.tier}
                style={{
                  borderRadius: '12px',
                  border: `1px solid ${isUnlocked ? cfg.border : 'var(--border-color)'}`,
                  background: isUnlocked ? cfg.bg : 'rgba(255,255,255,0.02)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  opacity: prevTierLocked ? 0.5 : 1,
                  boxShadow: isUnlocked ? `0 4px 20px ${cfg.glow}` : 'none',
                }}
              >
                {/* Tier Header Row */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '16px' }}>{cfg.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: isUnlocked ? cfg.color : 'var(--text-primary)' }}>
                        Hint {hint.tier} — {cfg.label}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                        {cfg.description}
                      </div>
                    </div>
                  </div>

                  {/* Lock / Unlock button */}
                  {!isUnlocked && !prevTierLocked && (
                    isConfirming ? (
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sure?</span>
                        <button
                          onClick={() => unlock(hint.tier)}
                          style={{
                            padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700,
                            background: cfg.color, color: '#000', border: 'none', cursor: 'pointer'
                          }}
                        >
                          Unlock
                        </button>
                        <button
                          onClick={() => setConfirmingTier(null)}
                          style={{
                            padding: '4px 8px', borderRadius: '6px', fontSize: '0.72rem',
                            background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmingTier(hint.tier)}
                        disabled={prevTierLocked}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          padding: '5px 12px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 600,
                          background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)',
                          border: '1px solid var(--border-color)', cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = cfg.border;
                          (e.currentTarget as HTMLElement).style.color = cfg.color;
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)';
                          (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                        }}
                      >
                        <Lock size={12} />
                        <span>Reveal</span>
                        <ChevronRight size={12} />
                      </button>
                    )
                  )}

                  {isUnlocked && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: cfg.color }}>
                      <Eye size={12} />
                      <span>Unlocked</span>
                    </div>
                  )}

                  {prevTierLocked && !isUnlocked && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', opacity: 0.5, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Lock size={12} />
                      <span>Locked</span>
                    </div>
                  )}
                </div>

                {/* Hint Content */}
                {isUnlocked && (
                  <div style={{
                    padding: '0 16px 14px',
                    borderTop: `1px solid ${cfg.border}`,
                    marginTop: '0',
                    paddingTop: '12px',
                    animation: 'fadeIn 0.3s ease',
                  }}>
                    <pre style={{
                      fontFamily: hint.tier === 3 ? '"Fira Code", monospace' : 'inherit',
                      fontSize: hint.tier === 3 ? '0.78rem' : '0.82rem',
                      lineHeight: 1.6,
                      color: 'var(--text-primary)',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      margin: 0,
                      padding: hint.tier === 3 ? '10px 12px' : '0',
                      background: hint.tier === 3 ? 'rgba(0,0,0,0.3)' : 'transparent',
                      borderRadius: hint.tier === 3 ? '8px' : '0',
                      border: hint.tier === 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    }}>
                      {hint.content}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}

          {hints.length === 0 && (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No hints available for this problem yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
