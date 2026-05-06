# 🔤 字串問題技巧

## 常用操作

```python
s = "hello world"
s.lower(), s.upper()
s.split()           # ['hello', 'world']
s.strip()           # 去首尾空白
s.replace('l','r')  # 'herro worrd'
s.startswith('he'), s.endswith('ld')
s.find('ll')        # 2（找不到返回 -1）
s.count('l')        # 3

# 字符判斷
c.isalpha(), c.isdigit(), c.isalnum()
```

---

## 回文判斷

```python
# 簡單
def isPalindrome(s):
    return s == s[::-1]

# 過濾非字母數字
def isPalindrome(s):
    s = ''.join(c.lower() for c in s if c.isalnum())
    return s == s[::-1]

# 雙指針（最佳）
def isPalindrome(s):
    l, r = 0, len(s) - 1
    while l < r:
        while l < r and not s[l].isalnum(): l += 1
        while l < r and not s[r].isalnum(): r -= 1
        if s[l].lower() != s[r].lower(): return False
        l += 1; r -= 1
    return True
```

---

## Anagram 判斷

```python
# Counter
Counter(s) == Counter(t)

# 排序
sorted(s) == sorted(t)

# 26字母計數（最快）
def isAnagram(s, t):
    if len(s) != len(t): return False
    count = [0] * 26
    for a, b in zip(s, t):
        count[ord(a) - ord('a')] += 1
        count[ord(b) - ord('a')] -= 1
    return all(x == 0 for x in count)
```

---

## 字串比較模板

```python
# 最長公共前綴
def longestCommonPrefix(strs):
    prefix = strs[0]
    for s in strs[1:]:
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix: return ""
    return prefix
```

---

## 常見字串題型

| 題目 | 技巧 |
|------|------|
| Valid Palindrome (#125) | 雙指針 |
| Longest Palindromic Substring (#5) | 中心展開 / DP |
| Group Anagrams (#49) | Counter 作 key |
| Longest Common Prefix (#14) | 逐字符比較 |
| Valid Parentheses (#20) | Stack |
