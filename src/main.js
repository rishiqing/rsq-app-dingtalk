// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'as/css/index.scss'

import 'as/js/rsqAdapterManager.js'
import 'as/js/rsqDdmAdapter.js'
// xss漏洞
import 'as/js/xssFilter.js'

// 全局添加Promise垫片，防止不支持promise的浏览器中出现bug
import Pro from 'es6-promise'
Pro.polyfill()

import Vue from 'vue'
import VueTouch from 'vue-touch'
import App from './App'
import router from './router'
import store from './store'

Vue.use(VueTouch)

Vue.config.productionTip = false

window.rsqadmg.exec('auth', {
  success: function (rsqUser, authUser) {
    store.state.loginUser = {
      rsqUser: rsqUser,
      authUser: authUser
    }

    store.state.env.isAddNav = true

    /* eslint-disable no-new */
    new Vue({
      el: '#app',
      router,
      store,
      template: '<App/>',
      components: { App }
    })
  }
})

// new Vue({
//   el: '#app',
//   router,
//   store,
//   template: '<App/>',
//   components: { App }
// })
