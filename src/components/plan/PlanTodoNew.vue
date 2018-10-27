<template>
  <!--新建计划任务的页面-->
  <div class="router-view">
    <div class="itm-edt z-index-xs fix-input-new">
      <div class="content">
        <div
          class="itm-edt-fields"
          style="padding-bottom: 80px;">
          <div class="itm-group input-title">
            <r-input-title
              id="fix-input"
              :item-title="editItem.name"
              @text-change="saveTitle"/>
          </div>
          <div class="itm-group itm--edit-todo">
            <div class="common-field input-date-backgrand">
              <i class="icon2-schedule sche"/>
              <r-input-date
                :item="editItem"
                :sep="'/'"
                :edit-time="true"
                :has-left-space="true"
                :todo-type="'plan'"/>
            </div>
            <div class="secondGroup">
              <div class="common-field">
                <i class="icon2-member sche"/>
                <r-input-member
                  :has-left-space="true"
                  :is-native="false"
                  :index-title="'执行人'"
                  :select-title="'请选择成员'"
                  :user-rsq-ids="planMember"
                  :selected-rsq-ids="joinUserRsqIds"
                  :creater-rsq-ids="[]"
                  :disabled-rsq-ids="[]"
                  @member-changed="saveMember"/>
              </div>
            </div>
            <div class="btn-group">
              <div class="btn-wrap">
                <v-touch
                  tag="a"
                  class="weui-btn weui-btn_primary"
                  href="javascript:;"
                  @tap="submitTodo">
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
  import InputTitleText from 'com/pub/InputTitleText'
  import InputDate from 'com/pub/PlanNewDate'
  import InputMember from 'com/pub/InputMember'
  import InputTime from 'com/pub/InputTime'
  import dateUtil from 'ut/dateUtil'
  import jsUtil from 'ut/jsUtil'

  export default {
    name: 'PlanTodoNew',
    components: {
      'r-input-title': InputTitleText,
      'r-input-date': InputDate,
      'r-input-time': InputTime,
      'r-input-member': InputMember
    },
    data () {
      return {
        editItem: {
          isChecked: false,
          isAllDay: true
        },
        joinUserRsqIds: []
      }
    },
    computed: {
      planMember () {
        var that = this
        var arr = that.currentPlan.userRoles.map(function (o) {
          return o.userId
        })
        console.log(arr)
        return arr
      },
      currentPlan () {
        return this.$store.state.currentPlan
      },
      createdId () {
        return [this.currentPlan.creatorId]
      },
      currentKanbanItem () {
        return this.$store.state.plan.currentKanbanItem
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
      kanbanCardId () {
        return this.$store.state.kanbanCardId
      },
      cardItemLength () {
        return this.$store.state.cardItemLength
      }
    },
    created () {
      window.rsqadmg.exec('setTitle', {title: '新建任务'})
      this.initData()
    },
    mounted () {
      this.joinUserRsqIds = [this.$store.state.loginUser.rsqUser.id]
      if (this.editItem.joinUser) {
        var idArray = this.editItem.joinUser.split(',')
        this.joinUserRsqIds = []
        for (var i = 0; i < idArray.length; i++) {
          this.joinUserRsqIds.push(idArray[i])
        }
      }
    },
    methods: {
      /**
       * 初始化数据，从state的currentKanbanItem复制到local的editItem
       */
      initData () {
        jsUtil.extendObject(this.editItem, this.currentKanbanItem)
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
        this.editItem.name = newTitle
        this.$store.commit('PLAN_CURRENT_KANBAN_ITEM_UPDATE', {kanbanItem: {name: newTitle}})
      },
      saveMember (idArray) {
        window.rsqadmg.exec('setTitle', {title: '新建任务'})
        this.joinUserRsqIds = idArray
        var ids = idArray.join(',')
        this.editItem.joinUser = ids
        this.$store.commit('PLAN_CURRENT_KANBAN_ITEM_UPDATE', {kanbanItem: {joinUser: ids}})
//        this.editItem.joinUser = idArray
      },
      /**
       * 将local的对象保存到state的变量中
       */
      saveTodoState () {
        this.$store.commit('PLAN_CURRENT_KANBAN_ITEM_UPDATE', {kanbanItem: this.editItem})
      },
      submitTodo () {
        if (!this.editItem.name || /^\s+$/.test(this.editItem.name)) {
          return window.rsqadmg.execute('alert', {message: '请填写任务标题'})
        }

        this.saveTodoState()
        var that = this
        var startDate = this.currentKanbanItem.startDate ? this.currentKanbanItem.startDate.split('/').join('') : null
        var endDate = this.currentKanbanItem.endDate ? this.currentKanbanItem.endDate.split('/').join('') : null
        var params = {
          name: this.currentKanbanItem.name,
          kanbanCard: this.kanbanCardId,
          displayOrder: 65535 - this.cardItemLength,
          joinUser: this.joinUserRsqIds.join(','),
          dates: this.currentKanbanItem.dates,
          startDate: startDate,
          endDate: endDate,
          isWeb: true
        }
        this.$store.dispatch('createKanbanItem', params)
          .then((res) => {
            window.rsqadmg.execute('toast', {message: '创建成功'})
            // console.log(this.currentKanbanItem)
            // var name = that.$store.getters.loginUser.authUser.name
            // var url = window.location.href.split('#')
            // var datas = {
            //   corpId: that.$store.getters.loginUser.authUser.corpId,
            //   agentid: that.$store.getters.loginUser.authUser.corpId,
            //   title: name + ' 创建了一条任务',
            //   url: url[0] + '#' + '/plan/todo/' + res.id,
            //   description: that.currentKanbanItem.name,
            //   receiverIds: that.currentKanbanItem.joinUser
            // }
            // console.log(datas)
            // this.$store.dispatch('qywxSendMessage', datas)
            that.$router.go(-1)
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
    margin-top:10px;
    border-top: 1px solid #E0E0E0;

    // border-bottom: 1px solid #E0E0E0;
  }
  .secondGroup{
    background-color: #fff;
    position: relative;
    // margin-top:10px;
    // border-top: 0.5px solid #d4d4d4;
    // border-bottom: 0.5px solid #d4d4d4;
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
    z-index: 999;
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
  .sche{
   font-size: 0.586rem;
    color: #55A8FD;
    position: absolute;
    top: 50%;
    margin-top: -0.29rem;
    left: 15px;
    z-index: 1000;
  }
  .input-date-backgrand{
    margin-top: 10px;
    background-color: #fff  !important;
  }
  .input-date-backgrand:before{
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
</style>
