# LeetCode 21 - Merge Two Sorted Lists (Easy)
# 時間複雜度: O(m+n) | 空間複雜度: O(1)
#
# 思路: dummy head 技巧，比較兩個 list 的 head，
# 較小的接到結果 list，直到其中一個跑完。

from typing import Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode(0)
        cur = dummy

        while list1 and list2:
            if list1.val <= list2.val:
                cur.next = list1
                list1 = list1.next
            else:
                cur.next = list2
                list2 = list2.next
            cur = cur.next

        # 接上剩餘部分
        cur.next = list1 if list1 else list2
        return dummy.next
