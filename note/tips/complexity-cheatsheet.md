# 💡 時間/空間複雜度速查表

## 常見演算法複雜度

| 演算法 | 時間 | 空間 | 備註 |
|--------|------|------|------|
| Binary Search | O(log n) | O(1) | 需已排序 |
| BFS/DFS | O(V+E) | O(V) | 圖的遍歷 |
| Merge Sort | O(n log n) | O(n) | 穩定排序 |
| Quick Sort | O(n log n)avg | O(log n) | 不穩定 |
| Heap Sort | O(n log n) | O(1) | 不穩定 |
| Dijkstra | O(E log V) | O(V) | 需非負權重 |
| Union-Find | O(α(n)) | O(n) | 近似 O(1) |
| DP (2D) | O(mn) | O(mn) 或 O(n) | |

---

## 常見資料結構操作

| 結構 | Access | Search | Insert | Delete |
|------|--------|--------|--------|--------|
| Array | O(1) | O(n) | O(n) | O(n) |
| Linked List | O(n) | O(n) | O(1) | O(1)* |
| Hash Table | - | O(1)avg | O(1)avg | O(1)avg |
| Binary Heap | O(1)top | O(n) | O(log n) | O(log n) |
| BST (balanced) | O(log n) | O(log n) | O(log n) | O(log n) |

*需知道前一個節點

---

## Python 常見操作複雜度

```python
# List
append()      # O(1)
pop()         # O(1)
pop(i)        # O(n)
insert(i, x)  # O(n)
list[i]       # O(1)
len(list)     # O(1)
in list       # O(n)

# Dict / Set
d[key]        # O(1) avg
key in d      # O(1) avg
d.items()     # O(n)

# String
s + t         # O(len(s)+len(t))
s.split()     # O(n)
''.join(lst)  # O(n)  ← 比 += 快！
```

---

## 解題複雜度推算

| 資料量 n | 可接受演算法 |
|----------|-------------|
| n ≤ 20 | O(2ⁿ), O(n!) |
| n ≤ 100 | O(n³) |
| n ≤ 1000 | O(n²) |
| n ≤ 10⁵ | O(n log n) |
| n ≤ 10⁶ | O(n) |
| n ≤ 10⁹ | O(log n) |
