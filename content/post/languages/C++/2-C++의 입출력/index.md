---
title: "[C++] 2. C++의 입출력"
description: C++ 기본 문법
slug: cpp-io
date: 2023-08-29 00:00:03+0000
image: "/cover/C++.png"
categories:
  - Languages
tags:
  - C++
---

## C++의 출력

C++은 C와 다르게 데이터 타입 formating이 필요 없다.

```C++
#include <iostream>

int main(void)
{

	std::cout << "이름 : 홍길동"<<std::endl;
	std::cout << "나이 : 26"<<std::endl;
	std::cout << "학과 : 소프트웨어공학"<<std::endl;
	return 0;
}
```

**`iostream 헤더 파일`** ios, istream, ostream 클래스 등 표준 입출력을 위한 클래스와 객체, 변수 등이 선언됨.  
입력을 위한 cout, cin, <<, >>, endl 등 선언

**`std::cout<<"HelloWorld";`** iostream의 std안에 정의된 cout 객체 호출.

**`::`** 네임스페이스에 정의된 이름에 접근하기 위해 사용

**`cout 객체(console out)`** 스크린 출력 장치에 연결된 표준 C++ 출력 스트림 객체

**`<<`** 출력스트림연산자, 오른쪽 피연산자를 왼쪽 스트림 객체에 삽입

**`endl`** 지시자(개행, 출력버퍼값을 초기화해 준다)

### 네임스페이스(namespace)

같은 이름으로 정의된 경우 발생하는 충돌을 해결하기 위해 사용하며, `::`를 이용하여 접근한다.

```C++
namespace one{
	int f(){
    	return 0;
    }
}

namespace two{
	int f(){
    	return 1;
    }
}


two::f();
```

### 네임스페이스 간단하게 접근하기(using)

```C++
#include <iostream>
using namespace std; // 네임스페이스를 간단하게 접근

int main(void)
{
	cout << "실제로 작동하는지 확인"<<endl;
	return 0;
}
```

## C++의 입력

cin을 사용한다.

```C++
#include <iostream>
#include <cstring>
using namespace std; //std 간단하게 호출


double getArea(int a)
{
	int radius = a;
	return radius * radius * 3.14;
}


int main(void)
{
	int radius;
	int radius2;
	cout << "원의 반지름 : ";
	cin >> radius;
	cout << "원의 넓이 : " << getArea(radius) << endl;

	cin >> radius >> radius2; //연속으로 입력 받을 수 있다. enter, space, tab 으로 구분한다.

	return 0;
}
```

### cin 문장 입력받기(space 포함하여 값 받기)

```C++
#include <iostream>
#include <cstring>
using namespace std;

int main(void)
{

	char name[20];
	int age;
	char dept[20];

	cout << "이름, 나이, 학과 순으로 입력하세요(엔터로 구분)"<<endl;
	cin.getline(name, 20, '\n');
	cin.ignore(); //clear();
	cin >> age;
	cin.ignore(); //입력 버퍼값을 비워줘야 getline에 제대로 값을 입력받을 수 있다.
	cin.getline(dept, 20, '\n');

	cout << "이름 : "<<name<<endl;
	cout << "나이 : "<<age<<endl;
	cout << "학과 : "<<dept<<endl;


	return 0;
}
```

### string 클래스 이용하여 문자열 다루기

```C++
#include <string>

string str; // str = "test";
string str("test");
string str1 = "test";
string str2 = str1;

string addr;
cin>>addr; // space tab enter 받으면 끝나버림

// cin.getline(addr, 20); <- 이건 배열에 받는 방식, string객체는 이렇게 못 받음
// string 자체에 getline이 있음 cin.getline하지말고
getline(cin, addr); // enter를 입력하면 cin객체에서 문자열을 추출해서 addr객체에 저장
cin.ignore(); // buffer clear
```
