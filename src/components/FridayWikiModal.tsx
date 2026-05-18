import React from 'react';
import { X, Brain, Zap, MessageSquare, Cpu, Sparkles, Activity, History } from 'lucide-react';

interface FridayWikiModalProps {
  onClose: () => void;
}

export const FridayWikiModal: React.FC<FridayWikiModalProps> = ({ onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--landing-glass-dark)',
      backdropFilter: 'blur(15px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '850px',
        maxHeight: '90vh',
        background: 'rgba(10, 5, 20, 0.95)',
        border: '1px solid rgba(140, 120, 180, 0.2)',
        borderRadius: '32px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(100, 80, 160, 0.2), inset 0 0 40px rgba(140, 120, 180, 0.05)',
        animation: 'viewScaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }} className="friday-wiki-container">
        
        {/* ✨ Glowing Background Elements */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(100, 80, 160, 0.15) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />

        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="modal-close-btn"
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--landing-text-dim)',
            cursor: 'pointer',
            padding: '10px',
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

        {/* 🧠 Header Section */}
        <div style={{ padding: '50px 50px 30px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <div style={{ padding: '12px', background: 'rgba(140, 120, 180, 0.1)', border: '1px solid rgba(140, 120, 180, 0.2)', borderRadius: '16px' }}>
              <Brain size={32} className="glow-icon" color="#9b8abf" />
            </div>
            <div>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.04em', margin: 0, color: '#fff' }}>Friday AI <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}>Wiki</span></h2>
              <p style={{ color: 'rgba(140, 120, 180, 0.8)', fontSize: '0.9rem', margin: '4px 0 0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Behavioral Intelligence Core v4.2</p>
            </div>
          </div>
        </div>

        {/* 📜 Content (Scrollable) */}
        <div style={{ padding: '0 50px 50px', overflowY: 'auto', flex: 1, position: 'relative', zIndex: 1 }} className="custom-scrollbar">
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }}>
            
            {/* Left: Lore & Core */}
            <div>
              <WikiSection title="The Persona">
                Friday is more than a chatbot; she is a technical mentor designed to simulate the atmosphere of top-tier engineering interviews. Inspired by the concept of the perfect "right-hand" assistant, she balances rigorous technical scrutiny with proactive encouragement.
              </WikiSection>

              <WikiSection title="Cognitive Architecture">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <FeatureRow icon={<Activity size={18} />} title="Emotional IQ" desc="Detects candidate frustration or hesitation and adjusts hint frequency automatically." />
                  <FeatureRow icon={<History size={18} />} title="Persistent Memory" desc="Tracks your growth across sessions, remembering previous architectural choices you've made." />
                  <FeatureRow icon={<MessageSquare size={18} />} title="Natural Dialogue" desc="Understands technical slang, system design tradeoffs, and complex verbal explanations." />
                </div>
              </WikiSection>
            </div>

            {/* Right: Technical Specs & Facts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--landing-border)', borderRadius: '24px' }} className="glass-panel">
                <h4 style={{ margin: '0 0 16px 0', fontSize: '0.8rem', color: 'var(--landing-text-dim)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Quick Facts</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Fact label="Model" value="NexNeural Pro (Multi-LLM)" />
                  <Fact label="Response Latency" value="~420ms" />
                  <Fact label="Analysis Depth" value="L4 Complexity" />
                  <Fact label="Languages" value="24+ Dialects" />
                </div>
              </div>

              <div style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(100, 80, 160, 0.1), rgba(6, 182, 212, 0.1))', border: '1px solid rgba(140, 120, 180, 0.2)', borderRadius: '24px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--landing-text-primary)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="#9b8abf" /> Easter Eggs
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--landing-text-muted)', lineHeight: 1.6 }}>
                  Friday loves talking about sci-fi. Try asking her about <i>"The Turing Test"</i> or <i>"Moore's Law"</i> during a session for unique dialogue!
                </p>
              </div>
            </div>

          </div>

          {/* Deep Dive Section */}
          <div style={{ marginTop: '50px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--landing-text-primary)', marginBottom: '24px' }}>Evaluation Engine</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <MetricBox icon={<Cpu size={20} />} title="StatSync" desc="Synchronizes keystroke dynamics with problem state." />
              <MetricBox icon={<Zap size={20} />} title="OptiTrack" desc="Analyzes code for O(N) optimization opportunities." />
              <MetricBox icon={<History size={20} />} title="EcoPulse" desc="Measures verbal clarity and explanation depth." />
            </div>
          </div>

        </div>

        {/* 🎨 Theme Scoped Styles */}
        <style>{`
          .glow-icon {
            filter: drop-shadow(0 0 8px rgba(140, 120, 180, 0.6));
            animation: pulse-glow 3s infinite ease-in-out;
          }
          @keyframes pulse-glow {
            0%, 100% { filter: drop-shadow(0 0 8px rgba(140, 120, 180, 0.4)); }
            50% { filter: drop-shadow(0 0 15px rgba(140, 120, 180, 0.8)); }
          }
          .friday-wiki-container .modal-close-btn:hover {
            background: rgba(140, 120, 180, 0.2) !important;
            color: #fff !important;
          }
          .landing-light-mode .friday-wiki-container {
            background: #ffffff !important;
            border-color: #e2e8f0 !important;
            box-shadow: 0 40px 100px rgba(0,0,0,0.1) !important;
          }
          .landing-light-mode .friday-wiki-container h2 {
            color: #0f172a !important;
          }
          .landing-light-mode .modal-close-btn {
            background: #f1f5f9 !important;
            border-color: #e2e8f0 !important;
            color: #64748b !important;
          }
        `}</style>
      </div>
    </div>
  );
};

const WikiSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ marginBottom: '32px' }}>
    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--landing-text-primary)', marginBottom: '16px', letterSpacing: '-0.02em' }}>{title}</h3>
    <p style={{ margin: 0, fontSize: '1rem', color: 'var(--landing-text-muted)', lineHeight: 1.7 }}>{children}</p>
  </div>
);

const FeatureRow: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
    <div style={{ color: '#9b8abf', marginTop: '4px' }}>{icon}</div>
    <div>
      <h4 style={{ margin: '0 0 2px 0', fontSize: '1rem', color: 'var(--landing-text-primary)', fontWeight: 800 }}>{title}</h4>
      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--landing-text-muted)', lineHeight: 1.5 }}>{desc}</p>
    </div>
  </div>
);

const Fact: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span style={{ fontSize: '0.85rem', color: 'var(--landing-text-dim)' }}>{label}</span>
    <span style={{ fontSize: '0.85rem', color: 'var(--landing-text-primary)', fontWeight: 700 }}>{value}</span>
  </div>
);

const MetricBox: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--landing-border)', borderRadius: '20px' }} className="glass-panel">
    <div style={{ color: '#06B6D4', marginBottom: '12px' }}>{icon}</div>
    <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: 'var(--landing-text-primary)', fontWeight: 800 }}>{title}</h4>
    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--landing-text-muted)', lineHeight: 1.5 }}>{desc}</p>
  </div>
);
