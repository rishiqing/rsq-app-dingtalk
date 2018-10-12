// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'as/css/element-ui.css'
import 'as/css/index.scss'
import 'as/css/picker2.css'
import 'as/css/message-box.css'
import 'as/js/picker.min.js'
import 'as/js/rsqAdapterManager.js'
import 'as/js/rsqDdmAdapter.js'
// xss漏洞
import 'as/js/xssFilter.js'

/**
 * 解决iOS的回弹问题
 * https://www.npmjs.com/package/inobounce
 * All you need is an element with height or max-height, overflow: auto and -webkit-overflow-scrolling: touch
 */
import 'as/js/inobounce.js'

// 全局添加Promise垫片，防止不支持promise的浏览器中出现bug
import Pro from 'es6-promise'
Pro.polyfill()

import Vue from 'vue'
import VueTouch from 'vue-touch'
import { RRule } from 'rrule'

import App from './App'
import router from './router'
import store from './store'
import weui from 'vue-weui'
//  sentry相关
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import ElementUI from 'element-ui'
// 图片轮播
import VueAwesomeSwiper from 'vue-awesome-swiper'
// require styles
import 'swiper/dist/css/swiper.css'

//  正式环境下配置sentry
if (window.rsqConfig.env === 'prod') {
  Raven
    .config('https://8c36e59fcc6f4d1283c64115f5a99955@sentry.io/230122')
    .addPlugin(RavenVue, Vue)
    .install()
} else {
  // const ele = document.getElementById('splashLoading')
  // if (ele) {
  //   ele.parentNode.removeChild(ele)
  // }
}
document.addEventListener('touchend', function () {
  let inputArrays = document.querySelectorAll('input')
  if (inputArrays.length !== 0) {
    for (let key = 0; key < inputArrays.length; key++) {
      inputArrays[key].blur()
    }
  }
}, false)
// 注册双击事件
VueTouch.registerCustomEvent('doubletap', {
  type: 'tap',
  taps: 2
})

Vue.use(VueTouch)
Vue.use(weui)
Vue.use(VueAwesomeSwiper)
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$rrule = RRule



window.rsqadmg.exec('auth', {
  success: function (rsqUser, authUser) {
    store.state.loginUser = {
      rsqUser: rsqUser,
      authUser: authUser
    }
    console.log(rsqUser, authUser)
    // growingUtil.growingIoMethod(rsqUser)
    //  去掉iOS的回弹效果
    window.rsqadmg.exec('disableBounce')

    store.state.env.isAddNav = true

    store.dispatch('fetchStaffList')
    //  获取组织结构
    store.dispatch('getAllUsers')
    /* eslint-disable no-new */
    new Vue({
      el: '#app',
      router,
      store,
      template: '<App/>',
      components: { App }
    })
  },
  error: function () {
    window.rsqadmg.exec('alert', {
      message: '企业成员数据同步中，请稍后……',
      success: function () {
        window.location.href = 'https://www.rishiqing.com'
      }
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
