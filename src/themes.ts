export interface AppTheme {
  id: string;
  name: string;
  colors: {
    bgDark: string;
    bgPanel: string;
    bgPanelSolid: string;
    bgPanelLight: string;
    borderColor: string;
    borderHighlight: string;
    textMain: string;
    textPrimary: string;
    textMuted: string;
    accentPrimary: string;
    accentSecondary: string;
    accentGradient: string;
  };
}

export const APP_THEMES: AppTheme[] = [
  {
    id: 'midnight-purple',
    name: 'Midnight Purple',
    colors: {
      bgDark: '#030014',
      bgPanel: 'rgba(10, 10, 20, 0.45)',
      bgPanelSolid: '#0a0a14',
      bgPanelLight: 'rgba(255, 255, 255, 0.03)',
      borderColor: 'rgba(255, 255, 255, 0.08)',
      borderHighlight: 'rgba(139, 92, 246, 0.3)',
      textMain: '#f8fafc',
      textPrimary: '#f8fafc',
      textMuted: '#94a3b8',
      accentPrimary: '#a855f7',
      accentSecondary: '#6366f1',
      accentGradient: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)'
    }
  },
  {
    id: 'emerald-matrix',
    name: 'Emerald Matrix',
    colors: {
      bgDark: '#01110a',
      bgPanel: 'rgba(2, 24, 15, 0.45)',
      bgPanelSolid: '#051f15',
      bgPanelLight: 'rgba(255, 255, 255, 0.03)',
      borderColor: 'rgba(16, 185, 129, 0.15)',
      borderHighlight: 'rgba(16, 185, 129, 0.4)',
      textMain: '#ecfdf5',
      textPrimary: '#ecfdf5',
      textMuted: '#6ee7b7',
      accentPrimary: '#10b981',
      accentSecondary: '#059669',
      accentGradient: 'linear-gradient(135deg, #34d399 0%, #059669 100%)'
    }
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    colors: {
      bgDark: '#030b17',
      bgPanel: 'rgba(7, 18, 36, 0.6)',
      bgPanelSolid: '#0a1629',
      bgPanelLight: 'rgba(255, 255, 255, 0.05)',
      borderColor: 'rgba(56, 189, 248, 0.15)',
      borderHighlight: 'rgba(56, 189, 248, 0.4)',
      textMain: '#f0f9ff',
      textPrimary: '#f0f9ff',
      textMuted: '#7dd3fc',
      accentPrimary: '#0ea5e9',
      accentSecondary: '#0284c7',
      accentGradient: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)'
    }
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    colors: {
      bgDark: '#1a0b0e',
      bgPanel: 'rgba(33, 13, 18, 0.5)',
      bgPanelSolid: '#2a1117',
      bgPanelLight: 'rgba(255, 255, 255, 0.03)',
      borderColor: 'rgba(244, 63, 94, 0.15)',
      borderHighlight: 'rgba(244, 63, 94, 0.3)',
      textMain: '#fff1f2',
      textPrimary: '#fff1f2',
      textMuted: '#fda4af',
      accentPrimary: '#f43f5e',
      accentSecondary: '#be123c',
      accentGradient: 'linear-gradient(135deg, #fb7185 0%, #be123c 100%)'
    }
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    colors: {
      bgDark: '#090812',
      bgPanel: 'rgba(15, 12, 28, 0.5)',
      bgPanelSolid: '#151125',
      bgPanelLight: 'rgba(255, 255, 255, 0.03)',
      borderColor: 'rgba(236, 72, 153, 0.2)',
      borderHighlight: 'rgba(234, 179, 8, 0.4)',
      textMain: '#fdf2f8',
      textPrimary: '#fdf2f8',
      textMuted: '#f472b6',
      accentPrimary: '#ec4899',
      accentSecondary: '#eab308',
      accentGradient: 'linear-gradient(135deg, #ec4899 0%, #eab308 100%)'
    }
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    colors: {
      bgDark: '#050505',
      bgPanel: 'rgba(15, 15, 15, 0.6)',
      bgPanelSolid: '#121212',
      bgPanelLight: 'rgba(255, 255, 255, 0.04)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderHighlight: 'rgba(255, 255, 255, 0.3)',
      textMain: '#ffffff',
      textPrimary: '#ffffff',
      textMuted: '#a3a3a3',
      accentPrimary: '#e5e5e5',
      accentSecondary: '#737373',
      accentGradient: 'linear-gradient(135deg, #ffffff 0%, #737373 100%)'
    }
  },
  {
    id: 'dracula',
    name: 'Dracula',
    colors: {
      bgDark: '#282a36',
      bgPanel: 'rgba(68, 71, 90, 0.5)',
      bgPanelSolid: '#44475a',
      bgPanelLight: 'rgba(255, 255, 255, 0.05)',
      borderColor: 'rgba(98, 114, 164, 0.4)',
      borderHighlight: 'rgba(189, 147, 249, 0.6)',
      textMain: '#f8f8f2',
      textPrimary: '#f8f8f2',
      textMuted: '#6272a4',
      accentPrimary: '#bd93f9',
      accentSecondary: '#ff79c6',
      accentGradient: 'linear-gradient(135deg, #bd93f9 0%, #ff79c6 100%)'
    }
  },
  {
    id: 'solar-flare',
    name: 'Solar Flare',
    colors: {
      bgDark: '#1a0d00',
      bgPanel: 'rgba(43, 20, 0, 0.5)',
      bgPanelSolid: '#2b1400',
      bgPanelLight: 'rgba(255, 255, 255, 0.04)',
      borderColor: 'rgba(249, 115, 22, 0.2)',
      borderHighlight: 'rgba(249, 115, 22, 0.5)',
      textMain: '#fff7ed',
      textPrimary: '#fff7ed',
      textMuted: '#fdba74',
      accentPrimary: '#f97316',
      accentSecondary: '#ea580c',
      accentGradient: 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)'
    }
  },
  {
    id: 'nord',
    name: 'Nord',
    colors: {
      bgDark: '#2e3440',
      bgPanel: 'rgba(59, 66, 82, 0.6)',
      bgPanelSolid: '#3b4252',
      bgPanelLight: 'rgba(255, 255, 255, 0.05)',
      borderColor: 'rgba(76, 86, 106, 0.6)',
      borderHighlight: 'rgba(136, 192, 208, 0.5)',
      textMain: '#eceff4',
      textPrimary: '#eceff4',
      textMuted: '#d8dee9',
      accentPrimary: '#88c0d0',
      accentSecondary: '#5e81ac',
      accentGradient: 'linear-gradient(135deg, #88c0d0 0%, #5e81ac 100%)'
    }
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    colors: {
      bgDark: '#000000',
      bgPanel: 'rgba(18, 18, 18, 0.8)',
      bgPanelSolid: '#121212',
      bgPanelLight: 'rgba(255, 255, 255, 0.03)',
      borderColor: 'rgba(51, 51, 51, 0.8)',
      borderHighlight: 'rgba(163, 163, 163, 0.4)',
      textMain: '#e5e5e5',
      textPrimary: '#e5e5e5',
      textMuted: '#737373',
      accentPrimary: '#a3a3a3',
      accentSecondary: '#525252',
      accentGradient: 'linear-gradient(135deg, #d4d4d4 0%, #737373 100%)'
    }
  },
  {
    id: 'gruvbox',
    name: 'Gruvbox',
    colors: {
      bgDark: '#282828',
      bgPanel: 'rgba(60, 56, 54, 0.6)',
      bgPanelSolid: '#3c3836',
      bgPanelLight: 'rgba(255, 255, 255, 0.03)',
      borderColor: 'rgba(102, 92, 84, 0.6)',
      borderHighlight: 'rgba(254, 128, 25, 0.5)',
      textMain: '#ebdbb2',
      textPrimary: '#ebdbb2',
      textMuted: '#a89984',
      accentPrimary: '#fe8019',
      accentSecondary: '#fabd2f',
      accentGradient: 'linear-gradient(135deg, #fe8019 0%, #fabd2f 100%)'
    }
  },
  {
    id: 'neon-tokyo',
    name: 'Neon Tokyo',
    colors: {
      bgDark: '#08001a',
      bgPanel: 'rgba(18, 0, 43, 0.6)',
      bgPanelSolid: '#12002b',
      bgPanelLight: 'rgba(255, 255, 255, 0.04)',
      borderColor: 'rgba(209, 0, 255, 0.25)',
      borderHighlight: 'rgba(0, 255, 255, 0.5)',
      textMain: '#f0f0f0',
      textPrimary: '#f0f0f0',
      textMuted: '#b66eff',
      accentPrimary: '#00ffff',
      accentSecondary: '#ff00ff',
      accentGradient: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)'
    }
  }
];

export const applyAppTheme = (themeId: string) => {
  const theme = APP_THEMES.find(t => t.id === themeId) || APP_THEMES[0];
  const root = document.documentElement;

  root.style.setProperty('--bg-dark', theme.colors.bgDark);
  root.style.setProperty('--bg-panel', theme.colors.bgPanel);
  root.style.setProperty('--bg-panel-solid', theme.colors.bgPanelSolid);
  root.style.setProperty('--bg-panel-light', theme.colors.bgPanelLight);
  root.style.setProperty('--border-color', theme.colors.borderColor);
  root.style.setProperty('--border-highlight', theme.colors.borderHighlight);
  root.style.setProperty('--text-main', theme.colors.textMain);
  root.style.setProperty('--text-primary', theme.colors.textPrimary);
  root.style.setProperty('--text-muted', theme.colors.textMuted);
  root.style.setProperty('--accent-primary', theme.colors.accentPrimary);
  root.style.setProperty('--accent-secondary', theme.colors.accentSecondary);
  root.style.setProperty('--accent-gradient', theme.colors.accentGradient);

  // Custom alpha glow mapping
  let hexCode = theme.colors.accentPrimary;
  if (hexCode.startsWith('#') && hexCode.length === 7) {
    root.style.setProperty('--glow-primary', hexCode + '33');
  }
};
