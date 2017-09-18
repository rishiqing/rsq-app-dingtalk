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
          window.rsqadmg.log(JSON.stringify(err))
          reject(err)
        })
    })
  },
  /**
   * 获取指定日程中的任务
   * @returns {*}
   */
  getScheduleTodos (params) {
    params.isGetDelay = true
    let path = mapping.GET_SCHEDULE_TODOS + '?' + util.combineUrlParams(params)
    return new Promise((resolve, reject) => {
      Vue.http.get(path)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.log(JSON.stringify(err))
          reject(err)
        })
    })
  },
  getTodo (params) {
    var path = util.replaceUrlParams(mapping.GET_TODO, params)
    return new Promise((resolve, reject) => {
      Vue.http.get(path)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.log(JSON.stringify(err))
          reject(err)
        })
    })
  },
  postNewTodo (props) {
    return new Promise((resolve, reject) => {
      Vue.http.post(mapping.POST_NEW_TODO, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.log(JSON.stringify(err))
          reject(err)
        })
    })
  },
  postSubTodo (props) {
    return new Promise((resolve, reject) => {
      Vue.http.post(mapping.POST_SUB_TODO, props)
        .then(res => {
          // console.log('postSubTodo进来了')
          resolve(res.json())
        }, err => {
          window.rsqadmg.log(JSON.stringify(err))
          reject(err)
        })
    })
  },
  putTodoProps (props) {
    var path = util.replaceUrlParams(mapping.PUT_TODO_PROP, props)
    console.log('props是' + props.name + ':' + props.id + '请求路径是' + path)
    return new Promise((resolve, reject) => {
      Vue.http.put(path, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.log(JSON.stringify(err))
          reject(err)
        })
    })
  },
  putSubTodoProps (props) {
    var path = util.replaceUrlParams(mapping.POST_SUBTODO_PROP, props)
    console.log('props的isdone是' + props.pIsDone + ':' + props.id + '请求路径是' + path)
    return new Promise((resolve, reject) => {
      Vue.http.put(path, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.log(JSON.stringify(err))
          reject(err)
        })
    })
  },
  putSubTodoPropsCheck (props) {
    var path = util.replaceUrlParams(mapping.POST_SUBTODO_PROP, props)
    console.log('props是' + props.item.id + ':' + props.status + '请求路径是' + path)
    return new Promise((resolve, reject) => {
      Vue.http.put(path, props)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.log(JSON.stringify(err))
          reject(err)
        })
    })
  },
  deleteTodo (props) {
    console.log('api-deletetodo进来了')
    var path = util.replaceUrlParams(mapping.DELETE_TODO, props)

    return new Promise((resolve, reject) => {
      Vue.http.delete(path)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.log(JSON.stringify(err))
          reject(err)
        })
    })
  },
  deleteSubTodo (props) {
    console.log('api-deletesubtodo进来了')
    var path = util.replaceUrlParams(mapping.DELETE_SUB_TODO, props)
    return new Promise((resolve, reject) => {
      Vue.http.delete(path)
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.log(JSON.stringify(err))
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
          window.rsqadmg.log(JSON.stringify(err))
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
          window.rsqadmg.log(JSON.stringify(err))
          reject(err)
        })
    })
  }
}
