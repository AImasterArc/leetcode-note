# 👆 Two Pointers & Sliding Window 技巧

## Two Pointers 分類

### 1. 對撞指針（Opposite Direction）

適用：有序陣列、找對稱條件

```python
def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        s = nums[left] + nums[right]
        if s == target:   return [left, right]
        elif s < target:  left += 1
        else:             right -= 1
    return []
```
例題: Two Sum II (#167), 3Sum (#15), Container With Most Water (#11)

---

### 2. 快慢指針（Floyd's Cycle Detection）

```python
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False

def find_cycle_start(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow == fast:
            slow = head           # 重置 slow 到 head
            while slow != fast:
                slow, fast = slow.next, fast.next
            return slow
```
例題: Linked List Cycle II (#142), Find the Duplicate Number (#287)

---

### 3. 同向指針（Same Direction）

```python
# 刪除重複（原地）
def remove_duplicates(nums):
    slow = 0
    for fast in range(len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]
    return slow + 1
```

---

## Sliding Window 模板

### 固定窗口大小

```python
def fixed_window(nums, k):
    window_sum = sum(nums[:k])
    result = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        result = max(result, window_sum)
    return result
```

### 可變窗口大小

```python
def variable_window(s, condition):
    left = 0
    window = {}   # 或其他 state
    result = 0

    for right in range(len(s)):
        # 1. 擴展右邊
        window[s[right]] = window.get(s[right], 0) + 1

        # 2. 收縮左邊（不滿足條件時）
        while not valid(window):
            window[s[left]] -= 1
            left += 1

        # 3. 更新答案
        result = max(result, right - left + 1)
    return result
```
例題: Longest Substring Without Repeating (#3), Min Window Substring (#76)

---

## 選型指南

| 情境 | 使用 |
|------|------|
| 有序陣列找兩數 | 對撞指針 |
| 偵測/找環 | 快慢指針 |
| 原地刪除/移動 | 同向指針 |
| 子陣列/子字串最值 | Sliding Window |
