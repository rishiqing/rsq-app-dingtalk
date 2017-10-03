<template>
  <div class="edit-alert">
    <ul class="top-ul">
      <v-touch tag="li" @tap="disableAlert">
        <span>不提醒</span>
        <i class="icon2-selected finish" v-show="noAlert"></i>
      </v-touch>
    </ul>
    <ul class="alert-list">
      <v-touch tag="li" @tap="selectAlert(alert)" v-for="(alert, index) in displayedRuleList" :key="index">
        <span>{{parseCode(alert.schedule)}}</span>
        <i class="icon2-selected finish" v-show="alert.selected"></i>
      </v-touch>
    </ul>
    <ul class="alert-list">
      <v-touch tag="li" @tap="selectAlert(alert)" v-for="(alert, index) in displayedTimeList" :key="index">
        <span>{{parseTimeText(alert.numTime)}}-{{alert.selected}}</span>
        <i class="icon2-selected finish" v-show="alert.selected"></i>
      </v-touch>
    </ul>
    <ul class="sec">
      <v-touch tag="li" @tap="showTimePicker">
        <span class="remind">自定义提醒时间</span>
      </v-touch>
    </ul>
  </div>
</template>
<style>
  .edit-alert {
    .remind{
      display: block;
      margin-left: 0.2rem;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #55A8FD;
    }
    .time{
      position: absolute;
      font-family: PingFangSC-Regular;
      font-size: 17px;
      color: #999999;
      letter-spacing: 0;
      right:0.63rem;
      top:0.23rem;
    }
    .finish{
      position:absolute;
      right:0.63rem;
      top:0.33rem;
      color: #55A8FD;
      font-weight: bold;
    }
    ul{
      position: relative;
      border-bottom: 0.5px solid #E3E3E3;
      border-top: 0.5px solid #E3E3E3;
      background: #FFFFFF;
    }
    .top-ul {
      margin-top:0.266rem;
    }
    .sec{
      margin-top: 0.373rem;
    }

    span{
      /*line-height: 1.112rem;*/
      display:block;
      margin-left: 0.45rem;

    }
    li{
      position: relative;
      padding:5px;
      line-height: 0.912rem;
      height: 0.912rem;
      border-bottom: 0.5px solid #E3E3E3;
      font-family: PingFangSC-Regular;
      font-size: 17px;
      color: #3D3D3D;
    }
    li:last-child{
      border:none;
    }
  }

</style>
<script>
  import jsUtil from 'ut/jsUtil'
  import moment from 'moment'

  export default {
    data () {
      return {
        noAlert: true,
        //  系统的提醒时间
        //  {cid: 0, schedule: 'begin_0_min', selected: false}
        displayedRuleList: [
          {schedule: 'begin_0_min', selected: false},
          {schedule: 'begin_-5_min', selected: false},
          {schedule: 'begin_-15_min', selected: false},
          {schedule: 'begin_-30_min', selected: false},
          {schedule: 'begin_-1_hour', selected: false},
          {schedule: 'end_-1_hour', selected: false}
        ],
        //  用户自定义的提醒时间
        //  {numTime: 123214345453, selected: true}
        displayedTimeList: []
      }
    },
    computed: {
      todoClock () {
        return this.$store.state.pub.currentTodoTime.clock || {}
      },
      baseDate () {
        return this.todoClock.taskDate || this.$store.getters.defaultTaskDate
      },
      numStartTime () {
        return this.getNumDateTime(this.todoClock.startTime)
      },
      numEndTime () {
        return this.getNumDateTime(this.todoClock.endTime)
      },
      alertList () {
        return this.todoClock.alert || []
      },
      //  非用户自定义的rule
      sysRuleList () {
        return this.alertList.filter(a => {
          return !a.isUserDefined
        })
      },
      //  用户自定义的rule
      userRuleList () {
        return this.alertList.filter(a => {
          return a.isUserDefined
        })
      }
    },
    methods: {
      initData () {
        //  设置默认值
        this.initRuleList()
        this.initTimeList()
      },
      initRuleList () {
        var noAlert = true
        this.sysRuleList.forEach(remoteAlert => {
          for (let i = 0; i < this.displayedRuleList.length; i++) {
            const localAlert = this.displayedRuleList[i]
            if (localAlert.schedule === remoteAlert.schedule) {
              noAlert = false
              localAlert.selected = true
              break
            }
          }
        })
        this.noAlert = noAlert
      },
      initTimeList () {
        this.userRuleList.forEach(t => {
          var obj = this.parseTimeObj(t)
          this.displayedTimeList.push(obj)
          this.selectAlert(obj)
        })
      },
      showTimePicker () {
//        //  测试时使用，以后删除
//        var time = moment().format('HH:mm')
//        var obj = {numTime: this.getNumDateTime(time), selected: false}
//        this.displayedTimeList.push(obj)
//        this.selectAlert(obj)
        window.rsqadmg.exec('timePicker', {
          strInit: moment().format('HH:mm'),
          success (result) {
            var obj = {numTime: this.getNumDateTime(result.value), selected: false}
            this.displayedTimeList.push(obj)
            this.selectAlert(obj)
          }
        })
      },
      disableAlert () {
        if (!this.noAlert) {
          this.displayedRuleList.forEach(a => {
            a.selected = false
          })
          this.displayedTimeList = []
        }
        this.noAlert = true
      },
      selectAlert (a) {
        a.selected = !a.selected
        if (a.selected) {
          this.noAlert = false
        }
      },
      parseCode (schedule) {
        return jsUtil.alertCode2Text(schedule.split('_'))
      },
      //  将'HH:mm'类型的时间根据baseDate转换成mills值
      getNumDateTime (time) {
        return moment(this.baseDate + ' ' + time, 'YYYYMMDD HH:mm').valueOf()
      },
      parseTimeObj (obj) {
        return {
          numTime: jsUtil.alertRule2Time(obj.schedule, this.numStartTime, this.numEndTime),
          selected: false
        }
      },
      parseTimeText (num) {
        return moment(num).format('HH:mm')
      },
      getSelected (list) {
        return list
          .filter(a => {
            return a.selected
          })
      },
      getSelectedUserRuleList () {
        return this.displayedTimeList
          .filter(a => {
            return a.selected
          }).map(sel => {
            return {
              schedule: jsUtil.alertTime2Rule(sel.numTime, this.numStartTime, this.numEndTime)
            }
          })
      },
      //  比对displayedRuleList与sysRuleList，计算最终的提醒列表
      mergeRuleList () {
        var selected = this.getSelected(this.displayedRuleList)
        var result = []
        //  执行merge算法
        selected.forEach(s => {
          var orgObj = this.sysRuleList.find(org => {
            return org.schedule === s.schedule
          })
          if (orgObj) {
            result.push(orgObj)
          } else {
            result.push({
              schedule: s.schedule,
              isUserDefined: false
            })
          }
        })
        return result
      },
      //  比对displayedTimeList与userRuleList，计算最终的提醒列表
      //  统一解析成时间来做判断是否相等
      mergeTimeList () {
        var selected = this.getSelected(this.displayedTimeList)
        var result = []
        //  执行merge算法
        selected.forEach(s => {
          var orgObj = this.userRuleList.find(org => {
            return s.numTime === jsUtil.alertRule2Time(org.schedule, this.numStartTime, this.numEndTime)
          })
          if (orgObj) {
            result.push(orgObj)
          } else {
            result.push({
              schedule: jsUtil.alertTime2Rule(s.numTime, this.numStartTime, this.numEndTime),
              isUserDefined: true
            })
          }
        })
        return result
      },
      mergeList () {
        return this.mergeRuleList().concat(this.mergeTimeList())
      },
      saveTodoAlert () {
        var list = this.mergeList()
        this.$store.commit('PUB_TODO_TIME_CLOCK_UPDATE', {
          data: {
            alert: list
          }
        })
      }
    },
    created () {
      this.initData()
      window.rsqadmg.execute('setTitle', {title: '设置提醒'})
      window.rsqadmg.exec('setOptionButtons', {hide: true})
    },
    beforeRouteLeave (to, from, next) {
      this.saveTodoAlert()
      next()
    }
  }
</script>
