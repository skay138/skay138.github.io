---
image: /cover/tinacms.png
title: TinaCMS로 정적 사이트 온라인 편집하기 with Hugo
slug: tinacms-static-site-online-edit
description: 더이상 IDE로 글을 작성할 일은 없다!
date: 2024-03-16T06:34:30.453Z
categories:
  - Misc
tags:
  - Hugo
  - TinaCMS
  - GitHub Action
---

개발 블로그를 시작하며 저만의 사이트를 가지고 싶었던 마음에 Hugo와 깃허브의 도움으로 호스팅하고 있었습니다.\
시간은 조금 걸리지만 제 입맛대로 조금씩 꾸며져가는 블로그를 보고 있으니 뿌듯한 마음이 들면서도 글을 작성할 때 IDE를 사용하여 작성하다 보니 다음과 같은 불편함이 있었습니다..

1. hugo 실행 및 preview 화면을 따로 확인해야 하는 번거로움
2. 로컬 환경, 특히 세팅되어 있는 컴퓨터에서만 작성 가능함

이러한 사항들은 글을 작성하는 시간을 오래걸리게 할 뿐 아니라 글을 쓰려는 의지마저 저하시켰습니다. 이를 해소하기 위해 정보를 찾던 중 TinaCMS를 알게 되었고, 다음들을 적용시켜 게시글 관리를 하기로 했습니다.

1. TinaCMS
2. GitHub Action

## TinaCMS

TinaCMS는 컨텐츠를 관리하기 위한 프레임워크로 사이트 편집을 원활하게 할 수 있도록 도와줍니다. 제가 파악한 바로는 다음의 주요 기능들이 있습니다.

1. 게시글의 CRUD
2. Tina Cloud를 통해 온라인 편집
3. 컴포넌트를 연결하여 랜더링되는 화면에서 직접 편집

그 중 저는 2번까지만 적용하여 블로그를 관리하려고 합니다.

![](/tinaCMS/tina1.png)

### Setup TinaCMS

블로그 디렉토리에서 다음 명령어를 실행합니다.

```shell
npx @tinacms/cli@latest init
```

public assets directory는 미디어를 관리하는 디렉토리를 묻는 것이기에, Hugo 기준 static을 입력하시면 됩니다.

### 컨텐츠 모델링하기

Tina를 이용하여 컨텐츠를 관리하기 위해, tina/config.ts파일에서 관련 설정을 해야합니다.\
저는 카테고리를 기반해 게시글 설정을 했습니다. 아래는 schema -> collections > 하위의 springboot collection 설정입니다.

```typescript
{
  name: "springboot",
    label: "SpringBoot",
      path: "content/post/backend-studies/springboot",
        defaultItem: () => {
          return {
            image: "/cover/springboot.png",
            title: "[Spring Boot] ",
            date: new Date(),
            slug: (values) => values?.title
              ?.toLowerCase()
              .replace(/ /g, '-'),
            categories: ['Backend Studies'],
            tags: ['Spring Boot'],
          }
        },
          ui: {
    filename: {
      // if disabled, the editor can not edit the filename
      readonly: true,
        // Example of using a custom slugify function
        slugify: (values) => {
          // Values is an object containing all the values of the form. In this case it is {title?: string, topic?: string}
          return `${values?.title
            ?.toLowerCase()
            .replace(/ /g, '-')}/index`
        },
          },
  },
  fields: [
    {
      type: "image",
      name: "image",
      label: "커버 이미지",
      required: false,
    },
    {
      type: "string",
      name: "title",
      label: "제목",
      isTitle: true,
      required: true,
    },
    {
      type: "string",
      name: "slug",
      label: "slug",
      isTitle: false,
      required: false,
      description: "한글 포함 시 작성",
    },
    {
      type: "string",
      name: "description",
      label: "설명",
      isTitle: false,
      required: false,
    },
    {
      type: "datetime",
      name: "date",
      label: "작성일",
      required: false,
    },
    {
      name: 'categories',
      label: '카테고리',
      type: 'string',
      list: true,
      options: [
        {
          value: 'Backend Studies',
          label: 'Backend Studies',
        },
        {
          value: 'Algorithm',
          label: 'Algorithm',
        },
        {
          value: 'Languages',
          label: 'Languages',
        },
        {
          value: 'Tech Articles Reviews',
          label: 'Tech Articles Reviews',
        },
        {
          value: 'Misc',
          label: 'Misc',
        },
      ],
    },
    {
      type: "rich-text",
      name: "body",
      label: "Body",
      isBody: true,
    },
    {
      label: "Tags",
      name: "tags",
      type: "string",
      list: true
    },
  ],
}
```

name은 value, label은 Tina에서 보여줄 이름입니다.\
path는 게시글들이 존재하는 경로를 기입해주시면 됩니다.\
`defaultItem`은 게시글 작성 시 자동으로 설정될 데이터입니다. 저는 커버 이미지, 제목 양식, 작성일, 카테고리, 태그 등을 설정했습니다.\
`fields`는 마크다운 파일의 설정입니다.

> `ui:filename`은 제가 hugo의 stack테마를 기반으로 작성하고 있기 때문에, 이를 위해 그냥 filename.md로 저장하는 게 아닌, filename/index.md로 저장하게끔 수정했습니다. 현재 Media 핸들링을 위해 저도 디렉터리 구조의 변경을 고려하고 있으며, 참고만 하시면 될 것 같습니다.

설정을 마친 후

```shell
npx tinacms dev -c "hugo server -D -p 1313"
```

로 서버를 실행한 뒤 localhost:1313/admin 으로 접속하면 Tina페이지를 볼 수 있습니다.\
collection 선택 후 Create New 버튼을 클릭하게 되면

![](/tinaCMS/skay138.github.io_admin_.png)

글 양식에 맞게 화면이 나오는 것을 볼 수 있습니다.
