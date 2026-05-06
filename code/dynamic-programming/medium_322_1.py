# LeetCode 322 - Coin Change (Medium) — 解法 1: Bottom-Up DP
# 時間複雜度: O(amount * len(coins)) | 空間複雜度: O(amount)
#
# 思路: dp[i] = 湊出金額 i 所需最少硬幣數
# 轉移: dp[i] = min(dp[i], dp[i - coin] + 1) for each coin
# 初始化: dp[0] = 0, 其餘 = infinity

from typing import List

class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        dp = [float('inf')] * (amount + 1)
        dp[0] = 0

        for i in range(1, amount + 1):
            for coin in coins:
                if coin <= i:
                    dp[i] = min(dp[i], dp[i - coin] + 1)

        return dp[amount] if dp[amount] != float('inf') else -1
