# 🔄 Backtracking 回溯模板

## 核心框架

```python
def backtrack(state, choices):
    # 終止條件
    if is_solution(state):
        result.append(state[:])   # 存副本！
        return

    for choice in choices:
        # 做選擇
        state.append(choice)
        # 遞迴
        backtrack(state, next_choices(choice))
        # 撤銷選擇
        state.pop()
```

---

## 常見題型

### 1. 子集（Subsets #78）

```python
def subsets(nums):
    result = []
    def bt(start, path):
        result.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            bt(i + 1, path)
            path.pop()
    bt(0, [])
    return result
```

### 2. 排列（Permutations #46）

```python
def permute(nums):
    result = []
    def bt(path, used):
        if len(path) == len(nums):
            result.append(path[:])
            return
        for i, n in enumerate(nums):
            if used[i]: continue
            used[i] = True
            path.append(n)
            bt(path, used)
            path.pop()
            used[i] = False
    bt([], [False]*len(nums))
    return result
```

### 3. 組合（Combinations #77）

```python
def combine(n, k):
    result = []
    def bt(start, path):
        if len(path) == k:
            result.append(path[:])
            return
        # 剪枝：剩餘元素不夠則停止
        for i in range(start, n - (k - len(path)) + 2):
            path.append(i)
            bt(i + 1, path)
            path.pop()
    bt(1, [])
    return result
```

### 4. 有重複元素（去重）

```python
# 排序 + 跳過重複
nums.sort()
for i in range(start, len(nums)):
    if i > start and nums[i] == nums[i-1]:
        continue  # 跳過重複
    # ... 正常回溯
```

---

## 棋盤類（N-Queens #51）

```python
def solveNQueens(n):
    result = []
    cols = set(); diag1 = set(); diag2 = set()

    def bt(row, board):
        if row == n:
            result.append([''.join(r) for r in board])
            return
        for col in range(n):
            if col in cols or (row-col) in diag1 or (row+col) in diag2:
                continue
            cols.add(col); diag1.add(row-col); diag2.add(row+col)
            board[row][col] = 'Q'
            bt(row+1, board)
            cols.remove(col); diag1.remove(row-col); diag2.remove(row+col)
            board[row][col] = '.'

    bt(0, [['.']*n for _ in range(n)])
    return result
```

---

## 剪枝策略

| 策略 | 說明 |
|------|------|
| 排序 + 跳重 | 解決重複元素 |
| 提前 return | 不可能得到解 |
| 計數剪枝 | 剩餘元素不夠 |
| 約束剪枝 | 違反約束直接跳 |
