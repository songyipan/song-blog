# button 组件开发

button 按钮咱们就对着 elment-ui 的 button 种类和样式来做，不一定特别全面，但是基本够用了，如果需要的话，可以自己加一些样式。

## 写一下基础样式

创建文件，theme/src/index.scss，接着创建 theme/src/x-button.scss。在 x-button.scss 中写一下基础样式:

```scss
.x-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  min-width: 80px;
  padding: 0 16px;
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid #e6e6e6;

  box-sizing: border-box;
  line-height: 1;
  color: #4e5159;
  text-align: center;
  font-size: 14px;
  white-space: nowrap;
  transition: 0.3s;

  cursor: pointer;
  user-select: none;
  vertical-align: middle;

  //   去掉按钮点击的默认样式和边框线
  &:focus {
    outline: none;
    border: none;
  }
  span {
    line-height: 1;
    display: inline-flex;
    align-items: center;
  }
}
```

以上都是一些简单的 css 样式这里我就不做介绍了。在 index.scss 中引入一下这个样式:

```scss
@use "./x-button.scss";
```

在 example 中的 main.js 中引入一下这个样式:

```js
import "@ui-library/theme/src/index.scss";
```

这样就可以看到 button 组件样式发生了改变

## 添加按钮类型

在 XButton 里面的 index.vue 中需要加一下 modifier，然后根据不同的 modifier 来设置不同的样式。在 props 中接收传递来的类型。具体代码如下：

```vue
<script setup>
import { useNamespace } from "@ui-library/hooks";

defineOptions({
  name: "XButton",
});

const props = defineProps({
  type: {
    type: String,
    default: "default",
  },
});

const ns = useNamespace("button");
</script>

<template>
  <button :class="[ns.block(), ns.modifier(type)]">
    <span>
      <slot>button</slot>
    </span>
  </button>
</template>
```

以上代码中在:class 中添加了 `ns.block()` 和 `ns.modifier(type)`，然后根据不同的 type 来设置不同的样式。

- `ns.block()`：这个就是我们之前在 x-button.scss 中定义的 .x-button 这个类名，就是我们最终要渲染的按钮。
- `ns.modifier(type)`：这个最终生成的是 .x-button-default 这个类名，就是我们根据不同的 type 来设置不同的样式。如果传递的 type 是 danger，那么最终生成的就是 .x-button-danger 这个类名。

## 在 x-button.scss 添加不同类型的样式

```scss
.x-button {
  // 省略其他样式
  // 。。。。。。

  //   添加不同类型样式
  &-- {
    &default {
      border-color: #e3e5f1;

      &:hover {
        background-color: #6e96ff;
        color: white;
        border-color: #6e96ff;
      }
    }

    &success {
      background-color: #67c23a;
      color: white;
      border-color: #67c23a;

      &:hover {
        background-color: #a2d380;
        color: white;
        border-color: #a2d380;
      }
    }

    &danger {
      background-color: #f56c6c;
      color: white;
      border-color: #f56c6c;
      &:hover {
        background-color: #f78989;
        color: white;
        border-color: #f78989;
      }
    }

    &warning {
      background-color: #e6a23c;
      color: white;
      border-color: #e6a23c;
      &:hover {
        background-color: #ebb563;
        color: white;
        border-color: #ebb563;
      }
    }

    &primary {
      background-color: #409eff;
      color: white;
      border-color: #409eff;
      &:hover {
        background-color: #66b1ff;
        color: white;
        border-color: #66b1ff;
      }
    }
  }
}
```

以上都是 css 基础语法我就不做介绍了，大家可以参考一下。
