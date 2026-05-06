# 📐 DP 解題模式

## 黃金三問
1. **狀態定義**: `dp[i]` 代表什麼？
2. **轉移方程**: 怎麼從之前的狀態得到？
3. **初始條件**: `dp[0]`, `dp[1]` 是多少？

---

## 1. 線性 DP（1D）

```python
dp = [0] * (n + 1)
dp[0] = base_case
for i in range(1, n + 1):
    dp[i] = f(dp[i-1], dp[i-2], ...)
```

**空間優化**（只需前幾個狀態）:
```python
prev2, prev1 = dp[0], dp[1]
for i in range(2, n + 1):
    curr = prev1 + prev2
    prev2, prev1 = prev1, curr
```
例題: Climbing Stairs (#70), House Robber (#198), Fibonacci

---

## 2. 0/1 背包

```python
dp = [0] * (capacity + 1)
for weight, value in items:
    for c in range(capacity, weight - 1, -1):  # 逆序！
        dp[c] = max(dp[c], dp[c - weight] + value)
```

## 3. 完全背包（無限次使用）

```python
dp = [0] * (capacity + 1)
for weight, value in items:
    for c in range(weight, capacity + 1):  # 正序
        dp[c] = max(dp[c], dp[c - weight] + value)
```
例題: Coin Change (#322)

---

## 4. 二維 DP

```python
dp = [[0] * (n+1) for _ in range(m+1)]
for i in range(1, m+1):
    for j in range(1, n+1):
        dp[i][j] = f(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
```
例題: Longest Common Subsequence (#1143), Edit Distance (#72)

---

## 5. 區間 DP

```python
for length in range(2, n+1):        # 枚舉長度
    for i in range(n - length + 1):  # 枚舉起點
        j = i + length - 1
        for k in range(i, j):        # 枚舉分割點
            dp[i][j] = max(dp[i][j], dp[i][k] + dp[k+1][j] + cost)
```
例題: Burst Balloons (#312), Matrix Chain Multiplication

---

## 速查表

| 類型 | 複雜度 | 特徵 |
|------|--------|------|
| 線性 1D | O(n) | 只依賴前幾項 |
| 背包 | O(n×W) | 選或不選 |
| 二維 | O(m×n) | 兩個序列比較 |
| 區間 | O(n³) | 分割問題 |
