# 🌲 Tree 解題基礎

## 常用遍歷

### DFS（遞迴）

```python
# 前序 Pre-order: root → left → right
def preorder(root):
    if not root: return
    visit(root)
    preorder(root.left)
    preorder(root.right)

# 中序 In-order: left → root → right（BST 排序用）
def inorder(root):
    if not root: return
    inorder(root.left)
    visit(root)
    inorder(root.right)

# 後序 Post-order: left → right → root（刪除/計算大小）
def postorder(root):
    if not root: return
    postorder(root.left)
    postorder(root.right)
    visit(root)
```

### BFS（層序）

```python
from collections import deque

def level_order(root):
    if not root: return []
    result, queue = [], deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:  queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result
```

---

## 常見 DFS 思路

### 傳值向下（Top-down）

```python
def dfs(node, depth):
    if not node: return
    # 用 depth 做判斷
    dfs(node.left,  depth + 1)
    dfs(node.right, depth + 1)
```

### 傳值向上（Bottom-up）

```python
def dfs(node):
    if not node: return 0
    left  = dfs(node.left)
    right = dfs(node.right)
    return max(left, right) + 1   # 例：樹高
```

### 帶全域變數

```python
self.ans = 0
def dfs(node):
    if not node: return 0
    left  = max(0, dfs(node.left))
    right = max(0, dfs(node.right))
    self.ans = max(self.ans, left + right + node.val)
    return max(left, right) + node.val
```
例題: Diameter of Binary Tree (#543), Binary Tree Maximum Path Sum (#124)

---

## BST 特性

```python
# 驗證 BST
def isValidBST(root, lo=float('-inf'), hi=float('inf')):
    if not root: return True
    if not lo < root.val < hi: return False
    return isValidBST(root.left, lo, root.val) and \
           isValidBST(root.right, root.val, hi)

# BST 搜尋 O(log n)
def search(root, val):
    if not root or root.val == val: return root
    return search(root.left if val < root.val else root.right, val)
```

---

## 快速判斷題型

| 關鍵字 | 思路 |
|--------|------|
| 最大深度/最小深度 | Bottom-up DFS |
| 路徑和 | Top-down DFS + 全域最值 |
| 層序/鋸齒形 | BFS |
| 有序/BST | 中序遍歷 |
| 對稱/鏡像 | 同時遞迴兩棵子樹 |
