<template>
  <div class="select-date-deadline">
    <div class="head-deadline">
      <v-touch @tap="hideRepeat" class="wrap-cancel">
        <span class="cancel">取消</span>
      </v-touch>
      <span class="title">截止日期</span>
      <v-touch @tap="saveDeadline" class="wrap-cancel">
        <span class="confirm">确定</span>
      </v-touch>
    </div>
    <div class="dp-title-deadline">
      <!--<div class="dp-title-tag u-pull-left" @click="tapEmpty($event)">空</div>-->
      <!--<div class="dp-title-tag u-pull-right" @click="tapBackToday($event)">今</div>-->
      <div class="deadline-wrap">
        <div tag="i" class="icon icon-keyboard_arrow_left deadline-arrow"
             @click="tapChangeMonth($event, -1)"></div>
        <div class="dp-title-text-deadline">
          {{focusDate.getFullYear()}}年{{focusDate.getMonth() + 1}}月
        </div>
        <div tag="i" class="icon icon-keyboard_arrow_right deadline-arrow"
             @click="tapChangeMonth($event, 1)"></div>
      </div>
    </div>
    <div class="dp-content">
      <table class="dp-table">
        <thead>
        <tr>
          <td  class="week">周日</td>
          <td  class="week">周一</td>
          <td  class="week">周二</td>
          <td  class="week">周三</td>
          <td  class="week">周四</td>
          <td  class="week">周五</td>
          <td  class="week">周六</td>
        </tr>
        <tr class="deadline-distance">
          <td> </td>
          <td> </td>
          <td> </td>
          <td> </td>
          <td> </td>
          <td> </td>
          <td> </td></tr>
        </thead>
        <tbody>
        <tr v-for="weekArray in days">
          <td v-for="day in weekArray" :key="day.date.getTime()"
              @click="tapDay($event, day)">
            <div class="dp-day"
                 :class="{'dp-grey': !day.isInMonth, 'dp-selected': day.isSelected,'is-today':isToday(day)}">
              {{day.date.getTime() === numToday ? '今' : day.date.getDate()}}
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <!--<div class="wrap-button-date">-->
        <!--<button class="today" @click="backToToday">今天</button>-->
        <!--<button class="clear-date" @click="clear">清除</button>-->
      <!--</div>-->
    </div>
    <div class="deadline-bottom">
      <span class="never">永不截止</span>
      <v-touch @tap="toggleAllDay">
        <input class="mui-switch dealine-switch" type="checkbox">
      </v-touch>
    </div>
    <div class="another-bottom">
      <span class="another-bottom-text">{{deadlineText}}</span>
    </div>
  </div>
</template>
<style lang="scss">
  .deadline-distance{
    height: 0.3rem;
  }
  .another-bottom{
    height: 1.5rem;
  }
  .another-bottom-text{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #48A1FA;
    margin-left: 0.3rem;
  }
  div.deadline-bottom .dealine-switch {
    top: 0.3rem
  }
  .deadline-bottom{
    height: 1.5rem;
    display: flex;
    align-items: center;
    position: relative;
    border-bottom: 1px solid #E0E0E0
  }
  .head-deadline{
    display: flex;
    align-items: center;
    border-bottom: 1px solid #E0E0E0;
    padding: 0.5rem;
    justify-content: space-between;
  }
  .wrap-cancel{
    display: flex;
    align-items: center;
  }
  .deadline-wrap{
    width:60%;
    display: flex;
    align-items: center;
    padding-left: 1rem;
    margin: 0.9rem 0 0.5rem 0;
  }
  .deadline-arrow{
    font-size: 20px;
  }
  .bottom{
    position: relative;
    display: flex;
    align-items: center;
    height: 2rem;
  }
  .never{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #3D3D3D;
    margin-left: 0.3rem;
  }
  .wrap-button-date{
    display: flex;
    align-items: center;
    margin-top: 10px;
  }
  .clear-date,.today{
    display: inline-block;
    width: 94px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #D5D5D5;
    border-radius: 2px;
    margin-left: 20px;
    background-color: white;
    cursor: pointer;
    font-family: AppleSystemUIFont;
    font-size: 12px;
    color: #666666;
  }
  .select-date-deadline .dp-content tbody{
    margin-top: 20px;
  }
  .select-date-deadline thead{
    margin-bottom: 10px;
  }
  .select-date-deadline{
    /*position: absolute;*/
    /*top: 10px;*/
    background-color: white;
    z-index: 103;
    /*height: 290px;*/
    box-shadow: 0 1px 5px 0 rgba(114,175,225,0.45);
  }
  .repeat-style-wrap-show{
    width: 20px;
    font-size: 14px;
    list-style: none;
  }
  .repeat-style-wrap{
    /*padding: 0;*/
    /*margin: 0;*/
    list-style: none;
    font-size: 14px;
  }
  .repeat-deadline{
    font-size: 14px;
  }
  .repeat-style{
    font-size: 14px;
  }
  .dp-sel-type .is-active{
    color: #3D3D3D;
    font-size: 14px;
  }
  .select-date-deadline .dp-content .dp-table .is-today{
    color:white;
    background: rgba(59,155,251,0.29);
  }
  .edit-date {
  .light-color {color: #999999;}
  .date-picker {
    /*box-sizing: border-box;margin-top: 0.25rem;background: #fff;*/
    /*border-top: 1px solid #E0E0E0;*/
    /*border-bottom:1px solid #E0E0E0 ;*/
    /*padding-bottom: 0.4rem;*/
  }
  .dp-title-deadline {
    height: 30px;
    display: flex;
    align-items: center;
    margin-bottom: 15px;
   justify-content: center;
  }
  .dp-title-text-deadline {
    /*text-align: center;*/
    /*font-family: PingFangSC-Regular;*/
    width: 60%;
    font-family: AppleSystemUIFont;
    font-size: 17px;
    color: #3D3D3D;
    text-align: center;
    /*color: #3D3D3D;*/
  }
  .dp-title .icon {
    font-size:14px;
    color: #333333;
    cursor: pointer;
  }
  /*.dp-title .dp-title-tag {font-size: 0.4rem;line-height:1;margin-top:12px;padding:5px;border: solid 1px #e8e8e8;border-radius: 50%;}*/
  .dp-table {width:100%;text-align: center;}
  .dp-grey {color: #a8a8a8;}
  .select-date-deadline .dp-table .dp-selected {
    background: #3B9BFB;
    color:white;}
  .dp-sel-type {position: relative;border-bottom: solid 1px #e4e4e4;overflow: hidden;
    height: 40px;line-height: 40px;}
  /*.dp-btn {*/
    /*cursor: pointer;*/
    /*float: left;*/
    /*width: 23%;*/
    /*text-align: center;*/
    /*font-family: PingFangSC-Regular;*/
    /*font-size: 12px;*/
    /*!*color: #666666;*!*/
    /*line-height: 40px;}*/
  .dp-v-line {
    float: left;
    position: relative;
    /*width: 2%;*/
    color: #F0F0F0;
    text-align: center;
    height: 100%;
    /*font-size: 2.8rem;}*/
  }
  .week{
    font-family: PingFangSC-Regular;
    font-size: 11px;
    color: #B1B1B1;
  }
  .select-date-deadline div.dp-day {
    margin:0 auto;
    /*width:30px;*/
    /*height:30px;*/
    /*line-height:30px;*/
    text-align: center;
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #3D3D3D;
  }
  .arrow{
    font-size:17px;
    color: #999999;
  }
  .date-repeat{
    position: relative;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    margin-top: 0.25rem;
    padding: 0 0.4rem;
    background-color: white;
    align-items: center;
    border-top: 1px solid #E0E0E0;
    border-bottom:1px solid #E0E0E0;
    font-family: PingFangSC-Regular;
    font-size: 17px;
  }
  span.list-value {margin-right:0.2rem;
    max-width:7rem;overflow:hidden;text-overflow: ellipsis;white-space: nowrap;
  }
  .date-repeat > * {
    line-height: 1.2rem;
  }
  .date-clear {
    color: #A3B2C2;
    text-align: center;
    line-height: 1.8rem;
    font-size: 0.4rem;
  }
    .mui-switch {
      width: 52px;
      height: 31px;
      position: absolute;
      top:0.55rem;
      right:0.3rem;
      border: 1px solid #dfdfdf;
      /*background-color: #fdfdfd;*/
      background: #E3E3E3;
      box-shadow: #dfdfdf 0 0 0 0 inset;
      border-radius: 20px;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
      background-clip: content-box;
      display: inline-block;
      -webkit-appearance: none;
      user-select: none;
      outline: none; }
    .mui-switch:before {
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
    .mui-switch:checked {
      border-color: #67B2FE;
      box-shadow: #67B2FE 0 0 0 16px inset;
      background-color: #67B2FE; }
    .mui-switch:checked:before {
      left: 21px; }
    .mui-switch.mui-switch-animbg {
      transition: background-color ease 0.4s; }
    .mui-switch.mui-switch-animbg:before {
      transition: left 0.3s; }
    .mui-switch.mui-switch-animbg:checked {
      box-shadow: #dfdfdf 0 0 0 0 inset;
      background-color: #67B2FE;
      transition: border-color 0.4s, background-color ease 0.4s; }
  }
</style>

<script>
  import dateUtil from 'ut/dateUtil'
  export default {
    data () {
      return {
        compId: 'SYSTEM_SELECT_DATE',
        weeks: ['日', '一', '二', '三', '四', '五', '六'],
        months: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
        focusDate: new Date(),  //  表示当前显示的月份，决定了当前显示哪个月份的日历
        days: [],
        selectNumDate: null,
        dateType: '',
        select: true
      }
    },
    props: {
    },
    componnets: {
    },
    computed: {
      deadlineText () {
        return this.repeat.repeatOverDate ? this.repeat.repeatOverDate.substring(0, 10) : '永不截止'
      },
      repeat () {
        return this.$store.state.repeat
      },
      numToday () {
        return dateUtil.clearTime(new Date()).getTime()
      },
      currentTodo () {
        return this.$store.state.todo.currentTodo
      },
      isEdit () {
        return !!this.currentTodo.id
      },
      currentTodoDate () {
        return this.$store.state.pub.currentTodoDate
      },
      weekDate () {
        return this.$store.state.weekDate
      },
      repeatText () {
        var text
        var c = this.currentTodoDate
        if (this.dateType === 'repeat' && c.repeatType) {
          var arr = this.currentTodoDate.repeatBaseTime.split(',')
          text = dateUtil.repeatDayText(c.repeatType, arr)
          if (c.isLastDate) {
            text += '、最后一天'
          }
        }
        return (text || '不') + '重复'
      }
    },
    methods: {
      toggleAllDay () {
        this.select = !this.select
        this.clearSelected()
      },
      hideRepeat () {
        this.$emit('hideDeadline')
      },
      saveDeadline () {
        var that = this
        this.days.forEach(function (array) {
          array.forEach(function (obj) {
            if (obj.isSelected) {
              that.$store.state.repeat.repeatOverDate = dateUtil.getStandardTime(obj.date)
              console.log(that.$store.state.repeat.repeatOverDate)
            }
          })
        })
        if (this.select) {
          this.$store.state.repeat.repeatOverDate = null
        }
        this.$emit('hideDeadline')
      },
      clear () {
        this.$emit('selectedDate', {date: '永久'})
      },
      isToday (day) {
        return day.date.getTime() === this.numToday
      },
      initData () {
        var dateStruct = dateUtil.backend2frontend(this.currentTodoDate)
        console.log('处理过后的dateStruct是' + JSON.stringify(dateStruct))
        this.selectNumDate = dateStruct.dateResult || []
        if (this.$store.state.repeat.repeatOverDate) {
          var year = this.$store.state.repeat.repeatOverDate.substring(0, 4)
          var month = this.$store.state.repeat.repeatOverDate.substring(5, 7)
          var date = this.$store.state.repeat.repeatOverDate.substring(8, 10)
//          console.log(year + month + date)
          this.focusDate = new Date(year, month - 1, date)
        } else {
          this.focusDate = dateStruct.dateResult ? new Date(dateStruct.dateResult[0]) : new Date()
          this.select = false
        }
        this.resetType()
        var that = this
        if (this.$store.state.repeat.repeatOverDate) {
          this.days.forEach(function (array) {
            array.forEach(function (obj) {
              console.log(obj.date.getDate() + ':' + parseInt(that.$store.state.repeat.repeatOverDate.substring(8, 10)))
              if (obj.date.getDate() === parseInt(that.$store.state.repeat.repeatOverDate.substring(8, 10))) {
                obj.isSelected = true
              }
            })
          })
        }
      },
      clearType () {
        this.dateType = 'none'
      },
      tapEmpty (e) {
        this.selectNumDate = []
        this.clearType()
        this.clearSelected()
        if (e) e.preventDefault()
      },
      tapBackToday (e) {
        if (this.dateType === 'repeat') {
          this.dateType = 'single'
          this.tapBackToday(e)
        }
        var nowDate = dateUtil.clearTime(new Date())
        this.focusDate = nowDate
        this.dateType = 'single'
        this.selectNumDate = [nowDate.getTime()]
        this.resetMonth()
        if (e) e.preventDefault()
      },
      tapChangeMonth (e, offset) {
        this.resetMonth(offset)
        e.preventDefault()
      },
      tapDay (e, obj) {
        if (!this.select) {
//          console.log('进来了')
          this.clearSelected()
          obj.isSelected = !obj.isSelected
//        this.$emit('selectedDate', obj)
          e.preventDefault()
        }
      },
      clearSelected () {
        this.days.forEach(function (array) {
          array.forEach(function (obj) {
            obj.isSelected = false
          })
        })
      },
      resetType () {
        this.resetMonth() // 这是干吗用的
      },
      resetMonth (offset) {
        if (offset) {
  //          console.log('开始this.focusdate是' + this.focusDate)
          this.focusDate = dateUtil.firstDayOfMonth(this.focusDate, offset)
  //          console.log('之后this.focusdate是' + this.focusDate)
        }
        this.days = dateUtil.getMonthDays(this.focusDate) //  this.days数据结构很有意思
  //        console.log('this.days是' + JSON.stringify(this.days))
//        this.selectDays()
      },
      selectDays () { // 略复杂
        var self = this
        this.days.forEach(function (array) {
          array.forEach(function (obj) {
            obj.isSelected = self.isInSelect('single', obj.date, self.selectNumDate)
          })
        })
      },
      isInSelect (type, date, selectNumDate) { // 不懂
        var numDate = date.getTime()
        switch (type) {
          case 'single':
          case 'discrete':
            return selectNumDate.indexOf(numDate) !== -1
          case 'range':
            var start = selectNumDate[0]
            var end = selectNumDate[1]
            if (start && end) {
              return numDate >= start && numDate <= end
            } else {
              return start === numDate || end === numDate
            }
          default:
            return false
        }
      }
    },
    created () {
      this.initData()
    }
  }
</script>
