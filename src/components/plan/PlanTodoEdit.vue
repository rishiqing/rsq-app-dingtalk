<template>
  <!--计划任务的编辑页面-->
  <div class="router-view">
    <div class="itm-edt z-index-xs">
      <div class="content">
        <div
          id="plantofix"
          class="itm-edt-fields" >
          <div class="itm-group itm--edit-todo">
            <r-input-title
              ref="title"
              :is-checkable="true"
              :item-title="editItem.name"
              :item-checked="editItem.isDone"
              :is-show-bottom-border="true"
              @text-blur="saveTitle"
              @click-checkout="finishChecked"/>
            <r-input-note
              :content="editItem.note"
              :has-left-space="true"
              :todo-type="'plan'"/>
          </div>
          <div class="itm--edit-todo ">
            <div class="icon-field-group">
              <div class="common-field">
                <i class="icon2-schedule sche"/>
                <r-input-date
                  :item="editItem"
                  :sep="'/'"
                  :edit-time="true"
                  :todo-type="'plan'"/>
              </div>
              <div class="common-field">
                <i class="icon2-member sche"/>
                <r-input-member
                  :edit-time="true"
                  :is-native="false"
                  :index-title="'执行人'"
                  :select-title="'请选择成员'"
                  :user-rsq-ids="planMember"
                  :selected-rsq-ids="joinUserRsqIds"
                  :creater-rsq-ids="[]"
                  :disabled-rsq-ids="[]"
                  @member-changed="saveMember"/>
              </div>
              <div class="common-field">
                <img
                  src="../../assets/img/moveplan.svg"
                  class="icon2-member sche move-to">
                <r-move-plan
                  :item="editItem"
                  :plan="true"/>
              </div>
            </div>
            <r-input-subtodo/>
            <r-comment-list
              :items="todoComments"
              :todo-id="currentKanbanItem.id"
              :todo-type="'plan'"/>
            <div class="btn-group deleteTask" >
              <div class="btn-wrap">
                <v-touch
                  tag="a"
                  class="weui-btn weui-btn_warn kong"
                  href="javascript:;"
                  @tap="deleteItem">
                  删除任务
                </v-touch>
              </div>
            </div>
            <v-touch
              class="bottom"
              @tap="switchToComment">
              <img
                class="talk-png"
                src="../../assets/img/talk.png">
              参与讨论
            </v-touch>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  import InputTitleText from 'com/pub/InputTitleText'
  import InputDate from 'com/pub/InputDate'
  import InputNote from 'com/pub/InputNote'
  import InputMember from 'com/pub/InputMember'
  import InputSubtodo from 'com/plan/PlanSubtodoList'
  import SendConversation from 'com/demo/SendConversation'
  import util from 'ut/jsUtil'
  import MoveToPlan from 'com/pub/MoveToPlan'
  import CommentList from 'com/pub/CommentList'

  export default {
    name: 'PlanTodoEdit',
    components: {
      'r-input-title': InputTitleText,
      'r-input-date': InputDate,
      'r-input-member': InputMember,
      'r-input-subtodo': InputSubtodo,
      'r-input-note': InputNote,
      'r-comment-list': CommentList,
      'r-send-conversation': SendConversation,
      'r-move-plan': MoveToPlan
    },
    data () {
      return {
        editItem: {},
        joinUserRsqIds: [],
        planMember: [],
        error: false
      }
    },
    computed: {
      // planMember () {
      //   // var that = this
      //   var arr = []
      //   if (this.$store.state.currentPlan) {
      //     var len = this.$store.state.currentPlan.userRoles.length
      //     console.log(len, 1)
      //     for (let i = 0; i < len; i++) {
      //       arr.push(this.$store.state.currentPlan.userRoles[i].userId)
      //     }
      //   }
      //   return arr
      // },
      currentPlan () {
        return this.$store.state.currentPlan
      },
      createdId () {
        return [this.currentPlan.creatorId]
      },
      currentKanbanItem () {
        return this.$store.state.plan.currentKanbanItem || {}
      },
      itemId () {
        if (this.currentKanbanItem.id) {
          return this.currentKanbanItem.id
        } else {
          return this.$route.params.planTodoId
        }
      },
      todoComments () {
        return this.currentKanbanItem.commentList || []
      },
      //  普通评论
      commonComments () {
        return this.todoComments.filter(i => {
          return i.type === 0
        })
      },
      loginUser () {
        return this.$store.getters.loginUser || {}
      },
      corpId () {
        return this.loginUser.authUser.corpId
      }
    },
    mounted () {
      window.rsqadmg.execute('setTitle', {title: '任务详情'})
      this.initPlan()
      document.body.scrollTop = document.documentElement.scrollTop = 0
    },
    beforeRouteLeave (to, from, next) {
      if (this.error) {
        next()
        return
      }
      if (!this.$refs.title.$refs.titleInput.value || /^\s+$/.test(this.$refs.title.$refs.titleInput.value)) {
        window.rsqadmg.execute('alert', {message: '任务标题不能为空'})
        next(false)
        return
      }
      this.saveTitleIOS(next)
    },
    methods: {
      fetchCommentIds () {
        //  根据评论中的rsqId获取userId，用来显示头像
        var ids = this.commonComments.map(ti => {
          return ti.authorId
        })
        ids = util.unique(ids)  //  去重
        var corpId = this.loginUser.authUser.corpId
        return this.$store.dispatch('fetchUseridFromRsqid', {corpId: corpId, idArray: ids})
          .then(idMap => {
            var that = this
            that.commonComments.forEach(c => {
              const user = idMap[c.authorId]
              if (user) {
                // that.$set(c, 'authorAvatar', user.avatar)
                // that.$set(c, 'authorName', 'dingding-' + user.name)
                that.$set(c, 'qywxShowAvatar', user.avatar)
                that.$set(c, 'qywxShowName', user.name)
              }
            })
          })
      },
      switchToComment () {
        this.$router.push('/plan/todo/comment')
      },
      saveMember (idArray, old) { // 这个方法关键之处是每次要穿的参数是总接收id，增加的id减少的id
        // var that = this
        // var ask = Array.from(new Set(idArray.concat(old))).join(',')
        // var ask = ''
        // var des = ''
        // var idArrayName = []
        // var oldName = []
        // var name = this.loginUser.authUser.name
        // window.rsqadmg.execute('setTitle', {title: '任务详情'})
        const compRes = util.compareList(this.joinUserRsqIds, idArray)
        const params = {
          id: this.currentKanbanItem.id,
          receiverIds: idArray.join(','),
          addJoinUsers: compRes.addList.join(','),
          deleteJoinUsers: compRes.delList.join(',')
        }
        window.rsqadmg.execute('showLoader', {text: '保存中...'})
        this.$store.dispatch('updateKanbanItem', params).then(() => {
          this.joinUserRsqIds = idArray
          window.rsqadmg.exec('hideLoader')
          // window.rsqadmg.execute('toast', {message: '保存成功'})
          //  重新获取用户头像
          this.fetchCommentIds()
          // this.$store.dispatch('fetchUseridFromRsqid', {corpId: that.loginUser.authUser.corpId, idArray: idArray}).then(function (res) {
          //   let res1 = util.getMapValuePropArray(res)
          //   idArrayName = res1.map(function (o) {
          //     return o.name
          //   })
          // })
          // .then(function () {
          //   return that.$store.dispatch('fetchUseridFromRsqid', {corpId: that.loginUser.authUser.corpId, idArray: old}).then(function (res) {
          //     let res2 = util.getMapValuePropArray(res)
          //     oldName = res2.map(function (o) {
          //       return o.name
          //     })
          //   })
          // })
          // .then(function () {
          //   var compResCache = util.compareList(oldName, idArrayName)
          //   var compResId = util.compareList(old, idArray)
          //   if (params.addJoinUsers === '') {
          //     des = name + ' 移除了任务成员' + compResCache.delList.join('、')
          //     ask = compResId.delList.join(',')
          //   } else if (params.deleteJoinUsers === '') {
          //     des = name + ' 添加了任务成员' + compResCache.addList.join('、')
          //     ask = compResId.addList.join(',')
          //   } else {
          //     des = name + ' 添加了任务成员' + compResCache.addList.join('、') + ',' + '移除了任务成员' + compResCache.delList.join('、')
          //     ask = Array.from(new Set(compResId.addList.concat(compResId.delList))).join(',')
          //   }
          //   return des
          // })
          // .then(function (res) {
            // if (params.addJoinUsers || params.deleteJoinUsers) {
              // var url = window.location.href.split('#')
              // var datas = {
              //   corpId: that.$store.getters.loginUser.authUser.corpId,
              //   agentid: that.$store.getters.loginUser.authUser.corpId,
              //   description: that.$store.state.plan.currentKanbanItem.name,
              //   url: url[0] + '#' + '/plan/todo/' + that.$store.state.plan.currentKanbanItem.id,
              //   title: res,
              //   receiverIds: ask
              // }
              // console.log(datas)
              // that.$store.dispatch('qywxSendMessage', datas)
            // }
          // })
        })
      },
      finishChecked (status) {
        if (status !== this.editItem.isDone) {
          this.$store.dispatch('updateKanbanItem', {id: this.itemId, isDone: status, doneTime: moment().format('YYYY-MM-DD HH:mm:ss')})
              .then(() => {
//                this.$store.dispatch('saveTodoAction', {editItem: {status: status, type: 5}})
//                  .then(() => {
//                  })
                this.editItem.isDone = status
                var str = status ? '任务已完成' : '任务已重启'
                window.rsqadmg.execute('toast', {message: str})
              })
        }
      },
      saveTitle (newTitle) {
        // var that = this
        if (!newTitle) {
          window.rsqadmg.execute('alert', {message: '任务标题不能为空'})
          return
        }
        if (newTitle !== this.editItem.name) {
          this.$store.dispatch('updateKanbanItem', {id: this.itemId, name: newTitle})
            .then(() => {
              this.editItem.name = newTitle
//            this.editItem.pTitle = newTitle
//            window.rsqadmg.exec('hideLoader')
//            window.rsqadmg.execute('toast', {message: '保存成功'})
              // var url = window.location.href.split('#')
              // var name = that.loginUser.authUser.name
              // var addArray = this.joinUserRsqIds.join(',')
              // var mem = this.newList ? this.newList : addArray
              // var datas = {
              //   corpId: that.loginUser.authUser.corpId,
              //   agentid: that.corpId,
              //   title: name + ' 修改了任务标题',
              //   url: url[0] + '#' + '/plan/todo/' + this.currentPlan.id,
              //   description: that.editItem.name,
              //   receiverIds: that.$store.state.plan.currentKanbanItem.joinUserIds
              // }
              // console.log(mem)
              // that.$store.dispatch('qywxSendMessage', datas)
            })
        }
      },
      saveTitleIOS (next) {
        var newTitle = this.$refs.title.$refs.titleInput.value
        this.$store.dispatch('updateKanbanItem', {id: this.itemId, name: newTitle}).then(function () {
          next()
        })
      },
      deleteItem () {
        const that = this
        window.rsqadmg.exec('confirm', {
          message: '确定要删除此任务？',
          success () {
            window.rsqadmg.execute('showLoader', {text: '删除中...'})
            that.$store.dispatch('deleteKanbanItem', {id: that.itemId})
              .then(() => {
                window.rsqadmg.exec('hideLoader')
                window.rsqadmg.execute('toast', {message: '删除成功'})
                // var url = window.location.href.split('#')
                // var name = that.$store.getters.loginUser.authUser.name
                // var datas = {
                //   corpId: that.$store.getters.loginUser.authUser.corpId,
                //   agentid: that.$store.getters.loginUser.authUser.corpId,
                //   title: name + ' 删除了任务',
                //   url: url[0] + '#' + '/plan/' + that.currentPlan.id + '/child-plan',
                //   description: that.editItem.name,
                //   receiverIds: that.$store.state.plan.currentKanbanItem.joinUserIds
                // }
                // console.log(datas)
                // that.$store.dispatch('qywxSendMessage', datas)
                that.$router.go(-1)
              })
          }
        })
      },
      initPlan () {
        var that = this
        // console.log(this.currentKanbanItem.commentList)
        // window.rsqadmg.exec('showLoader', {'text': '加载中'})
        return this.$store.dispatch('getKanbanItem', {id: this.itemId})
          .then(item => {
            util.extendObject(this.editItem, item)
            util.extendObject(this.currentKanbanItem, item)
            if (!that.currentPlan) {
              that.$store.dispatch('getChildKanbanList', {id: item.kanbanId}).then(
                (res) => {
                  that.$store.commit('SET_CURRENT_PLAN', res)
                  that.$store.commit('SAVE_CHILD_PLAN', res.childKanbanList)
                  that.$store.dispatch('getLabels', this.item).then((res) => {
                    that.$store.commit('SAVE_LABELS', res)
                  })
                })
            }
            that.planMember = that.editItem.accessIds.split(',')
            this.joinUserRsqIds = this.editItem.joinUserIds.split(',')
          })
          .then(() => {
            this.fetchCommentIds()
            // window.rsqadmg.exec('hideLoader')
          })
          .catch(err => {
            console.log(err)
           // window.rsqadmg.exec('hideLoader')
            if (err.code === 400320) {
              that.error = true
              that.$router.push('/pub/check-failure?from=plan')
            } else if (err.code === 400318) {
              that.$router.push('/pub/noPermission')
            }
          })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .deleteTask{
    padding-bottom: 2rem;
    background-color: #f6f6f6;
  }
  .remindColor{
    color: #A5A5A5;
  }
  .contentColor{
    color: #333333
  }
  .sche{
    font-size:0.586rem;
    color:#55A8FD;
    position: absolute;
    top: 50%;
    margin-top: -0.29rem;
    left:0;
  }
  .time-border{
    border-bottom: 1px solid #E0E0E0;
  }
  input::-webkit-input-placeholder { /* WebKit browsers */
    font-family: STHeitiSC-Light;
    font-size: 15px;
    color: #A3A3A3;
    letter-spacing: 0;
  }
  .content{
    background-color: white;
  }
  .desp{
    margin-bottom: 10px;
    padding-top:0.193rem ;
    padding-bottom: 0.293rem;
    padding-right: 0.3rem;
    line-height: 0.586rem;
    font-family: PingFangSC-Regular;
    font-size: 0.373rem;
    letter-spacing: 0;
    background-color: white;
    min-height:0.586rem;
  }
  .inbox-padding{
    padding-left: 0.3rem;
  }
  .sche-padding{
    padding-left: 1.1rem;
  }
  input{
    line-height: 0.933rem;
    width:6.8rem;
  }
  .bottom{
    height: 46px;
    display: flex;
    align-items: center;
    background-color: white;
    position: fixed;
    bottom: 0;
    left:0;
    right: 0;
    justify-content: center;
    width:100%;
    border-top:1px solid #DADADA ;
    background-color: #FDFDFF ;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #4A4A4A;
    letter-spacing: 0;
    text-align: center;
  }
  .bot{
    padding-left: 2%;
    width:8.6rem;
    height:0.945rem ;
    border:1px solid #E0E0E0 ;
    border-radius: 4px;
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
    right:0.55rem;
    border: 1px solid #dfdfdf;
    background-color: #fdfdfd;
    box-shadow: #dfdfdf 0 0 0 0 inset;
    border-radius: 20px;
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
  .itm-group{
    margin-top: 10px;
    position: relative;
    // border-top: 0.5px solid #d4d4d4;
  }
  .itm-group:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 999;
  }
  .talk-png{
    width: 17px;
    height: 17px;
    margin-right: 9.3px;
    margin-top: 3px;
  }
  .sub-todo{
    margin-top: 20px;
  }
</style>
