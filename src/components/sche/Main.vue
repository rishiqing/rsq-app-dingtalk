<template>
  <div id="calMain"
       class="router-view content--cal calendar"
       style="box-sizing:border-box;"
       :class="{'animate': isShowAnimate}"
       :style="{'padding-top': paddingTop + 'px'}">
    <r-calendar
      @click-cal-day="fetchItems"
      @after-cal-swipe="fetchDatesHasTodo"
      @on-cal-pan="onPanMove"
      @on-cal-pan-end="onPanEnd"
      :default-select-date="dateSelect"
    ></r-calendar>
    <r-pull-to-refresh
      :enabled="enablePullToRefresh"
      @on-list-pan-move="checkScroll"
      @on-pull-down="pullRefresh">
      <r-todo-item-list
        :items="items"
        :is-checkable="true"
        v-if="items.length!==0"
      ></r-todo-item-list>
      <div class="itm-lst" v-else>
        <img src="../../assets/img/todo-empty.png" alt="">
        <p class="shouye">还没有日程，赶快去创建吧</p>
      </div>
    </r-pull-to-refresh>
  </div>
</template>
<script>
  import Calendar from 'com/sche/CalendarV2'
  import Pull from 'com/pub/Pull2Refresh'
  import TodoItemList from 'com/sche/TodoItemList'
  import moment from 'moment'

  const CAL_STATE = {
    bar: {
      value: 81
    },
    pane: {
      value: 271
    }
  }

  export default {
    name: 'ScheduleView',
    data () {
      return {
        titleName: '日程',
        currentDate: new Date(),
        paddingTop: CAL_STATE['bar'].value,
        isShowAnimate: false,
        enablePullToRefresh: false
      }
    },
    computed: {
      dateSelect () {
        var strDate = this.$store.state.schedule.strCurrentDate
        return strDate ? moment(strDate, 'YYYY-MM-DD').toDate() : new Date()
      },
      items () {
        var items = this.$store.state.schedule.items
        var newItems = []
//        console.log(JSON.stringify(items))
        if (items !== null && items.length !== 0) {
          for (var i = 0; i < items.length; i++) {
            if (!items[i].pIsDone) {
              newItems.push(items[i])
            }
          }
          for (i = 0; i < items.length; i++) {
            if (items[i].pIsDone) {
              newItems.push(items[i])
            }
          }
          return newItems
        } else {
          return []
        }
      }
    },
    components: {
      'r-calendar': Calendar,
      'r-pull-to-refresh': Pull,
      'r-todo-item-list': TodoItemList
    },
    methods: {
      onPanMove (p) {
        this.paddingTop = CAL_STATE[p.type].value + p.deltaY
      },
      onPanEnd (p) {
        this.paddingTop = CAL_STATE[p.targetType].value
        this.isShowAnimate = true
      },
      checkScroll (p) {
//        console.log('-========')
//        this.enablePullToRefresh = false
//        var main = document.getElementById('calMain')
//        main.scrollTop = -p.deltaY
      },
      updateScroll () {
        //  获取列表后，始终错位一个像素，保证上拉刷新
//        console.log('=@_@===---------===#_#=')
//        this.$nextTick(() => {
//          var main = document.getElementById('calMain')
//          main.scrollTop = 50
//          if (main.scrollTop === 0) {
//            this.enablePullToRefresh = true
//          }
//        })
      },
      formatTitleDate (date) {
        return date.getFullYear() + '年' + (date.getMonth() + 1) + '月'
      },
      fetchItems (strDate) {
//        window.rsqadmg.exec('setTitle', {title: this.formatTitleDate(strDate)})
        this.$store.dispatch('fetchScheduleItems', { strDate })
          .then(() => {
            this.updateScroll()
          })
      },
      pullRefresh (cb) {
        this.enablePullToRefresh = false
        this.$store.dispatch('fetchScheduleItems', { strDate: this.dateSelect, sync: true })
          .then(() => {
            cb()
            this.updateScroll()
          })
      },
      fetchDatesHasTodo (p) {
        //  如果dateSelect已经显示，则设置为dateSelect的月份，否则设置标题为当周所在的月份，以当周的第一天为准
//        var numDate = this.dateSelect.getTime()
//        var titleDate = firstDate
//        if (numDate > firstDate.getTime() && numDate < lastDate.getTime()) {
//          titleDate = this.dateSelect
//        }
        //  如果是bar，显示的月份以周三所在的日期为准，如果是pane，则直接说当月
        var titleDate
        //  给日期加角标，值计算p.daysArray中的中间一个数组
        var weekArray = p.daysArray[1]
        var firstDate
        var lastDate
        if (p.type === 'bar') {
          firstDate = weekArray[0].date
          lastDate = weekArray[weekArray.length - 1].date
          titleDate = weekArray[3].date
        } else {
          firstDate = weekArray[0][0].date
          lastDate = weekArray[weekArray.length - 1][6].date
          titleDate = weekArray[1][0].date
        }
        window.rsqadmg.exec('setTitle', {title: this.formatTitleDate(titleDate)})

        this.$store.dispatch('getDatesHasTodo', {
          startDate: firstDate,
          endDate: lastDate
        }).then(res => {
          weekArray.forEach(day => {
            if (res.indexOf(String(day.date.getTime())) !== -1) {
              this.$set(day, 'showTag', true)
            }
          })
        })
      }
    },
    mounted () {
      window.rsqadmg.exec('setTitle', {title: this.formatTitleDate(this.dateSelect)})
      var btnParams
      var that = this
      btnParams = {
        btns: [{key: 'toInbox', name: '收纳箱'}],
        success (res) {
          if (res.key === 'toInbox') {
            that.$router.push('/inbox')
          }
        }
      }
      window.rsqadmg.execute('setOptionButtons', btnParams)
      this.$store.dispatch('setNav', {isShow: true})

      var main = document.getElementById('calMain')
      main.addEventListener('transitionend', () => {
        this.isShowAnimate = false
      })
      main.addEventListener('webkitTransitionEnd', () => {
        this.isShowAnimate = false
      })
//      main.addEventListener('scroll', () => {
//        if (main.scrollTop === 0) {
//          this.enablePullToRefresh = true
//        }
//      })
//      main.scrollTop = 10
    }
  }
</script>
<style scoped>
  .calendar {
    overflow-y: auto;
  }
  .itm-lst{
    text-align: center;
    background-color: #F8F8F8;
    height: 78%;
  }
  img{
    width: 1.866rem;
    height: 1.866rem;
    margin-top:3.653rem ;
  }
  .shouye{
    padding: 0;
    margin:0;
    margin-top:0.418rem;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #55A8FD;
    letter-spacing: 0
  }
  img{
    width: 70px;
    height: 70px;
    margin-top:137px ;
  }
  .animate {
    transition: padding-top 0.3s ease;
  }
</style>
