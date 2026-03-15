import React, { useState } from 'react';
import { BookOpen, PenTool, Tag, Lightbulb } from 'lucide-react';
import type { Problem } from '../types';
import { Whiteboard } from './Whiteboard';
import { ProblemModal } from './ProblemModal';
import { HintPanel } from './HintPanel';

interface ProblemDescriptionProps {
  problem: Problem;
  problems: Problem[];
  onProblemChange: (id: string) => void;
}

const difficultyColors: Record<Problem['difficulty'], string> = {
  Easy: 'badge-green',
  Medium: 'badge-yellow',
  Hard: 'badge-red',
};

export const ProblemDescription: React.FC<ProblemDescriptionProps> = ({
  problem,
  problems,
  onProblemChange,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'whiteboard'>('description');
  const [hintsOpen, setHintsOpen] = useState(false);

  const handleSelect = (id: string) => {
    onProblemChange(id);
    setPickerOpen(false);
    setActiveTab('description');
  };

  return (
    <div className="panel problem-panel glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* ── Header Bar ── */}
      <div className="panel-header" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', padding: '0 16px', height: '42px', alignItems: 'stretch' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', alignItems: 'stretch', gap: '4px' }}>
          <button
            onClick={() => setActiveTab('description')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: activeTab === 'description' ? '#ffffff' : 'var(--text-muted)',
              borderBottom: activeTab === 'description' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              padding: '0 16px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
              height: '100%', marginBottom: '-1px',
              textShadow: activeTab === 'description' ? '0 0 12px rgba(168, 85, 247, 0.5)' : 'none',
            }}
          >
            <BookOpen size={14} style={{ opacity: activeTab === 'description' ? 1 : 0.6 }} />
            <span>Description</span>
          </button>

          <button
            onClick={() => setActiveTab('whiteboard')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: activeTab === 'whiteboard' ? '#ffffff' : 'var(--text-muted)',
              borderBottom: activeTab === 'whiteboard' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              padding: '0 16px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
              height: '100%', marginBottom: '-1px',
              textShadow: activeTab === 'whiteboard' ? '0 0 12px rgba(168, 85, 247, 0.5)' : 'none',
            }}
          >
            <PenTool size={14} style={{ opacity: activeTab === 'whiteboard' ? 1 : 0.6 }} />
            <span>Whiteboard</span>
          </button>
        </div>

        {/* Problem picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            id="problem-picker-btn"
            onClick={() => setPickerOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '6px 14px',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            }}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.4)';
              e.currentTarget.style.background = 'rgba(168, 85, 247, 0.1)';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(168, 85, 247, 0.2)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
            }}
          >
            Switch Problem
          </button>
        </div>
      </div>

      <ProblemModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        problems={problems}
        currentProblemId={problem.id}
        onSelect={handleSelect}
      />

      {/* ── Content ── */}
      <div
        className="panel-content"
        style={{
          padding: activeTab === 'whiteboard' ? 0 : '16px',
          overflow: activeTab === 'whiteboard' ? 'hidden' : 'auto',
          position: 'relative',
        }}
      >
        {activeTab === 'whiteboard' ? (
          <Whiteboard key={problem.id} />
        ) : (
          <>
            {/* Title + difficulty */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h1 style={{ fontSize: '1.4rem', color: 'var(--text-main)', margin: 0 }}>
                {problem.title}
              </h1>
              <div className={`badge ${difficultyColors[problem.difficulty]}`} style={{ fontSize: '0.7rem', padding: '2px 10px' }}>
                {problem.difficulty}
              </div>
            </div>

            {/* Tags */}
            <div style={{ marginBottom: '16px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {problem.tags.map(tag => (
                <div key={tag} className="badge badge-purple" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', padding: '2px 8px', background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.15)' }}>
                  <Tag size={11} /> {tag}
                </div>
              ))}
            </div>

            <div className="prose animate-fade-in" dangerouslySetInnerHTML={{ __html: problem.description }} />

            {/* Examples */}
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '12px', color: 'var(--text-main)' }}>Examples</h3>
              {problem.examples.map((example, idx) => (
                <div key={idx} className="example-box animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <p><strong>Input:</strong> <code>{example.input}</code></p>
                  <p><strong>Output:</strong> <code>{example.output}</code></p>
                  {example.explanation && (
                    <p style={{ marginTop: '8px', color: 'var(--text-muted)' }}>
                      <strong>Explanation:</strong> {example.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '12px', color: 'var(--text-main)' }}>Constraints</h3>
              <ul style={{ listStylePosition: 'inside', color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                {problem.constraints.map((c, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}><code>{c}</code></li>
                ))}
              </ul>
            </div>



            {/* ✨ Hints Banner — eye-catching card below tags */}
            {problem.hints && problem.hints.length > 0 && (
              <div
                onClick={() => setHintsOpen(true)}
                className="animate-fade-in"
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setHintsOpen(true)}
                style={{
                  marginTop: '28px',
                  padding: '16px 20px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(251,191,36,0.08) 0%, rgba(251,146,60,0.05) 100%)',
                  border: '1px solid rgba(251,191,36,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 2px 20px rgba(251,191,36,0.07)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(251,191,36,0.14) 0%, rgba(251,146,60,0.09) 100%)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 30px rgba(251,191,36,0.16)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(251,191,36,0.38)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(251,191,36,0.08) 0%, rgba(251,146,60,0.05) 100%)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 20px rgba(251,191,36,0.07)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(251,191,36,0.2)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                {/* Left: icon + text */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '11px', flexShrink: 0,
                    background: 'rgba(251,191,36,0.15)',
                    border: '1px solid rgba(251,191,36,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 16px rgba(251,191,36,0.2)',
                    animation: 'pulseGlow 2.5s ease-in-out infinite',
                  }}>
                    <Lightbulb size={18} color="#fbbf24" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fbbf24', marginBottom: '3px' }}>
                      Stuck? Unlock progressive hints 💡
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {problem.hints.length} hints available — reveal one tier at a time
                    </div>
                  </div>
                </div>

                {/* Right: CTA pill */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '0.72rem', fontWeight: 700, color: '#fbbf24',
                  background: 'rgba(251,191,36,0.12)',
                  border: '1px solid rgba(251,191,36,0.25)',
                  borderRadius: '8px', padding: '6px 12px', whiteSpace: 'nowrap',
                  transition: 'background 0.2s',
                }}>
                  View Hints
                  <span style={{ fontSize: '0.85rem' }}>→</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Hint Panel Modal */}
      {hintsOpen && problem.hints && (
        <HintPanel
          hints={problem.hints}
          problemTitle={problem.title}
          onClose={() => setHintsOpen(false)}
        />
      )}
    </div>
  );
};
