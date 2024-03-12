---
title: "[C++] 7. 프렌드와 연산자 중복"
description: C++ 기본 문법
date: 2023-11-06 00:00:03+0000
image: cover.png
categories:
  - Languages
tags:
  - C++
---

## 프렌드(Friend)

private선언한 변수에 접근 가능하도록 설정해주는 키워드.

### 프렌드 키워드가 가능한 3가지

#### 전역함수

클래스 외부에 선언된 전역 함수  
`friend bool equals(Rect& r, Rect& s);`

```C++
//전역함수에 대해서
#include <iostream>
using namespace std;

class Rect
{
	int width, height;
public:
	Rect(int width, int height)
	{
		this->width = width;
		this->height = height;
	}
	friend bool equals(Rect& r, Rect& s); // friend 키워드 사용
};

bool equals(Rect& r, Rect& s)
{
	if (r.width == s.width && r.height == s.height)
		return true;
	else
		return false;
}

int main(void)
{
	Rect a(3, 4), b(4, 5);
	if (equals(a, b))
		cout << "equal" << endl;
	else
		cout << "not equal" << endl;

	return 0;
}
```

#### 다른 클래스의 멤버함수

다른 클래스의 특정 멤버 함수  
 `friend bool RectManager::equals(Rect& r, Rect& s);`

```C++
//다른 클래스의 멤버함수에 대해서
#include <iostream>
using namespace std;

class Rect;

class RectManager
{
public:
	bool equals(Rect& r, Rect& s); //선언과 정리를 분리해서 구현
};

class Rect
{
	friend bool RectManager::equals(Rect& r, Rect& s); // friend 키워드 사용
	int width, height;
public:
	Rect(int width, int height)
	{
		this->width = width;
		this->height = height;
	}

};

bool RectManager::equals(Rect& r, Rect& s)
{
	if (r.width == s.width && r.height == s.height)
		return true;
	else
		return false;
}


int main(void)
{
	Rect a(3, 4), b(4, 5);
	RectManager man;
	if (man.equals(a, b))
		cout << "equal" << endl;
	else
		cout << "not equal" << endl;

	return 0;
}
```

#### 다른 클래스 전체

다른 클래스의 모든 멤버 함수  
`friend class RectManager;`

```C++
//다른 클래스 전체에 대해
#include <iostream>
using namespace std;

class Rect;

class RectManager
{
public:
	bool equals(Rect& r, Rect& s); //선언과 정리를 분리해서 구현
	void copy(Rect& r, Rect& s);
};

class Rect
{
	friend class RectManager; // friend 키워드 사용
	int width, height;
public:
	Rect(int width, int height)
	{
		this->width = width;
		this->height = height;
	}

};

bool RectManager::equals(Rect& r, Rect& s)
{
	if (r.width == s.width && r.height == s.height)
		return true;
	else
		return false;
}

void RectManager::copy(Rect& r, Rect& s)
{
	//write codes
}


int main(void)
{
	Rect a(3, 4), b(4, 5);
	RectManager man;
	if (man.equals(a, b))
		cout << "equal" << endl;
	else
		cout << "not equal" << endl;

	return 0;
}
```

## 연산자 중복(연산자 오버로딩)

본래부터 있던 연산자의 의미를 재정의(함수 구현)  
멤버함수로 구현하는 방법과 전역함수로 구현하는 방법이 있다.

### 이항 연산(+)

**멤버함수로 구현**  
클래스 안에서 구현한다.  
`pos1.operator+(pos2)`를 구현

```C++
#include <iostream>
using namespace std;

class Point
{
	int xpos, ypos;
public:
	Point(int xpos = 0, int ypos = 0)
	{
		this->xpos = xpos;
		this->ypos = ypos;
	}
	void showPos()
	{
		cout << xpos << ' ' << ypos << endl;
	}
	//지역 변수에서 생성된 객체이기 때문에 레퍼런스 사용 불가.
	Point operator+(Point& p2) {
		Point tmp;

		tmp.xpos = xpos + p2.xpos;
		tmp.ypos = ypos += p2.ypos;

		return tmp;
	}
};



int main(void)
{
	Point pos1(10, 20), pos2(20, 30), pos3;
	pos3 = pos1 + pos2;
	pos1.showPos();
	pos2.showPos();
	pos3.showPos();
	return 0;
}
```

**전역함수(프렌드 함수)로 구현**  
`operator+(pos1, pos2)`를 구현

```C++
#include <iostream>
using namespace std;

class Point
{
	int xpos, ypos;
	friend Point operator+(Point& p1, Point& p2);
public:
	Point(int xpos = 0, int ypos = 0)
	{
		this->xpos = xpos;
		this->ypos = ypos;
	}
	void showPos()
	{
		cout << xpos << ' ' << ypos << endl;
	}
};

Point operator+(Point& p1, Point& p2)
{
	Point tmp;

	tmp.xpos = p1.xpos + p2.xpos;
	tmp.ypos = p1.ypos += p2.ypos;

	return tmp;
}


int main(void)
{
	Point pos1(10, 20), pos2(20, 30), pos3;
	pos3 = pos1 + pos2;
	pos1.showPos();
	pos2.showPos();
	pos3.showPos();
	return 0;
}
```

---

```C++
//예제
#include <iostream>
using namespace std;

class Power {
	int kick;
	int punch;

	friend bool operator==(Power& p1, Power& p2);
public:
	Power(int kick = 0, int punch = 0)
	{
		this->kick = kick;
		this->punch = punch;
	}
	void show()
	{
		cout << "kick : " << kick << " punch : " << punch << endl;
	}
	Power operator+(Power& p2) {
		Power tmp(kick + p2.kick, punch + p2.punch);

		return tmp;
	}
};

bool operator==(Power& p1, Power& p2)
{
	if (p1.kick == p2.kick && p1.punch == p2.punch)
		return true;
	else
		return false;
}

int main(void)
{
	Power p1(1,2), p2(3, 4), p3, p4(4, 6);
	p3 = p1 + p2;
	p1.show();
	p2.show();
	p3.show();
	p4.show();
	if (p3 == p4)
		cout << "같다" << endl;
	else
		cout << "다르다" << endl;

	if (p2 == p4)
		cout << "같다" << endl;
	else
		cout << "다르다" << endl;
	return 0;
}
```

### 복합대입 연산자(+=)

**멤버함수로 구현**

```C++
#include <iostream>
using namespace std;

class Point
{
	int xpos, ypos;
public:
	Point(int xpos = 0, int ypos = 0)
	{
		this->xpos = xpos;
		this->ypos = ypos;
	}
	void showPos()
	{
		cout << xpos << ' ' << ypos << endl;
	}
	Point& operator+=(Point& p)
	{
		xpos += p.xpos;
		ypos += p.ypos;

		return *this;
	}
};

int main(void)
{
	Point pos1(10, 20), pos2(20, 30), pos3;
	pos1.showPos();
	pos2.showPos();
	pos3 = pos1 += pos2;
	pos1.showPos();
	pos3.showPos();
	return 0;
}
```

**전역함수로 구현**

```C++
#include <iostream>
using namespace std;

class Point
{
	int xpos, ypos;
	friend Point& operator+=(Point& p1, Point& p2);
public:
	Point(int xpos = 0, int ypos = 0)
	{
		this->xpos = xpos;
		this->ypos = ypos;
	}
	void showPos()
	{
		cout << xpos << ' ' << ypos << endl;
	}

};

Point& operator+=(Point& p1, Point& p2)
{

	p1.xpos += p2.xpos;
	p1.ypos += p2.ypos;

	return p1;
}

int main(void)
{
	Point pos1(10, 20), pos2(20, 30), pos3;
	pos1.showPos();
	pos2.showPos();
	pos3 = pos1 += pos2;
	pos1.showPos();
	pos3.showPos();
	return 0;
}
```

### 단항 연산(++)

**후위 연산자**

- 멤버함수로 구현 : pos1.operator++(int)
- 전역함수로 구현 : operator++(pos1, int)

주의) 중첩 연산이 안되도록 구현해야 한다. (pos++)++; 원래 지원안됨.

**전위 연산자**

- 멤버함수로 구현 : pos1.operator++()
- 전역함수로 구현 : operator++()

주의) 중첩 연산이 되도록 구현해야 한다. ++(++pos); 원래 지원됨. 따라서 클래스& 형 반환

**멤버함수로 구현**

```C++
#include <iostream>
using namespace std;

class Point
{
	int xpos, ypos;
public:
	Point(int xpos = 0, int ypos = 0)
	{
		this->xpos = xpos;
		this->ypos = ypos;
	}
	void showPos()
	{
		cout << xpos << ' ' << ypos << endl;
	}
	Point operator++(int)
	{
		Point tmp(xpos, ypos);
		xpos++;
		ypos++;
		return tmp;
	}

	Point& operator++()
	{
		xpos++;
		ypos++;
		return *this;
	}

};




int main(void)
{
	Point pos1(2, 3), pos2;
	pos2 = pos1++;

	pos1.showPos(); //3, 4
	pos2.showPos(); //2, 3

	Point pos3(2, 3), pos4;
	pos4 = ++pos3;

	pos3.showPos();
	pos4.showPos();

	return 0;
}
```

**전역함수로 구현**

```C++
#include <iostream>
using namespace std;

class Point
{
	int xpos, ypos;
	friend Point operator++(Point& p, int);
	friend Point& operator++(Point& p);
public:
	Point(int xpos = 0, int ypos = 0)
	{
		this->xpos = xpos;
		this->ypos = ypos;
	}
	void showPos()
	{
		cout << xpos << ' ' << ypos << endl;
	}

};

Point operator++(Point& p, int)
{
	Point tmp = p; //Point tmp(p); Point tmp(p.xpos, p.ypos);
	p.xpos++;
	p.ypos++;

	return tmp;
}

Point& operator++(Point& p)
{
	p.xpos++;
	p.ypos++;

	return p;
}




int main(void)
{
	Point pos1(2, 3), pos2;
	pos2 = pos1++;

	pos1.showPos(); //3, 4
	pos2.showPos(); //2, 3

	Point pos3(2, 3), pos4;
	pos4 = ++pos3;

	pos3.showPos();
	pos4.showPos();

	return 0;
}
```

후위 연산의 경우 지역 객체를 전달하기 때문에 Point를 반환  
전위 연산의 경우 둘 다 가능하지만 엄밀하게 보면 레퍼런스형을 반환하는게 옳다. 이유는 전위 연산 시 --(--a); 와 같이 중첩연산이 되어야 하기 때문.

```C++
#include <iostream>
using namespace std;

class Matrix {
	int arr[4];
public:
	Matrix(int a = 0, int b = 0, int c = 0, int d = 0) {
		this->arr[0] = a;
		this->arr[1] = b;
		this->arr[2] = c;
		this->arr[3] = d;
	}
	void show(){
		cout << "Matrix = < " << arr[0] << ' ' << arr[1] << ' ' << arr[2] << ' ' << arr[3] << " >" << endl;
	}
	Matrix operator+(Matrix& m) {
		Matrix tmp;
		for (int i = 0; i < 4; i++)tmp.arr[i] = arr[i] + m.arr[i];

		return tmp;
	}
	Matrix& operator+=(Matrix& m) {
		for (int i = 0; i < 4; i++)arr[i] += m.arr[i];
		return *this;
	}
	bool operator==(Matrix& m) {
		for (int i = 0; i < 4; i++)if (arr[i] != m.arr[i])return false;
		return true;
	}
};

int main(void)
{
	Matrix a(1, 2, 3, 4), b(2, 3, 4, 5), c;
	c = a + b;
	a += b;
	a.show();
	b.show();
	c.show();
	if (a == c)
		cout << "a and c are the same" << endl;

	return 0;
}
```
