# LeetCode 322 - Coin Change (Medium) — 解法 2: BFS (層序遍歷)
# 時間複雜度: O(amount * len(coins)) | 空間複雜度: O(amount)
#
# 思路: 把問題想成圖的最短路徑
# 節點 = 金額, 邊 = 使用一枚硬幣的轉換
# BFS 的層數 = 最少硬幣數

from typing import List
from collections import deque

class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        if amount == 0:
            return 0

        visited = {0}
        queue = deque([0])
        steps = 0

        while queue:
            steps += 1
            for _ in range(len(queue)):
                curr = queue.popleft()
                for coin in coins:
                    nxt = curr + coin
                    if nxt == amount:
                        return steps
                    if nxt < amount and nxt not in visited:
                        visited.add(nxt)
                        queue.append(nxt)

        return -1
