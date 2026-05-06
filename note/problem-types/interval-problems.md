# ⏱️ Interval 區間問題

## 常見操作

### 1. 合併區間（#56）

```python
def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:             # 有重疊
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged
```

### 2. 插入區間（#57）

```python
def insert(intervals, newInterval):
    result = []
    i, n = 0, len(intervals)

    # 不重疊（在新區間左邊）
    while i < n and intervals[i][1] < newInterval[0]:
        result.append(intervals[i]); i += 1

    # 合併重疊
    while i < n and intervals[i][0] <= newInterval[1]:
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    result.append(newInterval)

    # 不重疊（在新區間右邊）
    while i < n:
        result.append(intervals[i]); i += 1
    return result
```

### 3. 會議室問題（最少會議室數 #253）

```python
def minMeetingRooms(intervals):
    import heapq
    intervals.sort(key=lambda x: x[0])
    heap = []   # 存各會議室的結束時間
    for start, end in intervals:
        if heap and heap[0] <= start:
            heapq.heapreplace(heap, end)   # 複用
        else:
            heapq.heappush(heap, end)      # 新房間
    return len(heap)
```

### 4. 無重疊區間（#435，貪心）

```python
def eraseOverlapIntervals(intervals):
    intervals.sort(key=lambda x: x[1])   # 按結束時間排序
    count = 0
    end = float('-inf')
    for s, e in intervals:
        if s >= end:
            end = e       # 不重疊，選此區間
        else:
            count += 1    # 重疊，移除
    return count
```

---

## 差分陣列（區間加減值）

```python
# 對區間 [l, r] 整體 +val，最後前綴和還原
diff = [0] * (n + 1)
for l, r, val in updates:
    diff[l] += val
    diff[r+1] -= val
# 還原
import itertools
result = list(itertools.accumulate(diff))[:n]
```

---

## 選型指南

| 問題類型 | 方法 |
|----------|------|
| 合併重疊 | 排序 + 掃描 |
| 最多不重疊 | 按結束時間貪心 |
| 最少房間/資源 | Heap 模擬 |
| 區間更新 | 差分陣列 |
