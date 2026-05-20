import React from 'react';
import { X, GitBranch, Star, Zap, Bug, Sparkles, ChevronRight } from 'lucide-react';

interface ChangelogModalProps {
  onClose: () => void;
}

export const ChangelogModal: React.FC<ChangelogModalProps> = ({ onClose }) => {
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
        maxWidth: '700px',
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

        {/* 🚀 Header */}
        <div style={{ padding: '40px 40px 20px', borderBottom: '1px solid var(--landing-border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <GitBranch size={24} color="var(--landing-accent)" />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }} className="text-gradient">Changelog</h2>
          </div>
          <p style={{ color: 'var(--landing-text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Track our progress as we build the future of technical interviewing.
          </p>
        </div>

        {/* 📜 Content (Timeline) */}
        <div style={{ padding: '40px', overflowY: 'auto', flex: 1 }} className="custom-scrollbar">
          
          <VersionBlock version="v2.4.0" date="May 2026" isLatest>
            <LogItem icon={<Star size={14} color="#FBBF24" />} type="New" title="AI Video Interviewer">
              Integrated a seamless video overlay for mock interviews with "Hide/Reopen" and "End Interview" capabilities.
            </LogItem>
            <LogItem icon={<Zap size={14} color="#a78bce" />} type="Improved" title="Cyber-Organic UI">
              Complete landing page overhaul with high-fidelity glass-morphism, mouse trails, and interactive code sandboxes.
            </LogItem>
            <LogItem icon={<Sparkles size={14} color="#06B6D4" />} type="New" title="Gamified Dashboard">
              Launched 24-week activity heatmap and daily streak tracking for better habit formation.
            </LogItem>
            <LogItem icon={<Bug size={14} color="#EF4444" />} type="Fixed" title="Theme Consistency">
              Resolved contrast issues in light theme across all footer elements and resource modals.
            </LogItem>
          </VersionBlock>

          <VersionBlock version="v2.3.5" date="April 2026">
            <LogItem icon={<Star size={14} color="#FBBF24" />} type="New" title="Friday AI Behavioral Engine">
              Enhanced natural language feedback during interview sessions for more realistic mock trials.
            </LogItem>
            <LogItem icon={<GitBranch size={14} color="#3B82F6" />} type="Improved" title="Auth Flow">
              Optimized GitHub OAuth redirect performance and updated profile settings management.
            </LogItem>
          </VersionBlock>

          <VersionBlock version="v2.2.0" date="March 2026">
            <LogItem icon={<Zap size={14} color="#a78bce" />} type="Improved" title="Complexity Analyzer">
              Upgraded the real-time Big O calculation engine to support nested loop depth analysis.
            </LogItem>
            <LogItem icon={<Bug size={14} color="#EF4444" />} type="Fixed" title="Code Persistence">
              Fixed a race condition where sandbox code could occasionally fail to sync with Supabase.
            </LogItem>
          </VersionBlock>

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

const VersionBlock: React.FC<{ version: string, date: string, isLatest?: boolean, children: React.ReactNode }> = ({ version, date, isLatest, children }) => (
  <div style={{ position: 'relative', paddingLeft: '40px', marginBottom: '50px' }}>
    {/* Timeline Line */}
    <div style={{ position: 'absolute', left: '15px', top: '10px', bottom: '-50px', width: '2px', background: 'linear-gradient(to bottom, var(--landing-accent), transparent)', opacity: 0.3 }} />
    
    {/* Timeline Dot */}
    <div style={{ 
      position: 'absolute', 
      left: '7px', 
      top: '0', 
      width: '18px', 
      height: '18px', 
      borderRadius: '50%', 
      background: isLatest ? 'var(--landing-accent)' : 'rgba(255,255,255,0.1)', 
      border: '4px solid var(--landing-card-bg)',
      boxShadow: isLatest ? '0 0 15px var(--landing-accent)' : 'none',
      zIndex: 2
    }} />

    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--landing-text-primary)', margin: 0 }}>{version}</h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--landing-text-dim)', fontWeight: 600 }}>{date}</span>
        {isLatest && <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(100, 80, 160, 0.1)', color: 'var(--landing-accent)', borderRadius: '100px', fontWeight: 800 }}>LATEST</span>}
      </div>
    </div>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {children}
    </div>
  </div>
);

const LogItem: React.FC<{ icon: React.ReactNode, type: string, title: string, children: React.ReactNode }> = ({ icon, type, title, children }) => (
  <div style={{ display: 'flex', gap: '16px' }}>
    <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--landing-border)', borderRadius: '12px', height: 'fit-content' }}>
      {icon}
    </div>
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--landing-text-dim)', letterSpacing: '0.05em' }}>{type}</span>
        <ChevronRight size={10} color="var(--landing-text-dim)" />
        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--landing-text-primary)' }}>{title}</h4>
      </div>
      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--landing-text-muted)', lineHeight: 1.5 }}>{children}</p>
    </div>
  </div>
);
