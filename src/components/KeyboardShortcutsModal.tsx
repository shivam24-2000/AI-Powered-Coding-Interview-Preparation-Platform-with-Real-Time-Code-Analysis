import React, { useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Shortcut {
  keys: string[];
  description: string;
}

interface ShortcutGroup {
  title: string;
  icon: string;
  shortcuts: Shortcut[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: 'Code Execution',
    icon: '▶',
    shortcuts: [
      { keys: ['Ctrl', 'Enter'], description: 'Run code against test cases' },
      { keys: ['Ctrl', 'Shift', 'Enter'], description: 'Submit solution' },
      { keys: ['Ctrl', 'R'], description: 'Reset code to template' },
    ],
  },
  {
    title: 'Editor',
    icon: '✏',
    shortcuts: [
      { keys: ['Ctrl', '/'], description: 'Toggle line comment' },
      { keys: ['Ctrl', 'Z'], description: 'Undo' },
      { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo' },
      { keys: ['Alt', '↑ / ↓'], description: 'Move line up / down' },
      { keys: ['Ctrl', 'D'], description: 'Duplicate line' },
      { keys: ['Ctrl', 'Shift', 'K'], description: 'Delete line' },
      { keys: ['Tab'], description: 'Indent / accept autocomplete' },
    ],
  },
  {
    title: 'Navigation',
    icon: '🔭',
    shortcuts: [
      { keys: ['?'], description: 'Open this shortcuts panel' },
      { keys: ['Ctrl', 'K'], description: 'Open problem selector' },
      { keys: ['Escape'], description: 'Close any open modal' },
    ],
  },
  {
    title: 'AI & Friday',
    icon: '🤖',
    shortcuts: [
      { keys: ['Ctrl', 'J'], description: 'Toggle Friday panel' },
      { keys: ['Ctrl', 'Shift', 'A'], description: 'Trigger AI analysis' },
    ],
  },
];

const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '0.7rem',
    fontWeight: 700,
    fontFamily: '"Fira Code", monospace',
    letterSpacing: '0.02em',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderBottom: '2px solid rgba(255,255,255,0.08)',
    color: 'var(--text-primary)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
    minWidth: '24px',
    whiteSpace: 'nowrap',
  }}>
    {children}
  </span>
);

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
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
          maxWidth: '680px',
          maxHeight: '85vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid var(--border-highlight)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(168,85,247,0.1)',
          animation: 'slideUp 0.25s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color)',
          background: 'rgba(168, 85, 247, 0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(168, 85, 247, 0.12)',
              border: '1px solid rgba(168, 85, 247, 0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent-primary)',
              boxShadow: '0 4px 12px rgba(168,85,247,0.15)',
            }}>
              <Keyboard size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                Keyboard Shortcuts
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                Press <Kbd>?</Kbd> anywhere to toggle this panel
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-icon"
            style={{ color: 'var(--text-muted)', padding: '6px', borderRadius: '8px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Shortcut Groups */}
        <div className="custom-scrollbar" style={{ overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {SHORTCUT_GROUPS.map((group) => (
              <div
                key={group.title}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
              >
                {/* Group header */}
                <div style={{
                  padding: '10px 14px',
                  background: 'rgba(168,85,247,0.05)',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <span style={{ fontSize: '0.85rem' }}>{group.icon}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {group.title}
                  </span>
                </div>

                {/* Shortcut rows */}
                <div style={{ padding: '8px 0' }}>
                  {group.shortcuts.map((s, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '7px 14px',
                        gap: '12px',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', flexShrink: 1 }}>
                        {s.description}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                        {s.keys.map((key, ki) => (
                          <React.Fragment key={ki}>
                            <Kbd>{key}</Kbd>
                            {ki < s.keys.length - 1 && (
                              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', opacity: 0.5 }}>+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div style={{
            textAlign: 'center',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            padding: '4px',
            opacity: 0.6
          }}>
            On macOS, use <Kbd>⌘</Kbd> instead of <Kbd>Ctrl</Kbd> for most shortcuts.
          </div>
        </div>
      </div>
    </div>
  );
};
