import React from 'react';
import { Play, Send, Settings, Loader, Activity } from 'lucide-react';

interface NavigationProps {
  onRunCode: () => void;
  onSubmit: () => void;
  onSettings: () => void;
  isAnalyzing: boolean;
  isRunning: boolean;
  cooldownRemaining?: number;
  timer?: string | null; // formatted mm:ss or null
  onMentor: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onRunCode,
  onSubmit,
  onSettings,
  isAnalyzing,
  isRunning,
  cooldownRemaining = 0,
  timer,
  onMentor,
}) => {
  const isBlocked = cooldownRemaining > 0;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="glass-panel" style={{ padding: '0', borderRadius: '10px', overflow: 'hidden', width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.15)' }}>
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="NexCode AI Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <span className="text-gradient" style={{ fontSize: '1.4rem' }}>NexCode AI</span>
      </div>

      <div className="navbar-actions">
        {timer !== undefined && timer !== null && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 14px',
            borderRadius: '99px',
            background: 'rgba(168, 85, 247, 0.1)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--accent-primary)',
            minWidth: '80px',
            justifyContent: 'center',
            letterSpacing: '0.05em',
            boxShadow: 'inset 0 0 10px rgba(168, 85, 247, 0.1)'
          }}>
            <span style={{ fontSize: '1rem', marginRight: '4px' }}>⏱</span> {timer}
          </div>
        )}

        <button
          className="btn btn-secondary"
          onClick={onMentor}
          style={{ 
            color: 'var(--accent-primary)', 
            borderColor: 'rgba(168, 85, 247, 0.2)',
            background: 'rgba(168, 85, 247, 0.05)',
            boxShadow: '0 0 15px rgba(168, 85, 247, 0.1)'
          }}
        >
          <Activity size={16} />
          <span>AI Mentor</span>
        </button>

        <button
          id="settings-btn"
          className="btn btn-secondary"
          onClick={onSettings}
        >
          <Settings size={16} />
          <span>Settings</span>
        </button>
        <button
          className="btn btn-secondary"
          onClick={onRunCode}
          disabled={isAnalyzing || isRunning || isBlocked}
          style={{ minWidth: '85px', opacity: isBlocked ? 0.6 : 1 }}
        >
          {isRunning ? (
            <Loader size={16} className="animate-spin" />
          ) : isBlocked ? (
             <Loader size={16} />
          ) : (
            <Play size={16} fill="currentColor" />
          )}
          <span>{isRunning ? 'Running...' : isBlocked ? `Run (${cooldownRemaining}s)` : 'Run'}</span>
        </button>
        <button
          className="btn btn-accent"
          onClick={onSubmit}
          disabled={isAnalyzing || isRunning || isBlocked}
          style={{ minWidth: '95px', opacity: isBlocked ? 0.6 : 1 }}
        >
          {isRunning ? (
            <Loader size={16} className="animate-spin" />
          ) : isBlocked ? (
            <Loader size={16} />
          ) : (
            <Send size={16} />
          )}
          <span>{isRunning ? 'Submitting...' : isBlocked ? `Wait (${cooldownRemaining}s)` : 'Submit'}</span>
        </button>
      </div>
    </nav>
  );
};
