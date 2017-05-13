import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import api from '@/api'

import Login from 'com/Login'
import Sche from 'com/sche/Main'
import Inbox from 'com/inbox/Main'
import Plan from 'com/plan/Main'
import Doc from 'com/doc/Main'
import Me from 'com/me/Main'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/sche'
    },
    {
      path: '/sche',
      name: 'sche',
      component: Sche,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/inbox',
      name: 'inbox',
      component: Inbox
    },
    {
      path: '/plan',
      name: 'plan',
      component: Plan
    },
    {
      path: '/doc',
      name: 'doc',
      component: Doc
    },
    {
      path: '/me',
      name: 'me',
      component: Me
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

router.beforeEach((to, from, next) => {
  store.state.env.isShowNav = false
  store.state.sys.currentPath = to.path

  if (!to.matched.some(record => record.meta.requireAuth)) {
    return next()
  }
  var currentUser = store.state.loginUser
  if (currentUser == null || currentUser.rsqUser == null) {
    currentUser = currentUser || {}
    api.system.checkAuth()
      .then((res) => {
        if (res.id) {
          currentUser.rsqUser = res
          store.state.loginUser = currentUser
          next()
        } else {
          next('/login')
        }
      })
  } else {
    window.rsqadmg.log('login user found')
    next()
  }
})

export default router
