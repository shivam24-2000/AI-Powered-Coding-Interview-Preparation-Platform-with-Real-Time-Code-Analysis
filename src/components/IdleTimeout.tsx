import React, { useState, useEffect, useRef } from 'react';
import { LogOut, Clock, ShieldAlert } from 'lucide-react';

interface IdleTimeoutProps {
  onLogout: () => void;
}

export const IdleTimeout: React.FC<IdleTimeoutProps> = ({ onLogout }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const IDLE_TIME = 9.5 * 60 * 1000; // 9.5 Minutes before warning triggers (to logout at exactly 10 minutes)
  const WARNING_TIME = 30; // 30 seconds countdown

  const lastActiveRef = useRef<number>(Date.now());
  const warningShownAtRef = useRef<number | null>(null);
  const onLogoutRef = useRef(onLogout);

  useEffect(() => {
    onLogoutRef.current = onLogout;
  }, [onLogout]);

  const resetTimer = () => {
    lastActiveRef.current = Date.now();
    warningShownAtRef.current = null;
    setShowWarning(false);
    setCountdown(WARNING_TIME);
  };

  useEffect(() => {
    // Event listeners capturing activity
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    const handleActivity = () => {
      resetTimer();
    };

    events.forEach(event => window.addEventListener(event, handleActivity));

    // Also check on visibilitychange (e.g. when tab is reactivated)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const now = Date.now();
        const elapsedSinceActive = now - lastActiveRef.current;
        if (elapsedSinceActive >= IDLE_TIME + (WARNING_TIME * 1000)) {
          // Exceeded total 10 minutes, log out immediately
          onLogoutRef.current();
        } else if (elapsedSinceActive >= IDLE_TIME) {
          // Within the warning window, show warning and set correct remaining countdown
          setShowWarning(true);
          if (!warningShownAtRef.current) {
            warningShownAtRef.current = lastActiveRef.current + IDLE_TIME;
          }
        }
      }
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const checkIdle = () => {
      const now = Date.now();
      const elapsedSinceActive = now - lastActiveRef.current;

      if (!showWarning) {
        if (elapsedSinceActive >= IDLE_TIME) {
          setShowWarning(true);
          warningShownAtRef.current = now;
        }
      } else {
        const baseTime = warningShownAtRef.current || (lastActiveRef.current + IDLE_TIME);
        const elapsedSinceWarning = now - baseTime;
        const remaining = Math.max(0, WARNING_TIME - Math.floor(elapsedSinceWarning / 1000));

        if (remaining <= 0) {
          onLogoutRef.current();
        } else {
          setCountdown(remaining);
        }
      }
    };

    // Run check every 1 second
    const interval = setInterval(checkIdle, 1000);
    return () => clearInterval(interval);
  }, [showWarning]);

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
