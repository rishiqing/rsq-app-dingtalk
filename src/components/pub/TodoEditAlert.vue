<template>
  <div class="edit-alert">
    <ul class="top-ul">
      <v-touch
        tag="li"
        @tap="disableAlert">
        <span>不提醒</span>
        <i
          v-show="noAlert"
          class="icon2-selected finish"/>
      </v-touch>
    </ul>
    <ul class="alert-list bottom-border fix-bb">
      <v-touch
        v-for="(alert, index) in displayedRuleList"
        :key="index"
        tag="li"
        @tap="selectAlert(alert)">
        <span>{{ parseCode(alert.schedule) }}</span>
        <i
          v-show="alert.selected"
          class="icon2-selected finish"/>
      </v-touch>
      <v-touch
        v-for="(alert, index) in displayedTimeList"
        :key="index + 100"
        tag="li"
        @tap="selectAlert(alert)">
        <span>{{ alert.numTime }}</span>
        <i
          v-show="alert.selected"
          class="icon2-selected finish"/>
      </v-touch>
    </ul>
    <!--<ul class="alert-list">-->
    <!--<v-touch tag="li" @tap="selectAlert(alert)" v-for="(alert, index) in displayedTimeList" :key="index">-->
    <!--<span>{{parseTimeText(alert.numTime)}}</span>-->
    <!--<i class="icon2-selected finish" v-show="alert.selected"></i>-->
    <!--</v-touch>-->
    <!--</ul>-->
    <ul class="sec bottom-border mine-ul">
      <v-touch
        tag="li"
        @tap="showTimePicker">
        <span class="list-key mine">自定义提醒时间</span>
        <i class="icon2-arrow-right-small arrow"/>
      </v-touch>
    </ul>
    <div class="btn-group">
      <div class="btn-wrap">
        <v-touch
          tag="a"
          class="weui-btn weui-btn_primary"
          href="javascript:;"
          @tap="accept">
          完成
        </v-touch>
      </div>
    </div>
  </div>
</template>
<script>
  import jsUtil from 'ut/jsUtil'
  import moment from 'moment'

  export default {
    name: 'TodoEditAlert',
    data () {
      return {
        noAlert: true,
        //  系统的提醒时间
        //  {cid: 0, schedule: 'begin_0_min', selected: false}
        displayedRuleList: [
          {schedule: 'begin_0_hour', selected: false},
          {schedule: 'begin_-5_min', selected: false},
          {schedule: 'begin_-30_min', selected: false}
          // {schedule: 'begin_-30_min', selected: false},
          // {schedule: 'begin_-1_hour', selected: false},
          // {schedule: 'end_-1_hour', selected: false}
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
      },
      userDefinedAlertText () {
        return this.displayedTimeList.map(a => {
          return a.numTime
        })
      }
    },
    created () {
      this.initData()
      window.rsqadmg.execute('setTitle', {title: '时间和提醒'})
      window.rsqadmg.exec('setOptionButtons', {hide: true})
    },
    methods: {
      accept () {
        this.$router.go(-1)
      },
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
        var that = this
        //  延迟50ms执行，保证不会触发立即关闭
        setTimeout(() => {
          window.rsqadmg.exec('timePicker', {
            success (result) {
              var once = true
              var resultLabel = result.value[0].label + result.value[1].label + result.value[2].label
              var resultVlaue = result.value[0].value + '_-' + result.value[1].value + '_' + result.value[2].value
              var obj = {numTime: resultLabel, selected: false, numTimeValue: resultVlaue}
              that.displayedRuleList.forEach(function (o) {
                if (o.schedule === resultVlaue) {
                  that.selectAlert(o)
                  once = false
                }
              })
              that.displayedTimeList.forEach(function (o) {
                if (o.numTime === resultLabel) {
                  once = false
                }
              })
              if (once) {
                if (that.displayedTimeList.length < 10) {
                  that.displayedTimeList.push(obj)
                  that.selectAlert(obj)
                } else {
                  window.rsqadmg.exec('alert', {message: '数量已达上限'})
                }
              }
              once = true
            }
          })
        }, 50)
      },
      disableAlert () {
        if (!this.noAlert) {
          this.displayedRuleList.forEach(a => {
            a.selected = false
          })
          this.displayedTimeList.forEach(a => {
            a.selected = false
          })
        }
        this.noAlert = true
      },
      selectAlert (a) {
        this.displayedRuleList.forEach(o => {
          o.selected = false
        })
        this.displayedTimeList.forEach(o => {
          o.selected = false
        })
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
          numTime: jsUtil.alertCode2Text(obj.schedule),
          selected: false,
          numTimeValue: obj.schedule
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
      // getSelectedUserRuleList () {
      //   return this.displayedTimeList
      //     .filter(a => {
      //       return a.selected
      //     }).map(sel => {
      //       return {
      //         schedule: jsUtil.alertTime2Rule(sel.numTime, this.numStartTime, this.numEndTime)
      //       }
      //     })
      // },
      //  比对displayedRuleList与sysRuleList，计算最终的提醒列表,为什么不以displayedRuleList为标准？
      mergeRuleList () {
        var selected = this.getSelected(this.displayedRuleList) // 这一步是拿到选中状态的list
        var result = []
        //  执行merge算法(selected本身就是和sysRuleList一致得把为什么还要filter,意思是后来又添加或者修改的selected？？？？？)
        selected.forEach(s => {
          var orgObjArray = this.sysRuleList.filter(org => {
            return org.schedule === s.schedule
          })
          if (orgObjArray.length > 0) {
            result.push(orgObjArray[0])
          } else {
            result.push({
              id: null,
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
          var orgObjArray = this.userRuleList.filter(org => {
            return s.numTimeValue === org.schedule
          })
          if (orgObjArray.length > 0) {
            result.push(orgObjArray[0])
          } else {
            result.push({
              schedule: s.numTimeValue,
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
        var that = this
        var alertNew = list.some(function (o) {
          return jsUtil.alertRule2Time(o.schedule, that.numStartTime, that.numEndTime) < new Date().getTime()
        })
        if (alertNew) {
          window.rsqadmg.exec('alert', {message: '提醒时间早于当前时间，可能不会收到提醒!'})
        }
        this.$store.commit('PUB_TODO_TIME_CLOCK_UPDATE', {
          data: {
            alert: list
          }
        })
      }
    },
    beforeRouteLeave (to, from, next) {
      this.saveTodoAlert()
      next()
    }
  }
</script>
<style lang="scss" scoped>
  .edit-alert {
    span.list-key {float:left;}
    span.list-value {float:right;margin-right:0.94rem;
      max-width:7rem;overflow:hidden;text-overflow: ellipsis;white-space: nowrap;
      color: #999999;max-width: 50%}
    .remind {
      display: block;
      margin-left: 0.2rem;
      font-family: PingFangSC-Regular;
      font-size: 16px;
    }
    .time {
      position: absolute;
      font-family: PingFangSC-Regular;
      font-size: 17px;
      color: #999999;
      letter-spacing: 0;
      right: 0.63rem;
      top: 0.23rem;
    }
    .finish {
      position: absolute;
      right: 0.63rem;
      top: 0.33rem;
      color: #55A8FD;
      font-weight: bold;
    }
    ul {
      position: relative;
      /*border-bottom: 0.5px solid #E3E3E3;*/
      // border-top: 0.5px solid #D4D4D4;
      background: #FFFFFF;
    }
    ul:before{
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
    ul:not(:first-child):before{
      border-top: 0;
    }
    ul.bottom-border{
      // border-bottom: 0.5px solid #D4D4D4;
    }
    ul.bottom-border:after{
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
    .top-ul {
      margin-top: 20px;
    }
    .sec {
      margin-top: 20px;
    }
    span {
      /*line-height: 1.112rem;*/
      display: block;
      // border-bottom: 0.5px solid #d4d4d4;
    }
    span:after{
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
    margin-left: 15px;

    }
    li {
      position: relative;
      line-height: 1.2rem;
      // height: 1.2rem;
      font-family: PingFangSC-Regular;
      font-size: 17px;
      color: #3D3D3D;
      padding-left: 15px;
    }
    li:last-child {
      border: none;
    }
    .arrow{
      position: absolute;
      right: 0.2rem;
    height: 100%;
    line-height: 1.2rem;
      font-size: 21px;
      color: #999999;
    }
    .mine{
      border-bottom: 0;
    }
    .mine-ul{
      // border-top: 0.5px solid #d4d4d4 !important;
      position: relative;
      li{
        height: 1.2rem;
      }
    }
    .mine-ul li:before{
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
    .fix-bb{
      li:last-child span{
        border-bottom: 0;
      }
    }
  }
</style>
