# LeetCode 15 - 3Sum (Medium)
# 時間複雜度: O(n²) | 空間複雜度: O(1) 不計排序空間
#
# 思路: 排序後固定最左邊 i，用雙指針在 [i+1, n-1] 找兩數之和 = -nums[i]
# 注意去重: i 跳過重複，left/right 找到解後也跳過重複

from typing import List

class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        result = []

        for i in range(len(nums) - 2):
            if nums[i] > 0:
                break
            if i > 0 and nums[i] == nums[i - 1]:
                continue  # 去重

            left, right = i + 1, len(nums) - 1
            while left < right:
                total = nums[i] + nums[left] + nums[right]
                if total == 0:
                    result.append([nums[i], nums[left], nums[right]])
                    while left < right and nums[left] == nums[left + 1]:
                        left += 1
                    while left < right and nums[right] == nums[right - 1]:
                        right -= 1
                    left += 1
                    right -= 1
                elif total < 0:
                    left += 1
                else:
                    right -= 1

        return result
