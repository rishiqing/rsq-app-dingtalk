import Vue from 'vue'

import BaseSelectMember from './BaseSelectMember.vue'

let SelectMember = Vue.extend(BaseSelectMember)

let selectMember = null
/**
 * selectMember单例模式
 * @returns {ActionSheet}
 */
function getSelectMemberModal () {
  if (!selectMember) {
    selectMember = new SelectMember()
  }
  return selectMember
}

/**
 * 人员选择框，需要传入的成员对象有三个属性：id/name/avatar，
 * 具体每个属性对应的对象的字段名可以分别通过idAttribute、nameAttribute、avatarAttribute三个属性指定
 * 如果未设置idAttribute、nameAttribute、avatarAttribute属性的值，那么默认的属性名即为：id、name、avatar。
 * 参数说明：
 * memberList: 传入的可供选择的成员的列表
 * selectedIdList: 已经选择的成员的id
 * disabledIdList: 不可更改的成员的id
 * creatorIdList:  创建者成员的id列表
 * success: 成功的回调
 * cancel: 取消选择的回调
 * @param options
 */
function show (options) {
  options = options || {}
  const vm = getSelectMemberModal()
  // vm.title = options.title || '选择成员'
  vm.idAttribute = options.idAttribute || 'id'
  vm.nameAttribute = options.nameAttribute || 'name'
  vm.avatarAttribute = options.avatarAttribute || 'avatar'
  vm.btnText = options.btnText || '确定'
  vm.maximum = options.maximum || 299
  vm.memberList = options.memberList || []
  vm.selectedIdList = options.selectedIdList || []
  vm.disabledIdList = options.disabledIdList || []
  vm.creatorIdList = options.creatorIdList || []
  vm.success = options.success || function () {}
  vm.cancel = options.cancel || function () {}
  vm.singleSelect = options.singleSelect || false
  vm.realStaff = options.realStaff || []
  vm.$on('self-close', close)

  //  append to body
  Vue.nextTick(function () {
    vm.$mount()
    document.body.appendChild(vm.$el)
  })
}

function close () {
  const vm = getSelectMemberModal()
  vm.$el.remove()
}

function confirmSelect () {
  const vm = getSelectMemberModal()
  vm.confirmSelect()
}

export default {
  show,
  close,
  confirmSelect
}
