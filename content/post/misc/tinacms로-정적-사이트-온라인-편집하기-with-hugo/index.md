---
image: /cover/tinacms.png
title: TinaCMS로 정적 사이트 온라인 편집하기 with Hugo
slug: tinacms-static-site-online-edit
description: 더이상 블로그에 ide로 글을 작성할 일은 없다!
date: 2024-03-16T06:34:30.453Z
categories:
  - Misc
---

개발 블로그를 시작하며 저만의 사이트를 가지고 싶었던 마음에 Hugo와 깃허브의 도움으로 호스팅하고 있었습니다.\
시간은 조금 걸리지만 제 입맛대로 조금씩 꾸며져가는 블로그를 보고 있으니 뿌듯한 마음이 들면서도 글을 작성할 때 IDE를 사용하여 작성하다 보니 다음과 같은 불편함이 있었습니다..

1. hugo 실행 및 preview 화면을 따로 확인해야 하는 번거로움
2. 로컬 환경, 특히 세팅되어 있는 컴퓨터에서만 작성 가능함

이런 불편함을 해소하기 위해 정보를 찾던 중 TinaCMS를 알게 되었습니다.

## What is TinaCMS

TinaCMS는 컨텐츠를 관리하기 위한 프레임워크로 사이트 편집을 원활하게 할 수 있도록 도와줍니다. 제가 파악한 바로는 다음의 주요 기능들이 있습니다.

1. 게시글의 CRUD
2. Tina Cloud를 통해 온라인 편집
3. 컴포넌트를 연결하여 랜더링되는 화면에서 직접 편집

그 중 저는 2번까지만 적용하여 블로그를 관리하려고 합니다.

![](/tinaCMS/tina1.png)
