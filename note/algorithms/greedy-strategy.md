# 💡 Greedy 貪心策略

## 適用條件
1. **最優子結構**：局部最優能推出全局最優
2. **貪心選擇性質**：每步選最優不影響後續最優解

---

## 活動選擇（不重疊區間）

```python
# 選最多不重疊區間：按結束時間排序
intervals.sort(key=lambda x: x[1])
count, end = 0, float('-inf')
for s, e in intervals:
    if s >= end:
        count += 1; end = e
```

## 跳躍遊戲（#55）

```python
def canJump(nums):
    reach = 0
    for i, n in enumerate(nums):
        if i > reach: return False
        reach = max(reach, i + n)
    return True
```

## 跳躍遊戲 II（#45）— 最少步數

```python
def jump(nums):
    jumps = cur_end = cur_far = 0
    for i in range(len(nums) - 1):
        cur_far = max(cur_far, i + nums[i])
        if i == cur_end:
            jumps += 1
            cur_end = cur_far
    return jumps
```

---

## 常見 Greedy 題目

| 題號 | 題目 | 貪心策略 |
|------|------|----------|
| #45 | Jump Game II | 每步選最遠可達 |
| #55 | Jump Game | 維護最遠可達 |
| #435 | Non-overlapping Intervals | 按結束排序 |
| #621 | Task Scheduler | 最高頻任務優先 |
| #406 | Queue Reconstruction | 按身高降序 + index |
| #134 | Gas Station | 從虧損最大處切分 |
