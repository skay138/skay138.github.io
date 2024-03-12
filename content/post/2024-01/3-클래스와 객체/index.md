---
title: "[C++] 3. 클래스와 객체"
description: C++ 기본 문법
date: 2023-09-05 00:00:03+0000
image: cover.png
categories:
  - Languages
tags:
  - C++
---

## 캡슐화

- 객체의 본질적인 특성
- 객체를 캡슐화해서 내부를 보호하고 볼 수 없게 함(정보은닉)
- 외부와 인터페이스를 위해 객체의 일부분만 공개

객체는 상태(state)와 행동(behavior)으로 구성되는데, TV를 예시로 들면 상태는 on/off 속성, 채널, 음량 등이 있고 행동으로는 켜기/끄기, 채널 증가 감소, 음량 증가 감소 등이 있다.

```C++
class TV
{
  private:
    bool isOn;
    int channel;
    int volume;
  public:
    void poweron(){}
    void poweroff(){}
    void increaseChannel(){}
    void decreaseChannel(){}
    void increaseVolume(){}
    void decreaseVolume(){}
}

//-----------------------------------------------

TV myTv;
TV yourTv;

myTv.increaChannel();
yourTv.decreaseVolume();

//외부에서 데이터 접근하려면 메소드 통해서 해야함
// private안에 있는 애들은 은닉되어있음
// myTv.channel = 5; 이런식으론 안됨
```

## 클래스 작성

클래스는 멤버변수와 멤버함수로 구성되고, 클래스 선언부와 클래스 구현부가 있다.

```C++
class AAA
{
public:
  int aaa;
  void MyFunc();
}


void AAA::MyFunc()
{
  aaa++;
}
```

멤버변수는 클래스 안에서 초기화 시킬 수 없음  
멤버함수는 원형 형태로 선언하며 멤버에 대한 접근 권한을 지정함

private, public, protected중의 하나(디폴트는 private)  
`private` : 내부 접근  
`public` : 다른 모든 클래스나 객체에서 멤버의 접근이 가능함  
`protected` : 내부와 자식에서 접근

### 객체 만들기

```C++
#include <iostream>
using namespace std;

// 원클래스 (반지름, 원넓이)
class Circle
{
public:
	int radius;
	double getArea();
};

// 선언 이후 따로 구현
double Circle::getArea()
{
	return radius * radius * 3.14;
}


int main(void) {

	Circle doughnut;
	doughnut.radius = 3;
	cout << "도넛의 면적은 " << doughnut.getArea()<<endl;

	Circle pizza;
	pizza.radius = 10;
	cout << "피자의 면적은 " << pizza.getArea()<<endl;

	return 0;
}
```

---

```C++
#include <iostream>
using namespace std;

class Calendar {
public:
	int year;
	int month;
	int day;

	int getYear() { return year; }
	int getMonth() { return month; }
	int getDay() { return day; }

};

int main() {

	Calendar today;
	today.year = 2023;
	today.month = 9;
	today.day = 4;

	cout << "오늘은 " << today.getYear() << "년 " << today.getMonth() << "월 " << today.getDay() << "일입니다." << endl;


}
```

### 생성자(Constructor)

객체 생성시 반드시 한번 호출되는 함수이다.

- 클래스명과 동일한 함수명으로 작성
- 반환형이 없고 반환하지 않는다.
- 함수 오버로딩 가능(매개변수만 다르면 중복해서 선언 가능)
- 구현을 하지 않으면 컴파일러에 의해서 default 생성자 삽입 / 호출된다.  
  클래스명(){} // body 비어 있고 매개변수도 없음
- **객체 생성과 동시에 원하는 값으로 멤버를 초기화시킬 수 있음**

```C++
#include <iostream>
using namespace std;

// 원클래스 (반지름, 원넓이)
class Circle
{
//private: //안써도 디폴트
	int radius;
public:
	double getArea();

	//생성자 (클래스이름하고 같음), 오버로딩 가능
	Circle() { radius = 3; }
	Circle(int r) { radius = r; }

};

// 선언 이후 따로 구현
double Circle::getArea()
{
	return radius * radius * 3.14;
}


int main(void) {

	Circle doughnut;
	cout << "도넛의 면적은 " << doughnut.getArea()<<endl;

	Circle pizza(10);
	cout << "피자의 면적은 " << pizza.getArea()<<endl;

	return 0;
}
```

---

```C++
#include <iostream>
using namespace std;

class Calendar {

	int year;
	int month;
	int day;

public:

	int getYear() { return year; }
	int getMonth() { return month; }
	int getDay() { return day; }
	Calendar(int Y, int M, int D) { year = Y; month = M; day = D; }

};

int main() {

	Calendar today(2023, 9, 4);

	cout << "오늘은 " << today.getYear() << "년 " << today.getMonth() << "월 " << today.getDay() << "일입니다." << endl;

}
```

### 소멸자(Destructor)

생성자와 반대로 객체가 소멸될 때 반드시 한번 호출되는 함수이다.

- 클래스명 앞에 ~를 붙인 함수명( ex : ~Rectangle() )
- 반환형이 없고 반환하지 않음
- 매개변수 없음  >> 함수 오버로딩 X
- 구현을 하지 않으면 컴파일러에 의해서 default 소멸자 삽입/호출
- **객체 소멸 시 할 일이 있다면 구현하고 대부분의 경우 구현 안 해도 됨.**

소멸자가 호출되면 메모리 공간이 소멸된다.

```C++
#include <iostream>

using namespace std;

class Circle {

public:
    int radius;

    Circle();
    Circle(int r);
    ~Circle(); // 소멸자

    double getArea();

};

Circle::Circle() {
    radius = 1;
    cout << "반지름 " << radius << " 원 생성" << endl;
}

Circle::Circle(int r) {
    radius = r;
    cout << "반지름 " << radius << " 원 생성" << endl;
}

Circle::~Circle() {
    cout << "반지름 " <<radius << " 원 소멸" << endl;
}

double Circle::getArea() {
    return 3.14*radius*radius;
}

int main() {

    Circle donut;
    Circle pizza(30);

    return 0;
}
```

---

```C++
#include <iostream>
using namespace std;

class Calculator {
private:
	int addcnt;
	int mincnt;
	int divcnt;
	int mulcnt;

public:
	Calculator() { addcnt = 0; mincnt = 0; divcnt = 0; mulcnt = 0; };

	int Add(int a, int b) { addcnt++; return a + b; };
	int Min(int a, int b) { mincnt++; return a - b; };
	float Div(float a, float b) { divcnt++; return a / b; };
	int Mul(int a, int b) { mulcnt++;  return a * b; };
	void ShowOPCount(){
		cout << "덧셈 계산횟수는 " << addcnt << endl;
		cout << "뺄셈 계산횟수는 " << mincnt << endl;
		cout << "나눗셈 계산횟수는 " << divcnt << endl;
		cout << "곱셈 계산횟수는 " << mulcnt << endl;
	}
};


int main(void) {

	Calculator cal;

	cout << "3+5 = " << cal.Add(3, 5) << endl;
	cout << "3/5 = " << cal.Div(3, 5) << endl;
	cout << "12-4 = " << cal.Min(12, 4) << endl;
	cout << "12/4 = " << cal.Div(12, 4) << endl;
	cal.ShowOPCount();


	return 0;
}
```

## 추가 내용

### 바람직한 C++ 프로그램 작성법

클래스를 헤더 파일과 cpp파일로 분리하여 작성

- 클래스마다 분리 저장
- 클래스 선언 부 : 헤더 파일에 저장
- 클래스 구현 부 : cpp 파일에 저장, 클래스가 선언된 헤더 파일 include

```C++
//2.cpp
#include "2.h"

int main(void) {

	Calculator cal;

	cout << "3+5 = " << cal.Add(3, 5) << endl;
	cout << "3/5 = " << cal.Div(3, 5) << endl;
	cout << "12-4 = " << cal.Min(12, 4) << endl;
	cout << "12/4 = " << cal.Div(12, 4) << endl;
	cal.ShowOPCount();


	return 0;
}


class Point {
	int x; //여기에 바로 const를 선언해버리면 생성자 함수를 호출할 때 에러가 발생한다.
	int y;
public:
	Point(int _x, int _y) {
		x = _x;
		y = _y;
	}
};
```

---

```C++
//2.h
#pragma once
#include <iostream>
using namespace std;

class Calculator {
private:
	int addcnt;
	int mincnt;
	int divcnt;
	int mulcnt;

public:
	Calculator() { addcnt = 0; mincnt = 0; divcnt = 0; mulcnt = 0; };

	int Add(int a, int b) { addcnt++; return a + b; };
	int Min(int a, int b) { mincnt++; return a - b; };
	float Div(float a, float b) { divcnt++; return a / b; };
	int Mul(int a, int b) { mulcnt++;  return a * b; };
	void ShowOPCount() {
		cout << "덧셈 계산횟수는 " << addcnt << endl;
		cout << "뺄셈 계산횟수는 " << mincnt << endl;
		cout << "나눗셈 계산횟수는 " << divcnt << endl;
		cout << "곱셈 계산횟수는 " << mulcnt << endl;
	}
};
```

### 멤버 이니셜라이저(멤버 초기자)

- 멤버변수 초기화 시 사용
- const변수(상수)는 이니셜라이저를 통해 초기화가 이루어져야 함 #1
- 이니셜라이저는 생성자 몸체부분 호출 전에 실행
- 멤버변수로 사용된 객체의 생성자 호출에 사용 #2
- 상속 관계에서 자주 사용됨

```C++
//#1.
#include <iostream>
using namespace std;

class Point {
	const int x; //여기에 바로 const를 선언해버리면 생성자 함수를 호출할 때 에러가 발생한다.
	int y;
public:
	Point(int _x, int _y）{
		x = _x;
		y = _y;
	}
	void ShowPos() {
		cout << "x : " << x << endl << "y : " << y << endl;
	}
};

//-----------------------------------------------------------

class Point {
	const int x;
	int y;
public:
	Point(int _x, int _y) : x(_x) { //멤버 이니셜라이저를 사용하여 초기화하며 const적용
		y = _y;
	}
	void ShowPos() {
		cout << "x : " << x << endl << "y : " << y << endl;
	}
};
```

---

```C++
//#2. 다른 클래스의 객체가 멤버변수일 때 초기화 하기 위해 사용
#include <iostream>
using namespace std;

class Point {
	int x;
	int y;
public:
	Point(int _x, int _y){
		x = _x;
		y = _y;
	}
	void ShowPos() {
		cout << "x : " << x << endl << "y : " << y << endl;
	}
};

class Rectangle {
	Point lefttop;
	Point rightbottom;
public:
	Rectangle(int left, int top, int right, int bottom):lefttop(left,top),rightbottom(right,bottom) {
		//lefttop.x = left 는 잘못된 코드이다.
		//Point클래스의 생성자에서 x,y를 초기화 할 수 있도록 구현해야한다.

	};
	void ShowRec() {
		cout << "[좌상단]" << endl;
		lefttop.ShowPos();
		cout << "[우하단]" << endl;
		rightbottom.ShowPos();
	}
};

int main(void)
{
	Rectangle rec(10, 10, 100, 100);
	rec.ShowRec();
	return 0;
}
```
