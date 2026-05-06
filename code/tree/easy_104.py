# LeetCode 104 - Maximum Depth of Binary Tree (Easy)
# 時間複雜度: O(n) | 空間複雜度: O(h) h=樹高
#
# 思路: DFS 後序遍歷，左右子樹深度取較大值 + 1

from typing import Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))
