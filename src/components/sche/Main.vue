<template>
  <div class="router-view content--cal">
    <r-calendar
      @click-cal-day="fetchItems"
      @after-cal-swipe="fetchDatesHasTodo"
      :default-select-date="dateSelect"
    ></r-calendar>
    <r-todo-item-list
      :items="items"
      :is-checkable="true"
      v-if="items != null"
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
        if (items !== null) {
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
        }
      },
      dateString () {
        return this.currentDate.getFullYear() + '年' + (this.currentDate.getMonth() + 1) + '月'
      }
    },
    components: {
      'r-calendar': Calendar,
      'r-todo-item-list': TodoItemList
    },
    methods: {
      fetchItems (strDate) {
        this.$store.dispatch('fetchScheduleItems', { strDate })
      },
      fetchDatesHasTodo (p) {
        //  给日期加角标，值计算p.daysArray中的中间一个数组
        var weekArray = p.daysArray[1]

        this.$store.dispatch('getDatesHasTodo', {
          startDate: weekArray[0].date,
          endDate: weekArray[weekArray.length - 1].date})
          .then(res => {
            weekArray.forEach(day => {
              if (res.indexOf(String(day.date.getTime())) !== -1) {
                this.$set(day, 'showTag', true)
              }
            })
          })
      }
    },
    mounted () {
      window.rsqadmg.exec('setTitle', {title: this.dateString})
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
