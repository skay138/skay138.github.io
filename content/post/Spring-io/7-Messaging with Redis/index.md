---
image: /cover/springboot.png
title: '[Spring Boot] Messaging with Redis'
description: using Spring Data Redis to publish and subscribe to messages sent with Redis.
date: 2024-03-15T12:08:56.000Z
categories:
  - Backend Studies
tags:
  - Spring Boot
---

## What You Will Build

`StringRedisTemplate`를 이용하여 메세지를 게시하고, `MessageListenerAdapter`를 이용하여 메세지를 가져오는 POJO를 구현할 겁니다.

## Standing up a Redis server

메세지의 수신과 송신을 컨트롤하기 위한 서버가 필요하기 때문에, Redis를 설치해서 서버를 띄워야 합니다.\
Redis는 key-value의 데이터 저장소이며, 메세징 시스템을 제공합니다. 참고로 Redis는 캐싱에도 이용되는데 ![여기에](https://skay138.github.io/p/django-api-improvement-cache/) 간단하게 정리해뒀습니다!\
Redis 설치는 [https://redis.io/download](https://redis.io/download)에서 가능합니다.
