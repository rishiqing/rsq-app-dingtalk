<template>
  <!--新建日程任务的页面-->
  <div class="router-view">
    <div class="itm-edt z-index-xs">
      <div class="content">
        <div
          class="itm-edt-fields"
          style="padding-bottom: 80px;">
          <div class="itm-group input-title">
            <r-input-title
              id="fix-input"
              :item-title="editItem.pTitle"
              @text-change="saveTitle"/>
          </div>
          <div
            id="fix-ico"
            class="itm-group itm--edit-todo">
            <div
              id="firstGroup"
              class="firstGroup">
              <div class="common-field">
                <i class="icon2-schedule sche"/>
                <r-input-date
                  :item="editItem"
                  :sep="'/'"
                  :has-left-space="true"/>
                <i class="icon2-arrow-right-small arrow"/>
              </div>
              <div class="common-field">
                <i class="icon2-alarm sche" />
                <r-input-time
                  :item="editItem"
                  :has-left-space="true"/>
              </div>
            </div>
            <div class="secondGroup">
              <div class="common-field">
                <i class="icon2-member sche"/>
                <r-input-member
                  :has-left-space="true"
                  :is-native="false"
                  :index-title="''"
                  :select-title="'请选择成员'"
                  :user-rsq-ids="idArray"
                  :selected-rsq-ids="joinUserRsqIds"
                  :creater-rsq-ids="joinUserRsqIds"
                  :disabled-rsq-ids="joinUserRsqIds"
                  @member-changed="saveMember"/>
              </div>
            </div>
            <div class="btn-group">
              <div class="btn-wrap">
                <v-touch
                  tag="a"
                  class="weui-btn weui-btn_primary"
                  href="javascript:;"
                  @tap="delayCall('submitTodo')">
                  创建
                </v-touch>
              </div>
            </div>
          </div>
          <!--<div class="itm-group itm&#45;&#45;edit-todo" @click="submitTodo">提交（测试）</div>-->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import InputTitleText from 'com/pub/InputTitleText'
  import InputDate from 'com/pub/InputDate'
  import InputMember from 'com/pub/InputMember'
  import InputTime from 'com/pub/InputTime'
  import dateUtil from 'ut/dateUtil'
  import jsUtil from 'ut/jsUtil'

  export default {
    name: 'TodoNew',
    components: {
      'r-input-title': InputTitleText,
      'r-input-date': InputDate,
      'r-input-time': InputTime,
      'r-input-member': InputMember
    },
    data () {
      return {
        editItem: {
          rrule:'',
          isChecked: false,
          isAllDay: true
//          receiverIds: []
        },
        joinUserRsqIds: [],
        idArray: []
      }
    },
    computed: {
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
      realUserRsqIds () {
        return this.$store.state.realStaff.list
      }
    },
    beforeRouteEnter (to, from, next) {
      next()
      // beforeRouteEnter中不能获取到this，因为this还没有创建，只能通过next获取
    },
    created () {
      window.rsqadmg.exec('setTitle', {title: '新建任务'})
      this.findId(this.realUserRsqIds)
      this.initData()
    },
    mounted () {
      window.rsqadmg.exec('setOptionButtons', {hide: true})
      this.joinUserRsqIds = [this.$store.state.loginUser.rsqUser.id]
      // if (this.editItem.receiverIds !== null || this.editItem.receiverIds !== undefined) {
      //   console.log(this.editItem.receiverIds)
      //   var idArray = this.editItem.receiverIds.split(',')
      //   this.joinUserRsqIds = []
      //   for (var i = 0; i < idArray.length; i++) {
      //     this.joinUserRsqIds.push(idArray[i])
      //   }
      // }
    },
    methods: {
      findId (id) {
        var that = this
        for (let i = 0; i < id.length; i++) {
          for (let j = 0; j < id[i].userList.length; j++) {
            that.idArray.push(id[i].userList[j].id)
          }
          if (Array.isArray(id[i].childList)) {
            if (id[i].childList.length !== 0) {
              that.findId(id[i].childList)
            }
          }
        }
      },
      empty () {},
      toggleAllDay (e) {
        this.editItem.isChecked = !this.editItem.isChecked
      },
      /**
       * 初始化数据，从state的currentTodo复制到local的editItem
       */
      initData () {
        jsUtil.extendObject(this.editItem, this.currentTodo)
      },
      /**
       * 从startDate endDate dates三个字段中转换成用户前台显示的date结构
       */
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
        window.rsqadmg.exec('setTitle', {title: '新建任务'})
        // this.joinUserRsqIds = idArray
        var ids = idArray.join(',')
        this.editItem.receiverIds = ids
        this.$store.commit('TD_TODO_UPDATED', {todo: {receiverIds: ids}})
//        this.editItem.receiverIds = idArray
      }, // 注意这里没有和后台打交道，在提交新建的时候才打交道
      /**
       * 将local的对象保存到state的变量中
       */
      saveTodoState () {
        this.$store.commit('TD_CURRENT_TODO_UPDATE', {item: this.editItem})
      },
      delayCall (func) {
        window.setTimeout(() => {
          this[func].apply(this, Array.prototype.slice.call(arguments, 1))
        }, 50)
      },
      submitTodo () {
        if (!this.editItem.pTitle || /^\s+$/.test(this.editItem.pTitle)) {
          return window.rsqadmg.execute('alert', {message: '请填写任务标题'})
        }
        if (!this.isInbox) {
          var planTime = this.getPlanedTime()
          if (!planTime) {
//            return window.rsqadmg.execute('alert', {message: '请选择任务日期'})
          }
          //  坑爹啊。。。格式不统一，需要做额外的hack
          this.editItem.pPlanedTime = dateUtil.dateNum2Text(planTime, '-') + ' 00:00:00'
          this.editItem.createTaskDate = dateUtil.dateNum2Text(planTime)
          //  repeatOverDate传给后台的值和后台发送过来的值格式不一样……好坑
          const overDate = this.editItem.repeatOverDate
          if (overDate) {
            this.editItem.repeatOverDate = dateUtil.dateNum2Text(dateUtil.dateText2Num(overDate))
          }
        }
        this.saveTodoState()
        var todoType = this.isInbox ? 'inbox' : 'schedule'
//        window.rsqadmg.execute('showLoader', {text: '创建中...'})
        //  在有提醒的情况下返回值中居然不包括clock.alert的数据，需要前端组合传入
        var clockAlert = JSON.parse(JSON.stringify(this.currentTodo.clock.alert || null))
        // var that = this
        if (!this.currentTodo.clock.startTime && !this.currentTodo.clock.endtTime) {
          this.currentTodo.clock = {}
        }
        this.$store.dispatch('submitCreateTodoItem', {newItem: this.currentTodo, todoType: todoType})
          .then(item => {
            // if (this.currentTodo.clock && this.currentTodo.clock.startTime && item.clock && item.clock.alert) {
            //   //  如果item.clock.alert存在，说明设置了alert，那么就发送设置的提醒
            //   item.clock.alert = clockAlert
            //   return this.$store.dispatch('handleRemind', {item})
            // } else {
            //   return item
            // }
            return item
          })
          .then(item => {
            window.rsqadmg.execute('toast', {message: '创建成功'})
            this.$store.commit('TD_DATE_HAS_TD_CACHE_DELETE_ALL')
            if (todoType === 'inbox') {
              this.$router.replace('/inbox')
            }
            // if (item.receiverIds) {
              // var name = that.loginUser.authUser.name
              // var url = window.location.href.split('#')
              // var datas = {
              //   corpId: that.loginUser.authUser.corpId,
              //   agentid: this.corpId,
              //   title: name + ' 创建了一条任务',
              //   url: url[0] + '#' + '/sche/todo/' + item.id,
              //   description: item.pTitle,
              //   receiverIds: item.receiverIds
              // }
              // this.$store.dispatch('qywxSendMessage', datas)
//                var note = this.editItem.pNote
//                var newnote = note.replace(/<\/?.+?>/g, '\n').replace(/(\n)+/g, '\n')
            // }
            this.$router.replace('/sche')
          })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .input-title{
    // border-top: 0.5px solid #D4D4D4;
    // border-bottom: 0.5px solid #D4D4D4;
    margin-top: 10px;
    background-color: #fff;
  }
  .input-title:before{
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
  .input-title:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: -1px;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .router-view{
    height: 100%;
    background-color: #f6f6f6;
  }
  .content{
    height: 100%;
  }
  .firstGroup{
    margin-top:20px;
    position: relative;
    // border-top: 0.5px solid #D4D4D4;
    // border-bottom: 0.5px solid #D4D4D4;
  }
  .firstGroup:before{
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
  }
  .firstGroup:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: -1px;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .secondGroup{
    position: relative;
    margin-top:20px;
    // border-top: 0.5px solid #D4D4D4;
    // border-bottom: 0.5px solid #D4D4D4;
  }
  .secondGroup:before{
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
  }
  .secondGroup:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: -1px;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
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
    border: 0.5px solid #D4D4D4;
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
  .common-field{
    padding-left: 15px;
  }
  .sche{
   font-size: 0.586rem;
    color: #55A8FD;
    position: absolute;
    top: 50%;
    margin-top: -0.29rem;
    left: 15px;
    z-index: 1000;
  }
  .common-field .outer-wrap{
    padding-left: 46px;
    position: relative;
  }
  .right-png{
    position: absolute;
    right: 13px;
    top: 40%;
    width: 13px;
    // height: 8px;
  }
  .arrow {
    color: #999999;
    font-size: 21px;
    position: absolute;
    height: 100%;
    line-height: 56px;
    right: 0.2rem;
}
</style>
