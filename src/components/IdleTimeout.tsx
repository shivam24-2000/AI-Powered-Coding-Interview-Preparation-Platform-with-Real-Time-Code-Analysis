import React, { useState, useEffect, useRef } from 'react';
import { LogOut, Clock, ShieldAlert } from 'lucide-react';

interface IdleTimeoutProps {
  onLogout: () => void;
}

export const IdleTimeout: React.FC<IdleTimeoutProps> = ({ onLogout }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const IDLE_TIME = 5 * 60 * 1000; // 5 Minutes before warning triggers !!
  const WARNING_TIME = 30; // 30 seconds countdown !!

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    
    // Resume standard state
    setShowWarning(false);
    setCountdown(WARNING_TIME);

    // Restart idle trigger
    timeoutRef.current = setTimeout(() => {
      setShowWarning(true);
    }, IDLE_TIME);
  };

  useEffect(() => {
    // Event listeners capturing activity
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer(); // Start initial timer

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  useEffect(() => {
    if (showWarning) {
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownRef.current) clearInterval(countdownRef.current);
            onLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, [showWarning, onLogout]);

  if (!showWarning) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(3, 0, 9, 0.82)', backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 3000, animation: 'fadeIn 0.2s ease-out'
    }}>
      <style>{`
        @keyframes pulseAlert {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
          70% { transform: scale(1.03); box-shadow: 0 0 10px 10px rgba(239, 68, 68, 0); }
          100% { transform: scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <div className="glass-panel" style={{
        width: '100%', maxWidth: '380px', padding: '28px',
        background: 'rgba(20, 16, 28, 0.85)', borderRadius: '20px',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        boxShadow: '0 25px 60px rgba(239, 68, 68, 0.15)',
        textAlign: 'center', animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        position: 'relative', overflow: 'hidden'
      }}>
         {/* Circular Glow backgound */}
         <div style={{ position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '100px', background: 'rgba(239, 68, 68, 0.15)', filter: 'blur(30px)', borderRadius: '100px' }}></div>

        <div style={{
          width: '52px', height: '52px', borderRadius: '16px',
          background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#EF4444', margin: '0 auto 16px auto',
          animation: 'pulseAlert 2s infinite'
        }}>
          <Clock size={24} />
        </div>

        <h3 style={{ margin: '0 0 6px 0', color: '#fff', fontSize: '1.25rem', fontWeight: 800 }}>Idle Timeout Warning</h3>
        <p style={{ margin: '0 0 20px 0', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: 1.5 }}>
          You have been inactive for quite some time. To protect your session, you will be logged out shortly.
        </p>

        <div style={{
          padding: '12px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)',
          borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          marginBottom: '24px'
        }}>
          <ShieldAlert size={16} color="#EF4444" />
          <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 700 }}>
            Session ends in: <span style={{ color: '#FCA5A5', fontFamily: 'monospace', fontSize: '1.1rem' }}>{countdown}s</span>
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={resetTimer}
            className="btn btn-accent"
            style={{ width: '100%', padding: '12px', borderRadius: '12px', fontWeight: 600, background: '#EF4444', borderColor: '#EF4444', color: '#fff' }}
          >
            I'm Still Here
          </button>
          
          <button 
            onClick={onLogout}
            style={{
              padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '11px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
              fontSize: '0.8rem', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
               transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut size={14} /> Log out now
          </button>
        </div>

      </div>
    </div>
  );
};
