import React from 'react';
import { X, Scale, Globe, CheckCircle, FileCheck, ShieldCheck, HelpCircle } from 'lucide-react';

interface ComplianceModalProps {
  onClose: () => void;
}

export const ComplianceModal: React.FC<ComplianceModalProps> = ({ onClose }) => {
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
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--landing-text-dim)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
        >
          <X size={20} />
        </button>

        {/* 🏛️ Header */}
        <div style={{ padding: '40px 40px 20px', borderBottom: '1px solid var(--landing-border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Scale size={24} color="#3B82F6" />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }} className="text-gradient">Compliance Framework</h2>
          </div>
          <p style={{ color: 'var(--landing-text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Adhering to global standards to ensure ethical AI and data integrity.
          </p>
        </div>

        {/* 📜 Content (Scrollable) */}
        <div style={{ padding: '20px 40px 40px', overflowY: 'auto', flex: 1 }} className="custom-scrollbar">
          
          <Section icon={<Globe size={18} />} title="GDPR & CCPA Compliance">
            NexCode AI is fully committed to European and Californian data protection regulations. Users can request data portability, correction, or the "right to be forgotten" at any time.
          </Section>

          <Section icon={<FileCheck size={18} />} title="SOC2 Readiness">
            We are currently aligning our internal controls with SOC2 Type I standards. Our processes are designed to maintain the highest levels of security, availability, and processing integrity.
          </Section>

          <Section icon={<ShieldCheck size={18} />} title="Ethical AI Guidelines">
            Our behavioral analysis models are audited for bias to ensure that technical evaluations are based solely on logic, communication skills, and problem-solving efficiency, regardless of demographic background.
          </Section>

          <Section icon={<CheckCircle size={18} />} title="Data Processing Agreements">
            Enterprise clients can request a formal Data Processing Agreement (DPA) to ensure that their organization's specific compliance requirements are met.
          </Section>

          <div style={{ marginTop: '40px', padding: '24px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <HelpCircle size={24} color="#3B82F6" style={{ marginTop: '4px' }} />
            <div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', color: '#3B82F6', fontWeight: 800 }}>Audit Logs</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--landing-text-muted)', lineHeight: 1.5 }}>
                Professional and Enterprise accounts have access to full audit logs for all interview activities to maintain internal compliance tracking.
              </p>
            </div>
          </div>
        </div>

        {/* 🏁 Footer Action */}
        <div style={{ padding: '24px 40px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--landing-border-light)', textAlign: 'right' }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 30px',
              background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.2)'
            }}
          >
            Acknowledge Standards
          </button>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
  <div style={{ marginBottom: '32px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
      <div style={{ color: '#3B82F6' }}>{icon}</div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--landing-text-primary)' }}>{title}</h3>
    </div>
    <div style={{ color: 'var(--landing-text-muted)', fontSize: '0.95rem', lineHeight: 1.6, paddingLeft: '28px' }}>
      {children}
    </div>
  </div>
);
