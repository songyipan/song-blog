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
      { text: "资源共享", link: "/res/index" },
    ],

    sidebar: {
      "/course/": [
        {
          text: "令人心动的NestJS全栈体系课",
          items: [
            {
              text: "为什么学习NestJS全栈",
              link: "/course/index",
            },
            {
              text: "如何学习NestJS全栈",
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
