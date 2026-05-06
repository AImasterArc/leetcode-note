# 🔢 Bit Manipulation 位元運算

## 基礎操作

```python
a & b    # AND：兩位都是1才是1
a | b    # OR：有一個1就是1
a ^ b    # XOR：相同為0，不同為1
~a       # NOT：位元取反
a << k   # 左移 k 位（乘以 2^k）
a >> k   # 右移 k 位（除以 2^k）
```

---

## 常用技巧

```python
# 判斷第 k 位是否為 1
(n >> k) & 1

# 將第 k 位設為 1
n |= (1 << k)

# 將第 k 位清零
n &= ~(1 << k)

# 判斷 n 是否為 2 的冪
n > 0 and (n & (n - 1)) == 0

# 消去最低位的 1
n & (n - 1)

# 只保留最低位的 1
n & (-n)

# 計算 1 的個數
bin(n).count('1')
# 或
count = 0
while n:
    n &= (n - 1)   # 每次消一個 1
    count += 1
```

---

## XOR 應用（核心性質：a^a=0, a^0=a）

```python
# 找出現一次的數（#136，其他出現兩次）
result = 0
for num in nums:
    result ^= num
return result

# 無需臨時變數互換
a ^= b; b ^= a; a ^= b
```

---

## 子集枚舉（位掩碼）

```python
# 枚舉 n 個元素的所有子集
n = len(items)
for mask in range(1 << n):
    subset = [items[i] for i in range(n) if mask & (1 << i)]
```

---

## 常見技巧速查

| 技巧 | 程式碼 | 用途 |
|------|--------|------|
| 消最低1 | `n & (n-1)` | 計算1個數、判斷2的冪 |
| 取最低1 | `n & (-n)` | Fenwick Tree |
| XOR消除 | `a ^= b` | 找只出現一次的數 |
| 位掩碼 | `1 << k` | 子集枚舉 |
