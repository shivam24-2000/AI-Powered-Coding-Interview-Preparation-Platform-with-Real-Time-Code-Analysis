import React from 'react';
import { X, Award, Target, Mic, Video, BarChart2, ShieldAlert, Timer, Play } from 'lucide-react';

interface AIMockExamsModalProps {
  onClose: () => void;
  onStart: () => void;
}

export const AIMockExamsModal: React.FC<AIMockExamsModalProps> = ({ onClose, onStart }) => {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--landing-glass-dark)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '800px',
        maxHeight: '85vh',
        background: 'var(--landing-card-bg)',
        border: '1px solid var(--landing-border)',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
        animation: 'viewScaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }} className="glass-panel">
        
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="modal-close-btn"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--landing-text-dim)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        {/* 🏆 Header */}
        <div style={{ padding: '40px 40px 20px', borderBottom: '1px solid var(--landing-border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Award size={24} color="#9b8abf" />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }} className="text-gradient">AI Mock Exams</h2>
          </div>
          <p style={{ color: 'var(--landing-text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Pro-grade interview simulations designed to bridge the gap between practice and placement.
          </p>
        </div>

        {/* 📜 Content */}
        <div style={{ padding: '40px', overflowY: 'auto', flex: 1 }} className="custom-scrollbar">
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            
            <ExamFeature icon={<Video size={20} color="#EF4444" />} title="Multimodal Analysis">
              Our engine evaluates non-verbal cues including eye contact, posture, and facial expressions during your technical pitch.
            </ExamFeature>

            <ExamFeature icon={<Mic size={20} color="#3B82F6" />} title="Voice Clarity Engine">
              Tracks speech patterns, filler-word usage, and your ability to explain complex logic under pressure.
            </ExamFeature>

            <ExamFeature icon={<Target size={20} color="#10B981" />} title="Adaptive Difficulty">
              Friday dynamically adjusts the complexity of the problem based on your performance in the first 15 minutes.
            </ExamFeature>

            <ExamFeature icon={<BarChart2 size={20} color="#9b8abf" />} title="Detailed Scorecard">
              Receive a granular breakdown of your Technical Skills, Behavioral Response, and overall Hireability.
            </ExamFeature>

          </div>

          <div style={{ marginTop: '40px', display: 'flex', gap: '20px', padding: '24px', background: 'rgba(140, 120, 180, 0.05)', borderRadius: '20px', border: '1px solid rgba(140, 120, 180, 0.1)' }}>
            <div style={{ padding: '12px', background: 'rgba(140, 120, 180, 0.1)', borderRadius: '14px', height: 'fit-content' }}>
              <ShieldAlert size={24} color="#9b8abf" />
            </div>
            <div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: 800, color: 'var(--landing-text-primary)' }}>Exam Protocol</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--landing-text-muted)', lineHeight: 1.6 }}>
                Once an exam starts, the interface enters **Focus Mode**. To ensure realism, the AI proctor will monitor background activity and strictly enforce the time limit.
              </p>
            </div>
          </div>

          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px' }}>
            <ExamMetric icon={<Timer size={16} />} label="Duration" value="45 - 60 Min" />
            <ExamMetric icon={<Award size={16} />} label="Certificates" value="Included" />
            <ExamMetric icon={<BarChart2 size={16} />} label="Difficulty" value="Dynamic" />
          </div>
        </div>

        {/* 🏁 Footer Action */}
        <div style={{ padding: '24px 40px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--landing-border-light)', textAlign: 'right', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--landing-text-dim)', fontWeight: 600 }}>Ready to prove your skills?</p>
          <button
            onClick={() => { onClose(); onStart(); }}
            style={{
              padding: '12px 30px',
              background: 'linear-gradient(135deg, #9b8abf, #a06080)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(140, 120, 180, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Play size={14} fill="#fff" /> Start Exam Simulation
          </button>
        </div>
        
        <style>{`
          .landing-light-mode .modal-close-btn {
            background: #f1f5f9 !important;
            border-color: #e2e8f0 !important;
            color: #64748b !important;
          }
          .landing-light-mode .modal-close-btn:hover {
            background: #e2e8f0 !important;
            color: #0f172a !important;
          }
        `}</style>
      </div>
    </div>
  );
};

const ExamFeature: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
  <div style={{ display: 'flex', gap: '16px' }}>
    <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--landing-border)', borderRadius: '12px', height: 'fit-content' }} className="glass-panel">
      {icon}
    </div>
    <div>
      <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', fontWeight: 800, color: 'var(--landing-text-primary)' }}>{title}</h4>
      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--landing-text-muted)', lineHeight: 1.5 }}>{children}</p>
    </div>
  </div>
);

const ExamMetric: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <div style={{ color: 'var(--landing-accent)' }}>{icon}</div>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: '0.65rem', color: 'var(--landing-text-dim)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ fontSize: '0.9rem', color: 'var(--landing-text-primary)', fontWeight: 700 }}>{value}</span>
    </div>
  </div>
);
