import React from 'react';
import { X, Search, CheckCircle2 } from 'lucide-react';
import type { Problem } from '../types';

interface ProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  problems: Problem[];
  currentProblemId: string;
  onSelect: (id: string) => void;
}

const difficultyColors: Record<Problem['difficulty'], string> = {
  Easy: 'badge-green',
  Medium: 'badge-yellow',
  Hard: 'badge-red',
};

export const ProblemModal: React.FC<ProblemModalProps> = ({
  isOpen,
  onClose,
  problems,
  currentProblemId,
  onSelect,
}) => {
  const [search, setSearch] = React.useState('');

  if (!isOpen) return null;

  const filteredProblems = problems.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000,
      animation: 'fadeIn 0.2s ease',
      padding: '20px'
    }} onClick={onClose}>
      <div 
        style={{
          width: '100%',
          maxWidth: '550px',
          maxHeight: '80vh',
          background: '#1c1c21',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Select Problem
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Choose a challenge to start practicing.
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{
              padding: '8px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '16px 24px' }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}>
            <Search 
              size={18} 
              style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} 
            />
            <input 
              type="text"
              placeholder="Search by title or topic..."
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                background: 'rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
            />
          </div>
        </div>

        {/* List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 12px 20px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }} className="custom-scrollbar">
          {filteredProblems.length > 0 ? (
            filteredProblems.map(p => (
              <button
                key={p.id}
                onClick={() => onSelect(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 14px',
                  background: p.id === currentProblemId ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                  border: '1px solid transparent',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  gap: '16px',
                  borderColor: p.id === currentProblemId ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                }}
                onMouseOver={e => {
                  if (p.id !== currentProblemId) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  }
                }}
                onMouseOut={e => {
                  if (p.id !== currentProblemId) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ 
                      fontWeight: 600, 
                      color: p.id === currentProblemId ? 'var(--accent-primary)' : '#ffffff',
                      fontSize: '0.95rem'
                    }}>
                      {p.title}
                    </span>
                    {p.id === currentProblemId && (
                      <CheckCircle2 size={14} color="var(--accent-primary)" />
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {p.tags.map(tag => (
                      <span key={tag} style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>#{tag}</span>
                    ))}
                  </div>
                </div>
                <div className={`badge ${difficultyColors[p.difficulty]}`} style={{ fontSize: '0.7rem', padding: '2px 10px' }}>
                  {p.difficulty}
                </div>
              </button>
            ))
          ) : (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              No problems found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
