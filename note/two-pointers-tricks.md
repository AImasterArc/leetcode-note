# 👆 Two Pointers & Sliding Window 技巧

## Two Pointers 兩種形式

### 形式一: 對撞指針（Opposite Direction）

左右指針從兩端往中間走，適合**有序陣列**或**回文**類問題。

```python
left, right = 0, len(nums) - 1
while left < right:
    if condition:
        left += 1
    else:
        right -= 1
```

**例題**: Two Sum II, Valid Palindrome, Container With Most Water, 3Sum

---

### 形式二: 同向快慢指針（Same Direction）

兩個指針都從左往右，但速度或條件不同。

```python
slow = 0
for fast in range(len(nums)):
    if valid(nums[fast]):
        nums[slow] = nums[fast]
        slow += 1
# slow 就是新 array 的長度
```

**例題**: Remove Duplicates, Move Zeroes, Linked List Cycle

---

## Sliding Window 滑動視窗

適合處理**連續子陣列/子字串**的最值問題。

### 固定視窗大小

```python
window_sum = sum(nums[:k])
max_sum = window_sum

for i in range(k, len(nums)):
    window_sum += nums[i] - nums[i - k]
    max_sum = max(max_sum, window_sum)
```

### 可變視窗（最短/最長滿足條件的子陣列）

```python
left = 0
window = {}  # 或 Counter, sum 等

for right in range(len(s)):
    # 擴展右邊界，加入 s[right]
    window[s[right]] = window.get(s[right], 0) + 1

    # 視窗不合法時，縮小左邊界
    while not valid(window):
        window[s[left]] -= 1
        if window[s[left]] == 0:
            del window[s[left]]
        left += 1

    # 更新答案 (此時視窗 [left, right] 合法)
    ans = max(ans, right - left + 1)
```

**例題**: Minimum Window Substring, Longest Substring Without Repeating Characters

---

## 3Sum 去重技巧

```python
nums.sort()
for i in range(len(nums) - 2):
    if i > 0 and nums[i] == nums[i-1]:
        continue  # 外層去重

    left, right = i + 1, len(nums) - 1
    while left < right:
        total = nums[i] + nums[left] + nums[right]
        if total == 0:
            result.append([nums[i], nums[left], nums[right]])
            while left < right and nums[left] == nums[left+1]: left += 1   # 內層去重
            while left < right and nums[right] == nums[right-1]: right -= 1
            left += 1; right -= 1
        elif total < 0: left += 1
        else: right -= 1
```

---

## 選擇哪種方法？

| 問題特徵 | 方法 |
|----------|------|
| 有序陣列找兩數之和 | 對撞指針 |
| 連續子陣列最大/小值 | Sliding Window |
| 原地移除/去重 | 快慢指針 |
| 找所有三數組合 | 排序 + 對撞 |
| 子字串包含所有字符 | 可變 Sliding Window |
