import React from 'react';
import { X, Trophy, Medal, Star, TrendingUp, Users, ShieldCheck, Zap } from 'lucide-react';

interface LeaderboardsInfoModalProps {
  onClose: () => void;
}

export const LeaderboardsInfoModal: React.FC<LeaderboardsInfoModalProps> = ({ onClose }) => {
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
            <Trophy size={24} color="#FBBF24" />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }} className="text-gradient">Global Rankings</h2>
          </div>
          <p style={{ color: 'var(--landing-text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Join the elite 1% and get scouted by top-tier technical recruiters.
          </p>
        </div>

        {/* 📜 Content */}
        <div style={{ padding: '40px', overflowY: 'auto', flex: 1 }} className="custom-scrollbar">
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            
            <RankFeature icon={<Medal size={20} color="#FBBF24" />} title="Tiered Progression">
              Climb from **Novice** to **Grandmaster**. Each tier unlocks unique profile badges and exclusive problem sets.
            </RankFeature>

            <RankFeature icon={<TrendingUp size={20} color="#3B82F6" />} title="Hiring Spotlight">
              Users in the top 100 on our global board are featured in a monthly report sent directly to partner FAANG recruiters.
            </RankFeature>

            <RankFeature icon={<Zap size={20} color="#a78bce" />} title="Weekly Sprints">
              Don't worry about being late to the game. Our weekly sprint boards reset every Sunday, giving everyone a fresh start.
            </RankFeature>

            <RankFeature icon={<Users size={20} color="#10B981" />} title="Skill-Based Rivalries">
              Follow peers and build private mini-leaderboards to track each other's progress and keep the motivation high.
            </RankFeature>

          </div>

          <div style={{ marginTop: '40px' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 800, color: 'var(--landing-text-primary)' }}>Achievement Tiers</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--landing-border)', borderRadius: '24px' }} className="glass-panel">
              <TierBadge label="Iron" color="#94A3B8" />
              <TierBadge label="Gold" color="#FBBF24" />
              <TierBadge label="Emerald" color="#10B981" />
              <TierBadge label="Diamond" color="#3B82F6" />
              <TierBadge label="NexLegend" color="#a78bce" />
            </div>
          </div>

          <div style={{ marginTop: '30px', padding: '24px', background: 'rgba(150, 118, 200, 0.05)', borderRadius: '20px', border: '1px solid rgba(150, 118, 200, 0.1)', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <ShieldCheck size={24} color="#a78bce" />
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--landing-text-muted)', lineHeight: 1.5 }}>
              Our <b>Anti-Cheat Engine</b> monitors keystroke dynamics and solution originality to ensure the board stays fair and prestigious.
            </p>
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

const RankFeature: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
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

const TierBadge: React.FC<{ label: string, color: string }> = ({ label, color }) => (
  <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `rgba(${parseInt(color.slice(1,3), 16)}, ${parseInt(color.slice(3,5), 16)}, ${parseInt(color.slice(5,7), 16)}, 0.1)`, border: `1px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Star size={18} color={color} fill={color} />
    </div>
    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--landing-text-dim)', textTransform: 'uppercase' }}>{label}</span>
  </div>
);
