import Vue from 'vue'

import BaseSelect from './BaseSelectRepeat.vue'

//  用户自定义重复频率
var SelectUserRepeat = Vue.extend(BaseSelect)

var selectUserRepeat = null
/**
 * selectUserRepeat单例模式
 * @returns {ActionSheet}
 */
function getSelectDateModal (options) {
  if (!selectUserRepeat) {
    selectUserRepeat = new SelectUserRepeat()
    selectUserRepeat.$on('self-close', close)
  }
  return selectUserRepeat
}

function show (options) {
  options = options || {}
  var vm = getSelectDateModal(options)
  vm.$on('select-user-repeat-confirm', options.success || function () {})
  vm.$on('select-user-repeat-cancel', options.cancel || function () {})
  vm.baseNumTime = options.baseNumTime
  vm.repeatType = options.repeatType || ''
  vm.repeatStrTimeArray = options.repeatStrTimeArray || []
  vm.isLastDate = options.isLastDate || false

  //  append to body
  Vue.nextTick(function () {
    vm.$mount()
    document.body.appendChild(vm.$el)
  })
}

function close () {
  var vm = getSelectDateModal()
  if (vm.$el) {
    vm.$off('select-user-repeat-confirm')
    vm.$off('select-user-repeat-cancel')
    vm.$el.remove()
  }
}

export default {
  show,
  close
}
