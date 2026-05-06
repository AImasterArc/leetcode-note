# LeetCode 4 - Median of Two Sorted Arrays (Hard)
# 時間複雜度: O(log(min(m,n))) | 空間複雜度: O(1)
#
# 思路: 在較短的 array 上做 Binary Search，找出分割點
# 讓左半部總長 = (m+n+1)//2，且 maxLeft <= minRight (兩個 array 都滿足)
# 即找到正確的 partition

from typing import List

class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        # 確保 nums1 是較短的
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1

        m, n = len(nums1), len(nums2)
        half = (m + n + 1) // 2

        left, right = 0, m
        while left <= right:
            i = (left + right) // 2  # nums1 分割點
            j = half - i             # nums2 分割點

            nums1_left  = nums1[i - 1] if i > 0 else float('-inf')
            nums1_right = nums1[i]     if i < m else float('inf')
            nums2_left  = nums2[j - 1] if j > 0 else float('-inf')
            nums2_right = nums2[j]     if j < n else float('inf')

            if nums1_left <= nums2_right and nums2_left <= nums1_right:
                # 找到正確分割
                max_left = max(nums1_left, nums2_left)
                if (m + n) % 2 == 1:
                    return float(max_left)
                min_right = min(nums1_right, nums2_right)
                return (max_left + min_right) / 2.0
            elif nums1_left > nums2_right:
                right = i - 1
            else:
                left = i + 1
