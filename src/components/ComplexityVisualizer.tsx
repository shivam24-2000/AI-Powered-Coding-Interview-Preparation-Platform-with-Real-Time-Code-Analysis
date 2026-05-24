import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, ChevronLeft, ChevronRight, RotateCcw, X, 
  LineChart as ChartIcon, Eye, HelpCircle, Sparkles, Cpu, Award 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, 
  ResponsiveContainer, ReferenceDot, Legend 
} from 'recharts';
import type { Problem, AnalysisState } from '../types';

interface ComplexityVisualizerProps {
  isOpen: boolean;
  onClose: () => void;
  problem: Problem;
  analysisState: AnalysisState;
}

// -------------------------------------------------------------
// Big-O Curves Chart Data Helper
// -------------------------------------------------------------
const generateBigOData = () => {
  const data = [];
  // Generate points from n = 1 to 24 for clean visual scaling
  for (let n = 1; n <= 24; n++) {
    data.push({
      n,
      'O(1)': 2, // offset for visual clarity
      'O(log N)': Math.log2(n) * 1.5 + 2,
      'O(N)': n + 1,
      'O(N log N)': n * Math.log2(n) * 0.4 + 1,
      'O(N²)': Math.pow(n, 2) * 0.1 + 1,
    });
  }
  return data;
};

const BIG_O_DATA = generateBigOData();

const COMPLEXITY_COLORS: Record<string, string> = {
  'O(1)': '#10B981', // green
  'O(log N)': '#3B82F6', // blue
  'O(N)': '#F59E0B', // yellow
  'O(N log N)': '#8B5CF6', // purple
  'O(N²)': '#EF4444', // red
};

// Map typical strings to curve IDs
const parseComplexity = (compStr: string): string => {
  const s = compStr.toLowerCase();
  if (s.includes('o(1)')) return 'O(1)';
  if (s.includes('o(log') || s.includes('olog')) return 'O(log N)';
  if (s.includes('o(n log') || s.includes('onlog') || s.includes('nlogn')) return 'O(N log N)';
  if (s.includes('o(n^2)') || s.includes('on2') || s.includes('quadratic')) return 'O(N²)';
  if (s.includes('o(n)')) return 'O(N)';
  return 'O(N)'; // default fallback
};

// Map curve IDs to illustrative (x, y) points for reference dots on the chart
const getDotPosition = (curve: string) => {
  const nVal = 12; // place dot in the middle of the X axis
  switch (curve) {
    case 'O(1)': return { x: nVal, y: 2 };
    case 'O(log N)': return { x: nVal, y: Math.log2(nVal) * 1.5 + 2 };
    case 'O(N)': return { x: nVal, y: nVal + 1 };
    case 'O(N log N)': return { x: nVal, y: nVal * Math.log2(nVal) * 0.4 + 1 };
    case 'O(N²)': return { x: nVal, y: Math.pow(nVal, 2) * 0.1 + 1 };
    default: return { x: nVal, y: nVal + 1 };
  }
};

// -------------------------------------------------------------
// Visual Trace Definitions for the 8 Platform Problems
// -------------------------------------------------------------
interface TraceFrame {
  step: number;
  description: string;
  variables: Record<string, any>;
  highlightedIndices?: number[];
  stateData?: any;
}

const getTraceFramesForProblem = (problemId: string): TraceFrame[] => {
  switch (problemId) {
    case 'two-sum':
      return [
        {
          step: 0,
          description: "Initialize target target = 9, and an empty Hash Map to store values and their indices.",
          variables: { target: 9, i: 'N/A', num: 'N/A', complement: 'N/A', map: '{}' },
          stateData: { array: [2, 7, 11, 15], map: {} }
        },
        {
          step: 1,
          description: "Examine element at index i = 0 (value = 2). Compute complement: 9 - 2 = 7.",
          variables: { target: 9, i: 0, num: 2, complement: 7, map: '{}' },
          highlightedIndices: [0],
          stateData: { array: [2, 7, 11, 15], map: {}, checking: 2, lookingFor: 7 }
        },
        {
          step: 2,
          description: "Check if complement 7 exists in Hash Map. It does not. Store current number 2 and its index 0.",
          variables: { target: 9, i: 0, num: 2, complement: 7, map: '{2: 0}' },
          highlightedIndices: [0],
          stateData: { array: [2, 7, 11, 15], map: { 2: 0 } }
        },
        {
          step: 3,
          description: "Advance index to i = 1 (value = 7). Compute complement: 9 - 7 = 2.",
          variables: { target: 9, i: 1, num: 7, complement: 2, map: '{2: 0}' },
          highlightedIndices: [1],
          stateData: { array: [2, 7, 11, 15], map: { 2: 0 }, checking: 7, lookingFor: 2 }
        },
        {
          step: 4,
          description: "Check if complement 2 is in Hash Map. Yes! Found at index 0. We've matched the target! Return indices [0, 1].",
          variables: { target: 9, i: 1, num: 7, complement: 2, map: '{2: 0}', result: '[0, 1]' },
          highlightedIndices: [0, 1],
          stateData: { array: [2, 7, 11, 15], map: { 2: 0 }, success: true, indices: [0, 1] }
        }
      ];

    case 'valid-parentheses':
      return [
        {
          step: 0,
          description: "Initialize an empty Stack to keep track of expected matching brackets.",
          variables: { stack: '[]', char: 'N/A' },
          stateData: { s: '{[]}', stack: [] }
        },
        {
          step: 1,
          description: "Process character at index 0: '{'. Since it's an opening bracket, push it onto the Stack.",
          variables: { stack: "['{']", char: '{' },
          highlightedIndices: [0],
          stateData: { s: '{[]}', stack: ['{'] }
        },
        {
          step: 2,
          description: "Process character at index 1: '['. It's an opening bracket, so push it onto the Stack.",
          variables: { stack: "['{', '[']", char: '[' },
          highlightedIndices: [1],
          stateData: { s: '{[]}', stack: ['{', '['] }
        },
        {
          step: 3,
          description: "Process character at index 2: ']'. It's a closing bracket. Check the top of Stack ('['). They match! Pop '['.",
          variables: { stack: "['{']", char: ']' },
          highlightedIndices: [2],
          stateData: { s: '{[]}', stack: ['{'], popped: '[' }
        },
        {
          step: 4,
          description: "Process character at index 3: '}'. It's a closing bracket. Check the top of Stack ('{'). They match! Pop '{'.",
          variables: { stack: '[]', char: '}' },
          highlightedIndices: [3],
          stateData: { s: '{[]}', stack: [], popped: '{' }
        },
        {
          step: 5,
          description: "All characters processed. Stack is completely empty. Return true (String is valid).",
          variables: { stack: '[]', result: 'true' },
          stateData: { s: '{[]}', stack: [], success: true }
        }
      ];

    case 'best-time-buy-sell':
      return [
        {
          step: 0,
          description: "Initialize variables: minPrice = ∞ (tracks cheapest buy day) and maxProfit = 0 (tracks best yield).",
          variables: { minPrice: '∞', maxProfit: 0, day: 'N/A', price: 'N/A' },
          stateData: { prices: [7, 1, 5, 3, 6, 4], minPrice: Infinity, maxProfit: 0 }
        },
        {
          step: 1,
          description: "Day 1: Price is 7. minPrice is updated from ∞ to 7. Profit if sold today: 7 - 7 = 0.",
          variables: { minPrice: 7, maxProfit: 0, day: 1, price: 7 },
          highlightedIndices: [0],
          stateData: { prices: [7, 1, 5, 3, 6, 4], minPrice: 7, maxProfit: 0, buyDay: 0 }
        },
        {
          step: 2,
          description: "Day 2: Price falls to 1. Cheaper deal! minPrice is updated to 1.",
          variables: { minPrice: 1, maxProfit: 0, day: 2, price: 1 },
          highlightedIndices: [1],
          stateData: { prices: [7, 1, 5, 3, 6, 4], minPrice: 1, maxProfit: 0, buyDay: 1 }
        },
        {
          step: 3,
          description: "Day 3: Price rises to 5. Potential profit if bought at 1 and sold at 5: 5 - 1 = 4. Update maxProfit = 4.",
          variables: { minPrice: 1, maxProfit: 4, day: 3, price: 5 },
          highlightedIndices: [1, 2],
          stateData: { prices: [7, 1, 5, 3, 6, 4], minPrice: 1, maxProfit: 4, buyDay: 1, sellDay: 2 }
        },
        {
          step: 4,
          description: "Day 4: Price is 3. Profit if bought at 1 and sold at 3: 3 - 1 = 2. Profit is lower than maxProfit (4). Keep maxProfit.",
          variables: { minPrice: 1, maxProfit: 4, day: 4, price: 3 },
          highlightedIndices: [1, 3],
          stateData: { prices: [7, 1, 5, 3, 6, 4], minPrice: 1, maxProfit: 4, buyDay: 1, currentCheckDay: 3 }
        },
        {
          step: 5,
          description: "Day 5: Price spikes to 6. Profit if bought at 1 and sold at 6: 6 - 1 = 5. Excels previous peak! Update maxProfit = 5.",
          variables: { minPrice: 1, maxProfit: 5, day: 5, price: 6 },
          highlightedIndices: [1, 4],
          stateData: { prices: [7, 1, 5, 3, 6, 4], minPrice: 1, maxProfit: 5, buyDay: 1, sellDay: 4 }
        },
        {
          step: 6,
          description: "Day 6: Price is 4. Profit if bought at 1 and sold at 4 is 3. Max profit remains 5. End of array. Return 5.",
          variables: { minPrice: 1, maxProfit: 5, day: 6, price: 4, finalResult: 5 },
          highlightedIndices: [1, 4],
          stateData: { prices: [7, 1, 5, 3, 6, 4], minPrice: 1, maxProfit: 5, buyDay: 1, sellDay: 4, success: true }
        }
      ];

    case 'longest-substring':
      return [
        {
          step: 0,
          description: "Initialize sliding window borders: L = 0, R = 0. Use a Set to store active unique characters.",
          variables: { L: 0, R: 0, maxLen: 0, charSet: '{}' },
          stateData: { s: 'abcabc', L: 0, R: 0, set: [] }
        },
        {
          step: 1,
          description: "R = 0 (char = 'a'). 'a' not in Set. Insert 'a'. maxLen = 1.",
          variables: { L: 0, R: 0, maxLen: 1, charSet: "{'a'}" },
          highlightedIndices: [0],
          stateData: { s: 'abcabc', L: 0, R: 0, set: ['a'] }
        },
        {
          step: 2,
          description: "Advance R to 1 (char = 'b'). 'b' not in Set. Insert 'b'. maxLen = 2.",
          variables: { L: 0, R: 1, maxLen: 2, charSet: "{'a', 'b'}" },
          highlightedIndices: [0, 1],
          stateData: { s: 'abcabc', L: 0, R: 1, set: ['a', 'b'] }
        },
        {
          step: 3,
          description: "Advance R to 2 (char = 'c'). 'c' not in Set. Insert 'c'. maxLen = 3.",
          variables: { L: 0, R: 2, maxLen: 3, charSet: "{'a', 'b', 'c'}" },
          highlightedIndices: [0, 1, 2],
          stateData: { s: 'abcabc', L: 0, R: 2, set: ['a', 'b', 'c'] }
        },
        {
          step: 4,
          description: "Advance R to 3 (char = 'a'). CRITICAL: 'a' is already in Set! Shrink window from the left.",
          variables: { L: 0, R: 3, maxLen: 3, charSet: "{'a', 'b', 'c'}", conflict: 'a' },
          highlightedIndices: [0, 1, 2, 3],
          stateData: { s: 'abcabc', L: 0, R: 3, set: ['a', 'b', 'c'], conflict: true }
        },
        {
          step: 5,
          description: "Remove 'a' at index L = 0 from Set. Increment L to 1. The window is now valid again.",
          variables: { L: 1, R: 3, maxLen: 3, charSet: "{'b', 'c'}" },
          highlightedIndices: [1, 2, 3],
          stateData: { s: 'abcabc', L: 1, R: 3, set: ['b', 'c'] }
        },
        {
          step: 6,
          description: "Add 'a' at R = 3 back into Set. Window: 'bca'. Length = 3.",
          variables: { L: 1, R: 3, maxLen: 3, charSet: "{'b', 'c', 'a'}" },
          highlightedIndices: [1, 2, 3],
          stateData: { s: 'abcabc', L: 1, R: 3, set: ['b', 'c', 'a'] }
        }
      ];

    case 'container-with-most-water':
      return [
        {
          step: 0,
          description: "Initialize pointers at the boundaries: L = 0, R = 8. Set maxArea = 0.",
          variables: { L: 0, R: 8, maxArea: 0, currentArea: 'N/A' },
          stateData: { heights: [1, 8, 6, 2, 5, 4, 8, 3, 7], L: 0, R: 8, maxArea: 0 }
        },
        {
          step: 1,
          description: "Compute area: Width (8 - 0 = 8) * Min Height (min(1, 7) = 1) = 8. Update maxArea = 8.",
          variables: { L: 0, R: 8, maxArea: 8, currentArea: 8 },
          highlightedIndices: [0, 8],
          stateData: { heights: [1, 8, 6, 2, 5, 4, 8, 3, 7], L: 0, R: 8, maxArea: 8, currentArea: 8 }
        },
        {
          step: 2,
          description: "Since Height[L] (1) < Height[R] (7), moving R inward won't improve the capacity. Shift L pointer rightward to index 1.",
          variables: { L: 1, R: 8, maxArea: 8, pointerMove: 'L' },
          highlightedIndices: [1, 8],
          stateData: { heights: [1, 8, 6, 2, 5, 4, 8, 3, 7], L: 1, R: 8, maxArea: 8 }
        },
        {
          step: 3,
          description: "Compute area: Width (8 - 1 = 7) * Min Height (min(8, 7) = 7) = 49. Update maxArea = 49.",
          variables: { L: 1, R: 8, maxArea: 49, currentArea: 49 },
          highlightedIndices: [1, 8],
          stateData: { heights: [1, 8, 6, 2, 5, 4, 8, 3, 7], L: 1, R: 8, maxArea: 49, currentArea: 49 }
        },
        {
          step: 4,
          description: "Since Height[L] (8) > Height[R] (7), shift R pointer leftward to index 7.",
          variables: { L: 1, R: 7, maxArea: 49, pointerMove: 'R' },
          highlightedIndices: [1, 7],
          stateData: { heights: [1, 8, 6, 2, 5, 4, 8, 3, 7], L: 1, R: 7, maxArea: 49 }
        },
        {
          step: 5,
          description: "Compute area: Width (7 - 1 = 6) * Min Height (min(8, 3) = 3) = 18. Keep maxArea = 49. Shift R inward to 6.",
          variables: { L: 1, R: 6, maxArea: 49, currentArea: 18 },
          highlightedIndices: [1, 6],
          stateData: { heights: [1, 8, 6, 2, 5, 4, 8, 3, 7], L: 1, R: 6, maxArea: 49, currentArea: 18 }
        }
      ];

    case 'trapping-rain-water':
      return [
        {
          step: 0,
          description: "Initialize two pointers: L = 0, R = 7. Maintain leftMax = 0, rightMax = 0, and total trapped water = 0.",
          variables: { L: 0, R: 7, leftMax: 0, rightMax: 0, water: 0 },
          stateData: { height: [0, 1, 0, 2, 1, 0, 1, 3], L: 0, R: 7, leftMax: 0, rightMax: 0, water: 0 }
        },
        {
          step: 1,
          description: "L=0, height=0. leftMax becomes 0. L height <= R height. Increment L.",
          variables: { L: 1, R: 7, leftMax: 0, rightMax: 0, water: 0 },
          highlightedIndices: [0, 7],
          stateData: { height: [0, 1, 0, 2, 1, 0, 1, 3], L: 1, R: 7, leftMax: 0, rightMax: 0, water: 0 }
        },
        {
          step: 2,
          description: "L=1, height=1. leftMax updates to 1. L height <= R height. Increment L.",
          variables: { L: 2, R: 7, leftMax: 1, rightMax: 0, water: 0 },
          highlightedIndices: [1, 7],
          stateData: { height: [0, 1, 0, 2, 1, 0, 1, 3], L: 2, R: 7, leftMax: 1, rightMax: 0, water: 0 }
        },
        {
          step: 3,
          description: "L=2, height=0. leftMax (1) > height (0). Trap water: leftMax - height = 1. Add 1 water block. Increment L.",
          variables: { L: 3, R: 7, leftMax: 1, rightMax: 0, water: 1 },
          highlightedIndices: [2, 7],
          stateData: { height: [0, 1, 0, 2, 1, 0, 1, 3], L: 3, R: 7, leftMax: 1, rightMax: 0, water: 1, trapped: [2] }
        },
        {
          step: 4,
          description: "L=3, height=2. leftMax updates to 2. L height <= R height. Increment L.",
          variables: { L: 4, R: 7, leftMax: 2, rightMax: 0, water: 1 },
          highlightedIndices: [3, 7],
          stateData: { height: [0, 1, 0, 2, 1, 0, 1, 3], L: 4, R: 7, leftMax: 2, rightMax: 0, water: 1, trapped: [2] }
        }
      ];

    case 'word-break':
      return [
        {
          step: 0,
          description: "Initialize boolean DP table: dp = [T, F, F, F, F, F, F, F, F] where dp[0] = True (empty string base case).",
          variables: { wordDict: '["leet", "code"]', s: '"leetcode"', dp: '[T, F, F, F, F, F, F, F, F]' },
          stateData: { s: 'leetcode', dp: [true, false, false, false, false, false, false, false, false], dict: ['leet', 'code'] }
        },
        {
          step: 1,
          description: "Evaluating index i = 4. Checking substring s[0:4] = 'leet'. Since dp[0] is True and 'leet' is in dict, dp[4] becomes True.",
          variables: { i: 4, j: 0, substring: 'leet', match: 'true', dp: '[T, F, F, F, T, F, F, F, F]' },
          highlightedIndices: [0, 4],
          stateData: { s: 'leetcode', dp: [true, false, false, false, true, false, false, false, false], dict: ['leet', 'code'], checking: [0, 4] }
        },
        {
          step: 2,
          description: "Evaluating index i = 8. Checking substring s[4:8] = 'code'. Since dp[4] is True and 'code' is in dict, dp[8] becomes True.",
          variables: { i: 8, j: 4, substring: 'code', match: 'true', dp: '[T, F, F, F, T, F, F, F, T]' },
          highlightedIndices: [4, 8],
          stateData: { s: 'leetcode', dp: [true, false, false, false, true, false, false, false, true], dict: ['leet', 'code'], checking: [4, 8] }
        },
        {
          step: 3,
          description: "DP array completed. Since dp[8] (dp[n]) is True, the word break logic succeeds! Return true.",
          variables: { result: 'true', dp: '[T, F, F, F, T, F, F, F, T]' },
          stateData: { s: 'leetcode', dp: [true, false, false, false, true, false, false, false, true], dict: ['leet', 'code'], success: true }
        }
      ];

    case 'merge-intervals':
      return [
        {
          step: 0,
          description: "Sort intervals based on starting values. Initial intervals: [[1,3], [2,6], [8,10]]. Add [1,3] to merged stack.",
          variables: { intervals: '[[1,3], [2,6], [8,10]]', merged: '[[1,3]]' },
          stateData: { intervals: [[1, 3], [2, 6], [8, 10]], merged: [[1, 3]] }
        },
        {
          step: 1,
          description: "Examine next interval [2,6]. Check for overlap: start 2 <= end of previous 3. Overlap detected! Merge them: [1, max(3, 6)] = [1,6].",
          variables: { current: '[2,6]', previous: '[1,3]', overlap: 'true', merged: '[[1,6]]' },
          highlightedIndices: [0, 1],
          stateData: { intervals: [[1, 3], [2, 6], [8, 10]], merged: [[1, 6]] }
        },
        {
          step: 2,
          description: "Examine next interval [8,10]. Check for overlap: start 8 > end of previous 6. No overlap. Push [8,10] as a new interval.",
          variables: { current: '[8,10]', previous: '[1,6]', overlap: 'false', merged: '[[1,6], [8,10]]' },
          highlightedIndices: [2],
          stateData: { intervals: [[1, 3], [2, 6], [8, 10]], merged: [[1, 6], [8, 10]] }
        },
        {
          step: 3,
          description: "All intervals processed. Merging finished. Return [[1,6], [8,10]].",
          variables: { result: '[[1,6], [8,10]]' },
          stateData: { intervals: [[1, 3], [2, 6], [8, 10]], merged: [[1, 6], [8, 10]], success: true }
        }
      ];

    default:
      return [
        {
          step: 0,
          description: "Tracer loading...",
          variables: {},
          stateData: {}
        }
      ];
  }
};

// -------------------------------------------------------------
// Component Main Body
// -------------------------------------------------------------
export const ComplexityVisualizer: React.FC<ComplexityVisualizerProps> = ({
  isOpen,
  onClose,
  problem,
  analysisState,
}) => {
  const [activeTab, setActiveTab] = useState<'chart' | 'tracer'>('chart');
  const [metricTab, setMetricTab] = useState<'time' | 'space'>('time');
  
  // Playback Control States
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // multiplier (1x = 800ms)
  
  const traceFrames = getTraceFramesForProblem(problem.id);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Compute curve ids based on friday evaluation
  const timeCurve = parseComplexity(analysisState.timeComplexity || 'O(N)');
  const spaceCurve = parseComplexity(analysisState.spaceComplexity || 'O(N)');

  const userCurve = metricTab === 'time' ? timeCurve : spaceCurve;
  const dotPos = getDotPosition(userCurve);

  // Reset step whenever active tab or problem changes
  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [activeTab, problem.id]);

  // Handle tracer automatic playback loop
  useEffect(() => {
    if (isPlaying) {
      const delay = 1000 / speed;
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= traceFrames.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, delay);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, traceFrames.length]);

  if (!isOpen) return null;

  const currentFrame = traceFrames[currentStep] || traceFrames[0];

  // -------------------------------------------------------------
  // Problem-specific Sub-Renderers for Tracer Tab
  // -------------------------------------------------------------
  const renderTracerVisualContent = () => {
    const data = currentFrame.stateData || {};
    
    switch (problem.id) {
      case 'two-sum': {
        const arr = data.array || [];
        const mapEntries = Object.entries(data.map || {});
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: '16px 0' }}>
            {/* Array Box */}
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Input Array (nums)</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {arr.map((val: number, idx: number) => {
                  const isHighlighted = currentFrame.highlightedIndices?.includes(idx);
                  return (
                    <div 
                      key={idx} 
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isHighlighted ? 'var(--bg-panel-light)' : 'rgba(255,255,255,0.02)',
                        border: isHighlighted ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                        boxShadow: isHighlighted ? '0 0 12px var(--glow-primary)' : 'none',
                        transition: 'all 0.3s',
                        position: 'relative'
                      }}
                    >
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: isHighlighted ? 'var(--accent-primary)' : 'var(--text-main)' }}>{val}</span>
                      <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '2px' }}>idx {idx}</span>
                      
                      {/* Pointer Indicator */}
                      {currentFrame.variables.i === idx && (
                        <div style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ color: 'var(--accent-primary)', fontSize: '0.65rem', fontWeight: 'bold' }}>i</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Calculations and Maps Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Lookup Card */}
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Computation</div>
                {data.checking !== undefined ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                    <div>Current Val: <strong style={{ color: 'var(--accent-primary)' }}>{data.checking}</strong></div>
                    <div>Target Complement: 9 - {data.checking} = <strong style={{ color: 'var(--accent-secondary)' }}>{data.lookingFor}</strong></div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
                      {data.success ? `Success! Found index for complement ${data.lookingFor} in map.` : `Checking map for key ${data.lookingFor}... Not found.`}
                    </div>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Preparing simulation...</span>
                )}
              </div>

              {/* Hash Map Box */}
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>Hash Map State</div>
                {mapEntries.length === 0 ? (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>[Empty Map]</span>
                ) : (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {mapEntries.map(([key, val]) => (
                      <div key={key} style={{ padding: '4px 10px', borderRadius: '6px', background: 'var(--bg-panel-light)', border: '1px solid var(--border-highlight)', fontSize: '0.78rem', color: 'var(--text-main)' }}>
                        <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{key}</span> : {val as number}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }

      case 'valid-parentheses': {
        const stack: string[] = data.stack || [];
        const charSeq = (data.s || '').split('');
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px', padding: '12px 0' }}>
            {/* Input Characters */}
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Input String (s)</div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {charSeq.map((c: string, idx: number) => {
                  const isHighlighted = currentFrame.highlightedIndices?.includes(idx);
                  return (
                    <div 
                      key={idx}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: 700,
                        background: isHighlighted ? 'var(--bg-panel-light)' : 'rgba(255,255,255,0.02)',
                        border: isHighlighted ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                        color: isHighlighted ? 'var(--accent-primary)' : 'var(--text-main)',
                        boxShadow: isHighlighted ? '0 0 10px var(--glow-primary)' : 'none',
                        transition: 'all 0.3s'
                      }}
                    >
                      {c}
                    </div>
                  );
                })}
              </div>
              
              {/* Event Feedback */}
              {currentFrame.variables.char !== 'N/A' && (
                <div style={{ fontSize: '0.84rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '10px', marginTop: '16px' }}>
                  Current Bracket: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{currentFrame.variables.char}</span>
                  {data.popped ? (
                    <div>Matched and popped <strong style={{ color: 'var(--accent-secondary)' }}>{data.popped}</strong> from stack.</div>
                  ) : (
                    <div>Pushed <strong style={{ color: 'var(--accent-secondary)' }}>{currentFrame.variables.char}</strong> onto stack.</div>
                  )}
                </div>
              )}
            </div>

            {/* Glowing Stack Visualizer */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Call Stack Frame</div>
              
              {/* Stack Glass Cup */}
              <div 
                style={{
                  width: '100px',
                  height: '140px',
                  border: '3px solid var(--border-highlight)',
                  borderTop: 'none',
                  borderRadius: '0 0 12px 12px',
                  background: 'rgba(255, 255, 255, 0.01)',
                  boxShadow: 'inset 0 0 15px rgba(150, 118, 200, 0.05)',
                  display: 'flex',
                  flexDirection: 'column-reverse',
                  padding: '8px',
                  gap: '6px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {stack.map((c, i) => (
                  <div 
                    key={i}
                    style={{
                      height: '24px',
                      borderRadius: '4px',
                      background: 'var(--bg-panel-light)',
                      border: '1px solid var(--accent-primary)',
                      color: 'var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      animation: 'slideDown 0.3s ease'
                    }}
                  >
                    {c}
                  </div>
                ))}
                {stack.length === 0 && (
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    Empty Stack
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }

      case 'best-time-buy-sell': {
        const prices: number[] = data.prices || [];
        const buyDay = data.buyDay;
        const sellDay = data.sellDay;
        const currentIdx = data.currentCheckDay;
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '12px 0' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Market Price Bar Chart</div>
            
            {/* Simple Dynamic SVG Bar chart */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', height: '110px', padding: '8px 12px 20px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', position: 'relative' }}>
              {prices.map((p, idx) => {
                const isBuy = idx === buyDay;
                const isSell = idx === sellDay;
                const isChecking = idx === currentIdx || currentFrame.highlightedIndices?.includes(idx);
                const heightPct = (p / 8) * 100; // max value is 7
                
                return (
                  <div 
                    key={idx}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      height: '100%',
                      justifyContent: 'flex-end',
                      position: 'relative'
                    }}
                  >
                    <div 
                      style={{
                        width: '100%',
                        height: `${heightPct}%`,
                        borderRadius: '4px 4px 0 0',
                        background: isBuy 
                          ? '#10B981' 
                          : isSell 
                            ? 'var(--accent-primary)' 
                            : isChecking 
                              ? 'var(--accent-secondary)' 
                              : 'var(--bg-panel-light)',
                        border: isBuy || isSell || isChecking ? '1px solid transparent' : '1px solid var(--border-color)',
                        transition: 'all 0.3s',
                        boxShadow: isBuy 
                          ? '0 0 10px rgba(16, 185, 129, 0.4)' 
                          : isSell 
                            ? '0 0 10px var(--glow-primary)' 
                            : 'none'
                      }}
                    />
                    <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '4px' }}>${p}</span>
                    
                    {/* Tags */}
                    {isBuy && (
                      <div style={{ position: 'absolute', top: '-18px', background: '#10B981', color: '#fff', fontSize: '0.55rem', padding: '1px 4px', borderRadius: '3px', fontWeight: 'bold', textTransform: 'uppercase' }}>BUY</div>
                    )}
                    {isSell && (
                      <div style={{ position: 'absolute', top: '-18px', background: 'var(--accent-primary)', color: '#fff', fontSize: '0.55rem', padding: '1px 4px', borderRadius: '3px', fontWeight: 'bold', textTransform: 'uppercase' }}>SELL</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      case 'longest-substring': {
        const charSeq = (data.s || '').split('');
        const left = data.L || 0;
        const right = data.R || 0;
        const activeSet = data.set || [];
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '12px 0' }}>
            {/* Substring Sequence */}
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>Characters (s)</div>
              <div style={{ display: 'flex', gap: '8px', position: 'relative', paddingBottom: '16px' }}>
                {charSeq.map((c: string, idx: number) => {
                  const isInWindow = idx >= left && idx <= right;
                  const isConflict = data.conflict && idx === right;
                  return (
                    <div 
                      key={idx}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: 700,
                        background: isConflict 
                          ? 'rgba(239, 68, 68, 0.15)' 
                          : isInWindow 
                            ? 'var(--bg-panel-light)' 
                            : 'rgba(255,255,255,0.01)',
                        border: isConflict 
                          ? '2px solid #EF4444' 
                          : isInWindow 
                            ? '2px solid var(--accent-primary)' 
                            : '1px solid var(--border-color)',
                        color: isConflict 
                          ? '#EF4444' 
                          : isInWindow 
                            ? 'var(--accent-primary)' 
                            : 'var(--text-muted)',
                        transition: 'all 0.3s',
                        boxShadow: isInWindow && !isConflict ? '0 0 10px var(--glow-primary)' : 'none',
                        position: 'relative'
                      }}
                    >
                      {c}
                      {idx === left && (
                        <div style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', color: 'var(--accent-secondary)', fontSize: '0.62rem', fontWeight: 'bold' }}>L</div>
                      )}
                      {idx === right && (
                        <div style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', color: 'var(--accent-primary)', fontSize: '0.62rem', fontWeight: 'bold' }}>R</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Set Output */}
            <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Active Character Set</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {activeSet.map((char: string) => (
                  <div key={char} style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--bg-panel-light)', border: '1px solid var(--border-highlight)', display: 'flex', alignItems: 'center', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-primary)', justifyContent: 'center' }}>
                    {char}
                  </div>
                ))}
                {activeSet.length === 0 && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>[Empty Set]</span>
                )}
              </div>
            </div>
          </div>
        );
      }

      case 'container-with-most-water': {
        const heights: number[] = data.heights || [];
        const left = data.L || 0;
        const right = data.R || 0;
        const currentArea = data.currentArea;
        
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '12px 0' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Water Container Visual Map</div>
            
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '110px', padding: '8px 12px 20px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', position: 'relative' }}>
              {/* Dynamic Water box filling */}
              {left < right && currentArea !== undefined && (
                <div 
                  style={{
                    position: 'absolute',
                    left: `${((left) / heights.length) * 92 + 5}%`,
                    width: `${((right - left) / heights.length) * 92}%`,
                    height: `${(Math.min(heights[left], heights[right]) / 8) * 80}px`,
                    background: 'rgba(59, 130, 246, 0.25)',
                    border: '1px dashed var(--accent-primary)',
                    borderRadius: '4px',
                    transition: 'all 0.3s',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span style={{ color: 'var(--text-primary)', fontSize: '0.68rem', fontWeight: 'bold', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '4px' }}>
                    Area: {currentArea}
                  </span>
                </div>
              )}

              {heights.map((h, idx) => {
                const isActive = idx === left || idx === right;
                const heightPct = (h / 8) * 100;
                
                return (
                  <div 
                    key={idx}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      height: '100%',
                      justifyContent: 'flex-end',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    <div 
                      style={{
                        width: '8px',
                        height: `${heightPct}%`,
                        borderRadius: '2px 2px 0 0',
                        background: isActive ? 'var(--accent-primary)' : 'var(--bg-panel-light)',
                        border: isActive ? 'none' : '1px solid var(--border-color)',
                        transition: 'all 0.3s',
                        boxShadow: isActive ? '0 0 8px var(--glow-primary)' : 'none'
                      }}
                    />
                    
                    {/* Index labels */}
                    {idx === left && (
                      <div style={{ position: 'absolute', bottom: '-18px', color: 'var(--accent-primary)', fontSize: '0.62rem', fontWeight: 'bold' }}>L (h={h})</div>
                    )}
                    {idx === right && (
                      <div style={{ position: 'absolute', bottom: '-18px', color: 'var(--accent-primary)', fontSize: '0.62rem', fontWeight: 'bold' }}>R (h={h})</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      case 'trapping-rain-water': {
        const height: number[] = data.height || [];
        const left = data.L || 0;
        const right = data.R || 0;
        const trapped: number[] = data.trapped || [];

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '12px 0' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Elevation Map and Trapped Water</div>
            
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '110px', padding: '8px 12px 20px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', position: 'relative' }}>
              {height.map((h, idx) => {
                const isActive = idx === left || idx === right;
                const isWater = trapped.includes(idx);
                const maxVal = 3;
                const heightPct = (h / maxVal) * 80;
                const waterPct = isWater ? (1 / maxVal) * 80 : 0;
                
                return (
                  <div 
                    key={idx}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      height: '100%',
                      justifyContent: 'flex-end',
                      position: 'relative'
                    }}
                  >
                    {/* Trapped Water overlay */}
                    {isWater && (
                      <div 
                        style={{
                          width: '100%',
                          height: `${waterPct}%`,
                          background: '#3B82F6',
                          borderRadius: '2px 2px 0 0',
                          marginBottom: '2px',
                          opacity: 0.8,
                          animation: 'fadeIn 0.4s ease'
                        }}
                      />
                    )}

                    {/* Ground bar */}
                    {h > 0 ? (
                      <div 
                        style={{
                          width: '100%',
                          height: `${heightPct}%`,
                          background: isActive ? 'var(--accent-primary)' : 'rgba(255,255,255,0.15)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '2px 2px 0 0',
                          transition: 'all 0.3s'
                        }}
                      />
                    ) : (
                      <div style={{ height: '2px', width: '100%', background: 'rgba(255,255,255,0.03)' }} />
                    )}
                    
                    {/* Pointer labels */}
                    {idx === left && (
                      <div style={{ position: 'absolute', bottom: '-18px', color: 'var(--accent-secondary)', fontSize: '0.62rem', fontWeight: 'bold' }}>L</div>
                    )}
                    {idx === right && (
                      <div style={{ position: 'absolute', bottom: '-18px', color: 'var(--accent-primary)', fontSize: '0.62rem', fontWeight: 'bold' }}>R</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      case 'word-break': {
        const s = data.s || '';
        const dp: boolean[] = data.dp || [];
        const chars = s.split('');
        const checkingIndices = data.checking || [];

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '12px 0' }}>
            {/* Substring Display */}
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>String Segment</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {chars.map((char: string, idx: number) => {
                  const checkStart = checkingIndices[0] || 0;
                  const checkEnd = checkingIndices[1] || 0;
                  const isScanning = idx >= checkStart && idx < checkEnd;
                  return (
                    <div 
                      key={idx}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        background: isScanning ? 'var(--bg-panel-light)' : 'rgba(255,255,255,0.01)',
                        border: isScanning ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                        color: isScanning ? 'var(--accent-primary)' : 'var(--text-main)',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        transition: 'all 0.3s'
                      }}
                    >
                      {char}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DP Array */}
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>DP Table State</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {dp.map((val: boolean, idx: number) => (
                  <div 
                    key={idx}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      background: val ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.01)',
                      border: val ? '1.5px solid #10B981' : '1px solid var(--border-color)',
                      color: val ? '#10B981' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      transition: 'all 0.3s'
                    }}
                  >
                    {val ? 'T' : 'F'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'merge-intervals': {
        const intervals: Array<[number, number]> = data.intervals || [];
        const merged: Array<[number, number]> = data.merged || [];

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '12px 0' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Timeline Interval Merging</div>
            
            {/* Visual Bars list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Original Intervals</div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {intervals.map((item, idx) => {
                    const isChecking = currentFrame.highlightedIndices?.includes(idx);
                    return (
                      <div 
                        key={idx}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: isChecking ? 'var(--bg-panel-light)' : 'rgba(255,255,255,0.02)',
                          border: isChecking ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
                          color: isChecking ? 'var(--accent-primary)' : 'var(--text-main)',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}
                      >
                        [{item[0]}, {item[1]}]
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Merged Stack</div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {merged.map((item, idx) => (
                    <div 
                      key={idx}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1.5px solid #10B981',
                        color: '#10B981',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        animation: 'fadeIn 0.3s ease'
                      }}
                    >
                      [{item[0]}, {item[1]}]
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      }

      default:
        return <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Simulation frame loading...</span>;
    }
  };

  return (
    <div 
      className="visualizer-modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(5, 5, 17, 0.65)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      <div 
        className="glass-panel visualizer-modal-container"
        style={{
          width: '100%',
          maxWidth: '850px',
          background: 'var(--bg-panel-solid)',
          border: '1.5px solid var(--border-color)',
          borderRadius: '24px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.01)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          overflow: 'hidden',
          animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {/* Modal Header */}
        <div 
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', background: 'var(--bg-panel-light)', borderRadius: '10px', border: '1px solid var(--border-highlight)' }}>
              <Cpu size={20} className="text-gradient" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Friday Complexity Visualizer & Tracer
              </h2>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{problem.title}</span>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            style={{
              background: 'var(--bg-panel-light)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '10px',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Selection Row */}
        <div 
          style={{
            padding: '12px 24px',
            background: 'rgba(255,255,255,0.005)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-panel-light)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setActiveTab('chart')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: 600,
                borderRadius: '8px',
                background: activeTab === 'chart' ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === 'chart' ? '#fff' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <ChartIcon size={14} /> Big-O Curves Chart
            </button>
            <button
              onClick={() => setActiveTab('tracer')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: 600,
                borderRadius: '8px',
                background: activeTab === 'tracer' ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === 'tracer' ? '#fff' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Eye size={14} /> Interactive Execution Tracer
            </button>
          </div>

          {activeTab === 'chart' && (
            <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-panel-light)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <button
                onClick={() => setMetricTab('time')}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: metricTab === 'time' ? 'rgba(255,255,255,0.06)' : 'transparent',
                  color: metricTab === 'time' ? 'var(--text-primary)' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Time Analysis
              </button>
              <button
                onClick={() => setMetricTab('space')}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: metricTab === 'space' ? 'rgba(255,255,255,0.06)' : 'transparent',
                  color: metricTab === 'space' ? 'var(--text-primary)' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Space Analysis
              </button>
            </div>
          )}
        </div>

        {/* Modal Main Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          
          {/* TAB 1: BIG-O CHART */}
          {activeTab === 'chart' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 6px', fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Estimated {metricTab === 'time' ? 'Execution Time' : 'Memory Allocation'} Curve
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    Below is the comparative asymptotic scaling graph. Your current solution resolves asymptotically to{' '}
                    <strong style={{ color: COMPLEXITY_COLORS[userCurve] || 'var(--accent-primary)' }}>{userCurve}</strong> complexity.
                  </p>
                </div>

                <div 
                  className="glass-panel"
                  style={{
                    padding: '14px 18px',
                    borderRadius: '16px',
                    border: '1.5px solid var(--border-highlight)',
                    background: 'var(--bg-panel-light)',
                    textAlign: 'center',
                    boxShadow: '0 0 16px var(--glow-primary)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span style={{ fontSize: '0.64rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Rating</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: COMPLEXITY_COLORS[userCurve] }}>{userCurve}</span>
                </div>
              </div>

              {/* Recharts graph container */}
              <div style={{ height: '300px', width: '100%', padding: '10px 0' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={BIG_O_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                    <XAxis dataKey="n" stroke="var(--text-muted)" fontSize={10} tickLine={false} label={{ value: 'Input size (N)', position: 'insideBottom', offset: -5, fill: 'var(--text-muted)', fontSize: 9 }} />
                    <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} label={{ value: 'Operations count', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 9 }} />
                    <ChartTooltip 
                      contentStyle={{ background: 'var(--bg-panel-solid)', border: '1px solid var(--border-color)', borderRadius: '10px' }}
                      labelStyle={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '0.78rem' }}
                      itemStyle={{ fontSize: '0.76rem' }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.72rem' }} />
                    
                    {Object.entries(COMPLEXITY_COLORS).map(([curve, color]) => (
                      <Line 
                        key={curve}
                        type="monotone"
                        dataKey={curve}
                        stroke={color}
                        strokeWidth={curve === userCurve ? 3.5 : 1.5}
                        dot={false}
                        activeDot={false}
                        opacity={curve === userCurve ? 1 : 0.25}
                      />
                    ))}
                    
                    {/* User complexity highlighted RefDot */}
                    <ReferenceDot 
                      x={dotPos.x} 
                      y={dotPos.y} 
                      r={6} 
                      fill={COMPLEXITY_COLORS[userCurve]} 
                      stroke="#fff" 
                      strokeWidth={1.5}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Complexity comparison indicators */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ padding: '14px', background: 'var(--bg-panel-light)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Cpu size={15} color="var(--accent-primary)" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Resource Performance</span>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    As size $N$ increases to $10^4$ inputs, an <strong>{userCurve}</strong> algorithm scales {userCurve === 'O(N²)' ? 'quadratically, which might run into Time Limit Exceeded (TLE) boundaries.' : 'highly efficiently within safe, production-grade memory brackets.'}
                  </span>
                </div>

                <div style={{ padding: '14px', background: 'var(--bg-panel-light)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Award size={15} color="var(--accent-secondary)" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Optimal Standard</span>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    The baseline recommended target for this task category is <strong style={{ color: '#10B981' }}>{problem.id === 'trapping-rain-water' ? 'O(N)' : 'O(N) / O(log N)'}</strong>. Friday advises matching this profile for tech evaluation filters.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXECUTION TRACER */}
          {activeTab === 'tracer' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Progress Playback Controller panel */}
              <div 
                className="glass-panel"
                style={{
                  padding: '12px 20px',
                  borderRadius: '16px',
                  background: 'var(--bg-panel-light)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px'
                }}
              >
                {/* Play Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setCurrentStep(0);
                      setIsPlaying(false);
                    }}
                    disabled={currentStep === 0}
                    className="btn btn-icon"
                    style={{ padding: '6px', borderRadius: '8px', cursor: 'pointer', opacity: currentStep === 0 ? 0.3 : 1 }}
                  >
                    <RotateCcw size={15} />
                  </button>
                  
                  <button
                    onClick={() => {
                      if (currentStep > 0) setCurrentStep(currentStep - 1);
                      setIsPlaying(false);
                    }}
                    disabled={currentStep === 0}
                    className="btn btn-icon"
                    style={{ padding: '6px', borderRadius: '8px', cursor: 'pointer', opacity: currentStep === 0 ? 0.3 : 1 }}
                  >
                    <ChevronLeft size={15} />
                  </button>
                  
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="btn btn-icon"
                    style={{
                      padding: '8px',
                      borderRadius: '50%',
                      background: 'var(--accent-primary)',
                      color: '#fff',
                      cursor: 'pointer',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 10px var(--glow-primary)',
                      transform: 'scale(1.05)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {isPlaying ? <Pause size={15} fill="#fff" /> : <Play size={15} fill="#fff" style={{ marginLeft: '2px' }} />}
                  </button>
                  
                  <button
                    onClick={() => {
                      if (currentStep < traceFrames.length - 1) setCurrentStep(currentStep + 1);
                      setIsPlaying(false);
                    }}
                    disabled={currentStep === traceFrames.length - 1}
                    className="btn btn-icon"
                    style={{ padding: '6px', borderRadius: '8px', cursor: 'pointer', opacity: currentStep === traceFrames.length - 1 ? 0.3 : 1 }}
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>

                {/* Timeline Progress Slider */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>0{currentStep + 1}</span>
                  <input 
                    type="range"
                    min={0}
                    max={traceFrames.length - 1}
                    value={currentStep}
                    onChange={(e) => {
                      setCurrentStep(parseInt(e.target.value));
                      setIsPlaying(false);
                    }}
                    style={{
                      flex: 1,
                      accentColor: 'var(--accent-primary)',
                      height: '4px',
                      borderRadius: '2px',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>0{traceFrames.length}</span>
                </div>

                {/* Speed Controls */}
                <div style={{ display: 'flex', gap: '4px', border: '1px solid var(--border-color)', padding: '2px', borderRadius: '8px' }}>
                  {[1, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '0.66rem',
                        fontWeight: 700,
                        borderRadius: '6px',
                        background: speed === s ? 'var(--accent-primary)' : 'transparent',
                        color: speed === s ? '#fff' : 'var(--text-muted)',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Graphical Canvas Area */}
              <div 
                className="glass-panel"
                style={{
                  minHeight: '190px',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  background: 'rgba(255,255,255,0.005)',
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                {renderTracerVisualContent()}
              </div>

              {/* Explanatory description card & Variables tracker row */}
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '16px' }}>
                
                {/* Description Card */}
                <div style={{ padding: '16px', background: 'var(--bg-panel-light)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Sparkles size={14} color="var(--accent-primary)" />
                    <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Step Execution Walkthrough</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                    {currentFrame.description}
                  </p>
                </div>

                {/* Variables Card */}
                <div style={{ padding: '16px', background: 'var(--bg-panel-light)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <HelpCircle size={14} color="var(--accent-secondary)" />
                    <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Variables Scope Tracker</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {Object.entries(currentFrame.variables).map(([name, val]) => (
                      <div key={name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', borderBottom: '1px dashed rgba(255,255,255,0.03)', paddingBottom: '3px' }}>
                        <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>{name}</span>
                        <strong style={{ color: 'var(--accent-primary)', fontFamily: 'monospace' }}>{String(val)}</strong>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
      
      {/* Custom Styles */}
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .visualizer-modal-overlay input[type="range"]::-webkit-slider-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 8px var(--glow-primary);
        }
      `}</style>
    </div>
  );
};
