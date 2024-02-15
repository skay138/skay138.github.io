---
title: "1. C++의 특징"
description: C++의 설계목적과 특징
date: 2023-08-23
categories:
  - Languages
tags:
  - C++
---

## C++언어의 주요한 설계 목적

- 캡슐화(클래스) : 데이터를 캡슐로 싸서 외부의 접근으로부터 보호(정보은닉), 멤버 변수와 멤버 함수 이용  
  private 변수의 초기화, 조회 등에는 생성자 함수, public 함수 등을 이용하여 private에 접근한다.
- 상속 : 객체가 자식 클래스의 멤버와 부모 클래스에 선언된 모양 그대로 멤버들을 가지고 탄생한다. 객체간 IS-A 관계가 성립되어야 한다. 재사용성에 강점이 있다.

```C++
class Person
{
	public:
    	void sleep(){};
};


class Student : public Person //Student 는 Person의 특징을 상속받는다.
{
	public:
    	void study(){};
};

Student s1;
s1.sleep(); //실행 가능
```

## C++의 특징

### 함수중복(Function Overloading) - 다형성

매개변수 정보가 다르면 함수 이름을 중복해서 선언할 수 있다.  
다형성 : 하나의 기능이 경우에 따라 다르게 보이거나 다르게 작동한다. 연산자 중복, 함수 중복, 함수 재정의(overriding)

```C++
int sum(int a, int b){
	return a+b;
}


int sum(int a, int b, int c){
	return a+b+c;
}
```

### 디폴트 매개 변수(default parameter)

함수를 정의할 때 매개변수에 기본값을 지정할 수 있다. 이는 overloading과도 이어진다.

```C++
int sum(int a = 0, int b = 10)
{
	return a+b;
}


//메인에서 호출시
sum(10); // return 20
sum(10,20); // return 30
```

### 참조와 참조 변수(reference)

이름을 지니는 공간(변수에 할당된 공간)에 별명을 부여하는 것.

이는 참조에 의한 호출을 위해 사용된다.

```C++
int a = 10;
int &ref = a; //자료형 &레퍼런스명 = 대상;

Student kim; //클래스 이름과 객체
Student &lee = kim;
```

### 참조에 의한 호출(call-by-reference)

```C++
//참조 변수 활용
void swap(int &a, int &b)
{
	int tmp = a;
	a = b;
	b = tmp;
}

void main(void)
{
	int x = 10, y = 20;
	swap(x, y);
}
```

### new/delete 연산자

- 동적할당 / 해제 : 메모리를 동적으로 필요한 만큼만 상황에 맞게 할당하고 해제하는 것.
- 메인 메모리에서는 불가하고 Heap이라는 공간에서 사용 가능, 메인 메모리에 포인터가 있어야함.

```C++
char *p = new char[4]; //메모리 공간 할당
strcpy(p, "kim");
delete [] p; //메모리 공간 해제

int *p1 = new int;
*p1 = 10;
delete p1;

/*
일반적으로는 new char[4]와 같이 고정적으로 할당하지 않고
입력받은 문자열의 len을 받아와 그 값을 할당한다.
*/
```

### 연산자 재정의

기존 C++ 연산자에 새로운 연산을 정의할 수 있다.

### 제네릭 함수와 클래스(일반화)

데이터 타입에 의존하지 않고 일반화시킨 함수나 클래스 작성 가능
