<template>
  <div class="router-view content--cal" style="padding-top: 81px;box-sizing:border-box;">
    <r-calendar
      @click-cal-day="fetchItems"
      @after-cal-swipe="fetchDatesHasTodo"
      :default-select-date="dateSelect"
    ></r-calendar>
    <r-todo-item-list
      :items="items"
      :is-checkable="true"
      v-if="items.length!==0"
    ></r-todo-item-list>
    <div class="itm-lst" v-else>
      <img src="../../assets/img/todo-empty.png" alt="">
      <p class="shouye">还没有日程，赶快去创建吧</p>
    </div>
  </div>
</template>
<script>
  import Calendar from 'com/sche/Calendar'
  import TodoItemList from 'com/sche/TodoItemList'
  import moment from 'moment'

  export default {
    name: 'ScheduleView',
    data () {
      return {
        titleName: '日程',
        currentDate: new Date()
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
      'r-todo-item-list': TodoItemList
    },
    methods: {
      formatTitleDate (date) {
        return date.getFullYear() + '年' + (date.getMonth() + 1) + '月'
      },
      fetchItems (strDate) {
        console.log('fetchItems传进来的strdate是' + strDate)
        window.rsqadmg.exec('setTitle', {title: this.formatTitleDate(strDate)})
        this.$store.dispatch('fetchScheduleItems', { strDate })
      },
      fetchDatesHasTodo (p) {
        //  给日期加角标，值计算p.daysArray中的中间一个数组
        var weekArray = p.daysArray[1]
        //  如果dateSelect已经显示，则设置为dateSelect的月份，否则设置标题为当周所在的月份，以当周的第一天为准
        var numDate = this.dateSelect.getTime()
        var firstDate = weekArray[0].date
        var lastDate = weekArray[weekArray.length - 1].date
        var titleDate = firstDate
        if (numDate > firstDate.getTime() && numDate < lastDate.getTime()) {
          titleDate = this.dateSelect
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
    }
  }
</script>
<style scoped>
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
</style>
