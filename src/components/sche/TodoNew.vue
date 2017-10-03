<template>
  <div class="router-view">
    <div class="itm-edt z-index-xs">
      <div class="content">
        <div class="itm-edt-fields" style="padding-bottom: 80px;">
          <div class="itm-group">
            <r-input-title
              :is-checkable="false"
              :item-title="editItem.pTitle"
              @text-change="saveTitle"
            ></r-input-title>
          </div>
          <div class="itm-group itm--edit-todo" :class="{'is-hidden': !isShowNote}">
            <!--<slot name="slotNote"></slot>-->
          </div>
          <div class="itm-group itm--edit-todo">
            <!--<slot name="slotContainer"></slot>-->
            <div class="firstGroup">
              <r-input-date
                :item="editItem"
                :sep="'/'"
              ></r-input-date>
              <r-input-time
                :item-clock="editItem.clock"
              ></r-input-time>
            </div>
            <div class="secondGroup">
              <r-input-member
                :is-native="true"
                :index-title="'执行人'"
                :select-title="'请选择成员'"
                :user-rsq-ids="[]"
                :selected-rsq-ids="joinUserRsqIds"
                :disabled-rsq-ids="[]"
                @member-changed="saveMember"
              ></r-input-member>
              <div class="ding">
                <div class="bottom">
                  <p class="">DING</p>
                  <p class="message">通过钉钉消息,短信或者电话提醒参与人</p>
                </div>
                <v-touch @tap="toggleAllDay">
                  <input class="mui-switch" type="checkbox">
                </v-touch>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .firstGroup{
    margin-top:10px;
  }
  .secondGroup{
    margin-top:10px;
    border-top: 1px solid #E0E0E0;
    border-bottom: 1px solid #E0E0E0;
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
  import InputTime from 'com/pub/InputTime'
  import dateUtil from 'ut/dateUtil'
  import jsUtil from 'ut/jsUtil'
  export default {
    data () {
      return {
        editItem: {
          isChecked: false,
          isAllDay: true
        },
        joinUserRsqIds: [],
        isShowNote: false
      }
    },
    computed: {
      currentTodo () {
        return this.$store.state.todo.currentTodo // 这里面有东西吗
      },
      currentDate () {
        return this.$store.state.schedule.strCurrentDate
      },
      numCurrentDate () {
        return dateUtil.dateText2Num(this.currentDate)
      },
      isInbox () {
        //  所有日期属性均为date，判断当前新建的item为收纳箱任务
        return (!this.editItem.dates) && (!this.editItem.startDate) && (!this.editItem.endDate)
      },
      loginUser () {
        return this.$store.getters.loginUser || {}
      },
      userId () {
        return this.loginUser.authUser.userId ? this.loginUser.authUser.userId : 'dingtalkupload'
      },
      corpId () {
        return this.loginUser.authUser.corpId ? this.loginUser.authUser.corpId : 'dingtalkupload'
      }
    },
    components: {
      'r-input-title': InputTitleText,
      'r-input-date': InputDate,
      'r-input-time': InputTime,
      'r-input-member': InputMember
    },
    beforeRouteEnter (to, from, next) {
      next()
      // beforeRouteEnter中不能获取到this，因为this还没有创建，只能通过next获取
    },
    methods: {
      empty () {},
      toggleAllDay (e) {
        this.editItem.isChecked = !this.editItem.isChecked
      },
      /**
       * 初始化数据，从state的currentTodo复制到local的editItem
       */
      initData () {
        jsUtil.extendObject(this.editItem, this.currentTodo)
        var strDate = dateUtil.dateNum2Text(this.numCurrentDate, '/')
        this.editItem.startDate = this.editItem.startDate || strDate
        this.editItem.endDate = this.editItem.endDate || strDate
//        this.editItem.joinUserRsqIds.push(this.userId)
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
        this.joinUserRsqIds = idArray
        var ids = idArray.join(',')
        this.editItem.receiverIds = ids
        this.$store.commit('TD_TODO_UPDATED', {todo: {receiverIds: ids}})
      },
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
        window.rsqadmg.execute('showLoader', {text: '创建中...'})
        this.$store.dispatch('submitCreateTodoItem', {newItem: this.currentTodo, todoType: 'schedule'})
          .then((item) => {
            window.rsqadmg.exec('hideLoader')
            window.rsqadmg.execute('toast', {message: '创建成功'})

            if (this.editItem.isChecked) {
              var IDArrays = item.receiverIds.split(',')
              var empIDArray = []
              this.$store.dispatch('fetchUseridFromRsqid', {corpId: this.corpId, idArray: IDArrays})
                .then(idMap => {
                  for (var i = 0; i < IDArrays.length; i++) {
                    empIDArray.push(idMap[IDArrays[i]].emplId)
                  }
                  var time = new Date()
                  var year = time.getFullYear()
                  var month = time.getMonth() + 1
                  if (month < 10) {
                    month = '0' + month
                  }
                  var day = time.getDate()
                  if (day < 10) {
                    day = '0' + day
                  }
                  var hour = time.getHours()
                  if (hour < 10) {
                    hour = '0' + hour
                  }
                  var minute = time.getMinutes()
                  if (minute < 10) {
                    minute = '0' + minute
                  }
                  var standardTime = year + '-' + month + '-' + day + '' + hour + ':' + minute
                  window.dd.biz.ding.post({
                    users: empIDArray, // 用户列表，工号
                    corpId: this.corpId, // 企业id
                    type: 2, // 钉类型 1：image  2：link
                    alertType: 2,
                    alertDate: {'format': 'yyyy-MM-dd HH:mm', 'value': standardTime},
                    attachment: {
                      title: '',
                      url: '',
                      image: '',
                      text: ''
                    },
                    text: item.pTitle, // 消息
                    onSuccess: function () {
                      that.$router.replace(window.history.back())
                    },
                    onFail: function () {}
                  })
                })
            } else {
              this.$router.replace(window.history.back())
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
        btns: [{key: 'submitTodo', name: '完成'}],
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
    }
  }
</script>
