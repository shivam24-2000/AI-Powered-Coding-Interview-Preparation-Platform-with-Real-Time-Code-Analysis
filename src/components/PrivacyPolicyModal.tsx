import React from 'react';
import { X, Shield, Lock, Eye, Database, Globe, Scale, Brain } from 'lucide-react';

interface PrivacyPolicyModalProps {
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ onClose }) => {
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

        {/* 🛡️ Header */}
        <div style={{ padding: '40px 40px 20px', borderBottom: '1px solid var(--landing-border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Shield size={24} color="var(--landing-accent)" />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }} className="text-gradient">Privacy Policy</h2>
          </div>
          <p style={{ color: 'var(--landing-text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Last updated: May 2026. Your privacy is our priority at NexCode AI.
          </p>
        </div>

        {/* 📜 Content (Scrollable) */}
        <div style={{ padding: '20px 40px 40px', overflowY: 'auto', flex: 1 }} className="custom-scrollbar">
          
          <Section icon={<Database size={18} />} title="1. Data Collection">
            We collect information essential for your coding simulations, including:
            <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
              <li>Account credentials (via GitHub/Supabase Auth).</li>
              <li>Source code submitted during simulations.</li>
              <li>Behavioral metrics (keystroke dynamics, time per problem).</li>
            </ul>
          </Section>

          <Section icon={<Brain size={18} />} title="2. AI Processing">
            NexCode AI uses advanced language models to analyze your code and behavior. 
            Your data is processed via private API sessions and is <b>not used</b> to train public baseline models.
          </Section>

          <Section icon={<Lock size={18} />} title="3. Security">
            All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. 
            We conduct regular security audits to ensure your technical intellectual property remains yours.
          </Section>

          <Section icon={<Eye size={18} />} title="4. Transparency">
            We do not sell your personal data to third parties. Data is only shared with essential service 
            providers (Supabase, AI Infrastructure) required to run the platform.
          </Section>

          <Section icon={<Scale size={18} />} title="5. Your Rights">
            You have the right to request a full export of your data or permanent deletion of your account 
            and simulation history at any time through your dashboard settings.
          </Section>

          <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(168, 85, 247, 0.05)', borderRadius: '16px', border: '1px solid rgba(168, 85, 247, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--landing-accent)', marginBottom: '8px', fontWeight: 700 }}>
              <Globe size={18} />
              Questions?
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--landing-text-muted)', lineHeight: 1.6 }}>
              If you have any questions about this policy, please reach out to us at <a href="mailto:shivamsinghal24@gmail.com" style={{ color: 'var(--landing-accent)', textDecoration: 'none', fontWeight: 600 }}>shivamsinghal24@gmail.com</a>.
            </p>
          </div>
        </div>

        {/* 🏁 Footer Action */}
        <div style={{ padding: '24px 40px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--landing-border-light)', textAlign: 'right' }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 30px',
              background: 'linear-gradient(135deg, #7C3AED, #DB2777)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(124, 58, 237, 0.3)'
            }}
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
  <div style={{ marginBottom: '32px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
      <div style={{ color: 'var(--landing-accent)' }}>{icon}</div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--landing-text-primary)' }}>{title}</h3>
    </div>
    <div style={{ color: 'var(--landing-text-muted)', fontSize: '0.95rem', lineHeight: 1.6, paddingLeft: '28px' }}>
      {children}
    </div>
  </div>
);
