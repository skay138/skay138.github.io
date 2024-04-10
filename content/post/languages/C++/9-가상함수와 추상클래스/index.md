---
title: "9. 가상 함수와 추상 클래스"
description: C++ 기본 문법
slug: cpp-virtual-func-abstract-class
date: 2023-11-20 00:00:03+0000
image: "/cover/C++.png"
categories:
  - Languages/C++
tags:
---

## 상속간 함수 오버라이딩

기본(Base) 클래스에서 정의한 멤버함수를 파생(Derived) 클래스에서 재정의 하는 것.

리턴형, 함수이름, 매개변수정보 모두 같아야 함.

### 객체 포인터와 함수호출

객체 포인터를 기준으로 객체를 인식한다.

```C++
#include <iostream>
using namespace std;

class Base
{
public:
	void f() { cout << "Base::f()" << endl; }
};


class Derived : public Base
{
public:
	void f() { cout << "Derived::f()" << endl; }
};


int main(void)
{
	Derived d, * pDer;
	pDer = &d;

	Base* pBase;
	pBase = &d;

	pDer->f();
	pBase->f();

	return 0;
}

/*
Derived::f()
Base::f()
*/
```

C++ 컴파일러는 포인터 연산의 가능성 여부를 판단할 때, **포인터의 자료형을 기준으로 판단하며 실제 가리키는 객체의 자료형을 기준으로 판단하지 않는다.**

## 가상함수

객체 포인터 기준을 객체 기준으로 바꿔주는 문법. 함수 오버라이딩에서 사용 가능하다.

virtual 키워드를 사용한다.

```C++
#include <iostream>
using namespace std;

class First
{
public:
	void MyFunc() { cout << "FirstFunc()" << endl; }
};

class Second : public First
{
public:
	virtual void MyFunc() { cout << "SecondFunc()" << endl; }
};

class Third : public Second
{
public:
	void MyFunc() { cout << "ThirdFunc()" << endl; }
};

int main(void)
{
	Third* tptr = new Third();
	Second* sptr = tptr;
	First* fptr = sptr;

	tptr->MyFunc();
	sptr->MyFunc();
	fptr->MyFunc();

	delete tptr;
	return 0;
}

/*
ThirdFunc()
ThirdFunc() 원래는 secondFunc()이었지만 virtual 키워드를 통해 객체 기준으로 바뀜
FirstFunc()
*/
```

## 추상 클래스

객체화 시킬 수 없는 클래스, 객체화시킬 목적으로 만든 클래스가 아님.  
\> 상속으로 확장하기 위해 만든 클래스

```C++
#include <iostream>
using namespace std;

class First //순수 가상함수를 하나 이상 가지는 클래스는 추상클래스가 된다.
{
public:
	virtual void MyFunc() = 0; //순수 가상함수
};

class Second : public First
{
public:
	void MyFunc() { cout << "SecondFunc()" << endl; }
};

class Third : public Second
{
public:
	void MyFunc() { cout << "ThirdFunc()" << endl; }
};

int main(void)
{
	Third* tptr = new Third();
	Second* sptr = tptr;
	First* fptr = sptr;

	tptr->MyFunc();
	sptr->MyFunc();
	fptr->MyFunc();

	delete tptr;
	return 0;
}

/*
ThirdFunc()
ThirdFunc()
FirstFunc()
*/
```

### 추상 클래스 예시

```C++
/*
다음 추상 클래스 Calculator를 상속 받아 GoodCalc 클래스를 구현.
단 Calculator는 덧셈, 뺄셈 기능을 하는 함수를 반드시 지닌다.
GoodCalc는 평균을 내는 기능을 하는 함수를 반드시 지닌다.
*/
#include <iostream>
using namespace std;

class Calculator
{
public:
	Calculator() {}
	int add(int a, int b) {
		return a + b;
	}
	int subtract(int a, int b) {
		return a - b;
	}
	virtual double average(int* a, int b) = 0;
};

class GoodCalc : public Calculator
{
public:
	double average(int* a, int b) {
		double tmp = 0;
		for (int i = 0; i < b; i++) {
			tmp += a[i];
		}
		return tmp / 5;
	}
};


int main(void)
{
	int a[] = { 1,2,3,4,5 };
	Calculator* p = new GoodCalc();
	cout << p->add(2, 3) << endl;
	cout << p->subtract(2, 3) << endl;
	cout << p->average(a, 5) << endl;
	delete p;

	return 0;
}
```

---

```C++
#include <iostream>
using namespace std;

class Shape
{
	string name;
	int width, height;
public:
	Shape(string n = "", int w = 0, int h = 0)
	{
		name = n; width = w, height = h;
	}
	virtual double getArea() = 0;
	string getName() { return name; }
	int getW() { return width; }
	int getH() { return height; }
};

class Oval : public Shape
{
public:
	Oval(string n, int w, int h) :Shape(n, w, h) {};
	double getArea() {
		return getW() * getH() * 0.25 * 3.14;
	}
};

class Rect : public Shape
{
public:
	Rect(string n, int w, int h) :Shape(n, w, h) {};
	double getArea() {
		return getW() * getH();
	}
};

class Triangular : public Shape
{
public:
	Triangular(string n, int w, int h) :Shape(n, w, h) {};
	double getArea() {
		return getW() * getH() * 0.5;
	}
};


int main(void)
{
	Shape* p[3];
	p[0] = new Oval("빈대떡", 10, 20);
	p[1] = new Rect("찰떡", 30, 40);
	p[2] = new Triangular("토스트", 30, 40);

	for (int i = 0; i < 3; i++)
	{
		cout << p[i]->getName() << " 넓이는 ";
		cout << p[i]->getArea() << endl;
	}

	for (int i = 0; i < 3; i++) {
		delete p[i];
	}

	return 0;
}
```

---

```C++
#include <iostream>
using namespace std;

class Employee
{
	char name[20];
public:
	Employee(const char name[20] = "anonymous")
	{
		strcpy_s(this->name, 20, name);
	}
	void GetInfo()
	{
		cout << "name : " << name << endl;
	}
	virtual double GetPay() = 0;
	virtual void ShowSalaryInfo() = 0;
};

//정규직 클래스(고용직)
class PermanentWorker : public Employee
{
	char type[16] = "PermanentWorker";
	int salary;
public:
	PermanentWorker(const char name[20], int salary) : Employee(name) {
		this->salary = salary;
	}
	void ShowSalaryInfo()
	{
		GetInfo();
		cout << "type : " << type << endl;
		cout << "salary : " << GetPay() << endl;
		cout << endl;
	}

	double GetPay()
	{
		return salary;
	}
};

//영업직 클래스
class SalesWorker : public PermanentWorker
{
	char type[12] = "SalesWorker";
	double incentive;
	int salesResult;
public:
	SalesWorker(const char name[20], int salary, double incentive) : PermanentWorker(name, salary)
	{
		salesResult = 0;
		this->incentive = incentive;
	}

	void AddSalesResult(int i)
	{
		salesResult +=  i;
	}
	void ShowSalaryInfo()
	{
		GetInfo();
		cout << "type : " << type << endl;
		cout << "salary : " << GetPay() << endl;
		cout << endl;
	}
	double GetPay()
	{
		return PermanentWorker::GetPay() + incentive * salesResult;
	}
};

//해외 영업직 클래스
class ForeignSalesWorker : public SalesWorker
{
	char type[19] = "ForeignSalesWorker";
	char riskRank;
public:
	ForeignSalesWorker(const char name[20], int salary, double incentive, char riskRank) : SalesWorker(name, salary, incentive)
	{
		this->riskRank = riskRank;
	}
	void ShowSalaryInfo()
	{
		GetInfo();
		cout << "type : " << type << endl;
		cout << "salary : " << GetPay() << endl;
		cout << endl;
	}
	double GetPay()
	{
		double pay = SalesWorker::GetPay();
		if (riskRank == 'A') {
			return pay * 1.3;
		}
		else if (riskRank == 'B') {
			return pay * 1.2;
		}
		else if (riskRank == 'C')
		{
			return pay * 1.1;
		}
		else
		{
			throw range_error("rank out of range");
		}
	}
};

//임시직 클래스
class TemporaryWorker : public Employee
{
	char type[16] = "TemporaryWorker";
	int payPerHour;
	int workTime;
public:
	TemporaryWorker(const char name[20], int perPay) : Employee(name)
	{
		workTime = 0;
		this->payPerHour = perPay;
	}
	void AddWorkTime(int workTime)

	{
		this->workTime += workTime;
	}
	void ShowSalaryInfo()
	{
		GetInfo();
		cout << "type : " << type << endl;
		cout << "salary : " << GetPay() << endl;
		cout << endl;
	}

	double GetPay()
	{
		return payPerHour * workTime;
	}
};

//컨트롤 클래스
class EmployeeHandler
{
	Employee* empList[50];
	int empNum;
public:
	EmployeeHandler()
	{
		empNum = 0;
	}
	~EmployeeHandler()
	{
		for (int i = 0; i < empNum; i++)
		{
			delete empList[i];
		}
	}

	void AddEmployee(Employee* worker)
	{
		empList[empNum] = worker;
		empNum++;
	}

	void ShowTotalSalary()
	{
		double sum = 0;
		for (int i = 0; i < empNum; i++) {
			sum += empList[i]->GetPay();
		}
		cout << "전 직원 월급 총합 : " << sum << endl;
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

	//정규직 직원
	emp.AddEmployee(new PermanentWorker("kim", 1000));
	emp.AddEmployee(new PermanentWorker("lee", 1500));
	emp.AddEmployee(new PermanentWorker("jun", 2000));

	//영업직 직원
	SalesWorker* seller = new SalesWorker("Hong", 1000, 0.1);
	seller->AddSalesResult(7000);
	emp.AddEmployee(seller); //이름 기본급 인센티브

	//해외 영업직 직원
	ForeignSalesWorker* fseller1 = new ForeignSalesWorker("Hong", 1000, 0.1, 'A'); //이름 기본급 인센티브 위험도
	fseller1->AddSalesResult(7000);
	emp.AddEmployee(fseller1);

	ForeignSalesWorker* fseller2 = new ForeignSalesWorker("Yoon", 1000, 0.1, 'B'); //이름 기본급 인센티브 위험도
	fseller2->AddSalesResult(7000);
	emp.AddEmployee(fseller2);

	ForeignSalesWorker* fseller3 = new ForeignSalesWorker("Lee", 1000, 0.1, 'C'); //이름 기본급 인센티브 위험도
	fseller3->AddSalesResult(7000);
	emp.AddEmployee(fseller3);

	//임시직 직원
	TemporaryWorker* alba = new TemporaryWorker("Jung", 70); //이름 시간당Pay
	alba->AddWorkTime(50);
	emp.AddEmployee(alba);

	emp.ShowAllSalaryInfo(); //각 직원의 내역 출력
	emp.ShowTotalSalary(); //전 직원 월급총합

	return 0;
}
```
