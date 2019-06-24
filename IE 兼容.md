# IE 兼容

# IE 11

## 1. 引入 @babel/polyfill

可以在 index.js 入口文件__最开头(必须是最前面才能起作用)__引入：

```javascript
import "@babel/polyfill"
import React from 'react'
//...
```

也可以在 webpack 中配置：

```javascript
module.exports = {
  entry: [
    '@babel/polyfill', // 放在最前面
    require.resolve('react-dev-utils/webpackHotDevClient'),
    paths.appIndexJs
  ]
}
```

官方介绍还需要引入其他的插件：raf、babel-plugin-transform-runtime 等，可以当做参考，但是这里并没有用到

__参考__：
* [antd 兼容性](https://ant.design/docs/react/getting-started-cn#%E5%85%BC%E5%AE%B9%E6%80%A7)
* [React 环境要求](https://react.docschina.org/docs/javascript-environment-requirements.html)

## 2. querySelectorAll 集合的 forEach

querySelectorAll 获取的 NodeList 集合在 IE 中不支持 forEach，要转化为数组之后使用：

```javascript
document.querySelectorAll('div').forEach(()=>{...})
//=> 转化为数组
Array.prototype.slice.call(document.querySelectorAll('xxx'))
```

## 3. 图谱边的修改，要修改两个地方

IE 中出现边颜色消失，以及箭头问题等，实际上不是兼容性问题。

原因在于，d3.force 本身绘制边的时候就有针对 __“IE bug, marker-start 不能动态更新”__ 的处理，所以，在修改边的样式以及箭头等，都需要修改两个地方。否则在 IE 中会出现意外。

可复制 IE bug 进行搜索。

## 4. antd 的 Button 组件中不能包含 a 标签或者 Link 组件

包含 a 标签或 Link 组件之后，其跳转等都会失效。估计与 IE 的事件流有关，解决办法：可以让 a 标签 或 Link 组件来包含 Button 组件，或者干脆不使用 Button，样式自己写。

```jsx
<Link to='/root/main/projectMgt/createOrEdit?operation=create' className="btn-create">
   <Button type='primary' className='btn-create'>新建项目</Button>
</Link>
```

## 5. 样式属性为 url() 最好带上引号
在设置这种属性时，可以带上，也可以不带引号。在 Chrome 中获取到的属性值，是跟设置的时候一模一样的值，但是__在 IE 中，获取到的值都会带上双引号。__

在图谱中，设置箭头的引用路径时，就需要设置一个 `url(#id)` 。而这个__ id 通常带有边的关键标识__，有时需要获取其值。为了兼容 IE，<strong>最好在设置的时候，就把引号带上，而且要是双引号 </strong><strong><code>url(&quot;#id&quot;)</code></strong>

```javascript
edge.attr('marker-start', 'url("#arrow_guarantee_circle")')
```

注意，这个同样要修改两个地方。原因查看第 3 点


## 6. 样式调整

（1）导航栏出现换行
盒子模型问题，设置为 content-box

（2）级联选择器最后一项部分被覆盖

级联的样式设置了 <code>-ms-overflow-style</code><span data-type="color" style="color:#333333"><code>: -ms-autohiding-scrollbar</code></span><span data-type="color" style="color:#333333">导致滚动条不计入布局，设置为 scrollbar 即可。</span>

<span data-type="color" style="color:#333333">另外横向也会出现被滚动条覆盖，原因是盒子模型的问题，只要不设置 </span>`.ant-cascader-menu-item` 的宽度，只设置 `.ant-cascader-menu`<span data-type="color" style="color:#333333"> 的宽度来达到溢出省略号效果</span>

（3）级联选中显示空白

级联选择器是 span > input + span 的结构，内容是放在 span 中的，在 IE 中被 input 覆盖，设置 span 的 z-index 即可

# IE 10

## 1. 引入 setprototypeof 插件

IE 10 不支持 Object.setPrototypeOf 方法，且 babel/polyfill 对其的重写使用到了 `__proto__` ，IE 10 也不支持，所以这里使用了 [setprototypeof](https://github.com/wesleytodd/setprototypeof) 插件。

* [ES6 Class 和 Babel 6 在 IE <= 10 时候的一个坑](https://hikerpig.github.io/2017/09/25/2017-09-25-ES6+Babel-little-bug-under-IE11/)

__重点在于引入。__

> 首先，报错出在哪里？查看控制台，发现在 chalk 中使用了 setPrototype，而 chalk 是在 start.js 和 build.js 中使用的，也就是说，__在项目入口中引入并不会起作用__。
>
> 那么只能在 webpack 中引入，而且必须在 `require.resolve('react-dev-utils/webpackHotDevClient')` 之前。
>
> 流程 `create-react-app`<span data-type="color" style="color:rgb(36, 41, 46)"><span data-type="background" style="background-color:rgb(255, 255, 255)"> </span></span>-> `webpack.config.js`<span data-type="color" style="color:rgb(36, 41, 46)"><span data-type="background" style="background-color:rgb(255, 255, 255)"> </span></span>-> `react-dev-utils/webpackHotDevClient.js`<span data-type="color" style="color:rgb(36, 41, 46)"><span data-type="background" style="background-color:rgb(255, 255, 255)"> </span></span>-> `react-dev-utils/formatWebpackMessages.js`<span data-type="color" style="color:rgb(36, 41, 46)"><span data-type="background" style="background-color:rgb(255, 255, 255)"> </span></span>->`chalk`<span data-type="color" style="color:rgb(36, 41, 46)"><span data-type="background" style="background-color:rgb(255, 255, 255)"> </span></span>-> `ansi-styles` -> `appIndexJS`
>
> 改变流程为：`create-react-app`<span data-type="color" style="color:rgb(36, 41, 46)"><span data-type="background" style="background-color:rgb(255, 255, 255)"> </span></span>-> `webpack.config.js`<span data-type="color" style="color:rgb(36, 41, 46)"><span data-type="background" style="background-color:rgb(255, 255, 255)"> </span></span>-> `<span data-type="color" style="color:#F5222D">setupPolyfillJS</span>` -> `react-dev-utils/webpackHotDevClient.js`<span data-type="color" style="color:rgb(36, 41, 46)"><span data-type="background" style="background-color:rgb(255, 255, 255)"> </span></span>-> `react-dev-utils/formatWebpackMessages.js`<span data-type="color" style="color:rgb(36, 41, 46)"><span data-type="background" style="background-color:rgb(255, 255, 255)"> </span></span>->`chalk`<span data-type="color" style="color:rgb(36, 41, 46)"><span data-type="background" style="background-color:rgb(255, 255, 255)"> </span></span>-> `ansi-styles` -> `appIndexJS`

__（1）设置 paths__

```javascript
module.exports = {
  setupPolyfillJs: resolveApp('src/polyfill.js'),
  //...
}
```

__（2）webpack 入口中引入（注意：要修改两个文件 dev 和 prod）__

```javascript
module.exports = {
  entry: [
    paths.polyFillJs,
    require.resolve('react-dev-utils/webpackHotDevClient'),
    paths.appIndexJs,
  ]
}
```

__（3）polyfill.js 统一管理__

```javascript
require("@babel/polyfill")
require('raf/polyfill') // requestAnimationFrame polyfill

Object.setPrototypeOf = require('setprototypeof')
```

## 2. constructor 中的 props

在 constructor 中，不要使用 this.props，由于 props 直接作为参数传递给 constructor，IE 10 中不会作为 this 的一个属性，直接使用 props 即可。好像 IE 11 也会有这个问题

```javascript
class A extends React.Component {
  constructor(props) {
    super()
    console.log(props)
  }
}
```

## 3. chalk.inverse 不存在


## 4. Echart 图标不显示

报错 不支持 rerender、dispose 方法

# IE 9

## 1. 引入 formdata-polyfill

IE 9 不支持 H5 的 FormData 类，所以引入 polyfill

* [formdata-polyfill](https://github.com/jimmywarting/FormData)

```javascript
require("@babel/polyfill")
require('raf/polyfill') // requestAnimationFrame polyfill

Object.setPrototypeOf = require('setprototypeof')

require('formdata-polyfill')
```

需要注意的是：formdata-polyfill 要放在 babel/polyfill 下面，否则会报 WeekMap 未定义的错误，甚至在 IE 10 也报这个错误。原因在于 formdata-polyfill 使用了 WeekMap。可以通过上面的链接查看

## 2. Blob 未定义

IE 9 不支持 Blob 类，需要引入 polyfill。

* [Blob.js](https://github.com/eligrey/Blob.js) 以及其对应的 npm [blob-polyfill](https://www.npmjs.com/package/blob-polyfill)
* [blob](https://github.com/webmodules/blob)

第一个使用了没有效果，不明原因。
第二个使用了也没有效果，原因是其本身就不兼容 IE9，但是由第一个的作者之一提了一个 [issue](https://github.com/webmodules/blob/issues/15)，可以解决IE 9 兼容，尝试成功。

但是不可能在 node\_modules 中改它的 JS 文件，于是尝试抽取第二个的 JS 放到自己的独立文件，失败了。

于是尝试 Blob.js 源码，而不是 blob-polyfill，抽取成独立文件。修改了一小部分之后成功。

抽取为：src/blob.js

修改部分：(由于报错进而修改的部分)

```javascript
- var global = typeof window === 'object'
-      ? window : typeof self === 'object'
-     ? self : this
//=>
+ var global = window

function FakeBlobBuilder() {
  //...
}

- if (strTag) {
-   File.prototype[strTag] = 'File'
-   Blob.prototype[strTag] = 'Blob'
-   FileReader.prototype[strTag] = 'FileReader'
- }

//=>
function FakeBlobBuilder() {
  //...
+ if (strTag) {
+   File.prototype[strTag] = 'File'
+   Blob.prototype[strTag] = 'Blob'
+   FileReader.prototype[strTag] = 'FileReader'
+ }
}
```

引入到 polyfill.js 中：

```javascript
require("@babel/polyfill")
require('raf/polyfill')

Object.setPrototypeOf = require('setprototypeof')

require('./blob')
require('formdata-polyfill')
```

TODO：这种方式似乎并不是很好，后面再尝试。

## 3. 部分 placeHolder 不显示
## 4. 错误：对象不支持‘inverse’属性和方法
  lines[0] = chalk.inverse(lines[0]);
