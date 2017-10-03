<template>
  <v-touch class="c-cal-main"
       @panstart="onPanMove" @panmove="onPanMove"
       @panend="onPanEnd"
       @pancancel="onPanEnd"
       :pan-options="{ direction: 'all', threshold: 10 }">
  <div class="cal-title z-index-3xs">
      <span>{{focusDate ? months[focusDate.getMonth()] : ''}}月</span>
      <span>{{focusDate ? focusDate.getFullYear() : ''}}-{{barPaneIndex}}</span>
      <!--<v-touch tag="span" class="cal-title-today"-->
            <!--@tap="backToToday"-->
            <!--v-show="!isToday">今</v-touch>-->
    </div>
    <div class="cal-week-title z-index-2xs">
      <table>
        <tr>
          <td class="cal-weekday" v-for="week in weeks">{{week}}</td>
        </tr>
      </table>
    </div>
    <div class="cal-content z-index-2xs" :style="{height: calHeight + 'px', top: topBase + 'px'}">
      <div class="cal-outer cal-outer-pane" id="vPaneWrapper"
           :style="{'transform': translateY}"
           :class="{'animate': transDirection === 'v' }">
        <div class="cal-inner cal-inner-pane" id="hMovePane"
             :style="{'transform': paneView.translateX}"
             :class="{'animate': transDirection === 'h' }">
          <r-cal-pane
            v-for="(dates, index) in datesArray"
            :key="index"
            :dates="dates"
            :pane-index="index"
            :highlight-day="selectDate"
            :today-value="todayValue"
            @click-cal-pane-day="triggerSelectDate"
          ></r-cal-pane>
        </div>
      </div>
      <div class="cal-outer cal-outer-bar" id="vBarWrapper">
        <div class="cal-inner cal-inner-bar" id="hMoveBar" v-show="isShowBar"
             :style="{transform: barView.translateX, height: barView.height + 'px', top: topBase + 'px'}"
             :class="{animate: transDirection === 'h' }">
          <r-cal-bar
            v-for="(days, index) in daysArray"
            :key="index"
            :days="days"
            :bar-index="index"
            :highlight-day="selectDate"
            :today-value="todayValue"
            @click-cal-bar-day="triggerSelectDate"
          ></r-cal-bar>
        </div>
      </div>
    </div>
  </v-touch>
</template>
<script scoped>
  import CalendarBar from 'com/demo/CalendarBar'
  import CalendarPane from 'com/demo/CalendarPane'
  import dateUtil from 'ut/dateUtil'

  export default {
    name: 'Calendar',
    data () {
      return {
        daysArray: [], //  有当前周、前一个周、后一个周三个数组组成
        datesArray: [],  //  有当前月份、前一个月份、后一个月份三个数组组成
        focusDate: null,  //  每一个当前显示的月份（周）都需要有一个focusDate
        selectDate: null,  //  当前选中（高亮显示）的日期
        topBase: 83,  //  顶部的高度，bar和pane都相对于此高度
        barView: {
          type: 'bar',
          height: 50,
          translateX: 'translateX(0)'
        },
        paneView: {
          type: 'pane',
          height: 240,
          translateX: 'translateX(0)'
        },
        currentView: {},
        direction: {2: 'h', 4: 'h', 8: 'v', 16: 'v'},  //  2和4表示横向移动，8和16表示纵向移动
        currentLock: null,  //  方向锁，防止在pan上下移动的同时发生左右移动
        transDirection: null,  //  当前正在进行中的transition的方向，v表示垂直方向，hBar表示bar的水平方向，hPane表示pane的水平方向
        isShowBar: false,

        translateY: 'translateY(0)',
        calHeight: 0,
        weeks: ['日', '一', '二', '三', '四', '五', '六'],
        months: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
      }
    },
    props: {
      defaultSelectDate: Date,
      showHasTodoTag: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      isToday () {
        if (!this.selectDate) {
          return false
        }
        return this.selectDate.getTime() === this.todayValue
      },
      todayValue () {
        return this.clearTime(new Date()).getTime()
      },
      paneLine () {
        //  获取当前显示的月试图中的周的行数
        return this.datesArray[1].length
      },
      paneLineHeight () {
        return this.calHeight / this.paneLine
      },
      //  bar中的日期是当前pane的第几行
      barPaneIndex () {
        if (this.daysArray.length === 0 || this.datesArray.length === 0) {
          return 999
        }
        var barTime = this.daysArray[1][0].date.getTime()
        for (let i = 0; i < this.datesArray[1].length; i++) {
          var paneTime = this.datesArray[1][i][0].date.getTime()
          if (barTime >= paneTime && barTime < paneTime + 7 * 24 * 3600 * 1000) {
            return i
          }
        }
        return 9999
      },
      anotherView () {
        if (this.isBar) {
          return this.paneView
        } else if (this.isPane) {
          return this.barView
        }
      },
      isPane () {
        return this.currentView.type === 'pane'
      },
      isBar () {
        return this.currentView.type === 'bar'
      }
    },
    components: {
      'r-cal-bar': CalendarBar,
      'r-cal-pane': CalendarPane
    },
    methods: {
      triggerSelectDate (date) {
        this.selectDate = date
        this.$emit('click-cal-day', date)
      },
      backToToday () {
        var today = this.clearTime(new Date())
        this.focusDate = today
        this.resetBar()
        this.triggerSelectDate(today)
      },
      //  获取前一、当前、后一三周的数据
      resetDays (focusDate) {
        return [
          dateUtil.getWeekDays(dateUtil.firstDayOfWeek(focusDate, -1)),
          dateUtil.getWeekDays(dateUtil.firstDayOfWeek(focusDate, 0)),
          dateUtil.getWeekDays(dateUtil.firstDayOfWeek(focusDate, 1))
        ]
      },
      //  获取前一、当前、后一三月的数据
      resetDates (focusDate) {
        return [
          dateUtil.getMonthDays(dateUtil.firstDayOfMonth(focusDate, -1)),
          dateUtil.getMonthDays(dateUtil.firstDayOfMonth(focusDate, 0)),
          dateUtil.getMonthDays(dateUtil.firstDayOfMonth(focusDate, 1))
        ]
      },
      clearTime (date) {
        return new Date(date.setHours(0, 0, 0, 0))
      },
      clearLock () {
        this.currentLock = null
      },
      checkLocked (ev) {
        //  方向锁
        var nowDir = this.direction[ev.offsetDirection]
        if (this.currentLock === null) {
          this.currentLock = nowDir
          return false
        } else {
          return this.currentLock !== nowDir
        }
      },
      onPanMove (ev) {
        if (this.checkLocked(ev)) {
          return
        }
        if (this.transDirection) {
          return
        }
        var deltaY = ev.deltaY
        var absY = Math.abs(deltaY)
        //  超出范围不再移动
        if (absY > this.calHeight - this.paneLineHeight) {
          return
        }
        switch (ev.offsetDirection) {
          case 2:
          case 4:
            var deltaX = ev.deltaX
            //  超出范围不做相应
            //  TODO 超出100%
            this.currentView.translateX = 'translateX(' + deltaX + 'px)'
            break
          case 8:
            //  处于pane状态只能上拉
            if (this.isPane) {
              if (absY > this.barPaneIndex * this.paneLineHeight) {
                this.isShowBar = true
              }
              this.translateY = 'translateY(' + deltaY + 'px)'
            }
            break
          case 16:
            //  处于bar状态只能下拉
            if (this.isBar) {
              //  超出范围不再移动
              if (absY > (this.paneLine - this.barPaneIndex - 1) * this.paneLineHeight) {
                this.isShowBar = false
              }
              this.translateY = 'translateY(' + (this.barView.height - this.paneView.height + deltaY) + 'px)'
            }
            break
          default:
            break
        }
      },
      onPanEnd (ev) {
        this.clearLock()
        if (this.transDirection) {
          return
        }
        var dir = this.direction[ev.offsetDirection]
        //  设置transDirection的值，在transitionend的listener中会将其设置为null
        this.transDirection = dir
        if (dir === 'h') {
          this.transX(ev)
        } else if (dir === 'v') {
          this.transY(ev)
        }
      },
      transX (ev) {
        var delta = ev.deltaX
        var direction

        if (Math.abs(delta) > 20 && ev.type === 'panend') {
          direction = delta > 0 ? 1 : -1
          this.currentView.translateX = 'translateX(' + (direction * 100) + '%)'
        } else {
          direction = 0
          this.currentView.translateX = 'translateX(0)'
        }
        if (this.isBar) {
          this.focusDate = dateUtil.firstDayOfWeek(this.focusDate, -direction)
        } else {
          this.focusDate = dateUtil.firstDayOfMonth(this.focusDate, -direction)
        }
      },
      transY (ev) {
        var delta = ev.deltaY

        //  如果是bar且向上滑动，pane且向下滑动，均禁止
        if (this.isBar && delta < 0 || this.isPane && delta > 0) {
          this.transDirection = null
          return
        }

        if (Math.abs(delta) > 20 && ev.type === 'panend') {
          var offset = 0
          if (this.isPane) {
            offset = this.barView.height - this.paneView.height
            this.isShowBar = true
          } else {
            this.isShowBar = false
          }
          this.translateY = 'translateY(' + offset + 'px)'
          this.currentView = this.anotherView
        } else {
          this.translateY = 'translateY(' + this.currentView.height + 'px)'
        }
      },
      resetBarAndPane () {
        this.transDirection = null
        this.daysArray = this.resetDays(this.focusDate)
        this.barView.translateX = 'translateX(0)'
        this.datesArray = this.resetDates(this.focusDate)
        this.paneView.translateX = 'translateX(0)'
        this.$emit('after-cal-swipe', {type: this.currentView.type, daysArray: this.daysArray, datesArray: this.datesArray})
      },
      resetBar () {
        this.daysArray = this.resetDays(this.focusDate)
        this.transDirection = null
        this.barView.translateX = 'translateX(0)'
        this.$emit('after-cal-swipe', {daysArray: this.daysArray})
      },
      resetPane () {
        this.datesArray = this.resetDates(this.focusDate)
        this.transDirection = null
        this.paneView.translateX = 'translateX(0)'
        this.$emit('after-cal-swipe', {datesArray: this.datesArray})
      },
      resetViewType () {
        if (this.transDirection === 'v') {
//          this.isShowBar = this.isBar
          this.transDirection = null
        }
      }
    },
    mounted () {
      //  初始化工作
      this.focusDate = this.defaultSelectDate
      this.currentView = this.paneView
      this.calHeight = this.currentView.height
      this.resetBar()
      this.resetPane()
      this.triggerSelectDate(this.defaultSelectDate)

      //  给周视图加动画结束的方法
      var ele1 = document.getElementById('hMoveBar')
      ele1.addEventListener('transitionend', this.resetBarAndPane)
      ele1.addEventListener('webkitTransitionEnd', this.resetBarAndPane)

      //  给月视图加动画结束的方法
      var ele2 = document.getElementById('hMovePane')
      ele2.addEventListener('transitionend', this.resetBarAndPane)
      ele2.addEventListener('webkitTransitionEnd', this.resetBarAndPane)

      //  给垂直移动加动画结束的方法
      //  WARN 注意！！ele1和ele2触发transition结束时也会触发ele3的监听方法
      var ele3 = document.getElementById('vPaneWrapper')
      ele3.addEventListener('transitionend', this.resetViewType)
      ele3.addEventListener('webkitTransitionEnd', this.resetViewType)
    }
  }
</script>
<style lang="scss" scope>
  @import '../../assets/css/variables.scss';
  .c-cal-main {
    position: relative;color:white;font-size: 1.4rem;
    height: 81px;background: #458CDA;
    border-bottom: 0.5px solid #E4E4E4;
  }
  .cal-title {
    position: fixed;top: 0;left: 0;right: 0;
    text-align: center;height: 53px;line-height: 52px;
    margin-bottom: -1px;background: $mainColor;font-size: 14px;
  }
  .cal-title-today {position:fixed;top:0;height:30px;left:10px;width:30px;
    font-size: 1.8rem;font-weight: bold;z-index:9999;}
  .cal-week-title {
    position: fixed;top: 53px;left: 0;right: 0;width: 100%;
    padding: 0;height: 31px;line-height: 30px;
    margin-bottom: -1px;color:white;background: #458CDA;font-size:1.2rem;
  }
  .c-cal-main table {
    text-align: center;table-layout: fixed;
    width: 100%;height: 100%;margin: 0;
  }
  .c-cal-main td {}
  .cal-weekday {
    font-size: 0.293rem;
    font-family: PingFangSC-Medium;
  }
  .cal-content {
    position: fixed;left: 0;right: 0;padding:0;overflow: hidden;
  }
  .cal-outer {position:relative;width:100%;height:100%;overflow:hidden;background: #458CDA;}
  .cal-inner {
    overflow: visible;white-space:nowrap;
  }
  div.cal-inner-pane {
    position: absolute;left: -100%;top:0;width:100%;bottom:0;
  }
  div.cal-inner-bar {
    position: fixed;margin-left: -100%;width: 100%;
  }
  .animate {
    transition: transform 0.3s ease;
  }
</style>
