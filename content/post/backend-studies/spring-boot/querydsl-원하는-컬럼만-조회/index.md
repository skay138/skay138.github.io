---
image: cover/springboot.png
title: Spring Data JPA(QueryDSL) 원하는 컬럼만 조회하기
description: QueryDSL Projections
date: 2024-08-05T02:27:50.283Z
categories: Backend Studies/Spring Boot
tags:
  - QueryDSL
---

## 시작하며

ORM을 사용할 때 보통 데이터베이스에서 엔티티로 데이터를 가져옵니다. 잘 설계된 데이터베이스 테이블은 일반적으로 컬럼 수가 20개를 넘지 않기 때문에, 기본적으로 엔티티를 매핑하는 것이 좋습니다.

지연 로딩과 FetchJoin, BatchSize 등으로 성능 최적화가 가능하다면 그렇게 해결하는 게 좋다고 생각합니다.

그러나 특정 경우에는 필요한 컬럼만 조회하기 위해 인터페이스나 DTO를 사용하여 Repository에서 데이터를 반환하는 방법도 고려해봐야 합니다. 이 경우 다음과 같은 점을 신경써야 합니다.

- 재사용성 저하: DTO나 인터페이스를 사용하면 메소드의 재사용성이 떨어질 수 있습니다. 각 메소드마다 별도의 DTO를 정의하고 관리해야 할 수 있습니다.
- 성능 트레이드 오프: 특정 컬럼만 조회하는 것이 성능상 이점이 있을 수 있지만, 이로 인해 발생하는 코드의 복잡성과 유지보수성 문제는 트레이드 오프가 될 수 있습니다.

자세한 내용은 `JPA 성능 최적화` 키워드와 관련하여 검색하면 양질의 글들이 많습니다.

제 생각에 특히 자주 호출되는 메소드는 불필요한 테이블과의 조인을 지양해야한다고 보기에 성능 최적화가 필요한 경우를 위해 원하는 컬럼만 매핑하여 반환하는 방법을 알아두면 나쁘지 않다고 봅니다.

## 예시

```java
public Slice<CommentEntity> findByAuthorId(Long id, Pageable pageable) {

        JPAQuery<CommentEntity> query = queryFactory
                .select(
                        commentEntity
                )
                .from(commentEntity)
                .leftJoin(commentEntity.community, communityEntity).fetchJoin()
                .where(commentEntity.author.id.eq(id).and(commentEntity.deleted.isFalse()))
                .orderBy(commentEntity.createdTime.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize());

        List<CommentEntity> content = query.fetch();
        boolean hasNext = content.size() == pageable.getPageSize();

        return new SliceImpl<>(content, pageable, hasNext);
    }
```

사용자가 작성한 댓글과, 이에 대한 게시글(community) 정보를 가져오기 위한 쿼리입니다. 만약 commentEntity자체를 select해오게 되면 쿼리가 다음과 같습니다.

```log
   select
        ce1_0.id,
        ce1_0.author_id,
        c1_0.id,
        c1_0.animal,
        c1_0.author_id,
        c1_0.category,
        (SELECT
            count(1)
        FROM
            comments r
        WHERE
            r.community_id = c1_0.id),
        c1_0.content,
        c1_0.created_time,
        c1_0.file_group_id,
        c1_0.hashtag,
        (SELECT
            count(1)
        FROM
            likes l
        WHERE
            l.community_id = c1_0.id),
        c1_0.title,
        c1_0.updated_time,
        ce1_0.content,
        ce1_0.created_time,
        ce1_0.deleted,
        ce1_0.parent_id,
        ce1_0.updated_time
    from
        comments ce1_0
    left join
        community c1_0
            on c1_0.id=ce1_0.community_id
    where
        ce1_0.author_id=?
        and ce1_0.deleted=?
    order by
        ce1_0.created_time desc
    limit
        ?, ?
```

community 테이블에 매핑되어 있는 댓글 수 쿼리와 좋아요 수 쿼리 때문에 두 테이블을 더 join하고 있습니다.\
community 테이블을 수정하여 해결할 수도 있지만 당장 community 테이블을 수정할 수 있는 상황이 아니였기에 comment 테이블을 수정하기로 했습니다.

```java
public Slice<CommentEntity> findByAuthorId(Long id, Pageable pageable) {

        JPAQuery<CommentEntity> query = queryFactory
                .select(
                        Projections.fields(
                                CommentEntity.class,
                                commentEntity.id,
                                commentEntity.content,
                                commentEntity.createdTime,
                                commentEntity.updatedTime,
                                commentEntity.parent.id.as("parentId"),
                                Projections.fields(CommunityEntity.class,
                                        communityEntity.id,
                                        communityEntity.title
                                ).as("community")
                        )
                )
                .from(commentEntity)
                .leftJoin(commentEntity.community, communityEntity)
                .where(commentEntity.author.id.eq(id).and(commentEntity.deleted.isFalse()))
                .orderBy(commentEntity.createdTime.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize());

        List<CommentEntity> content = query.fetch();
        boolean hasNext = content.size() == pageable.getPageSize();

        return new SliceImpl<>(content, pageable, hasNext);
    }
```

`CommentDTO`가 아닌 `CommentEntity`로 매핑한 이유는, 다른 곳에서 데이터가 활용된다고 가정하여도 현재 쿼리에서 `CommentEntity`가 필요한 컬럼을 충분히 충족할 수 있다고 생각했기 때문입니다. 작성자의 댓글 리스트는 특정한 데이터이기 때문에 재사용성이 크게 중요하지 않다고 판단하고 있고, 필요에 따라 추후에 DTO로 전환하는 것도 고려하고 있습니다.

Projections을 통해 원하는 컬럼만 매핑하게 되면 쿼리를 다음과 같습니다.

```log
Hibernate:
    select
        ce1_0.id,
        ce1_0.content,
        ce1_0.created_time,
        ce1_0.updated_time,
        ce1_0.parent_id,
        ce1_0.community_id,
        c1_0.title
    from
        comments ce1_0
    left join
        community c1_0
            on c1_0.id=ce1_0.community_id
    where
        ce1_0.author_id=?
        and ce1_0.deleted=?
    order by
        ce1_0.created_time desc
    limit
        ?, ?
```

쿼리를 어떻게 작성하냐에 역시 Backend 성능을 좌우하는 중요한 요소이기에 적절한 고려가 필요하고, 이를 위해 실제 쿼리가 어떻게 호출되는지 디버깅 하며 확인하는 습관을 갖추는게 좋다고 생각합니다.

아래는 원하는 컬럼만 조회하는 방법입니다.

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

QueryDSL이 제공하는 Projections을 이용하는 방법도 있습니다.\
저는 개인적으로 이 방법을 더 선호합니다.

### Scalar Projection

- 특정 필드만을 선택하여 조회하는 방식입니다.
- 예를 들어, QUser.user.name과 같이 단일 필드를 선택합니다.

적용 상황

- 단일 필드 또는 소수의 필드만을 조회할 때.
- 간단한 값의 리스트를 반환해야 할 때.

```java
List<String> names = queryFactory
    .select(QUser.user.name)
    .from(QUser.user)
    .fetch();
```

### Tuple Projections

- 여러 필드를 선택하여 Tuple 객체로 조회하는 방식입니다.
- 각 필드에 접근할 때는 get 메서드를 사용합니다.

적용 상황

- 여러 필드를 조회하되, DTO 클래스를 만들기 부담스러울 때.
- 간단하게 여러 값의 쌍을 반환하고 싶을 때.

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

- 결과를 JavaBean 객체로 변환하는 방식입니다. 주로 DTO(Data Transfer Object)를 사용합니다.
- Projections.bean 메서드를 사용합니다.

적용 상황

- 캡슐화된 DTO 클래스를 사용하고, getter/setter 메서드를 통해 필드에 접근할 때.
- 스프링 프레임워크와 통합하여 사용할 때.

```java
List<UserDTO> results = queryFactory
    .select(Projections.bean(UserDTO.class,
        QUser.user.name,
        QUser.user.age))
    .from(QUser.user)
    .fetch();
```

### Constructor Projections

- DTO의 생성자를 통해 값을 주입하는 방식입니다.
- Projections.constructor 메서드를 사용합니다.

적용 상황

- DTO 클래스에 매핑할 때 생성자를 사용하고 싶은 경우.
- 필드 초기화가 복잡하거나 immutable 객체를 생성할 때.

```java
List<UserDTO> results = queryFactory
    .select(Projections.constructor(UserDTO.class,
        QUser.user.name,
        QUser.user.age))
    .from(QUser.user)
    .fetch();
```

### Fields Projections

- DTO의 필드에 직접 값을 주입하는 방식입니다.
- Projections.fields 메서드를 사용합니다.
- Bean Projections과 동작 방식은 비슷합니다.

```java
List<UserDTO> results = queryFactory
    .select(Projections.fields(UserDTO.class,
        QUser.user.name,
        QUser.user.age))
    .from(QUser.user)
    .fetch();
```

### Mapping Projections

- 직접 커스텀 매핑 로직을 정의하여 결과를 변환하는 방식입니다.
- ExpressionUtils.as 등을 사용하여 커스텀 매핑을 정의할 수 있습니다.

적용 상황

- 복잡한 커스텀 매핑 로직이 필요한 경우.
- 서브쿼리 결과를 특정 필드에 매핑할 때.

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

## 번외: SpringBoot 3.x.x QueryDSL 설정

[Inflearn 참고](https://www.inflearn.com/chats/700670/querydsl-springboot-3-0%EC%9D%98-gradle-%EC%84%A4%EC%A0%95%EC%9D%84-%EA%B3%B5%EC%9C%A0%ED%95%A9%EB%8B%88%EB%8B%A4?gad_source=1&gclid=Cj0KCQjwzby1BhCQARIsAJ_0t5OY_JVvnlTT4gkh0lHp_1juCEF9j2OB1aG6SY87ad1K-4uvh4YWLEkaAhgCEALw_wcB)

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
