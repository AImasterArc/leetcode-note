# 📋 矩陣問題解題指南

## 常見技巧

### 1. 方向陣列（DFS/BFS）

```python
# 四向
dirs = [(0,1),(0,-1),(1,0),(-1,0)]

# 八向（包含對角線）
dirs = [(0,1),(0,-1),(1,0),(-1,0),(1,1),(1,-1),(-1,1),(-1,-1)]

def bfs(matrix, start_r, start_c):
    rows, cols = len(matrix), len(matrix[0])
    queue = deque([(start_r, start_c)])
    visited = {(start_r, start_c)}

    while queue:
        r, c = queue.popleft()
        for dr, dc in dirs:
            nr, nc = r+dr, c+dc
            if 0 <= nr < rows and 0 <= nc < cols and (nr,nc) not in visited:
                visited.add((nr,nc))
                queue.append((nr,nc))
```

### 2. 原地標記（省空間）

```python
# 用負值或特殊值標記已訪問
if matrix[r][c] == target:
    matrix[r][c] = -1  # 標記訪問過
```

### 3. 螺旋矩陣（#54）

```python
def spiralOrder(matrix):
    result = []
    top, bottom, left, right = 0, len(matrix)-1, 0, len(matrix[0])-1

    while top <= bottom and left <= right:
        for c in range(left, right+1):   result.append(matrix[top][c])
        top += 1
        for r in range(top, bottom+1):   result.append(matrix[r][right])
        right -= 1
        if top <= bottom:
            for c in range(right, left-1, -1): result.append(matrix[bottom][c])
            bottom -= 1
        if left <= right:
            for r in range(bottom, top-1, -1): result.append(matrix[r][left])
            left += 1
    return result
```

### 4. 旋轉矩陣（#48）

```python
# 順時針旋轉 90 度：轉置 + 反轉每行
def rotate(matrix):
    n = len(matrix)
    # 轉置
    for i in range(n):
        for j in range(i+1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    # 反轉每行
    for row in matrix:
        row.reverse()
```

---

## Island 類問題模板

```python
def numIslands(grid):
    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '0'   # 標記訪問
        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            dfs(r+dr, c+dc)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                dfs(r, c)
                count += 1
    return count
```

---

## 常見題型對照

| 題目 | 技巧 |
|------|------|
| Number of Islands (#200) | DFS/BFS + 原地標記 |
| Spiral Matrix (#54) | 四邊界收縮 |
| Rotate Image (#48) | 轉置 + 翻轉 |
| Search 2D Matrix (#74) | 二分搜尋 |
| Unique Paths (#62) | DP |
