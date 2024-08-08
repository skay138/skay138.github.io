---
image: cover/springboot.png
title: Spring Data JPA(QueryDSL) 원하는 컬럼만 조회하기
description: QueryDSL Projections
date: 2024-08-05T02:27:50.283Z
categories: Backend Studies/Spring Boot
tags:
  - QueryDSL
---

보통 ORM을 사용하다 보면, DB에서 객체로 데이터를 가져옵니다. Entity의 컬럼 수가 적거나, join을 많이 하지 않는다면 성능상 크게 문제가 되지 않지만 DB 설계가 복잡해질수록 모든 컬럼을 가져와서 DTO로 변환시키는 행위는 지양해야 한다고 생각합니다. 이는 성능 문제로 이어지기 때문이죠.

Query문 작성에 있어 필요한 컬럼만 가져오기는 기본 중의 기본이기에, 한번 알아보도록 합시다.

## Mapping By Interface

```java
public interface infoMapping {
  String getTitle();
  String getContent();
}

public interface MyRepository extends JpaRepository<Info, Long> {
  List<InfoMapping> findAllById(Long id);
}

```

위와 같이 Entity 테이블의 파라미터에 맞게 인터페이스를 작성하면, InfoEntity에서 원하는 컬럼(title, content)만 가져올 수 있게 됩니다. 이 경우 InfoMapping를 반환하기 때문에 만약 ResponseDTO를 사용한다면 한번의 변환과정이 필요합니다.

## QueryDSL Projections

이 방법은 개인적으로 선호하는 방식입니다.\
SQL을 작성할 때 좀더 세밀하게 컨트롤할 수 있고, 데이터를 바로 ResponseDTO에 매핑할 수 있습니다.\
예를 들어 게시글의 ResponseDTO의 경우, author(작성자) 에 대한 정보가 포함되어야 할 수 있습니다. author의 정보 역시 전부 필요하지 않을 수 있기에 어떤 데이터만을 가져올 지 Projection을 통해 지정할 수 있습니다.

### Scalar Projection

* 특정 필드만을 선택하여 조회하는 방식입니다.
* 예를 들어, QUser.user.name과 같이 단일 필드를 선택합니다.

적용 상황

* 단일 필드 또는 소수의 필드만을 조회할 때.
* 간단한 값의 리스트를 반환해야 할 때.

```java
List<String> names = queryFactory
    .select(QUser.user.name)
    .from(QUser.user)
    .fetch();
```

### Tuple Projections

* 여러 필드를 선택하여 Tuple 객체로 조회하는 방식입니다.
* 각 필드에 접근할 때는 get 메서드를 사용합니다.

적용 상황

* 여러 필드를 조회하되, DTO 클래스를 만들기 부담스러울 때.
* 간단하게 여러 값의 쌍을 반환하고 싶을 때.

```java
List<Tuple> results = queryFactory
    .select(QUser.user.name, QUser.user.age)
    .from(QUser.user)
    .fetch();

for (Tuple tuple : results) {
    String name = tuple.get(QUser.user.name);
    Integer age = tuple.get(QUser.user.age);
}

```

### Bean Projections

* 결과를 JavaBean 객체로 변환하는 방식입니다. 주로 DTO(Data Transfer Object)를 사용합니다.
* Projections.bean 메서드를 사용합니다.

적용 상황

* 캡슐화된 DTO 클래스를 사용하고, getter/setter 메서드를 통해 필드에 접근할 때.
* 스프링 프레임워크와 통합하여 사용할 때.

```java
List<UserDTO> results = queryFactory
    .select(Projections.bean(UserDTO.class,
        QUser.user.name,
        QUser.user.age))
    .from(QUser.user)
    .fetch();
```

### Constructor Projections

* DTO의 생성자를 통해 값을 주입하는 방식입니다.
* Projections.constructor 메서드를 사용합니다.

적용 상황

* DTO 클래스에 매핑할 때 생성자를 사용하고 싶은 경우.
* 필드 초기화가 복잡하거나 immutable 객체를 생성할 때.

```java
List<UserDTO> results = queryFactory
    .select(Projections.constructor(UserDTO.class,
        QUser.user.name,
        QUser.user.age))
    .from(QUser.user)
    .fetch();
```

### Fields Projections

* DTO의 필드에 직접 값을 주입하는 방식입니다.
* Projections.fields 메서드를 사용합니다.
* Bean Projections과 동작 방식은 비슷합니다.

```java
List<UserDTO> results = queryFactory
    .select(Projections.fields(UserDTO.class,
        QUser.user.name,
        QUser.user.age))
    .from(QUser.user)
    .fetch();
```

### Mapping Projections

* 직접 커스텀 매핑 로직을 정의하여 결과를 변환하는 방식입니다.
* ExpressionUtils.as 등을 사용하여 커스텀 매핑을 정의할 수 있습니다.

적용 상황

* 복잡한 커스텀 매핑 로직이 필요한 경우.
* 서브쿼리 결과를 특정 필드에 매핑할 때.

```java
List<UserDTO> results = queryFactory
    .select(Projections.bean(UserDTO.class,
        QUser.user.name.as("username"),
        ExpressionUtils.as(
            JPAExpressions.select(QOrder.order.count())
                .from(QOrder.order)
                .where(QOrder.order.user.id.eq(QUser.user.id)), "orderCount")))
    .from(QUser.user)
    .fetch();
```

## 예시

```java
public Slice<CommentResponseDTO> findByAuthorId(Long id, Pageable pageable) {
        QCommentEntity c = QCommentEntity.commentEntity;
        QMember m = QMember.member;
        QCommunityEntity p = QCommunityEntity.communityEntity;
        JPAQuery<CommentResponseDTO> query = queryFactory
                .select(
                        Projections.bean(CommentResponseDTO.class,
                                c.id,
                                c.content,
                                c.createdTime,
                                c.updatedTime,
                                c.parent.id.as("parentId"),
                                Projections.bean(MemberSummaryResponseDTO.class,
                                        m.id,
                                        m.name,
                                        m.email).as("author"),
                                Projections.bean(CommunitySummaryResponseDTO.class,
                                        p.id,
                                        p.title).as("community")
                        ))
                .from(c)
                .leftJoin(c.author, m)
                .leftJoin(c.community, p)
                .where(c.author.id.eq(id).and(c.deleted.isFalse()))
                .orderBy(c.createdTime.desc());

                // 페이지네이션 적용
                List<CommentResponseDTO> content = query
                        .offset(pageable.getOffset())
                        .limit(pageable.getPageSize())
                        .fetch();

                // 총 개수 가져오기(댓글 테이블만 보면 되기에 따로 leftJoin 하지 않음)
                Long count = queryFactory
                        .select(c.count())
                        .from(c)
                        .where(c.author.id.eq(id).and(c.deleted.isFalse()))
                        .fetchOne();

                boolean hasNext = count > pageable.getOffset() + pageable.getPageSize();

                return new SliceImpl<>(content, pageable, hasNext);
    }
```

단순 조회 + 페이징이 필요한 데이터에 대해 Bean Projections을 이용해 ResponseDTO에 매핑한 예시입니다.\
이때, 페이징에 필요한 Query문(count) 역시 필요한 테이블에서만 작업할 수 있습니다.

쿼리를 어떻게 작성하냐에 역시 Backend 성능을 좌우하는 중요한 요소이기에 적절한 고려가 필요하고, 이를 위해 실제 쿼리가 어떻게 호출되는지 디버깅 하며 확인하는 습관을 갖추는게 좋다고 생각합니다.

## 번외: SpringBoot 3.x.x QueryDSL 설정

[Inflearn 참고](https://www.inflearn.com/chats/700670/querydsl-springboot-3-0%EC%9D%98-gradle-%EC%84%A4%EC%A0%95%EC%9D%84-%EA%B3%B5%EC%9C%A0%ED%95%A9%EB%8B%88%EB%8B%A4?gad_source=1\&gclid=Cj0KCQjwzby1BhCQARIsAJ_0t5OY_JVvnlTT4gkh0lHp_1juCEF9j2OB1aG6SY87ad1K-4uvh4YWLEkaAhgCEALw_wcB)

```gradle
plugins {
	id 'java'
	id 'org.springframework.boot' version '3.0.0'
	id 'io.spring.dependency-management' version '1.1.0'
}

group = 'study'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '17'

configurations {
	compileOnly {
		extendsFrom annotationProcessor
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
	implementation 'org.springframework.boot:spring-boot-starter-web'
	compileOnly 'org.projectlombok:lombok'
	runtimeOnly 'com.h2database:h2'
	annotationProcessor 'org.projectlombok:lombok'
	testImplementation 'org.springframework.boot:spring-boot-starter-test'

	// Querydsl 추가
	implementation 'com.querydsl:querydsl-jpa:5.0.0:jakarta'
	annotationProcessor "com.querydsl:querydsl-apt:${dependencyManagement.importedProperties['querydsl.version']}:jakarta"
	annotationProcessor "jakarta.annotation:jakarta.annotation-api"
	annotationProcessor "jakarta.persistence:jakarta.persistence-api"

}

tasks.named('test') {
	useJUnitPlatform()
}
```
