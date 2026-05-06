# 🗃️ Hash Table 完整指南

## Python 實作

```python
# defaultdict — 不需要初始化
from collections import defaultdict
freq = defaultdict(int)
freq['a'] += 1

# Counter — 快速計頻率
from collections import Counter
c = Counter("aabbc")  # {'a':2, 'b':2, 'c':1}
c.most_common(2)       # [('a',2), ('b',2)]

# 普通 dict
d = {}
d.get('key', 0)        # 有預設值的取值
d.setdefault('key', []).append(1)
```

---

## 常見使用場景

### 1. 計頻率

```python
from collections import Counter
freq = Counter(nums)
# 找出現超過 k 次的元素
common = [x for x, cnt in freq.items() if cnt >= k]
```

### 2. 紀錄索引

```python
# Two Sum
index_map = {}
for i, num in enumerate(nums):
    complement = target - num
    if complement in index_map:
        return [index_map[complement], i]
    index_map[num] = i
```

### 3. 分組（Grouping）

```python
# Group Anagrams
from collections import defaultdict
groups = defaultdict(list)
for word in words:
    key = tuple(sorted(word))
    groups[key].append(word)
```

### 4. 前綴和 + Hash Map

```python
# Subarray Sum Equals K
prefix = {0: 1}
running = count = 0
for num in nums:
    running += num
    count += prefix.get(running - k, 0)
    prefix[running] = prefix.get(running, 0) + 1
```

---

## 選型建議

| 需求 | 用什麼 |
|------|--------|
| 計數 | `Counter` |
| 分組/鄰接表 | `defaultdict(list)` |
| 計數 + 自動0 | `defaultdict(int)` |
| 有序字典 | `OrderedDict` |
| 雙向查找 | 兩個 dict |
