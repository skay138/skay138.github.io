---
title: "클린코드 연습2"
description: 제3장 함수
slug: clean-code-practice-2
date: 2025-04-18 00:00:01+0900
image: /cover/java.png
categories:
  - Languages/Java
tags:
  - CleanCode
---

## 🧨 리팩토링 대상 코드

```java
public class BookRentalService {

    public void handleRental(Book book, LocalDate rentDate, LocalDate returnDate) {
        if (book == null || rentDate == null || returnDate == null) {
            System.out.println("잘못된 입력입니다.");
            return;
        }

        System.out.println("책 제목: " + book.getTitle());

        if (book.isNew()) {
            System.out.println("신간 도서입니다. 최대 7일 대여 가능합니다.");
            long days = ChronoUnit.DAYS.between(rentDate, returnDate);
            if (days > 7) {
                long fee = (days - 7) * 500;
                System.out.println("연체료는 " + fee + "원입니다.");
            } else {
                System.out.println("정상 반납입니다.");
            }
        } else {
            System.out.println("일반 도서입니다. 최대 14일 대여 가능합니다.");
            long days = ChronoUnit.DAYS.between(rentDate, returnDate);
            if (days > 14) {
                long fee = (days - 14) * 500;
                System.out.println("연체료는 " + fee + "원입니다.");
            } else {
                System.out.println("정상 반납입니다.");
            }
        }
    }
}

```

## ⚒ 리팩토링

### 1차 개선

#### BookRentalService.java

```java
public class BookRentalService {

    private final static int NEW_BOOK_RENTAL_DAYS = 7;
    private final static int NORMAL_BOOK_RENTAL_DAYS = 14;

    public void processReturn(Rental<Book> bookRental) {

        if(bookRental.isInvalidRental()){return;}

        int rentalPeriodLimit = bookRental.getItem().isNew() ? NEW_BOOK_RENTAL_DAYS : NORMAL_BOOK_RENTAL_DAYS;

        bookRental.updateFee(rentalPeriodLimit);

        saveBookRental(bookRental);

    }

    private void saveBookRental(Rental<Book> bookRental){
        System.out.println("책 제목: " + bookRental.getItem().getTitle());

        int fee = bookRental.getFee();

        if(fee > 0){
            System.out.println("연체료는 " + fee + "원입니다.");
        } else{
            System.out.println("정상 반납입니다.");
        }
    }

}
```

1. 유효 검증 분리
2. 대여 가능일 상수화
3. System.out 분리(save 가정)

#### Rental.java

```java
@Getter
public class Rental<T> {

    private final static int BASE_FEE = 500;

    private final T item;
    private final LocalDate rentDate;
    private final LocalDate returnDate;
    private int fee;

    public Rental(T item, LocalDate rentDate, LocalDate returnDate) {
        this.item = item;
        this.rentDate = rentDate;
        this.returnDate = returnDate;
    }

    public boolean isInvalidRental(){
        if(this.item == null || this.rentDate == null || this.returnDate == null){
            System.out.println("잘못된 입력입니다.");
            return true;
        }
        if(this.returnDate.isBefore(this.rentDate)){
            System.out.println("반납일은 대출일 이전일 수 없습니다.");
            return true;
        }
        return false;
    }

    public void updateFee(int rentalPeriodLimit){
        int days = (int) ChronoUnit.DAYS.between(this.rentDate, this.returnDate);
        if (days > rentalPeriodLimit) {
            this.fee = (days - rentalPeriodLimit) * BASE_FEE;
        } else {
            this.fee = 0;
        }
    }

}
```

1. Service의 대여료 계산 로직 Rental에게 이관

| SELF_FEEDBACK

Rental 클래스는 제네릭을 사용하여 Book 외에도 Video, PartyRoom 등의 다양한 대여 항목을 다룰 수 있도록 설계되었다.

하지만 코드를 살펴보던 중, 곧 문제가 될 수 있는 한 가지 점을 발견했다.\
바로 대여 항목마다 다른 BASE_FEE(기본 요금) 이 적용될 수 있다는 점이다.

현재는 이 BASE_FEE가 Rental 내부에 고정되어 있어, 항목별로 유연하게 다른 요금을 적용할 수 없다.\
이를 해결하기 위해선 요금 계산을 Rental 외부에서 관리해야 했다.

초기에는 updateFee() 메서드에 baseFee를 인자로 전달하는 방식을 고려했다.\
그러나 이렇게 처리할 경우, 대여료 계산에 대한 책임이 명확하지 않다는 점이 신경 쓰였다.\
rentDate, returnDate는 도메인(Rental)이 알고 있고, rentalPeriodLimit과 baseFee는 외부(Service)에서 주입되면서 책임의 분산이 어색하게 느껴졌기 때문이다.

이에 따라 대여료 계산 책임을 명확히 분리하기 위해 **RentalPolicy**를 도입했다.\
이 방식은 각 대여 항목(Book, Video, PartyRoom 등)에 따라 알맞은 정책을 적용할 수 있게 해주며,
도메인 객체(Rental)는 그저 정책을 전달받아 위임하는 구조로 더 명확한 책임을 갖는다.

이런 리팩토링을 통해 얻은 이점은 다음과 같다:

1. 요금 정책의 변경이나 확장이 수월해짐 (OCP)

2. 도메인(Rental)과 정책(RentalPolicy) 간의 역할 분리가 명확함

아래는 이를 적용한 코드이다.

### 2차 개선

#### BookRentalService.java

```java
public class BookRentalService {

    private final RentalPolicy<Book> bookRentalPolicy;

    public BookRentalService(RentalPolicy<Book> bookRentalPolicy) {
        this.bookRentalPolicy = bookRentalPolicy;
    }

    public void processReturn(Rental<Book> bookRental) {

        if(bookRental.isInvalidRental()){return;}

        bookRental.applyFee(bookRentalPolicy);

        saveBookRental(bookRental);

    }

    private void saveBookRental(Rental<Book> bookRental){
        System.out.println("책 제목: " + bookRental.getItem().getTitle());

        int fee = bookRental.getFee();

        if(fee > 0){
            System.out.println("연체료는 " + fee + "원입니다.");
        } else{
            System.out.println("정상 반납입니다.");
        }
    }

}

```

#### BookRentalPolicy.java

```java
public class BookRentalPolicy implements RentalPolicy<Book> {

    private final static int NEW_BOOK_RENTAL_DAYS = 7;
    private final static int NORMAL_BOOK_RENTAL_DAYS = 14;
    private final static int BASE_FEE = 500;

    public BookRentalPolicy() {}

    @Override
    public int calculateFee(Rental<Book> rental) {
        int rentalPeriodLimit = rental.getItem().isNew() ? NEW_BOOK_RENTAL_DAYS : NORMAL_BOOK_RENTAL_DAYS;
        int daysRented = (int) ChronoUnit.DAYS.between(rental.getRentDate(), rental.getReturnDate());

        if (daysRented > rentalPeriodLimit) {
            return (daysRented - rentalPeriodLimit) * BASE_FEE;
        }
        return 0;
    }

}
```

#### Rental.java

```java
@Data
public class Rental<T> {

    private final T item;
    private final LocalDate rentDate;
    private final LocalDate returnDate;
    private int fee;

    public Rental(T item, LocalDate rentDate, LocalDate returnDate) {
        this.item = item;
        this.rentDate = rentDate;
        this.returnDate = returnDate;
        this.fee = 0;
    }

    public boolean isInvalidRental(){
        if(this.item == null || this.rentDate == null || this.returnDate == null){
            System.out.println("잘못된 입력입니다.");
            return true;
        }
        if(this.returnDate.isBefore(this.rentDate)){
            System.out.println("반납일은 대출일 이전일 수 없습니다.");
            return true;
        }
        return false;
    }

    public void applyFee(RentalPolicy<T> rentalPolicy){
        this.fee = rentalPolicy.calculateFee(this);
    }

}
```
