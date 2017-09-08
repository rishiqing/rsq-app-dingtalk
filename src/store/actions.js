import { Promise } from 'es6-promise'
import api from 'api/index'
import util from 'ut/jsUtil'
import dateUtil from 'ut/dateUtil'
import moment from 'moment'

export default {
  /**
   * 设置是否显示底部导航栏
   * @param commit
   * @param isShow
   */
  setNav ({ commit }, isShow) {
    commit('SYS_NAV_SHOW', {isShow: isShow})
  },
  /**
   * 登录方法
   * @param commit
   * @param state
   * @param username
   * @param password
   */
  login ({ commit }, p) {
    return api.system.login(p)
      .then((user) => {
        commit('SYS_USR_LOGIN', {user: user})
      }, (err) => {
        window.rsqadmg.log(JSON.stringify(err))
      })
  },
/**
 * 登出方法
 * @param commit
 * @param state
 */
  logout ({ commit }) {
    return api.system.logout()
      .then((result) => {
        window.rsqadmg.log('logout res:' + JSON.stringify(result))
        commit('SYS_USR_LOGOUT')
      })
      .catch((err) => {
        window.rsqadmg.log(JSON.stringify(err))
      })
  },

  // -----------------inbox actions start-------------------------
  /**
   * 获取inbox页面的所有items列表，并设置到相应state中
   * @param commit
   * @param state
   */
  fetchInboxItems ({ commit, state }) {
    let items = state.inbox.items
    if (items == null) {
      return api.todo.getInboxTodos()
        .then((todos) => {
          commit('INB_TODO_READY', {items: todos.reverse()})
        })
    } else {
      return Promise.resolve().then(() => {
        commit('INB_TODO_READY', {items: items})
      })
    }
  },
  /**
   * 创建收纳箱任务逻辑，检查state.inbox.items，如果不为null，则需要插入到state.inbox.items中
   * 典型场景：在日程页面创建了一条日期为空的任务，会自动放到收纳箱中
   * @param commit
   * @param state
   * @param p
   * @param p.newItem
   * @param p.todoType
   */
  createInboxItem ({commit, state, dispatch}, props) {
    var inbox = state.inbox
    var mu = 'INB_TODO_CREATED'
    var params = props.props
    params['pContainer'] = 'inbox'
    var promise
    //  如果inbox.items不存在，则从服务器先获取到inbox，然后获取inbox中任务的顺序，然后再保存
    if (!inbox.items) {
      promise = dispatch('fetchInboxItems', { commit, state })
    } else {
      promise = Promise.resolve()
    }
    return promise.then(() => {
      params['pDisplayOrder'] = util.getNextOrder(inbox.items, 'pDisplayOrder')
      return api.todo.postNewTodo(params)
        .then((item) => {
          commit(mu, {item: item})
        })
    }).catch(err => {
      alert('error:' + JSON.stringify(err))
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
   * @param date
   */
  fetchScheduleItems ({ commit, state }, strDate) {
    if (strDate instanceof Date) {
      strDate = moment(strDate).format('YYYY-MM-DD')
    }
    let strCurrentDate = strDate || moment().format('YYYY-MM-DD')
    let dateItems = state.schedule.dateItems
    if (dateItems[strCurrentDate]) {
      return Promise.resolve().then(() => {
        commit('SCH_TODO_READY', {strCurrentDate: strCurrentDate, items: dateItems[strCurrentDate]})
      })
    } else {
      return api.todo.getScheduleTodos({startDate: strCurrentDate, endDate: strCurrentDate})
        .then((todos) => {
          let reverseTodo = todos.reverse()
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
   * @returns {*|Promise|Function|any|Promise.<TResult>}
   */
  submitCreateTodoItem ({ dispatch }, p) {
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
   * @returns {*}
   */
  createScheduleItem ({ commit, state, dispatch }, p) {
    //  暂时这么处理----日程任务默认为重要紧急，后面加上选择优先级功能之后再修改
    var newItem = p.newItem
    newItem['pContainer'] = 'IE'

    var dateStruct = dateUtil.backend2frontend(newItem.dates, newItem.startDate, newItem.endDate)
    p['dateStruct'] = dateStruct
    switch (dateStruct.dateType) {
      case 'single':
        return dispatch('createSingleScheduleItem', p)
      case 'discrete':
        return dispatch('createDiscreteScheduleItem', p)
      case 'range':
        return dispatch('createRangeScheduleItem', p)
      default:
        break
    }
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
    var sche = state.schedule
    var scheDateStr = moment(dateStruct.dateResult[0]).format('YYYY-MM-DD')
    var itemCache = sche.dateItems

    //  读取顺序号
    return dispatch('fetchScheduleItems', scheDateStr)
      .then(() => {
        newItem['pDisplayOrder'] = util.getNextOrder(itemCache[scheDateStr], 'pDisplayOrder')
        console.log('-----displayOrder----' + newItem['pDisplayOrder'])
        return api.todo.postNewTodo(newItem)
          .then((item) => {
            commit('SCH_TODO_CREATED', {item: item, list: itemCache[scheDateStr]})
          })
      }).catch(err => {
        alert('error:' + JSON.stringify(err))
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
  createDiscreteScheduleItem ({ commit, state, dispatch }, {newItem, dateStruct}) {
    var sche = state.schedule
    var scheDateStr = moment(dateStruct.dateResult[0]).format('YYYY-MM-DD')
    var itemCache = sche.dateItems

    return dispatch('fetchScheduleItems', scheDateStr)
      .then(() => {
        newItem['pDisplayOrder'] = util.getNextOrder(itemCache[scheDateStr], 'pDisplayOrder')
        return api.todo.postNewTodo(newItem)
          .then((item) => {
            //  清除缓存，强制从服务器获取数据
            dateStruct.dateResult.forEach(valDate => {
              return commit('SCH_TODO_CACHE_DELETE', {strCurrentDate: moment(valDate).format('YYYY-MM-DD')})
            })
          })
      }).catch(err => {
        alert('error:' + JSON.stringify(err))
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
  createRangeScheduleItem ({ commit, state, dispatch }, {newItem, dateStruct}) {
    var sche = state.schedule
    var scheDateStr = moment(dateStruct.dateResult[0]).format('YYYY-MM-DD')
    var itemCache = sche.dateItems

    return dispatch('fetchScheduleItems', scheDateStr)
      .then(() => {
        newItem['pDisplayOrder'] = util.getNextOrder(itemCache[scheDateStr], 'pDisplayOrder')
        return api.todo.postNewTodo(newItem)
          .then((item) => {
            var i = dateStruct.dateResult[0]
            //  清除缓存，强制从服务器获取数据
            for (; i <= dateStruct.dateResult[1]; i = i + 24 * 3600 * 1000) {
              commit('SCH_TODO_CACHE_DELETE', {strCurrentDate: moment(i).format('YYYY-MM-DD')})
            }
          })
      }).catch(err => {
        alert('error:' + JSON.stringify(err))
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
  submitTodoFinish ({ commit }, p) {
    return api.todo.putTodoProps({id: p.item.id, pIsDone: p.status})
      .then(() => {
        commit('SCH_LIST_TODO_CHECKED', {item: p.item, status: p.status})
      })
  },
  /**
   * 设置inbox页面当前处于选中状态的item，该item将会被现实在edit子页面中
   * 不采用promise的方式返回值
   * @param commit
   * @param item
   */
  setCurrentTodo ({ commit }, item) {
    commit('TD_CURRENT_TODO_SET', {item: item})
  },

  /**
   * 首先检查schedule的items中是否已经获取到todo的详细信息，如果没有获取过，则请求服务器获取
   * 当获取到item的详细信息时，item会添加cDetail标记，表示已经获取过，下次将不会再获取细节信息
   * @param commit
   * @param p
   * @param p.todo
   * @returns {Promise.<TResult>|*|Promise|Function|any}
   */
  getTodo ({ commit, state }, p) {
    let todo = p ? p.todo : state.todo.currentTodo
    // let list = todo.pContainer === 'inbox' ? state.inbox.items : state.schedule.items
    // let orgTodo = util.findById(list, todo.id)
    if (!todo.cDetail) {
      return api.todo.getTodo(todo)
        .then((result) => {
          result.cDetail = true
          commit('TD_TODO_GET', {todo: result})
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
  updateTodoDate ({ commit, state, dispatch }, p) {
    var todo = p.todo || state.todo.currentTodo
    var editItem = p.editItem
    //  如果id存在，则ajax更新
    editItem['id'] = todo.id
    return api.todo.putTodoProps(editItem)
      .then((resTodo) => {
        //  处理缓存数据
        var sourceDateStruct = dateUtil.backend2frontend(todo.dates, todo.startDate, todo.endDate)
        var targetDateStruct = dateUtil.backend2frontend(editItem.dates, editItem.startDate, editItem.endDate)
        var curArrayIndex = todo.pContainer === 'inbox' ? 0 : moment(state.schedule.strCurrentDate, 'YYYY-MM-DD').toDate().getTime()

        if (!dateUtil.isInDateStruct(curArrayIndex, targetDateStruct)) {
          commit('TD_TODO_DELETED', {item: todo})
        }
        dispatch('invalidateDateItems', targetDateStruct, curArrayIndex)
        dispatch('invalidateDateItems', sourceDateStruct, curArrayIndex)

        commit('TD_TODO_UPDATED', {todo: resTodo})
      })
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
  invalidateDateItems ({ commit, state }, dateStruct, exceptDateNum) {
    if (dateStruct.dateType == null && exceptDateNum !== 0) {
      state.inbox.items = null
      return
    }
    switch (dateStruct.dateType) {
      case 'single':
      case 'discrete':
        dateStruct.dateResult.forEach(timeNum => {
          // alert('timeNum:' + timeNum + ',exceptDateNum:' + exceptDateNum)
          if (timeNum !== exceptDateNum) {
            commit('SCH_TODO_CACHE_DELETE', {strCurrentDate: dateUtil.dateNum2Text(timeNum, '-')})
          }
        })
        break
      case 'range':
        var i = dateStruct.dateResult[0]
        for (; i <= dateStruct.dateResult[1]; i = i + 24 * 3600 * 1000) {
          commit('SCH_TODO_CACHE_DELETE', {strCurrentDate: dateUtil.dateNum2Text(i, '-')})
        }
        break
      default:
        break
    }
  },
  /**
   * 提交当前选中的item的属性数据到服务器，以进行更改
   * 如果更改的是日期，由于涉及到日程的移动，不能使用这个方法，而应当使用updateTodoDate
   * @param commit
   * @param state
   * @param p
   * @param p.todo
   * @param p.editItem
   * @returns {Function|any|*|Promise.<TResult>|Promise}
   */
  updateTodo ({ commit, state }, p) {
    //  p.todo不存在，则默认读取currentTodo
    var todo = p.todo || state.todo.currentTodo
    var editItem = p.editItem
    //  如果id存在，则ajax更新
    editItem['id'] = todo.id
    return api.todo.putTodoProps(editItem)
      .then((todo) => {
        commit('TD_TODO_UPDATED', {todo: todo})
      })
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
  deleteTodo ({ commit, state, dispatch }, p) {
    var todo = p.todo || state.todo.currentTodo
    return api.todo.deleteTodo(todo)
      .then((res) => {
        commit('TD_TODO_DELETED', {item: todo})

        //  清除缓存数据
        var sourceDateStruct = dateUtil.backend2frontend(todo.dates, todo.startDate, todo.endDate)
        var curArrayIndex = todo.pContainer === 'inbox' ? 0 : moment(state.schedule.strCurrentDate, 'YYYY-MM-DD').toDate().getTime()

        dispatch('invalidateDateItems', sourceDateStruct, curArrayIndex)
      })
  },
/* ---------------------------------- */

  fetchStaffList ({ commit, state }) {
    if (state.staff.list == null) {
      return api.system.fetchStaffList()
        .then((list) => {
          commit('SYS_STF_LST_READY', {list: list})
        })
    } else {
      return Promise.resolve()
    }
  },
  /**
   * 根据传入的openid获取相应的rsqid，首先从缓存中读取，如果缓存中不存在，则从服务器读取
   * @param commit
   * @param state
   * @param props.idArray
   * @param props.corpId
   */
  fetchRsqidFromUserid ({ commit, state }, props) {
    var openidsNotInCache = []
    var result = {}
    var cache = state.openidCache
    var promise
    props.idArray.forEach(userId => {
      if (cache[userId]) {
        result[userId] = cache[userId]
      } else {
        openidsNotInCache.push(userId)
      }
    })
    if (openidsNotInCache.length > 0) {
      promise = api.appAuth.getOpenidMap({corpId: props.corpId, idArray: openidsNotInCache})
        .then(resp => {
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
   */
  fetchUseridFromRsqid ({ commit, state }, props) {
    var idsNotInCache = []
    var result = {}
    var cache = state.rsqidCache
    var promise
    props.idArray.forEach(openid => {
      if (cache[openid]) {
        result[openid] = cache[openid]
      } else {
        idsNotInCache.push(openid)
      }
    })
    if (idsNotInCache.length > 0) {
      promise = api.appAuth.getRsqidMap({corpId: props.corpId, idArray: idsNotInCache})
        .then(resp => {
          var mapList = resp.result
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
  }
}
