# 🏔️ Heap / Priority Queue 指南

## Python heapq（最小堆）

```python
import heapq

# 建堆
heap = [3, 1, 4, 1, 5]
heapq.heapify(heap)          # O(n) 原地建堆

# 基本操作
heapq.heappush(heap, x)     # O(log n)
val = heapq.heappop(heap)   # O(log n)，彈出最小值
heap[0]                      # peek 最小值，O(1)

# 最大堆：存負值
heapq.heappush(heap, -x)
max_val = -heapq.heappop(heap)
```

---

## 常見題型

### 1. Top K 最大/最小

```python
# K 個最大元素（用大小為 k 的最小堆）
def topK_largest(nums, k):
    heap = nums[:k]
    heapq.heapify(heap)
    for num in nums[k:]:
        if num > heap[0]:
            heapq.heapreplace(heap, num)
    return heap

# Python 內建
heapq.nlargest(k, nums)   # O(n log k)
heapq.nsmallest(k, nums)
```

### 2. 合併 K 個有序陣列

```python
def merge_k_sorted(lists):
    heap = []
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))
    result = []
    while heap:
        val, i, j = heapq.heappop(heap)
        result.append(val)
        if j + 1 < len(lists[i]):
            heapq.heappush(heap, (lists[i][j+1], i, j+1))
    return result
```

### 3. 第 K 大元素（#215）

```python
def findKthLargest(nums, k):
    return heapq.nlargest(k, nums)[-1]
    # 或 min-heap 維持 k 個最大
```

### 4. 帶權重的優先佇列（Dijkstra）

```python
def dijkstra(graph, start):
    dist = {node: float('inf') for node in graph}
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

## 使用時機

✅ 需要反覆取最小/最大值  
✅ Top K 問題  
✅ 合併有序數列  
✅ 帶優先級的任務調度  
✅ Greedy 中需要每次選最優
