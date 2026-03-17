import React, { useState } from 'react';
import { Play, Send, Settings, Loader, BrainCircuit, Keyboard, ArrowLeft, Award, LogOut, ChevronDown } from 'lucide-react';
import { supabase } from '../supabase';

interface NavigationProps {
  onRunCode: () => void;
  onSubmit: () => void;
  onSettings: () => void;
  onShortcuts: () => void;
  isAnalyzing: boolean;
  isRunning: boolean;
  isSubmitting?: boolean;
  cooldownRemaining?: number;
  timer?: string | null;
  onMentor: () => void;
  onBackToLanding?: () => void;
  session?: any;
  onHistory?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onRunCode,
  onSubmit,
  onSettings,
  onShortcuts,
  isAnalyzing,
  isRunning,
  isSubmitting = false,
  cooldownRemaining = 0,
  timer,
  onMentor,
  onBackToLanding,
  session,
  onHistory,
}) => {
  const isBlocked = cooldownRemaining > 0;
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (onBackToLanding) onBackToLanding();
  };

  return (
    <nav className="navbar" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', width: '100%', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {onBackToLanding && (
          <button onClick={onBackToLanding} className="hover-lift" style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.18)', color: '#D8B4FE', cursor: 'pointer', padding: '9px', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(168, 85, 247, 0.06)' }}>
            <ArrowLeft size={16} strokeWidth={2.5} />
          </button>
        )}
        <div className="navbar-brand" style={{ alignItems: 'flex-start', gap: '0', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={onBackToLanding}>
            <div className="glass-panel" style={{ padding: '0', borderRadius: '10px', overflow: 'hidden', width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <img src={`${import.meta.env.BASE_URL}logo.png`} alt="NexCode AI Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span className="text-gradient" style={{ fontSize: '1.4rem' }}>NexCode AI</span>
          </div>
          <span style={{ fontSize: '0.60rem', color: 'var(--text-muted)', opacity: 0.7, paddingLeft: '50px', fontWeight: 500, letterSpacing: '0.04em', marginTop: '-2px' }}>
            &copy; {new Date().getFullYear()} Shivam Singhal
          </span>
        </div>
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
          <BrainCircuit size={16} />
          <span>Jarvis</span>
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
          id="shortcuts-btn"
          className="btn btn-secondary"
          onClick={onShortcuts}
          title="Keyboard Shortcuts (?)"
          style={{ padding: '6px 10px', minWidth: 'unset' }}
        >
          <Keyboard size={16} />
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
          disabled={isAnalyzing || isSubmitting || isBlocked}
          style={{ minWidth: '95px', opacity: isBlocked ? 0.6 : 1 }}
        >
          {isSubmitting ? (
            <Loader size={16} className="animate-spin" />
          ) : isBlocked ? (
            <Loader size={16} />
          ) : (
            <Send size={16} />
          )}
          <span>{isSubmitting ? 'Submitting...' : isBlocked ? `Wait (${cooldownRemaining}s)` : 'Submit'}</span>
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        {session && (
          <div 
            style={{ position: 'relative', marginLeft: '6px' }} 
            onMouseEnter={() => setShowProfileMenu(true)} 
            onMouseLeave={() => setShowProfileMenu(false)}
          >
            <button style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              padding: '6px 12px', borderRadius: '14px', 
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              color: '#fff', cursor: 'pointer', transition: 'all 0.3s ease'
            }} className="hover-lift">
              <div style={{ 
                width: '26px', height: '26px', borderRadius: '50%', 
                background: 'linear-gradient(135deg, #A855F7 0%, #3B82F6 100%)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: '0.75rem', fontWeight: 700, color: '#fff',
                boxShadow: '0 0 12px rgba(168, 85, 247, 0.3)'
              }}>
                {(session?.user?.email?.[0] || 'U').toUpperCase()}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                {session?.user?.email?.split('@')[0] || 'User'}
              </span>
              <ChevronDown size={14} style={{ opacity: 0.6, transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>
            
            {showProfileMenu && (
              <div style={{ 
                position: 'absolute', top: '100%', right: 0, paddingTop: '8px', zIndex: 1000,
                animation: 'dropdownReveal 0.25s cubic-bezier(0.1, 0.9, 0.2, 1)',
                transformOrigin: 'top right',
                perspective: '1000px'
              }}>
                
                <div style={{
                  background: 'rgba(12, 12, 14, 0.94)', backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px',
                  padding: '6px', minWidth: '180px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: '4px'
                }}>
                  <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', marginBottom: '4px' }}>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Account</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session?.user?.email}</p>
                  </div>
                  
                  <button onClick={onHistory} style={{
                    background: 'transparent', border: 'none', color: '#fff', 
                    padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem',
                    textAlign: 'left'
                  }} className="hover-menu-item">
                    <Award size={15} color="#A855F7" /> Dashboard
                  </button>
                  <button onClick={handleLogout} style={{
                      background: 'transparent', border: 'none', color: '#EF4444', 
                      padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem',
                      textAlign: 'left'
                  }} className="hover-menu-item">
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
