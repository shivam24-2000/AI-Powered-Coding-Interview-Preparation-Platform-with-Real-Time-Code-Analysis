import React, { useEffect, useRef } from 'react';
import {
  X, Type, LayoutList, WrapText, Hash, Timer, Sun, Moon,
} from 'lucide-react';

export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  wordWrap: 'on' | 'off';
  lineNumbers: 'on' | 'off';
  theme: 'nexcode-dark' | 'vs-light';
  showTimer: boolean;
}

export const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: 14,
  tabSize: 2,
  wordWrap: 'off',
  lineNumbers: 'on',
  theme: 'nexcode-dark',
  showTimer: false,
};

interface SettingsModalProps {
  settings: EditorSettings;
  onChange: (s: EditorSettings) => void;
  onClose: () => void;
}

const Row: React.FC<{ icon: React.ReactNode; label: string; children: React.ReactNode }> = ({
  icon, label, children,
}) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 0',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
      {icon}
      {label}
    </div>
    {children}
  </div>
);

const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void; id: string }> = ({
  checked, onChange, id,
}) => (
  <label htmlFor={id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}>
    <div
      id={id}
      onClick={() => onChange(!checked)}
      style={{
        width: '40px',
        height: '22px',
        borderRadius: '99px',
        background: checked ? 'var(--accent-primary)' : 'rgba(255,255,255,0.12)',
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute',
        top: '3px',
        left: checked ? '21px' : '3px',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        background: 'white',
        transition: 'left 0.2s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
      }} />
    </div>
  </label>
);

const StepButton: React.FC<{
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
}> = ({ value, min, max, step, unit = '', onChange }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <button
      onClick={() => onChange(Math.max(min, value - step))}
      style={{
        width: '26px', height: '26px', borderRadius: '6px',
        background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
        color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >−</button>
    <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', minWidth: '36px', textAlign: 'center', fontFamily: 'monospace' }}>
      {value}{unit}
    </span>
    <button
      onClick={() => onChange(Math.min(max, value + step))}
      style={{
        width: '26px', height: '26px', borderRadius: '6px',
        background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
        color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >+</button>
  </div>
);

export const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onChange, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const set = <K extends keyof EditorSettings>(key: K, val: EditorSettings[K]) =>
    onChange({ ...settings, [key]: val });

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.15s ease',
      }}
    >
      <div style={{
        width: '420px',
        background: '#1a1a1f',
        border: '1px solid rgba(139, 92, 246, 0.25)',
        borderRadius: '16px',
        boxShadow: '0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
        overflow: 'hidden',
        animation: 'slideUp 0.2s ease',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(139, 92, 246, 0.06)',
        }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>Settings</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Editor & session preferences</div>
          </div>
          <button
            id="settings-close-btn"
            onClick={onClose}
            style={{
              width: '30px', height: '30px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-muted)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#ef4444'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Settings Rows */}
        <div style={{ padding: '6px 22px 22px' }}>

          {/* Editor Theme */}
          <Row icon={settings.theme === 'nexcode-dark' ? <Moon size={15} /> : <Sun size={15} />} label="Editor Theme">
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '3px', gap: '2px' }}>
              {(['nexcode-dark', 'vs-light'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => set('theme', t)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    background: settings.theme === t ? 'rgba(139, 92, 246, 0.7)' : 'transparent',
                    color: settings.theme === t ? 'white' : 'var(--text-muted)',
                  }}
                >
                  {t === 'nexcode-dark' ? 'Dark' : 'Light'}
                </button>
              ))}
            </div>
          </Row>

          {/* Font Size */}
          <Row icon={<Type size={15} />} label="Font Size">
            <StepButton value={settings.fontSize} min={10} max={24} step={1} unit="px" onChange={v => set('fontSize', v)} />
          </Row>

          {/* Tab Size */}
          <Row icon={<Hash size={15} />} label="Tab Size">
            <StepButton value={settings.tabSize} min={2} max={8} step={2} onChange={v => set('tabSize', v)} />
          </Row>

          {/* Word Wrap */}
          <Row icon={<WrapText size={15} />} label="Word Wrap">
            <Toggle id="toggle-wordwrap" checked={settings.wordWrap === 'on'} onChange={v => set('wordWrap', v ? 'on' : 'off')} />
          </Row>

          {/* Line Numbers */}
          <Row icon={<LayoutList size={15} />} label="Line Numbers">
            <Toggle id="toggle-linenumbers" checked={settings.lineNumbers === 'on'} onChange={v => set('lineNumbers', v ? 'on' : 'off')} />
          </Row>

          {/* Interview Timer */}
          <Row icon={<Timer size={15} />} label="Interview Timer">
            <Toggle id="toggle-timer" checked={settings.showTimer} onChange={v => set('showTimer', v)} />
          </Row>

        </div>
      </div>
    </div>
  );
};
