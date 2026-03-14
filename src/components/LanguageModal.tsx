import React, { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import type { Language } from '../languages';

interface LanguageModalProps {
  currentLanguage: Language;
  languages: Language[];
  onSelect: (lang: Language) => void;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  currentLanguage,
  languages,
  onSelect,
  onClose,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="modal-overlay" 
      ref={overlayRef}
      onClick={(e) => {
        // Only close if clicking the actual overlay, not the content
        if (e.target === overlayRef.current) {
          onClose();
        }
      }}
      style={{ 
        zIndex: 10000, // Extremely high z-index to ensure it's on top
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)',
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div 
        className="modal-content glass-panel language-modal-content" 
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
      >
        <div className="language-grid custom-scrollbar">
          {languages.map(lang => (
            <button
              key={lang.id}
              onClick={() => {
                onSelect(lang);
                onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                background: 'transparent',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.1s',
                textAlign: 'left',
                color: currentLanguage.id === lang.id ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.85rem',
              }}
              onMouseOver={e => {
                if (currentLanguage.id !== lang.id) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                }
              }}
              onMouseOut={e => {
                if (currentLanguage.id !== lang.id) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
                }
              }}
            >
              <div style={{ width: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {currentLanguage.id === lang.id && <Check size={14} color="var(--accent-primary)" strokeWidth={3} />}
              </div>
              <span style={{ 
                fontWeight: currentLanguage.id === lang.id ? 600 : 400 
              }}>
                {lang.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
