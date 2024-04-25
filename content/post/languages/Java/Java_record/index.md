---
title: "record 키워드"
description: record 정리 및 Lombok과의 비교
slug: record-keyword
date: 2024-03-12 00:00:01+0900
image: /cover/java.png
categories:
  - Languages/Java
tags:
  - record
---

## record

JDK 14에서 추가된 키워드로, 타입과 필드 이름만 필요로 하는 불변 데이터 클래스이다.

```Java
public record Person (String name, String address) {}
```

### 기본 기능

**Constructor**

```Java
public Person(String name, String address) {
    this.name = name;
    this.address = address;
}
```

**Getters**

```Java
@Test
public void givenValidNameAndAddress_whenGetNameAndAddress_thenExpectedValuesReturned() {
    String name = "John Doe";
    String address = "100 Linda Ln.";

    Person person = new Person(name, address);

    assertEquals(name, person.name());
    assertEquals(address, person.address());
}
```

**equals**

```Java
@Test
public void givenSameNameAndAddress_whenEquals_thenPersonsEqual() {
    String name = "John Doe";
    String address = "100 Linda Ln.";

    Person person1 = new Person(name, address);
    Person person2 = new Person(name, address);

    assertTrue(person1.equals(person2));
}
```

**hashCode**

필드값이 모두 일치한다면, 같은 해시코드를 반환한다.(birthday paradox로 인한 충돌을 방지하기 위함)

```Java
@Test
public void givenSameNameAndAddress_whenHashCode_thenPersonsEqual() {
    String name = "John Doe";
    String address = "100 Linda Ln.";

    Person person1 = new Person(name, address);
    Person person2 = new Person(name, address);

    assertEquals(person1.hashCode(), person2.hashCode());
}
```

**toString**

```Java
Person[name=John Doe, address=100 Linda Ln.]
```

## record vs. Lombok

### Small Immutable Objects

**record**

```Java
public record ColorRecord(int red, int green, int blue) {

    public String getHexString() {
        return String.format("#%02X%02X%02X", red, green, blue);
    }
}
```

**Lombok**

```Java
@Value
public class ColorValueObject {
    int red;
    int green;
    int blue;

    public String getHexString() {
        return String.format("#%02X%02X%02X", red, green, blue);
    }
}
```

Lombok도 @value 어노테이션을 통해 불변 데이터 객체 생성을 도와주지만, java 14 이후부터는 record가 더욱 자연스러운 선택이다.

### Transparent Data Carriers

**Lombok**

```Java
@Value
@Getter(AccessLevel.NONE)
public class ColorValueObject {
    int red;
    int green;
    int blue;

    public String getHexString() {
        return String.format("#%02X%02X%02X", red, green, blue);
    }
}
```

일반적으로 record 사용, 멤버 필드를 공개하지 않고 싶다면 Lombok 사용

### Classes With Many Fields

**record**

```Java
public record StudentRecord(
  String firstName,
  String lastName,
  Long studentId,
  String email,
  String phoneNumber,
  String address,
  String country,
  int age) {
}

StudentRecord john = new StudentRecord(
  "John", "Doe", null, "john@doe.com", null, null, "England", 20);

```

**Lombok**

```Java
@Getter
@Builder
public class StudentBuilder {
    private String firstName;
    private String lastName;
    private Long studentId;
    private String email;
    private String phoneNumber;
    private String address;
    private String country;
    private int age;
}

StudentBuilder john = StudentBuilder.builder()
  .firstName("John")
  .lastName("Doe")
  .email("john@doe.com")
  .country("England")
  .age(20)
  .build();
```

필드가 많아질수록 Lombok의 Builder 패턴이 직관적이다.

### Mutable Data

```Java
@Data
@AllArgsConstructor
public class ColorData {

    private int red;
    private int green;
    private int blue;

    public String getHexString() {
        return String.format("#%02X%02X%02X", red, green, blue);
    }

}
```

setter나 default 생성자가 필요할 때 Lombok의 @Data 등의 어노테이션이나 plain Java를 이용해야함.

### Inheritance

```Java
@Value
public class MonochromeColor extends ColorData {

    public MonochromeColor(int grayScale) {
        super(grayScale, grayScale, grayScale);
    }
}
```

record는 상속을 지원하지 않음.
