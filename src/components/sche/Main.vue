<template>
  <div class="router-view content--cal">
    <r-calendar
      @click-cal-day="fetchItems"
      :default-select-date="dateSelect"
    ></r-calendar>
    <r-todo-item-list
      :items="items"
      :is-checkable="true"
      v-if="items != null && items.length > 0"
    ></r-todo-item-list>
    <div class="itm-lst" v-else>
      <img src="../../assets/日程.png" alt="">
      <p class="shouye">还没有日程，赶快去创建吧</p>
    </div>
    <!--<div class="float-action-button" v-touch:tap="showCreate">-->
    <!--<i class="icon icon-add"></i>-->
    <!--</div>-->
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
        titleName: '日程'
      }
    },
    computed: {
      dateSelect () {
        var strDate = this.$store.state.schedule.strCurrentDate
        return strDate ? moment(strDate, 'YYYY-MM-DD').toDate() : new Date()
      },
      items () {
        return this.$store.state.schedule.items
      }
    },
    components: {
      'r-calendar': Calendar,
      'r-todo-item-list': TodoItemList
    },
    methods: {
      fetchItems (strDate) {
        this.$store.dispatch('fetchScheduleItems', strDate)
      }
    },
    mounted () {
      window.rsqadmg.exec('setTitle', {title: this.titleName})
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
      this.$store.dispatch('setNav', true)
    }
  }
</script>
<style scoped>
  .itm-lst{
    text-align: center;
  }
  .shouye{
    margin-top:15.7px;

  }
  img{
    width: 70px;
    height: 70px;
    margin-top:137px ;
  }
</style>
