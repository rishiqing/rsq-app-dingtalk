<template>
  <!--新建日程任务的页面-->
  <div class="router-view">
    <div class="itm-edt z-index-xs">
      <div class="content">
        <div
          class="itm-edt-fields"
          style="padding-bottom: 80px;">
          <div class="itm-group input-title">
            <textarea
              v-model="inputTitle"
              type="text"
              class="add-title"
              placeholder="请输入任务标题"
              @input="inputNew"/>
          </div>
          <div class="itm-group itm--edit-todo fix-create">
            <div class="firstGroup">
              <div class="common-field">
                <i class="icon2-schedule sche"/>
                <r-input-date
                  :item="editItem"
                  :sep="'/'"
                  :has-left-space="true"/>
                <i class="icon2-arrow-right-small arrow"/>
              </div>
            </div>
            <div class="secondGroup">
              <div class="common-field">
                <i class="icon2-member sche"/>
                <r-input-member
                  :has-left-space="true"
                  :is-native="false"
                  :index-title="'执行人'"
                  :select-title="'请选择成员'"
                  :user-rsq-ids="idArray"
                  :selected-rsq-ids="joinUserRsqIds"
                  :creater-rsq-ids="[]"
                  :disabled-rsq-ids="[]"
                  :single-select="true"
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
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import SubNewInputDate from 'com/pub/SubNewInputDate'
  import InputMember from 'com/pub/InputMember'
  import dateUtil from 'ut/dateUtil'
  import jsUtil from 'ut/jsUtil'

  export default {
    name: 'SubTodoNew',
    components: {
      'r-input-date': SubNewInputDate,
      'r-input-member': InputMember
    },
    data () {
      return {
        editItem: {
          isChecked: false,
          isAllDay: true
        },
        sub: null,
        joinUserRsqIds: [],
        inputTitle: '',
        idArray: []
      }
    },
    computed: {
      currentTodo () {
        return this.$store.state.todo.currentTodo
      },
      todoId () {
        return this.$store.state.todo.currentTodo.id
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
      pUserId () {
        return [this.$store.state.todo.currentTodo.pUserId]
      },
      subId () {
        return this.$store.state.subUserId
      },
      realUserRsqIds () {
        return this.$store.state.realStaff.list
      }
    },
    created () {
      window.rsqadmg.exec('setTitle', {title: '新建子任务'})
      this.findId(this.realUserRsqIds)
      this.initData()
      this.inputTitle = this.$store.state.todo.currentSubtodo.title
    },
    mounted () {
      if (this.subId) {
        this.joinUserRsqIds = this.subId
      }
      this.sub = this.$store.state.todo.currentSubtodoDate
    },
    methods: {
      empty () {},
      toggleAllDay (e) {
        this.editItem.isChecked = !this.editItem.isChecked
      },
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
      //  缓存title
      inputNew () {
        this.$store.commit('SYS_SUB_TILTE', {title: this.inputTitle})
      },
      saveMember (idArray) {
        window.rsqadmg.exec('setTitle', {title: '新建子任务'})
        this.joinUserRsqIds = idArray
        this.editItem.receiverIds = idArray
        this.$store.commit('PUB_SUB_TODO_USER', {id: idArray})
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
        var that = this
        if (!this.inputTitle || /^\s+$/.test(this.inputTitle)) {
          return window.rsqadmg.execute('alert', {message: '请填写任务标题'})
        }
        // if (!this.sub.datas && !this.sub.startDate) {
        //   return window.rsqadmg.execute('alert', {message: '请选择时间'})
        // }
        // if (this.joinUserRsqIds.length === 0) {
        //   return window.rsqadmg.execute('alert', {message: '请选择执行人'})
        // }
        window.rsqadmg.execute('showLoader', {text: '创建中...'})
        var datas = {}
        datas.name = this.inputTitle
        datas.todoId = this.todoId
        datas.startDate = this.sub.startDate || ''
        datas.endDate = this.sub.endDate || ''
        datas.joinUsers = this.joinUserRsqIds.length === 0 ? '' : this.joinUserRsqIds[0].toString()
        datas.dates = this.sub.dates || ''
        this.$store.dispatch('createSubtodo', datas)
        // this.$store.dispatch('createSubtodo', {name: this.inputTitle, todoId: this.todoId, startDate: this.sub.startDate, endDate: this.sub.endDate, joinUsers: '17267', dates: this.sub.dates})
          .then(() => {
            //  触发标记重复修改
            // this.$store.commit('TD_CURRENT_TODO_REPEAT_EDITED')
            this.inputTitle = ''
            window.rsqadmg.exec('hideLoader')
            window.rsqadmg.execute('toast', {message: '创建成功'})
            // var url = window.location.href.split('#')
            // var name = that.$store.getters.loginUser.authUser.name
            // var datas = {
            //   corpId: that.$store.getters.loginUser.authUser.corpId,
            //   agentid: that.$store.getters.loginUser.authUser.corpId,
            //   title: name + ' 分配给你一条子任务',
            //   url: url[0] + '#' + '/sche/todo/' + that.$store.state.todo.currentTodo.id,
            //   description: that.$store.state.todo.currentTodo.pTitle,
            //   receiverIds: that.joinUserRsqIds.length === 0 ? '' : that.joinUserRsqIds[0].toString()
            // }
            // console.log(datas)
            // that.$store.dispatch('qywxSendMessage', datas)
          })
          .then(function () {
            that.$router.go(-1)
          })
        // this.$router.replace('/sche/todo/' + this.currentTodo.id + '/subtodo/')
      }
    },
    beforeRouteLeave (to, from, next) {
      if (to.name === 'SubTodoEditDate') {
        next()
      } else {
        this.$store.commit('PUB_SUB_TODO_USER', {id: ''})
        next()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .input-title{
    margin-top: 10px;
    // border-top: 0.5px solid #D4D4D4;
    // border-bottom: 0.5px solid #D4D4D4;
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
    z-index: 999999;
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
    // border-top: 0.5px solid #D4D4D4;
  }
  .firstGroup:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 20px s;
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
  .add-title{
    height: 2.5333rem;
    resize:none;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #9B9B9B;
    line-height: 24px;
    width: 100%;
  }
  .add-title::-webkit-input-placeholder { /* WebKit browsers */
    font-size: 17px;
    color: #8C8C8C;
    letter-spacing: 0;
    padding-left: 0.1rem;
  }
  .add-title[type='text']{
    background: #FFFFFF;
    line-height:0.72rem ;
    padding: 15px;
    font-size: 17px;
    border-radius: 0;
    color: #3D3D3D;
  }
  .sche{
   font-size: 0.586rem;
    color: #55A8FD;
    position: absolute;
    top: 47%;
    margin-top: -0.26rem;
    left: 15px;
    z-index: 1000;
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
