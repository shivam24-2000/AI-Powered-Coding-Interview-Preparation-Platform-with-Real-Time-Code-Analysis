import React from 'react';
import { X, FileText, UserCheck, Code, AlertTriangle, ShieldCheck, Scale } from 'lucide-react';

interface TermsOfUseModalProps {
  onClose: () => void;
}

export const TermsOfUseModal: React.FC<TermsOfUseModalProps> = ({ onClose }) => {
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

        {/* 📄 Header */}
        <div style={{ padding: '40px 40px 20px', borderBottom: '1px solid var(--landing-border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <FileText size={24} color="var(--landing-accent)" />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }} className="text-gradient">Terms of Use</h2>
          </div>
          <p style={{ color: 'var(--landing-text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Please read these terms carefully before starting your NexCode AI simulation.
          </p>
        </div>

        {/* 📜 Content (Scrollable) */}
        <div style={{ padding: '20px 40px 40px', overflowY: 'auto', flex: 1 }} className="custom-scrollbar">
          
          <Section icon={<UserCheck size={18} />} title="1. Acceptance of Terms">
            By creating an account or using the NexCode AI platform, you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree, please do not access the service.
          </Section>

          <Section icon={<Code size={18} />} title="2. Intellectual Property">
            <b>Our Rights:</b> The platform, algorithms, and "Friday AI" logic are the exclusive property of NexCode AI.<br />
            <b>Your Rights:</b> You retain ownership of the code you write. You grant us a non-exclusive license to process your code to provide feedback and analysis.
          </Section>

          <Section icon={<AlertTriangle size={18} />} title="3. Prohibited Conduct">
            Users are strictly prohibited from:
            <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
              <li>Scraping problems or data from the platform.</li>
              <li>Attempting to bypass security or "jailbreak" AI feedback loops.</li>
              <li>Using the platform to distribute malicious software or scripts.</li>
            </ul>
          </Section>

          <Section icon={<ShieldCheck size={18} />} title="4. AI Disclaimer">
            AI feedback is generated for educational and training purposes only. NexCode AI does not guarantee specific employment outcomes or 100% accuracy in complexity analysis.
          </Section>

          <Section icon={<Scale size={18} />} title="5. Limitation of Liability">
            To the maximum extent permitted by law, NexCode AI shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the platform.
          </Section>

          <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(168, 85, 247, 0.05)', borderRadius: '16px', border: '1px solid rgba(168, 85, 247, 0.1)' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--landing-text-muted)', lineHeight: 1.6, textAlign: 'center' }}>
              Continued use of the platform constitutes your agreement to the latest version of these terms.
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
            Agree & Continue
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
