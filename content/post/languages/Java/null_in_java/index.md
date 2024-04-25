---
image: cover/java.png
title: 자바(Spring)에서 null 핸들링하기
slug: null-in-java
description: "스프링캠프 2019[Track 2 Mini-Session]: 자바에서 null을 안전히 다루는 방법(박성철) 리뷰"
date: 2024-04-25T04:03:19.544Z
categories: Languages/Java
---

[스프링캠프 2019[Track 2 Mini-Session]: 자바에서 null을 안전히 다루는 방법(박성철)](https://youtu.be/vX3yY_36Sk4?si=XzxyrYHKkP98xft3) 영상을 시청하며 정리한 글입니다.

## null에 대해서

객체 지향의 시초가 된 논문 [Record Handing - C. A. R. Hoare](https://archive.computerhistory.org/resources/text/Knuth_Don_X4100/PDF_index/k-9-pdf/k-9-u2293-Record-Handling-Hoare.pdf)에서 null에 대해 다음과 같이 정의했습니다.

> 두 객체가 서로 참조 관계에 있을 때, 한 객체가 다른 객체를 참조할 일이 없는 경우\
> (2.2 Partial Functional Relationships p.9 참고)

이는 객체지향 언어에서 특별한 값이 없음을 나타내기 위해 도입했고 이 값을 사용하려고 할 때 오류를 내도록 설계된 것입니다.

하지만 이로 인해 모든 레퍼런스는 값이 있거나 null인 상황이 되어버리며, 프로그래머가 null을 항상 체크해야하는 번거로움이 생겼습니다.

**Java에서의 null**

- 의미가 모호하다.
  - 초기화되지 않음
  - 정의되지 않음
  - 값이 없음
  - null이라는 값이 있음
- 모든 참조의 기본값이 null이며, null이 가능함.

조사에 따르면, 1000여개의 어플리케이션의 소프트웨어 결함이 Native Crash(161)를 제외하면 nullPointer Exception이 많았다고 합니다(149).

따라서 null을 안전하게 다루는 것이 중요합니다.

## null을 안전하게 다루는 방법

어떻게 프로그래밍을 하는 게 좋을지에 대한 원칙과 가이드(중요)

### 단정문(assertion)

```
assert 식1 ;
assert 식1 : 식2;
```

- 부울식인 식1이 거짓이면 AssertionError 발생
- 식2는 AssertionError에 포함될 상세 정보를 만드는 생성식
- -enableassertions 또는 -ea 옵션으로 활성화

```java
private void setRefreshInterval(int interval)
{
    assert interval > 0 && interval <= 1000/MAX_REFRESH_RATE : interval;
    // 이어서 작성
}
```

단, 공개 메서드에는 사용하지 말아야 함.\
기본이 disable이기에 사용자를 알 수 없는 API등에서는 사용하면 안됨(운영에서 무시됨)

### java.util.Objects

**Java 8**

```
- isnull(Object obj)
- nonnull(Object obj)
- requireNonnull(T obj)
- requireNonnull(T obj, String message)
- requireNonnull(T obj, Supplier<String> messageSupplier)
```

**Java 9**

```
- requireNonnullElse(T obj, T defaultObj)
- requireNonnullElseGet(T obj, Supplier<? extends T> Supplier)
```

### java.util.Optional

[Optional - The Mother of All Bikesheds: Stuart Marks](https://www.youtube.com/watch?v=Ej0sss6cq14)

**Rule #1: Never, ever, use null for an Optional variable or return value.**

1. 절대로 Optional 변수와 **반환값에 null을 사용하지 말라**.

**Rule #2: Never use Optional.get() unless you can prove that the Optional is present.**

2. Optional에 값이 들어 있다는 걸 확신하지 않는한 Optional.get()을 쓰지 말라.

**Rule #3: Prefer alternatives to Optional.isPresent() and Optional.get().**

3. Optional.isPresent()이나 Optional.get()외 API를 가능한 사용하라.

**Rule #4: It's generally a bad idea to create an Optional for the specific purpose of chaining methods from it to get a value.**

4. Optional에서 여러 메서드를 연속해서 호출하고 값을 얻기 위해 Optional을 생성하는 건 권장하지 않는다.

**Rule #5: If an Optional chain is nested or has an intermediate result of Optional<Optional<T>>, it's probably too complex.**

5. Optional로 값을 처리하는 중에 그 안에 중간값을 처리하기 위해 또 다른 Optional이 사용되면 너무 복잡해진다.

**Rule #6: Avoid using Optional in fields, method parameters, and collections.**

6. Optional을 **필드, 메서드 매개변수, 집합 자료형에 쓰지 말라**.

**Rule #7: Avoid using identity-sensitive operations on Optionals.**

7. 집합 자료형(List, Set, Map)을 감싸는 데 Optional을 쓰지 말고 빈 집합을 사용하라.

Optional은 반환값으로만 사용하며, 직렬화가 안된다는 사실에 주의하자.

### null 잘 쓰는 법

1. API(매개변수, 반환값)에 null을 최대한 쓰지 말아라.
   - 반환값은 Optional, null 객체, 빈값, 예외로 처리
   - 매개변수는 명확한 메서드 추가 정의
2. 사전 조건과 사후 조건을 확인하라: 계약에 의한 설계(design by contract)
   - 보호절을 통한 사전 조건 확인, 다양한 편의 객체 활용
3. (상태와 같이) null의 범위를 지역(클래스, 메서드)에 제한하라.
4. 초기화를 명확히 하라.

---

**null 잘 쓰는 법 1: API에 null을 최대한 쓰지 말아라**

- null로 지나치게 유연한 메서드를 만들지 말고 **명시적인 메서드**를 만들어라
- null을 반환하지 말라
  - 반환 값이 꼭 있어야 한다면 null을 반환하지 말고 **예외**를 던져라
  - 빈 반환 값은 빈 컬렉션이나 **"null 객체"를 활용**하라
  - 반환 값이 없을 수도 있다면 **Optional을 반환**하라
- 선택적 매개변수는 null 대신 **다형성(메서드 추가 정의; overload)을 사용**해서 표현하라

---

**null 잘 쓰는 법 2: 계약에 의한 설계(Design by Contract)**

> When quality is pursued, productivity follows - K. Fujino

![출처:스프링캠프 2019](design-by-contract.png)

- API 규약을 소비자와 제공자 사이에 지켜야 할 엄격한 계약으로 여기는 설계 방법
- 형식적 규약 외에 **사전 조건**과 **사후 조건**과 **유지 조건**을 포함
- 베르트랑 마이어(Bertrand Meyer) - 에펠(Eiffel) 프로그래밍 언어 제작
- 개방-폐쇄 원칙의 상위 개념

개방-폐쇄 원칙이란 소프트웨어 구성 요소(컴포넌트, 클래스, 모듈, 함수)는 확장에 대해서 개방되어야 하지만, 변경에 대해서는 폐쇄되어야 한다는 의미이다. 즉, 변하는 것은 변하기 쉽게, 변하지 않는 것은 변하는 것에 영향을 받지 않게 설계하는 것을 의미

요약하면, null이 아니여야하는데 null이 들어오는 경우를 확인해야 한다는 겁니다.

---

**null 잘 쓰는 법 3: null의 범위를 지역에 제한하라**

> OOP to me means only messaging, local retention and protection and hiding of state-process, and extreme late-binding of all things. - Alan Kay

- 기본 문제 해결 원칙: 큰 문제는 제어 가능한 작은 문제로 나누어 정복하고 다시 통합한다.
- 상태도 비슷하게 null도 지역적으로 제한할 경우 큰 문제가 안된다.
- 클래스와 메서드를 작게 만들어라.
- 설계가 잘 된 코드에서는 null의 위험도 약해진다.

상태를 클래스와 메서드 안에서만 핸들링하고 다른 곳에서 side effect가 없다면 품질문제가 일어날 확률은 낮습니다.

---

**null 잘 쓰는 법 4: 초기화를 명확히 하라**

- 초기화 시점과 실행 시점이 겹치지 않아야 한다.
- 실행 시점엔 초기화되지 않은 필드가 없어야 한다.
- 실행 시점에 null인 필드는 초기화되지 않았따는 의미가 아닌, **값이 없다는 의미**여야 한다.
- 객체 필드의 생명주기는 모두 **객체의 생명주기와 같아야** 한다.
- **지연 초기화(lazy initialization)** 필드의 경우 **팩토리 메서드**로 null 처리를 캡슐화 하라.

---

## null이 안전하다고 보장해주는 도구

### CheckerFramework

- null 안정성 확인
  @nullable, @Nonnull, @Polynull
- Map 키, 잠금, 순차 자료형(배열, 리스트 등) 색인값, 정규식, 문자열 형식, 단위 등 다수 확인 기능 제공
- 자작 확인 기능 추가 가능
- 특정 환경이나 IDE 독립적

#### 기본 null 정책

- 과도한 어노테이션 사용 예방
- 기본 @Nonnull(필드, 매개변수, 반환값 등)
- 예외적 @nullable(지역 변수, 타입 캐스트 등)
- 패키지, 클래스 수준 정책 설정 @DefaultQualifier

예시 코드

```java
public class Address{
   public final String address1;
   public final @Nullable String address2;
   public final String zipcode;
   public final String city;
   public final String country;

   private Address(String address1, @Nullable String address2, String zipcode, String city, String country){
      // 이어서 작성
   }

   public static Address of(String address1, String zipcode, String city, String country){
      return new Address(address1, null, zipcode, city, country);
   }

}
```
