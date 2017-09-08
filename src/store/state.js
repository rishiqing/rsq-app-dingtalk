export default {
  count: 0,
  //  默认字段设置
  defaultValue: {
    docNotePageMax: 10,
    schedule: {pContainer: 'IE'},
    todo: {},
    planCard: {kanbanItemList: []},
    kanbanTodo: {},
    planTemplate: [
      {name: '默认计划', value: 'none'},
      {name: '待办>进行中>已完成', value: 'taskPlan'},
      {name: '策划>原型>效果>审核>完成', value: 'designPlan'},
      {name: '需求>设计>研发>测试>发布', value: 'RDPlan'},
      {name: '问题>解决中>已解决>已反馈', value: 'userSupport'}
    ],
    docSetTemplate: [
      {name: '普通文档', value: 'essays', bg: 'card-default-7.png'},
      {name: '工作日报', value: 'daily', bg: 'card-default-1.png'},
      {name: '工作周报', value: 'week', bg: 'card-default-9.png'},
      {name: '工作月报', value: 'month', bg: 'card-default-6.png'}
    ]
  },
  env: {
    //  是否在页面上添加nav元素，只有当页面添加了nav元素，且isShowNav为true的时候才会显示nav
    isAddNav: false,
    isShowNav: false
  },
  sys: {
    currentPath: ''
  },
  //  当前登录的用户
  //  {
  //    rsqUser:  日事清相关的用户数据
  //    appUser:  第三方用户信息
  // }
  loginUser: null, //  日事清用户
  staff: {
    list: null  //  公司成员的主列表，注意只有当公司人员发生变动的情况下才修改此列表
  },
  //  看板页面基础数据结构
  plan: {
    starPlans: null,
    commonPlans: null,
    currentPlan: null,
    lastPlanCard: null   //  上次新增todo所属于的card，此处做缓存，下次新增todo时默认属于此card
  },
  //  看板任务页面基础数据结构
  planTodo: {
    currentTodo: null
  },
  //  收纳箱页面基础数据结构
  inbox: {
    items: null
  },
  //  日程页面基础数据结构
  schedule: {
    strCurrentDate: null,
    items: null,
    dateItems: {}  //  缓存的列表，以日期作为key值
  },
  //  收纳箱和日程公共的数据
  todo: {
    // 当前的todoItem，可能是收纳箱中的，也可能是日程中的
    currentTodo: null
  },
  //  文集页面基础数据结构
  doc: {
    docSetList: null,  //  缓存文集列表
    currentDocSet: null,  //  当前active状态文集
    currentDocNoteList: null,  //  当前active状态的文集中的笔记的列表
    currentDocNote: null,  //  当前处于编辑状态的笔记
    docNoteListStatusMap: {},  //  缓存docNoteList的状态列表，以docSet的id作为key值，存储docNoteList的状态信息，例如是否已全部加载等。
    docNoteListMap: {}  //  缓存列表，以docSet的id作为key值，缓存该id下的docNote
  },
  //  openid对应的rsqid的缓存
  openidCache: {},
  //  rsqid对应的openid的缓存
  rsqidCache: {}
}
