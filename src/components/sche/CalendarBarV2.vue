<template>
  <div
    :style="{'left': barOffsetStyle}"
    class="cal-bar">
    <table class="cal-table">
      <tr>
        <td
          v-for="day in days"
          :key="day.date.getTime()"
          class="cal-weekday">
          <v-touch
            :class="{'cal-day--focus': isHighLight(day.date)}"
            class="cal-day"
            @tap="calDayClick(day.date)">
            <div
              :class="{'tag-active': day.showTag&&!isHighLight(day.date)}"
              class="cal-day-tag" />
            {{ dateText(day) }}
          </v-touch>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
  export default {
    name: 'CalendarBar',
    props: {
      days: {
        type: Array,
        required: true
      },
      barIndex: {
        type: Number,
        required: true
      },
      highlightDay: {
        type: Date,
        required: true
      },
      todayValue: {
        type: Number,
        required: true
      }
    },
    data () {
      return {}
    },
    computed: {
      barOffsetStyle () {
        return (this.barIndex * 100) + '%'
      }
    },
    methods: {
      dateText (day) {
        //  如果是当天，则显示“今”这个字
        return this.todayValue === day.date.getTime() ? '今' : day.date.getDate()
      },
      isHighLight (date) {
        return this.highlightDay != null && date.getTime() === this.highlightDay.getTime()
      },
      calDayClick (date) {
        this.$store.commit('SCH_TODO_CACHE_DELETE_ALL')
        if (date.getTime() !== this.highlightDay.getTime()) {
          this.$emit('click-cal-bar-day', date)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../assets/css/variables.scss';
  .cal-bar {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;display: inline-block;
    /*background: #F00;*/
    background: #4F77AA;
  }
  .cal-table {
    border-collapse: collapse;
    text-align: center;
    border-spacing: 0;
    table-layout: fixed;
    width: 100%;
    height: 100%;
  }
  .cal-weekday {
    position:relative;
    font-family: PingFangSC-Medium;
    font-size: 11px;
    color: #FFFFFF;
    line-height: 12px;
  }
  .cal-day-tag {position:absolute;top:-7px;right: 13px;border-radius:50%;}
  .tag-active {width:4px;height:4px;background:#30FFA8;}
  .cal-day {
    margin:0 auto;
    width:30px;
    height:30px;
    line-height:30px;
    font-family: PingFangSC-Medium;
    font-size: 15px;
    color: #FFFFFF;
    position: relative;
  }
  .cal-day--focus {
    background:white;
    color:#479AEF;
    border-radius: 50%;
    font-size: 17px;
  }
</style>
