# 🔗 Linked List 解題技巧

## 核心模式

### 1. Dummy Head（啞節點）

需要操作 head 可能改變的情況，都用 dummy head 避免邊界處理。

```python
dummy = ListNode(0)
dummy.next = head
cur = dummy
# ... 操作 cur.next
return dummy.next
```

**使用場景**: Merge Two Sorted Lists, Remove Nth Node, Partition List

---

### 2. Fast & Slow Pointers（龜兔指針）

| 用途 | fast 速度 | slow 速度 |
|------|-----------|-----------|
| 找中點 | 2 步 | 1 步 |
| 偵測環 | 2 步 | 1 步 |
| 找倒數第 N 個 | 先走 N 步 | 同時走 |

```python
slow = fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
# slow 停在中點 (偶數長度時是前半段最後一個)
```

---

### 3. Floyd's Cycle Detection

**兩階段做法**:
1. Phase 1: slow 走 1 步, fast 走 2 步，找相遇點
2. Phase 2: slow 回 head，同速走，再次相遇就是入環點

**數學推導**:
設 `a` = head 到入環點的距離，`b` = 環內相遇點到入環點距離
- 相遇時: slow 走 `a+b`，fast 走 `2(a+b)`
- 所以 fast 多走 `a+b = k * ring_len`
- 相遇點距入環點 = `ring_len - b`
- 從 head 走 `a` 步 == 從相遇點走 `ring_len - b` 步 → 同時到入環點 ✅

---

### 4. Reverse Linked List

**迭代版 (推薦)**:
```python
prev, cur = None, head
while cur:
    nxt = cur.next
    cur.next = prev
    prev = cur
    cur = nxt
return prev
```

**遞迴版**:
```python
def reverse(head):
    if not head or not head.next:
        return head
    new_head = reverse(head.next)
    head.next.next = head
    head.next = None
    return new_head
```

---

### 5. 常見邊界條件 Checklist

- [ ] `head` 是 `None`
- [ ] 只有一個節點
- [ ] 只有兩個節點
- [ ] 環的起點就是 `head`
- [ ] 操作後確認 tail 的 `next = None`

---

## 複雜度速查

| 操作 | 時間 | 空間 |
|------|------|------|
| 走訪 | O(n) | O(1) |
| 找中點 (Fast/Slow) | O(n) | O(1) |
| Reverse | O(n) | O(1) |
| 偵測環 (Floyd) | O(n) | O(1) |
| 找入環點 (Floyd) | O(n) | O(1) |
