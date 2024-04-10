---
image: cover/springboot.png
title: Spring HTTP 파라미터 정리
slug: spring-http-param
description: http 파라미터에 대한 spring 어노테이션
date: 2024-04-10T13:03:48.833Z
categories: Backend Studies/Spring Boot
---

## HTTP 파라미터 방식

* Path 방식  \
  URL에 포함된 파라미터를 받아오는 방식으로, 주로 GET요청에서 사용됩니다.
  `api/data/{id}`의 형태로 id를 전달하는 방식입니다.
* Query 방식  \
  URL에 ?뒤의 문자열로 전달되는 데이터를 받습니다. POST 요청에서도 사용될 수 있지만, 보편적으로 GET요청에서 사용됩니다.
  `api/ada/?id=3`의 형태로 id값을 전달하는 방식입니다.
* Body 방식  \
  HTTP 요청의 body에 포함된 데이터를 받아오는 방식입니다. 주로 POST, PUT 요청에서 사용됩니다. 데이터의 형태는 JSON이 일반적입니다.

## Spring에서의 적용

### @PathVariable(Path 방식)

Path 방식을 처리하기 위해 `@PathVariable` 어노테이션을 사용합니다.

예를 들어, URL이 [http://example.com/api/data/John/30와](http://example.com/api/data/John/30%EC%99%80) 같이 요청되었다고 가정해봅시다. 이때 경로에 포함된 name과 age 값을 받아와서 처리하는 코드는 다음과 같습니다:

```Java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MyController {

    @GetMapping("/api/data/{name}/{age}")
    public String getData(@PathVariable String name, @PathVariable int age) {
        return "Name: " + name + ", Age: " + age;
    }
}
```

### @RequestParam(Query 방식)

Query 방식을 처리하기 위해 `@RequestParam` 어노테이션을 사용합니다.

예를 들어, URL이 [http://example.com/api/data?name=John\&age=30와](http://example.com/api/data?name=John\&age=30%EC%99%80) 같이 요청되었다고 가정해봅시다. 이때 name과 age 파라미터 값을 받아와서 처리하는 코드는 다음과 같습니다:

```Java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MyController {

    @GetMapping("/api/data")
    public String getData(@RequestParam String name, @RequestParam int age) {
        return "Name: " + name + ", Age: " + age;
    }
}
```

#### 데이터가 여러개인 경우

한 종류의 파라미터의 데이터가 여러개일 경우, 리스트나 배열을 이용할 수 있습니다.

예를 들어, URL이 [http://example.com/api/data?names=John\&names=Alice\&names=Bob와](http://example.com/api/data?names=John\&names=Alice\&names=Bob%EC%99%80) 같이 요청되었다면, names 배열에는 "John", "Alice", "Bob"이 포함될 것입니다.

```Java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MyController {

    @GetMapping("/api/data")
    public String getData(@RequestParam List<String> names) {
        // @RequestParam String[] names 로 작성하면 배열로 처리
        
        return "Received names: " + names.toString();
    }
}
```

파라미터의 종류가 여러개일 경우, @RequestParam를 각각 사용하여 받아올 수 있습니다.

```Java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MyController {

    @GetMapping("/api/data")
    public String getData(
            @RequestParam String name,
            @RequestParam int age,
            @RequestParam(required = false) String city // 선택적 파라미터
    ) {
        // 각각의 파라미터 값을 처리
        return "Received data: name=" + name + ", age=" + age + ", city=" + city;
    }
}

```

### @RequestBody(Body 방식)

Body 방식을 처리하기 위해 `@RequestBody`를 사용합니다.

JSON 형식의 데이터를 처리하는 코드 예시입니다.

```Json
{
  "name": "John",
  "age": 30
}
```

```Java
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MyController {

    @PostMapping("/api/data")
    public String processData(@RequestBody MyData data) {
        return "Received data: " + data.toString();
    }

    public static class MyData {
        private String name;
        private int age;

        // Getters and setters

        @Override
        public String toString() {
            return "Name: " + name + ", Age: " + age;
        }
    }
}
```

별도의 클래스를 만들고 싶지 않다면, `String`이나 `Map<String, Object>`타입을 통해 데이터를 받아올 수 있습니다.

```Java
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class MyController {

    @PostMapping("/api/data")
    public String processData(@RequestBody Map<String, Object> requestBody) {
        // 요청 본문의 데이터를 Map으로 받아옴
        // requestBody를 이용하여 원하는 처리 수행
        return "Received data: " + requestBody.toString();
    }
}
```

## 번외

### @ModelAttribute

> Form형태의 HTTP Body와 요청 파라미터를 객체에 바인딩하고, return 시 자동으로 view로 전달됩니다.

`@ModelAttribute` 어노테이션은 스프링 MVC 컨트롤러 메서드에서 사용되며, 해당 메서드의 파라미터나 리턴 값에 사용됩니다. 이 어노테이션은 모델 객체를 생성하거나 수정하여 해당 모델 객체를 뷰로 전달하는 데 사용됩니다.

`@ModelAttribute` 어노테이션이 적용된 파라미터는 스프링 MVC에서 자동으로 모델에 추가됩니다. 이 모델 객체는 컨트롤러 메서드가 실행되는 동안 사용되며, 해당 메서드가 뷰를 반환할 때 자동으로 뷰에 전달됩니다.

`@ModelAttribute` 어노테이션이 적용된 메서드는 컨트롤러 클래스 내에 위치하며, 주로 해당 컨트롤러에서 사용하는 공통 모델 객체를 초기화하거나 수정하는 데 사용됩니다.

다음은 `@ModelAttribute` 어노테이션의 간단한 예시 코드입니다.

```Java
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class MyController {

    @ModelAttribute("user")
    public User getDefaultUser() {
        // 기본 사용자 정보를 초기화하여 모델에 추가
        User user = new User();
        user.setUsername("guest");
        user.setEmail("guest@example.com");
        return user;
    }

    @RequestMapping(value = "/profile", method = RequestMethod.GET)
    public String showProfile() {
        // profile.jsp와 같은 뷰로 포워딩하며 모델에 추가된 "user" 객체를 전달
        return "profile";
    }
}
```

위의 코드에서는 `@ModelAttribute` 어노테이션이 적용된 `getDefaultUser()` 메서드를 정의하여 "user"라는 이름으로 기본 사용자 정보를 초기화하고 모델에 추가합니다. 그리고 `showProfile()` 메서드에서는 "/profile" 엔드포인트에 대한 GET 요청을 처리하고, "profile.jsp"와 같은 뷰로 포워딩하면서 모델에 추가된 "user" 객체를 전달합니다. 이렇게 하면 뷰에서는 "user" 객체를 사용하여 사용자 정보를 표시할 수 있습니다.

***

`@RequestMapping` 어노테이션이 붙은 메서드의 파라미터 안에 `@ModelAttribute` 어노테이션이 선언되면 해당 메서드의 실행 전에 자동으로 모델 객체가 생성되어 파라미터로 전달됩니다. 이렇게 전달된 모델 객체는 컨트롤러 메서드 내에서 사용되거나 수정될 수 있으며, 최종적으로 뷰로 전달됩니다.

다음은 `@RequestMapping` 어노테이션이 붙은 메서드의 파라미터 안에 `@ModelAttribute` 어노테이션이 선언된 예시 코드입니다.

```Java
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class MyController {

    @RequestMapping(value = "/profile", method = RequestMethod.GET)
    public String showProfile(@ModelAttribute("user") User user) {
        // "/profile" 엔드포인트에 대한 GET 요청을 처리하면서
        // "user" 모델 객체가 생성되어 파라미터로 전달됨
        // 이후 로직에서 "user" 객체를 사용할 수 있음
        return "profile";
    }

    @ModelAttribute("user")
    public User getDefaultUser() {
        // 기본 사용자 정보를 초기화하여 모델에 추가
        User user = new User();
        user.setUsername("guest");
        user.setEmail("guest@example.com");
        return user;
    }
}
```

위의 코드에서 `showProfile()` 메서드의 파라미터에 `@ModelAttribute("user") User user`가 선언되어 있습니다. 이렇게 하면 스프링 MVC는 `getDefaultUser()` 메서드에서 반환한 기본 사용자 정보를 초기화한 후 모델에 추가하고, 이 모델 객체를 `showProfile()` 메서드의 파라미터로 전달합니다. 그러면 `showProfile()` 메서드 내에서는 user 객체를 사용하여 사용자 정보를 처리할 수 있습니다.

#### Model과의 차이점

`@ModelAttribute`: 해당 어노테이션이 적용된 메서드는 컨트롤러 내에서 모델 객체를 초기화하거나 수정하고, 이를 컨트롤러 메서드의 파라미터로 전달합니다. 이렇게 전달된 모델 객체는 뷰에서 사용할 수 있습니다.

`Model`: Model 객체는 컨트롤러 메서드에서 사용되며, 컨트롤러 메서드가 뷰로 전달할 데이터를 설정하는 데 사용됩니다. 메서드에서 Model 객체에 데이터를 추가하면, 이 데이터는 뷰로 전달되어 화면에 표시될 수 있습니다.

두 가지 방식 모두 최종적으로는 뷰에 데이터를 전달하여 클라이언트에게 보여지도록 합니다. 따라서 이들은 모두 뷰로 전달한다는 공통된 목적을 가지고 있습니다.

#### @RequestBody와의 차이점

`@ModelAttribute`: Form형태를 제외하면, HTTP 요청의 바디에 있는 데이터를 직접 처리하지 않습니다. 대신에 컨트롤러 메서드의 파라미터로 전달되는 모델 객체를 생성하거나 수정하는 데 사용됩니다. 주로 요청의 파라미터나 쿼리 스트링으로부터 데이터를 바인딩하여 모델 객체로 변환하는 데 사용됩니다.

`@RequestBody`: HTTP 요청의 바디에 있는 데이터를 객체로 변환하여 컨트롤러 메서드에서 사용할 수 있도록 합니다. 주로 JSON(application/json)이나 XML 형식의 데이터를 전달할 때 사용됩니다. 이를 사용하면 HTTP 요청의 바디에 있는 데이터를 자동으로 해당 객체의 필드에 매핑하여 컨트롤러 메서드에서 사용할 수 있습니다.

따라서 만약 HTTP 요청의 바디에 있는 데이터를 가져와야 한다면, `@RequestBody`를 사용해야 하며, `@ModelAttribute`는 주로 파라미터나 쿼리 스트링으로부터 데이터를 가져와서 모델 객체로 변환하는 데 사용됩니다.

jsp에서 . . .
`form.submit()` 등 form형태로 데이터 전달 : `@ModelAttribute`
`ajax` 등 json형태로 데이터 전달 : `@RequestBody`

### Ajax 타입 정리

```Javascript
$.ajax({
    type: "post", //HTTP method
    url: "localhost:8080/api" //요청보낼 url,
    data : formData, //보낼 데이터
    dataType: "json", //수신할 데이터 타입
    enctype: "multipart/form-data", //데이터 전송 방식(데이터 인코딩 방식)
    contentType: false, //컨텐츠 타입(파일 업로드 시 false로 설정)
    processData: false, //데이터 처리 여부 (파일 업로드 시 false로 설정)
    cache: false, //캐시 사용 여부
```

**`주의:`** contentType는 설정하지 않을 시 "application/x-www-form-urlencoded"가 적용됩니다. 이때문에 `@ResponseBody` 어노테이션을 사용했을 때 415 ERROR가 발생할 수 있습니다. 다른 타입으로 "application/json"도 주로 사용됩니다.

### @ResponseBody

`@ResponseBody` 어노테이션은 스프링 컨트롤러 메서드에서 반환되는 객체를 HTTP 응답 본문으로 직접 변환하여 클라이언트에게 반환할 때 사용됩니다. 주로 JSON 또는 XML과 같은 데이터 형식으로 변환하여 클라이언트에게 전송됩니다.

```Java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ResponseBody;

@RestController
public class MyController {

    @GetMapping("/api/data")
    @ResponseBody
    public String getData() {
        return "Hello, world!";
    }
}
```
