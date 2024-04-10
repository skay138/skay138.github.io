---
title: "11659번 : 구간 합 구하기 4"
description: 구간 합
slug: baekjoon-11659
date: 2024-03-07 00:00:10+0900
image: "/cover/algorithm.png"
categories:
  - Algorithm/baekjoon
tags:
  - 구간 합
---

## 문제

수 N개가 주어졌을 때, i번째 수부터 j번째 수까지 합을 구하는 프로그램을 작성하시오.

### 입력

첫째 줄에 수의 개수 N과 합을 구해야 하는 횟수 M이 주어진다. 둘째 줄에는 N개의 수가 주어진다. 수는 1,000보다 작거나 같은 자연수이다. 셋째 줄부터 M개의 줄에는 합을 구해야 하는 구간 i와 j가 주어진다.

### 출력

총 M개의 줄에 입력으로 주어진 i번째 수부터 j번째 수까지 합을 출력한다.

### 제한

- 1 ≤ N ≤ 100,000
- 1 ≤ M ≤ 100,000
- 1 ≤ i ≤ j ≤ N

## 풀이

수의 개수가 크기 때문에 구간 합을 미리 구해두고 구간합을 구했다.

## 코드

```python
import sys

N, M = map(int, sys.stdin.readline().split())
S = [int(i) for i in sys.stdin.readline().split()]
D = [0]*N # List for subtotal
D[0] = S[0]
for i in range(1,N):
    D[i] = D[i-1] + S[i] # compute ith index's subtotal

for _ in range(M):
    start, end = map(int, sys.stdin.readline().split())
    if start > 1: # getting value in range
        ans = D[end-1] - D[start-2]
    else : ans = D[end-1]
    print(ans)
```
