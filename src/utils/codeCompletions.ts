/**
 * codeCompletions.ts
 *
 * Registers language-aware code completion providers for Monaco Editor.
 * Covers DSA patterns (data structures, algorithms, common built-ins) for
 * every language supported by NexCode AI.
 */

type Monaco = any;

// Track registered disposables per language so we can clean them up
const disposables: Record<string, any[]> = {};

function makeSnippet(
  monaco: Monaco,
  label: string,
  insertText: string,
  documentation: string,
  detail?: string,
) {
  return {
    label,
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText,
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation,
    detail: detail ?? '✦ NexCode Snippet',
    sortText: '0' + label, // push snippets to the top
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PYTHON
// ─────────────────────────────────────────────────────────────────────────────
function getPythonCompletions(monaco: Monaco) {
  return [
    // Data structures
    makeSnippet(monaco, 'deque', "from collections import deque\n${1:dq} = deque()", 'Double-ended queue from collections'),
    makeSnippet(monaco, 'defaultdict', "from collections import defaultdict\n${1:d} = defaultdict(${2:int})", 'DefaultDict with a default factory'),
    makeSnippet(monaco, 'counter', "from collections import Counter\n${1:cnt} = Counter(${2:iterable})", 'Count element frequencies'),
    makeSnippet(monaco, 'heapq', "import heapq\n${1:heap} = []\nheapq.heappush(${1:heap}, ${2:val})\n${3:top} = heapq.heappop(${1:heap})", 'Min-heap using heapq'),
    makeSnippet(monaco, 'sortedcontainers', "from sortedcontainers import SortedList\n${1:sl} = SortedList()", 'Sorted list (O(log n) add/remove)'),
    makeSnippet(monaco, 'OrderedDict', "from collections import OrderedDict\n${1:od} = OrderedDict()", 'Ordered dict (insertion order)'),

    // Algorithms
    makeSnippet(monaco, 'binsearch', "import bisect\n${1:idx} = bisect.bisect_left(${2:arr}, ${3:target})", 'Binary search with bisect'),
    makeSnippet(monaco, 'binsearch_manual',
      "def binary_search(arr, target):\n    lo, hi = 0, len(arr) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1",
      'Manual binary search template'),
    makeSnippet(monaco, 'twopointers',
      "left, right = 0, len(${1:arr}) - 1\nwhile left < right:\n    ${2:# your logic here}\n    left += 1\n    right -= 1",
      'Two-pointer pattern'),
    makeSnippet(monaco, 'sliding_window',
      "left = 0\nfor right in range(len(${1:arr})):\n    ${2:# expand window}\n    while ${3:condition}:\n        ${4:# shrink window}\n        left += 1\n    ${5:# track answer}",
      'Sliding window pattern'),
    makeSnippet(monaco, 'bfs',
      "from collections import deque\ndef bfs(graph, start):\n    visited = set([start])\n    queue = deque([start])\n    while queue:\n        node = queue.popleft()\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)",
      'BFS graph traversal'),
    makeSnippet(monaco, 'dfs',
      "def dfs(graph, node, visited=None):\n    if visited is None:\n        visited = set()\n    visited.add(node)\n    for neighbor in graph[node]:\n        if neighbor not in visited:\n            dfs(graph, neighbor, visited)\n    return visited",
      'DFS graph traversal (recursive)'),
    makeSnippet(monaco, 'dfs_iter',
      "def dfs_iterative(graph, start):\n    visited = set()\n    stack = [start]\n    while stack:\n        node = stack.pop()\n        if node not in visited:\n            visited.add(node)\n            stack.extend(graph[node])",
      'DFS iterative (stack-based)'),
    makeSnippet(monaco, 'dp_memo',
      "from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef dp(${1:n}):\n    if ${2:base case}:\n        return ${3:0}\n    return ${4:# recurrence}",
      'Memoized DP with lru_cache'),
    makeSnippet(monaco, 'union_find',
      "class UnionFind:\n    def __init__(self, n):\n        self.parent = list(range(n))\n        self.rank = [0] * n\n\n    def find(self, x):\n        if self.parent[x] != x:\n            self.parent[x] = self.find(self.parent[x])\n        return self.parent[x]\n\n    def union(self, x, y):\n        px, py = self.find(x), self.find(y)\n        if px == py:\n            return False\n        if self.rank[px] < self.rank[py]:\n            px, py = py, px\n        self.parent[py] = px\n        if self.rank[px] == self.rank[py]:\n            self.rank[px] += 1\n        return True",
      'Union-Find (Disjoint Set Union)'),
    makeSnippet(monaco, 'trie',
      "class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word):\n        node = self.root\n        for ch in word:\n            node = node.children.setdefault(ch, TrieNode())\n        node.is_end = True\n\n    def search(self, word):\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                return False\n            node = node.children[ch]\n        return node.is_end",
      'Trie (prefix tree)'),
    makeSnippet(monaco, 'listcomp', "[${1:expr} for ${2:x} in ${3:iterable} if ${4:condition}]", 'List comprehension'),
    makeSnippet(monaco, 'enumerate', "for ${1:i}, ${2:val} in enumerate(${3:arr}):\n    ${4:pass}", 'Enumerate loop'),
    makeSnippet(monaco, 'zip', "for ${1:a}, ${2:b} in zip(${3:arr1}, ${4:arr2}):\n    ${5:pass}", 'Zip two iterables'),
    makeSnippet(monaco, 'funcdef', "def ${1:function_name}(${2:args}) -> ${3:None}:\n    \"\"\"${4:Docstring.}\"\"\"\n    ${5:pass}", 'Function definition with type hint'),
    makeSnippet(monaco, 'classdef', "class ${1:ClassName}:\n    def __init__(self${2:, args}):\n        ${3:pass}", 'Class definition'),
    makeSnippet(monaco, 'inf', "float('inf')", 'Positive infinity'),
    makeSnippet(monaco, 'ninf', "float('-inf')", 'Negative infinity'),
    makeSnippet(monaco, 'sort_key', "${1:arr}.sort(key=lambda x: ${2:x})", 'Sort with custom key'),
    makeSnippet(monaco, 'matrix', "${1:matrix} = [[${2:0}] * ${3:cols} for _ in range(${4:rows})]", '2D matrix initializer'),
    makeSnippet(monaco, 'stdin', "import sys\ninput = sys.stdin.readline", 'Fast stdin for competitive programming'),
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// JAVA
// ─────────────────────────────────────────────────────────────────────────────
function getJavaCompletions(monaco: Monaco) {
  return [
    makeSnippet(monaco, 'hashmap', "Map<${1:String}, ${2:Integer}> ${3:map} = new HashMap<>();", 'HashMap declaration'),
    makeSnippet(monaco, 'treemap', "Map<${1:String}, ${2:Integer}> ${3:map} = new TreeMap<>();", 'TreeMap (sorted keys)'),
    makeSnippet(monaco, 'linkedhashmap', "Map<${1:String}, ${2:Integer}> ${3:map} = new LinkedHashMap<>();", 'LinkedHashMap (insertion order)'),
    makeSnippet(monaco, 'hashset', "Set<${1:Integer}> ${2:set} = new HashSet<>();", 'HashSet declaration'),
    makeSnippet(monaco, 'treeset', "Set<${1:Integer}> ${2:set} = new TreeSet<>();", 'TreeSet (sorted set)'),
    makeSnippet(monaco, 'arraylist', "List<${1:Integer}> ${2:list} = new ArrayList<>();", 'ArrayList declaration'),
    makeSnippet(monaco, 'linkedlist', "LinkedList<${1:Integer}> ${2:list} = new LinkedList<>();", 'LinkedList (also a deque)'),
    makeSnippet(monaco, 'pqueue_min', "PriorityQueue<${1:Integer}> ${2:pq} = new PriorityQueue<>();", 'Min-heap PriorityQueue'),
    makeSnippet(monaco, 'pqueue_max', "PriorityQueue<${1:Integer}> ${2:pq} = new PriorityQueue<>(Collections.reverseOrder());", 'Max-heap PriorityQueue'),
    makeSnippet(monaco, 'deque_java', "Deque<${1:Integer}> ${2:dq} = new ArrayDeque<>();", 'ArrayDeque (stack/queue)'),
    makeSnippet(monaco, 'stack_java', "Deque<${1:Integer}> ${2:stack} = new ArrayDeque<>();\n${2:stack}.push(${3:val});\n${2:stack}.pop();", 'Stack using ArrayDeque'),
    makeSnippet(monaco, 'bsearch_java',
      "int lo = 0, hi = ${1:arr}.length - 1;\nwhile (lo <= hi) {\n    int mid = lo + (hi - lo) / 2;\n    if (${1:arr}[mid] == ${2:target}) return mid;\n    else if (${1:arr}[mid] < ${2:target}) lo = mid + 1;\n    else hi = mid - 1;\n}\nreturn -1;",
      'Binary search template'),
    makeSnippet(monaco, 'sortlambda', "Arrays.sort(${1:arr}, (a, b) -> ${2:a - b});", 'Array sort with comparator'),
    makeSnippet(monaco, 'collections_sort', "Collections.sort(${1:list}, (a, b) -> ${2:a - b});", 'List sort with comparator'),
    makeSnippet(monaco, 'twopointers_java',
      "int left = 0, right = ${1:arr}.length - 1;\nwhile (left < right) {\n    ${2:// your logic}\n    left++;\n    right--;\n}",
      'Two-pointer template'),
    makeSnippet(monaco, 'sliding_window_java',
      "int left = 0;\nfor (int right = 0; right < ${1:arr}.length; right++) {\n    ${2:// expand window}\n    while (${3:condition}) {\n        ${4:// shrink window}\n        left++;\n    }\n    ${5:// track answer}\n}",
      'Sliding window pattern'),
    makeSnippet(monaco, 'bfs_java',
      "Queue<${1:Integer}> queue = new LinkedList<>();\nSet<${1:Integer}> visited = new HashSet<>();\nqueue.offer(${2:start});\nvisited.add(${2:start});\nwhile (!queue.isEmpty()) {\n    ${1:Integer} node = queue.poll();\n    for (${1:Integer} neighbor : graph.getOrDefault(node, new ArrayList<>())) {\n        if (!visited.contains(neighbor)) {\n            visited.add(neighbor);\n            queue.offer(neighbor);\n        }\n    }\n}",
      'BFS template'),
    makeSnippet(monaco, 'dp_array', "int[] dp = new int[${1:n} + 1];\nArrays.fill(dp, ${2:0});\ndp[0] = ${3:1};", 'DP array initialization'),
    makeSnippet(monaco, 'dp_2d', "int[][] dp = new int[${1:m}][${2:n}];\nfor (int[] row : dp) Arrays.fill(row, ${3:0});", '2D DP array initialization'),
    makeSnippet(monaco, 'string_builder', "StringBuilder ${1:sb} = new StringBuilder();\n${1:sb}.append(${2:str});\nString ${3:result} = ${1:sb}.toString();", 'StringBuilder pattern'),
    makeSnippet(monaco, 'char_freq', "int[] ${1:freq} = new int[26];\nfor (char c : ${2:s}.toCharArray()) ${1:freq}[c - 'a']++;", 'Character frequency array'),
    makeSnippet(monaco, 'intmax', "Integer.MAX_VALUE", 'Integer maximum value'),
    makeSnippet(monaco, 'intmin', "Integer.MIN_VALUE", 'Integer minimum value'),
    makeSnippet(monaco, 'class_java',
      "class ${1:ClassName} {\n    ${2:// fields}\n\n    public ${1:ClassName}(${3:args}) {\n        ${4:// constructor}\n    }\n}",
      'Class definition'),
    makeSnippet(monaco, 'union_find_java',
      "int[] parent, rank;\nvoid init(int n) {\n    parent = new int[n];\n    rank = new int[n];\n    for (int i = 0; i < n; i++) parent[i] = i;\n}\nint find(int x) {\n    if (parent[x] != x) parent[x] = find(parent[x]);\n    return parent[x];\n}\nboolean union(int x, int y) {\n    int px = find(x), py = find(y);\n    if (px == py) return false;\n    if (rank[px] < rank[py]) { int t = px; px = py; py = t; }\n    parent[py] = px;\n    if (rank[px] == rank[py]) rank[px]++;\n    return true;\n}",
      'Union-Find (DSU)'),
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// C++
// ─────────────────────────────────────────────────────────────────────────────
function getCppCompletions(monaco: Monaco) {
  return [
    makeSnippet(monaco, 'includes',
      "#include <bits/stdc++.h>\nusing namespace std;",
      'Competitive programming includes'),
    makeSnippet(monaco, 'unordered_map', "unordered_map<${1:string}, ${2:int}> ${3:mp};", 'Unordered map (hash map)'),
    makeSnippet(monaco, 'map_cpp', "map<${1:string}, ${2:int}> ${3:mp};", 'Ordered map'),
    makeSnippet(monaco, 'unordered_set', "unordered_set<${1:int}> ${2:st};", 'Unordered set (hash set)'),
    makeSnippet(monaco, 'set_cpp', "set<${1:int}> ${2:st};", 'Ordered set'),
    makeSnippet(monaco, 'vector', "vector<${1:int}> ${2:v}(${3:n}, ${4:0});", 'Vector with initial size'),
    makeSnippet(monaco, 'pq_max', "priority_queue<${1:int}> ${2:pq};", 'Max-heap priority queue'),
    makeSnippet(monaco, 'pq_min', "priority_queue<${1:int}, vector<${1:int}>, greater<${1:int}>> ${2:pq};", 'Min-heap priority queue'),
    makeSnippet(monaco, 'deque_cpp', "deque<${1:int}> ${2:dq};", 'Deque'),
    makeSnippet(monaco, 'stack_cpp', "stack<${1:int}> ${2:st};\n${2:st}.push(${3:val});\n${2:st}.top();\n${2:st}.pop();", 'Stack operations'),
    makeSnippet(monaco, 'queue_cpp', "queue<${1:int}> ${2:q};\n${2:q}.push(${3:val});\n${2:q}.front();\n${2:q}.pop();", 'Queue operations'),
    makeSnippet(monaco, 'bsearch_cpp',
      "int lo = 0, hi = (int)${1:v}.size() - 1;\nwhile (lo <= hi) {\n    int mid = lo + (hi - lo) / 2;\n    if (${1:v}[mid] == ${2:target}) return mid;\n    else if (${1:v}[mid] < ${2:target}) lo = mid + 1;\n    else hi = mid - 1;\n}\nreturn -1;",
      'Binary search template'),
    makeSnippet(monaco, 'lower_bound', "auto it = lower_bound(${1:v}.begin(), ${1:v}.end(), ${2:val});", 'lower_bound (first >= val)'),
    makeSnippet(monaco, 'upper_bound', "auto it = upper_bound(${1:v}.begin(), ${1:v}.end(), ${2:val});", 'upper_bound (first > val)'),
    makeSnippet(monaco, 'sort_cpp', "sort(${1:v}.begin(), ${1:v}.end());", 'Sort ascending'),
    makeSnippet(monaco, 'sort_desc', "sort(${1:v}.begin(), ${1:v}.end(), greater<${2:int}>());", 'Sort descending'),
    makeSnippet(monaco, 'lambda_sort', "sort(${1:v}.begin(), ${1:v}.end(), [](const ${2:auto}& a, const ${2:auto}& b) {\n    return ${3:a < b};\n});", 'Sort with lambda comparator'),
    makeSnippet(monaco, 'twopointers_cpp',
      "int left = 0, right = (int)${1:v}.size() - 1;\nwhile (left < right) {\n    ${2:// your logic}\n    left++; right--;\n}",
      'Two-pointer template'),
    makeSnippet(monaco, 'sliding_window_cpp',
      "int left = 0;\nfor (int right = 0; right < (int)${1:v}.size(); right++) {\n    ${2:// expand}\n    while (${3:condition}) {\n        ${4:// shrink}\n        left++;\n    }\n    ${5:// track answer}\n}",
      'Sliding window pattern'),
    makeSnippet(monaco, 'bfs_cpp',
      "queue<int> bfsQ;\nunordered_set<int> visited;\nbfsQ.push(${1:start});\nvisited.insert(${1:start});\nwhile (!bfsQ.empty()) {\n    int node = bfsQ.front(); bfsQ.pop();\n    for (int neighbor : graph[node]) {\n        if (!visited.count(neighbor)) {\n            visited.insert(neighbor);\n            bfsQ.push(neighbor);\n        }\n    }\n}",
      'BFS template'),
    makeSnippet(monaco, 'dp_cpp', "vector<${1:int}> dp(${2:n} + 1, ${3:0});\ndp[0] = ${4:1};", 'DP vector init'),
    makeSnippet(monaco, 'dp_2d_cpp', "vector<vector<${1:int}>> dp(${2:m}, vector<${1:int}>(${3:n}, ${4:0}));", '2D DP init'),
    makeSnippet(monaco, 'auto_loop', "for (auto& ${1:x} : ${2:container}) {\n    ${3:// body}\n}", 'Range-based for loop'),
    makeSnippet(monaco, 'union_find_cpp',
      "vector<int> parent, rnk;\nvoid init(int n) {\n    parent.resize(n); rnk.assign(n, 0);\n    iota(parent.begin(), parent.end(), 0);\n}\nint find(int x) {\n    return parent[x] == x ? x : parent[x] = find(parent[x]);\n}\nbool unite(int x, int y) {\n    x = find(x); y = find(y);\n    if (x == y) return false;\n    if (rnk[x] < rnk[y]) swap(x, y);\n    parent[y] = x;\n    if (rnk[x] == rnk[y]) rnk[x]++;\n    return true;\n}",
      'Union-Find (DSU)'),
    makeSnippet(monaco, 'inf_cpp', "const int INF = 1e9;", 'Large constant (infinity)'),
    makeSnippet(monaco, 'main_cpp',
      "int main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    ${1:// your code}\n    return 0;\n}",
      'Main with fast I/O'),
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// JAVASCRIPT / TYPESCRIPT  (shared)
// ─────────────────────────────────────────────────────────────────────────────
function getJsCompletions(monaco: Monaco) {
  return [
    makeSnippet(monaco, 'map_js', "const ${1:map} = new Map();", 'Map declaration'),
    makeSnippet(monaco, 'set_js', "const ${1:set} = new Set();", 'Set declaration'),
    makeSnippet(monaco, 'bsearch_js',
      "function binarySearch(arr, target) {\n    let lo = 0, hi = arr.length - 1;\n    while (lo <= hi) {\n        const mid = (lo + hi) >> 1;\n        if (arr[mid] === target) return mid;\n        else if (arr[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}",
      'Binary search'),
    makeSnippet(monaco, 'twopointers_js',
      "let left = 0, right = ${1:arr}.length - 1;\nwhile (left < right) {\n    ${2:// your logic}\n    left++; right--;\n}",
      'Two-pointer template'),
    makeSnippet(monaco, 'sliding_window_js',
      "let left = 0;\nfor (let right = 0; right < ${1:arr}.length; right++) {\n    ${2:// expand}\n    while (${3:condition}) {\n        ${4:// shrink}\n        left++;\n    }\n    ${5:// track answer}\n}",
      'Sliding window'),
    makeSnippet(monaco, 'bfs_js',
      "const queue = [${1:start}];\nconst visited = new Set([${1:start}]);\nwhile (queue.length) {\n    const node = queue.shift();\n    for (const neighbor of (graph.get(node) || [])) {\n        if (!visited.has(neighbor)) {\n            visited.add(neighbor);\n            queue.push(neighbor);\n        }\n    }\n}",
      'BFS template'),
    makeSnippet(monaco, 'dp_js', "const dp = new Array(${1:n} + 1).fill(${2:0});\ndp[0] = ${3:1};", 'DP array init'),
    makeSnippet(monaco, 'dp_2d_js', "const dp = Array.from({ length: ${1:m} }, () => new Array(${2:n}).fill(${3:0}));", '2D DP init'),
    makeSnippet(monaco, 'sort_num', "${1:arr}.sort((a, b) => a - b);", 'Sort numbers ascending'),
    makeSnippet(monaco, 'sort_desc', "${1:arr}.sort((a, b) => b - a);", 'Sort numbers descending'),
    makeSnippet(monaco, 'reduce', "${1:arr}.reduce((${2:acc}, ${3:cur}) => ${4:acc + cur}, ${5:0})", 'Array reduce'),
    makeSnippet(monaco, 'flatmap', "${1:arr}.flatMap(${2:x} => ${3:[x]})", 'FlatMap'),
    makeSnippet(monaco, 'union_find_js',
      "const parent = Array.from({ length: ${1:n} }, (_, i) => i);\nconst rank = new Array(${1:n}).fill(0);\nfunction find(x) {\n    if (parent[x] !== x) parent[x] = find(parent[x]);\n    return parent[x];\n}\nfunction union(x, y) {\n    const [px, py] = [find(x), find(y)];\n    if (px === py) return false;\n    if (rank[px] < rank[py]) [parent[px], parent[py]] = [parent[py], parent[px]];\n    parent[py] = px;\n    if (rank[px] === rank[py]) rank[px]++;\n    return true;\n}",
      'Union-Find (DSU)'),
    makeSnippet(monaco, 'arrowfn', "const ${1:name} = (${2:args}) => {\n    ${3:// body}\n};", 'Arrow function'),
    makeSnippet(monaco, 'asyncfn', "const ${1:name} = async (${2:args}) => {\n    ${3:// body}\n};", 'Async arrow function'),
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// GO
// ─────────────────────────────────────────────────────────────────────────────
function getGoCompletions(monaco: Monaco) {
  return [
    makeSnippet(monaco, 'mapgo', "${1:m} := make(map[${2:string}]${3:int})", 'Map declaration'),
    makeSnippet(monaco, 'slicego', "${1:s} := make([]${2:int}, ${3:n})", 'Slice with make'),
    makeSnippet(monaco, 'appendgo', "${1:s} = append(${1:s}, ${2:val})", 'Append to slice'),
    makeSnippet(monaco, 'sortgo', "sort.Slice(${1:s}, func(i, j int) bool {\n    return ${1:s}[i] < ${1:s}[j]\n})", 'Sort slice with comparator'),
    makeSnippet(monaco, 'sortints', "sort.Ints(${1:s})", 'Sort []int ascending'),
    makeSnippet(monaco, 'bsearch_go',
      "lo, hi := 0, len(${1:arr})-1\nfor lo <= hi {\n    mid := lo + (hi-lo)/2\n    if ${1:arr}[mid] == ${2:target} {\n        return mid\n    } else if ${1:arr}[mid] < ${2:target} {\n        lo = mid + 1\n    } else {\n        hi = mid - 1\n    }\n}\nreturn -1",
      'Binary search'),
    makeSnippet(monaco, 'twopointers_go',
      "left, right := 0, len(${1:arr})-1\nfor left < right {\n    ${2:// your logic}\n    left++\n    right--\n}",
      'Two-pointer'),
    makeSnippet(monaco, 'bfs_go',
      "queue := []${1:int}{${2:start}}\nvisited := map[${1:int}]bool{${2:start}: true}\nfor len(queue) > 0 {\n    node := queue[0]\n    queue = queue[1:]\n    for _, neighbor := range graph[node] {\n        if !visited[neighbor] {\n            visited[neighbor] = true\n            queue = append(queue, neighbor)\n        }\n    }\n}",
      'BFS template'),
    makeSnippet(monaco, 'dp_go', "${1:dp} := make([]int, ${2:n}+1)\n${1:dp}[0] = ${3:1}", 'DP slice init'),
    makeSnippet(monaco, 'funcgo', "func ${1:name}(${2:args}) ${3:int} {\n    ${4:return 0}\n}", 'Function definition'),
    makeSnippet(monaco, 'errcheck', "if err != nil {\n    return ${1:nil, err}\n}", 'Error check pattern'),
    makeSnippet(monaco, 'goroutine', "go func() {\n    ${1:// goroutine body}\n}()", 'Goroutine'),
    makeSnippet(monaco, 'channel', "${1:ch} := make(chan ${2:int}, ${3:10})", 'Channel declaration'),
    makeSnippet(monaco, 'union_find_go',
      "parent := make([]int, ${1:n})\nfor i := range parent { parent[i] = i }\nrank := make([]int, ${1:n})\nvar find func(int) int\nfind = func(x int) int {\n    if parent[x] != x { parent[x] = find(parent[x]) }\n    return parent[x]\n}\nunion := func(x, y int) bool {\n    px, py := find(x), find(y)\n    if px == py { return false }\n    if rank[px] < rank[py] { px, py = py, px }\n    parent[py] = px\n    if rank[px] == rank[py] { rank[px]++ }\n    return true\n}",
      'Union-Find (DSU)'),
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// RUST
// ─────────────────────────────────────────────────────────────────────────────
function getRustCompletions(monaco: Monaco) {
  return [
    makeSnippet(monaco, 'hashmap_rust', "use std::collections::HashMap;\nlet mut ${1:map}: HashMap<${2:String}, ${3:i32}> = HashMap::new();", 'HashMap'),
    makeSnippet(monaco, 'hashset_rust', "use std::collections::HashSet;\nlet mut ${1:set}: HashSet<${2:i32}> = HashSet::new();", 'HashSet'),
    makeSnippet(monaco, 'vecdeque', "use std::collections::VecDeque;\nlet mut ${1:dq}: VecDeque<${2:i32}> = VecDeque::new();", 'VecDeque (deque)'),
    makeSnippet(monaco, 'bheap_max', "use std::collections::BinaryHeap;\nlet mut ${1:heap}: BinaryHeap<${2:i32}> = BinaryHeap::new();", 'BinaryHeap (max-heap)'),
    makeSnippet(monaco, 'bheap_min', "use std::collections::BinaryHeap;\nuse std::cmp::Reverse;\nlet mut ${1:heap}: BinaryHeap<Reverse<${2:i32}>> = BinaryHeap::new();\n${1:heap}.push(Reverse(${3:val}));", 'BinaryHeap (min-heap via Reverse)'),
    makeSnippet(monaco, 'vec_rust', "let mut ${1:v}: Vec<${2:i32}> = Vec::new();", 'Vec declaration'),
    makeSnippet(monaco, 'vec_init', "let ${1:v}: Vec<${2:i32}> = vec![${3:0}; ${4:n}];", 'Vec initialized with value'),
    makeSnippet(monaco, 'bsearch_rust',
      "let mut lo = 0i32;\nlet mut hi = ${1:arr}.len() as i32 - 1;\nwhile lo <= hi {\n    let mid = lo + (hi - lo) / 2;\n    if ${1:arr}[mid as usize] == ${2:target} {\n        return Some(mid as usize);\n    } else if ${1:arr}[mid as usize] < ${2:target} {\n        lo = mid + 1;\n    } else {\n        hi = mid - 1;\n    }\n}\nNone",
      'Binary search'),
    makeSnippet(monaco, 'sort_rust', "${1:v}.sort();", 'Sort vec'),
    makeSnippet(monaco, 'sort_by_rust', "${1:v}.sort_by(|a, b| ${2:a.cmp(b)});", 'Sort with comparator'),
    makeSnippet(monaco, 'iter_rust', "${1:v}.iter().${2:map(|x| x).collect::<Vec<_>>()}", 'Iterator chain'),
    makeSnippet(monaco, 'closure_rust', "|${1:x}| ${2:x * 2}", 'Closure'),
    makeSnippet(monaco, 'struct_rust', "struct ${1:Name} {\n    ${2:field}: ${3:i32},\n}\n\nimpl ${1:Name} {\n    fn new(${2:field}: ${3:i32}) -> Self {\n        Self { ${2:field} }\n    }\n}", 'Struct with impl'),
    makeSnippet(monaco, 'enum_rust', "enum ${1:Name} {\n    ${2:Variant1},\n    ${3:Variant2}(${4:i32}),\n}", 'Enum definition'),
    makeSnippet(monaco, 'match_rust', "match ${1:expr} {\n    ${2:pattern} => ${3:result},\n    _ => ${4:default},\n}", 'Match expression'),
    makeSnippet(monaco, 'if_let', "if let ${1:Some(val)} = ${2:option} {\n    ${3:// use val}\n}", 'if let pattern'),
    makeSnippet(monaco, 'result_rust', "fn ${1:name}(${2:args}) -> Result<${3:i32}, ${4:String}> {\n    ${5:Ok(0)}\n}", 'Function returning Result'),
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// KOTLIN
// ─────────────────────────────────────────────────────────────────────────────
function getKotlinCompletions(monaco: Monaco) {
  return [
    makeSnippet(monaco, 'hashmap_kt', "val ${1:map} = HashMap<${2:String}, ${3:Int}>()", 'HashMap'),
    makeSnippet(monaco, 'mutablemap', "val ${1:map} = mutableMapOf<${2:String}, ${3:Int}>()", 'MutableMap'),
    makeSnippet(monaco, 'hashset_kt', "val ${1:set} = HashSet<${2:Int}>()", 'HashSet'),
    makeSnippet(monaco, 'pq_kt', "val ${1:pq} = PriorityQueue<${2:Int}>()", 'PriorityQueue (min-heap)'),
    makeSnippet(monaco, 'pq_max_kt', "val ${1:pq} = PriorityQueue<${2:Int}>(compareByDescending { it })", 'PriorityQueue (max-heap)'),
    makeSnippet(monaco, 'list_kt', "val ${1:list} = mutableListOf<${2:Int}>()", 'MutableList'),
    makeSnippet(monaco, 'deque_kt', "val ${1:dq} = ArrayDeque<${2:Int}>()", 'ArrayDeque'),
    makeSnippet(monaco, 'bsearch_kt',
      "var lo = 0; var hi = ${1:arr}.size - 1\nwhile (lo <= hi) {\n    val mid = lo + (hi - lo) / 2\n    when {\n        ${1:arr}[mid] == ${2:target} -> return mid\n        ${1:arr}[mid] < ${2:target} -> lo = mid + 1\n        else -> hi = mid - 1\n    }\n}\nreturn -1",
      'Binary search'),
    makeSnippet(monaco, 'sortedby_kt', "${1:list}.sortedBy { ${2:it} }", 'Sort by key'),
    makeSnippet(monaco, 'twopointers_kt',
      "var left = 0; var right = ${1:arr}.size - 1\nwhile (left < right) {\n    ${2:// logic}\n    left++; right--\n}",
      'Two-pointer'),
    makeSnippet(monaco, 'funckt', "fun ${1:name}(${2:args}): ${3:Int} {\n    ${4:return 0}\n}", 'Function definition'),
    makeSnippet(monaco, 'data_class', "data class ${1:Name}(val ${2:field}: ${3:Int})", 'Data class'),
    makeSnippet(monaco, 'when_kt', "when (${1:expr}) {\n    ${2:value} -> ${3:result}\n    else -> ${4:default}\n}", 'When expression'),
    makeSnippet(monaco, 'let_kt', "${1:nullable}?.let { ${2:// use it} }", 'Safe let call'),
    makeSnippet(monaco, 'repeat_kt', "repeat(${1:n}) {\n    ${2:// body}\n}", 'Repeat n times'),
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// SWIFT
// ─────────────────────────────────────────────────────────────────────────────
function getSwiftCompletions(monaco: Monaco) {
  return [
    makeSnippet(monaco, 'dict_swift', "var ${1:dict}: [${2:String}: ${3:Int}] = [:]", 'Dictionary'),
    makeSnippet(monaco, 'set_swift', "var ${1:set}: Set<${2:Int}> = []", 'Set'),
    makeSnippet(monaco, 'array_swift', "var ${1:arr}: [${2:Int}] = Array(repeating: ${3:0}, count: ${4:n})", 'Array init'),
    makeSnippet(monaco, 'bsearch_swift',
      "var lo = 0, hi = ${1:arr}.count - 1\nwhile lo <= hi {\n    let mid = lo + (hi - lo) / 2\n    if ${1:arr}[mid] == ${2:target} { return mid }\n    else if ${1:arr}[mid] < ${2:target} { lo = mid + 1 }\n    else { hi = mid - 1 }\n}\nreturn -1",
      'Binary search'),
    makeSnippet(monaco, 'sorted_swift', "${1:arr}.sorted { ${2:$0 < $1} }", 'Sorted with closure'),
    makeSnippet(monaco, 'filter_swift', "${1:arr}.filter { ${2:$0 > 0} }", 'Filter array'),
    makeSnippet(monaco, 'map_swift', "${1:arr}.map { ${2:$0 * 2} }", 'Map array'),
    makeSnippet(monaco, 'reduce_swift', "${1:arr}.reduce(${2:0}) { ${3:$0 + $1} }", 'Reduce array'),
    makeSnippet(monaco, 'guard_swift', "guard let ${1:val} = ${2:optional} else { return ${3:} }", 'Guard let'),
    makeSnippet(monaco, 'struct_swift', "struct ${1:Name} {\n    var ${2:field}: ${3:Int}\n}", 'Struct definition'),
    makeSnippet(monaco, 'func_swift', "func ${1:name}(${2:_ arg}: ${3:Int}) -> ${4:Int} {\n    ${5:return 0}\n}", 'Function definition'),
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// RUBY
// ─────────────────────────────────────────────────────────────────────────────
function getRubyCompletions(monaco: Monaco) {
  return [
    makeSnippet(monaco, 'hash_ruby', "${1:h} = Hash.new(${2:0})", 'Hash with default value'),
    makeSnippet(monaco, 'set_ruby', "require 'set'\n${1:s} = Set.new", 'Set declaration'),
    makeSnippet(monaco, 'bsearch_ruby', "${1:idx} = ${2:arr}.bsearch_index { |x| x >= ${3:target} }", 'Binary search'),
    makeSnippet(monaco, 'sort_ruby', "${1:arr}.sort { |a, b| ${2:a <=> b} }", 'Sort with block'),
    makeSnippet(monaco, 'map_ruby', "${1:arr}.map { |${2:x}| ${3:x * 2} }", 'Map'),
    makeSnippet(monaco, 'select_ruby', "${1:arr}.select { |${2:x}| ${3:x > 0} }", 'Select (filter)'),
    makeSnippet(monaco, 'reduce_ruby', "${1:arr}.reduce(${2:0}) { |${3:acc}, ${4:x}| ${3:acc} + ${4:x} }", 'Reduce'),
    makeSnippet(monaco, 'times_ruby', "${1:n}.times do |${2:i}|\n  ${3:# body}\nend", 'Times loop'),
    makeSnippet(monaco, 'funcdef_ruby', "def ${1:name}(${2:args})\n  ${3:nil}\nend", 'Method definition'),
    makeSnippet(monaco, 'class_ruby', "class ${1:Name}\n  def initialize(${2:args})\n    ${3:# body}\n  end\nend", 'Class definition'),
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// PHP
// ─────────────────────────────────────────────────────────────────────────────
function getPhpCompletions(monaco: Monaco) {
  return [
    makeSnippet(monaco, 'array_php', "$${1:arr} = [];", 'Array declaration'),
    makeSnippet(monaco, 'assoc_php', "$${1:map} = ['${2:key}' => ${3:value}];", 'Associative array'),
    makeSnippet(monaco, 'sort_php', "sort($${1:arr});", 'Sort array'),
    makeSnippet(monaco, 'usort_php', "usort($${1:arr}, function($a, $b) {\n    return ${2:$a - $b};\n});", 'Custom sort'),
    makeSnippet(monaco, 'array_map_php', "$${1:result} = array_map(fn($${2:x}) => ${3:$x}, $${4:arr});", 'Array map'),
    makeSnippet(monaco, 'array_filter_php', "$${1:result} = array_filter($${2:arr}, fn($${3:x}) => ${4:$x > 0});", 'Array filter'),
    makeSnippet(monaco, 'array_reduce_php', "$${1:result} = array_reduce($${2:arr}, fn($${3:acc}, $${4:x}) => $${3:acc} + $${4:x}, ${5:0});", 'Array reduce'),
    makeSnippet(monaco, 'funcdef_php', "function ${1:name}(${2:args}): ${3:int} {\n    ${4:return 0;}\n}", 'Function definition'),
    makeSnippet(monaco, 'class_php', "class ${1:Name} {\n    public function __construct(${2:args}) {\n        ${3:// body}\n    }\n}", 'Class definition'),
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// DART
// ─────────────────────────────────────────────────────────────────────────────
function getDartCompletions(monaco: Monaco) {
  return [
    makeSnippet(monaco, 'map_dart', "Map<${1:String}, ${2:int}> ${3:map} = {};", 'Map declaration'),
    makeSnippet(monaco, 'set_dart', "Set<${1:int}> ${2:set} = {};", 'Set declaration'),
    makeSnippet(monaco, 'list_dart', "List<${1:int}> ${2:list} = List.filled(${3:n}, ${4:0});", 'List filled'),
    makeSnippet(monaco, 'sort_dart', "${1:list}.sort((a, b) => ${2:a.compareTo(b)});", 'Sort list'),
    makeSnippet(monaco, 'bsearch_dart',
      "int lo = 0, hi = ${1:list}.length - 1;\nwhile (lo <= hi) {\n  final mid = lo + (hi - lo) ~/ 2;\n  if (${1:list}[mid] == ${2:target}) return mid;\n  else if (${1:list}[mid] < ${2:target}) lo = mid + 1;\n  else hi = mid - 1;\n}\nreturn -1;",
      'Binary search'),
    makeSnippet(monaco, 'funcdef_dart', "${1:int} ${2:name}(${3:args}) {\n  ${4:return 0;}\n}", 'Function definition'),
    makeSnippet(monaco, 'class_dart', "class ${1:Name} {\n  ${1:Name}(${2:this.field});\n  final ${3:int} ${2:field};\n}", 'Class definition'),
    makeSnippet(monaco, 'where_dart', "${1:list}.where((${2:x}) => ${3:x > 0}).toList()", 'Filter (where)'),
    makeSnippet(monaco, 'map_op_dart', "${1:list}.map((${2:x}) => ${3:x * 2}).toList()", 'Map operation'),
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// SCALA
// ─────────────────────────────────────────────────────────────────────────────
function getScalaCompletions(monaco: Monaco) {
  return [
    makeSnippet(monaco, 'map_scala', "val ${1:map} = scala.collection.mutable.HashMap[${2:String}, ${3:Int}]()", 'Mutable HashMap'),
    makeSnippet(monaco, 'set_scala', "val ${1:set} = scala.collection.mutable.HashSet[${2:Int}]()", 'Mutable HashSet'),
    makeSnippet(monaco, 'list_scala', "val ${1:list} = List(${2:1, 2, 3})", 'List literal'),
    makeSnippet(monaco, 'sortby_scala', "${1:list}.sortBy(${2:identity})", 'Sort by key'),
    makeSnippet(monaco, 'sortWith_scala', "${1:list}.sortWith(_ < _)", 'Sort with comparator'),
    makeSnippet(monaco, 'bsearch_scala',
      "var lo = 0; var hi = ${1:arr}.length - 1\nwhile (lo <= hi) {\n  val mid = lo + (hi - lo) / 2\n  if (${1:arr}(mid) == ${2:target}) return mid\n  else if (${1:arr}(mid) < ${2:target}) lo = mid + 1\n  else hi = mid - 1\n}\n-1",
      'Binary search'),
    makeSnippet(monaco, 'case_class', "case class ${1:Name}(${2:field}: ${3:Int})", 'Case class'),
    makeSnippet(monaco, 'object_scala', "object ${1:Name} {\n  def ${2:method}(${3:args}): ${4:Int} = ${5:0}\n}", 'Companion object'),
    makeSnippet(monaco, 'match_scala', "${1:expr} match {\n  case ${2:pattern} => ${3:result}\n  case _ => ${4:default}\n}", 'Match expression'),
    makeSnippet(monaco, 'for_comp', "for {\n  ${1:x} <- ${2:list}\n  if ${3:condition}\n} yield ${4:x}", 'For comprehension'),
    makeSnippet(monaco, 'foldleft', "${1:list}.foldLeft(${2:0})((${3:acc}, ${4:x}) => ${3:acc} + ${4:x})", 'FoldLeft'),
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Disposes all previously registered completion providers for a given language.
 */
function disposeProviders(languageId: string) {
  if (disposables[languageId]) {
    disposables[languageId].forEach((d) => d.dispose());
    disposables[languageId] = [];
  }
}

/**
 * Registers completion providers for the given Monaco language ID.
 * Call this inside `onMount` whenever the language or code completion
 * setting changes. Previously registered providers are automatically disposed.
 *
 * @param monaco  The monaco namespace (second arg from `onMount`)
 * @param languageId  `language.monacoId` from the Language object
 * @param enabled  Whether code completion is currently enabled
 */
export function registerCompletionProviders(
  monaco: Monaco,
  languageId: string,
  enabled: boolean,
) {
  // Always dispose previous providers for this language first
  disposeProviders(languageId);

  if (!enabled) return;

  let snippets: any[] = [];

  switch (languageId) {
    case 'python':
      snippets = getPythonCompletions(monaco);
      break;
    case 'java':
      snippets = getJavaCompletions(monaco);
      break;
    case 'cpp':
    case 'c':
      snippets = getCppCompletions(monaco);
      break;
    case 'javascript':
      snippets = getJsCompletions(monaco);
      break;
    case 'typescript':
      snippets = getJsCompletions(monaco);
      break;
    case 'go':
      snippets = getGoCompletions(monaco);
      break;
    case 'rust':
      snippets = getRustCompletions(monaco);
      break;
    case 'kotlin':
      snippets = getKotlinCompletions(monaco);
      break;
    case 'swift':
      snippets = getSwiftCompletions(monaco);
      break;
    case 'ruby':
      snippets = getRubyCompletions(monaco);
      break;
    case 'php':
      snippets = getPhpCompletions(monaco);
      break;
    case 'dart':
      snippets = getDartCompletions(monaco);
      break;
    case 'scala':
      snippets = getScalaCompletions(monaco);
      break;
    default:
      return; // No custom completions for this language
  }

  if (snippets.length === 0) return;

  const disposable = monaco.languages.registerCompletionItemProvider(languageId, {
    provideCompletionItems: (model: any, position: any) => {
      // Determine the range to replace (the current word)
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      return {
        suggestions: snippets.map((s) => ({ ...s, range })),
      };
    },
  });

  if (!disposables[languageId]) {
    disposables[languageId] = [];
  }
  disposables[languageId].push(disposable);
}

/**
 * Disposes ALL registered completion providers across all languages.
 * Call this on component unmount.
 */
export function disposeAllCompletionProviders() {
  Object.keys(disposables).forEach(disposeProviders);
}
