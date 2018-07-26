<template>
  <div class="router-view">
    <div class="itm-edt z-index-xs">
      <div class="content">
        <div class="itm-edt-fields">
          <div class="itm-group">
            <r-input-title
              :new-checkable="true"
              :item-title="editItem.pTitle"
              @text-change="saveTitle"
            ></r-input-title>
          </div>
          <div class="itm-group itm--edit-todo" :class="{'is-hidden': !isShowNote}">
          </div>
          <div class="itm-group itm--edit-todo">
            <!--<div class="firstGroup">-->
              <r-input-date
                :item="editItem"
                :sep="'/'"
                :newItem="true"
              ></r-input-date>
            <!--</div>-->
            <!--<div class="secondGroup">-->
              <r-input-member
                :new-time="true"
                :is-native="true"
                :index-title="'执行人'"
                :select-title="'请选择成员'"
                :user-rsq-ids="[]"
                :selected-rsq-ids="joinUserRsqIds"
                :disabled-rsq-ids="[]"
                :moreToShow="moreToShow"
                @member-changed="saveMember"
              ></r-input-member>
                <v-touch @tap="changeState" v-show="!moreToShow">
                  <span class="more">更多设置</span>
                </v-touch>
                <div v-show="moreToShow">
                  <r-input-time
                    :item="editItem"
                    :newItem="true"
                  ></r-input-time>
                  <r-input-priority
                    :new-priority="true"
                  >
                  </r-input-priority>
                  <div class="ding">
                    <div class="bottom">
                      <p class="">DING</p>
                      <p class="message">通过钉钉消息,短信或者电话提醒参与人</p>
                    </div>
                    <v-touch @tap="toggleAllDay">
                      <input class="mui-switch" type="checkbox">
                    </v-touch>
                  </div>
                  <v-touch @tap="SwitchToDesp">
                    <!--<div class="despBorder">-->
                      <div id="noteEditable" contenteditable="true" class="desp editor-style editDesp"
                           name="note" rows="5"
                           :class="{'remindColor':hasDecrip(),'contentColor':!hasDecrip(),'inbox-padding':isInbox,'sche-padding':!isInbox}"
                           placeholder="输入任务描述..." onfocus="this.blur();">
                      </div>
                    <!--</div>-->
                  </v-touch>
                </div>
            </div>
          <!--</div>-->
          <!--<div class="itm-group itm&#45;&#45;edit-todo" @click="submitTodo">提交（测试）</div>-->
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .editDesp{
    border-top: 1px solid #E0E0E0;
    border-bottom: 1px solid #E0E0E0;
  }
  .more{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #48A1FA;
    letter-spacing: 0;
    margin-left: 0.3rem;
    margin-top: -0.1rem;
  }
  .remindColor{
    color: #A5A5A5;
  }
  .contentColor{
    color: #3D3D3D;
  }
  input::-webkit-input-placeholder{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #A5A5A5;
    letter-spacing: -0.36px;
  }
  .desp{
    margin-top: 0.2rem;
    background-color: white;
    height: 4.4rem;
    padding-top: 5px;
    padding-left: 12px;
  }
  .router-view{
    height: 100%;
  }
  .content{
    height: 100%;
  }
  .firstGroup{
    margin-top:10px;
  }
  .secondGroup{
    margin-top:10px;
    /*border-top: 1px solid #E0E0E0;*/
    /*border-bottom: 1px solid #E0E0E0;*/
  }
  p{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
  }
  .bottom {
    height: 2rem;
    display: inline-block;
    padding-left: 11px;
    line-height: 0.1rem;
    position: relative;
    margin-top: 0.7rem;
  }
  .ding{
    height:2rem;
    line-height: 1rem;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
    position:relative;
    background-color: white;
    margin-top: 0.2rem;
    border-bottom: 1px solid #E0E0E0;
    border-top: 1px solid #E0E0E0;
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
    right:0.3rem;
    border: 1px solid #dfdfdf;
    /*background-color: #fdfdfd;*/
    background: #E3E3E3;
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
  import moment from 'moment'
  import InputTitleText from 'com/pub/InputTitleText'
  import InputDate from 'com/pub/InputDate'
  import InputMember from 'com/pub/InputMember'
  import InputTime from 'com/pub/InputTime'
  import dateUtil from 'ut/dateUtil'
  import jsUtil from 'ut/jsUtil'
  import InputPriority from 'com/pub/InputPriority'
  export default {
    data () {
      return {
        editItem: {
          isChecked: false,
          isAllDay: true
//          receiverIds: []
        },
        joinUserRsqIds: [],
        isShowNote: false,
        flag: 1
//        moreToShow: false
      }
    },
    computed: {
      repeat () {
        return this.$store.state.repeat
      },
      moreToShow () {
        return this.$store.state.moreToShow
      },
      currentTodo () {
        return this.$store.state.todo.currentTodo
      },
      isInbox () {
        //  所有日期属性均为date，判断当前新建的item为收纳箱任务
        return this.editItem.pContainer === 'inbox'
      },
      loginUser () {
        return this.$store.getters.loginUser || {}
      },
      userId () {
        return this.loginUser.authUser.userId ? this.loginUser.authUser.userId : 'dingtalkupload'
      },
      corpId () {
        return this.loginUser.authUser.corpId ? this.loginUser.authUser.corpId : 'dingtalkupload'
      },
      priority () {
        return this.$store.state.priority
      },
      pNote () {
        return this.$store.state.todo.currentTodo.pNote
      }
    },
    components: {
      'r-input-title': InputTitleText,
      'r-input-date': InputDate,
      'r-input-time': InputTime,
      'r-input-member': InputMember,
      'r-input-priority': InputPriority
    },
    methods: {
      changeState () {
        this.$store.commit('SHOW_MORE', {'showState': true})
      },
      hasDecrip () {
        var description = document.getElementById('noteEditable')
        if (description) {
          return description.innerText === '输入任务描述'
        }
      },
      SwitchToDesp () {
//        if (!this.checkEdit()) {
//          window.rsqadmg.execute('toast', {message: '过去的任务不能编辑'})
//          return
//        }
        this.$router.push('/pub/desp')
      },
      empty () {},
      toggleAllDay (e) {
        this.editItem.isChecked = !this.editItem.isChecked
      },
      /**
       * 初始化数据，从state的currentTodo复制到local的editItem
       */
      initData () {
//        console.log('this.currentTodo是' + JSON.stringify(this.currentTodo))
//        console.log('this.JOINuserid' + [this.editItem.receiverIds])
        jsUtil.extendObject(this.editItem, this.currentTodo)
//        console.log('this.edititem' + JSON.stringify(this.editItem))
//        this.editItem.receiverIds = [this.editItem.receiverIds]
      },
      /**
       * 从startDate endDate dates三个字段中转换成用户前台显示的date结构
       */
      clearRepeat () {
        this.repeat.repeatBaseTime = []
        this.repeat.repeatType = ''
        this.$store.state.repeatMonth = []
        this.$store.state.repeatWeek = []
      },
      getPlanedTime () {
        var ei = this.editItem
        var result = dateUtil.backend2frontend({dates: ei.dates, startDate: ei.startDate, endDate: ei.endDate})
        return (result && result.dateResult) ? result.dateResult[0] : null
      },
      saveTitle (newTitle) {
        this.editItem.pTitle = newTitle
        this.$store.commit('TD_TODO_UPDATED', {todo: {pTitle: newTitle}})
      },
      saveMember (idArray) {
        this.joinUserRsqIds = idArray
        var ids = idArray.join(',')
        this.editItem.receiverIds = ids
//        console.log(this.editItem.receiverIds)
//        console.log('此时id是' + this.joinUserRsqIds)
        this.$store.commit('TD_TODO_UPDATED', {todo: {receiverIds: ids}})
//        this.editItem.receiverIds = idArray
      }, // 注意这里没有和后台打交道，在提交新建的时候才打交道
      /**
       * 将local的对象保存到state的变量中
       */
      saveTodoState () {
        this.$store.commit('TD_CURRENT_TODO_UPDATE', {item: this.editItem})
      },
      submitTodo () {
        if (!this.editItem.pTitle) {
          return window.rsqadmg.execute('alert', {message: '请填写任务名称'})
        }
        if (!this.isInbox) {
          var planTime = this.getPlanedTime()
          if (!planTime) {
            return window.rsqadmg.execute('alert', {message: '请选择任务日期'})
          }
          //  坑爹啊。。。格式不统一，需要做额外的hack
          this.editItem.pPlanedTime = dateUtil.dateNum2Text(planTime, '-') + ' 00:00:00'
          this.editItem.createTaskDate = dateUtil.dateNum2Text(planTime)
        }

        this.saveTodoState()
        var that = this
        var todoType = this.isInbox ? 'inbox' : 'schedule'
        window.rsqadmg.execute('showLoader', {text: '创建中...'})
        //  在有提醒的情况下返回值中居然不包括clock.alert的数据，需要前端组合传入
        var clockAlert = JSON.parse(JSON.stringify(this.currentTodo.clock.alert || null))
        if (this.priority === '重要且紧急') {
          var pContainer = 'IE'
        } else if (this.priority === '重要不紧急') {
          pContainer = 'IU'
        } else if (this.priority === '紧急不重要') {
          pContainer = 'UE'
        } else if (this.priority === '不重要不紧急') {
          pContainer = 'UU'
        }
        var pNote = document.getElementById('noteEditable').innerText
        if (pNote === '添加任务描述') {
          pNote = ''
        }
        this.flag = 0
        this.$store.dispatch('submitCreateTodoItem', {newItem: this.currentTodo, todoType: todoType, pContainer: pContainer, pNote: pNote})
        .then(item => {
          if (this.currentTodo.clock && this.currentTodo.clock.startTime) {
            item.clock.alert = clockAlert
            return this.$store.dispatch('handleRemind', {item})
          } else {
            return item
          }
        })
        .then(item => {
          window.rsqadmg.exec('hideLoader')
          window.rsqadmg.execute('toast', {message: '创建成功'})
          this.repeat['repeatType'] = null
          this.repeat['repeatBaseTime'] = []
          this.$store.state.repeatMonth.splice(0, this.$store.state.repeatMonth.length)
          this.$store.state.repeatWeek.splice(0, this.$store.state.repeatWeek.length)
          if (item.receiverIds) {
//            debugger
            var time = jsUtil.SendConversationTime(item)
            var date = jsUtil.SendConversationDate(item)
            var url = window.location.href.split('#')
            var note = this.editItem.pNote
            var newnote = note.replace(/<\/?.+?>/g, '\n').replace(/(\n)+/g, '\n')
            var data = {
              msgtype: 'oa',
              msgcontent: {
                message_url: url[0] + '#' + '/todo/' + item.id,
                head: {
                  text: '日事清',
                  bgcolor: 'FF55A8FD'
                },
                body: {
                  title: item.pTitle,
                  form: [
                    {key: '日期：', value: date},
                    {key: '时间：', value: time}
                  ],
                  content: newnote,
                  author: that.loginUser.authUser.name// 这里要向后台要值
                }
              }
            }
  //            var sendID = item.senderTodo.pUserId
            var sendID = item.pUserId
            console.log(sendID)
//              if (item.receiverIds) {
            var IDArrays = item.receiverIds.split(',')
//              } else {
//                IDArrays = [sendID]
//              }
  //            for (var i = 0; i < IDArrays.length; i++) {
  //              if (sendID === parseInt(IDArrays[i])) {
  //                IDArrays.splice(i, 1)
  //                break
  //              }
  //            }
            var empIDArray = []
  //              console.log(IDArrays)
            this.$store.dispatch('fetchUseridFromRsqid', {corpId: that.loginUser.authUser.corpId, idArray: IDArrays})
              .then(idMap => {
                for (var i = 0; i < IDArrays.length; i++) {
                  empIDArray.push(idMap[IDArrays[i]].emplId)
                }
  //                  console.log(JSON.stringify(empIDArray))
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
          if (this.editItem.isChecked) {
//              debugger
            if (item.receiverIds) {
              IDArrays = item.receiverIds.split(',')
            } else {
              IDArrays = [item.pUserId]
            }
//              console.log(IDArrays)
            empIDArray = []
            this.$store.dispatch('fetchUseridFromRsqid', {corpId: this.corpId, idArray: IDArrays})
              .then(idMap => {
                for (var i = 0; i < IDArrays.length; i++) {
                  empIDArray.push(idMap[IDArrays[i]].emplId)
                }
                var standardTime = moment().format('YYYY-MM-DD HH:mm')
                window.rsqadmg.exec('notify', {
                  userIds: empIDArray,
                  corpId: that.corpId,
                  alertTime: standardTime,
                  title: item.pTitle,
                  success: () => {
                    console.log('发送成功')
//                      window.history.back()
//                      that.$router.replace('/sche')// 这里跳到日程列表页面
                  }
                })
                that.$router.replace('/sche')
              })
          } else {
//              window.history.back()
            this.$router.replace('/sche')
          }
        })
      }
    },
    created () {
      this.initData()
      window.rsqadmg.execute('setTitle', {title: '新建任务'})
      var btnParams
      var that = this
      btnParams = {
        btns: [{key: 'submitTodo', name: '创建'}],
        success: function (res) {
          if (res.key === 'submitTodo') {
            that.submitTodo()
          }
        }
      }
      window.rsqadmg.execute('setOptionButtons', btnParams)
    },
    mounted () {
      this.joinUserRsqIds = [this.$store.state.loginUser.rsqUser.id]
      if (this.editItem.receiverIds !== null) {
        var idArray = this.editItem.receiverIds.split(',')
        this.joinUserRsqIds = []
        for (var i = 0; i < idArray.length; i++) {
          this.joinUserRsqIds.push(idArray[i])
        }
      }
      var noteElement = document.getElementById('noteEditable')
      if (this.pNote) {
        noteElement.innerHTML = this.pNote
      } else {
        noteElement.innerHTML = '输入任务描述'
      }
//      console.log(noteElement.innerHTML)
//      console.log(this.joinUserRsqIds)
//      console.log('新建页面的url' + window.location.href)
    },
    beforeRouteLeave (to, from, next) {
      var that = this
//      console.log('要离开了' + to.name)
      //  判断是否需要用户选择“仅修改当前日程”、“修改当前以及以后日程”、“修改所有重复日程”
      if (to.name === 'sche' && this.flag === 1) {
        var noteElement = document.getElementById('noteEditable')
        var arr = ['放弃草稿']
//        console.log(this.editItem.pTitle + ':' + noteElement.innerText)
//        console.log(this.editItem.pTitle || (noteElement.innerText !== '输入任务描述'))
        if (this.editItem.pTitle || (noteElement.innerText !== '输入任务描述')) {
          window.rsqadmg.exec('actionsheet', {
            buttonArray: arr,
            success: function (res) {
              switch (res.buttonIndex) {
                case 0:
                  next()
                  that.$store.commit('SHOW_MORE', {'showState': false})
                  break
                default:
                  break
              }
            }
          })
        }
      } else {
        console.log('直接返回')
        return next()
      }
    },
    beforeRouteEnter (to, from, next) {
      if (from.name === 'sche') {
        next(vm => {
          vm.$store.commit('SET_PRIORITY', {'showState': '重要且紧急'})
        })
      } else {
        next()
      }
    }
  }
</script>
