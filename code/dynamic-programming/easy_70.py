# LeetCode 70 - Climbing Stairs (Easy)
# 時間複雜度: O(n) | 空間複雜度: O(1)
#
# 思路: 到第 n 階的方式 = 從 n-1 階跨 1 步 + 從 n-2 階跨 2 步
# 本質上就是 Fibonacci 數列，用滾動變數節省空間

class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2:
            return n

        prev2, prev1 = 1, 2
        for _ in range(3, n + 1):
            curr = prev1 + prev2
            prev2 = prev1
            prev1 = curr

        return prev1
