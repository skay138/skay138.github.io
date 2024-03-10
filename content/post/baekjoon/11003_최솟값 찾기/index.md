---
title: "[백준] 11003번 : 최솟값 찾기"
description: 슬라이딩 윈도우, 데크
date: 2024-03-09 00:00:10+0900
image: cover.png
categories:
  - Algorithm
tags:
  - 백준
  - 슬라이딩 윈도우
  - 데크
---

## 문제

[문제 링크](https://www.acmicpc.net/problem/11003)

N개의 수 A1, A2, ..., AN과 L이 주어진다.

Di = Ai-L+1 ~ Ai 중의 최솟값이라고 할 때, D에 저장된 수를 출력하는 프로그램을 작성하시오. 이때, i ≤ 0 인 Ai는 무시하고 D를 구해야 한다.

### 입력

첫째 줄에 N과 L이 주어진다. (1 ≤ L ≤ N ≤ 5,000,000)

둘째 줄에는 N개의 수 Ai가 주어진다. (-109 ≤ Ai ≤ 109)

### 출력

첫째 줄에 Di를 공백으로 구분하여 순서대로 출력한다.

### 예제

input :

```
12 3
1 5 2 3 6 2 3 7 3 5 2 6
```

output :

<pre>
1 1 1 2 2 2 2 2 3 3 2 2
</pre>

## 풀이

데이터의 추가는 append로 가능하지만 데이터의 삭제는 양 끝에서 필요하기에 데크를 사용하여 풀이했다.

## 코드

```python
import sys
from collections import deque

n, l = map(int, sys.stdin.readline().split())
a = list(map(int, sys.stdin.readline().split()))

deq = deque()

for i in range(n):
    while deq and deq[-1][1] > a[i]: # 마지막 인덱스의 값이 i번째 인덱스 보다 크다면 pop
        deq.pop()
    deq.append((i, a[i]))

    if(deq[0][0] < i - l + 1): # 0번째 인덱스가 범위 밖으로 나가면 pop
        deq.popleft()
    print(deq[0][1], end=' ')

```
