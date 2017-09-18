export default {
  /**
   * 环境变量
   */
  env: {
    //  是否在页面上添加nav元素，只有当页面添加了nav元素，且isShowNav为true的时候才会显示nav
    isAddNav: false,
    isShowNav: false
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
    currentPath: ''
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
   * 公司成员相关
   */
  staff: {
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
    currentTodo: null
  },
  /**
   * 组件之间需要共享的临时数据
   */
  pub: {
    /**
     * 设置todo的时间
     * {
     *   isClose: true,  //是否开启Close，默认是关闭的
     *   todo: {
     *      "createTaskDate":"20170914","clock":{"startTime":"15:50","endTime":"15:55","alwaysAlert":true}
     *    }
     *  }
     */
    currentTodoTime: {},
    /**
     * 设置repeat
     * {
     *   numBaseDate:
     *   todo: {
     *     alwaysRepeat: true, repeatType: 'everyWeek', repeatBaseTime: '', repeatOverDate: ''
     *   }
     * }
     */
    currentTodoRepeat: {}
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
  dayHasTodoCache: {}
}
