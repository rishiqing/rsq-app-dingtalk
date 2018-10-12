import { Promise } from 'es6-promise'
import Vue from 'vue'
import mapping from './urlMapping'
import util from 'ut/jsUtil'
export default {
  /**
   * 获取收纳箱中的任务
   * @returns {*}
   */
  getInboxTodos () {
    return new Promise((resolve, reject) => {
      Vue.http.get(mapping.GET_INBOX_TODOS)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  getFileFromAli (props) {
    return new Promise((resolve, reject) => {
      Vue.http.post(mapping.GET_FILE_FROM_AlI, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  moveToPlan (props) {
    return new Promise((resolve, reject) => {
      Vue.http.post(mapping.MOVE_TO_PLAN, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  planToPlan (props) {
    return new Promise((resolve, reject) => {
      Vue.http.post(mapping.PLAN_MOVE_TO_PLAN, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  /**
   * 获取指定日程中的任务
   * @returns {*}
   */
  getScheduleTodos (params) {
    params.isFrom = 'web'
    params.isGetDelay = true
    let path = mapping.GET_SCHEDULE_TODOS + '?' + util.combineUrlParams(params)
    return new Promise((resolve, reject) => {
      Vue.http.get(path)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  getTodo (params) {
    var path = util.replaceUrlParams(mapping.GET_TODO, params)
    path = path + '?' + util.combineUrlParams(params)
    return new Promise((resolve, reject) => {
      Vue.http.get(path)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          // console.log('没拿到数据') 留待测试
          // console.log('上面是跳转')
          reject(err.body)
        })
    })
  },
  postNewTodo (props) {
    return new Promise((resolve, reject) => {
      Vue.http.post(mapping.POST_NEW_TODO, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  postSubtodo (props) {
    return new Promise((resolve, reject) => {
      Vue.http.post(mapping.POST_SUBTODO, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  putTodoProps (props) {
    var path = util.replaceUrlParams(mapping.PUT_TODO_PROP, props)
    return new Promise((resolve, reject) => {
      Vue.http.put(path, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  putSubtodoProps (props) {
    var path = util.replaceUrlParams(mapping.POST_SUBTODO_PROP, props)
    return new Promise((resolve, reject) => {
      Vue.http.put(path, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  putSubtodoPropsCheck (props) {
    var path = util.replaceUrlParams(mapping.POST_SUBTODO_PROP, props)
    return new Promise((resolve, reject) => {
      Vue.http.put(path, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  deleteTodo (props) {
    var path = util.replaceUrlParams(mapping.DELETE_TODO, props)

    return new Promise((resolve, reject) => {
      Vue.http.delete(path)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  deleteRepeatTodo (props) {
    var path = mapping.DELETE_REPEAT_TODO + '?' + util.combineUrlParams(props)
    return new Promise((resolve, reject) => {
      Vue.http.delete(path)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  deleteCommentItem (props) {
    var path = util.replaceUrlParams(mapping.DELETE_COMMENT_TODO, props)
    // console.log('删除评论路径是' + path)
    return new Promise((resolve, reject) => {
      Vue.http.delete(path)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  deleteSubtodo (props) {
    var path = util.replaceUrlParams(mapping.DELETE_SUBTODO, props)
    return new Promise((resolve, reject) => {
      Vue.http.delete(path)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  getDatesHasTodo (props) {
    return new Promise((resolve, reject) => {
      Vue.http.post(mapping.POST_DATES_HAS_TODO, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  postComment (props) {
    return new Promise((resolve, reject) => {
      Vue.http.post(mapping.POST_TODO_COMMENT, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  postNote (props) {
    var path = util.replaceUrlParams(mapping.POST_NOTE, props)
    return new Promise((resolve, reject) => {
      Vue.http.put(path, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  putRecordProps (props) {
    return new Promise((resolve, reject) => {
      Vue.http.post(mapping.POST_RECORD_COMMENT, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  getRecord (props) {
    return new Promise((resolve, reject) => {
      var path = mapping.GET_RECORD + '?id=' + props.id
      Vue.http.get(path)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  fetchUsers () {
    return new Promise((resolve, reject) => {
      var path = mapping.GET_USER
      Vue.http.get(path)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  sendMessage (props) {
    var url = mapping.REMIND + '?corpid=' + props.corpId
    return new Promise((resolve, reject) => {
      Vue.http.post(url, props.data)
        .then(res => {
          // alert('请求返回')
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  postPlan (props) {
    return new Promise((resolve, reject) => {
      Vue.http.post(mapping.POST_PLAN, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  updataPlan (props) {
    var path = util.replaceUrlParams(mapping.UPDATA_PLAN, props)
    return new Promise((resolve, reject) => {
      Vue.http.put(path, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  getPlan () {
    return new Promise((resolve, reject) => {
      Vue.http.get(mapping.GET_PLAN)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  getChildKanbanList (props) {
    var path = util.replaceUrlParams(mapping.GET_CHILD_PLAN, props)
    return new Promise((resolve, reject) => {
      Vue.http.get(path, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  getCardList (props) {
    var path = util.replaceUrlParams(mapping.GET_CARD, props)
    return new Promise((resolve, reject) => {
      Vue.http.get(path, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  postSubPlan (props) {
    return new Promise((resolve, reject) => {
      Vue.http.post(mapping.POST_SUB_PLAN, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  postCard (props) {
    return new Promise((resolve, reject) => {
      Vue.http.post(mapping.POST_CARD, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  deleteChildPlan (props) {
    var path = util.replaceUrlParams(mapping.DELETE_CHILD_PLAN, props)
    return new Promise((resolve, reject) => {
      Vue.http.delete(path)
        .then(res => {
          resolve()
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  updateName (props) {
    var path = util.replaceUrlParams(mapping.DELETE_CHILD_PLAN, props)
    return new Promise((resolve, reject) => {
      Vue.http.put(path, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  cancelStar (props) {
    return new Promise((resolve, reject) => {
      Vue.http.put(mapping.CANCEL_STAR, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  saveStar (props) {
    return new Promise((resolve, reject) => {
      Vue.http.put(mapping.SAVE_STAR, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  deletePlan (props) {
    var path = util.replaceUrlParams(mapping.DELETE_PLAN, props)
    return new Promise((resolve, reject) => {
      Vue.http.delete(path)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  quitPlan (props) {
    var path = util.replaceUrlParams(mapping.QUIT_PLAN, props)
    return new Promise((resolve, reject) => {
      Vue.http.put(path)  // 不确定是否
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  finishCardItem (props) {
    var path = util.replaceUrlParams(mapping.FINISH_CARD_ITEM, props)
    return new Promise((resolve, reject) => {
      Vue.http.put(path, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  submitKanbanItem (props) {
    return new Promise((resolve, reject) => {
      Vue.http.post(mapping.POST_KANBAN_ITEM, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  updateCardName (props) {
    var path = util.replaceUrlParams(mapping.UPDATE_CARD_NAME, props)
    return new Promise((resolve, reject) => {
      Vue.http.put(path, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  deleteCard (props) {
    var path = util.replaceUrlParams(mapping.UPDATE_CARD_NAME, props)
    return new Promise((resolve, reject) => {
      Vue.http.delete(path)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  updatePlanName (props) {
    var path = util.replaceUrlParams(mapping.GET_CHILD_PLAN, props)
    return new Promise((resolve, reject) => {
      Vue.http.put(path, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  getLabels (props) {
    var path = util.replaceUrlParams(mapping.GET_LABLES, props)
    return new Promise((resolve, reject) => {
      Vue.http.get(path)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  updatePlanMember (props) {
    var path = util.replaceUrlParams(mapping.GET_CHILD_PLAN, props)
    // alert(path)
    // alert('props' + JSON.stringify(props))
    return new Promise((resolve, reject) => {
      Vue.http.put(path, props)
        .then(res => {
          // alert('RES' + res.name)
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  getTemplate () {
    // var path = util.replaceUrlParams(mapping.GET_COVERLIST)
    // alert(path)
    // alert('props' + JSON.stringify(props))
    return new Promise((resolve, reject) => {
      Vue.http.get(mapping.GET_COVERLIST)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  deleteKanbanItem (props) {
    var path = util.replaceUrlParams(mapping.DELETE_KANBAN_ITEM, props)
    return new Promise((resolve, reject) => {
      Vue.http.delete(path)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  updateKanbanItem (props) {
    var path = util.replaceUrlParams(mapping.PUT_KANBAN_ITEM, props)
    return new Promise((resolve, reject) => {
      Vue.http.put(path, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  getKanbanItem (props) {
    var path = util.replaceUrlParams(mapping.FINISH_CARD_ITEM, props)
    return new Promise((resolve, reject) => {
      Vue.http.get(path)
        .then(res => {
          // alert('RES' + res.name)
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err.body)
        })
    })
  },
  createKanbanSubtodo (props) {
    return new Promise((resolve, reject) => {
      Vue.http.post(mapping.KANBAN_SUBTODO, props)
        .then(res => {
          // alert('RES' + res.name)
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  putKanbanSubtodo (props) {
    var path = util.replaceUrlParams(mapping.PUT_KANBAN_SUBTODO, props)
    return new Promise((resolve, reject) => {
      Vue.http.put(path, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  deleteKanbanSubtodo (props) {
    var path = util.replaceUrlParams(mapping.DELETE_KANBAN_SUBTODO, props)
    return new Promise((resolve, reject) => {
      Vue.http.delete(path, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  postKanbanItemComment (props) {
    return new Promise((resolve, reject) => {
      Vue.http.post(mapping.POST_KANBAN_ITEM_COMMENT, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  deleteKanbanItemComment (props) {
    var path = util.replaceUrlParams(mapping.DELETE_KANBAN_ITEM_COMMENT, props)
    return new Promise((resolve, reject) => {
      Vue.http.delete(path, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  getAllUsers () {
    return new Promise((resolve, reject) => {
      Vue.http.get(mapping.GET_ALL_USERS)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  }
}
