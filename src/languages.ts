export interface Language {
  id: string;
  label: string;
  monacoId: string;
  extension: string;
  commentSyntax: string;
  mapSyntax: string; // keyword that signals O(N) hash map usage
}

export const LANGUAGES: Language[] = [
  {
    id: 'java',
    label: 'Java',
    monacoId: 'java',
    extension: 'java',
    commentSyntax: '//',
    mapSyntax: 'HashMap',
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    monacoId: 'typescript',
    extension: 'ts',
    commentSyntax: '//',
    mapSyntax: 'Map',
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    monacoId: 'javascript',
    extension: 'js',
    commentSyntax: '//',
    mapSyntax: 'Map',
  },
  {
    id: 'python',
    label: 'Python',
    monacoId: 'python',
    extension: 'py',
    commentSyntax: '#',
    mapSyntax: 'dict',
  },
  {
    id: 'cpp',
    label: 'C++',
    monacoId: 'cpp',
    extension: 'cpp',
    commentSyntax: '//',
    mapSyntax: 'unordered_map',
  },
  {
    id: 'go',
    label: 'Go',
    monacoId: 'go',
    extension: 'go',
    commentSyntax: '//',
    mapSyntax: 'make(map',
  },
  {
    id: 'rust',
    label: 'Rust',
    monacoId: 'rust',
    extension: 'rs',
    commentSyntax: '//',
    mapSyntax: 'HashMap',
  },
];

export const DEFAULT_LANGUAGE = LANGUAGES[0];
