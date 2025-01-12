# 什么是 monorepo 架构

**简单一句话概述就是在一个代码仓库里面放多个项目** 。在传统的项目开发里面一个项目对应一个代码仓库，然后使用 monorepo 可以让所有的项目共享一个仓库，并且这种方式可以很好的实现代码共享，非常方便测试和部署。

OK!废话不多说咱们直接开始。

## 安装 pnpm

首先要有 node 环境，如果没有直接去 node 官网下载安装，然后执行`npm i -g pnpm`.在执行`pnpm -v`测试下一下如果成功了会出现版本号。（这两个命令是在终端执行的）

## 初始化 UI 组件库项目

新建一个文件夹名字随便我这里取名**song-ui**。在里面新进三个文件夹：

- packages：存放组件库代码的。里面有 components（所有的组件）、hooks、utils、theme 等后面会一个个的介绍。
- examples：测试组件用的
- docs：组件的使用文档

目录结构是这样的

```
song-ui
   - docs
   - components
   - examples
```

## 建立工作区

首先在 song-ui 文件夹里面新建一个配置文件名字是`pnpm-workspace.yaml`。这个文件就是告诉 pnpm 那些文件是工作区。代码如下 song-ui/pnpm-workspace.yaml:

```yaml
packages:
  - "examples"
  - "packages/*"
  - "docs"
```

## 建立 UI 组件库相关的包

在 packages 目录里面新建三个文件夹：

- components ：存放组件的包
- utils：工具包
- hooks：钩子函数包

在以上三个包里面初始化 packages.json 来把他们分别做为独立的 npm 包来看。分别进入以上三个包中执行`pnpm init`命令初始化之后就会出现 packages.json 文件，并将里面的 name 改一改名字，我举个例子，比如 components 这个文件：

```json
{
  "name": "@song-ui/components",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

就是将 name 改成了@song-ui/包名的形式，其他两个包也是如此设置。

## 调用组件库中的包

首先在 song-ui 目录下执行`pnpm init` 然后在 packages.json 中设置一下。

```json
{
  "name": "ui-library",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@ui-library/hooks": "workspace:*",
    "@ui-library/components": "workspace:*",
    "@ui-library/utils": "workspace:*",
    "@ui-library/theme": "workspace:*"
  }
}
```

在 devDependencies 中加入创建的几个包，后面版本号写的是安装公共包中的 npm 包的意思然后执行`pnpm i`。这样安装完成后就可以在项目中使用这些包了。

## 初始化演示库（examples 文件夹）

在 song-ui 文件中执行`npm create vite examples`，这样就可以在 examples 文件中初始化测试组件库的项目了。

- 第一步执行 npm create vite examples，回车
- 继续执行选择 vue，回车
- 然后选择 JavaScript，回车
- cd examples
- npm i
- npm run dev 启动项目

## 构建组件的目录结构

在 components 中创建一个 button 组件来小试牛刀一下。看一下 button 的目录吧：

```
packages:
  - components:
      - button:
         -src:
           - style
           - index.vue
         - index.js
```

button 目录下 src 文件夹和 index.js 同级，index.js 是 button 组件的入口文件。src 里面的 index.vue 是 button 的渲染文件 style 里面放的啥我就不用说了吧。

index.vue 中的代码如下所示：

```html
<script setup>
  defineOptions({
    name: "XButton",
  });
</script>

<template>
  <button>
    <span>
      <slot>button</slot>
    </span>
  </button>
</template>
```

以上代码就是一个简单的结构，主要是给使用`defineOptions`定义一下组件的名字。这里的命名规则其实很简单，比如说 elementUI 的 button 组件叫 Elbutton 这里前面的 el 是为了防止命名冲突的。我取名叫 XButton 大家可以根据自己的喜好命名。

## 按需加载并导出组件

首先在 utils 目录里面新建一个 install.js，写入如下代码:

```js
export const componentsInstall = (components) => {
  components.install = (app) => {
    app.component(components.name, components);
  };

  return components;
};
```

然后再 utils 下面创建一个 index.js：

```js
export * from "./install";
```

这个函数其实就是接受一个组件，给组件添加 install 函数，这个 install 函数接收 app 对象，app 对象会调用 component 函数注册全局组件。

在 button/index.js 中增加如下代码：

```js
import { componentsInstall } from "@ui-library/utils";
import Button from "./src/index.vue";

// 提供按需加载的方式
export const XButton = componentsInstall(Button);
// 将组件导出
export default XButton;
```

其实很简单，就是将调用了 componentInstall 函数给组件增加 install 函数，然后将组件导出。

在 components 文件里面新增一个 index.js 这个是整个组件库的入口文件。`components/index.js`:

```js
export * from "./XButton/index";
```

## 全局注册导出组件

在 packages 下面新建一个文件 comments.js，代码如下：

```js
import { XButton } from "./components/XButton/index";
export default [XButton];
```

在 packages 下面新建 index.js，代码如下：

```js
// 按需 引入组件
export * from "./components/index";

import components from "./components";

export const install = (app) => {
  if (install.installed) return;
  console.log("install", components);
  components.forEach((component) => app.use(component));
};

export default install;
```

以上代码中 comments 其实就是将所有的组件引入并使用数组的方式导出。index.js 中将使用 forEach 循环注册了组件，并且将按需的方式也暴露出去了。

那么整个 packages 目录就是这样了：

```
packages:
  - components
  - utils
    -install.js
    -index.js
  - hooks
  - theme
  - index.js
  - components.js
```

## 在 examples 中测试组件库

在 examples 中的 main.js 中引入，测试一下全局注册

```js
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import XsUI from "../../packages";

const app = createApp(App);

app.use(XsUI);
app.mount("#app");
```

然后在 App.vue 中使用一下 button 组件:

```html
<XButton>text</XButton>
```

OK！！！大功告成了，UI 组件库基本的项目架构已经完成了
