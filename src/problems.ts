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
      rust: `impl Solution {\n    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n        \n    }\n}`,
      kotlin: `class Solution {\n    fun twoSum(nums: IntArray, target: Int): IntArray {\n        \n    }\n}`,
      swift: `class Solution {\n    func twoSum(_ nums: [Int], _ target: Int) -> [Int] {\n        \n    }\n}`,
      ruby: `# @param {Integer[]} nums\n# @param {Integer} target\n# @return {Integer[]}\ndef two_sum(nums, target)\n    \nend`,
      php: `class Solution {\n    /**\n     * @param Integer[] $nums\n     * @param Integer $target\n     * @return Integer[]\n     */\n    function twoSum($nums, $target) {\n        \n    }\n}`,
      dart: `class Solution {\n  List<int> twoSum(List<int> nums, int target) {\n    \n  }\n}`,
      scala: `object Solution {\n    def twoSum(nums: Array[Int], target: Int): Array[Int] = {\n        \n    }\n}`
    },
    hints: [
      {
        tier: 1,
        label: 'Conceptual',
        content: 'Think about what information you need to store as you scan the array. For each number, what are you searching for?'
      },
      {
        tier: 2,
        label: 'Approach',
        content: 'Use a Hash Map. As you iterate, for each number x, check if (target - x) already exists in your map. If yes, you found your pair. If no, store x in the map and continue.'
      },
      {
        tier: 3,
        label: 'Pseudocode',
        content: 'map = {}\nfor i, num in enumerate(nums):\n  complement = target - num\n  if complement in map:\n    return [map[complement], i]\n  map[num] = i'
      }
    ]
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
      rust: `impl Solution {\n    pub fn is_valid(s: String) -> bool {\n        \n    }\n}`,
      kotlin: `class Solution {\n    fun isValid(s: String): Boolean {\n        \n    }\n}`,
      swift: `class Solution {\n    func isValid(_ s: String) -> Bool {\n        \n    }\n}`,
      ruby: `# @param {String} s\n# @return {Boolean}\ndef is_valid(s)\n    \nend`,
      php: `class Solution {\n    /**\n     * @param String $s\n     * @return Boolean\n     */\n    function isValid($s) {\n        \n    }\n}`,
      dart: `class Solution {\n  bool isValid(String s) {\n    \n  }\n}`,
      scala: `object Solution {\n    def isValid(s: String): Boolean = {\n        \n    }\n}`
    },
    hints: [
      {
        tier: 1,
        label: 'Conceptual',
        content: 'You need to match opening brackets with their most recent unmatched closing bracket. What data structure lets you track "the last thing seen"?'
      },
      {
        tier: 2,
        label: 'Approach',
        content: 'Use a Stack. Push every opening bracket. When you see a closing bracket, check if the top of the stack is its matching opener — if yes, pop; if no (or stack is empty), return false. At the end the stack must be empty.'
      },
      {
        tier: 3,
        label: 'Pseudocode',
        content: 'stack = []\nmap = { ")": "(", "}": "{", "]": "[" }\nfor char in s:\n  if char in map:\n    if not stack or stack[-1] != map[char]: return False\n    stack.pop()\n  else:\n    stack.push(char)\nreturn stack is empty'
      }
    ]
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
      rust: `impl Solution {\n    pub fn max_profit(prices: Vec<i32>) -> i32 {\n        \n    }\n}`,
      kotlin: `class Solution {\n    fun maxProfit(prices: IntArray): Int {\n        \n    }\n}`,
      swift: `class Solution {\n    func maxProfit(_ prices: [Int]) -> Int {\n        \n    }\n}`,
      ruby: `# @param {Integer[]} prices\n# @return {Integer}\ndef max_profit(prices)\n    \nend`,
      php: `class Solution {\n    /**\n     * @param Integer[] $prices\n     * @return Integer\n     */\n    function maxProfit($prices) {\n        \n    }\n}`,
      dart: `class Solution {\n  int maxProfit(List<int> prices) {\n    \n  }\n}`,
      scala: `object Solution {\n    def maxProfit(prices: Array[Int]): Int = {\n        \n    }\n}`
    },
    hints: [
      {
        tier: 1,
        label: 'Conceptual',
        content: 'You can only buy before you sell. As you scan left to right, what two values do you need to keep track of?'
      },
      {
        tier: 2,
        label: 'Approach',
        content: 'Use a single pass. Track the minimum price seen so far. At each day, compute profit as (current price - min price). Update your max profit if this is better.'
      },
      {
        tier: 3,
        label: 'Pseudocode',
        content: 'min_price = infinity\nmax_profit = 0\nfor price in prices:\n  min_price = min(min_price, price)\n  max_profit = max(max_profit, price - min_price)\nreturn max_profit'
      }
    ]
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
      rust: `impl Solution {\n    pub fn length_of_longest_substring(s: String) -> i32 {\n        \n    }\n}`,
      kotlin: `class Solution {\n    fun lengthOfLongestSubstring(s: String): Int {\n        \n    }\n}`,
      swift: `class Solution {\n    func lengthOfLongestSubstring(_ s: String) -> Int {\n        \n    }\n}`,
      ruby: `# @param {String} s\n# @return {Integer}\ndef length_of_longest_substring(s)\n    \nend`,
      php: `class Solution {\n    /**\n     * @param String $s\n     * @return Integer\n     */\n    function lengthOfLongestSubstring($s) {\n        \n    }\n}`,
      dart: `class Solution {\n  int lengthOfLongestSubstring(String s) {\n    \n  }\n}`,
      scala: `object Solution {\n    def lengthOfLongestSubstring(s: String): Int = {\n        \n    }\n}`
    },
    hints: [
      {
        tier: 1,
        label: 'Conceptual',
        content: 'You need a window that only contains unique characters. How can you expand and shrink this window efficiently?'
      },
      {
        tier: 2,
        label: 'Approach',
        content: 'Sliding Window + Set. Use two pointers (left, right). Expand right; if a duplicate is found, shrink from the left until the duplicate is removed. Track the max window size.'
      },
      {
        tier: 3,
        label: 'Pseudocode',
        content: 'left = 0, max_len = 0\nchar_set = set()\nfor right in range(len(s)):\n  while s[right] in char_set:\n    char_set.remove(s[left])\n    left += 1\n  char_set.add(s[right])\n  max_len = max(max_len, right - left + 1)\nreturn max_len'
      }
    ]
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
      rust: `impl Solution {\n    pub fn max_area(height: Vec<i32>) -> i32 {\n        \n    }\n}`,
      kotlin: `class Solution {\n    fun maxArea(height: IntArray): Int {\n        \n    }\n}`,
      swift: `class Solution {\n    func maxArea(_ height: [Int]) -> Int {\n        \n    }\n}`,
      ruby: `# @param {Integer[]} height\n# @return {Integer}\ndef max_area(height)\n    \nend`,
      php: `class Solution {\n    /**\n     * @param Integer[] $height\n     * @return Integer\n     */\n    function maxArea($height) {\n        \n    }\n}`,
      dart: `class Solution {\n  int maxArea(List<int> height) {\n    \n  }\n}`,
      scala: `object Solution {\n    def maxArea(height: Array[Int]): Int = {\n        \n    }\n}`
    },
    hints: [
      {
        tier: 1,
        label: 'Conceptual',
        content: 'Brute force checks all O(N²) pairs. Can you use two pointers at opposite ends and move them cleverly to avoid checking every pair?'
      },
      {
        tier: 2,
        label: 'Approach',
        content: 'Two Pointers. Start with left=0 and right=n-1. The area = min(height[l], height[r]) * (r - l). Move the pointer on the shorter side inward — moving the taller one can never increase area.'
      },
      {
        tier: 3,
        label: 'Pseudocode',
        content: 'left, right = 0, len(height) - 1\nmax_area = 0\nwhile left < right:\n  area = min(height[left], height[right]) * (right - left)\n  max_area = max(max_area, area)\n  if height[left] < height[right]: left += 1\n  else: right -= 1\nreturn max_area'
      }
    ]
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
      rust: `impl Solution {\n    pub fn merge(intervals: Vec<Vec<i32>>) -> Vec<Vec<i32>> {\n        \n    }\n}`,
      kotlin: `class Solution {\n    fun merge(intervals: Array<IntArray>): Array<IntArray> {\n        \n    }\n}`,
      swift: `class Solution {\n    func merge(_ intervals: [[Int]]) -> [[Int]] {\n        \n    }\n}`,
      ruby: `# @param {Integer[][]} intervals\n# @return {Integer[][]}\ndef merge(intervals)\n    \nend`,
      php: `class Solution {\n    /**\n     * @param Integer[][] $intervals\n     * @return Integer[][]\n     */\n    function merge($intervals) {\n        \n    }\n}`,
      dart: `class Solution {\n  List<List<int>> merge(List<List<int>> intervals) {\n    \n  }\n}`,
      scala: `object Solution {\n    def merge(intervals: Array[Array[Int]]): Array[Array[Int]] = {\n        \n    }\n}`
    },
    hints: [
      {
        tier: 1,
        label: 'Conceptual',
        content: 'Two intervals overlap if one starts before the other ends. What must you do first to make it easy to find all overlapping pairs?'
      },
      {
        tier: 2,
        label: 'Approach',
        content: 'Sort intervals by start time. Then iterate: if the current interval overlaps with the last merged one (current.start <= last.end), extend the last merged interval\'s end. Otherwise, push the current as a new interval.'
      },
      {
        tier: 3,
        label: 'Pseudocode',
        content: 'intervals.sort(key=lambda x: x[0])\nresult = [intervals[0]]\nfor start, end in intervals[1:]:\n  if start <= result[-1][1]:\n    result[-1][1] = max(result[-1][1], end)\n  else:\n    result.append([start, end])\nreturn result'
      }
    ]
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
      rust: `impl Solution {\n    pub fn word_break(s: String, word_dict: Vec<String>) -> bool {\n        \n    }\n}`,
      kotlin: `class Solution {\n    fun wordBreak(s: String, wordDict: List<String>): Boolean {\n        \n    }\n}`,
      swift: `class Solution {\n    func wordBreak(_ s: String, _ wordDict: [String]) -> Bool {\n        \n    }\n}`,
      ruby: `# @param {String} s\n# @param {String[]} word_dict\n# @return {Boolean}\ndef word_break(s, word_dict)\n    \nend`,
      php: `class Solution {\n    /**\n     * @param String $s\n     * @param String[] $wordDict\n     * @return Boolean\n     */\n    function wordBreak($s, $wordDict) {\n        \n    }\n}`,
      dart: `class Solution {\n  bool wordBreak(String s, List<String> wordDict) {\n    \n  }\n}`,
      scala: `object Solution {\n    def wordBreak(s: String, wordDict: List[String]): Boolean = {\n        \n    }\n}`
    },
    hints: [
      {
        tier: 1,
        label: 'Conceptual',
        content: 'Think of the string as positions 0 to n. Can you reach position i if you can reach some earlier position j and the substring s[j..i] is in the dictionary?'
      },
      {
        tier: 2,
        label: 'Approach',
        content: 'Dynamic Programming. Create a boolean array dp[] where dp[i] = true means s[0..i] can be segmented. For each position i, check all j < i: if dp[j] is true and s[j..i] is in wordDict, set dp[i] = true.'
      },
      {
        tier: 3,
        label: 'Pseudocode',
        content: 'word_set = set(wordDict)\ndp = [False] * (len(s) + 1)\ndp[0] = True\nfor i in range(1, len(s)+1):\n  for j in range(i):\n    if dp[j] and s[j:i] in word_set:\n      dp[i] = True\n      break\nreturn dp[len(s)]'
      }
    ]
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
      rust: `impl Solution {\n    pub fn trap(height: Vec<i32>) -> i32 {\n        \n    }\n}`,
      kotlin: `class Solution {\n    fun trap(height: IntArray): Int {\n        \n    }\n}`,
      swift: `class Solution {\n    func trap(_ height: [Int]) -> Int {\n        \n    }\n}`,
      ruby: `# @param {Integer[]} height\n# @return {Integer}\ndef trap(height)\n    \nend`,
      php: `class Solution {\n    /**\n     * @param Integer[] $height\n     * @return Integer\n     */\n    function trap($height) {\n        \n    }\n}`,
      dart: `class Solution {\n  int trap(List<int> height) {\n    \n  }\n}`,
      scala: `object Solution {\n    def trap(height: Array[Int]): Int = {\n        \n    }\n}`
    },
    hints: [
      {
        tier: 1,
        label: 'Conceptual',
        content: 'Water trapped at position i depends on the tallest bar to its left and the tallest bar to its right. How much water sits on top of bar i?'
      },
      {
        tier: 2,
        label: 'Approach',
        content: 'Two Pointer O(N) solution: Use left/right pointers. Maintain left_max and right_max. Move the pointer on the shorter side and accumulate water = max_side - height[pointer]. This avoids precomputing prefix arrays.'
      },
      {
        tier: 3,
        label: 'Pseudocode',
        content: 'left, right = 0, n-1\nleft_max = right_max = water = 0\nwhile left < right:\n  if height[left] < height[right]:\n    if height[left] >= left_max: left_max = height[left]\n    else: water += left_max - height[left]\n    left += 1\n  else:\n    if height[right] >= right_max: right_max = height[right]\n    else: water += right_max - height[right]\n    right -= 1\nreturn water'
      }
    ]
  },
  {
    id: 'climbing-stairs',
    title: '70. Climbing Stairs',
    difficulty: 'Easy',
    tags: ['Dynamic Programming', 'Math', 'Memoization'],
    description: `
      <p>You are climbing a staircase. It takes <code>n</code> steps to reach the top.</p>
      <p>Each time you can either climb <code>1</code> or <code>2</code> steps. In how many distinct ways can you climb to the top?</p>
    `,
    examples: [
      { input: 'n = 2', output: '2', explanation: 'There are two ways to climb to the top.\n1. 1 step + 1 step\n2. 2 steps' },
      { input: 'n = 3', output: '3', explanation: 'There are three ways to climb to the top.\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step' }
    ],
    constraints: [
      '1 <= n <= 45'
    ],
    templates: {
      java: `class Solution {\n    public int climbStairs(int n) {\n        \n    }\n}`,
      typescript: `function climbStairs(n: number): number {\n    \n};`,
      javascript: `/**\n * @param {number} n\n * @return {number}\n */\nvar climbStairs = function(n) {\n    \n};`,
      python: `class Solution:\n    def climbStairs(self, n: int) -> int:\n        pass`,
      cpp: `class Solution {\npublic:\n    int climbStairs(int n) {\n        \n    }\n};`
    },
    hints: [
      {
        tier: 1,
        label: 'Conceptual',
        content: 'How many ways can you reach step n? Think about what the last step you took was — either 1 step or 2 steps. How does that relate to smaller subproblems?'
      },
      {
        tier: 2,
        label: 'Approach',
        content: 'This is Fibonacci! ways(n) = ways(n-1) + ways(n-2). Use DP with O(1) space: just keep two variables for the previous two values and iterate up to n.'
      },
      {
        tier: 3,
        label: 'Pseudocode',
        content: 'if n <= 2: return n\na, b = 1, 2\nfor _ in range(3, n+1):\n  a, b = b, a + b\nreturn b'
      }
    ]
  },
  {
    id: 'reverse-linked-list',
    title: '206. Reverse Linked List',
    difficulty: 'Easy',
    tags: ['Linked List', 'Recursion'],
    description: `
      <p>Given the <code>head</code> of a singly linked list, reverse the list, and return <em>the reversed list</em>.</p>
    `,
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', output: '[2,1]' }
    ],
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 <= Node.val <= 5000'
    ],
    templates: {
      java: `/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode() {}\n *     ListNode(int val) { this.val = val; }\n *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n * }\n */\nclass Solution {\n    public ListNode reverseList(ListNode head) {\n        \n    }\n}`,
      typescript: `/**\n * Definition for singly-linked list.\n * class ListNode {\n *     val: number\n *     next: ListNode | null\n *     constructor(val?: number, next?: ListNode | null) {\n *         this.val = (val===undefined ? 0 : val)\n *         this.next = (next===undefined ? null : next)\n *     }\n * }\n */\nfunction reverseList(head: ListNode | null): ListNode | null {\n    \n};`,
      javascript: `/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n/**\n * @param {ListNode} head\n * @return {ListNode}\n */\nvar reverseList = function(head) {\n    \n};`,
      python: `# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        pass`
    },
    hints: [
      {
        tier: 1,
        label: 'Conceptual',
        content: 'You need to flip every arrow in the linked list. As you move forward, how do you reverse a link without losing the rest of the list?'
      },
      {
        tier: 2,
        label: 'Approach',
        content: 'Iterative: keep three pointers — prev (starts null), curr (starts head), next. At each step: save next = curr.next, point curr.next = prev, move prev = curr, curr = next. When curr is null, prev is the new head.'
      },
      {
        tier: 3,
        label: 'Pseudocode',
        content: 'prev = None\ncurr = head\nwhile curr:\n  next_node = curr.next\n  curr.next = prev\n  prev = curr\n  curr = next_node\nreturn prev'
      }
    ]
  },
  {
    id: 'longest-substring-without-repeating-characters',
    title: '3. Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    description: `
      <p>Given a string <code>s</code>, find the length of the <strong>longest substring</strong> without repeating characters.</p>
    `,
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' }
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    templates: {
      java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        \n    }\n}`,
      typescript: `function lengthOfLongestSubstring(s: string): number {\n    \n};`,
      javascript: `var lengthOfLongestSubstring = function(s) {\n    \n};`,
      python: `class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass`
    }
  },
  {
    id: 'number-of-islands',
    title: '200. Number of Islands',
    difficulty: 'Medium',
    tags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Matrix'],
    description: `
      <p>Given an <code>m x n</code> 2D binary grid <code>grid</code> which represents a map of <code>'1'</code>s (land) and <code>'0'</code>s (water), return <em>the number of islands</em>.</p>
      <p>An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.</p>
    `,
    examples: [
      { input: 'grid = [\n  ["1","1","1","1","0"],\n  ["1","1","0","1","0"],\n  ["1","1","0","0","0"],\n  ["0","0","0","0","0"]\n]', output: '1' },
      { input: 'grid = [\n  ["1","1","0","0","0"],\n  ["1","1","0","0","0"],\n  ["0","0","1","0","0"],\n  ["0","0","0","1","1"]\n]', output: '3' }
    ],
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 <= m, n <= 300',
      'grid[i][j] is \'0\' or \'1\'.'
    ],
    templates: {
      java: `class Solution {\n    public int numIslands(char[][] grid) {\n        \n    }\n}`,
      typescript: `function numIslands(grid: string[][]): number {\n    \n};`,
      javascript: `var numIslands = function(grid) {\n    \n};`,
      python: `class Solution:\n    def numIslands(self, grid: list[list[str]]) -> int:\n        pass`
    },
    hints: [
      {
        tier: 1,
        label: 'Conceptual',
        content: 'An island is a group of connected land cells. How can you "mark" all land cells in one island as visited so you don\'t count them again?'
      },
      {
        tier: 2,
        label: 'Approach',
        content: 'DFS/BFS flood-fill. Loop through every cell. When you find a \'1\', increment your count and run DFS/BFS from that cell, marking all connected \'1\'s as \'0\' (visited) to avoid re-counting.'
      },
      {
        tier: 3,
        label: 'Pseudocode',
        content: 'def dfs(r, c):\n  if out of bounds or grid[r][c] != "1": return\n  grid[r][c] = "0"\n  dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1)\n\ncount = 0\nfor r in range(rows):\n  for c in range(cols):\n    if grid[r][c] == "1":\n      dfs(r, c)\n      count += 1\nreturn count'
      }
    ]
  },
  {
    id: 'maximum-subarray',
    title: '53. Maximum Subarray',
    difficulty: 'Medium',
    tags: ['Array', 'Divide and Conquer', 'Dynamic Programming'],
    description: `
      <p>Given an integer array <code>nums</code>, find the subarray with the largest sum, and return <em>its sum</em>.</p>
    `,
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', output: '1' }
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    templates: {
      java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        \n    }\n}`,
      typescript: `function maxSubArray(nums: number[]): number {\n    \n};`,
      javascript: `var maxSubArray = function(nums) {\n    \n};`,
      python: `class Solution:\n    def maxSubArray(self, nums: list[int]) -> int:\n        pass`
    },
    hints: [
      {
        tier: 1,
        label: 'Conceptual',
        content: 'At each position, you decide: extend the existing subarray, or start a new one. When is it better to start fresh?'
      },
      {
        tier: 2,
        label: 'Approach',
        content: 'Kadane\'s Algorithm: Keep a running current_sum. At each element, current_sum = max(num, current_sum + num) — if current_sum was negative, start over. Track the max current_sum seen.'
      },
      {
        tier: 3,
        label: 'Pseudocode',
        content: 'current_sum = max_sum = nums[0]\nfor num in nums[1:]:\n  current_sum = max(num, current_sum + num)\n  max_sum = max(max_sum, current_sum)\nreturn max_sum'
      }
    ]
  },
  {
    id: 'kth-largest-element',
    title: '215. Kth Largest Element in an Array',
    difficulty: 'Medium',
    tags: ['Divide and Conquer', 'Heap (Priority Queue)'],
    description: `
      <p>Given an integer array <code>nums</code> and an integer <code>k</code>, return <em>the k<sup>th</sup> largest element in the array</em>.</p>
      <p>Note that it is the <code>k<sup>th</sup></code> largest element in the sorted order, not the <code>k<sup>th</sup></code> distinct element.</p>
    `,
    examples: [
      { input: 'nums = [3,2,1,5,6,4], k = 2', output: '5' },
      { input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', output: '4' }
    ],
    constraints: [
      '1 <= k <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    templates: {
      java: `class Solution {\n    public int findKthLargest(int[] nums, int k) {\n        \n    }\n}`,
      typescript: `function findKthLargest(nums: number[], k: number): number {\n    \n};`,
      javascript: `var findKthLargest = function(nums, k) {\n    \n};`,
      python: `class Solution:\n    def findKthLargest(self, nums: list[int], k: int) -> int:\n        pass`
    },
    hints: [
      {
        tier: 1,
        label: 'Conceptual',
        content: 'You need the kth largest. Sorting works in O(N log N). Can you do better using a heap that only tracks the top k elements?'
      },
      {
        tier: 2,
        label: 'Approach',
        content: 'Min-Heap of size k: push all elements; if heap grows beyond k, pop the minimum. The top of the min-heap at the end is the kth largest. O(N log k) time.'
      },
      {
        tier: 3,
        label: 'Pseudocode',
        content: 'import heapq\nheap = []\nfor num in nums:\n  heapq.heappush(heap, num)\n  if len(heap) > k:\n    heapq.heappop(heap)\nreturn heap[0]'
      }
    ]
  },
  {
    id: 'binary-tree-level-order-traversal',
    title: '102. Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    tags: ['Tree', 'Breadth-First Search', 'Binary Tree'],
    description: `
      <p>Given the <code>root</code> of a binary tree, return <em>the level order traversal of its nodes\' values</em>. (i.e., from left to right, level by level).</p>
    `,
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' },
      { input: 'root = [1]', output: '[[1]]' }
    ],
    constraints: [
      'The number of nodes in the tree is in the range [0, 2000].',
      '-1000 <= Node.val <= 1000'
    ],
    templates: {
      java: `/**\n * Definition for a binary tree node.\n * public class TreeNode {\n *     int val;\n *     TreeNode left;\n *     TreeNode right;\n *     TreeNode() {}\n *     TreeNode(int val) { this.val = val; }\n *     TreeNode(int val, TreeNode left, TreeNode right) {\n *         this.val = val;\n *         this.left = left;\n *         this.right = right;\n *     }\n * }\n */\nclass Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        \n    }\n}`,
      typescript: `/**\n * Definition for a binary tree node.\n * class TreeNode {\n *     val: number\n *     left: TreeNode | null\n *     right: TreeNode | null\n *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {\n *         this.val = (val===undefined ? 0 : val)\n *         this.left = (left===undefined ? null : left)\n *         this.right = (right===undefined ? null : right)\n *     }\n * }\n */\nfunction levelOrder(root: TreeNode | null): number[][] {\n    \n};`,
      javascript: `var levelOrder = function(root) {\n    \n};`,
      python: `class Solution:\n    def levelOrder(self, root: Optional[TreeNode]) -> list[list[int]]:\n        pass`
    },
    hints: [
      {
        tier: 1,
        label: 'Conceptual',
        content: 'You need to visit all nodes level by level. What data structure processes elements in FIFO order — visiting all nodes of one level before the next?'
      },
      {
        tier: 2,
        label: 'Approach',
        content: 'BFS with a Queue. Start with root in a queue. At each iteration, process ALL nodes currently in the queue (that is one level). For each node, collect its value and enqueue its children. Repeat until queue is empty.'
      },
      {
        tier: 3,
        label: 'Pseudocode',
        content: 'if not root: return []\nresult = []\nqueue = deque([root])\nwhile queue:\n  level = []\n  for _ in range(len(queue)):\n    node = queue.popleft()\n    level.append(node.val)\n    if node.left: queue.append(node.left)\n    if node.right: queue.append(node.right)\n  result.append(level)\nreturn result'
      }
    ]
  },
  {
    id: 'coin-change',
    title: '322. Coin Change',
    difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming', 'Breadth-First Search'],
    description: `
      <p>You are given an integer array <code>coins</code> representing coins of different denominations and an integer <code>amount</code> representing a total amount of money.</p>
      <p>Return <em>the fewest number of coins that you need to make up that amount</em>. If that amount of money cannot be made up by any combination of the coins, return <code>-1</code>.</p>
      <p>You may assume that you have an infinite number of each kind of coin.</p>
    `,
    examples: [
      { input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1' },
      { input: 'coins = [2], amount = 3', output: '-1' }
    ],
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4'
    ],
    templates: {
      java: `class Solution {\n    public int coinChange(int[] coins, int amount) {\n        \n    }\n}`,
      typescript: `function coinChange(coins: number[], amount: number): number {\n    \n};`,
      javascript: `var coinChange = function(coins, amount) {\n    \n};`,
      python: `class Solution:\n    def coinChange(self, coins: list[int], amount: int) -> int:\n        pass`
    },
    hints: [
      {
        tier: 1,
        label: 'Conceptual',
        content: 'The minimum coins to make amount X depends on the minimum coins to make smaller amounts. Can you build up the answer from the bottom?'
      },
      {
        tier: 2,
        label: 'Approach',
        content: 'Bottom-Up DP. Create dp[0..amount] initialized to infinity (impossible). dp[0] = 0. For each amount i from 1 to amount, try every coin: dp[i] = min(dp[i], dp[i - coin] + 1) if i - coin >= 0.'
      },
      {
        tier: 3,
        label: 'Pseudocode',
        content: 'dp = [float("inf")] * (amount + 1)\ndp[0] = 0\nfor i in range(1, amount + 1):\n  for coin in coins:\n    if coin <= i:\n      dp[i] = min(dp[i], dp[i - coin] + 1)\nreturn dp[amount] if dp[amount] != float("inf") else -1'
      }
    ]
  }
];
