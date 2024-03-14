---
title: "[LeetCode] 27. Remove Element"
description: Top Interview 150 - Array / String
slug: leetcode-27
date: 2024-03-11 16:43:21+0900
image: cover.png
categories:
  - Algorithm
tags:
  - LeetCode
  - Array / String
---

## Description

[문제 링크](https://leetcode.com/problems/remove-element/description/?envType=study-plan-v2&envId=top-interview-150)

Given an integer array `nums` and an integer `val`, remove all occurrences of
`val` in `nums` [**in-place**](https://en.wikipedia.org/wiki/In-place_algorithm). The order of the elements may be changed. Then return
_the number of elements in_ `nums` _which are not equal to_ `val`.

Consider the number of elements in `nums` which are not equal to `val` be
`k`, to get accepted, you need to do the following things:

- Change the array `nums` such that the first `k` elements of `nums`
  contain the elements which are not equal to `val`. The remaining elements of
  `nums` are not important as well as the size of `nums`.
- Return `k`.

**Custom Judge:**

The judge will test your solution with the following code:

```
int[] nums = [...]; // Input array
int val = ...; // Value to remove
int[] expectedNums = [...]; // The expected answer with correct length.
                            // It is sorted with no values equaling val.

int k = removeElement(nums, val); // Calls your implementation

assert k == expectedNums.length;
sort(nums, 0, k); // Sort the first k elements of nums
for (int i = 0; i < actualLength; i++) {
    assert nums[i] == expectedNums[i];
}

```

If all assertions pass, then your solution will be **accepted**.

**Example 1:**

```
Input: nums = [3,2,2,3], val = 3
Output: 2, nums = [2,2,_,_]
Explanation: Your function should return k = 2, with the first two elements of nums being 2.
It does not matter what you leave beyond the returned k (hence they are underscores).

```

**Example 2:**

```
Input: nums = [0,1,2,2,3,0,4,2], val = 2
Output: 5, nums = [0,1,4,0,3,_,_,_]
Explanation: Your function should return k = 5, with the first five elements of nums containing 0, 0, 1, 3, and 4.
Note that the five elements can be returned in any order.
It does not matter what you leave beyond the returned k (hence they are underscores).

```

**Constraints:**

- `0 <= nums.length <= 100`
- `0 <= nums[i] <= 50`
- `0 <= val <= 100`

## 풀이

val값을 제외하기 위해 nums를 순회하며 val값이 아니라면, 0번째 인덱스(`idx`)부터 nums[i]를 넣어 nums를 수정했다.  
만약, nums = [3, 2, 2, 3] 이고 val = 3이라면  
nums[0] == 3이고 nums[1] != 3 이기 때문에 nums[0]`idx = 0` 에는 nums[1]이 들어가게 된다.  
이후 nums[2] != val 이니 nums[1]`idx = 1`에 nums[2]가 들어간다.

## 코드

```python
class Solution:
    def removeElement(self, nums: List[int], val: int) -> int:
        idx = 0
        for i in range(len(nums)):
            if nums[i] != val:
                nums[idx] = nums[i]
                idx += 1
        return idx

```
