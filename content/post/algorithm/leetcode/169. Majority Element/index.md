---
title: "169. Majority Element"
description: Top Interview 150 - Array / String
date: 2024-08-06 13:44:49+0900
image: cover/algorithm.png
categories:
  - Algorithm/LeetCode
tags:
  - Array / String
---

## Description

[문제 링크](https://leetcode.com/problems/majority-element/?envType=study-plan-v2&envId=top-interview-150)

Given an array `nums` of size `n`, return _the majority element_.

The majority element is the element that appears more than `⌊n / 2⌋` times. You may assume that the majority element always exists in the array.

**Example 1:**

```
Input: nums = [3,2,3]
Output: 3

```

**Example 2:**

```
Input: nums = [2,2,1,1,1,2,2]
Output: 2

```

**Constraints:**

- `n == nums.length`
- `1 <= n <= 5 * 104`
- `-109 <= nums[i] <= 109`

**Follow-up:** Could you solve the problem in linear time and in `O(1)` space?

## 풀이

배열 안에서 과반수를 찾는 문제이다. 대표적인 풀이로 다음의 세 가지가 있다.

1. 정렬
2. Hash Map
3. Moore Voting Algorithm

배열을 정렬하게 되면, 중앙에는 과반수가 위치하게 되기에 배열의 중앙을 return 해주면 된다.\
Hash Map의 경우 nums[i] 에 대해 해당 키의 value를 +1 해준다.

Moore Voting Algorithm의 경우, 득표수가 동률이 아니라면 1표라도 차이가 나는 점을 이용한다.\
첫번째 수부터 counting을 시작하여 같은 수가 나오면 +1, 다른 수가 나오면 -1을 한다. count가 0이 되면 후보는 그 다음 수가 된다.
이렇게 하면 가장 최빈값이 도출되게 된다.

단, 과반수가 맞는지는 확인을 해야한다(문제에서는 반드시 존재한다고 하여 따로 필요 없음).

## 코드

```python
class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        count = 0
        candidate = None
        for num in nums:
            if count == 0:
                candidate = num
            count += (1 if candidate == num else -1)
        return candidate
```
