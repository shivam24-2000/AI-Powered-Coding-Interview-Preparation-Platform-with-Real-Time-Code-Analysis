export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  templates: Record<string, string>; // languageId -> codeTemplate
}

export interface AnalysisState {
  isAnalyzing: boolean;
  timeComplexity: string;
  spaceComplexity: string;
  suggestions: Array<{
    id: string;
    type: 'error' | 'warning' | 'info' | 'success';
    message: string;
    line?: number;
  }>;
}


