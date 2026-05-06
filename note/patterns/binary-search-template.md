# 🔍 Binary Search 解題模板

## 為什麼容易出 Bug？

Edge case 很多: `left ≤ right` 還是 `left < right`？`mid + 1` 還是 `mid`？
**解法**: 選一種模板，徹底記熟。

---

## 模板一：左閉右閉 [left, right]（推薦）

```python
def binary_search(nums, target):
    left, right = 0, len(nums) - 1  # 閉區間

    while left <= right:             # 終止: left > right
        mid = left + (right - left) // 2

        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1           # [mid+1, right]
        else:
            right = mid - 1          # [left, mid-1]
    return -1
```

## 模板二：找左邊界（找第一個 >= target）

```python
def lower_bound(nums, target):
    left, right = 0, len(nums)   # 右開
    while left < right:
        mid = (left + right) // 2
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid          # 縮右邊，保留 mid
    return left  # 第一個 >= target 的位置
```

## 模板三：找右邊界（找最後一個 <= target）

```python
def upper_bound(nums, target):
    left, right = 0, len(nums)
    while left < right:
        mid = (left + right) // 2
        if nums[mid] <= target:
            left = mid + 1
        else:
            right = mid
    return left - 1  # 最後一個 <= target 的位置
```

---

## 進階：在答案空間上 Binary Search

適用於求最小/最大值的問題：

```python
def solve():
    def feasible(mid):
        # 判斷 mid 是否可行
        return True/False

    left, right = min_possible, max_possible
    while left < right:
        mid = (left + right) // 2
        if feasible(mid):
            right = mid        # 找最小可行值
        else:
            left = mid + 1
    return left
```
例題: Koko Eating Bananas (#875), Capacity to Ship (#1011)

---

## Python 內建工具

```python
import bisect
bisect.bisect_left(nums, target)   # 左邊界（等同 lower_bound）
bisect.bisect_right(nums, target)  # 右邊界（等同 upper_bound）
```

---

## 常見陷阱

| 陷阱 | 說明 |
|------|------|
| 整數溢位 | 用 `left + (right-left)//2` |
| 死循環 | 確保每次循環都縮小範圍 |
| 邊界 off-by-one | 想清楚 `mid` 要不要進入下一輪 |
