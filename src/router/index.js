import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import api from '@/api'

import Login from 'com/Login'
import Sche from 'com/sche/Main'
import Inbox from 'com/inbox/Main'
import TodoNew from 'com/sche/TodoNew'
import TodoEdit from 'com/sche/TodoEdit'
import TodoEditSubTodo from 'com/pub/TodoEditSubTodo'
import TodoEditTime from 'com/pub/TodoEditTime'
import TodoEditAlert from 'com/pub/TodoEditAlert'
import Me from 'com/me/Main'
import kefu from 'com/me/kefu'
import remind from 'com/pub/remind'
import timeAndRemind from 'com/pub/timeAndRemind'
import childtask from 'com/sche/childtask'
import scheDetail from 'com/sche/scheDetail'
import timeOpen from 'com/pub/timeOpen'
import repeat from 'com/sche/repeat'
import date from 'com/sche/date'
import coment from 'com/pub/coment'
import time from 'com/pub/time'
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
      meta: {requireAuth: true}
    },
    {
      path: '/pub/coment',
      name: 'coment',
      component: coment,
      meta: {requireAuth: true}
    },
    {
      path: '/sche/date',
      name: 'date',
      component: date,
      meta: {requireAuth: true}
    },
    // {
    //   path: '/inbox/inboxNew',
    //   name: 'inboxNew',
    //   component: inboxNew,
    //   meta: {requireAuth: true}
    // },
    {
      path: '/sche/scheDetail',
      name: 'scheDetail',
      component: scheDetail,
      meta: {requireAuth: true}
    },
    {
      path: '/sche/repeat',
      name: 'repeat',
      component: repeat,
      meta: {requireAuth: true}
    },
    {
      path: '/pub/timeAndRemind',
      name: 'timeAndRemind',
      component: timeAndRemind,
      meta: {requireAuth: true}
    },
    {
      path: '/pub/remind',
      name: 'remind',
      component: remind,
      meta: {requireAuth: true}
    },
    {
      path: '/pub/time',
      name: 'time',
      component: time,
      meta: {requireAuth: true}
    },
    {
      path: '/pub/timeOpen',
      name: 'timeOpen',
      component: timeOpen,
      meta: {requireAuth: true}
    },
    {
      path: '/sche/childtask',
      name: 'childtask',
      component: childtask,
      meta: {requireAuth: true}
    },
    {
      path: '/inbox',
      name: 'inbox',
      component: Inbox,
      meta: {requireAuth: true}
    },
    {
      path: '/me/kefu',
      name: 'kefu',
      component: kefu,
      meta: {requireAuth: true}
    },
    {
      path: '/todo/:todoId',
      name: 'todoEdit',
      component: TodoEdit,
      meta: {requireAuth: true}
    },
    {
      path: '/todo/:todoId/subTodo',
      name: 'todoEditSubTodo',
      component: TodoEditSubTodo,
      meta: {requireAuth: true}
    },
    {
      path: '/todoEdit/time',
      name: 'todoEditTime',
      component: TodoEditTime,
      meta: {requireAuth: false}
    },
    {
      path: '/todoEdit/alert',
      name: 'todoEditAlert',
      component: TodoEditAlert,
      meta: {requireAuth: false}
    },
    {
      //  todoType用来表示是收纳箱新建todo还是日程新建todo，"inbox" or "schedule"
      path: '/todo/new/:todoType',
      name: 'todoNew',
      component: TodoNew,
      meta: {requireAuth: true}
    },
    {
      path: '/me',
      name: 'me',
      component: Me,
      meta: {requireAuth: true}
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

/**
 * 在路由切换时判断切换到的页面是否需要权限验证
 * 如果需要权限验证，那么就判断用户信息是否存在，如果不存在，就读取用户信息
 */
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
