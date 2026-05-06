# 🕸️ 圖論遍歷指南

## 建圖

```python
from collections import defaultdict
graph = defaultdict(list)
for u, v in edges:
    graph[u].append(v)
    graph[v].append(u)   # 無向圖
```

---

## DFS

```python
def dfs(graph, start):
    visited = set()
    def _dfs(node):
        visited.add(node)
        for nei in graph[node]:
            if nei not in visited:
                _dfs(nei)
    _dfs(start)
```

## BFS（最短路徑）

```python
from collections import deque
def bfs(graph, start, target):
    visited = {start}
    queue = deque([(start, 0)])
    while queue:
        node, dist = queue.popleft()
        if node == target: return dist
        for nei in graph[node]:
            if nei not in visited:
                visited.add(nei)
                queue.append((nei, dist + 1))
    return -1
```

---

## 拓撲排序（Kahn's — 課程表 #207）

```python
from collections import deque, defaultdict
def topoSort(n, prerequisites):
    graph = defaultdict(list)
    indegree = [0] * n
    for a, b in prerequisites:
        graph[b].append(a)
        indegree[a] += 1
    queue = deque(i for i in range(n) if indegree[i] == 0)
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for nei in graph[node]:
            indegree[nei] -= 1
            if indegree[nei] == 0:
                queue.append(nei)
    return order if len(order) == n else []
```

---

## Dijkstra（帶權最短路）

```python
import heapq
def dijkstra(graph, start, n):
    dist = [float('inf')] * n
    dist[start] = 0
    heap = [(0, start)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]: continue
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(heap, (dist[v], v))
    return dist
```

---

## 選型

| 問題 | 方法 |
|------|------|
| 連通分量 | DFS/BFS/Union-Find |
| 最短路（無權） | BFS |
| 最短路（有權非負） | Dijkstra |
| 拓撲順序 / 判斷有環 | Kahn's / DFS+color |
| 最小生成樹 | Prim / Kruskal |
