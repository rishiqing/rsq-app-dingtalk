import util from 'ut/jsUtil'

/**
 * mutation命名规则：
 * 模块前缀_主要操作实体_操作动作
 * 1、模块前缀：
 * SYS：系统级别，例如当前用户、团队用户等
 * INB：inbox收纳箱
 * SCH：schedule日程
 * TD：收纳箱和日程的公共模块
 * PLN：Plan计划（看板）
 * DOC：笔记
 * ME：个人相关
 * 2、操作实体，常用的有：
 * USR：用户
 * STF：员工
 * TODO：任务，包括了收纳箱、日程、计划任务
 * KB：计划看板
 * KBCARD：看板卡片
 * DSET：文集doc set
 * NOTE：笔记
 * LST：各种列表
 * 3、操作动作
 * CREATED
 * UPDATED
 * DELETED
 * GET
 * SET
 * READY
 * CACHED
 */
export default {
  /**
   * 登录后设置全局loginUser
   * @param state
   * @param p
   * @param p.user
   * @constructor
   */
  SYS_USR_LOGIN (state, p) {
    state.loginUser = p.user
  },
  /**
   * 注销后将全局loginUser置为null
   * @param state
   * @constructor
   */
  SYS_USR_LOGOUT (state) {
    state.loginUser = null
  },
  /**
   *
   * @param state
   * @param p
   * @param p.list
   * @constructor
   */
  SYS_STF_LST_READY (state, p) {
    state.staff.list = p.list
  },
  /**
   * 以openid作为key值进行缓存
   * @param state
   * @param p
   * @param p.key
   * @param p.value
   * @constructor
   */
  SYS_OPENID_CACHED (state, p) {
    state.openidCache[p.key] = p.value
  },
  /**
   * 以rsqid作为key值进行缓存
   * @param state
   * @param p
   * @param p.key
   * @param p.value
   * @constructor
   */
  SYS_RSQID_CACHED (state, p) {
    state.rsqidCache[p.key] = p.value
  },
  /**
   * 设置是否显示导航
   * @param state
   * @param p
   * @param p.isShow
   * @constructor
   */
  SYS_NAV_SHOW (state, p) {
    state.env.isShowNav = p.isShow
  },

  /* ----------------inbox----------------- */
  /**
   *
   * @param state
   * @param p
   * @constructor
   */
  INB_TODO_READY (state, p) {
    state.inbox.items = p.items
  },
  /**
   *
   * @param state
   * @param p
   * @param p.item
   * @constructor
   */
  INB_TODO_CREATED (state, p) {
    if (!state.inbox.items) {
      state.inbox.items = []
    }
    state.inbox.items.unshift(p.item)
  },
  /* --------------------------------- */

  /* ----------------schedule----------------- */
  /**
   * 指定日期的todo成功获取到
   * @param state
   * @param p
   * @param p.strCurrentDate
   * @param p.items
   * @constructor
   */
  SCH_TODO_READY (state, p) {
    state.schedule.strCurrentDate = p.strCurrentDate
    state.schedule.items = p.items
  },
  /**
   * 缓存todo
   * @param state
   * @param p
   * @param p.strCurrentDate
   * @param p.items
   * @constructor
   */
  SCH_TODO_CACHED (state, p) {
    state.dateTodosCache[p.strCurrentDate] = p.items
  },
  /**
   * 清除缓存
   * @param state
   * @param p
   * @param p.strCurrentDate
   * @constructor
   */
  SCH_TODO_CACHE_DELETE (state, p) {
    delete state.dateTodosCache[p.strCurrentDate]
  },
  /**
   * 新建todo
   * @param state
   * @param p
   * @param p.list
   * @param p.item
   * @constructor
   */
  SCH_TODO_CREATED (state, p) {
    if (p.list instanceof Array) {
      p.list.unshift(p.item)
    } else {
      state.schedule.items.unshift(p.item)
    }
  },
  /**
   * 勾选todo
   * @param state
   * @param p
   * @param p.item
   * @param p.status
   * @constructor
   */
  SCH_LIST_TODO_CHECKED (state, p) {
    p.item.pIsDone = p.status
  },
  /* --------------------------------- */

  /* ---------------todo收纳箱和日程页面的公共数据------------------ */
  /**
   * 设置当前的todo
   * @param state
   * @param p
   * @param p.item
   * @constructor
   */
  TD_CURRENT_TODO_SET (state, p) {
    state.todo.currentTodo = p.item
  },
  /**
   * 获取到todo的detail之后，需要将todo的详情设置到currentTodo上
   * @param state
   * @param p
   * @param p.todo
   * @constructor
   */
  TD_TODO_GET (state, p) {
    util.extendObject(state.todo.currentTodo, p.todo)
  },
  /**
   * 更新todo
   * @param state
   * @param p
   * @param p.todo
   * @constructor
   */
  TD_TODO_UPDATED (state, p) {
    let item = state.todo.currentTodo
    util.extendObject(item, p.todo)
  },
  /**
   * 删除todo
   * @param state
   * @param p
   * @param p.item
   * @constructor
   */
  TD_TODO_DELETED (state, p) {
    let items = p.item.pContainer === 'inbox' ? state.inbox.items : state.schedule.items
    let index = items.indexOf(p.item)
    if (index > -1) {
      items.splice(index, 1)
    }
  },
  /**
   * 缓存日程是否含有todo
   * @param state
   * @param p
   * @param p.daysHasTodo
   * @param p.startDate
   * @param p.endDate
   * @constructor
   */
  TD_DATE_HAS_TD_CACHE (state, p) {
    var daysHasTodo = p.daysHasTodo
    for (var d = p.startDate.getTime(); d <= p.endDate.getTime(); d += 24 * 3600 * 1000) {
      state.dayHasTodoCache[String(d)] = daysHasTodo.indexOf(d) !== -1
    }
  },
  /**
   * 清除日程是否含有todo
   * @param state
   * @param p
   * @param p.numDate
   * @constructor
   */
  TD_DATE_HAS_TD_CACHE_DELETE (state, p) {
    delete state.dayHasTodoCache[p.numDate]
  },
  /**
   * 新建评论
   * @param state
   * @param p
   * @constructor
   */
  TD_COMMENT_CREATED (state, p) {
    state.todo.currentTodo.comments.push(p.comment)
  },
  /**
   * 重置用于提醒的时间model
   * @param state
   * @param p
   * @param p.todo  p.todo存在，则说明是编辑任务时设置的提醒
   * @constructor
   */
  PUB_SET_TODO_TIME (state, p) {
    if (p && p.todo) {
      state.pub.currentTodoTime.isClose = !!p.isClose
      state.pub.currentTodoTime.todo = p.todo
    } else {
      state.pub.currentTodoTime.isClose = true
      state.pub.currentTodoTime.todo = null
    }
  }
  /* --------------------------------- */
}
