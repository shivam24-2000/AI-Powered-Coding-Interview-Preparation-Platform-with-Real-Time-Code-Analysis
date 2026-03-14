// Returns full, executable code = user solution + test harness
type Wrapper = (userCode: string) => string;

// ─── GENERIC HARNESS BUILDERS ────────────────────────────────────────────────

function pyHarness(method: string, cases: string, cmp: string): Wrapper {
  return (code: string) => `${code}

def _test():
    sol = Solution()
    cases = ${cases}
    p = 0
    for i,(args,exp) in enumerate(cases,1):
        try:
            got = sol.${method}(*args)
            ok = ${cmp}
            print(f"Test {i}: {'\\u2713 PASS' if ok else '\\u2717 FAIL'}")
            if not ok: print(f"  Expected: {exp}\\n  Got:      {got}")
            else: p+=1
        except Exception as e:
            print(f"Test {i}: \\u2717 ERROR - {e}")
    print(f"\\n{p}/{len(cases)} tests passed")
_test()`;
}

function jsHarness(call: string, cases: string, cmp: string): Wrapper {
  return (code: string) => `${code}
;(function(){
  const cases=${cases};
  let p=0;
  cases.forEach(function(tc,i){
    try{
      const a=tc.a,e=tc.e;
      const got=${call};
      const ok=${cmp};
      console.log("Test "+(i+1)+": "+(ok?"\\u2713 PASS":"\\u2717 FAIL"));
      if(!ok)console.log("  Expected: "+JSON.stringify(e)+"\\n  Got:      "+JSON.stringify(got));
      else p++;
    }catch(err){console.log("Test "+(i+1)+": \\u2717 ERROR - "+err.message);}
  });
  console.log("\\n"+p+"/"+cases.length+" tests passed");
})();`;
}

// ─── TWO SUM ─────────────────────────────────────────────────────────────────
const TS_CASES_JS = '[{a:[[2,7,11,15],9],e:[0,1]},{a:[[3,2,4],6],e:[1,2]},{a:[[3,3],6],e:[0,1]}]';
const TS_CMP_JS   = 'JSON.stringify([].concat(got).sort(function(x,y){return x-y}))===JSON.stringify([].concat(e).sort(function(x,y){return x-y}))';

const twoSumRunners: Record<string, Wrapper> = {
  python: pyHarness(
    'twoSum',
    '[([​[2,7,11,15], 9], [0,1]), ([​[3,2,4], 6], [1,2]), ([​[3,3], 6], [0,1])]'.replace(/​/g, ''),
    'sorted(got)==sorted(exp)'
  ),
  javascript: jsHarness('twoSum(a[0].slice(),a[1])', TS_CASES_JS, TS_CMP_JS),
  typescript: jsHarness('twoSum(a[0].slice(),a[1])', TS_CASES_JS, TS_CMP_JS),
  java: (code: string) => `${code}
class Main{
  static boolean eq(int[]a,int[]b){java.util.Arrays.sort(a);java.util.Arrays.sort(b);return java.util.Arrays.equals(a,b);}
  public static void main(String[]_){
    Solution s=new Solution();int p=0;boolean ok;
    ok=eq(s.twoSum(new int[]{2,7,11,15},9),new int[]{0,1});System.out.println("Test 1: "+(ok?"\\u2713 PASS":"\\u2717 FAIL"));if(ok)p++;
    ok=eq(s.twoSum(new int[]{3,2,4},6),new int[]{1,2});System.out.println("Test 2: "+(ok?"\\u2713 PASS":"\\u2717 FAIL"));if(ok)p++;
    ok=eq(s.twoSum(new int[]{3,3},6),new int[]{0,1});System.out.println("Test 3: "+(ok?"\\u2713 PASS":"\\u2717 FAIL"));if(ok)p++;
    System.out.println("\\n"+p+"/3 tests passed");}}`,
  cpp: (code: string) => `#include<bits/stdc++.h>
using namespace std;
${code}
int main(){
  Solution s;int p=0;
  auto eq=[](vector<int>a,vector<int>b){sort(a.begin(),a.end());sort(b.begin(),b.end());return a==b;};
  bool ok;
  ok=eq(s.twoSum({2,7,11,15},9),{0,1});cout<<"Test 1: "<<(ok?"\\u2713 PASS":"\\u2717 FAIL")<<"\\n";if(ok)p++;
  ok=eq(s.twoSum({3,2,4},6),{1,2});cout<<"Test 2: "<<(ok?"\\u2713 PASS":"\\u2717 FAIL")<<"\\n";if(ok)p++;
  ok=eq(s.twoSum({3,3},6),{0,1});cout<<"Test 3: "<<(ok?"\\u2713 PASS":"\\u2717 FAIL")<<"\\n";if(ok)p++;
  cout<<"\\n"<<p<<"/3 tests passed\\n";}`,
  go: (code: string) => `package main
import("fmt";"sort")
${code}
func intsEq(a,b[]int)bool{if len(a)!=len(b){return false};c:=make([]int,len(a));d:=make([]int,len(b));copy(c,a);copy(d,b);sort.Ints(c);sort.Ints(d);for i:=range c{if c[i]!=d[i]{return false}};return true}
func main(){
  p:=0
  type tc struct{a[]int;t int;e[]int}
  tests:=[]tc{{[]int{2,7,11,15},9,[]int{0,1}},{[]int{3,2,4},6,[]int{1,2}},{[]int{3,3},6,[]int{0,1}}}
  for i,tc:=range tests{got:=twoSum(append([]int{},tc.a...),tc.t);ok:=intsEq(got,tc.e);s:="\\u2717 FAIL";if ok{s="\\u2713 PASS";p++};fmt.Printf("Test %d: %s\\n",i+1,s)}
  fmt.Printf("\\n%d/3 tests passed\\n",p)}`,
  rust: (code: string) => `struct Solution;
${code}
fn main(){
  let tests:Vec<(Vec<i32>,i32,Vec<i32>)>=vec![(vec![2,7,11,15],9,vec![0,1]),(vec![3,2,4],6,vec![1,2]),(vec![3,3],6,vec![0,1])];
  let mut p=0;
  for(i,(nums,t,exp))in tests.iter().enumerate(){
    let mut got=Solution::two_sum(nums.clone(),*t);let mut ex=exp.clone();got.sort();ex.sort();
    let ok=got==ex;println!("Test {}: {}",i+1,if ok{"\\u2713 PASS"}else{"\\u2717 FAIL"});if ok{p+=1;}
  }
  println!("\\n{}/3 tests passed",p);}`,
};

// ─── VALID PARENTHESES ───────────────────────────────────────────────────────
const VP_CASES = '[{a:["()"],e:true},{a:["()[]{}"],e:true},{a:["(]"],e:false},{a:["{[]}"],e:true}]';
const validParensRunners: Record<string, Wrapper> = {
  python: pyHarness('isValid', '[((\"()\",), True),((\"()[]{}\",), True),((\"(]\",), False),((\"{ []}\",), True)]'.replace('{ []}', '{[]}'), 'got==exp'),
  javascript: jsHarness('isValid(a[0])', VP_CASES, 'got===e'),
  typescript: jsHarness('isValid(a[0])', VP_CASES, 'got===e'),
  java: (code: string) => `${code}
class Main{public static void main(String[]_){
  Solution s=new Solution();int p=0;boolean ok;
  ok=s.isValid("()");System.out.println("Test 1: "+(ok?"\\u2713 PASS":"\\u2717 FAIL"));if(ok)p++;
  ok=s.isValid("()[]{}");System.out.println("Test 2: "+(ok?"\\u2713 PASS":"\\u2717 FAIL"));if(ok)p++;
  ok=!s.isValid("(]");System.out.println("Test 3: "+(ok?"\\u2713 PASS":"\\u2717 FAIL"));if(ok)p++;
  ok=s.isValid("{[]}");System.out.println("Test 4: "+(ok?"\\u2713 PASS":"\\u2717 FAIL"));if(ok)p++;
  System.out.println("\\n"+p+"/4 tests passed");}}`,
  cpp: (code: string) => `#include<bits/stdc++.h>
using namespace std;
${code}
int main(){Solution s;int p=0;
  vector<pair<string,bool>>tests={{"()",true},{"()[]{}",true},{"(]",false},{"{[]}",true}};
  for(int i=0;i<(int)tests.size();i++){bool ok=s.isValid(tests[i].first)==tests[i].second;cout<<"Test "<<i+1<<": "<<(ok?"\\u2713 PASS":"\\u2717 FAIL")<<"\\n";if(ok)p++;}
  cout<<"\\n"<<p<<"/4 tests passed\\n";}`,
  go: (code: string) => `package main
import "fmt"
${code}
func main(){p:=0;type tc struct{s string;e bool};tests:=[]tc{{"()",true},{"()[]{}",true},{"(]",false},{"{[]}",true}};for i,tc:=range tests{ok:=isValid(tc.s)==tc.e;s:="\\u2717 FAIL";if ok{s="\\u2713 PASS";p++};fmt.Printf("Test %d: %s\\n",i+1,s)};fmt.Printf("\\n%d/4 tests passed\\n",p)}`,
  rust: (code: string) => `struct Solution;
${code}
fn main(){let tests=vec![("()",true),("()[]{}",true),("(]",false),("{[]}",true)];let mut p=0;for(i,(s,e))in tests.iter().enumerate(){let ok=Solution::is_valid(s.to_string())==*e;println!("Test {}: {}",i+1,if ok{"\\u2713 PASS"}else{"\\u2717 FAIL"});if ok{p+=1;}};println!("\\n{}/4 tests passed",p);}`,
};

// ─── BEST TIME TO BUY/SELL ───────────────────────────────────────────────────
const BT_CASES = '[{a:[[7,1,5,3,6,4]],e:5},{a:[[7,6,4,3,1]],e:0},{a:[[1,2]],e:1}]';
const btRunners: Record<string, Wrapper> = {
  python: pyHarness('maxProfit', '[(([7,1,5,3,6,4],), 5),(([7,6,4,3,1],), 0),(([1,2],), 1)]', 'got==exp'),
  javascript: jsHarness('maxProfit(a[0].slice())', BT_CASES, 'got===e'),
  typescript: jsHarness('maxProfit(a[0].slice())', BT_CASES, 'got===e'),
  java: (code: string) => `${code}
class Main{public static void main(String[]_){Solution s=new Solution();int p=0;int[][]ins={{7,1,5,3,6,4},{7,6,4,3,1},{1,2}};int[]exp={5,0,1};for(int i=0;i<3;i++){boolean ok=s.maxProfit(ins[i].clone())==exp[i];System.out.println("Test "+(i+1)+": "+(ok?"\\u2713 PASS":"\\u2717 FAIL"));if(ok)p++;}System.out.println("\\n"+p+"/3 tests passed");}}`,
  cpp: (code: string) => `#include<bits/stdc++.h>
using namespace std;
${code}
int main(){Solution s;int p=0;vector<pair<vector<int>,int>>tests={{{7,1,5,3,6,4},5},{{7,6,4,3,1},0},{{1,2},1}};for(int i=0;i<(int)tests.size();i++){bool ok=s.maxProfit(tests[i].first)==tests[i].second;cout<<"Test "<<i+1<<": "<<(ok?"\\u2713 PASS":"\\u2717 FAIL")<<"\\n";if(ok)p++;}cout<<"\\n"<<p<<"/3 tests passed\\n";}`,
  go: (code: string) => `package main
import "fmt"
${code}
func main(){p:=0;type tc struct{a[]int;e int};tests:=[]tc{{[]int{7,1,5,3,6,4},5},{[]int{7,6,4,3,1},0},{[]int{1,2},1}};for i,tc:=range tests{ok:=maxProfit(append([]int{},tc.a...))==tc.e;s:="\\u2717 FAIL";if ok{s="\\u2713 PASS";p++};fmt.Printf("Test %d: %s\\n",i+1,s)};fmt.Printf("\\n%d/3 tests passed\\n",p)}`,
  rust: (code: string) => `struct Solution;
${code}
fn main(){let tests=vec![(vec![7i32,1,5,3,6,4],5i32),(vec![7,6,4,3,1],0),(vec![1,2],1)];let mut p=0;for(i,(prices,e))in tests.iter().enumerate(){let ok=Solution::max_profit(prices.clone())==*e;println!("Test {}: {}",i+1,if ok{"\\u2713 PASS"}else{"\\u2717 FAIL"});if ok{p+=1;}};println!("\\n{}/3 tests passed",p);}`,
};

// ─── LONGEST SUBSTRING ───────────────────────────────────────────────────────
const LS_CASES = '[{a:["abcabcbb"],e:3},{a:["bbbbb"],e:1},{a:["pwwkew"],e:3},{a:[""],e:0}]';
const lsRunners: Record<string, Wrapper> = {
  python: pyHarness('lengthOfLongestSubstring', '[(("abcabcbb",), 3),(("bbbbb",), 1),(("pwwkew",), 3),(("",), 0)]', 'got==exp'),
  javascript: jsHarness('lengthOfLongestSubstring(a[0])', LS_CASES, 'got===e'),
  typescript: jsHarness('lengthOfLongestSubstring(a[0])', LS_CASES, 'got===e'),
  java: (code: string) => `${code}
class Main{public static void main(String[]_){Solution s=new Solution();int p=0;String[]ins={"abcabcbb","bbbbb","pwwkew",""};int[]exp={3,1,3,0};for(int i=0;i<4;i++){boolean ok=s.lengthOfLongestSubstring(ins[i])==exp[i];System.out.println("Test "+(i+1)+": "+(ok?"\\u2713 PASS":"\\u2717 FAIL"));if(ok)p++;}System.out.println("\\n"+p+"/4 tests passed");}}`,
  cpp: (code: string) => `#include<bits/stdc++.h>
using namespace std;
${code}
int main(){Solution s;int p=0;vector<pair<string,int>>tests={{"abcabcbb",3},{"bbbbb",1},{"pwwkew",3},{"",0}};for(auto&[a,e]:tests){bool ok=s.lengthOfLongestSubstring(a)==e;cout<<(ok?"\\u2713 PASS":"\\u2717 FAIL")<<"\\n";if(ok)p++;}cout<<"\\n"<<p<<"/4 tests passed\\n";}`,
  go: (code: string) => `package main
import "fmt"
${code}
func main(){p:=0;type tc struct{s string;e int};tests:=[]tc{{"abcabcbb",3},{"bbbbb",1},{"pwwkew",3},{"",0}};for i,tc:=range tests{ok:=lengthOfLongestSubstring(tc.s)==tc.e;s:="\\u2717 FAIL";if ok{s="\\u2713 PASS";p++};fmt.Printf("Test %d: %s\\n",i+1,s)};fmt.Printf("\\n%d/4 tests passed\\n",p)}`,
  rust: (code: string) => `struct Solution;
${code}
fn main(){let tests=vec![("abcabcbb",3usize),("bbbbb",1),("pwwkew",3),("",0)];let mut p=0;for(i,(s,e))in tests.iter().enumerate(){let ok=Solution::length_of_longest_substring(s.to_string())==*e;println!("Test {}: {}",i+1,if ok{"\\u2713 PASS"}else{"\\u2717 FAIL"});if ok{p+=1;}};println!("\\n{}/4 tests passed",p);}`,
};

// ─── CONTAINER WITH MOST WATER ───────────────────────────────────────────────
const CW_CASES = '[{a:[[1,8,6,2,5,4,8,3,7]],e:49},{a:[[1,1]],e:1},{a:[[4,3,2,1,4]],e:16}]';
const cwRunners: Record<string, Wrapper> = {
  python: pyHarness('maxArea', '[(([1,8,6,2,5,4,8,3,7],), 49),(([1,1],), 1),(([4,3,2,1,4],), 16)]', 'got==exp'),
  javascript: jsHarness('maxArea(a[0].slice())', CW_CASES, 'got===e'),
  typescript: jsHarness('maxArea(a[0].slice())', CW_CASES, 'got===e'),
  java: (code: string) => `${code}
class Main{public static void main(String[]_){Solution s=new Solution();int p=0;int[][]ins={{1,8,6,2,5,4,8,3,7},{1,1},{4,3,2,1,4}};int[]exp={49,1,16};for(int i=0;i<3;i++){boolean ok=s.maxArea(ins[i].clone())==exp[i];System.out.println("Test "+(i+1)+": "+(ok?"\\u2713 PASS":"\\u2717 FAIL"));if(ok)p++;}System.out.println("\\n"+p+"/3 tests passed");}}`,
  cpp: (code: string) => `#include<bits/stdc++.h>
using namespace std;
${code}
int main(){Solution s;int p=0;vector<pair<vector<int>,int>>tests={{{1,8,6,2,5,4,8,3,7},49},{{1,1},1},{{4,3,2,1,4},16}};for(auto&[a,e]:tests){bool ok=s.maxArea(a)==e;cout<<(ok?"\\u2713 PASS":"\\u2717 FAIL")<<"\\n";if(ok)p++;}cout<<"\\n"<<p<<"/3 tests passed\\n";}`,
  go: (code: string) => `package main
import "fmt"
${code}
func main(){p:=0;type tc struct{a[]int;e int};tests:=[]tc{{[]int{1,8,6,2,5,4,8,3,7},49},{[]int{1,1},1},{[]int{4,3,2,1,4},16}};for i,tc:=range tests{ok:=maxArea(append([]int{},tc.a...))==tc.e;s:="\\u2717 FAIL";if ok{s="\\u2713 PASS";p++};fmt.Printf("Test %d: %s\\n",i+1,s)};fmt.Printf("\\n%d/3 tests passed\\n",p)}`,
  rust: (code: string) => `struct Solution;
${code}
fn main(){let tests=vec![(vec![1i32,8,6,2,5,4,8,3,7],49i32),(vec![1,1],1),(vec![4,3,2,1,4],16)];let mut p=0;for(i,(h,e))in tests.iter().enumerate(){let ok=Solution::max_area(h.clone())==*e;println!("Test {}: {}",i+1,if ok{"\\u2713 PASS"}else{"\\u2717 FAIL"});if ok{p+=1;}};println!("\\n{}/3 tests passed",p);}`,
};

// ─── TRAPPING RAIN WATER ─────────────────────────────────────────────────────
const TR_CASES = '[{a:[[0,1,0,2,1,0,1,3,2,1,2,1]],e:6},{a:[[4,2,0,3,2,5]],e:9},{a:[[3,0,2,0,4]],e:7}]';
const trapRunners: Record<string, Wrapper> = {
  python: pyHarness('trap', '[(([0,1,0,2,1,0,1,3,2,1,2,1],), 6),(([4,2,0,3,2,5],), 9),(([3,0,2,0,4],), 7)]', 'got==exp'),
  javascript: jsHarness('trap(a[0].slice())', TR_CASES, 'got===e'),
  typescript: jsHarness('trap(a[0].slice())', TR_CASES, 'got===e'),
  java: (code: string) => `${code}
class Main{public static void main(String[]_){Solution s=new Solution();int p=0;int[][]ins={{0,1,0,2,1,0,1,3,2,1,2,1},{4,2,0,3,2,5},{3,0,2,0,4}};int[]exp={6,9,7};for(int i=0;i<3;i++){boolean ok=s.trap(ins[i].clone())==exp[i];System.out.println("Test "+(i+1)+": "+(ok?"\\u2713 PASS":"\\u2717 FAIL"));if(ok)p++;}System.out.println("\\n"+p+"/3 tests passed");}}`,
  cpp: (code: string) => `#include<bits/stdc++.h>
using namespace std;
${code}
int main(){Solution s;int p=0;vector<pair<vector<int>,int>>tests={{{0,1,0,2,1,0,1,3,2,1,2,1},6},{{4,2,0,3,2,5},9},{{3,0,2,0,4},7}};for(auto&[a,e]:tests){bool ok=s.trap(a)==e;cout<<(ok?"\\u2713 PASS":"\\u2717 FAIL")<<"\\n";if(ok)p++;}cout<<"\\n"<<p<<"/3 tests passed\\n";}`,
  go: (code: string) => `package main
import "fmt"
${code}
func main(){p:=0;type tc struct{a[]int;e int};tests:=[]tc{{[]int{0,1,0,2,1,0,1,3,2,1,2,1},6},{[]int{4,2,0,3,2,5},9},{[]int{3,0,2,0,4},7}};for i,tc:=range tests{ok:=trap(append([]int{},tc.a...))==tc.e;s:="\\u2717 FAIL";if ok{s="\\u2713 PASS";p++};fmt.Printf("Test %d: %s\\n",i+1,s)};fmt.Printf("\\n%d/3 tests passed\\n",p)}`,
  rust: (code: string) => `struct Solution;
${code}
fn main(){let tests=vec![(vec![0i32,1,0,2,1,0,1,3,2,1,2,1],6i32),(vec![4,2,0,3,2,5],9),(vec![3,0,2,0,4],7)];let mut p=0;for(i,(h,e))in tests.iter().enumerate(){let ok=Solution::trap(h.clone())==*e;println!("Test {}: {}",i+1,if ok{"\\u2713 PASS"}else{"\\u2717 FAIL"});if ok{p+=1;}};println!("\\n{}/3 tests passed",p);}`,
};

// ─── WORD BREAK ───────────────────────────────────────────────────────────────
const WB_CASES = '[{a:["leetcode",["leet","code"]],e:true},{a:["applepenapple",["apple","pen"]],e:true},{a:["catsandog",["cats","dog","sand","and","cat"]],e:false}]';
const wbRunners: Record<string, Wrapper> = {
  python: pyHarness('wordBreak', '[(("leetcode",["leet","code"]), True),(("applepenapple",["apple","pen"]), True),(("catsandog",["cats","dog","sand","and","cat"]), False)]', 'got==exp'),
  javascript: jsHarness('wordBreak(a[0],a[1])', WB_CASES, 'got===e'),
  typescript: jsHarness('wordBreak(a[0],a[1])', WB_CASES, 'got===e'),
  java: (code: string) => `${code}
class Main{public static void main(String[]_){Solution s=new Solution();int p=0;boolean ok;
  ok=s.wordBreak("leetcode",java.util.Arrays.asList("leet","code"));System.out.println("Test 1: "+(ok?"\\u2713 PASS":"\\u2717 FAIL"));if(ok)p++;
  ok=s.wordBreak("applepenapple",java.util.Arrays.asList("apple","pen"));System.out.println("Test 2: "+(ok?"\\u2713 PASS":"\\u2717 FAIL"));if(ok)p++;
  ok=!s.wordBreak("catsandog",java.util.Arrays.asList("cats","dog","sand","and","cat"));System.out.println("Test 3: "+(ok?"\\u2713 PASS":"\\u2717 FAIL"));if(ok)p++;
  System.out.println("\\n"+p+"/3 tests passed");}}`,
  cpp: (code: string) => `#include<bits/stdc++.h>
using namespace std;
${code}
int main(){Solution s;int p=0;bool ok;
  ok=s.wordBreak("leetcode",{"leet","code"});cout<<"Test 1: "<<(ok?"\\u2713 PASS":"\\u2717 FAIL")<<"\\n";if(ok)p++;
  ok=s.wordBreak("applepenapple",{"apple","pen"});cout<<"Test 2: "<<(ok?"\\u2713 PASS":"\\u2717 FAIL")<<"\\n";if(ok)p++;
  ok=!s.wordBreak("catsandog",{"cats","dog","sand","and","cat"});cout<<"Test 3: "<<(ok?"\\u2713 PASS":"\\u2717 FAIL")<<"\\n";if(ok)p++;
  cout<<"\\n"<<p<<"/3 tests passed\\n";}`,
  go: (code: string) => `package main
import "fmt"
${code}
func main(){p:=0;type tc struct{s string;w[]string;e bool};tests:=[]tc{{"leetcode",[]string{"leet","code"},true},{"applepenapple",[]string{"apple","pen"},true},{"catsandog",[]string{"cats","dog","sand","and","cat"},false}};for i,tc:=range tests{ok:=wordBreak(tc.s,tc.w)==tc.e;s:="\\u2717 FAIL";if ok{s="\\u2713 PASS";p++};fmt.Printf("Test %d: %s\\n",i+1,s)};fmt.Printf("\\n%d/3 tests passed\\n",p)}`,
  rust: (code: string) => `struct Solution;
${code}
fn main(){let tests=vec![("leetcode",vec!["leet","code"],true),("applepenapple",vec!["apple","pen"],true),("catsandog",vec!["cats","dog","sand","and","cat"],false)];let mut p=0;for(i,(s,w,e))in tests.iter().enumerate(){let wd:Vec<String>=w.iter().map(|x|x.to_string()).collect();let ok=Solution::word_break(s.to_string(),wd)==*e;println!("Test {}: {}",i+1,if ok{"\\u2713 PASS"}else{"\\u2717 FAIL"});if ok{p+=1;}};println!("\\n{}/3 tests passed",p);}`,
};

// ─── MERGE INTERVALS ─────────────────────────────────────────────────────────
const MI_CASES = '[{a:[[[1,3],[2,6],[8,10],[15,18]]],e:[[1,6],[8,10],[15,18]]},{a:[[[1,4],[4,5]]],e:[[1,5]]}]';
const miRunners: Record<string, Wrapper> = {
  python: (code: string) => `${code}

def _test():
    sol = Solution()
    cases = [
        ([[1,3],[2,6],[8,10],[15,18]], [[1,6],[8,10],[15,18]]),
        ([[1,4],[4,5]], [[1,5]]),
    ]
    p = 0
    for i,(inp,exp) in enumerate(cases,1):
        try:
            got = sol.merge([r[:] for r in inp])
            ok = got == exp
            print(f"Test {i}: {'\\u2713 PASS' if ok else '\\u2717 FAIL'}")
            if not ok: print(f"  Expected: {exp}\\n  Got:      {got}")
            else: p+=1
        except Exception as e:
            print(f"Test {i}: \\u2717 ERROR - {e}")
    print(f"\\n{p}/2 tests passed")
_test()`,
  javascript: jsHarness('merge(a[0].map(function(x){return x.slice();}))', MI_CASES, 'JSON.stringify(got)===JSON.stringify(e)'),
  typescript: jsHarness('merge(a[0].map(function(x){return x.slice();}))', MI_CASES, 'JSON.stringify(got)===JSON.stringify(e)'),
  java: (code: string) => `${code}
class Main{public static void main(String[]_){Solution s=new Solution();int p=0;
  int[][]i1={{1,3},{2,6},{8,10},{15,18}};int[][]e1={{1,6},{8,10},{15,18}};
  boolean ok1=java.util.Arrays.deepEquals(s.merge(i1),e1);System.out.println("Test 1: "+(ok1?"\\u2713 PASS":"\\u2717 FAIL"));if(ok1)p++;
  int[][]i2={{1,4},{4,5}};int[][]e2={{1,5}};
  boolean ok2=java.util.Arrays.deepEquals(s.merge(i2),e2);System.out.println("Test 2: "+(ok2?"\\u2713 PASS":"\\u2717 FAIL"));if(ok2)p++;
  System.out.println("\\n"+p+"/2 tests passed");}}`,
  cpp: (code: string) => `#include<bits/stdc++.h>
using namespace std;
${code}
int main(){Solution s;int p=0;bool ok;
  ok=s.merge({{1,3},{2,6},{8,10},{15,18}})==vector<vector<int>>{{1,6},{8,10},{15,18}};cout<<"Test 1: "<<(ok?"\\u2713 PASS":"\\u2717 FAIL")<<"\\n";if(ok)p++;
  ok=s.merge({{1,4},{4,5}})==vector<vector<int>>{{1,5}};cout<<"Test 2: "<<(ok?"\\u2713 PASS":"\\u2717 FAIL")<<"\\n";if(ok)p++;
  cout<<"\\n"<<p<<"/2 tests passed\\n";}`,
  go: (code: string) => `package main
import "fmt"
${code}
func ii2eq(a,b[][]int)bool{if len(a)!=len(b){return false};for i:=range a{if len(a[i])!=len(b[i]){return false};for j:=range a[i]{if a[i][j]!=b[i][j]{return false}}};return true}
func main(){p:=0;type tc struct{a,e[][]int}
  tests:=[]tc{{[][]int{{1,3},{2,6},{8,10},{15,18}},[][]int{{1,6},{8,10},{15,18}}},{[][]int{{1,4},{4,5}},[][]int{{1,5}}}}
  for i,tc:=range tests{ok:=ii2eq(merge(tc.a),tc.e);s:="\\u2717 FAIL";if ok{s="\\u2713 PASS";p++};fmt.Printf("Test %d: %s\\n",i+1,s)}
  fmt.Printf("\\n%d/2 tests passed\\n",p)}`,
  rust: (code: string) => `struct Solution;
${code}
fn main(){let tests=vec![(vec![vec![1i32,3],vec![2,6],vec![8,10],vec![15,18]],vec![vec![1i32,6],vec![8,10],vec![15,18]]),(vec![vec![1i32,4],vec![4,5]],vec![vec![1i32,5]])];let mut p=0;for(i,(intervals,e))in tests.iter().enumerate(){let ok=Solution::merge(intervals.clone())==*e;println!("Test {}: {}",i+1,if ok{"\\u2713 PASS"}else{"\\u2717 FAIL"});if ok{p+=1;}};println!("\\n{}/2 tests passed",p);}`,
};

// ─── REGISTRY ────────────────────────────────────────────────────────────────
const RUNNERS: Record<string, Record<string, Wrapper>> = {
  'two-sum':                  twoSumRunners,
  'valid-parentheses':        validParensRunners,
  'best-time-buy-sell':       btRunners,
  'longest-substring':        lsRunners,
  'container-with-most-water': cwRunners,
  'trapping-rain-water':      trapRunners,
  'word-break':               wbRunners,
  'merge-intervals':          miRunners,
};

export function buildRunnerCode(problemId: string, langId: string, userCode: string): string | null {
  const wrapper = RUNNERS[problemId]?.[langId];
  if (!wrapper) return null;
  return wrapper(userCode);
}
