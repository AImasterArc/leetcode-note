# 🌲 Tree Traversal 深度解析

## 四種遍歷方式對比

| 遍歷 | 順序 | 典型用途 |
|------|------|----------|
| 前序 | 根 → 左 → 右 | 複製樹、序列化 |
| 中序 | 左 → 根 → 右 | BST 排序輸出 |
| 後序 | 左 → 右 → 根 | 刪除樹、計算大小 |
| 層序 | 按層從上到下 | 最小深度、鋸齒形 |

---

## 迭代版遍歷（不用遞迴）

```python
# 中序（最常考）
def inorder_iterative(root):
    result, stack = [], []
    curr = root
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        result.append(curr.val)
        curr = curr.right
    return result

# 後序（用兩個 stack）
def postorder_iterative(root):
    if not root: return []
    s1, s2 = [root], []
    while s1:
        node = s1.pop()
        s2.append(node.val)
        if node.left: s1.append(node.left)
        if node.right: s1.append(node.right)
    return s2[::-1]
```

---

## Morris Traversal（O(1) 空間）

```python
def morris_inorder(root):
    result, curr = [], root
    while curr:
        if not curr.left:
            result.append(curr.val)
            curr = curr.right
        else:
            pred = curr.left
            while pred.right and pred.right != curr:
                pred = pred.right
            if not pred.right:
                pred.right = curr
                curr = curr.left
            else:
                pred.right = None
                result.append(curr.val)
                curr = curr.right
    return result
```

---

## 常用 DFS 計算

```python
# 最大深度
def maxDepth(root):
    if not root: return 0
    return max(maxDepth(root.left), maxDepth(root.right)) + 1

# 直徑（#543）
def diameterOfBinaryTree(root):
    self.ans = 0
    def depth(node):
        if not node: return 0
        l, r = depth(node.left), depth(node.right)
        self.ans = max(self.ans, l + r)
        return max(l, r) + 1
    depth(root)
    return self.ans

# 路徑和 II (#113，DFS + 回溯)
def pathSum(root, target):
    result, path = [], []
    def dfs(node, remain):
        if not node: return
        path.append(node.val)
        if not node.left and not node.right and remain == node.val:
            result.append(path[:])
        dfs(node.left,  remain - node.val)
        dfs(node.right, remain - node.val)
        path.pop()
    dfs(root, target)
    return result
```
