/**
 * 第三方信息api
 */
import { Promise } from 'es6-promise'
import Vue from 'vue'
import url from 'url'
import mapping from './urlMapping'

export default {
  /**
   * 根据传入的openid数组获取对应的rsqid
   */
  getOpenidMap (props) {
    return new Promise((resolve, reject) => {
      var request = url.resolve(window.rsqConfig.authServer, mapping.AUTH_TO_RSQID) + '?corpid=' + props.corpId
      var params = props.idArray
      Vue.http.post(request, JSON.stringify(params))
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.log(JSON.stringify(err))
          reject(err)
        })
    })
  },
  /**
   * 根据传入的rsqid数组获取对应的userid
   * @returns {*}
   */
  getRsqidMap (props) {
    return new Promise((resolve, reject) => {
      var request = url.resolve(window.rsqConfig.authServer, mapping.AUTH_TO_USERID) + '?corpid=' + props.corpId
      var params = props.idArray
      Vue.http.post(request, JSON.stringify(params))
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.log(JSON.stringify(err))
          reject(err)
        })
    })
  }
}
