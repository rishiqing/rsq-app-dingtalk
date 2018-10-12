<template>
  <div class="date-picker">
    <div class="dp-title">
      <v-touch
        class="icon icon-keyboard_arrow_left"
        tag="i"
        @tap="tapChangeMonth($event, -1)"/>
      <div class="dp-title-text">
        {{ focusDate.getFullYear() }}年{{ focusDate.getMonth() + 1 }}月
      </div>
      <v-touch
        tag="i"
        class="icon icon-keyboard_arrow_right"
        @tap="tapChangeMonth($event, 1)"/>
    </div>
    <div class="dp-content">
      <table class="dp-table">
        <tr>
          <th class="week">日</th>
          <th class="week">一</th>
          <th class="week">二</th>
          <th class="week">三</th>
          <th class="week">四</th>
          <th class="week">五</th>
          <th class="week">六</th>
        </tr>
        <tr
          v-for="(weekArray, index) in days"
          :key="index">
          <v-touch
            v-for="day in weekArray"
            :key="day.date.getTime()"
            tag="td"
            @tap="tapDay($event, day)">
            <div
              :class="{'dp-grey': !day.isInMonth, 'dp-selected': day.isSelected}"
              class="dp-day">
              {{ day.date.getTime() === numToday ? '今' : day.date.getDate() }}
            </div>
          </v-touch>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
  import dateUtil from 'ut/dateUtil'

  export default {
    name: 'PlainDatePicker',
    props: {
      //  初始显示的月份中的任意一天，如果不传值，那么显示今天所在的月份
      focusDateNumber: {
        type: Number,
        default: new Date().getTime()
      },
      //  默认选中的天，是一个数组，数组元素是选中的天的毫秒数，可以传入多个值
      selectedDateNumber: {
        type: Array,
        default () {
          return []
        }
      },
      multiSelect: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        focusDate: new Date(),
        localSelectedArray: [],
        days: []
      }
    },
    computed: {
      numToday () {
        return dateUtil.clearTime(new Date()).getTime()
      }
    },
    mounted () {
      //  初始化本地所需的变量
      this.focusDate = new Date(this.focusDateNumber || new Date().getTime())
      this.selectedDateNumber.forEach(n => {
        this.localSelectedArray.push(n)
      })
      //  生成月份的数据
      this.renderMonth()
    },
    methods: {
      /**
       * 生成月份的数据分为两步：
       * 1  根据this.focusDate生成所在月份的所有日期
       * 2  根据this.localSelectedArray判断显示选中的日期
       * @param offset
       */
      renderMonth (offset) {
        this.resetMonth(offset)
        this.selectDays()
      },
      resetMonth (offset) {
        this.focusDate = dateUtil.firstDayOfMonth(this.focusDate, offset)
        this.days = dateUtil.getMonthDays(this.focusDate)
      },
      selectDays () {
        this.days.forEach(array => {
          array.forEach(obj => {
            obj.isSelected = this.localSelectedArray.indexOf(obj.date.getTime()) !== -1
          })
        })
      },
      tapChangeMonth (e, offset) {
        this.renderMonth(offset)
        e.preventDefault()
      },
      tapDay (e, day) {
        //  如果只能单选，那么就先清除所有选择
        if (!this.multiSelect) {
          this.clearSelected()
        }
        day.isSelected = !day.isSelected
        const time = day.date.getTime()
        if (day.isSelected) {
          this.localSelectedArray.push(time)
        } else {
          const index = this.localSelectedArray.indexOf(time)
          if (index !== -1) {
            this.selectNumDate.splice(index, 1)
          }
        }
        this.$emit('date-select-changed', this.localSelectedArray)
        e.preventDefault()
      },
      clearSelected () {
        this.localSelectedArray = []
        this.days.forEach(array => {
          array.forEach(obj => {
            obj.isSelected = false
          })
        })
      }
    }
  }
</script>
<style scoped>
  table {
    border-collapse: collapse;
  }
  table th {
    border-bottom: solid 1px #EAEAEA;
  }
  table td {
    border: solid 1px #EAEAEA;
  }
  table tr:last-child td {
    border-bottom: 0;
  }
  table tr td:first-child{
    border-left: 0;
  }
  table tr td:last-child{
    border-right: 0;
  }
  .date-picker {font-size: 14px; color: #3D3D3D;width: 100%;}
  .dp-table {width:100%;}
  .dp-table td {position: relative;}
  .dp-day {margin:0 auto;width: 100%;height:44px;line-height:44px;text-align: center;}
  .week {height: 44px;line-height: 44px;font-weight: normal;color: #999998;}
  .dp-title {
    display: flex;
    justify-content: center;
    padding: 14px 0;
  }
  .dp-title i {
    font-size: 18px;
  }
  .dp-title-text {
    margin: 0 30px;font-size: 18px;
  }
  .dp-day.dp-grey {
    color: rgba(25,31,37,0.40);
  }
  .dp-day.dp-selected {
    background: #55A8FD; color:#FFFFFF;
  }
</style>
