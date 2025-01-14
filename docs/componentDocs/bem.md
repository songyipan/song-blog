# 什么是 BEM 规范

BEM（Block、Element、Modifier）是 CSS 命名规范。Bem 是块（block）、元素（element）、修饰符（modifier）的简写。其实真是使用起来不只是这三个词，而是还有其他的，比如：块（block）、元素（element）、修饰符（modifier）、状态（state）、主题（theme）、主题元素（theme element）、主题修饰符（theme modifier）、主题状态（theme state）等。这里我来举一个例子。比如有如下卡片结构：

```html
<div class="sb-card-v2 sb-card-v2--theme_dark">
  <h2 class="sb-card-v2__title">卡片标题</h2>
  <p class="sb-card-v2__content">卡片内容</p>
</div>

<div class="sb-card-v2 sb-card-v2--theme_light">
  <h2 class="sb-card-v2__title">卡片标题</h2>
  <p class="sb-card-v2__content">卡片内容</p>
</div>
```

以上代码中 sb-card-v2 是块，其中 v2 是 blockSuffix，这个 blockSuffix 是为了解决 block 重复的问题，比如有另一个 block 也是 sb-card-v2，那么就会有冲突，所以需要添加后缀。`sb-card-v2__title` 和 `sb-card-v2__content` 是块 `sb-card-v2` 的元素，这里的 title 和 content 是 element。`sb-card-v2--theme_dark` 和 `sb-card-v2--theme_light` 是块 `sb-card-v2` 的修饰符,这里的 dark 和 light 是 modifier，后面的 light 和 dark 就是 modifier 的值。

## 创建生成 BEM 命名的工具

创建 hooks/index.js 用来导出所有的 hooks，然后创建 hooks/useNamespace/useNamespace.js 用来导出 useNamespace useNamespace 函数用来创建 BEM 命名。具体代码如下:

```js
export const defaultNamespace = "x";

export const useNamespace = (blocks) => {
  const namespace = defaultNamespace;

  const block = (blockSuffix) => {
    return _bem(namespace, blocks, blockSuffix, "", "", "");
  };

  const element = (element) =>
    element ? _bem(namespace, blocks, "", element, "", "") : "";

  const modifier = (modifier, value) =>
    modifier ? _bem(namespace, blocks, "", "", modifier, value) : "";

  const is = (activeName, active) =>
    activeName && active ? `is-${activeName}` : "";

  return {
    namespace,
    block,
    element,
    modifier,
    is,
  };
};

const _bem = (
  namespace,
  block,
  blockSuffix,
  element,
  modifier,
  modifierValue
) => {
  let cls = `${namespace}-${block}`;
  blockSuffix && (cls += `-${blockSuffix}`);
  element && (cls += `__${element}`);
  modifier && (cls += `--${modifier}`);
  modifierValue && (cls += `_${modifierValue}`);

  return cls;
};
```

以上代码看上去很复杂其实一点也不简单（一点也不难），我带大家分解一下。

- `export const defaultNamespace = "x";`: 这段代码其实就是创建了一个默认的组件名前缀，比如 elementUI 组件库的前缀是 el，里面的每一个组件都是 el-xxx 的形式，比如 el-button，el-input，el-card 等等。
- `_bem`:这个函数就是用来创建 bem 命名的，它接收 6 个参数，第一个参数是组件名前缀，第二个参数是块名，第三个参数是块的后缀，第四个参数是元素名，第五个参数是修饰符名，第六个参数是修饰符的值，这个函数是不暴露的。
- `useNamespace`: 这个函数就是用来创建 bem 命名的，它接收一个参数，这个参数就是块名，这个函数返回一个对象，对象中有四个方法，分别是 block，element，modifier，is。
- `block`: 这个函数就是用来创建块的，它接收一个参数，这个参数就是块的后缀，这个函数返回一个 bem 命名。
- `element`: 这个函数就是用来创建元素的，它接收一个参数，这个参数就是元素的名字，这个函数返回一个 bem 命名。
- `modifier`: 这个函数就是用来创建修饰符的，它接收两个参数，第一个参数就是修饰符的名字，第二个参数就是修饰符的值，这个函数返回一个 bem 命名。
- `is`: 这个函数就是用来创建状态的，它接收两个参数，第一个参数就是状态的名字，第二个参数就是状态的值，这个函数返回一个 bem 命名。这个函数后面会用到这里先不做演示。

最后在 hooks/index.js 中导出 useNamespace。

```js
export * from "./useNamespace/useNamespace";
```

## 使用 BEM 规范

在 button 组件中我们使用一下上面写的 hooks。代码如下：

```html
<script setup>
  import { useNamespace } from "@ui-library/hooks";

  defineOptions({
    name: "XButton",
  });

  // 调用一下userNamespace
  const ns = useNamespace("button");

  consoe.log(ns.block()); // x-button
  consoe.log(ns.element("content")); // x-button__content
  consoe.log(ns.modifier("size", "small")); // x-button--size_small
  consle.log(ns.is("disabled", true)); // is-disabled
</script>

<template>
  <button :class="[ns.block(),  ns.modifier("size", size), ns.modifier("size", "small")]">
    <span>
      <slot>button</slot>
    </span>
  </button>
</template>
```

统过以上在`:class="[ns.block(),  ns.modifier("size", size),ns.modifier("size", "small")]"` 来使用 BEM 规范,这时候 button 这个按钮就会加上 class，值比如 `x-button--size_small`。后面带大家写样式的时候就会看到效果了。
