import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import api from '@/api'
import Login from 'com/Login'
import Sche from 'com/sche/Main'
import Inbox from 'com/inbox/Main'
import TodoNew from 'com/sche/TodoNew'
import TodoEdit from 'com/sche/TodoEdit'
import TodoEditSubtodo from 'com/pub/TodoEditSubtodo'
import TodoEditTime from 'com/pub/TodoEditTime'
import TodoEditAlert from 'com/pub/TodoEditAlert'
import TodoEditDate from 'com/pub/TodoEditDate'
import SubTodoEditDate from 'com/pub/SubTodoEditDate'
import TodoEditRepeat from 'com/pub/TodoEditRepeat'
import TodoComment from 'com/pub/TodoComment'
import TodoNote from 'com/pub/TodoNote'
import Me from 'com/me/Main'
import Kefu from 'com/me/Kefu'
import Explain from 'com/pub/Explain'
import SubtodoList from 'com/pub/SubtodoList'
import SubTodoNew from 'com/pub/SubTodoNew'
import PlanSubTodoNew from 'com/pub/PlanSubTodoNew'
// import NoPermission from 'com/pub/NoPermission'
import CheckFailure from 'com/pub/CheckFailure'
import PcEnd from 'com/me/PcEnd'
import PlanList from 'com/plan/PlanList'
import PlanNameEdit from 'com/plan/PlanNameEdit'
import PlanNew from 'com/plan/PlanNew'
import ChildPlan from 'com/plan/ChildPlan'
import EditChildPlan from 'com/plan/EditChildPlan'
import PlanSetting from 'com/plan/PlanSetting'
import PlanTodoNew from 'com/plan/PlanTodoNew'
import PlanTodoEdit from 'com/plan/PlanTodoEdit'
import PlanTodoEditNote from 'com/plan/PlanTodoEditNote'
import PlanTodoEditDate from 'com/plan/PlanTodoEditDate'
import PlanTodoNewDate from 'com/plan/PlanTodoNewDate'
import PlanSubtodoList from 'com/plan/PlanSubtodoList'
import PlanTodoEditSubtodo from 'com/plan/PlanTodoEditSubtodo'
import PlanTodoComment from 'com/plan/PlanTodoComment'
import InboxNew from 'com/inbox/InboxNew'
import MoveToPlanList from 'com/pub/MoveToPlanList'
import MoveToPlanItem from 'com/pub/MoveToPlanItem'
import TodoEditRepeatNew from 'com/pub/NewRepeat/TodoEditRepeat'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/sche'
    },
    //  --------收纳箱相关页面--------
    //  收纳箱主页
    {
      path: '/inbox',
      name: 'inbox',
      component: Inbox,
      meta: {requireAuth: true}
    },
    //  新建收纳箱
    {
      path: '/inbox/new',
      name: 'inboxNew',
      component: InboxNew,
      meta: {requireAuth: true}
    },
    //  ------------------------
    //  --------日程相关页面--------
    //  日程主页
    {
      path: '/sche',
      name: 'sche',
      component: Sche,
      meta: {requireAuth: true},
      beforeEnter: (to, from, next) => {
        window.rsqadmg.exec('getItem', {
          name: store.state.env.version.name,
          success (p) {
            var localVersion = Number(p.value)
            var currentVersion = Number(window.rsqConfig.version)
            //  副版本更新时才显示
            if (isNaN(localVersion) || currentVersion - localVersion >= 1000) {
              //  显示引导页
              store.commit('SYS_GUIDE_SHOW')
            }
            next()
          }
        })
      }
    },
    //  创建日程的页面
    {
      //  todoType用来表示是收纳箱新建todo还是日程新建todo，"inbox" or "schedule"
      // path: '/todo/new/:todoType',
      path: '/sche/todo/create',
      name: 'todoNew',
      component: TodoNew,
      meta: {requireAuth: true}
    },
    //  日程备注页面，type有两种：sche表示日程的note，plan表示计划任务的note
    {
      path: '/sche/todo/note',
      name: 'todoNote',
      component: TodoNote,
      meta: {requireAuth: true}
    },
    //  todo的日期页面，用于新增或者编辑日程时候的日期设置
    {
      path: '/sche/todo/date',
      name: 'todoEditDate',
      component: TodoEditDate,
      meta: {requireAuth: false}
    },
    //  添加到计划列表
    {
      path: '/sche/todo/move',
      name: 'MoveToPlanList',
      component: MoveToPlanList,
      meta: {requireAuth: true}
    },
    //  添加到计划列表item
    {
      path: '/sche/todo/:planId/moveplan',
      name: 'MoveToPlanItem',
      component: MoveToPlanItem,
      meta: {requireAuth: true}
    },
    //  子任务日期
    {
      path: '/sche/todo/subdate',
      name: 'SubTodoEditDate',
      component: SubTodoEditDate,
      meta: {requireAuth: true}
    },
    //  todo的日期重复页面，用于新增或者编辑日程时候的日期重复设置
    {
      path: '/sche/todo/repeat',
      name: 'todoEditRepeat',
      component: TodoEditRepeat,
      meta: {requireAuth: false}
    },
    {
      path: '/todoEdit/repeatNew',
      name: 'todoeditrepeatnew',
      component: TodoEditRepeatNew,
      meta: {requireAuth: false}
    },
    //  todo的时间编辑页面，用于新增或者编辑日程时候的时间设置
    {
      path: '/sche/todo/time',
      name: 'todoEditTime',
      component: TodoEditTime,
      meta: {requireAuth: false}
    },
    //  todo的时间提醒编辑页面，用于新增或者编辑日程时候的时间提醒设置
    {
      path: '/sche/todo/alert',
      name: 'todoEditAlert',
      component: TodoEditAlert,
      meta: {requireAuth: false}
    },
    //  日程评论页面
    {
      path: '/sche/todo/comment',
      name: 'todoComment',
      component: TodoComment,
      meta: {requireAuth: true}
    },
    //  todo详情页面
    {
      path: '/sche/todo/:todoId',
      name: 'todoEdit',
      component: TodoEdit,
      meta: {requireAuth: true}
    },
    //  todo的子任务列表页面
    {
      path: '/sche/todo/:todoId/subtodo',
      name: 'subtodoList',
      component: SubtodoList,
      meta: {requireAuth: true}
    },
    //  todo的子任务新建
    {
      path: '/sche/todo/:todoId/subtodo/create',
      name: 'SubTodoNew',
      component: SubTodoNew,
      meta: {requireAuth: true}
    },
    //  todo的子任务的详情页面
    {
      path: '/sche/todo/:todoId/subtodo/:subtodoId',
      name: 'todoEditSubtodo',
      component: TodoEditSubtodo,
      meta: {requireAuth: true}
    },
    //  ------------------------

    //  --------计划页面--------
    //  新建plan的页面
    {
      path: '/plan/create',
      name: 'planNew',
      component: PlanNew,
      meta: {requireAuth: true}
    },
    //  plan列表页面
    {
      path: '/plan/list',
      name: 'PlanList',
      component: PlanList,
      meta: {requireAuth: true}
    },
    //  计划详情页面
    {
      path: '/plan/:planId/child-plan',
      name: 'childPlan',
      component: ChildPlan,
      meta: {requireAuth: true}
    },
    {
      path: '/plan/:planId/edit-child-plan',
      name: 'editChildPlan',
      component: EditChildPlan,
      meta: {requireAuth: true}
    },
    //  计划设置页面
    {
      path: '/plan/:planId/plan-setting',
      name: 'planSetting',
      component: PlanSetting,
      meta: {requireAuth: true}
    },
    //  编辑plan名称的页面
    {
      path: '/plan/:planId/edit-name',
      name: 'planNameEdit',
      component: PlanNameEdit,
      meta: {requireAuth: true}
    },
    //  创建计划任务的页面
    {
      path: '/plan/todo/create',
      name: 'planTodoNew',
      component: PlanTodoNew,
      meta: {requireAuth: true}
    },
    //  计划任务备注页面，type有两种：sche表示日程的note，plan表示计划任务的note
    {
      path: '/plan/todo/note',
      name: 'planTodoEditNote',
      component: PlanTodoEditNote,
      meta: {requireAuth: true}
    },
    //  计划任务的日期页面，用于新增或者编辑日程时候的日期设置
    {
      path: '/plan/todo/date',
      name: 'planTodoEditDate',
      component: PlanTodoEditDate,
      meta: {requireAuth: false}
    },
    //  计划新建页面时间
    {
      path: '/plan/todo/newdate',
      name: 'planTodoNewDate',
      component: PlanTodoNewDate,
      meta: {requireAuth: false}
    },
    //  计划日程评论页面
    {
      path: '/plan/todo/comment',
      name: 'planTodoComment',
      component: PlanTodoComment,
      meta: {requireAuth: true}
    },
    // 计划任务移动
    {
      path: '/plan/todo/move',
      name: 'MoveToPlan',
      component: MoveToPlanList,
      meta: {requireAuth: true}
    },
    // 计划任务读取列表
    {
      path: '/plan/todo/:planId/moveplan',
      name: 'PlanMoveToPlanItem',
      component: MoveToPlanItem,
      meta: {requireAuth: true}
    },
    //  计划todo详情页面
    {
      path: '/plan/todo/:planTodoId',
      name: 'planTodoEdit',
      component: PlanTodoEdit,
      meta: {requireAuth: true}
    },

    //  计划的子任务列表页面
    {
      path: '/plan/todo/:planTodoId/subtodo',
      name: 'planSubtodoList',
      component: PlanSubtodoList,
      meta: {requireAuth: true}
    },
    //  计划的子任务的详情页面
    {
      path: '/plan/todo/:planTodoId/subtodo/create',
      name: 'PlanSubTodoNew',
      component: PlanSubTodoNew,
      meta: {requireAuth: true}
    },
    {
      path: '/plan/todo/:planTodoId/subtodo/:subtodoId',
      name: 'planTodoEditSubtodo',
      component: PlanTodoEditSubtodo,
      meta: {requireAuth: true}
    },
    //  ------------------------

    //  --------个人信息--------
    //  个人信息
    {
      path: '/me/pc-end',
      name: 'pcEnd',
      component: PcEnd,
      meta: {requireAuth: true}
    },
    //  客服页面
    {
      path: '/me/kefu',
      name: 'kefu',
      component: Kefu,
      meta: {requireAuth: true}
    },
    //  无权查看的跳转页面
    {
      path: '/pub/check-failure',
      name: 'checkFailure',
      component: CheckFailure,
      meta: {requireAuth: true}
    },
    //  产品介绍页面
    {
      path: '/pub/explain',
      name: 'explain',
      component: Explain,
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
    //  ------------------------

    // {
    //   path: 'com/plan/taskMember',
    //   name: 'taskMember',
    //   component: taskMember,
    //   meta: {requireAuth: true}
    // },
    // {
    //   path: '/plan/createSubplan',
    //   name: 'createSubplan',
    //   component: createSubplan,
    //   meta: {requireAuth: true}
    // },
    // {
    //   path: '/plan/Plan',
    //   name: 'Plan',
    //   component: Plan,
    //   meta: {requireAuth: true}
    // },
    // {
    //   path: '/demo/test',
    //   name: 'test',
    //   component: test,
    //   meta: {requireAuth: true}
    // },
    // {
    //   path: '/pub/MemberEdit',
    //   name: 'MemberEdit',
    //   component: MemberEdit,
    //   meta: {requireAuth: true}
    // },
    // {
    //   path: '/pub/MemberList',
    //   name: 'MemberList',
    //   component: MemberList,
    //   meta: {requireAuth: true}
    // },
    // {
    //   path: '/pub/RemindWindow',
    //   name: 'RemindWindow',
    //   component: RemindWindow,
    //   meta: {requireAuth: true}
    // },
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
