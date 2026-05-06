# 🔍 Graph Problems 圖論題型

## BFS 找最短路（無權）

```python
from collections import deque
def shortestPath(graph, src, dst):
    if src == dst: return 0
    visited = {src}
    queue = deque([(src, 0)])
    while queue:
        node, dist = queue.popleft()
        for nei in graph[node]:
            if nei == dst: return dist + 1
            if nei not in visited:
                visited.add(nei)
                queue.append((nei, dist + 1))
    return -1
```

---

## 判斷有向圖是否有環（DFS 三色標記）

```python
# 0=未訪問, 1=訪問中, 2=完成
def hasCycle(n, edges):
    graph = defaultdict(list)
    for u, v in edges: graph[u].append(v)
    color = [0] * n

    def dfs(node):
        if color[node] == 1: return True    # 發現環
        if color[node] == 2: return False
        color[node] = 1
        for nei in graph[node]:
            if dfs(nei): return True
        color[node] = 2
        return False

    return any(dfs(i) for i in range(n) if color[i] == 0)
```

---

## 二分圖判斷（#785）

```python
def isBipartite(graph):
    color = {}
    def bfs(start):
        queue = deque([start])
        color[start] = 0
        while queue:
            node = queue.popleft()
            for nei in graph[node]:
                if nei not in color:
                    color[nei] = 1 - color[node]
                    queue.append(nei)
                elif color[nei] == color[node]:
                    return False
        return True
    return all(bfs(i) for i in range(len(graph)) if i not in color)
```

---

## 常見圖論題型

| 題號 | 題目 | 方法 |
|------|------|------|
| #207 | Course Schedule | 拓撲排序 |
| #200 | Number of Islands | DFS/BFS/UF |
| #127 | Word Ladder | BFS |
| #785 | Is Graph Bipartite | BFS 染色 |
| #743 | Network Delay Time | Dijkstra |
| #547 | Number of Provinces | DFS/Union-Find |

---

## 隱式圖（Word Ladder 類型）

```python
# 將字串轉換問題建模為圖
# 每個狀態是一個節點，合法轉換是邊
# 用 BFS 找最短轉換路徑
queue = deque([(start_word, 1)])
visited = {start_word}
while queue:
    word, steps = queue.popleft()
    for i in range(len(word)):
        for c in 'abcdefghijklmnopqrstuvwxyz':
            new_word = word[:i] + c + word[i+1:]
            if new_word == end_word: return steps + 1
            if new_word in word_set and new_word not in visited:
                visited.add(new_word)
                queue.append((new_word, steps + 1))
```
