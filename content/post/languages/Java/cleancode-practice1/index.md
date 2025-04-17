---
title: "클린코드 연습1"
description: 제3장 함수
slug: clean-code-practice-1
date: 2025-04-17 00:00:01+0900
image: /cover/java.png
categories:
  - Languages/Java
tags:
  - CleanCode
---

밥 아저씨의 클린 코드를 읽으며 익숙해지기 위해선 스스로 연습해볼 필요성을 느꼈다.\
아직 개념들이 익숙하지 않기에 기존 코드에 적용하지 않고, 데모 코드로 연습해보려고 한다.

## 🧨 리팩토링 대상 코드

```java
public class OrderProcessor {

   public void processOrder(Order order) {
       if (order.getItems() == null || order.getItems().isEmpty()) {
           System.out.println("주문 항목이 없습니다.");
           return;
       }

       double total = 0;
       for (OrderItem item : order.getItems()) {
           total += item.getPrice() * item.getQuantity();
       }

       if (total > 50000) {
           order.setDiscount(0.1);
           total *= 0.9;
       }

       order.setTotalPrice(total);
       System.out.println("총 결제 금액: " + total);

       // 메일 보내는 로직
       String email = order.getUser().getEmail();
       if (email != null && !email.isEmpty()) {
           System.out.println("메일 발송됨: " + email);
       } else {
           System.out.println("이메일 없음");
       }
   }


}
```

### 코드 분석

현재 `processOrder`는 현재 다음과 같은 책임들이 있다.

- Order 검증
- 결제 금액 계산
- 메일 전송

processOrder에서는 큰 흐름만 관리하고, 세 가지 책임을 적절하게 분배해 보자.

## ⚒ 리팩토링

### OrderProcess.java

```java
public class OrderProcessor {

    public static void processOrder(Order order) {

        if (isInvalidOrder(order)){return;}

        order.applyPricingPolicy();

        System.out.println("총 결제 금액: " + order.getTotalPrice());

        sendEmail(order.getUser().getEmail());

    }

    private static void sendEmail(String email){
        System.out.println("메일 발송됨: " + email);
    }

    private static boolean isInvalidOrder(Order order) {
        if (order.getItems().isEmpty()) {
            System.out.println("주문 항목이 없습니다.");
            return true;
        }

        if (order.getUser().getEmail() == null || order.getUser().getEmail().isEmpty()) {
            System.out.println("이메일 없음");
            return true;
        }

        return false;
    }
}

```

1. Order에 대한 검증은 `isInvalidOrder`에서 처리한다. 부정 연산자를 피하기 위해 valid 대신 invalid를 썼다.
2. 결제 금액 계산은 Order 객체에게 위임했다.
3. sendEmail은 별도의 서비스로 구현하는게 좋아보이지만 연습에선 크게 상관이 없을 것 같아 메서드로만 분리했다.

### Order.java

초기 Order객체에서 작성한 결제 금액 계산함수는 다음과 같았다.

```java
public Double calculateTotalPrice() {

    int price = 0;

    for (OrderItem item : items) {
        price += item.getPrice() * item.getQuantity();
    }

    if(price < DISCOUNT_MINIMUM) {
        this.discount = 0.1;
    }

    return price * (1 - this.discount);

}
```

기존 코드가 Order로 이동했을 뿐 모호한 부분들이 많았다.

1. totalPrice를 계산하기 위한 함수인데 discount의 값이 바뀜
2. totalPrice는 Order객체 내부에 있는데 반환값을 가짐(getTotalPrice와 헷갈림)
3. 이렇게 가져온 값을 다시 `setTotalPrice(calculatedPrice)`와 같이 처리하고 있음.

이 모호한 부분들을 해결하기 위해 함수명을 변경하고, 역할을 조금 더 구분지었다.

```java

@Getter
public class Order {

    private static final Integer MINIMUM_ORDER_FOR_DISCOUNT = 50000;

    private final List<OrderItem> items = new ArrayList<>();

    private Double totalPrice;

    private Double discount;

    private final User user;

    public Order(List<OrderItem> items, User user) {
        this.items.addAll(items);
        this.user = user;
    }

    public void applyPricingPolicy() {
        Double price = calculateSubTotal();
        this.discount = determineDiscount(price);
        this.totalPrice = price * (1 - this.discount);
    }

    private Double calculateSubTotal() {
        double price = 0.0;
        for (OrderItem item : items) {
            price += item.getPrice() * item.getQuantity();
        }
        return price;
    }

    private Double determineDiscount(Double price) {
        if (price >= MINIMUM_ORDER_FOR_DISCOUNT) {
            return 0.1;
        }
        return 0.0;
    }

}

```

일단 calculate 대신 apply 를 사용하여 할인 등 가격정책을 적용하는 함수로 역할을 수정했다.\
할인의 경우 할인률을 정하는 별도의 메서드로 분리했고, 여기서는 값의 변경 없이 할인률 자체를 반환하도록 했다.

이 구조를 통해 추후 추가적인 가격정책이 생겨도 `applyPricingPolicy` 내부에 쉽게 적용할 수 있지 않을까?
