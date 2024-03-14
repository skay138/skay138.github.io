---
title: "[Spring Boot] 스프링부트 @Annotation 정리"
description: 스프링부트 어노테이션 정리
date: 2024-02-21 00:00:00+0900
image: cover.png
categories:
  - Backend Studies
tags:
  - Spring Boot
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
  스프링 컨테이너는 @Autowired가 붙은 필드나 메서드의 매개변수에 해당하는 빈(Bean)을 찾아서 주입.  
  참고 : 스프링에서는 필드 주입을 사용할 때 일반적으로 'final' 키워드를 사용할 수 없음.

- @GetMapping  
  매핑될 URL을 지정하는데 사용. value= 는 생략 가능

- @Bean  
   _애플리케이션_[^1] 컨텍스트에 의해 관리되는 객체. IoC 컨테이너에 의해 생성, 조립, 관리됨.
  [^1]: 빈(Bean) 관리, 의존성 주입(Dependency Injection), 생명주기 관리를 담당하는 컨테이너.

- Configuration  
  스프링 애플리케이션 컨텍스트에 대한 구성 클래스를 선언하는 데 사용. 자바 클래스를 스프링의 구성 클래스로 선언할 수 있음.

- @EnableWebSecurity  
  스프링 시큐리티에서 사용되는 애노테이션으로, 웹 보안 설정을 활성화하는 데 사용한다.

- @EnableMethodSecurity
  메소드 호출에 대한 보안 규칙을 정의하고 적용하는 데 사용하는 어노테이션
  prePostEnabled 속성을 true로 설정하면 @PreAuthorize, @PostAuthorize, @PreFilter, @PostFilter 어노테이션을 활성화할 수 있다.

- @PreAuthorize("isAuthenticated()")
  메소드가 호출되기 전에 미리 정의된 보안 조건을 검사
  isAuthenticated()을 사용하면 현재 사용자의 인증여부를 확인하는 데 사용할 수 있음.

- @SpringBootTest  
  스프링 컨테이너와 테스트를 함께 실행함

- @Transactional  
  테스트 케이스에 이 어노테이션이 있으면 테스트 시작 전에 트랙잭션을 시작하고, 테스트 완료 후에 항상 롤백한다. DB에 데이터가 남지 않아서 다음 테스트에 영향을 주지 않음.
