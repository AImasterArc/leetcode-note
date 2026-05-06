# ⚡ 排序演算法比較

## 快速比較表

| 演算法 | 最好 | 平均 | 最壞 | 空間 | 穩定 |
|--------|------|------|------|------|------|
| Bubble | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| Insertion | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ |
| Quick | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | ❌ |
| Counting | O(n+k) | O(n+k) | O(n+k) | O(k) | ✅ |

Python `sort()` 使用 **Timsort**（穩定，O(n log n)）

---

## Python 排序技巧

```python
# 自訂 key
people.sort(key=lambda x: (x[1], -x[0]))  # 先年齡升序，再身高降序

# cmp_to_key（需要比較函數）
from functools import cmp_to_key
def cmp(a, b):
    return int(b+a) - int(a+b)   # 例：大數組合
nums.sort(key=cmp_to_key(cmp))

# 穩定排序的利用（按多個 key 分次排序）
data.sort(key=lambda x: x.name)
data.sort(key=lambda x: x.age)   # 年齡相同時保留名字的相對順序
```

---

## Merge Sort 實作（歸納到 LeetCode）

```python
def merge_sort(nums):
    if len(nums) <= 1: return nums
    mid = len(nums) // 2
    left = merge_sort(nums[:mid])
    right = merge_sort(nums[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]
```

---

## Quick Select（找第 K 大）

```python
import random
def partition(nums, left, right):
    pivot = nums[right]
    i = left
    for j in range(left, right):
        if nums[j] <= pivot:
            nums[i], nums[j] = nums[j], nums[i]
            i += 1
    nums[i], nums[right] = nums[right], nums[i]
    return i

def quick_select(nums, k):
    left, right = 0, len(nums) - 1
    target = len(nums) - k   # 第 k 大 = 第 (n-k) 小
    while left < right:
        pivot = partition(nums, left, right)
        if pivot == target: break
        elif pivot < target: left = pivot + 1
        else: right = pivot - 1
    return nums[target]
```
