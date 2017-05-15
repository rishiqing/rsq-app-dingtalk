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
      <div class="itm-outer">
        <div class="itm-placeholder">当天没有日程安排</div>
      </div>
    </div>
    <!--<div class="float-action-button" v-touch:tap="showCreate">-->
    <!--<i class="icon icon-add"></i>-->
    <!--</div>-->
  </div>
</template>
<script>
  import Calendar from 'com/sche/Calendar';
  import TodoItemList from 'com/sche/TodoItemList';

  import moment from 'moment';

  export default {
    name: 'ScheduleView',
    data () {
      return {
        titleName: '日程'
      }
    },
    computed: {
      dateSelect () {
        var strDate = this.$store.state.schedule.strCurrentDate;
        return  strDate? moment(strDate, 'YYYY-MM-DD').toDate() : new Date();
      },
      items(){
        return this.$store.state.schedule.items;
      },
      itemCount(){
        return this.$store.state.schedule.items ? this.$store.state.schedule.items.length : -1
      }
    },
    components: {
      'r-calendar': Calendar,
      'r-todo-item-list': TodoItemList
    },
    methods: {
      fetchItems(strDate){
        this.$store.dispatch('fetchScheduleItems', strDate)
      },
      showCreate(){
        this.$router.push('/todo/new/schedule');
      }
    },
    mounted () {
      rsqadmg.exec('setTitle', {title: this.titleName});
      var btnParams;
      var that = this;
      btnParams = {
        btns: [{key: 'toInbox', name: '收纳箱'}],
        success: function(res){
          if(res.key == 'toInbox'){
            that.$router.push('/inbox');
          }
        }
      };
      rsqadmg.execute('setOptionButtons', btnParams);
      this.$store.dispatch('setNav', true)
    }
  }
</script>
