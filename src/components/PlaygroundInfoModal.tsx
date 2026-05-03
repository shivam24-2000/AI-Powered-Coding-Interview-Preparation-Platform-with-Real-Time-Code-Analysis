import React from 'react';
import { X, Play, Code, Cpu, Share2, Terminal, Layers } from 'lucide-react';

interface PlaygroundInfoModalProps {
  onClose: () => void;
}

export const PlaygroundInfoModal: React.FC<PlaygroundInfoModalProps> = ({ onClose }) => {
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
        maxWidth: '750px',
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

        {/* 🎮 Header */}
        <div style={{ padding: '40px 40px 20px', borderBottom: '1px solid var(--landing-border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Play size={24} color="var(--landing-success)" fill="var(--landing-success)" />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }} className="text-gradient">AI Coding Playground</h2>
          </div>
          <p style={{ color: 'var(--landing-text-muted)', fontSize: '0.9rem', margin: 0 }}>
            An unrestricted environment for rapid prototyping and algorithm testing.
          </p>
        </div>

        {/* 📜 Content */}
        <div style={{ padding: '40px', overflowY: 'auto', flex: 1 }} className="custom-scrollbar">

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>

            <Feature icon={<Code size={20} color="var(--landing-accent)" />} title="Zero-Config Runtime">
              Execute Python, JavaScript, and Java directly in your browser. No environment variables or local compilers required.
            </Feature>

            <Feature icon={<Cpu size={20} color="var(--landing-success)" />} title="Real-time Analysis">
              Get instant feedback on Big O complexity and memory efficiency while you draft your solutions.
            </Feature>

            <Feature icon={<Terminal size={20} color="#FBBF24" />} title="Full-Stack Console">
              A high-performance output window with error mapping, stack traces, and standard output streaming.
            </Feature>

            <Feature icon={<Share2 size={20} color="#3B82F6" />} title="Social Snippets">
              Save your playground states and generate unique shareable links to get feedback from peers or mentors.
            </Feature>

          </div>

          <div style={{ marginTop: '40px', padding: '24px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <Layers size={20} color="var(--landing-success)" />
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--landing-text-primary)' }}>Playground Lore</h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--landing-text-muted)', lineHeight: 1.6 }}>
              The Playground is designed as a "No-Fail Zone." There are no clocks, no scores, and no pressure. Use it to test raw logic before moving into the high-stakes **AI Interview Simulation**.
            </p>
          </div>

          <div style={{ marginTop: '30px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Tag label="Vim Modes" />
            <Tag label="Multi-Tab Support" />
            <Tag label="Custom Test Cases" />
            <Tag label="Code Persistence" />
          </div>

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

const Feature: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
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

const Tag: React.FC<{ label: string }> = ({ label }) => (
  <span style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--landing-border)', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--landing-text-dim)' }} className="glass-panel">
    {label}
  </span>
);
