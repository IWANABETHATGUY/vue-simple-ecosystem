# Ryu一个使用Vue实例作为Store的状态管理库
## 前言
写这个库主要是想更加深入的理解vuex的原理,目前也只是简单的看了下源码,写了一个可以在简单场景下使用的玩具库。
## 源码阅读
**我们直接打开src目录,目录结构是下面这样**  
-  module
  - module-collection.js
  - module.js
- plugins
  - devtool.js
  - logger.js
- helpers.js
- index.esm.js
- index.js
- mixin.js
- store.js
- util.js

module目前还没有看，还不太了解具体是什么作用的，plugins主要是注入一些工具，比如vue-dev-tool，方便开发者调试等。
util.js放 了一些工具函数。
主要关注index.js, mixin.js, store.js，三个文件
#### mixin.js
```js
export default function (Vue) {
  const version = Number(Vue.version.split('.')[0])

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
```
很简单的mixin,主要是为了做向下兼容,如果是vue2,在每一个vue实例中在beforeCreate生命周期执行一段store的挂载，这样我们就可以在`this.$store`中访问到。在自己的`$options`属性中是否有store属性， 如果有，这说明这是根组件
```js
//这就是为什么我们要在入口文件中引入store，并且在根实例中注入了，一般我们会写这样一段代码将store注入vue中。
import store from './path/to/store.js';

new Vue({
  el: '#root',
  store
})

```
这个store属性我们可以在`$options`属性上获得，如果是其他的情况只能在父组件的`$store`获取即可，在所有vue实例挂载完毕之后，我们就可以通过`this.$store.someProps` 获取。当然要在vue是实例中的computed中映射相应的，当`store`中的值发生变化了以后，可以直接相应到实例中的属性重新渲染视图。
