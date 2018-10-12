export default {
  /**
   * 环境变量
   */
  env: {
    version: {name: 'rsq-app-version', value: window.rsqConfig.version},
    //  是否在页面上添加nav元素，只有当页面添加了nav元素，且isShowNav为true的时候才会显示nav
    isAddNav: false,
    isShowNav: false,
    //  是否显示引导页
    isShowGuide: false
  },
  /**
   * 默认字段设置
   */
  defaultValue: {},
  /**
   * 系统使用到的model
   */
  sys: {
    //  当前路由的路径
    currentPath: '',
    appId: window.rsqadmg.store.app.appid
  },
  /**
   * 当前登录的用户，基本结构如下：
   * {
   *   rsqUser: {},  日事清相关的用户数据
   *   appUser: {}  第三方用户信息
   * }
   */
  loginUser: null,
  /**
   * 子任务执行者ID
   * @type {String}
   */
  subUserId: '',
  /**
   * 公司成员相关
   */
  staff: {
    //  公司成员的主列表，注意只有当公司人员发生变动的情况下才修改此列表
    list: null
  },
  realStaff: {
    //  公司成员的主列表，注意只有当公司人员发生变动的情况下才修改此列表
    list: null
  },
  /**
   *  收纳箱页面基础数据结构
   */
  inbox: {
    //  收纳箱日程列表
    items: null
  },
  /**
   * 日程页面基础数据结构
   */
  schedule: {
    //  当前日历选中的日期
    strCurrentDate: null,
    //  当前的日程列表
    items: null
  },
  /**
   * 日程与收纳箱公共的数据对象
   */
  todo: {
    // 当前的todoItem，可能是收纳箱中的，也可能是日程中的
    currentTodo: {
      subTodos: [],
      comments: [],
      rrule: ''
    },
    //  当点击子任务进入子任务编辑状态时，该字段用来存储当前的子任务
    currentSubtodo: {
      title: ''
    },
    // 存储自子任务的时间
    currentSubtodoDate: {
      dates: null,
      endDate: '',
      isCloseRepeat: true,
      isLastDate: true,
      repeatBaseTime: null,
      repeatType: null,
      startDate: ''
    },
    //  用于处理重复的任务修改时，需要用户选择“仅修改当前日程”、“修改当前以及以后日程”、“修改所有重复日程”
    currentTodoRepeat: {},
    //  重复相关的字段是否修改过，目前的条件是如果title/note/subtodos修改过，认为修改过
    isRepeatFieldEdit: false,
    //  如果是从日期页面跳回到编辑页面的，那么即使不在收纳箱中了，那么也暂时不显示checkbox
    delayShowCheckbox: false
  },
  /**
   * 计划相关的存储
   */
  plan: {
    coverList: null,
    currentKanbanItem: {}
  },
  /**
   * 组件之间需要共享的临时数据
   */
  pub: {
    /**
     * 在设置提醒的时候，暂存时间页面的数据
     * {
     *   "clock":{"startTime":"15:50","endTime":"15:55","alwaysAlert":true}
     *  }
     */
    currentTodoTime: {},
    /**
     * 在设置重复的时候，暂存日期页面的数据
     * {
     *   dates: null,
     *   startDate: null,
     *   endDate: null,
     *   repeatType: null,
     *   repeatBaseTime: null
     * }
     */
    currentTodoDate: null,
    /**
     * 编辑子任务
     * @type {[type]}
     */
    currentTodoDateEdit: null,
    /**
     * 子任务标题
     * @type {String}
     */
    subtitle: '',
    pubId: '',
    /**
     * 当前滑动的ID
     * @type {Number}
     */
    sliderId: null
  },
  //  --------缓存相关--------
  /**
   * 日程缓存的列表，以日期作为key值
   */
  dateTodosCache: {},
  /**
   * openid对应的rsqid的缓存
   */
  openidCache: {},
  /**
   * rsqid对应的openid的缓存
   */
  rsqidCache: {},
  /**
   * 每一天是否含有todo的cache，以date.getTime()的Number类型作为key值，true和false作为value值
   */
  dayHasTodoCache: {},
  replyId: null,
  replyName: null,
  record: [],
  userList: [],
  memberList: [],
  selectedMember: [],
  planList: [],
  currentPlan: '',
  childPlanList: [],
  cardList: [],
  kanbanCardId: '',
  currentSubPlan: '',
  pos: '',
  num: '',
  labels: []
}
