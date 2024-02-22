---
title: "[Spring Boot] 스프링부트 @Annotation 정리"
description: 스프링부트 어노테이션 정리
date: 2024-02-21 00:00:00+0900
image: cover.png
categories:
  - Backend Studies
tags:
  - Spring Boot
  - Annotation
---

## @Annotation

코드에 부가적인 정보를 제공하는 메타데이터의 형태. 어노테이션은 @ 기호로 시작하며, 클래스, 메서드, 필드 등의 선언부에 적용될 수 있음.

### Spring framework에서의 Annotation

**런타임 처리**: 어노테이션을 사용하여 런타임에 동적으로 처리할 수 있는 정보를 제공합니다. 예를 들어, 스프링 프레임워크에서 @Autowired 어노테이션은 의존성 주입(Dependency Injection)을 위해 사용됩니다.

**코드 분석 도구와의 통합**: 어노테이션을 사용하여 코드를 분석하고 검증하는 도구와 통합할 수 있습니다. 예를 들어, 테스트 코드에서 특정 메서드에 대한 테스트를 자동으로 생성하기 위해 JUnit은 @Test 어노테이션을 사용합니다.

## Spring Boot 어노테이션 정리

- @Setter, @Getter  
  클래스의 필드에 대해 set, get 메서드를 자동으로 만들어줌

- @Entity  
  해당 클래스가 데이터베이스 테이블과 매핑되는 엔티티 클래스임을 명시, JPA가 해당 클래스를 데이터베이스의 테이블과 매핑할 수 있도록 지정

- @RequiredArgsConstructor  
  해당 클래스의 필드를 기반으로 한 생성자를 자동으로 생성.  
  이 생성자는 해당 클래스의 final로 선언된 필드들을 매개변수로 받으며, 객체를 생성할 때 이러한 필드들에 대한 초기화를 수행.

- @Autowired  
  의존성 주입(Dependency Injection)을 지정하는 데 사용.  
  스프링 컨테이너는 @Autowired가 붙은 필드나 메서드의 매개변수에 해당하는 _빈(Bean)_[^1]을 찾아서 주입.
  참고 : 스프링에서는 필드 주입을 사용할 때 일반적으로 'final' 키워드를 사용할 수 없음.
  [^1]: 스프링 컨테이너에서 관리되는 인스턴스화된 객체

- @GetMapping  
  매핑될 URL을 지정하는데 사용. value= 는 생략 가능
