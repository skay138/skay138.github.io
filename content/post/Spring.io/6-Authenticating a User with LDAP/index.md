---
title: "[Spring Boot] Authenticating a User with LDAP"
description: securing application with the Spring Security LDAP module.
date: 2024-03-14 18:44:35+0900
image: cover.png
categories:
  - Backend Studies
tags:
  - Spring Boot
---

## What You Will Build

Spring Security에 내장되어 있는 LDAP 서버를 통해 웹 어플리케이션 보안을 구축해보자.  
LDAP 서버는 유저들을 포함한 data file로 로드한다.

### LDAP

네트워크상에서 조직이나 개인, 파일, 디바이스 등을 찾아볼 수 있게 해주는 소프트웨어 프로토콜입니다. LDAP이 등장하기 전 디렉토리 서비스 표준인 X.500의 DAP(Directory Access Protocol)가 존재했지만 OSI 계층 전체의 프로토콜을 지원하고 통신 간에 네트워크 자원을 많이 소비하는 등 운영 환경에 제약이 많았습니다. LDAP은 OSI 계층 전체가 아닌 TCP/IP 위에서 운용되고 DAP의 스펙을 최대한 유지하면서도 경량화해 네트워크 부담을 줄이도록 설계되었습니다.

LDAP을 이용한 디렉토리 서버도 데이터를 저장하는 데이터베이스의 유형 중 하나입니다. 트리 구조로 이루어져 있기에 검색 및 읽기 작업에서 관계형 데이터베이스보다 유리합니다.

## Create a Simple Web Controller

**src/main/java/com/example/authenticatingldap/HomeController.java**

```Java
package com.example.authenticatingldap;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

  @GetMapping("/")
  public String index() {
    return "Welcome to the home page!";
  }

}
```

GET 요청시 간단한 메세지를 전송하는 어플리케이션이나, 보안에 대한 설정이 되어 있지 않다.

## Set up Spring Security

**build.grale**

```gradle
implementation("org.springframework.boot:spring-boot-starter-security")
implementation("org.springframework.ldap:spring-ldap-core")
implementation("org.springframework.security:spring-security-ldap")
implementation("com.unboundid:unboundid-ldapsdk")
```

dependencies에 추가하자.

**src/main/java/com/example/authenticatingldap/WebSecurityConfig.java**

```Java
package com.example.authenticatingldap;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.Customizer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Autowired;


@Configuration
public class WebSecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      .authorizeHttpRequests((authorize) -> authorize
        .anyRequest().fullyAuthenticated()
      )
      .formLogin(Customizer.withDefaults());

    return http.build();
  }

  @Autowired
  public void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth
      .ldapAuthentication()
        .userDnPatterns("uid={0},ou=people")
        .groupSearchBase("ou=groups")
        .contextSource()
          .url("ldap://localhost:8389/dc=springframework,dc=org")
          .and()
        .passwordCompare()
          .passwordEncoder(new BCryptPasswordEncoder())
          .passwordAttribute("userPassword");
  }

}
```

`SecurityFilterChan()` : url에 대한 인가 설정  
`configure()` : 인증 메서드

## Add Application Properties

**application.properties**

```properties
spring.ldap.embedded.ldif=classpath:test-server.ldif
spring.ldap.embedded.base-dn=dc=springframework,dc=org
spring.ldap.embedded.port=8389
```

configure메서드의 contextSource에 대한 설정을 맞춰준다.

## Set up User Data

**src/main/resources/test-server.ldif**

```ldif
dn: dc=springframework,dc=org
objectclass: top
objectclass: domain
objectclass: extensibleObject
dc: springframework

dn: ou=groups,dc=springframework,dc=org
objectclass: top
objectclass: organizationalUnit
ou: groups

dn: ou=subgroups,ou=groups,dc=springframework,dc=org
objectclass: top
objectclass: organizationalUnit
ou: subgroups

dn: ou=people,dc=springframework,dc=org
objectclass: top
objectclass: organizationalUnit
ou: people

dn: ou=space cadets,dc=springframework,dc=org
objectclass: top
objectclass: organizationalUnit
ou: space cadets

dn: ou=\"quoted people\",dc=springframework,dc=org
objectclass: top
objectclass: organizationalUnit
ou: "quoted people"

dn: ou=otherpeople,dc=springframework,dc=org
objectclass: top
objectclass: organizationalUnit
ou: otherpeople

dn: uid=ben,ou=people,dc=springframework,dc=org
objectclass: top
objectclass: person
objectclass: organizationalPerson
objectclass: inetOrgPerson
cn: Ben Alex
sn: Alex
uid: ben
userPassword: $2a$10$c6bSeWPhg06xB1lvmaWNNe4NROmZiSpYhlocU/98HNr2MhIOiSt36

dn: uid=bob,ou=people,dc=springframework,dc=org
objectclass: top
objectclass: person
objectclass: organizationalPerson
objectclass: inetOrgPerson
cn: Bob Hamilton
sn: Hamilton
uid: bob
userPassword: bobspassword

dn: uid=joe,ou=otherpeople,dc=springframework,dc=org
objectclass: top
objectclass: person
objectclass: organizationalPerson
objectclass: inetOrgPerson
cn: Joe Smeth
sn: Smeth
uid: joe
userPassword: joespassword

dn: cn=mouse\, jerry,ou=people,dc=springframework,dc=org
objectclass: top
objectclass: person
objectclass: organizationalPerson
objectclass: inetOrgPerson
cn: Mouse, Jerry
sn: Mouse
uid: jerry
userPassword: jerryspassword

dn: cn=slash/guy,ou=people,dc=springframework,dc=org
objectclass: top
objectclass: person
objectclass: organizationalPerson
objectclass: inetOrgPerson
cn: slash/guy
sn: Slash
uid: slashguy
userPassword: slashguyspassword

dn: cn=quote\"guy,ou=\"quoted people\",dc=springframework,dc=org
objectclass: top
objectclass: person
objectclass: organizationalPerson
objectclass: inetOrgPerson
cn: quote\"guy
sn: Quote
uid: quoteguy
userPassword: quoteguyspassword

dn: uid=space cadet,ou=space cadets,dc=springframework,dc=org
objectclass: top
objectclass: person
objectclass: organizationalPerson
objectclass: inetOrgPerson
cn: Space Cadet
sn: Cadet
uid: space cadet
userPassword: spacecadetspassword



dn: cn=developers,ou=groups,dc=springframework,dc=org
objectclass: top
objectclass: groupOfUniqueNames
cn: developers
ou: developer
uniqueMember: uid=ben,ou=people,dc=springframework,dc=org
uniqueMember: uid=bob,ou=people,dc=springframework,dc=org

dn: cn=managers,ou=groups,dc=springframework,dc=org
objectclass: top
objectclass: groupOfUniqueNames
cn: managers
ou: manager
uniqueMember: uid=ben,ou=people,dc=springframework,dc=org
uniqueMember: cn=mouse\, jerry,ou=people,dc=springframework,dc=org

dn: cn=submanagers,ou=subgroups,ou=groups,dc=springframework,dc=org
objectclass: top
objectclass: groupOfUniqueNames
cn: submanagers
ou: submanager
uniqueMember: uid=ben,ou=people,dc=springframework,dc=org
```

> LDIF 파일을 사용하는 것은 프로덕션 시스템에서는 보편적인 방법이 아니다.

## 결과

![실행 화면](image.png)

username = ben  
password = benspassword  
입력 시

![로그인 결과](image-1.png)

잘 로그인 되는 것을 확인할 수 있다.

[Spring Security 프레임워크](https://docs.spring.io/spring-security/reference/index.html)는 spring.io 가이드를 전부 리뷰한 뒤 자세하게 다뤄보도록 하겠습니다.
