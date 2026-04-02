import React from 'react';
import { X, Award, CheckCircle, AlertCircle, XCircle, Trophy, Target, MessageSquare, Zap } from 'lucide-react';
import type { InterviewEvaluation } from '../types';

interface InterviewScorecardModalProps {
  evaluation: InterviewEvaluation;
  onClose: () => void;
}

export const InterviewScorecardModal: React.FC<InterviewScorecardModalProps> = ({
  evaluation,
  onClose
}) => {
  const getStatusColor = () => {
    switch (evaluation.status) {
      case 'hired': return '#10B981';
      case 'waitlist': return '#F59E0B';
      case 'rejected': return '#EF4444';
      default: return '#A855F7';
    }
  };

  const getStatusIcon = () => {
    switch (evaluation.status) {
      case 'hired': return <CheckCircle size={24} color="#10B981" />;
      case 'waitlist': return <AlertCircle size={24} color="#F59E0B" />;
      case 'rejected': return <XCircle size={24} color="#EF4444" />;
      default: return <Award size={24} />;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(3, 0, 15, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '24px',
      animation: 'modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .score-bar {
          height: 8px;
          border-radius: 4px;
          background: rgba(255,255,255,0.05);
          overflow: hidden;
          margin-top: 8px;
        }
        .score-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>

      <div style={{
        background: 'rgba(18, 14, 28, 0.95)',
        border: `1px solid rgba(255,255,255,0.1)`,
        width: '100%',
        maxWidth: '700px',
        borderRadius: '24px',
        position: 'relative',
        boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 100px ${getStatusColor()}15`,
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '32px',
          background: `linear-gradient(135deg, ${getStatusColor()}10 0%, transparent 100%)`,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {getStatusIcon()}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>Interview Report</h2>
              <p style={{ margin: '4px 0 0 0', color: getStatusColor(), fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                Outcome: {evaluation.status}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '8px' }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '32px', maxHeight: '70vh', overflowY: 'auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <Trophy size={18} color="#A855F7" />
                <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Overall Score</span>
                <span style={{ marginLeft: 'auto', fontWeight: 800, color: '#fff', fontSize: '1.2rem' }}>{evaluation.score}/100</span>
              </div>
              <div className="score-bar">
                <div className="score-fill" style={{ width: `${evaluation.score}%`, background: 'linear-gradient(90deg, #A855F7, #3B82F6)' }} />
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <Target size={18} color="#10B981" />
                <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Decision</span>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
                {evaluation.status === 'hired' ? 'Strong Hire Recommendation' : evaluation.status === 'waitlist' ? 'Consider for Future Roles' : 'Does Not Meet Bar'}
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <MessageSquare size={18} className="text-gradient" /> Detailed Feedback
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 2fr', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Communication', value: evaluation.feedback.communication },
              { label: 'Problem Solving', value: evaluation.feedback.problemSolving },
              { label: 'Code Quality', value: evaluation.feedback.codeQuality },
              { label: 'Efficiency', value: evaluation.feedback.efficiency },
            ].map((item, idx) => (
              <React.Fragment key={idx}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: 600, paddingTop: '4px' }}>{item.label}</div>
                <div style={{ color: '#fff', fontSize: '0.85rem', lineHeight: 1.5, paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>{item.value}</div>
              </React.Fragment>
            ))}
          </div>

          <div style={{ marginTop: '32px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="#F59E0B" /> Next Steps & Recommendations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {evaluation.nextSteps.map((step, i) => (
                <div key={i} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                  • {step}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: '24px 32px', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center' }}>
          <button 
            onClick={onClose}
            className="btn btn-accent"
            style={{ width: '100%', maxWidth: '200px' }}
          >
            Review Code
          </button>
        </div>
      </div>
    </div>
  );
};
