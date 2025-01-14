import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "XIAOSONG的TS全栈",
  description: "知识分享",
  base: "/song-blog/",

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      { text: "NestJS学习", link: "/course/index" },
      { text: "组件库开发", link: "/componentDocs/index" },
    ],

    sidebar: {
      "/componentDocs/": [
        {
          text: "使用monorepo 构建组件库",
          items: [
            {
              text: "monorepo 构建组件库",
              link: "/componentDocs/index",
            },
            {
              text: "BEM规范",
              link: "/componentDocs/bem",
            },
          ],
        },
      ],
      "/course/": [
        {
          text: "令人心动的NestJS全栈体系课",
          items: [
            {
              text: "为什么学习NestJS全栈",
              link: "/course/index",
            },
            {
              text: "令人心动的课程介绍",
              link: "/course/abouts",
            },
          ],
        },
      ],
      "/post/": [
        {
          text: "课程知识点",
          items: [
            {
              text: "RBAC权限控制",
              link: "/post/RBAC_Auth",
            },
            {
              text: "vitePress+Github部署博客主页",
              link: "/post/inGitHub",
            },
          ],
        },
        {
          text: "Prisma 使用",
          items: [
            {
              text: "Prisma 使用入门",
              link: "/post/prisma/prisma",
            },
            {
              text: "prisma 自引用",
              link: "/post/prisma/prisma-self-reference",
            },
          ],
        },
      ],
    },
  },
});
