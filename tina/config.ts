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
      publicFolder: "content/post",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
       /*
      Backend Studies
      */
      {
        name: "backend_studies",
        label: "Backend Studies",
        path: "content/post/backend-studies",
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
            name: "image",
            label: "커버 이미지",
            description: "cover/categoryname.png",
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
            list: false,
            options: [
              {
                value: 'Backend Studies/Spring Boot',
                label: 'Spring Boot',
              },
              {
                value: 'Backend Studies/Django',
                label: 'Django',
              },
              {
                value: 'Backend Studies/etc',
                label: 'etc.',
              }
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
            list: true,
          },
        ],
      },
       /*
      Computer Science
      */
      {
        name: "computer_science",
        label: "Computer Science",
        path: "content/post/computer-science",
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
            name: "image",
            label: "커버 이미지",
            description: "cover/categoryname.png",
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
            list: false,
            options: [
              {
                value: 'Computer Science/Network',
                label: 'Network',
              },
              {
                value: 'Computer Science/Design Pattern',
                label: 'Design Pattern',
              }
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
            list: true,
          },
        ],
      },
      /*
      Algorithm
      */
      {
        name: "algorithm",
        label: "Algorithm",
        path: "content/post/algorithm",
        defaultItem: ()=>{
          return {
            image: "/cover/algorithm.png",
            date: new Date(),
            slug: (values) => values?.title
              ?.toLowerCase()
              .replace(/ /g, '-')
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
            name: "image",
            label: "커버 이미지",
            description: "cover/categoryname.png",
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
            list: false,
            options: [
              {
                value: 'Algorithm/LeetCode',
                label: 'LeetCode',
              },
              {
                value: 'Algorithm/BaekJoon',
                label: 'BaekJoon',
              }
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
      Languages
      */
      {
        name: "languages",
        label: "languages",
        path: "content/post/languages",
        defaultItem: ()=>{
          return {
            date: new Date(),
            slug: (values) => values?.title
              ?.toLowerCase()
              .replace(/ /g, '-')
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
            name: "image",
            label: "커버 이미지",
            description: "cover/categoryname.png",
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
            list: false,
            options: [
              {
                value: 'Languages/Java',
                label: 'Java',
              },
              {
                value: 'Languages/C++',
                label: 'C++',
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
      Misc
      */
      {
        name: "misc",
        label: "Misc",
        path: "content/post/misc",
        defaultItem: ()=>{
          return {
            date: new Date(),
            slug: (values) => values?.title
              ?.toLowerCase()
              .replace(/ /g, '-'),
            categories: ['Misc'],
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
            name: "image",
            label: "커버 이미지",
            description: "cover/categoryname.png",
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
            list: false,
            options: [
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
    ],
  },
});
