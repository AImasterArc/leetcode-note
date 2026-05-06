# 🔍 Binary Search 解題模板

## 為什麼 Binary Search 容易出 Bug？

Edge case 很多: `left <= right` 還是 `left < right`？`mid + 1` 還是 `mid`？
**解法**: 選一種模板，徹底記熟，不要每次重新推導。

---

## 模板一: 左閉右閉 `[left, right]`（推薦）

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

**記憶口訣**: 閉閉用 `<=`，更新都加減 1

---

## 模板二: 找左邊界（找第一個 >= target 的位置）

```python
def lower_bound(nums, target):
    left, right = 0, len(nums)  # 注意 right = len(nums)，開區間

    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid     # 可能是答案，不排除

    return left  # 第一個 >= target 的 index，找不到時 = len(nums)
```

**應用**: `bisect_left(nums, target)`

---

## 模板三: 找右邊界（找最後一個 <= target 的位置）

```python
def upper_bound(nums, target):
    left, right = 0, len(nums)

    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] <= target:
            left = mid + 1
        else:
            right = mid

    return left - 1  # 最後一個 <= target 的 index
```

---

## 進階: 在答案空間上 Binary Search

當題目問「最小化最大值」或「最大化最小值」時，可以對**答案**做 Binary Search。

```python
def solve(nums, k):
    def feasible(mid):
        # 判斷 mid 是否可行（自定義）
        ...

    left, right = min(nums), max(nums)  # 答案的範圍
    while left < right:
        mid = left + (right - left) // 2
        if feasible(mid):
            right = mid       # 找最小可行值
        else:
            left = mid + 1
    return left
```

**例題**: Koko Eating Bananas, Split Array Largest Sum, Capacity To Ship Packages

---

## Python 內建工具

```python
import bisect

bisect.bisect_left(nums, target)   # 第一個 >= target 的 index
bisect.bisect_right(nums, target)  # 第一個 > target 的 index
bisect.insort_left(nums, target)   # 插入並保持有序
```

---

## 常見陷阱

| 陷阱 | 正確寫法 |
|------|----------|
| 整數溢位 | `mid = left + (right - left) // 2` |
| 死循環 | 確保每次迴圈 left 或 right 有移動 |
| 無限逼近 | `left = mid` 時需 `mid = left + (right - left + 1) // 2` 向上取整 |
