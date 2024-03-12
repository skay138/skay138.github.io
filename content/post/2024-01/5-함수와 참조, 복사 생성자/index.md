---
title: "[C++] 5. 함수와 참조, 복사 생성자"
description: C++ 기본 문법
date: 2023-09-25 00:00:03+0000
image: cover.png
categories:
  - Languages
tags:
  - C++
---

## 호출 방식에 따른 매개변수 전달

### call by value(값에 의한 호출)

```C++
#include <iostream>
#include <string>
using namespace std;

void swap(int a, int b) {
	int tmp = a;
	a = b;
	b = tmp;
}

int main(void)
{
	int n = 10, m = 20;
	cout << "함수 호출 전 : " << n << ' ' << m << endl;
	swap(n, m);
	cout << "함수 호출 후 : " << n << ' ' << m << endl;

	return 0;
}
```

### call by reference(주소에 의한 호출)

```C++
#include <iostream>
#include <string>
using namespace std;

void swap(int* a, int* b) {
	int tmp = *a;
	*a = *b;
	*b = tmp;
}

int main(void)
{
	int n = 10, m = 20;
	cout << "함수 호출 전 : " << n << ' ' << m << endl;
	swap(&n, &m);
	cout << "함수 호출 후 : " << n << ' ' << m << endl;

	return 0;
}
```

## 객체 전달 방식에 따른 함수 호출

### "값에 의한 호출"로 객체 전달

```C++
#include <iostream>
#include <string>
using namespace std;

class Circle {
	int radius;
public:
	Circle() { radius = 1; cout << "생성자 호출" << endl; }
	Circle(int radius) { this->radius = radius; cout << "생성자 호출" << endl; }
	double getArea() { return 3.14 * radius * radius; }
	int getRadius() { return radius; }
	void setRadius(int radius) { this->radius = radius; }
	~Circle() {
		cout << "소멸자 호출됨." << endl;
	}
};

void increase(Circle c) {
	// 객체는 복사하여 만들어지지만 생성자 호출은 되지 않음.
	// 소멸자는 호출됨.
	cout << "increase 함수 시작" << endl;
	int r = c.getRadius();
	c.setRadius(r + 1);
}

int main(void)
{
	Circle waffle(30);
	increase(waffle); //call by value
	cout << "increase 함수 끝" << endl;
	cout << waffle.getRadius() << endl;

	return 0;
}

/*
생성자 호출
increase 함수 시작
소멸자 호출됨.
increase 함수 끝
30
소멸자 호출됨.
*/
```

### "주소에 의한 호출"로 객체 전달

객체 포인터를 이용하여 객체 주소를 전달

```C++
#include <iostream>
#include <string>
using namespace std;

class Circle {
	int radius;
public:
	Circle() { radius = 1; cout << "생성자 호출" << endl; }
	Circle(int radius) { this->radius = radius; cout << "생성자 호출" << endl; }
	double getArea() { return 3.14 * radius * radius; }
	int getRadius() { return radius; }
	void setRadius(int radius) { this->radius = radius; }
	~Circle() {
		cout << "소멸자 호출됨." << endl;
	}
};

void increase(Circle* c) {
	cout << "increase 함수 시작" << endl;
	int r = c->getRadius();
	c->setRadius(r + 1);
}

int main(void)
{
	Circle waffle(30);
	increase(&waffle); //call by reference
	cout << "increase 함수 끝" << endl;
	cout << waffle.getRadius() << endl;

	return 0;
}

/*
생성자 호출
increase 함수 시작
increase 함수 끝
31
소멸자 호출됨.
*/
```

**예제** :
Circle객체 y를 x에 더하여 x를 키우고자 한다. increaseBy() 라는 함수를 전역으로 작성하여 기능을 완성하시오.

```C++
#include <iostream>
#include <string>
using namespace std;

class Circle {
	int radius;
public:
	Circle() { radius = 1; }
	Circle(int radius) { this->radius = radius; }
	double getArea() { return 3.14 * radius * radius; }
	int getRadius() { return radius; }
	void setRadius(int radius) { this->radius = radius; }
	void show() { cout << "반지름이 " << radius << "인 원" << endl; }
};

void increaseBy(Circle* x, Circle* y) {
	int num = y->getRadius();
	x->setRadius(x->getRadius() + num);
}

int main(void)
{
	Circle x(10), y(5);
	increaseBy(&x, &y);
	x.show();

	return 0;
}
```

## 객체 치환 및 객체 리턴

객체 치환

- 동일한 클래스 타입의 객체끼리 치환가능
- 객체의 모든 데이터가 비트 단위로 복사
- 치환된 두 객체는 현재 내용물만 같을 뿐 독립적인 공간 유지

객체 리턴

```C++
Circle getCircle()
{
	Circle tmp(30);
	return tmp; // 객체 tmp 리턴
}

int main(void)
{
	Circle c;
	c = getCircle(); //tmp 객체의 복사본이 c에 치환, c의 반지름은 30이 됨
	// 다음 라인으로 넘어가면 getCircle()은 임시객체에 들어있었기 때문에(마치 상수처럼) 날라가버림.

	return 0;
}
```

## 참조와 함수 (reference, 참조자)

이름을 지니는 공간에 별칭을 부여하는 것  
자료형 &레퍼런스명 = 대상; 형태로 선언

```C++
#include <iostream>
#include <string>
using namespace std;

void swap(int& a, int& b) {
	int tmp = a;
	a = b;
	b = tmp;
    // 함수 호출이 끝나면 별명만 사라진다.
}

int main(void)
{
	int n = 10, m = 20;
	cout << "함수 호출 전 : " << n << ' ' << m << endl;
	swap(n, m);
	cout << "함수 호출 후 : " << n << ' ' << m << endl;

	return 0;
}
```

---

```C++
#include <iostream>
#include <string>
using namespace std;

class Circle {
	int radius;
public:
	Circle() { radius = 1; cout << "생성자 호출" << endl; }
	Circle(int radius) { this->radius = radius; cout << "생성자 호출" << endl; }
	double getArea() { return 3.14 * radius * radius; }
	int getRadius() { return radius; }
	void setRadius(int radius) { this->radius = radius; }
	~Circle() {
		cout << "소멸자 호출됨." << endl;
	}
};

void increase(Circle& c) {
	cout << "increase 함수 시작" << endl;
	int r = c.getRadius();
	c.setRadius(r + 1);
}

int main(void)
{
	Circle waffle(20);
	cout << waffle.getArea() << endl;
	increase(waffle);
	cout << waffle.getArea() << endl;

	return 0;
}

/*
생성자 호출
1256
increase 함수 시작
1384.74
소멸자 호출됨.
*/
```

### 정리

call by value

- 객체 값에 의해 전달
- 생성자 매개변수 객체 생성 시 호출되지 않음
- 외부에서 값 변경 x

call by reference

1.  포인터를 이용한 call by reference  
    객체의 주소를 전달  
    객체의 포인터가 매개변수이므로 생성자, 소멸자와 상관없음  
    외부에서 값 변경 o
2.  참조자를 이용한 call by reference

## 복사 생성자

생성자(constructor) : 객체 생성시 반드시 한번 호출되는 함수  
복사 생성자(copy constructor) : 기존의 객체를 복사해서 새로운 객체를 생성할 때 호출되는 특별한 생성자

**중요! 참조자를 매개변수로 받아야함.**  
객체를 매개변수로 받을 때 계속 객체를 생성하며 무한루프에 빠지게 된다.  
default 복사 생성자가 존재(기존의 멤버 변수를 복사해준다)

**특징**

- 한 클래스에 오직 한 개만 선언 가능
- 복사 생성자는 보통 생성자와 클래스 내에 중복 선언 가능
- 모양 : 클래스에 대한 참조 매개변수를 가지는 독특한 생성자

```C++
class Circle{
    int radius;
    int x;
    int y;
public:
    Circle(){this->radius = 1;}
    Circle(int radius){ this->radius = radius; }
    Circle(Circle &c){ this->radius = c.radius;}
};

Circle pizza;
Circle waffle(10);
Circle copywaffle = waffle; // Circle copywaffle(waffle);
```

### 얕은 복사와 깊은 복사

**얕은 복사(shallow copy)**

- 객체 복사 시, 객체의 멤버를 1:1로 복사
- 객체의 멤버 변수에 동적 메모리가 할당된 경우  
  \-> 사본은 원본 객체가 할당 받은 메모리를 공유하는 문제 발생(동적할당 해제 시 메모리 참조 오류 발생)

**깊은 복사(deep copy)**

- 객체 복사 시, 객체의 멤버를 1:1대로 복사
- 객체의 멤버 변수에 동적 메모리가 할당된 경우  
  \- 사본은 원본이 가진 메모리 크기 만큼 별도로 동적 할당  
  \- 원본의 동적 메모리에 있는 내용을 사본에 복사
- 완전한 형태의 복사  
  \- 사본과 원본은 메모리를 공유하는 문제 없음

기존의 객체가 동적할당된 공간의 주소값을 가지는 경우 >> 반드시 깊은 복사를 하는 복사생성자를 구현해야함. 얕은 복사를 하는 default 복사 생성자로는 에러가 발생(메모리 참조 오류)

### 예제

예제 1

```C++
#include <iostream>
using namespace std;

class Person {
	int id;
	char* name;

public:
	Person(int id, const char* name) {
		int name_size = strlen(name) + 1;
		this->id = id;
		//동적할당
		this->name = new char[name_size];
		strcpy_s(this->name, name_size, name);
	}
	Person(Person& p) {
		int name_size = strlen(p.name) + 1;
		this->id = p.id;
		//새로운 동적할당
		this->name = new char[name_size];
		strcpy_s(this->name, name_size, p.name);
	}
	~Person() {
		delete[] name;
	}
	void show() {
		cout << "id : " << id << endl;
		cout << "이름 : " << name << endl;
	}
	void changeName(const char* name) {
		strcpy_s(this->name, strlen(name) + 1, name);
	}
};

int main(void)
{
	Person father(1, "Kitae");
	Person dauthor(father);

	father.show();
	dauthor.show();
	dauthor.changeName("grace");
	dauthor.show();
	return 0;
}
```

예제 2

```C++
#include <iostream>
using namespace std;

class Book {
	int price;
	int pages;
	char* title;
	char* author;
public:
	Book(int pr, int pa, const char* t, const char* a) {
		int title_size = strlen(t) + 1;
		int author_size = strlen(a) + 1;
		price = pr;
		pages = pa;
		title = new char[title_size];
		strcpy_s(title, title_size, t);
		author = new char[author_size];
		strcpy_s(author, author_size, a);

	}
	Book(Book& b) {
		price = b.price;
		pages = b.pages;
		title = new char[strlen(b.title) + 1];
		strcpy_s(title, strlen(b.title) + 1, b.title);
		author = new char[strlen(b.author) + 1];
		strcpy_s(author, strlen(b.author) + 1, b.author);
	}
	~Book() {
		delete[]title;
		delete[]author;
	}
	void ShowBook() {
		cout << "가격 : " << price << endl;
		cout << "페이지 : " << pages << endl;
		cout << "제목 : " << title << endl;
		cout << "저자 : " << author << endl << endl;
	}

	void ChangeTitle(const char* t) {
		delete[]title;
		title = new char[strlen(t) + 1];
		strcpy_s(title, strlen(t) + 1, t);
	}
	void ChangeAuthor(const char* a) {
		delete[] author;
		author = new char[strlen(a) + 1];
		strcpy_s(author, strlen(a) + 1, a);
	}
};

int main(void)
{
	Book cpp(20000, 400, "명품c++", "황기태");
	Book cplusplus(cpp);
	cpp.ShowBook();
	cplusplus.ShowBook();
	cplusplus.ChangeTitle("씨플러스플러스");
	cplusplus.ChangeAuthor("박상규");
	cplusplus.ShowBook();
	return 0;
}
```
