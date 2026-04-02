export interface ProblemHint {
  tier: 1 | 2 | 3;
  label: string;    // e.g. "Conceptual", "Approach", "Pseudocode"
  content: string;
}

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
  templates: Record<string, string>;
  hints?: ProblemHint[];
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
  explanation?: string[];
  edgeCases?: Array<{
    id: string;
    title: string;
    description: string;
  }>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export type InterviewPhase = 'intro' | 'coding' | 'evaluation';

export interface InterviewEvaluation {
  status: 'hired' | 'waitlist' | 'rejected';
  score: number; // 0-100
  feedback: {
    communication: string;
    problemSolving: string;
    codeQuality: string;
    efficiency: string;
  };
  summary: string;
  nextSteps: string[];
}


