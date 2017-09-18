<template>
  <div class="edit-time">
    <ul class="edit-time-all-day">
      <li>
        <span>全天</span>
        <div class="switch-wrapper">
          <input class="mui-switch" type="checkbox" v-model="localTodoTime.isAllDay">
        </div>
      </li>
    </ul>
    <ul class="sec" :class="{'is-text-disabled': localTodoTime.isAllDay}">
      <v-touch tag="li" @tap="setStartTime">
        <span class="list-key">开始时间</span>
        <span class="list-value">{{localClock.startTime}}</span>
        <i class="icon2-arrow-right-small arrow"></i>
      </v-touch>
      <v-touch tag="li" @tap="setEndTime">
        <span class="list-key">结束时间</span>
        <span class="list-value">{{localClock.endTime}}</span>
        <i class="icon2-arrow-right-small arrow"></i>
      </v-touch>
    </ul>
    <ul class="last" :class="{'is-text-disabled': localTodoTime.isAllDay}">
      <v-touch tag="li" @tap="setAlert">
        <span class="list-key">提醒</span>
        <span class="list-value">{{alertText}}</span>
        <i class="icon2-arrow-right-small arrow"></i>
      </v-touch>
    </ul>
  </div>
</template>
<style lang="scss">
  .edit-time {
    .switch-wrapper {
      position: absolute;
      top:0.15rem;
      right:0.25rem;
    }
    input.mui-switch {
      display: block;
      width: 52px;
      height: 31px;
      border: 1px solid #dfdfdf;
      background-color: #fdfdfd;
      box-shadow: #dfdfdf 0 0 0 0 inset;
      border-radius: 20px;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
      background-clip: content-box;
      -webkit-appearance: none;
      user-select: none;
      outline: none; }
    input.mui-switch:before {
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
    input.mui-switch:checked {
      border-color: #67B2FE;
      box-shadow: #67B2FE 0 0 0 16px inset;
      background-color: #67B2FE; }
    input.mui-switch:checked:before {
      left: 21px; }

    .is-text-disabled span {color: #DDDDDD;}
    .is-text-disabled .arrow {color:#E0E0E0;}
    .arrow{
      position: absolute;
      right:0.11rem;
      top:0.31rem;
      font-size:22px;
    }
    ul{
      background-color: white;
      border-bottom:0.5px solid #DADADA;
      border-top:0.5px solid #DADADA;
    }
    .edit-time-all-day{
      margin-top: 0.231rem;
      border-bottom:0.5px solid #DADADA;
      border-top:0.5px solid #DADADA;
    }
    .edit-time-all-day>li{
      padding-left: 3%;
    }
    .last>li{
      padding-left: 3%;
    }
    li{
      position: relative;
      line-height:1.2rem ;
      height: 1.2rem;
      border-bottom:0.5px solid #DADADA;
      box-sizing: border-box;
    }
    .sec{
      margin-top:0.231rem ;
      padding-left:3%;
    }
    .last{
      margin-top:0.391rem ;
    }
    .sec>li:last-child{
      border: none;
    }
    span{
      display: block;
      font-family: PingFangSC-Regular;
      font-size: 17px;
      letter-spacing: 0;
    }
    span.list-key {float:left;}
    span.list-value {float:right;margin-right:0.7rem;
      max-width:7rem;overflow:hidden;text-overflow: ellipsis;white-space: nowrap;}
    .sec span{}
    .last span{}
  }

</style>
<script>
  import moment from 'moment'
  import jsUtil from 'ut/jsUtil'

  export default {
    data () {
      return {
        autoStart: true,
        autoEnd: true,
        localTodoTime: {
          isAllDay: true,
          todo: {
            clock: {
              startTime: null,
              endTime: null,
              alert: []
            }
          }
        }
      }
    },
    computed: {
      todoTime () {
        return this.$store.state.pub.currentTodoTime
      },
      localClock () {
        return this.localTodoTime.todo.clock
      },
      alertText () {
        try {
          var arr = this.localClock.alert
          if (arr.length > 0) {
            return arr.map(a => {
              var str
              if (!a.isUserDefined) {
                str = jsUtil.alertCode2Text(a.schedule)
              } else {
                str = a.schedule
              }
              return str
            }).join(',')
          } else {
            return '不提醒'
          }
        } catch (e) {
          console.error(e)
          return '不提醒'
        }
      }
    },
    methods: {
      initData () {
        if (this.todoTime.todo.id) {
          this.autoStart = this.autoEnd = false
        }
        this.localTodoTime = jsUtil.deepClone(this.todoTime)

        //  自动调整时间
        this.autoChangeTime()
      },
      /**
       * 在用户修改具体时间前自动调整起止时间间隔1小时
       */
      autoChangeTime () {
        var base
        //  开始时间和结束时间都是自动调整，那么就设置为当前时间
        if (this.autoStart && this.autoEnd) {
          base = moment()
          this.$set(this.localClock, 'startTime', base.format('HH:mm'))
          this.$set(this.localClock, 'endTime', base.add(1, 'h').format('HH:mm'))
        } else {
          //  如果是自动调整开始时间，那么将开始时间调整至结束时间前1小时
          if (this.autoStart) {
            base = moment(this.localClock.endTime, 'HH:mm')
            this.$set(this.localClock, 'startTime', base.minus(1, 'h').format('HH:mm'))
          }
          //  如果是自动调整结束时间，那么将结束时间调整至开始时间后1小时
          if (this.autoEnd) {
            base = moment(this.localClock.startTime, 'HH:mm')
            this.$set(this.localClock, 'endTime', base.add(1, 'h').format('HH:mm'))
          }
        }
      },
      setStartTime () {
        if (this.localTodoTime.isAllDay) return
        var that = this
        window.rsqadmg.exec('timePicker', {
          strInit: that.localClock.startTime,
          success (result) {
            that.$set(that.localClock.startTime, result[0].value)
            that.autoStart = false
            that.autoChangeTime()
          }
        })
      },
      setEndTime () {
        if (this.localTodoTime.isAllDay) return
        var that = this
        window.rsqadmg.exec('timePicker', {
          strInit: that.localClock.endTime,
          success (result) {
            that.$set(that.localClock.endTime, result[0].value)
            that.autoEnd = false
            that.autoChangeTime()
          }
        })
      },
      setAlert () {
        if (this.localTodoTime.isAllDay) return

        this.saveTodoTime()
        this.$store.commit('PUB_SET_TODO_ALERT', this.localTodoTime.alert)
        this.$router.push('/todoEdit/alert')
      },
      checkWarn () {
        if (!this.localTodoTime.isAllDay && moment().isAfter(moment(this.localClock.startTime, 'HH:mm'))) {
          return '提醒时间早于当前时间，可能不会收到提醒!'
        }
      },
      saveTodoTime () {
        this.$store.commit('PUB_SET_TODO_TIME', this.localTodoTime)
      }
    },
    mounted () {
      this.initData()
      window.rsqadmg.exec('setTitle', {title: '设置时间'})
      window.rsqadmg.exec('setOptionButtons', {hide: true})
      this.$store.dispatch('setNav', {isShow: false})
    },
    beforeRouteLeave (to, from, next) {
      if (to.name !== 'todoNew' && to.name !== 'todoEdit') next()

      this.saveTodoTime()
      next()

//      alert('------')
//
//
//      var that = this
//      var warn = this.checkWarn()
//      if (warn) {
//        window.rsqadmg.exec('confirm', {
//          message: warn,
//          success () {
//            that.emitReady()
//            next()
//          },
//          cancel () {
//            next(false)
//          }
//        })
//      } else {
//        that.emitReady()
//        next()
//      }
    }
  }
</script>
