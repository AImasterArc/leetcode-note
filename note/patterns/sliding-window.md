# 🪟 Sliding Window 完整指南

## 核心思想

維護一個「窗口」滑過陣列/字串，避免重複計算內部狀態。
時間複雜度：O(n)，遠優於暴力的 O(n²)。

---

## 標準模板

```python
def sliding_window(s):
    left = 0
    counter = {}    # 窗口內的狀態
    result = 0

    for right in range(len(s)):
        # Step 1: 加入 right 元素
        counter[s[right]] = counter.get(s[right], 0) + 1

        # Step 2: 若窗口不合法，縮小左邊
        while is_invalid(counter):
            counter[s[left]] -= 1
            if counter[s[left]] == 0:
                del counter[s[left]]
            left += 1

        # Step 3: 更新答案（此時窗口合法）
        result = max(result, right - left + 1)

    return result
```

---

## 例題解析

### 最長無重複子字串 (#3)

```python
def lengthOfLongestSubstring(s):
    count = {}
    left = res = 0
    for right, c in enumerate(s):
        count[c] = count.get(c, 0) + 1
        while count[c] > 1:          # 有重複 → 縮左
            count[s[left]] -= 1
            left += 1
        res = max(res, right - left + 1)
    return res
```

### 最小覆蓋子字串 (#76)

```python
def minWindow(s, t):
    need = Counter(t)
    missing = len(t)
    left = start = end = 0

    for right, c in enumerate(s, 1):
        if need[c] > 0:
            missing -= 1
        need[c] -= 1

        if missing == 0:    # 窗口合法
            while need[s[left]] < 0:
                need[s[left]] += 1
                left += 1
            if end == 0 or right - left < end - start:
                start, end = left, right
            need[s[left]] += 1
            missing += 1
            left += 1

    return s[start:end]
```

---

## 固定大小窗口

```python
def max_sum_subarray(nums, k):
    window = sum(nums[:k])
    best = window
    for i in range(k, len(nums)):
        window += nums[i] - nums[i-k]
        best = max(best, window)
    return best
```

---

## 判斷是否適合 Sliding Window

✅ 找「連續子陣列/子字串」的最值  
✅ 問題有「單調性」（窗口擴大，條件變好/壞）  
✅ 窗口的 state 可以 O(1) 更新  
❌ 需要跨越不連續的元素
