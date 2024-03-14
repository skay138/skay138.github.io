---
title: "[C++] 6. 함수 중복과 static 멤버"
description: C++ 기본 문법
slug: cpp-function-overloading-static-member
date: 2023-10-23 00:00:03+0000
image: cover.png
categories:
  - Languages
tags:
  - C++
---

## 함수중복(함수 오버로딩)

하나의 프로그램, 하나의 클래스 내에서 함수 이름을 중복해서 선언할 수 있다. 단, 매개변수가 달라야 한다.(매개변수 개수, 데이터형)

- 함수 오버라이딩 : 상속에서 부모클래스에서 정의한 함수를 자식클래스에서 재정의
- 연산자 오버로딩 : 연산자를 내가 정의한 객체를 대상으로 동작하도록 함수 구현해 주는 것

### 디폴트 매개변수

1.  매개변수가 디폴트 값을 가질 수 있음
2.  디폴트 매개변수를 활용하면 함수 오버로딩 효과를 가질 수 있다
3.  디폴트 매개 변수는 보통 매개 변수 앞에 선언될 수 없음  
    \-> 디폴트 매개 변수는 끝 쪽에 몰려 선언되어야 함.

```C++
#include <iostream>
#include <string>
using namespace std;

//1. 함수 오버로딩 이용

//2. 디폴트 매개변수 이용
void star(int n = 5) {
	for (int i = 0; i < n; i++)
		cout << "*";
	cout << endl;
}

void msg(int a, string msg = "hello") {
	cout << a << " " << msg << endl;
}


int main(void)
{
	star(); //*****
	star(10); //**********

	msg(10); //10 hello
	msg(10, "Good Morning"); //10 Good Morning
}
```

---

```C++
#include <iostream>
#include <string>
using namespace std;

void f(char w = ' ', int line = 1) {
	for (int i = 0; i < line; i++) {
		for (int i = 0; i < 10; i++)
			cout << w;
		cout << endl;
	}
}

int main(void)
{
	f(); //한 줄에 공백 10개 출력
	f('%'); //한 줄에 '%'를 10개 출력
	f('@', 5);//다섯 줄에 '@'를 10개 출력

	return 0;
}

/*

%%%%%%%%%%
@@@@@@@@@@
@@@@@@@@@@
@@@@@@@@@@
@@@@@@@@@@
@@@@@@@@@@
*/
```

## static

### C언어

지역변수에 static -> 전역변수화(lifetime), 범위(함수 내)

- lifetime : 프로그램 시작 시 메모리 공간에 생성, 프로그램 종료 시 소멸
- 범위 : static변수가 선언된 함수 내에서만 접근
- 한번만 초기화 되고, 지역변수와 달리 함수를 빠져나가도 소멸되지 않는다.

```C++
#include <iostream>
#include <string>
using namespace std;

void Counter()
{
	static int cnt;
	cnt++;
	cout << "Current cnt : " << cnt << endl;
}

int main(void)
{
	for (int i = 0; i < 10; i++)
		Counter();

	return 0;
}
```

### C++

#### 맴버변수 static 선언 시

클래스 변수라고 한다.

- 생명주기 : 프로그램 시작 생성, 프로그램 종료 소멸, 객체 생성과 상관없이 생성
- 접근 범위
  - private : 같은 클래스에서 만들어진 객체끼리만 공유
  - public : 클래스와 상관없이 접근 가능
- 선언 : static int simObjCnt; //클래스 내에서
- 초기화 : int Sosimple::simObjCnt = 0; //클래스 밖에서

```C++
#include <iostream>
using namespace std;

class SoSimple
{
private:
	static int simObjCnt;
	static int showCnt; //일반 멤버변수 - static으로 수정
public:
	static int cnt;

	SoSimple()
	{
		simObjCnt++;
		showCnt = 10;
		cout << simObjCnt << "번째 객체 생성" << endl;
	}
	static void Show() {
		cout << simObjCnt << endl;
		cout << showCnt << endl;
	}
};

//static 멤버변수 초기화 : 클래스 밖에서 해야함.
int SoSimple::simObjCnt = 0;
int SoSimple::cnt = 0;
int SoSimple::showCnt = 0;

int main(void)
{
	//public 선언한 static변수는 객체와 상관없이 접근 가능.
	SoSimple::cnt++;
	cout << SoSimple::cnt << endl;

	SoSimple sim1;
	SoSimple sim2;
	SoSimple sim3;

	sim1.Show();
	return 0;
}
```

#### 멤버함수 static 선언 시

클래스 함수라고 한다.

선언된 객체나 클래스 이름으로 호출(예: ` sim1.Show();`, `SoSimple::Show();`)  
클래스 이름으로 호출하는 것이 더 바람직

##### 일반멤버함수와 클래스 함수의 차이

일반멤버함수 : static 멤버변수, 일반 멤버변수 접근, static 멤버함수 호출 가능  
클래스함수 : static 멤버변수, static 멤버함수만 호출 가능

```C++
//예제

#include <iostream>
using namespace std;

class Person {
private:
	int money;
	static int sharedMoney;
public:
	Person(int money) {
		this->money = money;
	}
	static void addShared(int money) {
		sharedMoney += money;
	}
	void addMoney(int money) {
		this->money += money;
	}
	void showMoeny() {
		cout << "내 돈 : " << money << "공유 돈 : " << sharedMoney << endl;
	}
};

int Person::sharedMoney = 0;

int main(void)
{
	Person han(100);
	han.addShared(200); //Person::addShared(200); 이 더 좋은 방법이다.
	Person lee(150);
	lee.addMoney(200); //lee의 개인 돈 = 350
	lee.addShared(200); //static 멤버 접근, 공금 = 400

	han.showMoeny();
	lee.showMoeny();

	return 0;
}
```
