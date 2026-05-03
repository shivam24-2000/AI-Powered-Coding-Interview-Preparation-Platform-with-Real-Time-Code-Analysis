import React from 'react';
import { X, Users, MessageCircle, Linkedin, Trophy, Share2, Globe, ArrowUpRight } from 'lucide-react';

interface CommunityModalProps {
  onClose: () => void;
}

export const CommunityModal: React.FC<CommunityModalProps> = ({ onClose }) => {
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

        {/* 🤝 Header */}
        <div style={{ padding: '40px 40px 20px', borderBottom: '1px solid var(--landing-border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Users size={24} color="#3B82F6" />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }} className="text-gradient">NexCode Community</h2>
          </div>
          <p style={{ color: 'var(--landing-text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Join 5,000+ engineers worldwide pushing the boundaries of technical interviewing.
          </p>
        </div>

        {/* 📜 Content */}
        <div style={{ padding: '40px', overflowY: 'auto', flex: 1 }} className="custom-scrollbar">
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* Primary Hubs */}
            <HubCard 
              icon={<MessageCircle size={24} color="#5865F2" />} 
              title="Discord Developer Hub" 
              desc="Real-time help, daily coding challenges, and system design study groups."
              action="Join Server"
              link="#"
            />
            <HubCard 
              icon={<Linkedin size={24} color="#0A66C2" />} 
              title="LinkedIn Network" 
              desc="Share your 'Friday AI' scorecards and connect with hiring managers at top tech firms."
              action="Follow Us"
              link="https://www.linkedin.com/in/shivam-singhal-538369191/"
            />
          </div>

          {/* Peer Mock Interviews */}
          <div style={{ marginTop: '30px', padding: '24px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '24px', border: '1px solid rgba(59, 130, 246, 0.1)', display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '16px' }}>
              <Users size={32} color="#3B82F6" />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 800, color: 'var(--landing-text-primary)' }}>Peer Mock Interviews</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--landing-text-muted)', lineHeight: 1.5 }}>
                Tired of solo practice? Use our <b>Peer Match</b> system to pair up with other users at your skill level for live mock trials.
              </p>
            </div>
            <button style={{ padding: '10px 20px', background: '#3B82F6', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}>Match Me</button>
          </div>

          {/* Social Proof / Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '30px' }}>
            <StatBox icon={<Trophy size={16} />} label="Total Solutions" value="1.2M+" />
            <StatBox icon={<Share2 size={16} />} label="Peer Mocks" value="45K+" />
            <StatBox icon={<Globe size={16} />} label="Global Rank" value="#124" />
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

const HubCard: React.FC<{ icon: React.ReactNode, title: string, desc: string, action: string, link: string }> = ({ icon, title, desc, action, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
    <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--landing-border)', borderRadius: '24px', height: '100%', transition: 'all 0.3s ease', cursor: 'pointer' }} className="glass-panel hover-glow">
      <div style={{ marginBottom: '16px' }}>{icon}</div>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--landing-text-primary)' }}>{title}</h4>
      <p style={{ margin: '0 0 20px 0', fontSize: '0.85rem', color: 'var(--landing-text-dim)', lineHeight: 1.5 }}>{desc}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3B82F6', fontSize: '0.85rem', fontWeight: 800 }}>
        {action} <ArrowUpRight size={14} />
      </div>
    </div>
  </a>
);

const StatBox: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--landing-border)', borderRadius: '20px', textAlign: 'center' }} className="glass-panel">
    <div style={{ color: 'var(--landing-accent)', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>{icon}</div>
    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--landing-text-primary)', marginBottom: '2px' }}>{value}</div>
    <div style={{ fontSize: '0.7rem', color: 'var(--landing-text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
  </div>
);
