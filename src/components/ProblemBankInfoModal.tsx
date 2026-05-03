import React from 'react';
import { X, Library, Filter, CheckCircle, Flame, Building2, LayoutGrid, Search } from 'lucide-react';

interface ProblemBankInfoModalProps {
  onClose: () => void;
}

export const ProblemBankInfoModal: React.FC<ProblemBankInfoModalProps> = ({ onClose }) => {
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

        {/* 📚 Header */}
        <div style={{ padding: '40px 40px 20px', borderBottom: '1px solid var(--landing-border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Library size={24} color="#FBBF24" />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }} className="text-gradient">Problem Bank</h2>
          </div>
          <p style={{ color: 'var(--landing-text-muted)', fontSize: '0.9rem', margin: 0 }}>
            A curated collection of 1,500+ high-frequency interview questions.
          </p>
        </div>

        {/* 📜 Content */}
        <div style={{ padding: '40px', overflowY: 'auto', flex: 1 }} className="custom-scrollbar">
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            
            <BankFeature icon={<Building2 size={20} color="#3B82F6" />} title="Company-Specific Tracks">
              Target your dream firm with curated lists for Google, Meta, Amazon, and Netflix, based on recent interview reports.
            </BankFeature>

            <BankFeature icon={<Filter size={20} color="#10B981" />} title="Advanced Filtering">
              Sort by data structure, algorithm type, or difficulty level. Find exactly what you need to study in seconds.
            </BankFeature>

            <BankFeature icon={<CheckCircle size={20} color="#A855F7" />} title="Solution Verified">
              Every problem comes with community-vetted solutions in 5+ languages, including O(n) complexity breakdowns.
            </BankFeature>

            <BankFeature icon={<Flame size={20} color="#EF4444" />} title="Daily Challenges">
              Keep your streak alive with our featured daily problem. Compete for global rank and bonus reputation points.
            </BankFeature>

          </div>

          <div style={{ marginTop: '40px' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 800, color: 'var(--landing-text-primary)' }}>Popular Categories</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <CategoryTag icon={<LayoutGrid size={14} />} label="Arrays" />
              <CategoryTag icon={<LayoutGrid size={14} />} label="Dynamic Pro" />
              <CategoryTag icon={<LayoutGrid size={14} />} label="Graph Theory" />
              <CategoryTag icon={<LayoutGrid size={14} />} label="System Design" />
            </div>
          </div>

          <div style={{ marginTop: '30px', padding: '24px', background: 'rgba(251, 191, 36, 0.05)', borderRadius: '20px', border: '1px solid rgba(251, 191, 36, 0.1)', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Search size={24} color="#FBBF24" />
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--landing-text-muted)', lineHeight: 1.5 }}>
              Can't find a specific problem? Our <b>Request Engine</b> allows users to vote on which problems should be added next to the bank.
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

const BankFeature: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
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

const CategoryTag: React.FC<{ icon: React.ReactNode, label: string }> = ({ icon, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--landing-border)', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--landing-text-dim)', fontWeight: 600 }} className="glass-panel">
    {icon} <span>{label}</span>
  </div>
);
