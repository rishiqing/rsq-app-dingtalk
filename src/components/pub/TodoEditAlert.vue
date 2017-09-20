<template>
  <div class="edit-alert">
    <ul class="top-ul">
      <v-touch tag="li" @tap="disableAlert">
        <span>不提醒</span>
        <i class="icon2-selected finish" v-show="noAlert"></i>
      </v-touch>
    </ul>
    <ul class="alert-list">
      <v-touch tag="li" @tap="selectAlert(alert)" v-for="alert in localRuleList" :key="alert.cid">
        <span>{{parseCode(alert.schedule)}}</span>
        <i class="icon2-selected finish" v-show="alert.selected"></i>
      </v-touch>
    </ul>
    <ul class="alert-list">
      <v-touch tag="li" @tap="selectAlert(alert)" v-for="alert in localTimeList" :key="alert.numTime">
        <span>{{parseTime(alert.numTime)}}</span>
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
      margin-top:1.938rem;
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
        localRuleList: [
          {cid: 0, schedule: 'begin_0_min', selected: false},
          {cid: 1, schedule: 'begin_-5_min', selected: false},
          {cid: 2, schedule: 'begin_-15_min', selected: false},
          {cid: 3, schedule: 'begin_-30_min', selected: false},
          {cid: 4, schedule: 'begin_-1_hour', selected: false},
          {cid: 5, schedule: 'end_-1_hour', selected: false}
        ],
        //  用户自定义的提醒时间
        //  {numTime: 123214345453, selected: true}
        localTimeList: []
      }
    },
    computed: {
      todoAlert () {
        return this.$store.state.pub.currentTodoAlert
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
        this.todoAlert.ruleList.forEach(remoteAlert => {
          for (let i = 0; i < this.localRuleList.length; i++) {
            const localAlert = this.localRuleList[i]
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
        this.todoAlert.timeList.forEach(t => {
          this.localTimeList.push({
            numTime: t.numTime,
            selected: true
          })
        })
      },
      showTimePicker () {
        window.rsqadmg.exec('timePicker', {
          strInit: moment().format('HH:mm'),
          success (result) {
            var obj = {numTime: moment(result.value, 'HH:mm').valueOf, selected: false}
            this.localTimeList.push(obj)
            this.selectAlert(obj)
          }
        })
      },
      disableAlert () {
        if (!this.noAlert) {
          this.localRuleList.forEach(a => {
            a.selected = false
          })
          this.localTimeList = []
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
      parseTime (num) {
        return moment(num).format('HH:mm')
      },
      getRuleList () {
        return this.localRuleList
          .filter(a => {
            return a.selected
          }).map(sel => {
            return {
              id: sel.id,
              schedule: sel.schedule,
              isUserDefined: false
            }
          })
      },
      getTimeList () {
        return this.localTimeList
          .filter(a => {
            return a.selected
          }).map(sel => {
            return {numTime: sel.numTime}
          })
      },
      saveTodoAlert () {
        this.$store.commit('PUB_TODO_ALERT_SET', {
          data: {
            ruleList: this.getRuleList(),
            timeList: this.getTimeList()
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
      this.saveTodoTime()
      next()
    }
  }
</script>
