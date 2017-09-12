<template>
	<div class="router-view">
		<r-todo-edit
				:is-checkable="true"
				:is-show-note="false"
				transition="right-slide">
			<r-input-title
					slot="slotTitle"
					:is-checkable="false"
          :item-title="editItem.pTitle"
          @text-change="saveTitle"
			></r-input-title>
			<r-input-date
					slot="slotDate"
					:item-start-date="editItem.startDate"
					:item-end-date="editItem.endDate"
					:item-dates="editItem.dates"
					:item-sep="'/'"
          v-if="todoType == 'schedule'"
          @date-changed="saveDate"
			></r-input-date>
      <InputTime
          slot="slotTime">
      </InputTime>
			<r-input-member
					slot="slotMember"
					:is-native="true"
					:index-title="'执行人'"
					:select-title="'请选择成员'"
					:user-rsq-ids="[]"
					:selected-rsq-ids="joinUserRsqIds"
					:disabled-rsq-ids="[]"
					@member-changed="saveMember"
			></r-input-member>

		</r-todo-edit>
	</div>
</template>
<style lang="scss" scoped>
  @import "icomoon2.css";
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
  import PublicEditView from 'com/pub/TodoEditView'
  import InputTitleText from 'com/pub/InputTitleText'
  import InputDate from 'com/pub/InputDate'
  import InputMember from 'com/pub/InputMember'
  import dateUtil from 'ut/dateUtil'
  import moment from 'moment'
  import InputTime from 'com/pub/InputTime'
  export default {
    data () {
      return {
        editItem: {
          pTitle: '',
          dates: null,
          startDate: null,
          endDate: null
        },
        joinUserRsqIds: []
      }
    },
    computed: {
      todoType () {
        return this.$route.params.todoType
      },
      currentDate () {
        return this.$store.state.schedule.strCurrentDate
      },
      isInbox () {
        //  所有日期属性均为date，判断当前新建的item为收纳箱任务
        return (!this.editItem.dates) && (!this.editItem.startDate) && (!this.editItem.endDate)
      }
    },
    components: {
      'InputTime': InputTime,
      'r-todo-edit': PublicEditView,
      'r-input-title': InputTitleText,
      'r-input-member': InputMember,
      'r-input-date': InputDate
    },
    beforeRouteEnter (to, from, next) {
      next()
      // beforeRouteEnter中不能获取到this，因为this还没有创建，只能通过next获取
    },
    methods: {
      initData () {
        if (this.$route.params.todoType === 'schedule') {
          var currentVal = moment(this.currentDate, 'YYYY-MM-DD').valueOf()
          var strDate = dateUtil.dateNum2Text(currentVal)

          this.editItem.startDate = strDate
          this.editItem.endDate = strDate
        }
      },
      //  从startDate endDate dates三个字段中转换成用户前台显示的date结构
      getPlanedTime () {
        var ei = this.editItem
        var result = dateUtil.backend2frontend(ei.dates, ei.startDate, ei.endDate)
        return (result && result.dateResult) ? result.dateResult[0] : null
      },
      saveTitle (newTitle) {
        this.editItem.pTitle = newTitle
      },
      saveDate ({startDate, endDate, dates}) {
        this.editItem.startDate = startDate
        this.editItem.endDate = endDate
        this.editItem.dates = dates
      },
      saveMember (idArray) {
        this.joinUserRsqIds = idArray
        this.editItem.receiverIds = idArray.join(',')
      },
      saveTodo () {
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
        }

        window.rsqadmg.execute('showLoader', {text: '创建中...'})
        var that = this
        this.$store.dispatch('submitCreateTodoItem', {newItem: this.editItem, todoType: this.isInbox ? 'inbox' : 'schedule'})
            .then(function () {
              window.rsqadmg.exec('hideLoader')
              window.rsqadmg.execute('toast', {message: '创建成功'})
              that.$router.replace(window.history.back())
            })
      }
    },
    mounted () {
      this.initData()
      window.rsqadmg.execute('setTitle', {title: '新任务'})
      var btnParams
      var that = this
      btnParams = {
        btns: [{key: 'saveTodo', name: '完成'}],
        success: function (res) {
          if (res.key === 'saveTodo') {
            that.saveTodo()
          }
        }
      }
      window.rsqadmg.execute('setOptionButtons', btnParams)
    }
  }
</script>
