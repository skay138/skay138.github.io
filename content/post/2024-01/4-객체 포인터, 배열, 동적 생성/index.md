---
title: "[C++] 4. 객체 포인터, 배열, 동적 생성"
description: C++ 기본 문법
slug: cpp-op-array-da
date: 2023-09-11 00:00:03+0000
image: cover.png
categories:
  - Languages
tags:
  - C++
---

## 객체 포인터

객체의 주소 값을 가지는 변수  
포인터로 멤버를 접근할 때 : 객체포인터 -> 멤버

```C++
#include <iostream>
using namespace std;

class Circle {
	int radius;
public:
	Circle() {
		radius = 3;
	}
	Circle(int r) {
		radius = r;
	}
	double getArea() {
		return radius * radius * 3.14;
	}
};

int main(void) {
	Circle donut;
	Circle* p = &donut; //객체에 대한 포인터 선언 및 객체 주소 저장
	cout << "using pointer : " << p->getArea() << endl; //멤버 함수 호출
	cout << "using *p : "<<(*p).getArea() << endl;
	cout << "using parameter : " << donut.getArea() << endl;
	return 0;
}
```

## 객체 배열

- 객체 포인터와 연결할 수 있음
- 객체의 멤버를 원하는 값으로 바꾸는 방법(void 생성자 호출 밖에 안됨)
  - set() 멤버함수 구현하여 멤버변수값 변경
  - 임시객체로 초기화
- 2차원 객체 배열

```C++
#include <iostream>
using namespace std;

class Circle {
	int radius;
public:
	Circle() {radius = 3;} //void 생성자가 없다면 객체 배열 생성 시 에러가 발생한다.
	Circle(int r) {
		radius = r;
	}
	double getArea() {
		return radius * radius * 3.14;
	}
	void setRadius(int r) { //set() 멤버함수 구현
		radius = r;
	}
};

int main(void) {
	Circle arr[5];
	Circle arr2[5] = { Circle(3), Circle(2), Circle(1), Circle(), Circle()}; //임시 객체로 초기화
	Circle* p = arr; //배열의 이름이 포인터를 의미하기 때문에 이렇게 코드를 작성할 수 있다.
	arr[2].setRadius(4); //멤버변수의 값을 4로 변경
	cout << arr2[1].getArea() << endl; //배열명으로 접근
	cout << p[1].getArea() << endl; //포인터로 접근
	cout << (p + 2)->getArea() << endl; //화살표 연산자로 접근
	cout << (*(p + 3)).getArea() << endl; //주소로 접근
	return 0;
}
```

---

```C++
//#. 2차원 배열
int main(void) {

	Circle arr[2][3] = { {Circle(1), Circle(2), Circle(3)},{Circle(4), Circle(5), Circle(6)}};
	for (int i = 0; i < 2; i++) {
		for (int j = 0; j < 3; j++) {
			cout << arr[i][j].getArea() << endl;
		}
	}

	return 0;
}
```

---

```C++
//#실습

#include <iostream>
using namespace std;
class Sample {
	int a;
public:
	Sample() { a = 100; cout << a << ' '; }
	Sample(int x) { a = x; cout << a << ' '; }
	Sample(int x, int y) { a = x * y; cout << a << ' '; }
	int get() { return a; }
};

int main(void) {
	Sample arr[3];
	Sample arr2D[2][2] = { {Sample(2,3), Sample(2, 4)},{Sample(5), Sample()}};
	Sample* p = arr;
	int total = 0;
	int total2D = 0;
	for (int i = 0; i < 3; i++) {
		total += (p + i)->get();
	}
	cout << endl << "첫번째 배열의 합은 " << total << endl;

	for (int i = 0; i < 2; i++) {
		for (int j = 0; j < 2; j++) {
			total2D += arr2D[i][j].get();
		}
	}
	cout << "두번째 배열의 합은" << total2D << endl;

	return 0;
}
```

## 동적 메모리 할당 및 반환

### new / delete 키워드

new / delete 키워드를 통해 동적할당이 가능하다.

```C++
#include <iostream>
using namespace std;

int main(void)
{
	char* cp = new char[4];
	delete cp;

	return 0;
}
```

1\. 변수 동적 할당

```C++
//C style
int* p = (int *)malloc(sizeof(int));
*p = 10;
free(p);

//C++ style
int* p = new int;
*p = 10;
delete p;
```

2\. 배열 동적 할당

```
//C style
int* p = (int*)malloc(sizeof(int)*5);
free(p);

//C++ style
int* p = new int[5];
delete [] p;

char* p = new char[20];
delete [] p;

//값 할당하기
p[i] = 10;
*(p + i) = 20;
```

#. SIZE를 입력받아서 SIZE에 해당하는 배열 동적 할당

```C++
int size;
cin >> size;
int* p = new int[size];
```

#. company라는 문자열을 입력 받아 길이에 딱 맞는 배열을 동적 할당

```C++
int size = strlen("company") + 1;
char* p = new char[size];
```

- 정적 할당
  - 변수 선언을 통해 필요한 메모리 할당, 많은 양의 메모리는 배열 선언을 통해 할당
- 동적 할당
  - 필요한 양이 예측되지 않는 경우. 프로그램 작성 시 할당받을 수 없음.
  - 실행 중에 운영체제로부터 할당 받음(heap으로부터 할당)
- C언어의 동적 메모리 할당
  - malloc(), free() 라이브러리 함수 사용
- C++의 동적 메모리 할당/반환
  - new, delete 연산자 사용

#. 클래스의 경우 동적 생성이라고도 표현한다.

#. delete 사용시 주의점

```C++
int n = 10;
int* p = &n;
delete p; //동적할당이 된 것이 아니므로 에러 발생


int* p = new int;
delete p;
delete p; //이미 할당이 해제되어 에러 발생
```

### 동적 할당 예시

```C++
#include <iostream>
using namespace std;

int main(void)
{
	int size;
	double sum = 0;
	cout << "입력할 정수의 개수는 ? ";
	cin >> size;

	int* p = new int[size];

	for (int i = 0; i < size; i++) {
		cout << i + 1 << "번째 정수 입력 : ";
		cin >> p[i];
		sum += p[i];
	}
	delete[] p;
	cout << "평균 : " << sum / size << endl;
}
```

### 객체의 동적할당

1\. 객체의 멤버변수를 동적할당할 때는 소멸자에서 메모리를 해제해야 한다.

```C++
#include <iostream>
using namespace std;

// 객체의 멤버변수가 동적할당된 메모리의 주소를 지님
// 객체 생성 시 생성자에서 동적할당
// 객체가 소멸될 때 호출되는 소멸자에서 메모리 해제

class NameCard {
	char* name;
	char* comp;
	char* tel;
	char* pos;
public:
	NameCard(const char* _name, const char* _comp, const char* _tel, const char* _pos) {
		int name_size = strlen(_name) + 1;
		int comp_size = strlen(_comp) + 1;
		int tel_size = strlen(_tel) + 1;
		int pos_size = strlen(_pos) + 1;

		name = new char[name_size];
		strcpy_s(name, name_size, _name);
		comp = new char[comp_size];
		strcpy_s(comp, comp_size, _comp);
		tel = new char[tel_size];
		strcpy_s(tel, tel_size, _tel);
		pos = new char[pos_size];
		strcpy_s(pos, pos_size, _pos);
	}
	~NameCard() {
		delete[] name;
		delete[] comp;
		delete[] tel;
		delete[] pos;
	}
	void ShowNameCardInfo() {
		cout << "이름 : " << name << endl;
		cout << "회사 : " << comp << endl;
		cout << "전화 : " << tel << endl;
		cout << "직급 : " << pos << endl;
		cout << endl;
	}
};


int main(void)
{
	NameCard manClerk("Lee", "ABCEng", "010-000-444", "clerk");
	NameCard manSenior("Hong", "OrangeEng", "010-333-4444", "senior");
	NameCard manAssist("Kim", "SoGoodComp", "010-555-6666", "assist");


	manClerk.ShowNameCardInfo();
	manSenior.ShowNameCardInfo();
	manAssist.ShowNameCardInfo();

	return 0;
}
```

2\. 객체 자체를 동적할당 할 경우 : main함수에서 메모리를 해제해줘야 한다.

```C++
#include <iostream>
using namespace std;

class Circle
{
	int radius;
public:
	Circle() { radius = 1; }
	Circle(int r) { radius = r; }
	double getArea() { return 3.14 * radius * radius; }
};


int main(void) {
	//원의 반지름을 반복적으로 입력받아 Circle 객체 동적 생성하고 면적 출력
	//음수가 입력되면 종료

	int r;
	while (1)
	{
		cout << "정수 반지름 입력(음수 입력 시 종료)";
		cin >> r;
		if (r < 0)
			break;

		//객체 동적 생성
		Circle* p = new Circle(r);
		cout << "원의 면적은 : " << p->getArea() << endl;
		delete p;
	}
	return 0;
}
```

3\. 객체 배열을 동적 생성할 때 : 역시 main함수에서 메모리 해제

```C++
#include <iostream>
using namespace std;

class Circle
{
	int radius;
public:
	Circle() { radius = 1; }
	Circle(int r) { radius = r; }
	double getArea() { return 3.14 * radius * radius; }
	void setRadius(int _radius) {
		radius = _radius;
	}
};


int main(void) {
	int n, rad;
	int cnt = 0;
	cout << "생성하고자 하는 원의 개수 : ";
	cin >> n;
	Circle* p = new Circle[n];

	for (int i = 0; i < n; i++) {
		cout << "원" << i + 1 << "의 반지름 : ";
		cin >> rad;
		p[i].setRadius(rad);
		// *p[0].setRadius(10);
		// (p + 1)->setRadius(20);
		if (p[i].getArea() >= 100 && p[i].getArea() <= 200)
			cnt++;
	}
	cout << "면적이 100에서 200 사이인 원의 개수는 " << cnt << "개 입니다." << endl;

	delete[] p;
	return 0;
}
```

## this 포인터

- 자기참조 포인터(객체 안에서), 객체의 주소값을 가지는 변수
- 클래스의 멤버 함수 내에서만 사용
- 개발자가 선언하는 변수가 아니고, 컴파일러가 선언한 변수
  - 멤버 함수에 컴파일러에 의해 묵시적으로 삽입 선언되는 매개 변수

### 멤버변수와 매개변수가 변수명이 같을 때

매개변수의 우선순위가 높기 때문에 멤버변수를 초기화할 수 없다. 이 때, 멤버변수를 this를 통해 접근할 수 있다.

```C++
#include <iostream>
using  std;

class Circle
{
	int radius;
public:
	Circle() { radius = 1; }
	Circle(int radius) { this->radius = radius; }
	double getArea() { return 3.14 * radius * radius; }
	void setRadius(int radius) {
		this->radius = radius;
	}
};

int main(void)
{
	Circle waffle(30);
	cout << waffle.getArea() << endl;

	return 0;
}
```

### 멤버 함수가 객체 자신의 주소를 반환할 때

```C++
#include <iostream>
using namespace std;

class Circle
{
	int radius;
public:
	Circle() { radius = 1; }
	Circle(int radius) { this->radius = radius; }
	double getArea() { return 3.14 * radius * radius; }
	void setRadius(int _radius) {
		radius = _radius;
	}

	Circle* increase()
	{
		radius++;
		return this;
	}

	Circle decrease() {
		radius--;
		return *this;
	}
};

int main(void)
{
	Circle pizza;
	pizza.setRadius(10);
	cout << pizza.getArea() << endl;
	Circle* p = pizza.increase();
	cout << p->getArea() << endl;

	Circle tmp = pizza.decrease();
	cout << tmp.getArea() << endl;
	return 0;
}
```

### 제약사항

- 멤버 함수가 아닌 함수에서 this 사용 불가
  - 객체와의 관련성이 없기 때문
- static 멤버 함수에서 this 사용 불가
  - 객체가 생기기 전에 static 함수 호출이 있을 수 있기 때문에

## string 클래스

문자열 처리를 위한 클래스이다. string은 객체이다.

```C++
#include <string>

int main(void)
{
    // 1. 생성
    string name = "kim";
    string yourname(name);
    string yourname1 = name;
    string addr("서울 서초구 양재동");

    // 2. 출력
    cout << addr << endl;

    // 3. 동적 생성
    string* ptr = new string("C++");
    delete ptr;

    // 4. 입력
    cin >> addr;
    getline(cin, addr);

}
```

\# string 클래스 예시

```C++
#include <iostream>
#include <string>
using namespace std;

// string배열에 5개의 문자열을 받고, 사전 구성에서 가장 뒤에 오는 문자열 출력

int main(void)
{
	string arr[5];
	for (int i = 0; i < 5; i++)
	{
		cout << "이름 >> ";
		getline(cin, arr[i]);
	}

	// 최대값 구하기
	string max = arr[0];
	for (int i = 0; i < 5; i++)
	{
		if (max < arr[i]) {
			max = arr[i];
		}
	}

	cout << "사전에서 가장 뒤에 나오는 문자열은 " << max << endl;

	return 0;
}
```

### 문자열을 다루기 위한 멤버함수(string 클래스)

1.  문자열 비교  
    int compare(string & str) : 문자열과 str을 비교해서 같으면 0, str보다 앞에 있으면 음수, 뒤에 있으면 양수  
    비교연산 : >, <, >=, <=, =
2.  문자열 연결  
    append() 함수 사용가능
3.  문자열 삽입  
    insert(인덱스, 문자열) 함수 사용
4.  문자열 바꾸기(치환)  
    replace(위치, 몇 개, "바꿀 문자열") 함수 사용
5.  문자열 길이 구하기  
    length() 함수, size() 함수
6.  문자열 지우기  
    erase(위치, 몇개) 함수
7.  문자열 추출  
    substr(위치, 몇개) 함수
8.  문자 찾기  
    find(문자열) : 찾으면 위치 반환, 못 찾으면 -1 반환
9.  문자를 숫자로 바꾸기  
    stoi() 함수

```C++
#include <iostream>
#include <string>
using namespace std;


int main(void)
{
	// 1. 문자열 비교
	string str1 = "kim";
	string str2 = "lee";
	if (str1.compare(str2) == 0)
		cout << "같다" << endl;
	else
		cout << "아니다" << endl;

	// 2. 문자열 연결
	string str3 = "서울";
	string str4 = " 양재동";
	str3.append(" 서초구");
	cout << str3 << endl;
	string addr = str3 + str4;
	cout << addr << endl;

	// 3. 문자열 삽입
	string str5 = "I love C++";
	str5.insert(2, "really ");
	cout << str5 << endl;

	// 4. 문자열 바꾸기(치환)
	str5.replace(2, 11, "study");
	cout << str5 << endl;

	// 5. 문자열 길이
	cout << str5.length() << endl;
	cout << str5.size() << endl;

	// 6. 문자열 지우기
	str5.erase(0, 8);
	cout << str5 << endl;
	str5.clear();
	cout << str5 << endl;

	// 7. 문자열 추출
	string str6("I love C++");
	string tmp = str6.substr(2, 4);
	string tmp1 = str6.substr(2);
	cout << str6 << endl;
	cout << tmp << endl;
	cout << tmp1 << endl;

	// 8. 문자 찾기
	int result = str6.find("love");
	cout << str6.find("love") << endl;
	result = str6.find("LOVE");
	cout << result << endl;

	// 9. string to integer
	string year = "2023";
	int n = stoi(year);
	cout << typeid(n).name() << endl;
}
```

---

```C++
#include <iostream>
#include <string>
using namespace std;

class Person {
	string name;
	string tel;
public:
	string getName() {
		return name;
	}
	string getTel() {
		return tel;
	}
	void SetPerson(string name, string tel) {
		this->name = name;
		this->tel = tel;
	}
};

int main(void)
{
	Person people[3];
	string name, tel;
	cout << "사람이름 번호 순으로 입력하세요(공백으로 구분)" << endl;
	for (int i = 0; i < 3; i++) {
		cout << "사람 1 >> ";
		cin >> name >> tel;
		people[i].SetPerson(name, tel);
	}

	cout << "모든 사람의 이름은 ";
	for (int i = 0; i < 3; i++)
	{
		cout << " " << people[i].getName();
	}
	cout << endl;

	cout << "전화번호를 검색합니다. 이름을 입력해주세요 ";
	cin >> name;
	for (int i = 0; i < 3; i++)
	{
		if (name == people[i].getName() ){
			cout << people[i].getTel() << endl;
		}
	}

	return 0;
}
```
