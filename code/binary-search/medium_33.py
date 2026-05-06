# LeetCode 33 - Search in Rotated Sorted Array (Medium)
# 時間複雜度: O(log n) | 空間複雜度: O(1)
#
# 思路: 旋轉後，mid 必定在其中一段有序的區間
# 先判斷 mid 落在左半段還是右半段，再縮小範圍

from typing import List

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums) - 1

        while left <= right:
            mid = left + (right - left) // 2

            if nums[mid] == target:
                return mid

            # mid 在左半段 (有序部分)
            if nums[left] <= nums[mid]:
                if nums[left] <= target < nums[mid]:
                    right = mid - 1
                else:
                    left = mid + 1
            # mid 在右半段 (有序部分)
            else:
                if nums[mid] < target <= nums[right]:
                    left = mid + 1
                else:
                    right = mid - 1

        return -1
