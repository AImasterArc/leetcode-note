# 🐍 Python LeetCode 技巧

## 常用 One-liners

```python
# 反轉
arr[::-1]
'string'[::-1]

# 排序（帶 key）
sorted(pairs, key=lambda x: x[1])
arr.sort(key=lambda x: -x)   # 降序

# 扁平化
flat = [x for sub in matrix for x in sub]

# 矩陣轉置
transposed = list(zip(*matrix))

# 取最大最小 index
max_idx = nums.index(max(nums))

# 過濾
evens = list(filter(lambda x: x%2==0, nums))
```

---

## 常用型別技巧

```python
from collections import Counter, defaultdict, deque
from itertools import accumulate, product, combinations, permutations
from functools import lru_cache
import bisect, heapq, math

# LRU Cache（記憶化遞迴）
@lru_cache(maxsize=None)
def dp(i, j):
    ...

# accumulate（前綴和）
prefix = list(accumulate(nums, initial=0))
# prefix[i] = sum(nums[:i])

# 二分搜尋
bisect.bisect_left(arr, x)   # 左邊界
bisect.bisect_right(arr, x)  # 右邊界
```

---

## 字符串技巧

```python
# Anagram 判斷
Counter(s) == Counter(t)
sorted(s) == sorted(t)

# 字符出現次數
from collections import Counter
Counter("hello")  # {'l':2,'h':1,'e':1,'o':1}

# 分割與清理
"a  b  c".split()          # ['a','b','c']（自動去空格）
"1,2,3".split(',')         # ['1','2','3']
' '.join(['a','b','c'])    # 'a b c'

# 字符 <-> ASCII
ord('a')    # 97
chr(97)     # 'a'
ord(c) - ord('a')  # 0-25 的 index
```

---

## 數學技巧

```python
# 整除向上取整
(a + b - 1) // b    # 等同 math.ceil(a/b)
-(-a // b)           # 另一種寫法

# 最大公因數
import math
math.gcd(12, 8)      # 4
math.lcm(4, 6)       # 12（Python 3.9+）

# 無限大
float('inf'), float('-inf')

# 二進位
bin(10)    # '0b1010'
10.bit_length()  # 4
```

---

## 性能陷阱

```python
# ❌ 慢：字串 +=
result = ""
for c in chars:
    result += c  # O(n²)

# ✅ 快：join
result = ''.join(chars)  # O(n)

# ❌ 慢：list in 查找
if x in my_list  # O(n)

# ✅ 快：set/dict 查找
my_set = set(my_list)
if x in my_set  # O(1)
```
