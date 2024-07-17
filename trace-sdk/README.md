# 前端全链路优化实战课SDK源码

本源码，是基于本人原公司的内部SDK，经过改造后的代码，可供学习参考，可以直接基于此源码改造并应用于你的项目。

持续更新中..

## 如何使用



## 本地调试

1. 源码构建

```
yarn build:js
```

2. 源码调试

```
yarn examples
```

## 基本用法

### UMD模式

```JavaScript
// init.js
const instance = window.traceSdkInit({
  dsn: 'http://localhost:2022/track.gif',
  appId: 'fontend-trace-geekbang-course'
})
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>UMD-js-demo</title>
    <script src="/dist/trace-sdk.umd.js"></script>
  </head>
  <body>
    <script src="./init.js"></script>
  </body>
</html>
```
