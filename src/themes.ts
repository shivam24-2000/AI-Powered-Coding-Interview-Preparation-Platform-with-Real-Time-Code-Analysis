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
      bgDark: '#050511',
      bgPanel: 'rgba(12, 12, 24, 0.5)',
      bgPanelSolid: '#0c0c18',
      bgPanelLight: 'rgba(255, 255, 255, 0.025)',
      borderColor: 'rgba(255, 255, 255, 0.07)',
      borderHighlight: 'rgba(139, 92, 246, 0.25)',
      textMain: '#e8eaf0',
      textPrimary: '#e8eaf0',
      textMuted: '#8892a8',
      accentPrimary: '#a78bce',
      accentSecondary: '#7e82c9',
      accentGradient: 'linear-gradient(135deg, #a78bce 0%, #7e82c9 100%)'
    }
  },
  {
    id: 'light-mode',
    name: 'Light Mode',
    colors: {
      bgDark: '#f5f6f8',
      bgPanel: 'rgba(255, 255, 255, 0.8)',
      bgPanelSolid: '#ffffff',
      bgPanelLight: 'rgba(0, 0, 0, 0.025)',
      borderColor: 'rgba(0, 0, 0, 0.08)',
      borderHighlight: 'rgba(124, 100, 200, 0.3)',
      textMain: '#1a1f2e',
      textPrimary: '#1a1f2e',
      textMuted: '#6b7280',
      accentPrimary: '#7a62b0',
      accentSecondary: '#c85890',
      accentGradient: 'linear-gradient(135deg, #7a62b0 0%, #c85890 100%)'
    }
  },
  {
    id: 'emerald-matrix',
    name: 'Emerald Matrix',
    colors: {
      bgDark: '#040e09',
      bgPanel: 'rgba(6, 24, 16, 0.5)',
      bgPanelSolid: '#071e14',
      bgPanelLight: 'rgba(255, 255, 255, 0.025)',
      borderColor: 'rgba(16, 185, 129, 0.12)',
      borderHighlight: 'rgba(16, 185, 129, 0.3)',
      textMain: '#daf0e5',
      textPrimary: '#daf0e5',
      textMuted: '#7ec4a0',
      accentPrimary: '#52c08e',
      accentSecondary: '#3a9a70',
      accentGradient: 'linear-gradient(135deg, #5ecc9a 0%, #3a9a70 100%)'
    }
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    colors: {
      bgDark: '#040c16',
      bgPanel: 'rgba(8, 18, 34, 0.55)',
      bgPanelSolid: '#0c1828',
      bgPanelLight: 'rgba(255, 255, 255, 0.03)',
      borderColor: 'rgba(56, 189, 248, 0.12)',
      borderHighlight: 'rgba(56, 189, 248, 0.3)',
      textMain: '#dbedf8',
      textPrimary: '#dbedf8',
      textMuted: '#7bb8d8',
      accentPrimary: '#58a8d0',
      accentSecondary: '#3c8ab8',
      accentGradient: 'linear-gradient(135deg, #62b8dd 0%, #3c8ab8 100%)'
    }
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    colors: {
      bgDark: '#150c0e',
      bgPanel: 'rgba(30, 15, 18, 0.5)',
      bgPanelSolid: '#241218',
      bgPanelLight: 'rgba(255, 255, 255, 0.025)',
      borderColor: 'rgba(220, 80, 100, 0.1)',
      borderHighlight: 'rgba(220, 80, 100, 0.2)',
      textMain: '#f0e4e5',
      textPrimary: '#f0e4e5',
      textMuted: '#d09aa2',
      accentPrimary: '#d06878',
      accentSecondary: '#aa3a52',
      accentGradient: 'linear-gradient(135deg, #dc7d8e 0%, #aa3a52 100%)'
    }
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    colors: {
      bgDark: '#0a0914',
      bgPanel: 'rgba(16, 13, 28, 0.5)',
      bgPanelSolid: '#161224',
      bgPanelLight: 'rgba(255, 255, 255, 0.025)',
      borderColor: 'rgba(200, 80, 140, 0.12)',
      borderHighlight: 'rgba(200, 160, 40, 0.25)',
      textMain: '#f0e8f0',
      textPrimary: '#f0e8f0',
      textMuted: '#c880a0',
      accentPrimary: '#d06090',
      accentSecondary: '#d4a830',
      accentGradient: 'linear-gradient(135deg, #d06090 0%, #d4a830 100%)'
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
      bgPanelLight: 'rgba(255, 255, 255, 0.04)',
      borderColor: 'rgba(98, 114, 164, 0.3)',
      borderHighlight: 'rgba(170, 140, 220, 0.35)',
      textMain: '#e8e8e2',
      textPrimary: '#e8e8e2',
      textMuted: '#6272a4',
      accentPrimary: '#b090dd',
      accentSecondary: '#e078b0',
      accentGradient: 'linear-gradient(135deg, #b090dd 0%, #e078b0 100%)'
    }
  },
  {
    id: 'solar-flare',
    name: 'Solar Flare',
    colors: {
      bgDark: '#160e04',
      bgPanel: 'rgba(36, 22, 6, 0.5)',
      bgPanelSolid: '#241606',
      bgPanelLight: 'rgba(255, 255, 255, 0.03)',
      borderColor: 'rgba(210, 120, 40, 0.12)',
      borderHighlight: 'rgba(210, 120, 40, 0.3)',
      textMain: '#f0e8dd',
      textPrimary: '#f0e8dd',
      textMuted: '#c8a070',
      accentPrimary: '#d48a30',
      accentSecondary: '#cc6e28',
      accentGradient: 'linear-gradient(135deg, #dc9840 0%, #cc6e28 100%)'
    }
  },
  {
    id: 'nord',
    name: 'Nord',
    colors: {
      bgDark: '#2e3440',
      bgPanel: 'rgba(59, 66, 82, 0.55)',
      bgPanelSolid: '#3b4252',
      bgPanelLight: 'rgba(255, 255, 255, 0.04)',
      borderColor: 'rgba(76, 86, 106, 0.45)',
      borderHighlight: 'rgba(136, 192, 208, 0.3)',
      textMain: '#d8dee9',
      textPrimary: '#d8dee9',
      textMuted: '#b0b8c8',
      accentPrimary: '#82b8c8',
      accentSecondary: '#5a88a6',
      accentGradient: 'linear-gradient(135deg, #82b8c8 0%, #5a88a6 100%)'
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
      bgPanel: 'rgba(60, 56, 54, 0.55)',
      bgPanelSolid: '#3c3836',
      bgPanelLight: 'rgba(255, 255, 255, 0.025)',
      borderColor: 'rgba(102, 92, 84, 0.45)',
      borderHighlight: 'rgba(210, 120, 40, 0.3)',
      textMain: '#ddd0a0',
      textPrimary: '#ddd0a0',
      textMuted: '#a89984',
      accentPrimary: '#d88030',
      accentSecondary: '#dcb038',
      accentGradient: 'linear-gradient(135deg, #d88030 0%, #dcb038 100%)'
    }
  },
  {
    id: 'neon-tokyo',
    name: 'Neon Tokyo',
    colors: {
      bgDark: '#0a0418',
      bgPanel: 'rgba(18, 6, 38, 0.55)',
      bgPanelSolid: '#140826',
      bgPanelLight: 'rgba(255, 255, 255, 0.03)',
      borderColor: 'rgba(180, 60, 200, 0.12)',
      borderHighlight: 'rgba(80, 200, 200, 0.25)',
      textMain: '#e0e0e8',
      textPrimary: '#e0e0e8',
      textMuted: '#9878c0',
      accentPrimary: '#58d8d8',
      accentSecondary: '#cc58cc',
      accentGradient: 'linear-gradient(135deg, #58d8d8 0%, #cc58cc 100%)'
    }
  }
];

export const applyAppTheme = (themeId: string) => {
  const theme = APP_THEMES.find(t => t.id === themeId) || APP_THEMES[0];
  const root = document.documentElement;

  // Set data-theme so CSS can scope overrides (e.g. [data-theme="light"])
  root.setAttribute('data-theme', themeId);

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
