---
title: "[LeetCode] 88. Merge Sorted Array"
description: Top Interview 150 - Array / String
slug: leetcode-88
date: 2024-03-10 21:00:10+0900
image: "/cover/algorithm.png"
categories:
  - Algorithm
tags:
  - LeetCode
  - Array / String
---

## Description

[문제 링크](https://leetcode.com/problems/merge-sorted-array/description/?envType=study-plan-v2&envId=top-interview-150)

You are given two integer arrays `nums1` and `nums2`, sorted in **non-decreasing order**, and two integers `m` and `n`, representing the number of elements in `nums1` and `nums2` respectively.

**Merge** `nums1` and `nums2` into a single array sorted in **non-decreasing order**.

The final sorted array should not be returned by the function, but instead be _stored inside the array_ `nums1`. To accommodate this, `nums1` has a length of `m + n`, where the first `m` elements denote the elements that should be merged, and the last `n` elements are set to `0` and should be ignored. `nums2` has a length of `n`.

**Example 1:**

```
Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
Output: [1,2,2,3,5,6]
Explanation: The arrays we are merging are [1,2,3] and [2,5,6].
The result of the merge is [1,2,2,3,5,6] with the underlined elements coming from nums1.

```

**Example 2:**

```
Input: nums1 = [1], m = 1, nums2 = [], n = 0
Output: [1]
Explanation: The arrays we are merging are [1] and [].
The result of the merge is [1].

```

**Example 3:**

```
Input: nums1 = [0], m = 0, nums2 = [1], n = 1
Output: [1]
Explanation: The arrays we are merging are [] and [1].
The result of the merge is [1].
Note that because m = 0, there are no elements in nums1. The 0 is only there to ensure the merge result can fit in nums1.

```

**Constraints:**

- `nums1.length == m + n`
- `nums2.length == n`
- `0 <= m, n <= 200`
- `1 <= m + n <= 200`
- `-109 <= nums1[i], nums2[j] <= 109`

**Follow up:** Can you come up with an algorithm that runs in `O(m + n)` time?

## 풀이

`O(m + n)`의 시간 복잡도를 가지기 위해, 투 포인터 개념을 활용했다.  
7번째 줄에서 `while i>=0:`으로 시도하여 풀고 있었는데 제출하자 오답이 나왔다.  
이는 m이 0일 때 i가 -1이 되어버려 while문이 아예 작동하지 않아 발생한 문제였다.  
i -> j로 바꾼다면 n이 0일 때 nums1 배열을 그대로 둬도 되기에(while문이 작동하지 않아도 되기에) 바꾸어 해결했다.  
Example 2, Example 3이 특수한 상황의 예시를 미리 알려주고 있어서 맞출 수 있었다고 생각한다.

nums1배열을 pop하며 nums2의 원소를 넣은 뒤 sort()메서드를 사용하는 방법도 통과할 것 같은데, 따로 구현해보지는 않았다.

## 코드

```python
class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
            i = m - 1
            j = n - 1
            k = i + j + 1

            while j>= 0:
                if i>= 0 and nums1[i] > nums2[j]:
                    nums1[k] = nums1[i]
                    i -= 1
                else:
                    nums1[k] = nums2[j]
                    j -= 1
                k -= 1

```
