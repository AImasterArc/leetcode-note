# 🔗 Linked List 解題技巧

## 必備技巧

### 1. Dummy Head（虛擬頭節點）

```python
dummy = ListNode(0)
dummy.next = head
cur = dummy
# 操作完後 return dummy.next
```
用途：避免處理 head 被刪除的邊界情況。

### 2. 找中點（快慢指針）

```python
def find_mid(head):
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    return slow  # slow 在中點（偶數長度時取前半的尾）
```

### 3. 反轉鏈結串列

```python
def reverse(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev, curr = curr, nxt
    return prev
```

### 4. 合併兩個有序鏈結串列

```python
def merge(l1, l2):
    dummy = cur = ListNode(0)
    while l1 and l2:
        if l1.val <= l2.val:
            cur.next, l1 = l1, l1.next
        else:
            cur.next, l2 = l2, l2.next
        cur = cur.next
    cur.next = l1 or l2
    return dummy.next
```

---

## 常見問題解法

| 問題 | 技巧 |
|------|------|
| 偵測環 | 快慢指針 |
| 找環入口 | 快慢相遇後，慢指針從 head 重新走 |
| 倒數第 k 個節點 | 快指針先走 k 步 |
| 回文鏈結串列 | 找中點 + 反轉後半 + 比較 |
| 重排鏈結串列 | 找中點 + 反轉後半 + 交錯合併 |
