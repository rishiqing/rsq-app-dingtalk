<template>
  <div class="router-view">
    <div class="itm-edt z-index-xs">
      <div class="content">
        <div class="itm-edt-fields" >
          <div class="itm-group itm--edit-todo">
            <r-input-title
              ref="title"
              :textarea="true"
              :is-checkable="!isInbox"
              :item-title="editItem.pTitle"
              :item-checked="editItem.pIsDone"
              :disabled="!checkEdit()"
              @text-blur="saveTitle"
              @click-checkout="finishChecked"
            ></r-input-title>
          </div>
          <v-touch @tap="SwitchToDesp">
            <div id="noteEditable" contenteditable="true" class="desp editor-style"
                 name="note" rows="5"
                 placeholder="添加任务描述..." onfocus="this.blur();">
              添加任务描述...
            </div>
          </v-touch>
          <div class="itm--edit-todo ">
            <div class="edit-padding-left">
              <div class="first-date">
                <i class="icon2-schedule sche"></i>
                <r-input-date
                  :disabled="!checkEdit()"
                  :item="editItem"
                  :sep="'/'"
                  :edit-time="true"
                ></r-input-date>
              </div>
              <div class="first-date" v-show="!isInbox">
                <div class="time-border">
                  <i class="icon2-alarm sche"></i>
                  <r-input-time
                    :disabled="!checkEdit()"
                    :item="editItem"
                    :edit-time="true"
                    v-if="editItem.pContainer !== 'inbox'"
                  ></r-input-time>
                </div>
              </div>
              <div class="first-date">
                <i class="icon2-member sche"></i>
                <r-input-member
                  :disabled="!checkEdit()"
                  :edit-time="true"
                  :is-native="true"
                  :index-title="'执行人'"
                  :select-title="'请选择成员'"
                  :user-rsq-ids="[]"
                  :selected-rsq-ids="joinUserRsqIds"
                  :disabled-rsq-ids="[]"
                  @member-changed="saveMember"
                ></r-input-member>
              </div>
              <div class="first-date">
                <i class="icon2-subplan-web sche"></i>
                <r-input-sub-todo
                  :disabled="!checkEdit()"
                  :item="currentTodo"
                  :edit-time="true"
                ></r-input-sub-todo>
              </div>
            </div>
            <r-comment-list
              :disabled="!checkEdit()"
              :items="todoComments"
              ></r-comment-list>
            <div class="bottom">
              <v-touch @tap="SwitchToComent">
                <input type="text" class="bot" placeholder="输入讨论内容或发送文件" onfocus="this.blur();">
              </v-touch>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .first-date{
    position: relative;
    padding-left: 1.1rem;
  }
  .sche{
    font-size:0.586rem;
    color:#55A8FD;
    position: absolute;
    top: 50%;
    margin-top: -0.29rem;
    left:0.3rem
  }
  .edit-padding-left{
    background-color: white;
  }
  .time-border{
    border-bottom: 1px solid #E0E0E0;
    /*position: relative;*/
    /*padding-left: 1.1rem;*/
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
    /*border-bottom: 1px solid #E0E0E0;*/
    margin-bottom: 10px;
    padding-left: 3%;
    line-height: 0.8rem;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #999999;
    letter-spacing: 0;
    background-color: white;
    min-height:1.12rem;
    /*display: flex;*/
    /*align-items: center;*/
  }
  input{
    line-height: 0.933rem;
    width:6.8rem;
  }
  .bottom{
    height: 1.333rem;
    display: flex;
    align-items: center;
    background-color: white;
    position: fixed;
    bottom: 0;
    justify-content: center;
    width:100%;
    border-top:1px solid #DADADA ;
    background-color: #FDFDFF ;
  }
  .bot{
    padding-left: 2%;
    width:9.2rem;
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
  import { Promise } from 'es6-promise'
  import moment from 'moment'
  import InputTitleText from 'com/pub/InputTitleText'
  import InputDate from 'com/pub/InputDate'
  import InputTime from 'com/pub/InputTime'
  import InputMember from 'com/pub/InputMember'
  import InputSubTodo from 'com/pub/InputSubTodo'
  import SendConversation from 'com/demo/SendConversation'
  import util from 'ut/jsUtil'
  import dateUtil from 'ut/dateUtil'
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
      dynamicId () {
        return this.$route.params.todoId
      },
      todoComments () {
        return this.currentTodo.comments || []
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
      userId () {
        return this.loginUser.authUser.userId
      },
      corpId () {
        return this.loginUser.authUser.corpId
      },
      currentNumDate () {
        return this.$store.getters.defaultNumTaskDate
      },
      dates () {
        var dates = this.$store.state.todo.currentTodo.dates
        var datesArray = dates.split(',')
        var newArray = []
        for (var i = 0; i < datesArray.length; i++) {
          var monthOfday = datesArray.substr(4, 5) + '月' + datesArray.substr(6, 7) + '日 '
          newArray.push(monthOfday)
        }
        return newArray
      },
      fileCount () {
      },
      time () {
        var dates = this.$store.state.todo.currentTodo.clock
        return dates.startTime + '-' + dates.endTime
      }
    },
    components: {
      'r-input-title': InputTitleText,
      'r-input-date': InputDate,
      'r-input-time': InputTime,
      'r-input-member': InputMember,
      'r-input-sub-todo': InputSubTodo,
//      'r-input-note': InputNoteText,
      'r-comment-list': ComentList,
      'r-send-conversation': SendConversation
    },
    methods: {
      //  过去的日程不允许更新日程详情
      checkEdit () {
        var enabled = this.currentNumDate + 24 * 3600 * 1000 > new Date().getTime()
        return enabled
      },
      initData () {
        window.rsqadmg.exec('showLoader')
        return this.$store.dispatch('getTodo', {todo: {id: this.dynamicId}})
            .then(item => {
              util.extendObject(this.editItem, item)
              var noteElement = document.getElementById('noteEditable')
              if (this.pNote !== null) {
                noteElement.innerHTML = this.pNote
              }
              var joinUserArray = util.getMapValuePropArray(this.editItem.receiverUser, 'joinUser')
              this.joinUserRsqIds = joinUserArray.map(obj => {
                return obj['id'] + ''
              })
            })
          .then(() => {
            this.fetchCommentIds()
            window.rsqadmg.exec('hideLoader')
          })
          .catch(err => {
            window.rsqadmg.exec('hideLoader')
            if (err.code === 400320) {
              this.$router.push('/pub/CheckFailure')
            } else if (err.code === 400318) {
              this.$router.push('/pub/noPermission')
            }
          })
      },
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
                that.$set(c, 'authorAvatar', user.avatar)
                that.$set(c, 'authorName', 'dingding-' + user.name)
              }
            })
          })
      },
      SwitchToComent () {
        if (!this.checkEdit()) return
        this.$router.push('/pub/coment')
      },
      SwitchToDesp () {
        if (!this.checkEdit()) return
        this.$router.push('/pub/desp')
      },
      saveTitle (newTitle) {
        if (!newTitle) {
          window.rsqadmg.execute('alert', {message: '任务标题不能为空'})
          return Promise.reject()
        }
        if (newTitle !== this.editItem.pTitle) {
//          window.rsqadmg.exec('showLoader', {text: '保存中...'})
          var params = {pTitle: newTitle}
          return this.$store.dispatch('updateTodo', {editItem: params})
            .then(() => {
              this.$store.commit('TD_CURRENT_TODO_REPEAT_EDITED', params)
            })
            .then(() => {
              return this.$store.dispatch('saveTodoAction', {editItem: {idOrContent: newTitle, type: 9}})
            })
            .then(() => {
              this.editItem.pTitle = newTitle
//              this.editItem.pTitle = newTitle
//              window.rsqadmg.exec('hideLoader')
//              window.rsqadmg.execute('toast', {message: '保存成功'})
            })
        } else {
          return Promise.resolve()
        }
      },
      saveMember (idArray) {
        var that = this
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
//          console.log('params的addJoinUsers是' + params.addJoinUsers)
          if (params.addJoinUsers) {
            var date = ''
            if (this.currentTodo.startDate !== null) {
              if (this.currentTodo.startDate === this.currentTodo.endDate) {
                date = this.currentTodo.startDate.substring(5, 7) + '月' + this.currentTodo.startDate.substring(8, 10) + '日'
              } else {
                var start = this.currentTodo.startDate.substring(5, 7) + '月' + this.currentTodo.startDate.substring(8, 10) + '日'
                var end = this.currentTodo.endDate.substring(5, 7) + '月' + this.currentTodo.endDate.substring(8, 10) + '日'
                date = start + '-' + end
              }
            } else if (this.currentTodo.dates !== null) {
              var dateArray = this.currentTodo.dates.split(',')
              console.log(dateArray)
              for (var i = 0; i < dateArray.length; i++) {
                date += dateArray[i].substring(4, 6) + '月' + dateArray[i].substring(6, 8) + '日,'
              }
              if (date.length > 11) {
                date = date.substring(0, 11) + '...'
              }
            }
            console.log(date)
            var time = ''
            if (this.currentTodo.clock !== null) {
              time = this.currentTodo.clock.startTime + '-' + this.currentTodo.clock.endTime
            } else {
              time = '全天'
            }
            var data = {
              msgtype: 'oa',
              msgcontent: {
                message_url: window.location.href,
                head: {
                  text: '日事清',
                  bgcolor: 'FF55A8FD'
                },
                body: {
                  title: that.currentTodo.pTitle,
                  form: [
                    {key: '日期：', value: date},
                    {key: '时间：', value: time}
                  ],
                  content: that.currentTodo.pNote,
                  author: that.loginUser.authUser.name// 这里要向后台要值
                }
              }
            }
            var IDArrays = params.addJoinUsers.split(',')
//            console.log('IDArrays是' + IDArrays)
            var empIDArray = []
            this.$store.dispatch('fetchUseridFromRsqid', {corpId: that.loginUser.authUser.corpId, idArray: IDArrays})
              .then(idMap => {
                for (var i = 0; i < IDArrays.length; i++) {
                  empIDArray.push(idMap[IDArrays[i]].emplId)
                }
//                console.log(empIDArray)
                data['userid_list'] = empIDArray.toString()
                that.$store.dispatch('sendAsyncCorpMessage', {
                  corpId: that.loginUser.authUser.corpId,
                  data: data
                }).then(res => {
                  if (res.errcode !== 0) {
                    alert('发送失败：' + JSON.stringify(res))
                  } else {
                    console.log('发送成功！')
                  }
                })
              })
          }
        })
      },
      finishChecked (status) {
        if (status !== this.editItem.isDone) {
          this.$store.dispatch('updateTodo', {editItem: {pIsDone: status}})
              .then(() => {
//                this.$store.dispatch('saveTodoAction', {editItem: {status: status, type: 5}})
//                  .then(() => {
//                  })
                this.editItem.pIsDone = status
                var str = status ? '任务已完成' : '任务已重启'
                window.rsqadmg.execute('toast', {message: str})
              })
        }
      },
      deleteCurrentTodo (p) {
        return this.$store.dispatch('deleteTodo', p)
      },
      prepareDelete () {
        var that = this
        if (that.currentTodo.isCloseRepeat) {
          window.rsqadmg.exec('confirm', {
            message: '确定要删除此任务？',
            success () {
              window.rsqadmg.execute('showLoader', {text: '删除中...'})
              that.deleteCurrentTodo({todo: that.currentTodo})
                .then(() => {
                  window.rsqadmg.exec('hideLoader')
                  window.rsqadmg.execute('toast', {message: '删除成功'})
                  that.$router.replace(window.history.back())
                })
            }
          })
        } else {
          window.rsqadmg.exec('actionsheet', {
            buttonArray: ['仅删除此任务', '删除此任务及以后的任务', '删除所有的重复任务'],
            success: function (res) {
              window.rsqadmg.execute('showLoader', {text: '删除中...'})
              var promise
              switch (res.buttonIndex) {
                case 0:
                  promise = that.deleteCurrentTodo({todo: that.currentTodo, isRepeat: true, type: 'today'})
                  break
                case 1:
                  promise = that.deleteCurrentTodo({todo: that.currentTodo, isRepeat: true, type: 'after'})
                  break
                case 2:
                  promise = that.deleteCurrentTodo({todo: that.currentTodo, isRepeat: true, type: 'all'})
                  break
                default:
                  break
              }
              promise.then(() => {
                window.rsqadmg.exec('hideLoader')
                window.rsqadmg.execute('toast', {message: '删除成功'})
                that.$router.replace(window.history.back())
              })
            }
          })
        }
      },
      more () {
        var that = this
        var arr = ['发送到聊天', '发送提醒']
        if (this.checkEdit()) {
          arr.push('删除任务')
        }
        window.rsqadmg.exec('actionsheet', {
          buttonArray: arr,
          success: function (res) {
            switch (res.buttonIndex) {
              case 0:
                window.rsqadmg.exec('pickConversation', {
                  corpId: that.corpId,
                  success: function (conv) {
                    var d = dateUtil.repeatDate2Text(that.currentTodo)
                    var clock = that.currentTodo.clock || {}
                    var t = clock.startTime ? clock.startTime + '-' + clock.endTime : '全天'
                    var params = {
                      corpId: that.corpId, // that.loginUser.authUser.corpId,
                      data: {
                        sender: that.userId,
                        cid: conv.cid,
                        msgtype: 'oa',
                        oa: {
                          message_url: window.location.href,
                          head: {
                            text: '日事清',
                            bgcolor: 'FF55A8FD'
                          },
                          body: {
                            title: that.editItem.pTitle,
                            form: [
                              {key: '日期：', value: d},
                              {key: '时间：', value: t}
                            ],
                            content: that.editItem.pNote,
                            author: that.loginUser.authUser.name// 这里要向后台要值
                          }
                        }
                      }
                    }
                    that.$store.dispatch('sendToConversation', params)
                    .then(() => {
                      window.rsqadmg.exec('toast', {message: '发送成功'})
                    })
                  }
                })
                break
              case 1:
                var IDArrays = that.currentTodo.receiverIds === null ? [that.currentTodo.pUserId] : that.currentTodo.receiverIds.split(',')
                var empIDArray = []
                that.$store.dispatch('fetchUseridFromRsqid', {corpId: that.corpId, idArray: IDArrays})
                  .then(idMap => {
                    for (var i = 0; i < IDArrays.length; i++) {
                      empIDArray.push(idMap[IDArrays[i]].emplId)
                    }
                    var standardTime = moment().format('YYYY-MM-DD HH:mm')
                    window.rsqadmg.exec('notify', {
                      userIds: empIDArray,
                      corpId: that.corpId,
                      alertTime: standardTime,
                      title: that.currentTodo.pTitle,
                      success: () => {
                        that.$router.replace(window.history.back())
                      }
                    })
                  })
                break
              case 2:
                that.prepareDelete()
                break
              default:
                break
            }
          }
        })
      },
      updateRepeat (p) {
        return this.$store.dispatch('updateRepeatTodo', p)
      },
      checkIfRepeatEdited (next) {
        //  如果check时发现title有未保存的内容，那么先保存title
        var newValue = this.$refs.title.$refs.titleInput.value
        this.saveTitle(newValue)
          .then(() => {
            var c = this.currentTodo
            var isEdited = this.$store.state.todo.isRepeatFieldEdit
            if (c.pContainer !== 'inbox' && !c.isCloseRepeat && isEdited) {
              var that = this
              window.rsqadmg.exec('actionsheet', {
                buttonArray: ['仅修改此任务', '修改此任务及以后的任务', '修改所有的重复任务'],
                success: function (res) {
                  window.rsqadmg.execute('showLoader', {text: '更新中...'})
                  var promise
                  switch (res.buttonIndex) {
                    case 0:
                      promise = that.updateRepeat({type: 'today'})
                      break
                    case 1:
                      promise = that.updateRepeat({type: 'after'})
                      break
                    case 2:
                      promise = that.updateRepeat({type: 'all'})
                      break
                    default:
                      break
                  }
                  promise.then(() => {
                    window.rsqadmg.exec('hideLoader')
                    window.rsqadmg.execute('toast', {message: '更新成功'})
                    return next()
                  })
                }
              })
            } else {
              return next()
            }
          })
          .catch(() => {
            next(false)
          })
      }
    },
    created () {
      this.initData()
      var that = this
      window.rsqadmg.execute('setTitle', {title: '详情'})
      window.rsqadmg.execute('setOptionButtons', {
        btns: [{key: 'more', name: '更多'}],
        success (res) {
          if (res.key === 'more') {
            that.more()
          }
        }
      })
    },
    mounted () {
      console.log('编辑界面的url是' + window.location.href)
    },
    beforeRouteEnter (to, from, next) {
      next()
    },
    beforeRouteLeave (to, from, next) {
      //  判断是否需要用户选择“仅修改当前日程”、“修改当前以及以后日程”、“修改所有重复日程”
      if (to.name === 'sche') {
        next(false)
        this.checkIfRepeatEdited(next)
      } else {
        return next()
      }
    }
  }
</script>
