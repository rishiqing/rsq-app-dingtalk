<template>
  <v-touch class="c-cal-main"
           :class="{'animate': transDirection === 'v'}"
           :style="{'height': (topBase + titleHeight + calHeight) + 'px'}"
           @panstart="onPanMove"
           @panmove="onPanMove"
           @panend="onPanEnd"
           @pancancel="onPanEnd"
           :pan-options="{ direction: 'all', threshold: 10 }">
  <!--<div class="cal-title z-index-m">-->
      <!--<span>{{currentView.focusDate ? months[currentView.focusDate.getMonth()] : ''}}月</span>-->
      <!--<span>{{currentView.focusDate ? currentView.focusDate.getFullYear() : ''}}</span>-->
      <!--<v-touch tag="span" class="cal-title-today"-->
            <!--@tap="backToToday"-->
            <!--v-show="!isToday">今</v-touch>-->
    <!--</div>-->
    <div class="cal-week-title z-index-2xs" :style="{height: titleHeight + 'px', top: topBase + 'px'}">
      <table>
        <tr>
          <td class="cal-weekday" v-for="week in weeks">{{week}}</td>
        </tr>
      </table>
    </div>
    <div class="cal-content z-index-3xs"
         :style="{height: calHeight + 'px', top: (topBase + titleHeight) + 'px'}"
         :class="{'animate': transDirection === 'v'}">
      <div class="cal-outer cal-outer-pane" id="vPaneWrapper"
           :style="{'transform': 'translateY(' + translateY + 'px)'}"
           :class="{'animate': transDirection === 'v'}">
        <div class="cal-inner cal-inner-pane" id="hMovePane"
             :style="{'transform': 'translateX(' + paneView.translateX + ')', height: paneView.height + 'px', top: '0px'}"
             :class="{'animate': transDirection === 'h' }">
          <r-cal-pane
            v-for="(dates, index) in paneView.daysArray"
            :key="index"
            :dates="dates"
            :pane-index="index"
            :highlight-day="selectDate"
            :today-value="todayValue"
            @click-cal-pane-day="triggerSelectDate"
          ></r-cal-pane>
        </div>
      </div>
      <div class="cal-outer cal-outer-bar" id="vBarWrapper" style="transform: translateY(0px);">
        <div class="cal-inner cal-inner-bar" id="hMoveBar" v-show="isShowBar"
             :style="{transform: 'translateX(' + barView.translateX + ')', height: barView.height + 'px', top: '0px'}"
             :class="{animate: transDirection === 'h' }">
          <r-cal-bar
            v-for="(days, index) in barView.daysArray"
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
<script>
  import CalendarBar from 'com/demo/CalendarBar'
  import CalendarPane from 'com/demo/CalendarPane'
  import dateUtil from 'ut/dateUtil'

  export default {
    name: 'Calendar',
    data () {
      return {
        selectDate: null,  //  当前选中（高亮显示）的日期
        topBase: 0,  //  顶部的高度，bar和pane都相对于此高度
        titleHeight: 31,
        barView: {
          type: 'bar',
          focusDate: null,  //  bar中当前周中的一个日期
          daysArray: [], //  有当前周、前一个周、后一个周三个数组组成
          height: 50,
          translateX: '0px',  //  需要带上单位，可能为%
          targetY: 0  //  barView状态下垂直滑动元素垂直方向的translateY目标值
        },
        paneView: {
          type: 'pane',
          focusDate: null,  //  pane中当前月份中的一个日期
          daysArray: [],  //  有当前月份、前一个月份、后一个月份三个数组组成
          height: 240,
          translateX: '0px',
          targetY: 0  //  paneView状态下垂直滑动元素垂直方向的translateY目标值
        },
        currentView: {},
        direction: {2: 'h', 4: 'h', 8: 'v', 16: 'v'},  //  2和4表示横向移动，8和16表示纵向移动
        currentLock: null,  //  方向锁，防止在pan上下移动的同时发生左右移动
        transDirection: null,  //  当前正在进行中的transition的方向，v表示垂直方向，hBar表示bar的水平方向，hPane表示pane的水平方向
        isShowBar: false,

        translateY: 0,
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
      todayValue () {
        return this.clearTime(new Date()).getTime()
      },
      isToday () {
        if (!this.selectDate) {
          return false
        }
        return this.selectDate.getTime() === this.todayValue
      },
      heightDiff () {
        return this.paneView.height - this.barView.height
      },
      paneLine () {
        //  获取当前显示的月试图中的周的行数
        return this.paneView.daysArray[1].length
      },
      paneLineHeight () {
        return this.paneView.height / this.paneLine
      },
      //  bar中的日期是当前pane的第几行
      barPaneIndex () {
        if (this.barView.daysArray.length === 0 || this.paneView.daysArray.length === 0) {
          return 999
        }
        var barTime = this.barView.daysArray[1][0].date.getTime()
        for (let i = 0; i < this.paneView.daysArray[1].length; i++) {
          var paneTime = this.paneView.daysArray[1][i][0].date.getTime()
          if (barTime >= paneTime && barTime < paneTime + 7 * 24 * 3600 * 1000) {
            return i
          }
        }
        return 9999
      },
      //  计算补偿间隙。由于默认日历月份上按照5行（5周）计算的，假设当前的月份有6行（6周），那么每一行的高度会比默认高度小，
      //  padding表示默认高度减去6行时的高度之后再除以2的值
      halfPad () {
        return (this.barView.height - this.paneView.height / this.paneLine) / 2
      },
      marginY () {
        return this.barPaneIndex * this.paneLineHeight - this.halfPad
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
        this.resetView(this.anotherView, {focusDate: date})
        this.barView.targetY = -this.marginY
        //  如果是在pane的状态下点击的，那么还每次点击需要reset bar
//        if (this.isPane) {
//          this.resetView(this.barView, {focusDate: date})
//        }
        this.$emit('click-cal-day', date)
      },
      backToToday () {
        var today = this.clearTime(new Date())
        this.resetAllViews({focusDate: today})
        this.triggerSelectDate(today)
      },
      firstDayOfView (type, date, offset) {
        return type === 'bar' ? dateUtil.firstDayOfWeek(date, offset) : dateUtil.firstDayOfMonth(date, offset)
      },
      getViewDays (type, date) {
        return type === 'bar' ? dateUtil.getWeekDays(date) : dateUtil.getMonthDays(date)
      },
      resetDays (type, focusDate) {
        //  isBar时，获取前一、当前、后一三周的数据
        //  isPane时，获取前一、当前、后一三月的数据
        return [
          this.getViewDays(type, this.firstDayOfView(type, focusDate, -1)),
          this.getViewDays(type, this.firstDayOfView(type, focusDate, 0)),
          this.getViewDays(type, this.firstDayOfView(type, focusDate, 1))
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
        if (absY > this.heightDiff) {
          return
        }

        switch (ev.offsetDirection) {
          case 2:
          case 4:
            var deltaX = ev.deltaX
            this.currentView.translateX = deltaX + 'px'
            break
          case 8:
          case 16:
            if (this.isBar) {
              this.isShowBar = false
            }
            this.calHeight = this.currentView.height + deltaY
            this.translateY = this.currentView.targetY + this.marginY * deltaY / this.heightDiff
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

        //  如果滑动距离超过20像素，那么就跳转到下一个页面
        //  否则返回原来位置
        if (Math.abs(delta) > 20 && ev.type === 'panend') {
          direction = delta > 0 ? 1 : -1
          this.currentView.translateX = direction * 100 + '%'
        } else {
          direction = 0
          this.currentView.translateX = 0 + 'px'
        }
        var v = this.currentView
        v.focusDate = this.firstDayOfView(v.type, v.focusDate, -direction)
      },
      transY (ev) {
        var delta = ev.deltaY

        //  如果是bar且向上滑动，pane且向下滑动，均禁止
        if (this.isBar && delta < 0 || this.isPane && delta > 0) {
          this.transDirection = null
          return
        }

        //  如果滑动距离超过20像素，那么就跳转到另外一个view
        //  否则，回到原view
        if (Math.abs(delta) > 20 && ev.type === 'panend') {
          this.calHeight = this.anotherView.height
          this.translateY = this.anotherView.targetY
        } else {
          this.calHeight = this.currentView.height
          this.translateY = this.currentView.targetY
        }
      },
      resetAllAndEmitEvent () {
        this.resetAllViews({focusDate: this.currentView.focusDate})
        this.barView.targetY = -this.marginY
        this.$emit('after-cal-swipe', {type: this.currentView.type, daysArray: this.currentView.daysArray})
      },
      resetView (view, params) {
        this.transDirection = null
        if (params && params.focusDate) {
          view.focusDate = params.focusDate
        }
        view.daysArray = this.resetDays(view.type, view.focusDate)
        view.translateX = 0 + 'px'
      },
      resetAllViews (params) {
        this.resetView(this.barView, params)
        this.resetView(this.paneView, params)
      },
      resetViewType () {
        //  如果是垂直滑动，那么进行处理
        if (this.transDirection === 'v') {
          this.transDirection = null
          this.currentView = this.anotherView
          if (this.isBar) {
            this.isShowBar = true
          }
        }
      }
    },
    mounted () {
      //  初始化工作
      this.resetAllViews({focusDate: this.defaultSelectDate})
      this.barView.targetY = -this.marginY
      this.paneView.targetY = 0
      this.currentView = this.barView
      this.isShowBar = true
      this.calHeight = this.currentView.height
      this.translateY = this.currentView.targetY
      this.$emit('cal-ready', {type: this.currentView.type, daysArray: this.currentView.daysArray})
      this.triggerSelectDate(this.defaultSelectDate)

      //  给周视图加动画结束的方法
      var ele1 = document.getElementById('hMoveBar')
      ele1.addEventListener('transitionend', this.resetAllAndEmitEvent)
      ele1.addEventListener('webkitTransitionEnd', this.resetAllAndEmitEvent)

      //  给月视图加动画结束的方法
      var ele2 = document.getElementById('hMovePane')
      ele2.addEventListener('transitionend', this.resetAllAndEmitEvent)
      ele2.addEventListener('webkitTransitionEnd', this.resetAllAndEmitEvent)

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
    position: fixed;left: 0;right: 0;top:84px;padding:0;overflow:hidden;
  }
  .cal-outer {position:relative;width:100%;overflow:visible;}
  .cal-inner {
    overflow: visible;white-space:nowrap;
  }
  div.cal-inner-pane {
    position: fixed;margin-left: -100%;width:100%;
  }
  div.cal-inner-bar {
    position: fixed;margin-left: -100%;width: 100%;
  }
  .animate {
    transition: all 0.3s ease, height 0.3s ease;
  }
</style>
