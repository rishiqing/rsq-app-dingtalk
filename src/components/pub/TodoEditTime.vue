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
  import converter from 'ut/converter'

  export default {
    data () {
      return {
        autoStart: true,
        autoEnd: true,
        localTodoTime: {
          isAllDay: true,
          clock: {
            startTime: null,
            endTime: null,
            alert: []
          }
        }
      }
    },
    computed: {
      currentTodo () {
        return this.$store.state.todo.currentTodo
      },
      todoTime () {
        return this.$store.state.pub.currentTodoTime
      },
      localClock () {
        return this.localTodoTime.clock
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
      /**
       * 初始化数据
       */
      initData () {
        //  复制todoTime到本地
        this.localTodoTime = {
          isAllDay: this.todoTime.isAllDay,
          clock: jsUtil.extendObject({}, this.todoTime.clock)
        }
        //  todoTime.startTime存在，说明之前设置过提醒，不再自动设置
        if (this.localTodoTime.clock.startTime) {
          this.autoStart = false
          this.autoEnd = false
        }
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
          //  设置为延后2分钟
          base = moment(new Date().getTime() + 2 * 60 * 1000)
          this.localClock.startTime = base.format('HH:mm')
          this.localClock.endTime = base.add(1, 'h').format('HH:mm')
        } else {
          //  如果是自动调整开始时间，那么将开始时间调整至结束时间前1小时
          if (this.autoStart) {
            base = moment(this.localClock.endTime, 'HH:mm')
            this.localClock.startTime = base.subtract(1, 'h').format('HH:mm')
          }
          //  如果是自动调整结束时间，那么将结束时间调整至开始时间后1小时
          if (this.autoEnd) {
            base = moment(this.localClock.startTime, 'HH:mm')
            this.localClock.endTime = base.add(1, 'h').format('HH:mm')
          }
        }
      },
      /**
       * 设置开始时间
       */
      setStartTime () {
        if (this.localTodoTime.isAllDay) return
        var that = this
        window.rsqadmg.exec('timePicker', {
          strInit: that.localClock.startTime,
          success (result) {
            that.localClock.startTime = result.value
            that.autoStart = false
            that.autoChangeTime()
          }
        })
      },
      /**
       * 设置结束时间
       */
      setEndTime () {
        if (this.localTodoTime.isAllDay) return
        var that = this
        window.rsqadmg.exec('timePicker', {
          strInit: that.localClock.endTime,
          success (result) {
            that.localClock.endTime = result.value
            that.autoEnd = false
            that.autoChangeTime()
          }
        })
      },
      /**
       * 保存当前todoTime的数据并跳转到提醒页面
       */
      setAlert () {
        if (this.localTodoTime.isAllDay) return

        this.saveTodoTimeState()
        this.$store.commit('PUB_TODO_ALERT_SET', {data: converter.todoAlertBack2Front(this.localClock)})
        this.$router.push('/todoEdit/alert')
      },
      /**
       * 检查是提醒时间是否遭遇当前时间
       */
      checkWarn () {
        if (!this.localTodoTime.isAllDay && moment().isAfter(moment(this.localClock.startTime, 'HH:mm'))) {
          return '提醒时间早于当前时间，可能不会收到提醒!'
        }
      },
      /**
       * 检查用户是否更新过，
       * currentTodo.id不存在（新建）：isAllDay为false即为modified
       * currentTodo.id存在（更新）：比对localTodoTime和todoTime的每一项是否都一样
       */
      isModified () {
        return !converter.compareTodoTime(this.todoTime, this.currentTodo)
      },
      /**
       * 保存todoTime的状态到state中
       */
      saveTodoTimeState () {
        this.$store.commit('PUB_TODO_TIME_SET', {data: this.localTodoTime})
      },
      /**
       * 提交todoTime的更新
       * @param next
       * @returns {Promise<U>|Promise.<TResult>|*|Thenable<U>}
       */
      submitTodo (next) {
        if (this.isModified()) {
          window.rsqadmg.exec('showLoader')
          return this.$store.dispatch('updateTodoTime')
            .then(() => {
              window.rsqadmg.exec('hideLoader')
              next()
            })
        } else {
          next()
        }
      }
    },
    created () {
      this.initData()
      window.rsqadmg.exec('setTitle', {title: '设置时间'})
      window.rsqadmg.exec('setOptionButtons', {hide: true})
      this.$store.dispatch('setNav', {isShow: false})
    },
    mounted () {},
    /**
     * vue-router hook
     * @param to
     * @param from
     * @param next
     * @returns {*}
     */
    beforeRouteLeave (to, from, next) {
      if (to.name !== 'todoNew' && to.name !== 'todoEdit' && to.name !== 'login') {
        return next()
      }

      var that = this
      var warn = this.checkWarn()
      if (warn) {
        window.rsqadmg.exec('confirm', {
          message: warn,
          success () {
            that.saveTodoTimeState()
            that.submitTodo(next)
          },
          cancel () {
            next(false)
          }
        })
      } else {
        that.saveTodoTimeState()
        that.submitTodo(next)
      }
    }
  }
</script>
