# VitePress 是什么？
VitePress 是一个基于 Vite 和 Markdown 的静态网站生成器。它主要用于快速创建文档网站，例如 GitHub 仓库中的 README.md 文件。这么说有点晦涩难懂，一句话概述：VitePress 是一个基于 Vite 和 Markdown 的静态网站生成器，我们所熟知的Vue文档等都是使用VitePress生成的。

## 安装启动
1. 创建一个文件夹。安装VitePress：`npm add -D vitepress`
2. 安装向导: ` npx vitepress init `。这时候需要我回答几个简单的问题:
   - `Where sho uld VitePress initialize the config?`  对这个问题我们直接写 ` ./docs `。docs 目录作为 VitePress 站点的项目根目录
   - 后面的全部回车就行了
3. 创建完成后的目录:
![](/public/inGithub/1.png)
4. 启动服务: `npm run docs:dev`
``` json
{
   // ....

  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  },
  // ....
}
```
最后启动的成功是这样的:
![](/public/inGithub/2.png)

## 部署到Github Pages
1. 在项目中和docs同级目录下创建一个` .github/workflows `，然后在里面创建一个` deploy.yml `文件，内容如下(直接复制粘贴就行了，不要被里面的内容吓到)：
``` yaml
# 构建 VitePress 站点并将其部署到 GitHub Pages 的示例工作流程
#
name: Deploy VitePress site to Pages

on:
  # 在针对 `main` 分支的推送上运行。如果你
  # 使用 `master` 分支作为默认分支，请将其更改为 `master`
  push:
    branches: [main]

  # 允许你从 Actions 选项卡手动运行此工作流程
  workflow_dispatch:

# 设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# 只允许同时进行一次部署，跳过正在运行和最新队列之间的运行队列
# 但是，不要取消正在进行的运行，因为我们希望允许这些生产部署完成
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  # 构建工作
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # 如果未启用 lastUpdated，则不需要
      # - uses: pnpm/action-setup@v3 # 如果使用 pnpm，请取消此区域注释
      #   with:
      #     version: 9
      # - uses: oven-sh/setup-bun@v1 # 如果使用 Bun，请取消注释
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm # 或 pnpm / yarn
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Install dependencies
        run: npm ci # 或 pnpm install / yarn install / bun install
      - name: Build with VitePress
        run: npm run docs:build # 或 pnpm docs:build / yarn docs:build / bun run docs:build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  # 部署工作
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
以上这段配置代码的意思是当你每次推送到 `main` 分支时，GitHub Actions 会自动构建你的 VitePress 站点，并将其部署到 GitHub Pages。这样你就能每次改内容都能立即看到效果。**注意配置文件中的branches要和你的实际提交的分支一致。如果你是master分支就将main改为master。**

2. 到github中创建一个仓库

![](/public/inGithub/3.png)

**注意这里的仓库名是你的用户名.github.io的形式。如果你取的其他名字则需要在.vitepress/config.js中修改base属性，如下修改方式：**
![](/public/inGithub/4.png)
3. 最后在仓库中做如下设置
![](/public/inGithub/5.png)
最后等待GitHub Actions自动部署成功就会出现如下页面：
![](/public/inGithub/6.png)
直接点开链接就能看到效果了。