import { Promise } from 'es6-promise'
import api from 'api/index'
import util from 'ut/jsUtil'
import dateUtil from 'ut/dateUtil'
import bizUtil from 'ut/bizUtil'
import moment from 'moment'

export default {
  /**
   * 设置是否显示底部导航栏
   * @param commit
   * @param p
   * @param p.isShow
   */
  setNav ({commit}, p) {
    commit('SYS_NAV_SHOW', p)
  },
  /**
   * 登录方法
   * @param commit
   * @param p
   * @param p.username
   * @param p.password
   */
  login ({commit}, p) {
    return api.system.login(p)
      .then(user => {
        commit('SYS_USR_LOGIN', {user: user})
      })
      .catch((err) => {
        alert(JSON.stringify(err))
      })
  },
  /**
   * 登出方法
   * @param commit
   * @param state
   */
  logout ({commit}) {
    return api.system.logout()
      .then(() => {
        commit('SYS_USR_LOGOUT')
      })
      .catch((err) => {
        alert(JSON.stringify(err))
      })
  },

  // -----------------inbox actions start-------------------------
  /**
   * 获取inbox页面的所有items列表，并设置到相应state中
   * @param commit
   * @param state
   */
  fetchInboxItems ({commit, state}) {
    let items = state.inbox.items
    if (items == null) {
      return api.todo.getInboxTodos()
        .then(todos => {
          commit('INB_TODO_READY', {items: todos.reverse()})
          return state.inbox.items
        })
    } else {
      return Promise.resolve(items)
    }
  },
  /**
   * 创建收纳箱任务逻辑，检查state.inbox.items，如果不为null，则需要插入到state.inbox.items中
   * 典型场景：在日程页面创建了一条日期为空的任务，会自动放到收纳箱中
   * @param commit
   * @param state
   * @param dispatch
   * @param p
   * @param p.newItem
   * @param p.todoType
   */
  createInboxItem ({commit, state, dispatch}, p) {
    var inbox = state.inbox
    var newItem = p.newItem
    newItem['pContainer'] = 'inbox'
    var promise
    //  如果inbox.items不存在，则从服务器先获取到inbox，然后获取inbox中任务的顺序，然后再保存
    if (!inbox.items) {
      promise = dispatch('fetchInboxItems')
    } else {
      promise = Promise.resolve()
    }
    return promise.then(items => {
      newItem['pDisplayOrder'] = util.getNextOrder(items, 'pDisplayOrder')
      return api.todo.postNewTodo(newItem)
        .then(item => {
          commit('INB_TODO_CREATED', {item: item})
        })
    }).catch(err => {
      alert(JSON.stringify(err))
    })
  },
  // -----------------inbox actions end-------------------------

  // -----------------schedule actions start-------------------------
  /**
   * 根据date日期获取当天的日程，如果date为空，则获取今天的日程，流程如下：
   * 1  查找dateItems中是否有以date为key值的items，如果有，则直接读取
   * 2  如果dateItems中没有，则调用api从服务器上读取
   * @param commit
   * @param state
   * @param strDate
   */
  fetchScheduleItems ({commit, state}, {strDate, sync}) {
    if (strDate instanceof Date) {
      strDate = moment(strDate).format('YYYY-MM-DD')
    }
    let strCurrentDate = strDate || moment().format('YYYY-MM-DD')
    let dateItems = state.dateTodosCache
    if (!sync && dateItems[strCurrentDate]) {
      return Promise.resolve().then(() => {
        commit('SCH_TODO_READY', {strCurrentDate: strCurrentDate, items: dateItems[strCurrentDate]})
      })
    } else {
      return api.todo.getScheduleTodos({startDate: strCurrentDate, endDate: strCurrentDate})
        .then(todos => {
          let reverseTodo = todos.reverse()
          //  坑……不显示deletedDate字段为当前日期的日程，新版本需要优化
          var compareDate = moment(strDate).format('YYYYMMDD')
          reverseTodo = reverseTodo.filter(t => {
            return t.deletedDate !== compareDate
          })
          commit('SCH_TODO_READY', {strCurrentDate: strCurrentDate, items: reverseTodo})
          commit('SCH_TODO_CACHED', {strCurrentDate: strCurrentDate, items: reverseTodo})
        })
    }
  },
  /**
   * 提交新建的todo item
   * @param dispatch
   * @param p
   * @param p.newItem
   * @param p.todoType
   */
  submitCreateTodoItem ({dispatch}, p) {
    //  判断下是创建日程item还是收纳箱item
    if (p.todoType === 'schedule') {
      return dispatch('createScheduleItem', p)
    } else {
      return dispatch('createInboxItem', p)
    }
  },
  /**
   * 创建日程任务的处理逻辑：
   * 1 单日：
   * @param commit
   * @param state
   * @param dispatch
   * @param p
   * @param p.newItem
   * @param p.todoType
   */
  createScheduleItem ({commit, state, dispatch}, p) {
    //  暂时这么处理----日程任务默认为重要紧急，后面加上选择优先级功能之后再修改
    var newItem = p.newItem

    newItem['pContainer'] = 'IE'
    var dateStruct = dateUtil.backend2frontend(newItem)
    p['dateStruct'] = dateStruct
    switch (dateStruct.dateType) {
      case 'single':
        return dispatch('createSingleScheduleItem', p)
      case 'discrete':
        return dispatch('createDiscreteScheduleItem', p)
      case 'range':
        return dispatch('createRangeScheduleItem', p)
      case 'repeat':
        return dispatch('createRepeatItem', p)
      default:
        break
    }
  },
  createRepeatItem ({commit, state, dispatch}, {newItem, dateStruct}) {
    var arr = newItem.repeatBaseTime.split(',')
    var strDate = moment(arr[0], 'YYYYMMDD').format('YYYY-MM-DD')
    var itemCache = state.dateTodosCache
    //  读取顺序号
    return dispatch('fetchScheduleItems', { strDate })
      .then(() => {
        newItem['pDisplayOrder'] = util.getNextOrder(itemCache[strDate], 'pDisplayOrder')
        return api.todo.postNewTodo(newItem)
          .then(item => {
            //  TODO  让所有缓存都失效，暂时这么处理
            commit('TD_DATE_HAS_TD_CACHE_DELETE_ALL')
            commit('SCH_TODO_CACHE_DELETE_ALL')
            commit('SCH_TODO_CREATED', {item: item, list: itemCache[strDate]})
            return item
          })
      }).catch(err => {
        alert(JSON.stringify(err))
      })
  },
  /**
   * 单日逻辑：
   * 1  如果选择的日期中的任务列表存在于缓存中，那么从缓存中读取displayOrder
   * 2  如果未在缓存中，则先从服务器读取
   * 3  执行新增日程任务操作
   * @param commit
   * @param state
   * @param dispatch
   * @param newItem
   * @param dateStruct
   */
  createSingleScheduleItem ({commit, state, dispatch}, {newItem, dateStruct}) {
    var strDate = moment(dateStruct.dateResult[0]).format('YYYY-MM-DD')
    // console.log('strdate是' + strDate)
    var itemCache = state.dateTodosCache
    //  读取顺序号
    return dispatch('fetchScheduleItems', {strDate})
      .then(() => {
        newItem['pDisplayOrder'] = util.getNextOrder(itemCache[strDate], 'pDisplayOrder')
        // alert(JSON.stringify(newItem))
        return api.todo.postNewTodo(newItem)
          .then(item => {
            commit('SCH_TODO_CREATED', {item: item, list: itemCache[strDate]})
            return item
          })
      }).catch(err => {
        alert(JSON.stringify(err))
      })
  },
  createSubtodo ({commit, state, dispatch}, p) {
    var datas = {}
    datas.name = p.name
    datas.todoId = p.todoId
    datas.startDate = p.startDate
    datas.endDate = p.endDate
    datas.joinUsers = p.joinUsers ? p.joinUsers.toString() : ''
    datas.dates = p.dates
    return api.todo.postSubtodo(datas)
      .then(item => {
        commit('CHILDTASK_TODO_CREATED', {item: item})
        return item
      })
  },
  moveToPlan ({state}, p) {
    return api.todo.moveToPlan(p)
      .then(item => {
        return item
      })
      .catch(err => {
        alert(JSON.stringify(err))
      })
  },
  /**
   * 多日逻辑：
   * 暂时读取第一天的顺序，然后保存，然后让缓存失效
   * @param commit
   * @param state
   * @param dispatch
   * @param newItem
   * @param dateStruct
   */
  createDiscreteScheduleItem ({commit, state, dispatch}, {newItem, dateStruct}) {
    var strDate = moment(dateStruct.dateResult[0]).format('YYYY-MM-DD')
    var itemCache = state.dateTodosCache
    return dispatch('fetchScheduleItems', {strDate})
      .then(() => {
        newItem['pDisplayOrder'] = util.getNextOrder(itemCache[strDate], 'pDisplayOrder')
        return api.todo.postNewTodo(newItem)
          .then(item => {
            console.log('createDiscreteScheduleItem的item是' + item)
            //  清除缓存，强制从服务器获取数据
            dateStruct.dateResult.forEach(valDate => {
              commit('TD_DATE_HAS_TD_CACHE_DELETE', {numDate: valDate})
              return commit('SCH_TODO_CACHE_DELETE', {strCurrentDate: moment(valDate).format('YYYY-MM-DD')})
            })
            return item
          })
      }).catch(err => {
        alert(JSON.stringify(err))
      })
  },
  /**
   * 范围逻辑：
   * 暂时读取第一天的顺序，然后保存，然后让缓存失效
   * @param commit
   * @param state
   * @param dispatch
   * @param newItem
   * @param dateStruct
   * @returns {*}
   */
  createRangeScheduleItem ({commit, state, dispatch}, {newItem, dateStruct}) {
    var strDate = moment(dateStruct.dateResult[0]).format('YYYY-MM-DD')
    var itemCache = state.dateTodosCache

    return dispatch('fetchScheduleItems', {strDate})
      .then(() => {
        newItem['pDisplayOrder'] = util.getNextOrder(itemCache[strDate], 'pDisplayOrder')
        return api.todo.postNewTodo(newItem)
          .then(item => {
            var i = dateStruct.dateResult[0]
            //  清除缓存，强制从服务器获取数据
            for (; i <= dateStruct.dateResult[1]; i = i + 24 * 3600 * 1000) {
              commit('TD_DATE_HAS_TD_CACHE_DELETE', {numDate: i})
              commit('SCH_TODO_CACHE_DELETE', {strCurrentDate: moment(i).format('YYYY-MM-DD')})
            }
            console.log('createRangeScheduleItem的item是' + item)
            return item
          })
      }).catch(err => {
        alert(JSON.stringify(err))
      })
  },
  // -----------------schedule actions end-------------------------

  /* ----------------todo收纳箱和日程公共的数据------------------ */
  /**
   * 更新item参数的完成状态，如果item不存在，则更新当前选中的item的完成状态
   * @param commit
   * @param p
   * @param p.status
   * @param p.item
   */
  submitTodoFinish ({commit}, p) {
    return api.todo.putTodoProps({id: p.item.id, pIsDone: p.status})
      .then(() => {
        commit('SCH_LIST_TODO_CHECKED', {item: p.item, status: p.status})
      })
  },
  submitSubtodoFinish ({commit}, p) {
    // console.log('p,status是' + p.status)
    return api.todo.putSubtodoProps({id: p.item.id, isDone: p.status})
      .then((item) => {
        // console.log('和后台拿数据回来' + JSON.stringify(item))
        commit('SCH_LIST_SUBTODO_CHECKED', {item: p.item, status: p.status})
      })
  },
  /**
   * 设置inbox页面当前处于选中状态的item，该item将会被显示在edit子页面中
   * 不采用promise的方式返回值
   * @param commit
   * @param item
   */
  setCurrentTodo ({commit}, item) {
    commit('TD_CURRENT_TODO_SET', {item: item})
    //  鉴于重复功能的需要，如果item是重复的日程，这里需要暂存重复的原始值
    commit('TD_CURRENT_TODO_REPEAT_SET', {item})
  },
  updateCurrentTodo ({ commit }, item) {
    commit('TD_CURRENT_TODO_UPDATE', {item})
  },
  /**
   * 设置子任务编辑时，当前正在编辑的子任务
   * @param commit
   * @param item
   */
  setCurrentSubtodo ({commit}, item) {
    commit('TD_CURRENT_SUBTODO_SET', {item: item})
  },
  updateCurrentSubtodo ({commit}, item) {
    commit('TD_CURRENT_SUBTODO_UPDATE', {item: item})
  },
  /**
   * 首先检查schedule的items中是否已经获取到todo的详细信息，如果没有获取过，则请求服务器获取
   * 当获取到item的详细信息时，item会添加cDetail标记，表示已经获取过，下次将不会再获取细节信息
   * @param commit
   * @param state
   * @param p
   * @param p.todo
   */
  getTodo ({ commit, state, getters }, p) {
    let todo = p ? p.todo : state.todo.currentTodo
    var params = {
      id: todo.id,
      createTaskDate: getters.defaultTaskDate
    }
    if (!todo.cDetail) {
      return api.todo.getTodo(params)
        .then(result => {
          result.cDetail = true
          commit('TD_TODO_GET', {todo: result})
          //  如果currentTodo不存在，那么设置currentTodo为getTodo得到的item
          if (!state.todo.currentTodo.id) {
            commit('TD_CURRENT_TODO_SET', {item: result})
          }
          return result
        })
    } else {
      var newTodo = {}
      util.extendObject(newTodo, todo)
      return Promise.resolve(newTodo)
    }
  },
  /**
   * 提交当前选中的item的日期属性数据到服务器，以进行更改。
   * 更改了日期之后为避免显示脏数据，需要对缓存数据做一定处理。
   * 当前队列：用户当前所处的队列，如果是日程，则当天的任务数组就是当前队列；如果是收纳箱，则收纳箱任务数组就是当前队列
   * 当前队列群：用户的重复任务所在的队列群。例如当前任务设置了1、4、5日，则1、4、5日各自的任务数组组成目标队列群。当当前日期为null时，收纳箱任务数组组成的集合就是当前队列群
   * 目标队列群：设置了新的日期之后，任务所在的所有队列组成的集合。例如，如果设置了日期为1、4、5日，则1、4、5日各自的任务数组组成目标队列群。当设置为null时，收纳箱任务数组组成的集合就是目标队列群
   *
   * 规则：
   * 目标队列群中包含当前队列，则将目标队列群中除了当前队列的队列都做失效处理
   * 目标队列群中不包含当前队列，则在当前队列中移除todo，则将目标队列群中除了当前队列的队列都做失效处理
   * @param commit
   * @param state
   * @param dispatch
   * @param p
   * @param p.todo
   * @param p.editItem
   * @returns {*}
   */
  updateTodoDate ({commit, state, dispatch, getters}, p) {
    var todo = p.todo || state.todo.currentTodo
    var editItem = p.editItem
    editItem.createTaskDate = todo.createTaskDate || getters.defaultTaskDate

    var promise
    if (todo.id) {
      //  如果id存在，则ajax更新
      editItem['id'] = todo.id
      promise = api.todo.putTodoProps(editItem)
        .then(resTodo => {
          //  处理缓存数据
          var sourceDateStruct = dateUtil.backend2frontend(todo)
          var targetDateStruct = dateUtil.backend2frontend(editItem)
          var curArrayIndex = todo.pContainer === 'inbox'
            ? 0
            : moment(state.schedule.strCurrentDate, 'YYYY-MM-DD').toDate().getTime()
          if (!dateUtil.isInDateStruct(curArrayIndex, targetDateStruct)) {
            commit('TD_TODO_DELETED', {item: todo})
          }
          dispatch('invalidateDateItems', {dateStruct: targetDateStruct, exceptDateNum: curArrayIndex})
          dispatch('invalidateDateItems', {dateStruct: sourceDateStruct, exceptDateNum: curArrayIndex})
          commit('TD_TODO_UPDATED', {todo: resTodo})
        })
    } else {
      promise = Promise.resolve().then(() => {
        commit('TD_TODO_UPDATED', {todo: editItem})
      })
    }
    return promise
  },
  /**
   * 使dateStruct所标记的所有日期的缓存失效，其中排除exceptStrVal所表示的日期。
   * 其中dateStruct的dateType为null，表示收纳箱
   * dateStruct.dateType为null且exceptDateNum不为0，则清空收纳箱缓存
   * dateStruct.dateType为single或discrete，则循环dateStruct.dateResult，当dateResult元素不等于exceptDateNum时，清空相应日期的缓存，
   * dateStruct.dateType为range，则分别以dateStruct.dateResult[0]和dateStruct.dateResult[1]为起止日期，循环dateStruct.dateResult，当dateResult元素不等于exceptDateNum时，清空相应日期的缓存，
   * @param commit
   * @param state
   * @param dateStruct
   * @param exceptDateNum
   */
  invalidateDateItems ({commit, state}, {dateStruct, exceptDateNum}) {
    if (dateStruct.dateType == null && exceptDateNum !== 0) {
      state.inbox.items = null
      return
    }
    switch (dateStruct.dateType) {
      case 'single':
      case 'discrete':
        dateStruct.dateResult.forEach(timeNum => {
          if (timeNum !== exceptDateNum) {
            commit('SCH_TODO_CACHE_DELETE', {strCurrentDate: dateUtil.dateNum2Text(timeNum, '-')})
            commit('TD_DATE_HAS_TD_CACHE_DELETE', {numDate: String(timeNum)})
          }
        })
        break
      case 'range':
        var i = dateStruct.dateResult[0]
        for (; i <= dateStruct.dateResult[1]; i = i + 24 * 3600 * 1000) {
          commit('SCH_TODO_CACHE_DELETE', {strCurrentDate: dateUtil.dateNum2Text(i, '-')})
          commit('TD_DATE_HAS_TD_CACHE_DELETE', {numDate: String(i)})
        }
        break
      case 'repeat':
        //  如果更新的是重复，暂时让所有的缓存失效
        commit('TD_DATE_HAS_TD_CACHE_DELETE_ALL')
        commit('SCH_TODO_CACHE_DELETE_ALL')
        break
      default:
        break
    }
  },
  /**
   * 提交当前选中的item的属性数据到服务器，以进行更改,更改标题更改执行人更改完成状态都可以共用一个方法
   * 如果更改的是日期，由于涉及到日程的移动，不能使用这个方法，而应当使用updateTodoDate
   * @param commit
   * @param state
   * @param p
   * @param p.todo
   * @param p.editItem
   * @returns {Function|any|*|Promise.<TResult>|Promise}
   */
  updateTodo ({commit, state}, p) {
    //  p.todo不存在，则默认读取currentTodo
    var todo = p.todo || state.todo.currentTodo
    // var items = p.items
    //  如果id存在，则ajax更新
    var editItem = p.editItem
    editItem['id'] = todo.id
    return api.todo.putTodoProps(editItem)
      .then(todo => {
        commit('TD_TODO_UPDATED', {todo: todo})
        return todo
      })
  },
  //  判断是否需要用户选择“仅修改当前日程”、“修改当前以及以后日程”、“修改所有重复日程”
  updateRepeatTodo ({commit, state, getters}, p) {
    var repeat = state.todo.currentTodoRepeat
    util.extendObject(repeat, p)
    repeat.createTaskDate = getters.defaultTaskDate
    //  如果id存在，则ajax更新
    return api.todo.putTodoProps(repeat)
      .then(todo => {
        // commit('TD_TODO_UPDATED', {todo: todo})
        //  TODO  让所有缓存都失效，暂时这么处理
        commit('TD_DATE_HAS_TD_CACHE_DELETE_ALL')
        commit('SCH_TODO_CACHE_DELETE_ALL')
        return todo
      })
  },
  saveTodoAction ({commit, state}, p) {
    const todo = p.todo || state.todo.currentTodo
    const editItem = p.editItem
    const realName = state.loginUser.rsqUser.realName
    editItem['todoId'] = todo.id
    if (editItem.type === 9) {
      editItem['comment'] = realName + ' 更新了标题'
    } else if (editItem.type === 5 && editItem.status) {
      editItem['comment'] = realName + ' 完成了任务'
    } else if (editItem.type === 5 && !editItem.status) {
      editItem['comment'] = realName + ' 重启了任务'
    } else if (editItem.type === 7) {
      editItem['comment'] = realName + ' 创建了子任务'
    } else if (editItem.type === 17 && editItem.status) {
      console.log('子任务的操作进来了吗')
      editItem['comment'] = realName + ' 完成了子任务' + '"' + p.name + '"'
    } else if (editItem.type === 17 && !editItem.status) {
      console.log('子任务的操作进来了吗')
      editItem['comment'] = realName + ' 重启了子任务' + '"' + p.name + '"'
    } else if (editItem.type === 10) {
      editItem['comment'] = realName + ' 更新了子任务内容为' + '"' + editItem.idOrContent + '"'
    }
    return api.todo.putRecordProps(editItem)
      .then(record => {
        console.log('putRecordProps回来了吗')
        commit('TD_COMMENT_CREATED', {comment: record})
      })
  },
  updateSubtodo ({commit, state}, p) {
    //  p.todo不存在，则默认读取currentTod
    var item = p.item
    var temp = {}
    temp.name = p.name
    temp.id = p.id
    temp.joinUsers = p.joinUsers
    temp.endDate = p.endDate
    temp.startDate = p.startDate
    temp.isDone = p.isDone
    temp.dates = p.dates
    return api.todo.putSubtodoProps(temp)
      .then(subtodo => {
        commit('TD_SUBTODO_UPDATED', {subtodo: subtodo, item: item})
      })
  },
  /**
   * 更新todoTime，如果currentTodo.id存在，说明是更新todo，直接发送请求更新；
   * 如果id不存在，说明是新建任务，保存到currentTodo中，跟新建任务的其他属性一同提交
   * @param commit
   * @param state
   * @param dispatch
   * @param p
   * @returns {*}
   */
  updateTodoTime ({ commit, state, getters, dispatch }, p) {
    p = p || {}
    var todo = state.todo.currentTodo
    var promise
    //  如果this.currentTodo.id存在，则更新currentTodo
    if (todo.id) {
      var taskDate = todo.createTaskDate || getters.defaultTaskDate
      promise = dispatch('updateTodo', {
        editItem: {
          createTaskDate: taskDate,
          clock: p.clock
        }
      })
    } else {
      if (p.clock.alwaysAlert === undefined) {
        p.clock.alwaysAlert = true
      }
      promise = Promise.resolve().then(() => {
        commit('TD_CURRENT_TODO_UPDATE', {item: p})
        return todo
      })
    }
    return promise
  },
  /**
   * 删除当前选中状态的item，删除后如果选择的日期不是单日，则还需要清理缓存数据，逻辑如下：
   * 1  将其他日期的缓存数据清除
   * @param commit
   * @param state
   * @param dispatch
   * @param p
   * @param p.todo
   * @returns {*|Promise|Function|any|Promise.<TResult>}
   */
  deleteTodo ({commit, state, dispatch, getters}, p) {
    var todo = p.todo || state.todo.currentTodo
    var promise
    if (p.isRepeat) {
      var params = {id: todo.id, createTaskDate: getters.defaultTaskDate, type: p.type}
      promise = api.todo.deleteRepeatTodo(params)
    } else {
      promise = api.todo.deleteTodo(todo)
    }
    return promise.then(() => {
      //  清除缓存数据
      var sourceDateStruct = dateUtil.backend2frontend(todo)
      var curArrayIndex = todo.pContainer === 'inbox' ? 0 : moment(state.schedule.strCurrentDate, 'YYYY-MM-DD').toDate().getTime()
      dispatch('invalidateDateItems', {dateStruct: sourceDateStruct, exceptDateNum: curArrayIndex})
      commit('TD_TODO_DELETED', {item: todo})
    })
  },
  deleteCommentItem ({commit, state, dispatch}, p) {
    var item = p.item
    return api.todo.deleteCommentItem(item)
      .then(() => {
        commit('TD_COMMENT_DELETE', {item: item})
      })
  },
  deleteSubtodo ({commit, state, dispatch}, p) {
    // var todo = p.todo || state.todo.currentTodo留待以后查看
    var item = p.item
    return api.todo.deleteSubtodo(item)
      .then(() => {
        commit('TD_SUBTODO_DELETE', {item: item})
      })
  },
  /**
   * 获取是否当天有日程
   * @param commit
   * @param state
   * @param p
   */
  getDatesHasTodo ({commit, state}, p) {
    var start = p.startDate.getTime()
    var end = p.endDate.getTime()
    //  如果start和end中有一天没有缓存，那么就强制从服务器读取缓存
    var promise = api.todo.getDatesHasTodo({
        startDate: dateUtil.dateNum2Text(start, '-'),
        endDate: dateUtil.dateNum2Text(end, '-')
      })
      .then(result => {
        p.daysHasTodo = result.date.split(',').map(text => {
          return moment(text).valueOf()
        })
        commit('TD_DATE_HAS_TD_CACHE', p)
      })
    return promise.then(() => {
      var cache = state.dayHasTodoCache
      var resultArray = []
      for (var d = start; d <= end; d += 24 * 3600 * 1000) {
        var strDate = String(d)
        if (cache[strDate]) {
          resultArray.push(strDate)
        }
      }
      return resultArray
    })
  },
  /* ---------------------------------- */

  fetchStaffList ({commit, state}) {
    if (state.staff.list == null) {
      return api.system.fetchStaffList()
        .then(list => {
          commit('SYS_STF_LST_READY', {list: list})
        })
    } else {
      return Promise.resolve()
    }
  },
  getAllUsers ({commit, state}) {
    if (state.realStaff.list == null) {
      return api.todo.getAllUsers()
        .then(list => {
          commit('SYS_STF__REAL_LST_READY', {list: list})
        })
    } else {
      return Promise.resolve()
    }
  },
  /**
   * 根据传入的openid获取相应的rsqid，首先从缓存中读取，如果缓存中不存在，则从服务器读取
   * @param commit
   * @param state
   * @param p
   * @param p.idArray
   * @param p.corpId
   */
  fetchRsqidFromUserid ({commit, state}, p) {
    // alert('近来了')
    var openidsNotInCache = []
    var result = {}
    var cache = state.openidCache
    var promise
    p.idArray.forEach(userId => {
      if (cache[userId]) {
        result[userId] = cache[userId]
      } else {
        openidsNotInCache.push(userId)
      }
    })
    if (openidsNotInCache.length > 0) {
      promise = api.appAuth.getOpenidMap({corpId: p.corpId, idArray: openidsNotInCache})
        .then(resp => {
          // alert('返回来' + JSON.stringify(resp))
          var mapList = resp.result
          mapList.forEach(idMap => {
            //  双向缓存
            var key = idMap['userId']
            result[key] = idMap
            commit('SYS_OPENID_CACHED', {key: key, value: idMap})
            commit('SYS_RSQID_CACHED', {key: idMap['rsqUserId'], value: idMap})
          })
        })
    } else {
      promise = Promise.resolve()
    }
    return promise.then(() => {
      return result
    })
  },
  /**
   * 根据传入的rsqid获取相应的openid，首先从缓存中读取，如果缓存中不存在，则从服务器读取
   * @param commit
   * @param state
   * @param p
   * @param p.idArray
   * @param p.corpId
   */
  fetchUseridFromRsqid ({commit, state}, p) {
    var idsNotInCache = []
    var result = {}
    var cache = state.rsqidCache
    var promise
    p.idArray.forEach(openid => {
      if (cache[openid]) {
        result[openid] = cache[openid]
      } else {
        idsNotInCache.push(openid)
      }
    })
    if (idsNotInCache.length > 0) {
      promise = api.appAuth.getRsqidMap({corpId: p.corpId, idArray: idsNotInCache})
        .then(resp => {
          var mapList = resp.result
          // alert('mapList' + JSON.stringify(mapList))
          mapList.forEach(idMap => {
            //  双向缓存
            var key = idMap['rsqUserId']
            result[key] = idMap
            commit('SYS_OPENID_CACHED', {key: key, value: idMap})
            commit('SYS_RSQID_CACHED', {key: idMap['userId'], value: idMap})
          })
        })
    } else {
      promise = Promise.resolve()
    }
    return promise.then(() => {
      return result
    })
  },
  postTodoComment ({commit, state}, props) {
    var currentItem = state.todo.currentTodo
    var replyId = state.replyId
    var replyName = state.replyName
    props['todoId'] = currentItem.id
    props['type'] = 0
    if (replyId !== null) {
      props['atIds'] = replyId
      props.commentContent = '@' + replyName + '&' + props.commentContent
    }

    return api.todo.postComment(props)
      .then((com) => {
        com.type = 0
        commit('TD_COMMENT_CREATED', {comment: com})
        return com
      })
    // } else {
    //   return Promise.resolve()
    // }
  },
  replyCommentItem ({commit, state}, props) {
    commit('REPLY_COMMENT_CREATED', {item: props.item})
  },
  postNote ({commit, state}, props) {
    if (props.pNote) {
      var currentItem = state.todo.currentTodo
      props['id'] = currentItem.id
      return api.todo.postNote(props)
        .then((note) => {
          commit('TD_NOTE_CREATED', {note: note})
        })
    } else {
      return Promise.resolve()
    }
  },
  toRsqServer ({commit, state}, p) {
    var p1 = p
    p1['fileName'] = p.name.substr(28)
    p1['filePath'] = p.name
    return api.todo.getFileFromAli(p1)
      .then((file) => {
        return file
      })
  },
  /**
   * 上传文件到阿里云OSS
   * @param commit
   * @param state
   * @param p
   * @returns {Promise<any>|Promise.<*>|Promise<TAll[]>}
   */
  uploadToOSS ({commit, state}, p) {
    //  使用pathId做权限，用户只能操作特定pathId下的文件
    var pathId = p.pathId
    var time = moment().format('YYYYMMDDHHmmss')
    var path = window.rsqConfig.ossRoot + pathId + '/' + time
    var list = p.list
    return api.system.getOSSClient({pathId: pathId})
      .then(client => {
        return Promise.all(list.map(t => {
          var f = t.file
          var name = path + f.name
          return client.multipartUpload(name, f, {
            progress: function (p) {
              return function (done) {
                var pro = Math.floor(p * 100)
                t.progress = pro
                if (pro >= 1) {
                  t.finished = true
                }
                done()
              }
            }
          })
        }))
      })
  },
  /**
   * 取消上传
   * @param commit
   * @param state
   * @param p
   * @returns {*}
   */
  cancelUploadToOSS ({commit, state}, p) {
    var pathId = p.pathId
    return api.system.getOSSClient({pathId: pathId})
      .then(client => {
        client.listUploads({query: 'dddd'})
          .then(res => {
            alert(JSON.stringify(res))
          })
      })
  },
  /**
   * 上传计划的封面图片
   * @param commit
   * @param state
   * @param p.pathId：corpId，用来获取权限
   * @param p.task：上传任务，其中需要包含file、progress和finished字段。
   * @param p.savedName：保存到OSS之后的文件名，使用时间戳命名
   */
  uploadKanbanCoverImage ({commit, state}, p) {
    const pathId = p.pathId
    const path = window.rsqConfig.ossKanbanCoverImagePath
    const task = p.task
    const f = task.file
    return api.system.getOSSClient({pathId: pathId}, {
      stsServer: window.rsqConfig.stsServer + 'cover/custom/kanban/',
      ossBucket: window.rsqConfig.ossImageBucket
    })
      .then(client => {
        const name = path + p.savedName
        return client.multipartUpload(name, f, {
          progress: function (p) {
            return function (done) {
              const pro = Math.floor(p * 100)
              task.progress = pro
              if (pro >= 1) {
                task.finished = true
              }
              done()
            }
          }
        })
      })
  },
  //  dingtalk/130350304726297460/2126PictureUnlock_haokan1171162_16:9.pictureunlock.jpg
  getOSSUrl ({commit, state}, p) {},
  /**
   * 发送到聊天
   * @param commit
   * @param state
   * @param p
   * @returns {*}
   */
  sendToConversation ({commit, state}, p) {
    var appId = state.sys.appId
    var urlParams = {
      corpid: p.corpId,
      appid: appId
    }
    return api.appAuth.sendToConversation({
      urlParams,
      data: p.data
    })
  },
  sendAsyncCorpMessage ({commit, state}, p) {
    var appId = state.sys.appId
    var urlParams = {
      corpid: p.corpId,
      appid: appId
    }
    return api.appAuth.sendAsyncCorpMessage({
      urlParams,
      data: p.data
    })
  },
  handleRemind ({commit, state, dispatch}, p) {
    var item = p.item
    var promise

    //  不管是新增还是编辑，这里的item始终是有id的
    if (item.id) {
      var c = item.clock || {}
      var alert = c.alert || []
      var url = window.location.href.split('#')
      var millsArray = alert.map(a => {
        const numStart = moment(c.taskDate + c.startTime, 'YYYYMMDDHH:mm').valueOf()
        const numEnd = moment(c.taskDate + c.endTime, 'YYYYMMDDHH:mm').valueOf()
        return util.alertRule2Time(a.schedule, numStart, numEnd)
      })
      var remindArray = alert.map(a => {
        return util.alertCode2RemindText(a.schedule) + '，请点击查看详情'
      })
      let data = {
        todo_id: item.id,
        mills_array: millsArray,
        remind_array: remindArray,
        userid_list: state.loginUser.authUser.userId,
        msgtype: 'textcard',
        msgcontent: {
          url: url[0] + '#' + '/sche/todo/' + item.id,
          title: item.pTitle,
          description: '日程提醒'
        }
      }
      promise = dispatch('sendRemind', {corpId: state.loginUser.authUser.corpId, data: data})
    } else {
      promise = Promise.resolve()
    }

    return promise.then(() => {
      return item
    })
  },
  sendRemind ({commit, state}, p) {
    // var appId = state.sys.appId
    var urlParams = {
      corpid: p.corpId
      // appid: appId
    }
    return api.appAuth.sendRemind({
      urlParams,
      data: p.data
    })
  },
  getRecord ({commit, state}, p) {
    return api.todo.getRecord(p)
      .then((item) => {
        // console.log('移动计划之后item' + JSON.stringify(item))
        commit('SAVE_RECORD', {item: item})
        return item
      })
  },
  fetchUsers ({commit, state}, p) {
    return api.todo.fetchUsers(p)
      .then((item) => {
        console.log('返回来的是' + JSON.stringify(item))
        commit('SAVE_USER', {item: item})
        return item
      })
  },
  sendMessage ({commit, state}, p) {
    return api.todo.sendMessage(p)
      .then((result) => {
        return result
      })
  },
  postPlan ({commit, state}, p) {
    return api.todo.postPlan(p)
      .then((result) => {
        return result
      })
  },
  getPlan ({commit, state}, p) {
    return api.todo.getPlan(p)
      .then((result) => {
        return result
      })
  },
  getChildKanbanList ({commit, state}, p) {
    return api.todo.getChildKanbanList(p)
      .then((result) => {
        return result
      })
  },
  getCardList ({commit, state}, p) {
    return api.todo.getCardList(p)
      .then((result) => {
        return result
      })
  },
  postSubPlan ({commit, state}, p) {
    return api.todo.postSubPlan(p)
      .then((result) => {
        return result
      })
  },
  postCard ({commit, state}, p) {
    return api.todo.postCard(p)
      .then((result) => {
        return result
      })
  },
  deleteChildPlan ({commit, state}, p) {
    return api.todo.deleteChildPlan(p)
      .then((res) => {
        commit('DELETE_CHILD_PLAN', p)
      })
  },
  updateName ({commit, state}, p) {
    return api.todo.updateName(p)
      .then((res) => {
        return res
      })
  },
  updataPlan ({commit, state}, p) {
    return api.todo.updataPlan(p)
      .then((res) => {
        return res
      })
  },
  cancelStar ({commit, state}, p) {
    return api.todo.cancelStar(p)
      .then((res) => {
        commit('CANCEL_STAR', p)
      })
  },
  saveStar  ({commit, state}, p) {
    return api.todo.saveStar(p)
      .then((res) => {
        commit('SAVE_STAR', p)
      })
  },
  deletePlan  ({commit, state}, p) {
    return api.todo.deletePlan(p)
      .then((res) => {
        commit('DELETE_PLAN', p)
      })
  },
  quitPlan ({commit, state}, p) {
    return api.todo.quitPlan(p)
      .then((res) => {
        commit('DELETE_PLAN', p) // 暂使用delete
      })
  },
  finishCardItem ({commit, state}, p) {
    return api.todo.finishCardItem(p)
      .then((res) => {
        // commit('QUIT_PLAN', p) // 这里用不用该前端的参与人呢？
      })
  },
  updateCardName ({commit, state}, p) {
    return api.todo.updateCardName(p)
      .then((res) => {
        return res
      })
  },
  deleteCard  ({commit, state}, p) {
    return api.todo.deleteCard(p)
      .then((res) => {
        commit('DELETE_CARD', p)
      })
  },
  updatePlanName ({commit, state}, p) {
    return api.todo.updatePlanName(p)
      .then((res) => {
        commit('PLAN_NAME_UPDATE', p)
      })
  },
  planToPlan ({state}, p) {
    return api.todo.planToPlan(p)
      .then(item => {
        return item
      })
      .catch(err => {
        // alert(JSON.stringify(err))
      })
  },
  updatePlanImg ({commit, state}, p) {
    return api.todo.updatePlanName(p)
      .then((res) => {
        commit('PLAN_IMG_UPDATE', p)
      })
  },
  getLabels ({commit, state}, p) {
    return api.todo.getLabels(p)
      .then((result) => {
        // commit('SAVE_LABELS', result)
        return result
      })
  },
  updatePlanMember ({commit, state}, p) {
    return api.todo.updatePlanMember(p)
      .then((result) => {
        // commit('SAVE_LABELS', result)
        return result
      })
  },
  getTemplate ({commit, state}, p) {
    return api.todo.getTemplate()
      .then((result) => {
        //  目前在企业微信中只使用四个模板，因此这里将这四个模板取出来
        commit('PLAN_COVER_LIST_SET', {coverList: bizUtil.extractTemplate(result)})
        return result
      })
  },
  createKanbanItem ({commit, state}, p) {
    return api.todo.submitKanbanItem(p)
      .then((res) => {
        return res
      })
  },
  deleteKanbanItem ({commit, state}, p) {
    return api.todo.deleteKanbanItem(p)
      .then((res) => {
        // commit('DELETE_CARD', p)
      })
  },
  updateKanbanItem  ({commit, state}, p) {
    return api.todo.updateKanbanItem(p)
      .then((res) => {
        commit('PLAN_CURRENT_KANBAN_ITEM_UPDATE', {kanbanItem: res})
        // commit('DELETE_CARD', p)
      })
  },
  getKanbanItem ({commit, state}, p) {
    return api.todo.getKanbanItem(p)
      .then((res) => {
        commit('PLAN_CURRENT_KANBAN_ITEM_UPDATE', {kanbanItem: res})
        //  筛选出操作记录，保存在独立的缓存里
        let arr = res.commentList
        if (arr) {
          arr = arr.filter(i => {
            return i.type !== 0
          })
        }
        commit('SAVE_RECORD', {item: arr})
        return res
      })
  },
  createKanbanSubtodo ({commit, state}, p) {
    var datas = {}
    datas.name = p.name
    datas.kanbanItemId = p.id
    datas.startDate = p.startDate
    datas.endDate = p.endDate
    datas.joinUser = p.joinUsers ? p.joinUsers.toString() : ''
    datas.dates = p.dates
    return api.todo.createKanbanSubtodo(datas)
      .then((result) => {
        commit('PLAN_CURRENT_KANBAN_SUBITEM_CREATED', {item: result})
        return result
      })
  },
  updateKanbanSubtodo ({commit, state}, p) {
    return api.todo.putKanbanSubtodo(p)
      .then((res) => {
        commit('PLAN_KANBAN_SUBITEM_UPDATE', {item: res})
        // commit('DELETE_CARD', p)
      })
  },
  deleteKanbanSubtodo ({commit, state}, p) {
    return api.todo.deleteKanbanSubtodo(p)
      .then((res) => {
        commit('PLAN_KANBAN_SUBITEM_DELETE', {item: res})
      })
  },
  setCurrentKanbanItem ({commit}, item) {
    commit('PLAN_CURRENT_KANBAN_ITEM_SET', {item: item})
  },
  createKanbanItemComment ({commit, state}, props) {
    // if (props.commentContent) {
    const currentItem = state.plan.currentKanbanItem
    const replyId = state.replyId
    const replyName = state.replyName
    props['kanbanItemId'] = currentItem.id
    props['type'] = 0
    if (replyId !== null) {
      props['atIds'] = replyId
      props.commentContent = '@' + replyName + '&' + props.commentContent
    }

    return api.todo.postKanbanItemComment(props)
      .then((com) => {
        com.type = 0
        commit('PLAN_KANBAN_ITEM_COMMENT_CREATED', {comment: com})
        return com
      })
  },
  deleteKanbanItemComment ({commit, state, dispatch}, p) {
    var item = p.item
    return api.todo.deleteKanbanItemComment(item)
      .then(() => {
        commit('PLAN_KANBAN_ITEM_COMMENT_DELETE', {item: item})
      })
  },
  replyKanbanItemComment ({commit, state}, props) {
    commit('REPLY_KANBAN_ITEM_COMMENT_CREATED', {item: props.item})
  },
  /**
   * 企业微信消息发送
   * @param  {[type]} options.state    [description]
   * @param  {[type]} options.dispatch [description]
   * @param  {[type]} p                [description]
   * @return {[type]}                  [description]
   */
  qywxSendMessage ({getters, state, dispatch}, p) {
    var data = {
      'msgtype': 'textcard',
      'agentid': p.agentid,
      'textcard': {
        'title': p.title,
        'description': p.description,
        'url': p.url
      }
    }
    console.log(p)
    var IDArrays = []
    if (p.receiverIds) {
      IDArrays = p.receiverIds.split(',')
    }
    var empIDArray = []
    dispatch('fetchUseridFromRsqid', {corpId: p.corpId, idArray: IDArrays})
      .then(idMap => {
        for (var i = 0; i < IDArrays.length; i++) {
          if (idMap[IDArrays[i]].userId === getters.loginUser.authUser.userId) {
            continue
          }
          empIDArray.push(idMap[IDArrays[i]].userId)
        }
        data['touser'] = empIDArray.toString().split(',').join('|')
        dispatch('sendAsyncCorpMessage', {
          corpId: p.corpId,
          data: data
        }).then(res => {
          if (res.errcode !== 0) {
          } else {
            console.log('发送成功！')
          }
        })
      })
  }
}
