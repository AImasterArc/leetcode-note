# ⚡ Union-Find (並查集)

## 模板

```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank   = [0] * n
        self.count  = n   # 連通分量數

    def find(self, x):           # 路徑壓縮
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):       # 按秩合併
        px, py = self.find(x), self.find(y)
        if px == py: return False
        if self.rank[px] < self.rank[py]: px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]: self.rank[px] += 1
        self.count -= 1
        return True

    def connected(self, x, y):
        return self.find(x) == self.find(y)
```

---

## 應用場景

### 計算連通分量數

```python
uf = UnionFind(n)
for u, v in edges:
    uf.union(u, v)
return uf.count
```

### 字符串/值映射到整數

```python
# 當節點是字串時
idx = {}
def get_id(s):
    if s not in idx:
        idx[s] = len(idx)
    return idx[s]

uf = UnionFind(max_size)
uf.union(get_id(a), get_id(b))
```

### 動態連通性

```python
# 逐步加邊，查詢連通性
for query in queries:
    if query[0] == 'union':
        uf.union(query[1], query[2])
    else:
        print(uf.connected(query[1], query[2]))
```

---

## 例題

| 題目 | 技巧 |
|------|------|
| Number of Islands (#200) | 每個格子是節點 |
| Graph Valid Tree (#261) | 判斷有無環 |
| Accounts Merge (#721) | Email 去重 |
| Redundant Connection (#684) | 找多餘邊 |

---

## 時間複雜度

| 操作 | 複雜度 |
|------|--------|
| find | O(α(n)) ≈ O(1) |
| union | O(α(n)) ≈ O(1) |
| α(n) | 反阿克曼函數，實際上 ≤ 4 |
