import Vue from 'vue'

import BaseSelectDate from './BaseSelectDate.vue'

var SelectDate = Vue.extend(BaseSelectDate)

var selectDate = null
/**
 * selectMember单例模式
 * @returns {ActionSheet}
 */
function getSelectDateModal () {
  if (!selectDate) {
    selectDate = new SelectDate()
  }
  return selectDate
}

function show (options) {
  options = options || {}
  var vm = getSelectDateModal()
  vm.currentDate = options.currentDate || new Date()
  vm.type = options.type || 'single'
  vm.selectNumDate = options.selectNumDate || []
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
