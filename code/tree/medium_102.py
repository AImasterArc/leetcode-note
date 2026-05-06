# LeetCode 102 - Binary Tree Level Order Traversal (Medium)
# 時間複雜度: O(n) | 空間複雜度: O(n)
#
# 思路: BFS 層序遍歷，用 queue 維護當前層的所有節點
# 每次 for 迴圈處理完整一層，結果放進 result

from typing import Optional, List
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        if not root:
            return []

        result = []
        queue = deque([root])

        while queue:
            level_size = len(queue)
            level = []

            for _ in range(level_size):
                node = queue.popleft()
                level.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)

            result.append(level)

        return result
