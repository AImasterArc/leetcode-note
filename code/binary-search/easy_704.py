# LeetCode 704 - Binary Search (Easy)
# 時間複雜度: O(log n) | 空間複雜度: O(1)
#
# 萬用模板: 左閉右閉 [left, right]
# 終止條件: left > right
# 關鍵: mid = left + (right - left) // 2 避免整數溢位

from typing import List

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums) - 1

        while left <= right:
            mid = left + (right - left) // 2

            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1

        return -1
