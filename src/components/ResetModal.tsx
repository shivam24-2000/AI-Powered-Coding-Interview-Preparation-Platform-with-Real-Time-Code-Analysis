import React, { useEffect, useRef } from 'react';
import { AlertCircle, RotateCcw, X } from 'lucide-react';

interface ResetModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

export const ResetModal: React.FC<ResetModalProps> = ({ onConfirm, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className="animate-fade-in"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 0, 15, 0.4)', // More subtle backdrop
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '380px', // More compact
          background: 'rgba(15, 15, 25, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)', // More subtle border
          borderRadius: '16px',
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          padding: 0,
          position: 'relative'
        }}
      >
        <div style={{ padding: '24px' }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444',
              flexShrink: 0,
            }}>
              <AlertCircle size={22} />
            </div>
            
            <div style={{ flex: 1 }}>
              <h2 style={{ 
                fontSize: '1.1rem', 
                fontWeight: 600, 
                color: '#fff',
                margin: '0 0 4px 0',
                letterSpacing: '-0.01em'
              }}>Reset Code?</h2>
              
              <p style={{ 
                color: 'var(--text-muted)', 
                fontSize: '0.875rem',
                lineHeight: 1.5,
                margin: 0,
              }}>
                This will revert the editor to the initial template. Current changes will be lost.
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="btn btn-icon"
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              opacity: 0.5,
              padding: '4px'
            }}
          >
            <X size={16} />
          </button>

          {/* Actions */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            gap: '10px' 
          }}>
            <button 
              className="btn btn-secondary" 
              onClick={onClose} 
              style={{ 
                padding: '6px 14px',
                height: '36px',
                fontSize: '0.85rem'
              }}
            >
              Cancel
            </button>
            <button 
              className="btn" 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              style={{ 
                background: 'rgba(239, 68, 68, 0.15)', 
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                height: '36px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; }}
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
