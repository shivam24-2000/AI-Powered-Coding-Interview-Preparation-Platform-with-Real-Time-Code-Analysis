import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Terminal, ChevronDown, RotateCcw } from 'lucide-react';
import type { Language } from '../languages';
import type { EditorSettings } from './SettingsModal';

interface CodeEditorProps {
  code: string;
  onChange: (value: string | undefined) => void;
  language: Language;
  languages: Language[];
  onLanguageChange: (lang: Language) => void;
  onReset?: () => void;
  settings: EditorSettings;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  language,
  languages,
  onLanguageChange,
  onReset,
  settings,
}) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    applyTheme(monaco, settings.theme);
  };

  const applyTheme = (monaco: any, theme: EditorSettings['theme']) => {
    if (theme === 'nexcode-dark') {
      monaco.editor.defineTheme('nexcode-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'keyword', foreground: '8b5cf6' },
          { token: 'identifier', foreground: 'f4f4f5' },
          { token: 'string', foreground: '10b981' },
          { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
          { token: 'number', foreground: '3b82f6' },
        ],
        colors: {
          'editor.background': '#18181b',
          'editor.lineHighlightBackground': '#27272a',
          'editorLineNumber.foreground': '#52525b',
          'editorIndentGuide.background': '#27272a',
        },
      });
      monaco.editor.setTheme('nexcode-dark');
    } else {
      monaco.editor.setTheme('vs-light');
    }
  };

  // Apply settings changes live to the editor instance
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;
    editorRef.current.updateOptions({
      fontSize: settings.fontSize,
      tabSize: settings.tabSize,
      wordWrap: settings.wordWrap,
      lineNumbers: settings.lineNumbers,
    });
    applyTheme(monacoRef.current, settings.theme);
  }, [settings]);

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = languages.find(l => l.id === e.target.value);
    if (lang) onLanguageChange(lang);
  };

  return (
    <div
      className="panel editor-panel glass-panel"
      style={settings.theme === 'vs-light' ? { background: '#fff', border: '1px solid #e4e4e7' } : {}}
    >
      <div className="panel-header" style={settings.theme === 'vs-light' ? { background: '#f4f4f5' } : {}}>
        <div className="panel-title">
          <Terminal size={16} />
          <span>Solution.{language.extension}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onReset && (
            <button
              onClick={onReset}
              className="btn btn-icon"
              title="Reset Code"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                padding: '4px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <RotateCcw size={14} />
            </button>
          )}

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <select
              id="language-selector"
              value={language.id}
              onChange={handleLangChange}
              style={{
                appearance: 'none',
                background: 'rgba(139, 92, 246, 0.12)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                outline: 'none',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 500,
                padding: '4px 28px 4px 10px',
                transition: 'border-color 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.7)')}
              onMouseOut={e => (e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)')}
            >
              {languages.map(lang => (
                <option key={lang.id} value={lang.id} style={{ background: '#18181b' }}>
                  {lang.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              style={{ position: 'absolute', right: 8, pointerEvents: 'none', color: 'var(--text-muted)' }}
            />
          </div>
        </div>
      </div>

      <div className="panel-content" style={{ overflow: 'hidden' }}>
        <Editor
          height="100%"
          language={language.monacoId}
          value={code}
          onChange={onChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: settings.fontSize,
            tabSize: settings.tabSize,
            wordWrap: settings.wordWrap,
            lineNumbers: settings.lineNumbers,
            fontFamily: '"Fira Code", monospace',
            fontLigatures: true,
            lineHeight: 24,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            formatOnPaste: true,
          }}
        />
      </div>
    </div>
  );
};
