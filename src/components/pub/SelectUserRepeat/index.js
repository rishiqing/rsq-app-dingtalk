import Vue from 'vue'

import BaseSelect from './BaseSelectRepeat.vue'

//  用户自定义重复频率
var Select = Vue.extend(BaseSelect)

var selectRepeat = null
/**
 * selectUserRepeat单例模式
 * @returns {ActionSheet}
 */
function getSelectDateModal () {
  if (!selectRepeat) {
    selectRepeat = new Select()
  }
  return selectRepeat
}

function show (options) {
  options = options || {}
  var vm = getSelectDateModal()
  vm.default = options.default || {}
  vm.success = options.success || function () {}
  vm.cancel = options.cancel || function () {}

  vm.$on('self-close', close)
  //  append to body
  Vue.nextTick(function () {
    vm.$mount()
    document.body.appendChild(vm.$el)
  })
}

function close () {
  var vm = getSelectDateModal()
  vm.$el.remove()
}

export default {
  show,
  close
}
