import type { Problem, AnalysisState, ChatMessage } from './types';
import type { Language } from './languages';
import { quotaManager } from './quotaManager';
import { PROBLEMS } from './problems';

export async function analyzeCode(
  code: string,
  problem: Problem,
  language: Language
): Promise<{
  timeComplexity: string;
  spaceComplexity: string;
  suggestions: AnalysisState['suggestions'];
  explanation?: string[];
  edgeCases?: Array<{ id: string; title: string; description: string }>;
}> {
  const trimmedCode = (code || '').trim();
  
  // Rate limiting cooldown logic
  if (quotaManager.isBlocked()) {
    console.warn("AI Analysis is in cooldown, falling back to heuristics.");
    return fallbackAnalysis(code, problem, language);
  }

  const template = problem.templates[language.id] || '';
  if (trimmedCode.length < 120 || trimmedCode === template.trim()) {
    return {
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
      suggestions: [
        { id: 'start', type: 'info', message: 'I’m watching! Start building your logic and I’ll provide complexity analysis.' }
      ]
    };
  }

  try {
    const prompt = `
      You are an expert technical interviewer. Analyze the following code for the coding problem: "${problem.title}".
      
      Problem Description: ${problem.description.replace(/<[^>]*>?/gm, '')}
      Language: ${language.label}
      User's Code:
      \`\`\`${language.monacoId}
      ${code}
      \`\`\`
      
      Return a JSON object with this exact structure:
      {
        "timeComplexity": "string (e.g., O(N), O(log N))",
        "spaceComplexity": "string (e.g., O(1), O(N))",
        "suggestions": [
          {
            "id": "unique_string",
            "type": "error" | "warning" | "info" | "success",
            "message": "specific feedback message",
            "line": number (optional)
          }
        ],
        "explanation": ["step 1", "step 2", ...],
        "edgeCases": [
          { "id": "case1", "title": "Empty Input", "description": "How does your code handle an empty array?" },
          ...
        ] (Suggest 2-3 critical edge cases specific to this code and problem)
      }
      Focus on algorithmic efficiency, potential bugs, and code quality. Provide maximum 3 most relevant suggestions. 
      IMPORTANT: Return ONLY the JSON object, no markdown formatting.
    `;

    const apiKey = import.meta.env.GEMINI_API_KEY || '';
    const url = apiKey 
      ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`
      : `/api/analyze`;

    const body = apiKey 
      ? JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } })
      : JSON.stringify({ prompt });

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Proxy error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      let resultText = data.candidates[0].content.parts[0].text;
      resultText = resultText.replace(/```json\n?/, '').replace(/```\n?$/, '').trim();
      return JSON.parse(resultText);
    }
    
    throw new Error('Invalid response format from Gemini API');

  } catch (error) {
    console.error("Gemini Analysis failed, falling back to heuristics:", error);
    return fallbackAnalysis(code, problem, language);
  }
}

export async function getChatResponse(
  messages: ChatMessage[],
  code: string,
  problem: Problem,
  language: Language
): Promise<string> {
  if (quotaManager.isBlocked()) {
    return "I'm cooling down for a moment to ensure high-quality responses. Please try again in a few seconds!";
  }

  // Get active titles to suggest from
  const availableProblemTitles = PROBLEMS.map(p => `- ${p.title}`).join('\n');

  try {
    const context = `
      You are Friday, an expert technical interviewer and AI Assistant at NexCode. 
      The candidate is solving "${problem.title}".
      Problem: ${problem.description.replace(/<[^>]*>?/gm, '')}
      Current Language: ${language.label}
      Candidate's Current Code:
      \`\`\`${language.monacoId}
      ${code}
      \`\`\`

      IMPORTANT: Here are other available problems in the app. If the candidate solves the problem, suggest 3 of these by EXACT name or title:
      ${availableProblemTitles}

      Instruction: You are being reads aloud via user systems. Speak in a warm, encouraging, conversational human-like tone. 
      Use casual conversational fillers naturally (e.g., "Let's see...", "Hmm...", "Interesting approach!"). 
      Avoid heavy formatting or long bulleted lists when replying to short conversational cues. 
      Don't just give the full solution unless explicitly asked. Guide the candidate toward the right answer organically like a real interviewer inside a room.
    `;

    const chatHistory = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    // Gemini requires alternating roles. We'll prepend the system context to the FIRST user message.
    if (chatHistory.length > 0 && chatHistory[0].role === 'user') {
      chatHistory[0].parts[0].text = `System Context: ${context}\n\nCandidate's Question: ${chatHistory[0].parts[0].text}`;
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    const url = apiKey 
      ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`
      : `/api/chat`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: chatHistory }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return `Detailed Analysis: ${response.status} - ${errorData.error?.message || 'Unknown error'}`;
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || "I'm processed your request but didn't have a specific response. Could you rephrase?";

  } catch (error) {
    console.error("Chat failed:", error);
    return "Connection issues. Please check your network and try again!";
  }
}

// Keep the previous logic as a fallback
async function fallbackAnalysis(code: string, problem: Problem, language: Language) {
  let timeComplexity = 'O(N²)';
  let spaceComplexity = 'O(1)';
  const suggestions: AnalysisState['suggestions'] = [];

  const hasReturn = language.id === 'rust' 
    ? (code.includes('return') || code.includes('vec!') || code.includes(']'))
    : code.includes('return');
    
  if (!hasReturn && !['cpp', 'go', 'java'].includes(language.id)) {
    suggestions.push({ id: 'missing-return', type: 'error', message: 'Your function logic seems incomplete. Don\'t forget to return the result!' });
  }

  switch (problem.id) {
    case 'two-sum':
      if (code.includes(language.mapSyntax)) {
        timeComplexity = 'O(N)';
        spaceComplexity = 'O(N)';
        suggestions.push({ id: 'ts-optimal', type: 'success', message: 'Optimal O(N) approach detected using a Hash Map. Well done!' });
      } else if (hasNestedLoops(code)) {
        suggestions.push({ id: 'ts-brute', type: 'warning', message: 'This O(N²) approach is slow. Try using a Hash Map for O(N) time.' });
      }
      break;
    default:
      if (hasNestedLoops(code)) {
        suggestions.push({ id: 'gen-slow', type: 'warning', message: 'Nested loops suggest O(N²). Can you optimize this to O(N)?' });
      } else {
        timeComplexity = 'O(N)';
        suggestions.push({ id: 'gen-ok', type: 'info', message: 'Structure seems to be O(N). Ensure you handle edge cases.' });
      }
  }

  const explanation = [
    'Initializing data structures and checking edge cases.',
    'Iterating through the input stream to process logic.',
    'Evaluating conditions to build the final result.',
    'Returning the computed solution.'
  ];

  const edgeCases = [
    { id: 'edge-1', title: 'Empty Input', description: 'Ensure your code handles empty or null inputs gracefully.' },
    { id: 'edge-2', title: 'Large Inputs', description: 'Consider if your complexity holds up with very large datasets.' }
  ];

  return { timeComplexity, spaceComplexity, suggestions: suggestions.slice(0, 3), explanation, edgeCases };
}

function hasNestedLoops(code: string): boolean {
  const lines = code.split('\n');
  let nesting = 0;
  let maxNesting = 0;
  for (const line of lines) {
    if (line.includes('{')) nesting++;
    if (line.includes('}')) nesting--;
    if (line.includes('for') || line.includes('while')) {
       if (nesting > 1) maxNesting = Math.max(maxNesting, nesting);
    }
  }
  return maxNesting > 1;
}
