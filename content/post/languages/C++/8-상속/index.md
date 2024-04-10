---
title: "8. 상속"
description: C++ 기본 문법
slug: cpp-inheritance
date: 2023-11-13 00:00:03+0000
image: "/cover/C++.png"
categories:
  - Languages/C++
tags:
---

## 상속(Inheritance)

부모 클래스(KR) = super class(JAVA) = Base class(C++) 기본 클래스  
자식 클래스(KR) = sub class(JAVA) = Derived class(C++) 파생 클래스

- 클래스 사이에서 상속관계 정의
- 기본 클래스의 속성과 기능을 파생 클래스에 물려주는 것
- 기본 클래스에서 파생 클래스로 갈수록 클래스의 개념이 구체화
- 다중 상속을 통한 클래스의 재활용성 높임

### 파생된 클래스로부터 객체 생성 과정

일반 : 메모리 공간 할당 -> 생성자 호출 및 실행

상속받은 클래스 : 메모리 공간 할당 -> 파생클래스의 생성자 호출 -> 기본 클래스의 생성자 호출 및 실행 -> 파생 클래스의 생성자 실행

### 파생된 클래스로부터 객체 소멸 과정

파생클래스의 소멸자 호출 및 실행 -> Base클래스의 소멸자 호출 및 실행 -> 메모리 공간 해제

Derived 클래스로부터 객체 생성 시 Base 클래스의 생성자를 명시적으로 호출하고 싶다 > 멤버 이니셜라이저 이용

```C++
#include <iostream>
using namespace std;

class A
{
public:
	A() { cout << "생성자 A" << endl; }
	A(int x) { cout << "매개변수 생성자A" << endl; }
};

class B : public A
{
public:
	B():A(1){ cout << "생성자 B" << endl; }
    //멤버 이니셜라이저를 통해 매개변수 생성자 A 호출 및 실행
};


int main(void)
{
	B b;

	return 0;
}
```

### 상속 예제

```C++
#include <iostream>
using namespace std;

class Person {
	char* name;
	int age;
public:
	Person(const char* _name, int age) {
		name = new char[strlen(_name) + 1];
		strcpy_s(name, strlen(_name) + 1, _name);
		this->age = age;
	}
	void Show() {
		cout << "이름 : "<< name << " 나이 : " << age << ' ';
	}
};


class UnivStudent : public Person {
	char* major;
public:
	UnivStudent(const char* name, int age ,const char* _major):Person(name, age) {
		major = new char[strlen(_major) + 1];
		strcpy_s(major, strlen(_major) + 1, _major);
	}
	void WhoAreYou() {
		Show();
		cout << "전공 : " << major << endl;
	}
};


int main(void)
{
	UnivStudent kim("kim", 21, "AI");
	kim.WhoAreYou();
	return 0;
}
```

---

```C++
#include <iostream>
using namespace std;

class Car {
	int gas;
public:
	Car(int gas) {
		this->gas = gas;
	}

	void ShowCurrentGas() {
		cout << "잔여 가솔린 : " << gas << endl;
	};
};

class HybridCar : public Car {
	int elec;
public:
	HybridCar(int gas, int elec) :Car(gas) {
		this->elec = elec;
	}

	void ShowCurrentElec() {
		cout << "잔여 전기량 : " << elec << endl;
	};
};

class HybridWaterCar : public HybridCar {
	int water;
public:
	HybridWaterCar(int gas, int elec, int water):HybridCar(gas, elec) {
		this->water = water;
	}

	void ShowCurrentGauge() {
		ShowCurrentGas();
		ShowCurrentElec();
		cout << "잔여 워터량 : " << water << endl;
	};
};


int main(void)
{
	HybridWaterCar drive(80, 100, 100);
	drive.ShowCurrentGauge();

	return 0;
}
```

## 접근지정자

public : 외부접근(다른 클래스, main()함수) + 내부접근

protected : 내부접근, 외부접근 일부(자식 클래스에서는)

private : 내부접근

상속 지정 : public 상속을 받아야 protected와 public을 그대로 물려받아 main에서 호출이 가능하다.

| 상속지정 Base멤버 | public    | protected | private  |
| ----------------- | --------- | --------- | -------- |
| private           | 접근금지  | 접근금지  | 접근금지 |
| protected         | protected | protected | private  |
| public            | public    | protected | private  |

멤버변수 : private 선언

멤버함수 : public 선언

```C++
//상속 예시
#include <iostream>
using namespace std;

class Book {
	char* title;
	char* isbn;
	int price;
public:
	Book(const char* title, const char* isbn, int price) {
		this->title = new char[strlen(title) + 1];
		strcpy_s(this->title, strlen(title) + 1, title);
		this->isbn = new char[strlen(isbn) + 1];
		strcpy_s(this->isbn, strlen(isbn) + 1, isbn);
		this->price = price;
	}
	~Book() {
		delete[] title;
		delete[] isbn;
	}
	void ShowBookInfo() {
		cout << "책 제목 : " << title << endl;
		cout << "ISBN : " << isbn << endl;
		cout << "가격 : " << price << endl;
	}
};

class Ebook :public Book {
	char* DRMKey;
public:
	Ebook(const char* title, const char* isbn, int price, const char* DRMKey) :Book(title, isbn, price) {
		this->DRMKey = new char[strlen(DRMKey) + 1];
		strcpy_s(this->DRMKey, strlen(DRMKey) + 1, DRMKey);
	}
	~Ebook() {
		delete[] DRMKey;
	}
	void ShowEBookInfo() {
		ShowBookInfo();
		cout << "DRMKey : " << DRMKey << endl;
	}
};

int main(void)
{
	Book book("좋은 C++", "555-12345-890-0", 20000);
	book.ShowBookInfo();

	cout << endl;
	Ebook ebook("좋은 C++ ebook", "555-12345-890-1", 10000, "fdx9w0i8kiw");
	ebook.ShowEBookInfo();

	return 0;
}
```

---

```C++
//컨트롤 클래스 예제
#include <iostream>
using namespace std;

class PermanentWorker {
	char name[20];
	int salary;
public:
	PermanentWorker(const char name[20] = "anonymous", int salary = 0) {
		strcpy_s(this->name, 20, name);
		this->salary = salary;
	}

	int GetPay() {
		return salary;
	}

	void ShowSalaryInfo() {
		cout << "name : " << name << endl;
		cout << "salary : " << salary << endl;
		cout << endl;
	}
};

class EmployeeHandler //정규직 직원을 등록, 관리 클래스 ---> 컨트롤 클래스
{
	PermanentWorker* empList[50];
	int empNum;
public:
	EmployeeHandler() {
		empNum = 0;
	}
        ~EmployeeHandler() {
            for (int i = 0; i < empNum; i++)
            {
                delete empList[i];
            }
        }

	//직원등록
	void AddEmployee(PermanentWorker* e) //PermanentWorker* e = new PermanentWorker("kim", 1000);
	{
		empList[empNum] = e;
		empNum++;
	}

	//전 직원 월급 총합
	void ShowTotalSalary() {
		int sum = 0;
		for(int i = 0; i<empNum; i++){
			sum += empList[i]->GetPay();
		}
		cout << "전직원 월급 총합 : " << sum << endl;
	}

	//각 직원의 내역 출력
	void ShowAllSalaryInfo() {
		for (int i = 0; i < empNum; i++) {
			empList[i]->ShowSalaryInfo();
		}
	}
};

int main(void)
{
	EmployeeHandler emp;

	emp.AddEmployee(new PermanentWorker("kim", 1000));
	emp.AddEmployee(new PermanentWorker("lee", 1500));
	emp.AddEmployee(new PermanentWorker("jun", 1200));

	emp.ShowAllSalaryInfo(); //각 직원의 내역 출력
	emp.ShowTotalSalary(); //전 직원 월급총합

	return 0;
}
```

## 객체 포인터

객체의 주소 값을 저장하는 객체 포인터 변수

C++에서, AAA형 포인터 변수는 AAA 객체 또는 AAA를 직접 혹은 간접적으로 상속하는 모든 객체를 가리킬 수 있다(객체의 주소 값을 저장할 수 있다).

```
Person* p = new Person();
Person* p = new Student();
Person* p = new StudentWorker();

Student* s = new Student(); //가능
Student* s = new Person(); //불가
```
