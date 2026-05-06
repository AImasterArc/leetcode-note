# 🐛 Debug 排查策略

## 常見 Bug 類型

| 現象 | 可能原因 |
|------|----------|
| 結果少1/多1 | off-by-one 邊界錯誤 |
| 無限循環 | 指針/索引沒更新 |
| 結果差一倍 | 重複計算（如無向圖計兩次） |
| 測試部分通過 | 邊界 case 沒考慮到 |
| TLE | 複雜度太高 / 可用 memoization |

---

## Debug 步驟

```
1. 加 print 看中間狀態
2. 縮小輸入規模（n=2, n=3）
3. 手動模擬期望行為
4. 比對預期 vs 實際
```

---

## 常見 off-by-one 場景

```python
# Binary Search
while left < right   # vs  while left <= right
right = mid          # vs  right = mid - 1
left = mid + 1       # vs  left = mid

# 陣列邊界
for i in range(n)    # 0 ~ n-1
for i in range(1, n) # 1 ~ n-1

# Sliding Window
right - left         # 窗口長度（不含 right）
right - left + 1     # 窗口長度（含 right）
```

---

## 鏈結串列 Debug 技巧

```python
# 加一個列印函數
def print_list(head):
    nodes = []
    while head:
        nodes.append(str(head.val))
        head = head.next
    print(' -> '.join(nodes))
```

---

## 遞迴 Debug

```python
def dfs(node, depth=0):
    print("  " * depth + str(node.val))  # 可視化遞迴樹
    ...
```

---

## 心態

- Bug 很正常，不要慌
- 先縮小問題，找到 failing case
- 一次改一處，避免同時改多個地方
- 確認修改後重新跑所有 test case
