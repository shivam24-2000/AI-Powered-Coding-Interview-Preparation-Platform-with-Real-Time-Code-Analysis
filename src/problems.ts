import type { Problem } from './types';

export const PROBLEMS: Problem[] = [
  {
    id: 'two-sum',
    title: '1. Two Sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    description: `
      <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>
      <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>
      <p>You can return the answer in any order.</p>
    `,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]' }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    templates: {
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {\n    \n};`,
      javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};`,
      python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        pass`,
      cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};`,
      go: `func twoSum(nums []int, target int) []int {\n    \n}`,
      rust: `impl Solution {\n    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n        \n    }\n}`
    }
  },
  {
    id: 'valid-parentheses',
    title: '20. Valid Parentheses',
    difficulty: 'Easy',
    tags: ['String', 'Stack'],
    description: `
      <p>Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid.</p>
      <p>An input string is valid if:</p>
      <ol>
        <li>Open brackets must be closed by the same type of brackets.</li>
        <li>Open brackets must be closed in the correct order.</li>
        <li>Every close bracket has a corresponding open bracket of the same type.</li>
      </ol>
    `,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
      { input: 's = "([])"', output: 'true' }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      "s consists of parentheses only '()[]{}'."
    ],
    templates: {
      java: `class Solution {\n    public boolean isValid(String s) {\n        \n    }\n}`,
      typescript: `function isValid(s: string): boolean {\n    \n};`,
      javascript: `/**\n * @param {string} s\n * @return {boolean}\n */\nvar isValid = function(s) {\n    \n};`,
      python: `class Solution:\n    def isValid(self, s: str) -> bool:\n        pass`,
      cpp: `class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};`,
      go: `func isValid(s string) bool {\n    \n}`,
      rust: `impl Solution {\n    pub fn is_valid(s: String) -> bool {\n        \n    }\n}`
    }
  },
  {
    id: 'best-time-buy-sell',
    title: '121. Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    tags: ['Array', 'Dynamic Programming'],
    description: `
      <p>You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>i<sup>th</sup></code> day.</p>
      <p>You want to maximize your profit by choosing a <strong>single day</strong> to buy one stock and choosing a <strong>different day in the future</strong> to sell that stock.</p>
      <p>Return <em>the maximum profit you can achieve from this transaction</em>. If you cannot achieve any profit, return <code>0</code>.</p>
    `,
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.' },
      { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'In this case, no transactions are done and the max profit = 0.' }
    ],
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4'
    ],
    templates: {
      java: `class Solution {\n    public int maxProfit(int[] prices) {\n        \n    }\n}`,
      typescript: `function maxProfit(prices: number[]): number {\n    \n};`,
      javascript: `/**\n * @param {number[]} prices\n * @return {number}\n */\nvar maxProfit = function(prices) {\n    \n};`,
      python: `class Solution:\n    def maxProfit(self, prices: list[int]) -> int:\n        pass`,
      cpp: `class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        \n    }\n};`,
      go: `func maxProfit(prices []int) int {\n    \n}`,
      rust: `impl Solution {\n    pub fn max_profit(prices: Vec<i32>) -> i32 {\n        \n    }\n}`
    }
  },
  {
    id: 'longest-substring',
    title: '3. Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    description: `
      <p>Given a string <code>s</code>, find the length of the <strong>longest substring</strong> without repeating characters.</p>
      <p>A <strong>substring</strong> is a contiguous non-empty sequence of characters within a string.</p>
    `,
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
      { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with the length of 3.' }
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    templates: {
      java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        \n    }\n}`,
      typescript: `function lengthOfLongestSubstring(s: string): number {\n    \n};`,
      javascript: `/**\n * @param {string} s\n * @return {number}\n */\nvar lengthOfLongestSubstring = function(s) {\n    \n};`,
      python: `class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass`,
      cpp: `class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        \n    }\n};`,
      go: `func lengthOfLongestSubstring(s string) int {\n    \n}`,
      rust: `impl Solution {\n    pub fn length_of_longest_substring(s: String) -> i32 {\n        \n    }\n}`
    }
  },
  {
    id: 'container-with-most-water',
    title: '11. Container With Most Water',
    difficulty: 'Medium',
    tags: ['Array', 'Two Pointers', 'Greedy'],
    description: `
      <p>You are given an integer array <code>height</code> of length <code>n</code>. There are <code>n</code> vertical lines drawn such that the two endpoints of the <code>i<sup>th</sup></code> line are <code>(i, 0)</code> and <code>(i, height[i])</code>.</p>
      <p>Find two lines that together with the x-axis form a container, such that the container contains the most water.</p>
      <p>Return <em>the maximum amount of water a container can store</em>.</p>
      <p><strong>Notice</strong> that you may not slant the container.</p>
    `,
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49.' },
      { input: 'height = [1,1]', output: '1' }
    ],
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4'
    ],
    templates: {
      java: `class Solution {\n    public int maxArea(int[] height) {\n        \n    }\n}`,
      typescript: `function maxArea(height: number[]): number {\n    \n};`,
      javascript: `/**\n * @param {number[]} height\n * @return {number}\n */\nvar maxArea = function(height) {\n    \n};`,
      python: `class Solution:\n    def maxArea(self, height: list[int]) -> int:\n        pass`,
      cpp: `class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        \n    }\n};`,
      go: `func maxArea(height []int) int {\n    \n}`,
      rust: `impl Solution {\n    pub fn max_area(height: Vec<i32>) -> i32 {\n        \n    }\n}`
    }
  },
  {
    id: 'merge-intervals',
    title: '56. Merge Intervals',
    difficulty: 'Medium',
    tags: ['Array', 'Sorting'],
    description: `
      <p>Given an array of <code>intervals</code> where <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code>, merge all overlapping intervals, and return <em>an array of the non-overlapping intervals that cover all the intervals in the input</em>.</p>
    `,
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].' },
      { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]', explanation: 'Intervals [1,4] and [4,5] are considered overlapping.' }
    ],
    constraints: [
      '1 <= intervals.length <= 10^4',
      'intervals[i].length == 2',
      '0 <= start_i <= end_i <= 10^4'
    ],
    templates: {
      java: `class Solution {\n    public int[][] merge(int[][] intervals) {\n        \n    }\n}`,
      typescript: `function merge(intervals: number[][]): number[][] {\n    \n};`,
      javascript: `/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nvar merge = function(intervals) {\n    \n};`,
      python: `class Solution:\n    def merge(self, intervals: list[list[int]]) -> list[list[int]]:\n        pass`,
      cpp: `class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        \n    }\n};`,
      go: `func merge(intervals [][]int) [][]int {\n    \n}`,
      rust: `impl Solution {\n    pub fn merge(intervals: Vec<Vec<i32>>) -> Vec<Vec<i32>> {\n        \n    }\n}`
    }
  },
  {
    id: 'word-break',
    title: '139. Word Break',
    difficulty: 'Medium',
    tags: ['Hash Table', 'String', 'Dynamic Programming'],
    description: `
      <p>Given a string <code>s</code> and a dictionary of strings <code>wordDict</code>, return <code>true</code> if <code>s</code> can be segmented into a space-separated sequence of one or more dictionary words.</p>
      <p><strong>Note</strong> that the same word in the dictionary may be reused multiple times in the segmentation.</p>
    `,
    examples: [
      { input: 's = "leetcode", wordDict = ["leet","code"]', output: 'true', explanation: 'Return true because "leetcode" can be segmented as "leet code".' },
      { input: 's = "applepenapple", wordDict = ["apple","pen"]', output: 'true', explanation: 'Return true because "applepenapple" can be segmented as "apple pen apple".' },
      { input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', output: 'false' }
    ],
    constraints: [
      '1 <= s.length <= 300',
      '1 <= wordDict.length <= 1000',
      '1 <= wordDict[i].length <= 20',
      's and wordDict[i] consist of only lowercase English letters.',
      'All the strings of wordDict are unique.'
    ],
    templates: {
      java: `class Solution {\n    public boolean wordBreak(String s, List<String> wordDict) {\n        \n    }\n}`,
      typescript: `function wordBreak(s: string, wordDict: string[]): boolean {\n    \n};`,
      javascript: `/**\n * @param {string} s\n * @param {string[]} wordDict\n * @return {boolean}\n */\nvar wordBreak = function(s, wordDict) {\n    \n};`,
      python: `class Solution:\n    def wordBreak(self, s: str, wordDict: list[str]) -> bool:\n        pass`,
      cpp: `class Solution {\npublic:\n    bool wordBreak(string s, vector<string>& wordDict) {\n        \n    }\n};`,
      go: `func wordBreak(s string, wordDict []string) bool {\n    \n}`,
      rust: `impl Solution {\n    pub fn word_break(s: String, word_dict: Vec<String>) -> bool {\n        \n    }\n}`
    }
  },
  {
    id: 'trapping-rain-water',
    title: '42. Trapping Rain Water',
    difficulty: 'Hard',
    tags: ['Array', 'Two Pointers', 'Stack', 'Dynamic Programming'],
    description: `
      <p>Given <code>n</code> non-negative integers representing an elevation map where the width of each bar is <code>1</code>, compute how much water it can trap after raining.</p>
    `,
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: 'The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped.' },
      { input: 'height = [4,2,0,3,2,5]', output: '9' }
    ],
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5'
    ],
    templates: {
      java: `class Solution {\n    public int trap(int[] height) {\n        \n    }\n}`,
      typescript: `function trap(height: number[]): number {\n    \n};`,
      javascript: `/**\n * @param {number[]} height\n * @return {number}\n */\nvar trap = function(height) {\n    \n};`,
      python: `class Solution:\n    def trap(self, height: list[int]) -> int:\n        pass`,
      cpp: `class Solution {\npublic:\n    int trap(vector<int>& height) {\n        \n    }\n};`,
      go: `func trap(height []int) int {\n    \n}`,
      rust: `impl Solution {\n    pub fn trap(height: Vec<i32>) -> i32 {\n        \n    }\n}`
    }
  }
];
