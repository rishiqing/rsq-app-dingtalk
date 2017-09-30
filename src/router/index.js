import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import api from '@/api'
import coment from 'com/pub/coment'
import Init from 'com/Init'
import Upload from 'com/demo/Upload'
import SendConversation from 'com/demo/SendConversation'
import Scroll from 'com/demo/Scroll'
import Login from 'com/Login'
import Sche from 'com/sche/Main'
import Inbox from 'com/inbox/Main'
import TodoNew from 'com/sche/TodoNew'
import TodoEdit from 'com/sche/TodoEdit'
import TodoEditSubTodo from 'com/pub/TodoEditSubTodo'
import TodoEditTime from 'com/pub/TodoEditTime'
import TodoEditAlert from 'com/pub/TodoEditAlert'
import TodoEditDate from 'com/pub/TodoEditDate'
import TodoEditRepeat from 'com/pub/TodoEditRepeat'
import Me from 'com/me/Main'
import kefu from 'com/me/kefu'
import desp from 'com/pub/desp'
import CreateSubTodo from 'com/pub/CreateSubTodo'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/scroll'
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
    // {
    //   path: '/demo',
    //   name: 'demo',
    //   component: Demo,
    //   meta: {requireAuth: true}
    // },
    {
      path: '/pub/desp',
      name: 'desp',
      component: desp,
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
      name: 'CreateSubTodo',
      component: CreateSubTodo,
      meta: {requireAuth: true}
    },
    {
      path: '/todo/SubTodoEdit',
      name: 'SubTodoEdit',
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
      path: '/todoEdit/date',
      name: 'todoEditDate',
      component: TodoEditDate,
      meta: {requireAuth: false}
    },
    {
      path: '/todoEdit/repeat',
      name: 'todoEditRepeat',
      component: TodoEditRepeat,
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
    },
    // {
    //   //  用来测试
    //   path: '/demo',
    //   name: 'demo',
    //   component: Demo
    // },
    {
      //  用来测试
      path: '/init',
      name: 'init',
      component: Init
    },
    {
      //  用来测试
      path: '/upload',
      name: 'upload',
      component: Upload
    },
    {
      //  用来测试
      path: '/sendConversation',
      name: 'sendConversation',
      component: SendConversation
    },
    {
      //  用来测试
      path: '/scroll',
      name: 'scroll',
      component: Scroll
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
