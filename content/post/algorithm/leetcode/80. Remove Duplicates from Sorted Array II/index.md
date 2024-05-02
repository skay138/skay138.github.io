---
title: "80. Remove Duplicates from Sorted Array II"
description: Top Interview 150 - Array / String
date: 2024-05-02 09:24:21+0900
image: cover/algorithm.png
categories:
  - Algorithm/LeetCode
tags:
  - Array / String
---

## Description

[문제 링크](https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/description/?envType=study-plan-v2&envId=top-interview-150)

Given an integer array `nums` sorted in **non-decreasing order**, remove some
duplicates [**in-place**](https://en.wikipedia.org/wiki/In-place_algorithm) such that each unique element appears **at most
twice**. The **relative order** of the elements should be kept the
**same**.

Since it is impossible to change the length of the array in some languages, you must instead have the result
be placed in the **first part** of the array `nums`. More formally, if there are
`k` elements after removing the duplicates, then the first `k` elements of
`nums` should hold the final result. It does not matter what you leave beyond the
first `k` elements.

Return `k` _after placing the final result in the first_ `k` _slots of_ `nums`.

Do **not** allocate extra space for another array. You must do this by **modifying the
input array [in-place](https://en.wikipedia.org/wiki/In-place_algorithm)** with O(1) extra memory.

**Custom Judge:**

The judge will test your solution with the following code:

```
int[] nums = [...]; // Input array
int[] expectedNums = [...]; // The expected answer with correct length

int k = removeDuplicates(nums); // Calls your implementation

assert k == expectedNums.length;
for (int i = 0; i < k; i++) {
    assert nums[i] == expectedNums[i];
}

```

If all assertions pass, then your solution will be **accepted**.

**Example 1:**

```
Input: nums = [1,1,1,2,2,3]
Output: 5, nums = [1,1,2,2,3,_]
Explanation: Your function should return k = 5, with the first five elements of nums being 1, 1, 2, 2 and 3 respectively.
It does not matter what you leave beyond the returned k (hence they are underscores).

```

**Example 2:**

```
Input: nums = [0,0,1,1,1,1,2,3,3]
Output: 7, nums = [0,0,1,1,2,3,3,_,_]
Explanation: Your function should return k = 7, with the first seven elements of nums being 0, 0, 1, 1, 2, 3 and 3 respectively.
It does not matter what you leave beyond the returned k (hence they are underscores).

```

**Constraints:**

- `1 <= nums.length <= 3 * 104`
- `-104 <= nums[i] <= 104`
- `nums` is sorted in **non-decreasing** order.

## Approach 1

### 풀이

`idx = 1`을 선언하여 1번째 인덱스부터 추가될 수를 구합니다.\
같은 수가 2개까지 허용되기에, 추가될 수가 두번째 수인지 아닌지 구분해 줄 `not_twice`변수를 선언했습니다.\
idx번째 인덱스에 수가 추가되어야 할 경우는 두 가지입니다.

1. i번째 수와 i-1번째 수가 같지 않은 경우
2. i번째 수와 i-1번째 수가 같으며, i번째 수가 두번째 수인 경우.

이에 대한 조건문을 작성하며 풀이했습니다.

### 코드

```python
class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        idx =1
        not_twice = True
        for i in range(1, len(nums)):
            if(nums[i] == nums[i-1] and not_twice):
                nums[idx] = nums[i]
                idx += 1
                not_twice = False
            if(nums[i] != nums[i-1]):
                nums[idx] = nums[i]
                idx += 1
                not_twice = True
        return idx
```

## Approach 2

코드 제출 후 Solutions을 참고하며 다른 코드를 참고했습니다.

### 풀이

수에 대해 한번은 중복이 허용되기에, 1번째 인덱스까지는 기존의 수가 들어가면 됩니다.\
이후 i번째 수와 idx-2번째 수를 비교한다면, 같은 수가 2번을 초과하는 경우를 처리할 수 있습니다.

따라서 `idx=2`, `i=2` 부터 **i번째 수가 idx-2와 같지 않은 경우**에만 idx번째 인덱스에 수를 추가합니다.

### 코드

```python
class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        idx = 2
        for i in range(2, len(nums)):
            if(nums[i] != nums[idx-2]):
                nums[idx] = nums[i]
                idx += 1
        return idx
```
