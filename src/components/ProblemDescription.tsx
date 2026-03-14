import React, { useState } from 'react';
import { BookOpen, PenTool, Tag } from 'lucide-react';
import type { Problem } from '../types';
import { Whiteboard } from './Whiteboard';
import { ProblemModal } from './ProblemModal';

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

  const handleSelect = (id: string) => {
    onProblemChange(id);
    setPickerOpen(false);
    setActiveTab('description');
  };

  return (
    <div className="panel problem-panel glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="panel-header" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', padding: '0 16px', height: '42px', alignItems: 'stretch' }}>
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
              textShadow: activeTab === 'description' ? '0 0 12px rgba(168, 85, 247, 0.5)' : 'none'
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
              textShadow: activeTab === 'whiteboard' ? '0 0 12px rgba(168, 85, 247, 0.5)' : 'none'
            }}
          >
            <PenTool size={14} style={{ opacity: activeTab === 'whiteboard' ? 1 : 0.6 }} />
            <span>Whiteboard</span>
          </button>
        </div>

        {/* Problem picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ position: 'relative' }}>
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
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
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
      </div>

      <ProblemModal 
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        problems={problems}
        currentProblemId={problem.id}
        onSelect={handleSelect}
      />

      <div className="panel-content" style={{ padding: activeTab === 'whiteboard' ? 0 : '16px', overflow: activeTab === 'whiteboard' ? 'hidden' : 'auto' }}>
        {activeTab === 'whiteboard' ? (
          <Whiteboard key={problem.id} />
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h1 style={{ fontSize: '1.4rem', color: 'var(--text-main)', margin: 0 }}>
                {problem.title}
              </h1>
              <div className={`badge ${difficultyColors[problem.difficulty]}`} style={{ fontSize: '0.7rem', padding: '2px 10px' }}>
                {problem.difficulty}
              </div>
            </div>

            <div className="prose animate-fade-in" dangerouslySetInnerHTML={{ __html: problem.description }} />

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

            <div style={{ marginTop: '24px' }}>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '12px', color: 'var(--text-main)' }}>Constraints</h3>
              <ul style={{ listStylePosition: 'inside', color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                {problem.constraints.map((c, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}><code>{c}</code></li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {problem.tags.map(tag => (
                <div key={tag} className="badge badge-purple" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag size={12} /> {tag}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
