---
image: cover/java.png
title: 자바 Enum 파헤치기
slug: java-enum
description: Java Enum 활용기(우아한기술블로그) 리뷰 - Enum 못쓰면 선배 개발자가 Enum해요!
date: 2024-04-30T05:30:57.299Z
categories: Languages/Java
---

개발자로서 좋은 코드가 무엇인가에 대해 고민합니다.\
어떤 코드가 정답이라고 할 수는 없지만, 저에게 있어 좋은 코드란 다음 세 가지입니다.

1. 리소스를 적게 소모하는 코드: 컴퓨팅 성능을 고려해야 한다.
2. 가독성이 좋은 코드: 커뮤니케이션 및 코드리뷰가 쉬워야 한다.
3. 유지보수가 편한 코드: 서비스 변경의 적용이 쉬워야 한다.

좋은 코드를 작성하게끔 도와줄 `Java Enum`에 대해 공부한 내용을 정리해보려고 합니다.\
[Java Enum 활용기 - **우아한**기술블로그](https://techblog.woowahan.com/2527/)를 참고했습니다.

## Enum이란?

Enum은 서로 관련된 상수들의 집합을 정의하는 데 사용하며, 다음과 같은 장점들을 갖습니다.

- 가독성과 유지보수성 향상:\
  열거형을 사용하면 코드의 가독성을 향상시킬 수 있습니다. 예를 들어, enum을 사용하면 각각의 상수가 명확히 정의되어 있기 때문에 코드를 읽는 사람이 이를 이해하기 쉬워집니다. 또한, 나중에 코드를 유지보수할 때 실수를 방지할 수 있습니다.
- 타입 안정성(Type Safety) 보장:\
   열거형을 사용하면 컴파일러가 상수의 유효성을 검증해주므로 잘못된 상수를 사용하는 오류를 줄일 수 있습니다. 이는 프로그램의 안정성을 높여줍니다.
- 값의 변경 제한:\
   열거형 상수는 불변(Immutable)하며, 한 번 정의된 후에는 변경할 수 없습니다. 이는 값이 변경되는 것을 방지하고 코드의 예측 가능성을 높여줍니다.
- IDE(Integrated Development Environment) 지원:\
   대부분의 현대 IDE는 열거형을 지원하여 코드 작성을 도와줍니다. 예를 들어, 코드 자동 완성 기능을 사용하여 열거형의 상수를 쉽게 찾을 수 있습니다.
- Switch 문의 안전성 향상:\
   열거형을 사용하면 switch문을 사용할 때 해당 열거형에 속하는 모든 상수에 대한 처리를 강제할 수 있습니다. 이는 누락된 경우에 대한 오류를 줄여줍니다.
- 코드의 일관성 유지:\
   관련된 상수를 하나의 열거형으로 그룹화하면 코드의 일관성을 유지할 수 있습니다. 이는 개발자가 프로그램의 다양한 부분에서 동일한 상수를 일관되게 사용할 수 있도록 도와줍니다.

### 기본 활용

다음과 같은 예시 코드가 있다고 가정합니다.

```java
try {
    ...
    if(progress){
        mypageService.happyAtfiDelete(happyAtfiSn);
        code = 200;
    }else{
        code = 400;
    }
} catch (NullPointerException np) {
    np.printStackTrace();
    code = -100;
} catch (IOException ie) {
    ie.printStackTrace();
    code = -100;
} catch (Exception e) {
    e.printStackTrace();
    code = -100;
}

return code;
```

현재 코드에서는 return할 코드값에 대해 직접 값을 입력하고 있습니다.\
문제는 해당 값이 명시적이지 않으며, 추후 유지보수 시 이슈나 실수가 발생할 가능성도 있습니다.

```java
public enum MyPageResultType {
    SUCCESS,
    FAIL,
    EXCEPTION;
}
...
code = MyPageResultType.SUCCESS;
code = MyPageResultType.FAIL;
code = MyPageResultType.EXCEPTION;
```

이 경우 Enum class를 선언하고 code값으로 해당 값을 전달함으로 이를 해결할 수 있습니다.\
Enum값에 따라 code에는 "SUCCESS", "FAIL", "EXCEPTION"이 담기게 됩니다.

## Java의 Enum

Java의 Enum은 완전한 기능을 갖춘 **클래스**이기에 기존 Enum보다 더 많은 장점을 가지고 있습니다.

### 데이터들 간의 연관관계 표현

기본 활용에서 예시를 들었던 코드에서, `code`에 `name`이외의 값을 담고 싶다면 어떻게 해야할까요?

```java
public enum MyPageResultType {
    SUCCESS(200),
    FAIL(400),
    EXCEPTION(-100);

    private int code;

    MyPageResultType(int code){
        this.code = code;
    }

    public int getCode(){return code;}
}
...
code = MyPageResultType.SUCCESS.getCode();
```

구현된 코드를 보면 "SUCCESS"와 200이 동일한 묶음으로 취급할 수 있다는 것을 파악할 수 있고, `getCode()`를 통해 변수에 코드값을 바로 대입할 수 있습니다.

### 상태와 행위를 한곳에서 정리

DB에 저장된 code값에 따라 다른 계산식을 적용해야 하는 상황을 가정해봅시다.

```java
String code = selectCodeFromDB(); //DB에서 조회
Double value = 1000;
Double result = Calculator.calculate(code, value); //계산 메소드 실행

//Calculator는 if문이나 switch문으로 구성
```

분명 요구사항에 맞게 작동은 하겠지만 몇 가지 문제가 발생할 수 있습니다.

1. Calculator와 `code`의 연관관계를 표현하지 못함.
2. `code`에 잘못된 값이 들어갈 수 있음.
3. 관리 차원의 문제: 메소드 중복 생성, 메소드 호출 누락, 관리 포인트 증가 등

아래는 Enum을 활용하여 개선한 코드입니다.

```java
public enum CalculatorType {
    CAL_A("Student", value -> value * 0.8),
    CAL_B("Adult", value -> value),
    CAL_C("Senior", value -> value * 0.5);

    private String title;

    private Function<Double, Double> expression;

    CalculatorType(String title, Function<Double, Double> expression) {
        this.title = title;
        this.expression = expression;
    }

    public Double calculate(double value) {
        return expression.apply(value);
    }

    public String getTitle() {
        return title;
    }
}
...

@Column
@Enumerated(EnumType.STRING)
private CalculatorType calculatorType;
...

CalculatorType code = selectCodeFromDB();
Double value = 1000;
Double result = code.calculate(value);
```

사람을 나이별로 Type을 나누어 계산한다고 했을 때, 이와 같이 표현하면 별도의 클래스를 구현하지 않고 메소드를 호출할 수 있습니다.\
CalculatorType 클래스에서 `code`와 `calculate()`의 관계를 확인할 수 있어 추후 관리차원에서도 유리할 가능성이 높습니다.

### 데이터 그룹관리

데이터를 그룹별로 관리하는 데도 Enum을 활용할 수 있습니다.

결제 시스템을 구현해야 한다고 했을 때, 결제 데이터에는 **결제 종류**와 **결제 수단**이 있습니다.\
예를 들어, 신용카드 결제는 **결제 수단**이며 카드라는 **결제 종류**에 포함됩니다.

![Java Enum 활용기 발췌](java_enum_group.png)

이 경우에도 Enum을 활용하면 다음과 같은 이점을 얻을 수 있습니다.

1. 둘의 관계 파악
2. 입력값과 출력값 제한(검증 코드 불필요)
3. 그룹별 기능 추가(조건문 불필요)

예시 코드입니다.

```java
public enum PayType {
    ACCOUNT_TRANSFER("계좌이체"),
    REMITTANCE("무통장입금"),
    ON_SITE_PAYMENT("현장결제"),
    TOSS("토스"),
    PAYCO("페이코"),
    CARD("카드"),
    KAKAO_PAY("카카오페이"),
    POINT("포인트"),
    COUPON("쿠폰"),
    EMPTY("없음");

    private String title;

    PayType(String title) {
        this.title = title;
    }

    public String getTitle() {
        return title;
    }

}
```

Enum으로 결제 종류를 만들고, `PayGroup`에서 이를 사용하도록 작성합니다.

```java
public enum PayGroup {
    CASH("현금", Arrays.asList(PayType.ACCOUNT_TRANSFER, PayType.REMITTANCE, PayType.ON_SITE_PAYMENT, PayType.TOSS)),
    CARD("카드", Arrays.asList(PayType.PAYCO, PayType.CARD, PayType.KAKAO_PAY)),
    ETC("기타", Arrays.asList(PayType.POINT, PayType.COUPON)),
    EMPTY("없음", Collections.emptyList());

    private String title;
    private List<PayType> payList;

    PayGroup(String title, List<PayType> payList) {
        this.title = title;
        this.payList = payList;
    }

    public static PayGroup findByPayType(PayType payType) {
        return Arrays.stream(PayGroup.values())
        .filter(PayGroup -> PayGroup.hasPayCode(payType)).findAny()
                .orElse(EMPTY);
    }

    public boolean hasPayCode(PayType payType) {
        return payList.stream().anyMatch(pay -> pay == payType);
    }

    public String getTitle() {
        return title;
    }
}
```

이는 다음과 같이 활용할 수 있습니다.

```java
@Test
public void PayGroup_테스트() throws Exception {
    PayType payType = selectPayTypeFromDB(); //payType = "KAKAO_PAY"
    PayGroup payGroup = PayGroup.findByPayType(payType);

    assertThat(payType.name()).isEqualTo("KAKAO_PAY");
    assertThat(payType.getTitle()).isEqualTo("카카오페이");
    assertThat(payGroup.getTitle()).isEqualTo("카드");
}
```

### 객체로 데이터 관리

카테고리 데이터를 핸들링할 때도 활용할 수 있습니다.

JSON 형태로 카테고리 데이터를 보내는 경우입니다.\
Enum을 바로 JSON으로 return하게 되면 `name()`만 출력됩니다.

```json
data = {
    code='code',
    title='title'
}
```

위와 같은 형태로 데이터를 전송해야 한다고 가정해보겠습니다.

이를 위해 클래스의 생성자가 일관된 타입을 받을 수 있도록 인터페이스를 만들어야 합니다.

```java
public interface EnumMapperType {
    String getCode();
    String getTitle();
}
```

값을 담을 클래스는 이 인터페이스를 생성자 인자로 받아 인스턴스를 생성해야 합니다.

```java
public class EnumMapperValue {
    private String code;
    private String title;

    public EnumMapperValue(EnumMapperType enumMapperType) {
        code = enumMapperType.getCode();
        title = enumMapperType.getTitle();
    }

    public String getCode() {
        return code;
    }

    public String getTitle() {
        return title;
    }

    @Override
    public String toString() {
        return "{" +
                "code='" + code + '\'' +
                ", title='" + title + '\'' +
                '}';
    }
}
```

Enum은 `EnumMapperType` 인터페이스의 구현체가 됩니다.

```java
public enum FeeType implements EnumMapperType {
    PERCENT("정율"),
    MONEY("정액");

    private String title;

    FeeType(String title) {
        this.title = title;
    }

    @Override
    public String getCode() {
        return name();
    }

    @Override
    public String getTitle() {
        return title;
    }
}
```

이제 JSON형태로 데이터를 보내기 위해서 EnumMapperValue 클래스로 변환 후 전달하면 됩니다.

```java
return Arrays.stream(FeeType.values())
    .map(EnumMapperValue::new)
    .collect(Collectors.toList());
```

이 코드는 클래스를 변환할 때마다 **인스턴스를 생성**합니다.\
Enum의 상수들은 Runtime환경에서 변경될 일이 없기 때문에, Bean에 등록하여 사용하면 더욱 효율적으로 관리할 수 있습니다.

이를 위해 EnumMapperValue 클래스를 담을 팩토리 클래스를 생성합니다.

```java
public class EnumMapperFactory {

    private Map<String, List<EnumMapperValue>> factory = new LinkedHashMap<>();

    public EnumMapperFactory() {
    }

    public void put(String key, Class<? extends EnumMapperType> e) {
        factory.put(key, toEnumValues(e));
    }

    private List<EnumMapperValue> toEnumValues(Class<? extends EnumMapperType> e) {
        return Arrays.stream(e.getEnumConstants())
            .map(EnumMapperValue::new)
            .collect(Collectors.toList());
    }

    public List<EnumMapperValue> get(String key) {
        return factory.get(key);
    }

    public Map<String, List<EnumMapperValue>> get(List<String> keys) {

        return Optional.ofNullable(keys)
                .filter(k -> !k.isEmpty())
                .map(k -> k.stream().collect(Collectors.toMap(Function.identity(), factory::get)))
                .orElseGet(LinkedHashMap::new);
    }

    public Map<String, List<EnumMapperValue>> getAll() {
        return factory;
    }
}
```

- `String key`: EnumValue 인스턴스 이름
- `Class<? extends EnumMapperType> e`: EnumMapperType의 구현체만 오도록 제한

마지막으로, Bean으로 등록한 뒤 원하는 곳에서 `get()`할 수 있습니다.

```java
@Bean
public EnumMapperFactory enumMapperFactory() {
    EnumMapperFactory enumMapperFactory = new EnumMapperFactory();

    enumMapperFactory.put("FeeType", FeeType.class);
    // 관리할 Enum이 있다면 추가 등록

    return enumMapperFactory;
}
...
//example controller GET
return enumMapperFactory.get("FeeType");
```

## 마무리

가변적이지 않은 데이터의 핸들링에 있어, 직접 입력하지 않고 Enum을 활용한다면 많은 이점을 얻을 수 있다는 점을 배웠습니다.

한 로직을 처리할 때 Enum을 활용하지 않는다면

1. 메소드에 어떤 값들이 허용이 되는지
2. 로직을 처리하기 위해 수행되어야 할 메소드는 무엇이 있는지
3. 데이터값이 의미하는 내용이 무엇인지
4. 조건문을 통한 로직 구분

등 여러가지 불편한 점이 발생할 수 있습니다.

물론 Enum으로 모든걸 해결하려고 하면 안되지만, Enum을 적용함으로써 클래스 간 역할과 책임을 더욱 적극적으로 분배할 수 있음은 중요하다고 생각합니다.
