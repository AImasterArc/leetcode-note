# 📊 Dynamic Programming 解題模式

## 解題框架

DP 題的黃金三問：
1. **狀態定義**: `dp[i]` 代表什麼？
2. **轉移方程**: `dp[i]` 怎麼從之前的狀態得到？
3. **初始條件**: `dp[0]`, `dp[1]` 等是多少？

---

## 常見 DP 模式

### 1. 線性 DP（1D）

```python
# 模板
dp = [0] * (n + 1)
dp[0] = base_case

for i in range(1, n + 1):
    dp[i] = f(dp[i-1], dp[i-2], ...)  # 轉移方程
```

**例題**: Climbing Stairs, House Robber, Fibonacci

**空間優化**: 若只需要前幾個狀態，用滾動變數
```python
prev2, prev1 = dp[0], dp[1]
for i in range(2, n + 1):
    curr = prev1 + prev2
    prev2, prev1 = prev1, curr
```

---

### 2. 背包問題

#### 0/1 背包（每個物品只能用一次）
```python
dp = [0] * (capacity + 1)
for item in items:
    for w in range(capacity, item.weight - 1, -1):  # 逆序！
        dp[w] = max(dp[w], dp[w - item.weight] + item.value)
```

#### 完全背包（每個物品可以用無限次）
```python
dp = [0] * (capacity + 1)
for item in items:
    for w in range(item.weight, capacity + 1):  # 正序！
        dp[w] = max(dp[w], dp[w - item.weight] + item.value)
```

> **關鍵**: 0/1 背包逆序防止重複使用，完全背包正序允許重複使用

**例題**: Coin Change（完全背包）

---

### 3. 子序列 DP（2D）

```python
# Longest Common Subsequence (LCS)
dp = [[0] * (n + 1) for _ in range(m + 1)]
for i in range(1, m + 1):
    for j in range(1, n + 1):
        if s1[i-1] == s2[j-1]:
            dp[i][j] = dp[i-1][j-1] + 1
        else:
            dp[i][j] = max(dp[i-1][j], dp[i][j-1])
```

---

### 4. 區間 DP

```python
# 枚舉區間長度 (由短到長)
for length in range(2, n + 1):
    for i in range(n - length + 1):
        j = i + length - 1
        for k in range(i, j):
            dp[i][j] = max(dp[i][j], dp[i][k] + dp[k+1][j] + cost)
```

**例題**: Matrix Chain Multiplication, Burst Balloons

---

## 常見轉移方程速查

| 題目 | 轉移方程 |
|------|----------|
| Climbing Stairs | `dp[i] = dp[i-1] + dp[i-2]` |
| House Robber | `dp[i] = max(dp[i-1], dp[i-2] + nums[i])` |
| Coin Change | `dp[i] = min(dp[i], dp[i-coin] + 1)` |
| Longest Increasing Subsequence | `dp[i] = max(dp[j]+1) for j<i if nums[j]<nums[i]` |
| Edit Distance | `dp[i][j] = dp[i-1][j-1]` if match, else `min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1` |

---

## Debug 技巧

1. 先用小測資手動算 dp table
2. 確認 dp 的 index 是否 off-by-one
3. 確認轉移順序（是否有依賴還沒算到的狀態）
4. 空間優化前先寫 2D 版確認正確性
