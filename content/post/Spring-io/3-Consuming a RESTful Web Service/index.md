---
title: "[Spring Boot] Consuming a RESTful Web Service"
description: process of creating an application that consumes a RESTful web service.
date: 2024-03-12 22:43:56+0900
image: "/cover/springboot.png"
categories:
  - Backend Studies
tags:
  - Spring Boot
---

## What You Will Build

`RestTemplate`를 사용하여 API 요청을 통해 랜덤 스프링 인용구를 검색해보자.

## Fetching a REST Resource

[https://github.com/spring-guides/quoters](https://github.com/spring-guides/quoters)를 실행시킨다.  
브라우저나 curl에서 http://localhost:8080/api/로 요청을 보내면 JSON 문서를 받을 수 있으나, 그렇게 유용하지는 않다.  
Spring은 API에 접근하기 위해 `RestTemplate`를 제공한다.

RestTemplate를 이용하기 위해 Spring Application을 작성해보자.

### domain class

필요한 데이터를 담기 위한 domain class 만들기

**src/main/java/com/example/consumingrest/Quote.java**

```Java
package com.example.consumingrest;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record Quote(String type, Value value) { }
```

@JsonIgnoreProperties 어노테이션을 통해 type과 맞지 않는 데이터를 무시할 수 있다.  
만약 name과 Json의 키값이 일치하지 않는다면, @JsonProperty를 통해 설정할 수 있다.

```Java
public record Quote(@JsonProperty("ty") String type, Value value) {
}
```

다음과 같이 작성한다면 ty와 일치하는 JSON 키값이 없기 때문에 type에 null이 나오게 된다.

![예시](image-1.png)

**src/main/java/com/example/consumingrest/Value.java**

```Java
package com.example.consumingrest;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record Value(Long id, String quote) { }
```

Value를 정의하기 위한 recod 클래스이다.

### Application.java

RESTful source를 보기위해 Application class에 다음을 세팅한다.

- output을 보내기 위한 logger
- data 프로세싱을 위한 RestTemplate
- 시작 시 RestTemplate와 데이터를 받아오기 위한 CommandLineRunner

```Java
package com.example.consumingrest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class ConsumingRestApplication {

	private static final Logger log = LoggerFactory.getLogger(ConsumingRestApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(ConsumingRestApplication.class, args);
	}

	@Bean
	public RestTemplate restTemplate(RestTemplateBuilder builder) {
		return builder.build();
	}

	@Bean
	@Profile("!test")
	public CommandLineRunner run(RestTemplate restTemplate) throws Exception {
		return args -> {
			Quote quote = restTemplate.getForObject(
					"http://localhost:8080/api/random", Quote.class);
			log.info(quote.toString());
		};
	}
}
```

마지막으로, application.properties에서 서버 포트를 설정하고 실행시킨다.

```properties
server.port=8081
```

## 결과

![실행 화면](image.png)

Terminal에 데이터가 제대로 수신되는 것을 확인할 수 있다.
