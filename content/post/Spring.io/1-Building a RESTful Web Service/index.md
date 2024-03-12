---
title: "[Spring Boot] Building a RESTful Web Service"
description: creating a “Hello, World” RESTful web service with Spring
date: 2024-03-12 00:00:01+0900
image: cover.png
categories:
  - Backend Studies
tags:
  - Spring Boot
---

## What You Will Build

`http://localhost:8080/greeting`으로 HTTP GET요청이 들어오면 JSON 데이터를 보내주는 것이 목표이다.

http://localhost:8080/greeting?name=User 와 같은 요청이 들어온다면  
{"id":1,"content":"Hello, User!"} 의 JSON데이터를 보내줘야 한다.

## Create a Resource Representation Class

**src/main/java/com/example/restservice/Greeting.java**

```Java
package com.example.restservice;

public record Greeting(long id, String content) { }
```

record키워드는 [이 곳](https://skay138.github.io/p/java-record-키워드/)에 정리해두었다.

## Create a Resource Controller

**src/main/java/com/example/restservice/GreetingController.java**

```Java
package com.example.restservice;

import java.util.concurrent.atomic.AtomicLong;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GreetingController {

	private static final String template = "Hello, %s!";
	private final AtomicLong counter = new AtomicLong();

	@GetMapping("/greeting")
	public Greeting greeting(@RequestParam(value = "name", defaultValue = "World") String name) {
		return new Greeting(counter.incrementAndGet(), String.format(template, name));
	}
}
```

## 결과

![실행 화면](image.png)

요청할 때마다 id값이 증가하며 JSON데이터가 오는 것을 확인할 수 있다.
