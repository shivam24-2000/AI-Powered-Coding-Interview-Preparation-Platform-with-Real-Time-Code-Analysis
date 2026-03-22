import React, { useState, useEffect } from 'react';
import { X, User, Check, Camera, Sparkles } from 'lucide-react';
import { supabase } from '../supabase';

interface ProfileModalProps {
  onClose: () => void;
  session: any;
  onUpdate: () => void;
}

const AVATAR_STYLES = [
  { id: 'bottts', label: 'Robot', icon: '🤖' },
  { id: 'pixel-art', label: 'Pixel', icon: '👾' },
  { id: 'avataaars', label: 'Human', icon: '🧑' },
  { id: 'big-smile', label: 'Smile', icon: '😁' }
];

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose, session, onUpdate }) => {
  const [username, setUsername] = useState(session?.user?.user_metadata?.full_name || '');
  const [avatarStyle, setAvatarStyle] = useState('bottts');
  const [seed, setSeed] = useState(session?.user?.id || 'random');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const avatarUrl = `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${seed}&backgroundColor=030108,1a1a1a`;

  useEffect(() => {
     // If user already has an avatar URL from Dicebear, try parsing its style !!
     const currentUrl = session?.user?.user_metadata?.avatar_url;
     if (currentUrl && currentUrl.includes('dicebear.com')) {
        const match = currentUrl.match(/dicebear\.com\/7\.x\/([^/]+)\/svg\?seed=([^&]+)/);
        if (match) {
           setAvatarStyle(match[1]);
           setSeed(match[2]);
        }
     }
  }, [session]);

  const handleSave = async () => {
    if (!username.trim()) return;
    setIsSaving(true);
    
    // Update local Supabase Auth metadata !!
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: username.trim(),
        avatar_url: avatarUrl
      }
    });

    setIsSaving(false);
    if (!error) {
       setSuccess(true);
       setTimeout(() => {
          onUpdate();
          onClose();
       }, 1500);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(3, 0, 9, 0.75)', backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, animation: 'fadeIn 0.2s ease-out'
    }}>
       <style>{`
          @keyframes bounceIn {
             from { opacity: 0; transform: scale(0.9); }
             to { opacity: 1; transform: scale(1); }
          }
       `}</style>

       <div className="glass-panel" style={{
          width: '100%', maxWidth: '400px', padding: '28px',
          background: 'rgba(20, 16, 28, 0.85)', borderRadius: '24px',
          border: '1px solid rgba(168, 85, 247, 0.2)',
          boxShadow: '0 25px 50px -12px rgba(168, 85, 247, 0.25)',
          animation: 'bounceIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          position: 'relative'
       }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
             <X size={18} />
          </button>

          <h3 style={{ margin: '0 0 16px 0', color: '#fff', fontSize: '1.25rem', fontWeight: 800 }}>Edit Profile</h3>

          {/* Profile Picture Preview */}
          <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 24px auto' }}>
             <div style={{
                width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden',
                background: 'rgba(255,255,255,0.03)', border: '2px solid #A855F7',
                boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)', position: 'relative'
             }}>
                <img src={avatarUrl} alt="Avatar Preview" style={{ width: '100%', height: '100%' }} />
             </div>
             <div onClick={() => setSeed(Math.random().toString(36).substring(7))} style={{
                position: 'absolute', bottom: '0', right: '0',
                background: '#A855F7', width: '32px', height: '32px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                color: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', border: '2px solid rgba(20, 16, 28, 0.85)'
             }} title="Randomize Seed">
                <Sparkles size={14} />
             </div>
          </div>

          {/* Avatar Styles Selection */}
          <div style={{ marginBottom: '20px' }}>
             <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Avatar Style</label>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {AVATAR_STYLES.map(style => (
                   <button 
                      key={style.id}
                      onClick={() => setAvatarStyle(style.id)}
                      style={{
                         padding: '10px', background: avatarStyle === style.id ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.02)',
                         border: `1px solid ${avatarStyle === style.id ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.05)'}`,
                         borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                         transition: 'all 0.2s'
                      }}
                   >
                      <span style={{ fontSize: '1.2rem' }}>{style.icon}</span>
                      <span style={{ fontSize: '0.65rem', color: '#fff', fontWeight: 500 }}>{style.label}</span>
                   </button>
                ))}
             </div>
          </div>

          {/* Username Input */}
          <div style={{ marginBottom: '24px' }}>
             <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Username</label>
             <div style={{ position: 'relative' }}>
                <input 
                   type="text"
                   value={username}
                   onChange={e => setUsername(e.target.value)}
                   style={{
                      width: '100%', padding: '12px 12px 12px 36px', background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff',
                      fontSize: '0.9rem', outline: 'none', transition: 'all 0.2s'
                   }}
                   placeholder="Enter username..."
                />
                <User size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
             </div>
          </div>

          <button 
             onClick={handleSave}
             disabled={isSaving || success}
             className="btn btn-accent"
             style={{
                width: '100%', padding: '12px', borderRadius: '12px', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                background: success ? '#10B981' : undefined, borderColor: success ? '#10B981' : undefined
             }}
          >
             {isSaving ? 'Saving...' : success ? <><Check size={18} /> Saved!</> : 'Save Profile'}
          </button>

       </div>
    </div>
  );
};
