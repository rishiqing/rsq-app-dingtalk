<style lang="scss">
</style>
<template>
	<div class="router-view">
		<r-todo-edit
				:is-checkable="true"
				transition="right-slide">
			<r-input-title
					slot="slotTitle"
					:is-checkable="true"
					:item-title="editItem.pTitle"
					:item-checked="editItem.pIsDone"
					@text-blur="titleBlur"
					@click-checkout="finishChecked"
			></r-input-title>
			<!--<r-input-note-->
					<!--slot="slotNote"-->
					<!--:item-note.sync="editItem.pNote"-->
					<!--@text-blur="noteBlur"-->
			<!--&gt;</r-input-note>-->
			<r-input-date
					slot="slotDate"
					:item-start-date="editItem.startDate"
					:item-end-date="editItem.endDate"
					:item-dates="editItem.dates"
					:item-sep="'/'"
          @date-changed="updateDate"
			></r-input-date>
			<r-input-member
					slot="slotMember"
					:is-native="true"
					:index-title="'成员'"
					:select-title="'请选择成员'"
					:user-rsq-ids="[]"
					:selected-rsq-ids="joinUsers"
					:disabled-rsq-ids="[]"
					@member-changed="saveMember"
			></r-input-member>
			<!--<r-comment-list-->
					<!--slot="slotComment"-->
					<!--:item-list="normalCommonList"-->
					<!--:todo-type="'todo'"-->
			<!--&gt;</r-comment-list>-->
		</r-todo-edit>
	</div>
</template>
<script>
  import TodoEditView from 'com/pub/TodoEditView'
  import InputTitleText from 'com/pub/InputTitleText'
//  import InputNoteText from 'com/pub/InputNoteText'
  import InputDate from 'com/pub/InputDate'
  import InputMember from 'com/pub/InputMember'
  import util from 'ut/jsUtil'
//  import CommentList from 'comps/public/CommentList'

  export default {
    data () {
      return {
        editItem: {}
      }
    },
    computed: {
      currentTodo () {
        return this.$store.state.todo.currentTodo || {}
      },
      joinUsers () {
//        var todo = this.$store.state.todo.currentTodo
        var todo = this.editItem
        if (todo) {
          return util.getMapValuePropArray(todo.receiverUser, 'joinUser')
        } else {
          return []
        }
      },
      normalCommonList () {
        var list = this.editItem.comments
        if (list) {
          return list.filter(function (ele) {
            return ele.type === 0
          })
        } else {
          return []
        }
      }
    },
    components: {
      'r-todo-edit': TodoEditView,
      'r-input-title': InputTitleText,
      'r-input-date': InputDate,
      'r-input-member': InputMember
//      'r-input-note': InputNoteText,
//      'r-comment-list': CommentList
    },
    beforeRouteEnter (to, from, next) {
      next()
      //  暂时采用同步的方式，只有当获取到了数据之后，才显示页面
//      waitForData: true,
//      //  本页面的状态数据
//      data(t) {
//        window.rsqadmg.exec('showLoader')
//        return this.$store.dispatch('getTodo')
//            .then(function() {
//          window.rsqadmg.exec('hideLoader')
//        })
//        var that = this
//
//        setTimeout(function() {
//          window.rsqadmg.exec('showLoader')
//          return that.getTodo()
//              .then(function() {
//                var newItem = {}
//                util.extendObject(newItem, that.currentTodo)
//                t.next({editItem: newItem})
//                that.$nextTick(function() {
//                  that.$broadcast('todo-data-ready')
//                })
//                window.rsqadmg.exec('hideLoader')
//              })
//        }, 0)
//      }
    },
//    vuex: {
//      actions: {
//        getTodo, updateTodo, updateTodoDate, deleteTodo
//      },
//      getters: {
//        currentDate(state) {
//          return state.schedule.strCurrentDate
//        },
//        currentTodo(state) {
//          return state.todo.currentTodo || {}
//        },
//        joinUsers(state) {
//          var todo = state.todo.currentTodo
//          if (todo) {
//            return util.getMapValuePropArray(todo.receiverUser, 'joinUser')
//          } else {
//            return []
//          }
//        }
//      }
//    },
    methods: {
      initData () {
        window.rsqadmg.exec('showLoader')
        return this.$store.dispatch('getTodo')
            .then(item => {
              console.log('item----%o', item)
              util.extendObject(this.editItem, item)
              window.rsqadmg.exec('hideLoader')
            })
      },
      titleBlur (newTitle) {
        if (!newTitle) {
          return window.rsqadmg.execute('alert', {message: '任务标题不能为空'})
        }
        if (newTitle !== this.editItem.pTitle) {
          window.rsqadmg.exec('showLoader', {text: '保存中...'})
          this.$store.dispatch('updateTodo', {editItem: {pTitle: newTitle}})
              .then(() => {
                this.editItem.pTitle = newTitle
                window.rsqadmg.exec('hideLoader')
                window.rsqadmg.execute('toast', {message: '保存成功'})
              })
        }
      },
      noteBlur () {
        var note = this.editItem.pNote
        if (note !== this.currentTodo.pNote) {
          window.rsqadmg.execute('showLoader', {text: '保存中...'})
//          this.updateTodo(this.currentTodo, {pNote: note})
//              .then(function() {
//                window.rsqadmg.exec('hideLoader')
//                window.rsqadmg.execute('toast', {message: '保存成功'})
//              })
        }
      },
      updateDate (result) {
//        //  如果未发生改变则不保存
        if (result.startDate === this.editItem.startDate &&
          result.endDate === this.editItem.endDate &&
          result.dates === this.editItem.dates) {
          return
        }
        window.rsqadmg.execute('showLoader', {text: '保存中...'})
//        var paramObj = {
//          startDate: this.editItem.startDate,
//          endDate: this.editItem.endDate,
//          dates: this.editItem.dates
//        }
        if (result.startDate == null &&
          result.endDate == null &&
          result.dates == null) {
          result['pContainer'] = 'inbox'
        }
        this.$store.dispatch('updateTodoDate', {editItem: result})
            .then(() => {
              util.extendObject(this.editItem, result)
              window.rsqadmg.exec('hideLoader')
              window.rsqadmg.execute('toast', {message: '保存成功'})
            })
      },
      saveMember (selList) {
        var oldArray = this.joinUsers.map(function (obj) {
          return obj['id'] + ''
        })
        var idArray = util.extractProp(selList, 'rsqUserId')
        var compRes = util.compareList(oldArray, idArray)
        window.rsqadmg.execute('showLoader', {text: '保存中...'})
        this.$store.dispatch('updateTodo', {editItem: {
          receiverIds: idArray.join(','),
          addJoinUsers: compRes.addList.join(','),
          deleteJoinUsers: compRes.delList.join(',')
        }}).then(() => {
          window.rsqadmg.exec('hideLoader')
          window.rsqadmg.execute('toast', {message: '保存成功'})
        })
      },
      finishChecked (status) {
//        var status = this.editItem.pIsDone
        console.log('----status----====' + status)
        if (status !== this.editItem.isDone) {
          this.$store.dispatch('updateTodo', {editItem: {pIsDone: status}})
              .then(() => {
                this.editItem.pIsDone = status
                var str = status ? '任务已完成' : '任务已重启'
                window.rsqadmg.execute('toast', {message: str})
              })
        }
      },
      deleteCurrentTodo () {
        var that = this
        window.rsqadmg.exec('confirm', {
          message: '确定要删除此任务？',
          success () {
            window.rsqadmg.execute('showLoader', {text: '删除中...'})
            that.$store.dispatch('deleteTodo', {todo: that.currentTodo})
                .then(() => {
                  window.rsqadmg.exec('hideLoader')
                  window.rsqadmg.execute('toast', {message: '删除成功'})
                  that.$router.replace(window.history.back())
                })
          }
        })
      }
    },
    mounted () {
      this.initData()
      var that = this
//      util.extendObject(this.editItem, this.currentTodo)
      window.rsqadmg.execute('setTitle', {title: '任务'})
      window.rsqadmg.execute('setOptionButtons', {
        btns: [{key: 'deleteTodo', name: '删除'}],
        success (res) {
          if (res.key === 'deleteTodo') {
            that.deleteCurrentTodo()
          }
        }
      })
    }
  }
</script>
