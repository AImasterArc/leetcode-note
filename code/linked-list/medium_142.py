# LeetCode 142 - Linked List Cycle II (Medium)
# 時間複雜度: O(n) | 空間複雜度: O(1)
#
# 思路: Floyd's Cycle Detection (龜兔賽跑)
# Phase 1: slow 走 1 步, fast 走 2 步，相遇代表有環
# Phase 2: slow 回到 head，兩者同速走，再次相遇即為入環點
#
# 數學推導: 設 head 到入環點距離 = a，入環點到相遇點 = b
# slow 走了 a+b, fast 走了 a+b+n*ring_len
# 2(a+b) = a+b+n*ring_len => a = n*ring_len - b
# 所以 slow 從 head 走 a 步，fast 從相遇點走 a 步，會同時到入環點

from typing import Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def detectCycle(self, head: Optional[ListNode]) -> Optional[ListNode]:
        slow = fast = head

        # Phase 1: 找相遇點
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow == fast:
                break
        else:
            return None  # 無環

        # Phase 2: 找入環點
        slow = head
        while slow != fast:
            slow = slow.next
            fast = fast.next

        return slow
