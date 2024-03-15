import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.TINA_PUBLIC_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "static",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "static",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      /*
      Spring
      */
      {
        name: "springboot",
        label: "Spring Boot",
        path: "content/post/spring-io",
        defaultItem: ()=>{
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
      },
      /*
      POSTS
      */
      {
        name: "post",
        label: "Posts",
        path: "content/post",
        defaultItem: ()=>{
          return {
            date: new Date(),
            slug: (values) => values?.title
              ?.toLowerCase()
              .replace(/ /g, '-'),
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
            description: "한글 포함 시 작성"
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
            label: "내용",
            isBody: true,
          },
          {
            label: "태그",
            name: "tags",
            type: "string",
            list: true
          },
        ],
      },
    ],
  },
});
