import type { Problem, AnalysisState } from './types';
import type { Language } from './languages';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

import { quotaManager } from './quotaManager';

export async function analyzeCode(
  code: string,
  problem: Problem,
  language: Language
): Promise<{
  timeComplexity: string;
  spaceComplexity: string;
  suggestions: AnalysisState['suggestions'];
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

  // If no API Key is provided, fallback to the heuristic logic
  if (!API_KEY || API_KEY === 'your_actual_key_here') {
    return fallbackAnalysis(code, problem, language);
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
        ]
      }
      Focus on algorithmic efficiency, potential bugs, and code quality. Provide maximum 3 most relevant suggestions. 
      IMPORTANT: Return ONLY the JSON object, no markdown formatting.
    `;

    // Use gemini-2.0-flash for 2026 compatibility
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    const response = await fetch(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          }
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        // Stop calling API for 45 seconds
        quotaManager.block(45000);
        throw new Error('Rate limit hit (429). Entering 45s cooldown.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      let resultText = data.candidates[0].content.parts[0].text;
      
      // Clean up markdown code blocks if the LLM included them
      resultText = resultText.replace(/```json\n?/, '').replace(/```\n?$/, '').trim();
      
      return JSON.parse(resultText);
    }
    
    throw new Error('Invalid response format from Gemini API');

  } catch (error) {
    console.error("Gemini Analysis failed, falling back to heuristics:", error);
    return fallbackAnalysis(code, problem, language);
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

  return { timeComplexity, spaceComplexity, suggestions: suggestions.slice(0, 3) };
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
