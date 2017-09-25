<template>
  <div class="router-view">
    <div class="itm-edt z-index-xs">
      <div class="content">
        <div class="itm-edt-fields" style="padding-bottom: 80px;">
          <div class="itm-group itm--edit-todo">
            <r-input-title
              :is-checkable="!isInbox"
              :item-title="editItem.pTitle"
              :item-checked="editItem.pIsDone"
              @text-blur="titleBlur"
              @click-checkout="finishChecked"
            ></r-input-title>
          </div>
          <v-touch @tap="SwitchToDesp">
            <div id="noteEditable" contenteditable="true" class="desp"
                 name="note" rows="5"
                 placeholder="添加任务描述...">
              添加任务描述...
            </div>
          </v-touch>
          <div class="itm--edit-todo ">
            <!--<slot name="slotContainer"></slot>-->
            <r-input-date
              :item-start-date="editItem.startDate"
              :item-end-date="editItem.endDate"
              :item-dates="editItem.dates"
              :item-sep="'/'"
              @date-changed="updateDate"
            ></r-input-date>
            <r-input-member
              :is-native="true"
              :index-title="'执行人'"
              :select-title="'请选择成员'"
              :user-rsq-ids="[]"
              :selected-rsq-ids="joinUserRsqIds"
              :disabled-rsq-ids="[]"
              @member-changed="saveMember"
            ></r-input-member>
            <r-input-sub-todo
              :item="currentTodo"
            ></r-input-sub-todo>
            <!--<div class="ding">-->
              <!--<div class="bottom">-->
                <!--<p class="">DING</p>-->
                <!--<p class="message">通过钉钉消息,短信或者电话提醒参与人</p>-->
              <!--</div>-->
              <!--<input class="mui-switch" type="checkbox">-->
            <!--</div>-->
            <r-comment-list
              :items="currentTodo.comments"
              ></r-comment-list>
            <div class="bottom">
              <v-touch @tap="SwitchToComent">
                <input type="text" class="bot" placeholder="输入讨论内容或发送文件">
              </v-touch>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
  input::-webkit-input-placeholder { /* WebKit browsers */
    font-family: STHeitiSC-Light;
    font-size: 15px;
    color: #A3A3A3;
    letter-spacing: 0;
  }
  .desp{
    border-top: 1px solid #E0E0E0;
    border-bottom: 1px solid #E0E0E0;
    margin-bottom: 10px;
    padding-left: 3%;
    width: 100%;
    line-height: 1.1rem;
    font-family: STHeitiSC-Light;
    font-size: 14px;
    color: #999999;
    letter-spacing: 0;
    background-color: white;
  }
  input{
    line-height: 0.933rem;
    width:6.8rem;
  }
  .bottom{
    height: 1.1rem;
    display: flex;
    align-items: center;
    background-color: white;
    position: fixed;
    bottom: 0;
    justify-content: center;
    width:100%;
    border-top:1px solid #DADADA ;
  }
  .bot{
    padding-left: 2%;
    width:9.2rem;
    height:0.933rem ;
    border:1px solid #E0E0E0 ;
  }
  .send>input{
    width: 300px;
    height: 50px;
    border: 1px solid red;
  }
  p{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
  }
  .ding{
    height:2rem;
    line-height: 1rem;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
    position:relative;
    background-color: white;
    border-bottom:1px solid #E0E0E0;
  }
  .message{
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #999999;
  }
  .mui-switch {
    width: 52px;
    height: 31px;
    position: absolute;
    top:0.55rem;
    right:0.4rem;
    border: 1px solid #dfdfdf;
    background-color: #fdfdfd;
    box-shadow: #dfdfdf 0 0 0 0 inset;
    border-radius: 20px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    background-clip: content-box;
    display: inline-block;
    -webkit-appearance: none;
    user-select: none;
    outline: none; }
  .mui-switch:before {
    content: '';
    width: 29px;
    height: 29px;
    position: absolute;
    top: 0px;
    left: 0;
    border-radius: 20px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4); }
  .mui-switch:checked {
    border-color: #67B2FE;
    box-shadow: #67B2FE 0 0 0 16px inset;
    background-color: #67B2FE; }
  .mui-switch:checked:before {
    left: 21px; }
  .mui-switch.mui-switch-animbg {
    transition: background-color ease 0.4s; }
  .mui-switch.mui-switch-animbg:before {
    transition: left 0.3s; }
  .mui-switch.mui-switch-animbg:checked {
    box-shadow: #dfdfdf 0 0 0 0 inset;
    background-color: #67B2FE;
    transition: border-color 0.4s, background-color ease 0.4s; }
</style>
<script>
  import InputTitleText from 'com/pub/InputTitleText'
  import InputDate from 'com/pub/InputDate'
  import InputMember from 'com/pub/InputMember'
  import InputSubTodo from 'com/pub/InputSubTodo'
  import util from 'ut/jsUtil'
  import ComentList from 'com/pub/ComentList'
  export default {
    data () {
      return {
        editItem: {},
        joinUserRsqIds: []
      }
    },
    computed: {
      currentTodo () {
        return this.$store.state.todo.currentTodo || {}
      },
      pNote () {
        return this.$store.state.todo.currentTodo.pNote
      },
      isInbox () {
        return this.currentTodo.pContainer === 'inbox'
      },
//      joinUsers () {
//        var todo = this.$store.state.todo.currentTodo
//        var todo = this.editItem
//        if (todo) {
//          return util.getMapValuePropArray(todo.receiverUser, 'joinUser')
//        } else {
//          return []
//        }
//      },
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
      'r-input-title': InputTitleText,
      'r-input-date': InputDate,
      'r-input-member': InputMember,
      'r-input-sub-todo': InputSubTodo,
//      'r-input-note': InputNoteText,
      'r-comment-list': ComentList
    },
    beforeRouteEnter (to, from, next) {
      next()
    },
    methods: {
      initData () {
        window.rsqadmg.exec('showLoader')
        return this.$store.dispatch('getTodo')
            .then(item => {
              util.extendObject(this.editItem, item)
              var joinUserArray = util.getMapValuePropArray(this.editItem.receiverUser, 'joinUser')
              this.joinUserRsqIds = joinUserArray.map(obj => {
                return obj['id'] + ''
              })
              window.rsqadmg.exec('hideLoader')
            })
      },
      SwitchToComent () {
        this.$router.push('/pub/coment')
      },
      SwitchToDesp () {
        this.$router.push('/pub/desp')
      },
      titleBlur (newTitle) {
        if (!newTitle) {
          return window.rsqadmg.execute('alert', {message: '任务标题不能为空'})
        }
        if (newTitle !== this.editItem.pTitle) {
          window.rsqadmg.exec('showLoader', {text: '保存中...'})
          this.$store.dispatch('updateTodo', {editItem: {pTitle: newTitle}})
              .then(() => {
                this.$store.dispatch('saveTodoAction', {editItem: {idOrContent: newTitle, type: 9}})
                  .then(() => {
                    this.editItem.pTitle = newTitle
                  })
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
      saveMember (idArray) {
        var compRes = util.compareList(this.joinUserRsqIds, idArray)
        var params = {
          receiverIds: idArray.join(','),
          addJoinUsers: compRes.addList.join(','),
          deleteJoinUsers: compRes.delList.join(',')
        }
        window.rsqadmg.execute('showLoader', {text: '保存中...'})
        this.$store.dispatch('updateTodo', {editItem: params}).then(() => {
          this.joinUserRsqIds = idArray
          window.rsqadmg.exec('hideLoader')
          window.rsqadmg.execute('toast', {message: '保存成功'})
        })
      },
      finishChecked (status) {
        if (status !== this.editItem.isDone) {
          this.$store.dispatch('updateTodo', {editItem: {pIsDone: status}})
              .then(() => {
                this.$store.dispatch('saveTodoAction', {editItem: {status: status, type: 5}})
                  .then(() => {
                  })
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
      var noteElement = document.getElementById('noteEditable')
      if (this.pNote) {
        noteElement.innerHTML = this.pNote
      }
      var that = this
      window.rsqadmg.execute('setTitle', {title: '详情'})
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
