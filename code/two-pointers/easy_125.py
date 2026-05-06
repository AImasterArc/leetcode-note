# LeetCode 125 - Valid Palindrome (Easy)
# 時間複雜度: O(n) | 空間複雜度: O(1)
#
# 思路: 左右雙指針，跳過非字母數字，比較字符

class Solution:
    def isPalindrome(self, s: str) -> bool:
        left, right = 0, len(s) - 1

        while left < right:
            while left < right and not s[left].isalnum():
                left += 1
            while left < right and not s[right].isalnum():
                right -= 1

            if s[left].lower() != s[right].lower():
                return False

            left += 1
            right -= 1

        return True
