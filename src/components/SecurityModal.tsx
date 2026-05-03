import React from 'react';
import { X, Shield, Lock, Cpu, Server, Key, CheckCircle } from 'lucide-react';

interface SecurityModalProps {
  onClose: () => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ onClose }) => {
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
            <Shield size={24} color="#10b981" />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }} className="text-gradient">Security at NexCode</h2>
          </div>
          <p style={{ color: 'var(--landing-text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Our multi-layered security architecture ensures your intellectual property is protected.
          </p>
        </div>

        {/* 📜 Content (Scrollable) */}
        <div style={{ padding: '20px 40px 40px', overflowY: 'auto', flex: 1 }} className="custom-scrollbar">
          
          <Section icon={<Lock size={18} />} title="Encryption Standards">
            We utilize <b>TLS 1.3</b> for data in transit and <b>AES-256</b> for data at rest. Your code snippets and behavioral patterns are never stored in plain text.
          </Section>

          <Section icon={<Cpu size={18} />} title="AI Sandbox Execution">
            All code simulations run in isolated, short-lived Docker containers. This ensures that user-submitted code cannot access our core infrastructure or other user data.
          </Section>

          <Section icon={<Key size={18} />} title="Identity Management">
            NexCode AI leverages **Supabase Auth** with built-in protection against brute-force attacks and session hijacking. We support MFA (Multi-Factor Authentication) for all professional accounts.
          </Section>

          <Section icon={<Server size={18} />} title="Infrastructure Security">
            Our platform is hosted on Tier 4 data centers with 99.99% availability. We use automated threat detection and web application firewalls (WAF) to mitigate DDoS and injection attacks.
          </Section>

          <div style={{ marginTop: '40px', padding: '24px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <CheckCircle size={32} color="#10b981" />
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#10b981', fontWeight: 800 }}>Certified Infrastructure</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--landing-text-muted)', lineHeight: 1.5 }}>
                Our underlying cloud providers are SOC2 Type II and ISO 27001 compliant.
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
              background: 'linear-gradient(135deg, #10b981, #3B82F6)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.2)'
            }}
          >
            Close Security Brief
          </button>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
  <div style={{ marginBottom: '32px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
      <div style={{ color: '#10b981' }}>{icon}</div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--landing-text-primary)' }}>{title}</h3>
    </div>
    <div style={{ color: 'var(--landing-text-muted)', fontSize: '0.95rem', lineHeight: 1.6, paddingLeft: '28px' }}>
      {children}
    </div>
  </div>
);
