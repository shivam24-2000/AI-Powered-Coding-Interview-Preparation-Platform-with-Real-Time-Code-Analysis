import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import {
  ArrowLeft, User, Lock, Sparkles, Check, Type, Hash, WrapText, LayoutList,
  Timer, Palette, Trash2, AlertTriangle, Settings, Monitor
} from 'lucide-react';
import { APP_THEMES, applyAppTheme } from '../themes';
import type { EditorSettings } from './SettingsModal';

interface SettingsPageProps {
  onBack: () => void;
  session: any;
  settings: EditorSettings;
  onSettingsChange: (s: EditorSettings) => void;
  onProfileUpdate: () => void;
}

const AVATAR_STYLES = [
  { id: 'bottts', label: 'Robot', icon: '🤖' },
  { id: 'pixel-art', label: 'Pixel', icon: '👾' },
  { id: 'avataaars', label: 'Human', icon: '🧑' },
  { id: 'big-smile', label: 'Smile', icon: '😁' }
];

type Tab = 'profile' | 'editor' | 'appearance' | 'account';

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onBack, session, settings, onSettingsChange, onProfileUpdate
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  // Profile state
  const [username, setUsername] = useState(session?.user?.user_metadata?.full_name || '');
  const [avatarStyle, setAvatarStyle] = useState('bottts');
  const [seed, setSeed] = useState(session?.user?.id || 'random');
  const [newPassword, setNewPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  // Account danger zone
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState('');

  const avatarUrl = `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${seed}&backgroundColor=030108,1a1a1a`;

  useEffect(() => {
    const currentUrl = session?.user?.user_metadata?.avatar_url;
    if (currentUrl && currentUrl.includes('dicebear.com')) {
      const match = currentUrl.match(/dicebear\.com\/7\.x\/([^/]+)\/svg\?seed=([^&]+)/);
      if (match) { setAvatarStyle(match[1]); setSeed(match[2]); }
    }
  }, [session]);

  const set = <K extends keyof EditorSettings>(key: K, val: EditorSettings[K]) =>
    onSettingsChange({ ...settings, [key]: val });

  const handleSaveProfile = async () => {
    if (!username.trim() && !newPassword) return;
    setIsSaving(true); setError('');
    try {
      const updates: any = { data: { full_name: username.trim(), avatar_url: avatarUrl } };
      if (newPassword) {
        if (newPassword.length < 6) throw new Error('Password must be at least 6 characters');
        updates.password = newPassword;
      }
      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error;
      setSaveSuccess(true);
      setNewPassword('');
      setTimeout(() => { onProfileUpdate(); setSaveSuccess(false); }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally { setIsSaving(false); }
  };

  const handleResetProgress = async () => {
    if (deleteText !== 'RESET') return;
    try {
      await supabase.from('submissions').delete().eq('user_id', session?.user?.id);
      setShowDeleteConfirm(false);
      setDeleteText('');
      alert('All submission data has been reset.');
    } catch { alert('Failed to reset data.'); }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User size={16} /> },
    { id: 'editor', label: 'Editor', icon: <Type size={16} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={16} /> },
    { id: 'account', label: 'Account', icon: <Settings size={16} /> },
  ];

  const cardStyle: React.CSSProperties = {
    background: 'var(--bg-panel-light)', border: '1px solid var(--border-color)',
    borderRadius: '16px', padding: '24px',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)',
    display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 12px 12px 38px', background: 'var(--bg-panel)',
    border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-main)',
    fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s',
  };

  return (
    <div style={{ padding: '24px', paddingBottom: '80px', maxWidth: '900px', margin: '0 auto', color: 'var(--text-main)', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={onBack} className="history-back-btn" style={{
          background: 'var(--bg-panel-light)', border: '1px solid var(--border-color)',
          color: 'var(--text-main)', cursor: 'pointer', padding: '10px', borderRadius: '12px',
          display: 'flex', alignItems: 'center', transition: 'all 0.2s',
        }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Settings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>Manage your profile, editor & appearance preferences.</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '28px', background: 'var(--bg-panel-light)', padding: '4px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              flex: 1, padding: '10px 16px', borderRadius: '10px', border: 'none',
              fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s',
              background: activeTab === t.id ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === t.id ? '#fff' : 'var(--text-muted)',
              boxShadow: activeTab === t.id ? '0 4px 12px rgba(100,80,160,0.25)' : 'none',
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ═══ PROFILE TAB ═══ */}
      {activeTab === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1rem', fontWeight: 700 }}>Your Avatar</h3>
            <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* Avatar Preview */}
              <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: 'var(--bg-panel)', border: '2px solid var(--accent-primary)', boxShadow: '0 0 20px rgba(140,120,180,0.2)' }}>
                  <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%' }} />
                </div>
                <div onClick={() => setSeed(Math.random().toString(36).substring(7))} style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--accent-primary)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', border: '2px solid var(--bg-panel-light)' }} title="Randomize">
                  <Sparkles size={13} />
                </div>
              </div>
              {/* Style Selector */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={labelStyle}>Avatar Style</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {AVATAR_STYLES.map(s => (
                    <button key={s.id} onClick={() => setAvatarStyle(s.id)} style={{
                      padding: '10px', background: avatarStyle === s.id ? 'var(--bg-panel)' : 'transparent',
                      border: `1px solid ${avatarStyle === s.id ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                      borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', transition: 'all 0.2s',
                    }}>
                      <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-main)', fontWeight: 500 }}>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1rem', fontWeight: 700 }}>Personal Info</h3>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Display Name</label>
              <div style={{ position: 'relative' }}>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} placeholder="Enter your name..." />
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Email</label>
              <div style={{ padding: '12px', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {session?.user?.email || 'Not available'}
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Update Password (Optional)</label>
              <div style={{ position: 'relative' }}>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={inputStyle} placeholder="Enter new password..." />
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
            {error && (
              <div style={{ padding: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#ef4444', fontSize: '0.8rem', marginBottom: '16px', textAlign: 'center' }}>{error}</div>
            )}
            <button onClick={handleSaveProfile} disabled={isSaving || saveSuccess} style={{
              padding: '12px 28px', borderRadius: '12px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
              border: 'none', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s',
              background: saveSuccess ? '#10B981' : 'var(--accent-primary)', color: '#fff',
              boxShadow: '0 4px 12px rgba(100,80,160,0.25)', opacity: isSaving ? 0.7 : 1,
            }}>
              {isSaving ? 'Saving...' : saveSuccess ? <><Check size={16} /> Saved!</> : 'Save Profile'}
            </button>
          </div>
        </div>
      )}

      {/* ═══ EDITOR TAB ═══ */}
      {activeTab === 'editor' && (
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1rem', fontWeight: 700 }}>Editor Preferences</h3>
          {([
            { icon: <Monitor size={16} />, label: 'Editor Theme', render: () => (
              <div style={{ display: 'flex', background: 'var(--bg-panel)', borderRadius: '8px', padding: '3px', gap: '2px' }}>
                {(['nexcode-dark', 'vs-light'] as const).map(t => (
                  <button key={t} onClick={() => set('theme', t)} style={{
                    padding: '6px 14px', borderRadius: '6px', border: 'none', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                    background: settings.theme === t ? 'var(--accent-primary)' : 'transparent',
                    color: settings.theme === t ? '#fff' : 'var(--text-muted)',
                  }}>
                    {t === 'nexcode-dark' ? '🌙 Dark' : '☀️ Light'}
                  </button>
                ))}
              </div>
            )},
            { icon: <Type size={16} />, label: 'Font Size', render: () => (
              <StepControl value={settings.fontSize} min={10} max={24} step={1} unit="px" onChange={v => set('fontSize', v)} />
            )},
            { icon: <Hash size={16} />, label: 'Tab Size', render: () => (
              <StepControl value={settings.tabSize} min={2} max={8} step={2} onChange={v => set('tabSize', v)} />
            )},
            { icon: <WrapText size={16} />, label: 'Word Wrap', render: () => (
              <Toggle checked={settings.wordWrap === 'on'} onChange={v => set('wordWrap', v ? 'on' : 'off')} />
            )},
            { icon: <LayoutList size={16} />, label: 'Line Numbers', render: () => (
              <Toggle checked={settings.lineNumbers === 'on'} onChange={v => set('lineNumbers', v ? 'on' : 'off')} />
            )},
            { icon: <Timer size={16} />, label: 'Interview Timer', render: () => (
              <Toggle checked={settings.showTimer} onChange={v => set('showTimer', v)} />
            )},
          ] as { icon: React.ReactNode; label: string; render: () => React.ReactNode }[]).map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {row.icon} {row.label}
              </div>
              {row.render()}
            </div>
          ))}
        </div>
      )}

      {/* ═══ APPEARANCE TAB ═══ */}
      {activeTab === 'appearance' && (
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 700 }}>App Theme</h3>
          <p style={{ margin: '0 0 20px 0', color: 'var(--text-muted)', fontSize: '0.82rem' }}>Choose the visual style for your entire workspace.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {APP_THEMES.map(t => (
              <button key={t.id} onClick={() => { set('appTheme', t.id); applyAppTheme(t.id); }} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
                background: settings.appTheme === t.id ? 'var(--bg-panel)' : 'transparent',
                border: `2px solid ${settings.appTheme === t.id ? t.colors.accentPrimary : 'var(--border-color)'}`,
                boxShadow: settings.appTheme === t.id ? `0 0 16px ${t.colors.accentPrimary}33` : 'none',
              }}>
                {/* Mini preview */}
                <div style={{ width: '100%', height: '56px', borderRadius: '8px', background: t.colors.bgDark, border: `1px solid ${t.colors.borderColor}`, overflow: 'hidden', display: 'flex', flexDirection: 'column', marginBottom: '8px' }}>
                  <div style={{ height: '14px', background: t.colors.bgPanelSolid, borderBottom: `1px solid ${t.colors.borderColor}`, display: 'flex', alignItems: 'center', padding: '0 6px', gap: '3px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: t.colors.accentPrimary }} />
                    <div style={{ width: '14px', height: '3px', borderRadius: '2px', background: t.colors.textMuted, opacity: 0.4 }} />
                  </div>
                  <div style={{ flex: 1, padding: '4px', display: 'flex', gap: '3px' }}>
                    <div style={{ width: '14px', background: t.colors.bgPanel, borderRadius: '2px', border: `1px solid ${t.colors.borderColor}` }} />
                    <div style={{ flex: 1, background: t.colors.bgPanelLight, borderRadius: '2px', padding: '3px', display: 'flex', flexDirection: 'column', gap: '2px', border: `1px solid ${t.colors.borderColor}` }}>
                      <div style={{ width: '40%', height: '2px', background: t.colors.accentSecondary, borderRadius: '1px' }} />
                      <div style={{ width: '65%', height: '2px', background: t.colors.textMuted, borderRadius: '1px', opacity: 0.3 }} />
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: settings.appTheme === t.id ? 700 : 500, color: settings.appTheme === t.id ? 'var(--text-main)' : 'var(--text-muted)' }}>
                  {t.name}
                </span>
                {settings.appTheme === t.id && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)', marginTop: '4px' }} />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ═══ ACCOUNT TAB ═══ */}
      {activeTab === 'account' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 700 }}>Account Info</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>User ID</label>
                <div style={{ padding: '10px', background: 'var(--bg-panel)', borderRadius: '10px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', wordBreak: 'break-all' }}>{session?.user?.id || '—'}</div>
              </div>
              <div>
                <label style={labelStyle}>Provider</label>
                <div style={{ padding: '10px', background: 'var(--bg-panel)', borderRadius: '10px', fontSize: '0.82rem', color: 'var(--text-main)', textTransform: 'capitalize' }}>{session?.user?.app_metadata?.provider || 'Email'}</div>
              </div>
              <div>
                <label style={labelStyle}>Created</label>
                <div style={{ padding: '10px', background: 'var(--bg-panel)', borderRadius: '10px', fontSize: '0.82rem', color: 'var(--text-main)' }}>{session?.user?.created_at ? new Date(session.user.created_at).toLocaleDateString() : '—'}</div>
              </div>
              <div>
                <label style={labelStyle}>Last Sign In</label>
                <div style={{ padding: '10px', background: 'var(--bg-panel)', borderRadius: '10px', fontSize: '0.82rem', color: 'var(--text-main)' }}>{session?.user?.last_sign_in_at ? new Date(session.user.last_sign_in_at).toLocaleDateString() : '—'}</div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div style={{ ...cardStyle, borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <AlertTriangle size={18} color="#ef4444" />
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#ef4444' }}>Danger Zone</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '16px' }}>
              Reset all your submission history and progress data. This action cannot be undone.
            </p>
            {!showDeleteConfirm ? (
              <button onClick={() => setShowDeleteConfirm(true)} style={{
                padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.3)',
                background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontWeight: 700, fontSize: '0.82rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s',
              }}>
                <Trash2 size={14} /> Reset All Progress
              </button>
            ) : (
              <div style={{ padding: '16px', background: 'rgba(239,68,68,0.05)', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.15)' }}>
                <p style={{ color: '#ef4444', fontSize: '0.82rem', fontWeight: 600, marginBottom: '12px' }}>
                  Type <strong>RESET</strong> to confirm:
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input value={deleteText} onChange={e => setDeleteText(e.target.value)} style={{ ...inputStyle, paddingLeft: '12px', borderColor: 'rgba(239,68,68,0.3)' }} placeholder="Type RESET..." />
                  <button onClick={handleResetProgress} disabled={deleteText !== 'RESET'} style={{
                    padding: '10px 20px', borderRadius: '10px', border: 'none',
                    background: deleteText === 'RESET' ? '#ef4444' : 'rgba(239,68,68,0.2)',
                    color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: deleteText === 'RESET' ? 'pointer' : 'not-allowed',
                  }}>Confirm</button>
                  <button onClick={() => { setShowDeleteConfirm(false); setDeleteText(''); }} style={{
                    padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--border-color)',
                    background: 'var(--bg-panel-light)', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
                  }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Reusable sub-components ── */

const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
  <div onClick={() => onChange(!checked)} style={{
    width: '42px', height: '24px', borderRadius: '99px', cursor: 'pointer',
    background: checked ? 'var(--accent-primary)' : 'var(--bg-panel)', position: 'relative', transition: 'background 0.2s', flexShrink: 0,
    border: `1px solid ${checked ? 'var(--accent-primary)' : 'var(--border-color)'}`,
  }}>
    <div style={{
      position: 'absolute', top: '3px', left: checked ? '21px' : '3px',
      width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
      transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
    }} />
  </div>
);

const StepControl: React.FC<{ value: number; min: number; max: number; step: number; unit?: string; onChange: (v: number) => void }> = ({
  value, min, max, step, unit = '', onChange
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <button onClick={() => onChange(Math.max(min, value - step))} style={{
      width: '28px', height: '28px', borderRadius: '8px', background: 'var(--bg-panel)', border: '1px solid var(--border-color)',
      color: 'var(--text-main)', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>−</button>
    <span style={{ fontSize: '0.88rem', color: 'var(--text-main)', minWidth: '40px', textAlign: 'center', fontFamily: 'monospace', fontWeight: 600 }}>
      {value}{unit}
    </span>
    <button onClick={() => onChange(Math.min(max, value + step))} style={{
      width: '28px', height: '28px', borderRadius: '8px', background: 'var(--bg-panel)', border: '1px solid var(--border-color)',
      color: 'var(--text-main)', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>+</button>
  </div>
);
