# 📚 Stack & Queue 解題技巧

## Stack（後進先出 LIFO）

```python
stack = []
stack.append(x)    # push
stack.pop()        # pop（O(1)）
stack[-1]          # peek
```

### 單調棧（Monotonic Stack）

**核心**：棧內元素保持單調遞增或遞減，用於找「下一個更大/小元素」。

```python
# 下一個更大元素（Next Greater Element）
def next_greater(nums):
    result = [-1] * len(nums)
    stack = []   # 存 index，棧內對應值單調遞減

    for i, num in enumerate(nums):
        while stack and nums[stack[-1]] < num:
            idx = stack.pop()
            result[idx] = num
        stack.append(i)
    return result
```
例題: Daily Temperatures (#739), Largest Rectangle in Histogram (#84)

---

## Queue（先進先出 FIFO）

```python
from collections import deque
q = deque()
q.append(x)       # enqueue（右端）
q.popleft()       # dequeue（左端）O(1)
q.appendleft(x)   # 左端加入（deque 特有）
```

### BFS 模板

```python
from collections import deque

def bfs(start, target, graph):
    queue = deque([start])
    visited = {start}
    steps = 0

    while queue:
        for _ in range(len(queue)):   # 按層處理
            node = queue.popleft()
            if node == target:
                return steps
            for neighbor in graph[node]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        steps += 1
    return -1
```

---

## 單調佇列（Monotonic Deque）

用於固定窗口內求最大值，時間複雜度 O(n)：

```python
# Sliding Window Maximum (#239)
from collections import deque

def maxSlidingWindow(nums, k):
    dq = deque()   # 存 index，對應值單調遞減
    result = []

    for i, num in enumerate(nums):
        while dq and nums[dq[-1]] < num:
            dq.pop()
        dq.append(i)

        if dq[0] <= i - k:   # 過期
            dq.popleft()

        if i >= k - 1:
            result.append(nums[dq[0]])
    return result
```

---

## 選型指南

| 問題類型 | 資料結構 |
|----------|----------|
| 括號匹配 / 計算式 | Stack |
| 下一個更大/小元素 | 單調棧 |
| 層序遍歷 / 最短路 | Queue (BFS) |
| 滑動窗口最值 | 單調佇列 |
| 最小值棧 | 輔助棧 |
