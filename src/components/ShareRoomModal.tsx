import React from 'react';
import { Users, Copy, Check, X } from 'lucide-react';
import { useState } from 'react';

interface ShareRoomModalProps {
  roomCode: string;
  onClose: () => void;
}

export const ShareRoomModal: React.FC<ShareRoomModalProps> = ({ roomCode, onClose }) => {
  const [copied, setCopied] = useState(false);
  const link = `${window.location.origin}?room=${roomCode}&role=interviewer`;

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(3, 0, 9, 0.75)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, animation: 'fadeIn 0.2s ease-out'
    }}>
      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      <div className="glass-panel" style={{
        width: '100%', maxWidth: '420px', padding: '24px',
        borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.2)',
        background: 'rgba(20, 16, 28, 0.85)',
        boxShadow: '0 20px 50px rgba(16, 185, 129, 0.15)',
        animation: 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        position: 'relative', overflow: 'hidden'
      }}>
         {/* Grid background effect */}
         <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.05, background: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '16px 16px', pointerEvents: 'none' }}></div>

        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px', color: '#10B981',
            boxShadow: '0 8px 16px rgba(16, 185, 129, 0.1)'
          }}>
            <Users size={22} />
          </div>
          <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: 700 }}>Host Mock Interview</h3>
          <p style={{ margin: '4px 0 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Share this session link to synchronize code live!</p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Room Code</label>
          <div style={{
            padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '10px', fontSize: '1.4rem', fontWeight: 800, color: '#ffeb3b',
            textAlign: 'center', marginTop: '4px', letterSpacing: '0.1em',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
          }}>
            {roomCode}
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase' }}>Interviewer Invite Link</label>
          <div style={{
            display: 'flex', gap: '8px', marginTop: '4px',
            background: 'rgba(0,0,0,0.2)', padding: '8px 12px',
            border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px',
            alignItems: 'center'
          }}>
            <input 
              type="text" 
              readOnly 
              value={link} 
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', outline: 'none', textOverflow: 'ellipsis' }}
            />
            <button 
              onClick={handleCopy}
              style={{
                background: copied ? '#10B981' : 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: copied ? '#fff' : '#10B981',
                padding: '6px 10px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="btn btn-accent"
          style={{ width: '100%', marginTop: '24px', padding: '12px', borderRadius: '12px', fontWeight: 600 }}
        >
          Enter Workspace
        </button>

      </div>
    </div>
  );
};
