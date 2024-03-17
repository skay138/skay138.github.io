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

`StringRedisTemplate`를 이용하여 메세지를 게시하고, `MessageListenerAdapter`를 이용하여 메세지를 가져오는 POJO를 구현해봅시다.

## Standing up a Redis server

메세지의 수신과 송신을 컨트롤하기 위한 서버가 필요하기 때문에, Redis를 설치해서 서버를 띄워야 합니다.\
Redis는 key-value의 데이터 저장소이며, 메세징 시스템을 제공합니다. 참고로 Redis는 캐싱에도 이용되는데 [여기에](https://skay138.github.io/p/django-api-improvement-cache/ "\[Django] API 성능을 개선해보자 : 캐싱") 간단하게 정리해뒀습니다!\
Redis 설치는 [https://redis.io/download](https://redis.io/download)에서 가능합니다. 별도의 설정이 없다면 6379포트로 접근하면 이용할 수 있습니다.

Spring프로젝트를 시작할 때 Dependencies에서 Spring Data Redis를 체크하시거나 그냥 넘어가셨다면 직접 추가해주세요.

```gradle
implementation 'org.springframework.boot:spring-boot-starter-data-redis'
```

## Create a Redis Message Receiver

**src/main/java/com/example/messagingredis/Receiver.java**

```java
package com.example.messagingredis;

import java.util.concurrent.atomic.AtomicInteger;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Receiver {
  private static final Logger LOGGER = LoggerFactory.getLogger(Receiver.class);

  private AtomicInteger counter = new AtomicInteger();

  public void receiveMessage(String message) {
    LOGGER.info("Received <" + message + ">");
    counter.incrementAndGet();
  }

  public int getCount() {
    return counter.get();
  }
}
```

Receiver는 메세지를 수신하는 방법을 정의하는 POJO입니다. 메세지 리스너로 등록하면 메서드 이름을 원하는 대로 지정할 수 있습니다.

> 예제에서는 메세지를 수신할 때마다 메세지를 세는 방식으로 동작하여 메세지를 수신했다고 알릴 수 있습니다.

## Register the Listener and Send a Message

Spring Data Redis에서는 수신/송신에 필요한 컴포넌트들을 제공하며, 다음을 설정해야 합니다.

* A connection factory : message listener container와 Redis template을 Redis 서버에 연결
* A message listener container : Receiver등록(메세지 수신)
* A Redis template : 메세지 송신

src/main/java/com/example/messagingredis/MessagingRedisApplication.java

```java
package com.example.messagingredis;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;

@SpringBootApplication
public class MessagingRedisApplication {

  private static final Logger LOGGER = LoggerFactory.getLogger(MessagingRedisApplication.class);

  @Bean
	RedisMessageListenerContainer container(RedisConnectionFactory connectionFactory,
    MessageListenerAdapter listenerAdapter) {

		RedisMessageListenerContainer container = new RedisMessageListenerContainer();
    container.setConnectionFactory(connectionFactory);
    container.addMessageListener(listenerAdapter, new PatternTopic("chat"));

    return container;
  }

  @Bean
	MessageListenerAdapter listenerAdapter(Receiver receiver) {
    return new MessageListenerAdapter(receiver, "receiveMessage");
  }

  @Bean
	Receiver receiver() {
    return new Receiver();
  }

  @Bean
	StringRedisTemplate template(RedisConnectionFactory connectionFactory) {
    return new StringRedisTemplate(connectionFactory);
  }

  public static void main(String[] args) throws InterruptedException {

		ApplicationContext ctx = SpringApplication.run(MessagingRedisApplication.class, args);

		StringRedisTemplate template = ctx.getBean(StringRedisTemplate.class);
		Receiver receiver = ctx.getBean(Receiver.class);

  while (receiver.getCount() == 0) {

    LOGGER.info("Sending message...");
    template.convertAndSend("chat", "Hello from Redis!");
    Thread.sleep(500L);
  }

  System.exit(0);
}
}
```

## 결과
