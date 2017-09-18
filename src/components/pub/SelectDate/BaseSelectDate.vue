<template>
  <div class="modal-wrap z-index-5xl">
    <div class="modal-shade"></div>
    <div class="modal-main">
      <div class="modal-cell">
        <div class="modal-content content--con-edit">
          <!--<div class="modal-header">-->
            <!--<div class="modal-header-bg kb&#45;&#45;modal-bg"></div>-->
            <!--<v-touch class="modal-btn-right-top" @tap="tapCloseModal($event)">-->
              <!--<i class="icon icon-cancel"></i>-->
            <!--</v-touch>-->
            <!--<div class="modal-header-title">-->
              <!--<p class="modal-header-title-text">{{selectDateText}}</p>-->
            <!--</div>-->
          <!--</div>-->
          <div class="modal-body">
            <div class="date-picker">
              <div class="dp-sel-type">
                <v-touch class="dp-btn"
                         @tap="tapChangeType($event, 'single')"
                         :class="{'is-active': type=='single'}">单日</v-touch>
                <div class="dp-v-line">|</div>
                <v-touch class="dp-btn"
                         @tap="tapChangeType($event, 'discrete')"
                         :class="{'is-active': type=='discrete'}">多日</v-touch>
                <div class="dp-v-line">|</div>
                <v-touch class="dp-btn"
                         @tap="tapChangeType($event, 'range')"
                         :class="{'is-active': type=='range'}">起止</v-touch>
              </div>
              <div class="dp-title">
                <!--<v-touch class="dp-title-tag u-pull-left" @tap="tapEmpty($event)">空</v-touch>-->
                <v-touch class="dp-title-tag u-pull-right" @tap="tapBackToday($event)">今</v-touch>
                <v-touch tag="i" class="icon icon-keyboard_arrow_left u-pull-left"
                         @tap="tapChangeMonth($event, -1)"></v-touch>
                <v-touch tag="i" class="icon icon-keyboard_arrow_right u-pull-right"
                         @tap="tapChangeMonth($event, 1)"></v-touch>
                <div class="dp-title-text">
                 {{currentDate.getFullYear()}}年{{currentDate.getMonth() + 1}}月
                </div>
              </div>
              <div class="dp-content">
                <table class="dp-table">
                  <thead>
                  <tr>
                    <td  class="week-ri">日</td>
                    <td  class="week">一</td>
                    <td  class="week">二</td>
                    <td  class="week">三</td>
                    <td  class="week">四</td>
                    <td  class="week">五</td>
                    <td  class="week-six">六</td>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="weekArray in days">
                    <v-touch tag="td" v-for="day in weekArray" :key="day.date.getTime()"
                             @tap="tapDay($event, day)">
                      <div class="dp-day"
                           :class="{'dp-grey': !day.isInMonth, 'dp-selected': day.isSelected}">
                        {{day.date.getDate()}}
                      </div>
                    </v-touch>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!--<div class="modal-footer">-->
            <v-touch tag="input" class="u-full-width" type="button" value="确定" @tap="tapConfirm($event)" />
            <div class="date-footer">
              <span class="date-repeat">重复</span>
              <span class="date-norepeat">不重复</span>
              <i class="icon2-arrow-right arrow"></i>
            </div>
          <!--</div>-->
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  @import "../../../assets/css/variables.scss";
  .arrow{
    position: absolute;
    right:0.11rem;
    top:0.38rem;
    font-size:17px;
    color: #999999;
  }
  .date-footer{
    position: relative;
    padding-left: 0.7rem;
    height:1.2rem;
    background-color: white;
    display: flex;
    align-items: center;
    border-top: 1px solid #DADADA;
    border-bottom:1px solid #DADADA ;
  }
  .date-repeat{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
  }
  .date-norepeat{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #999999;
    position: absolute;
    right:0.9rem;
    top:0.35rem;
  }
  .date-picker {width:280px;box-sizing: border-box;}
  .dp-title {
    height: 52px;
    line-height: 52px;
    font-family: PingFangSC-Regular;
    font-size: 19px;
    color: #000000;
    letter-spacing: -0.46px;
  }
  .dp-title-text {
    text-align: center;
    font-family: PingFangSC-Regular;
    font-size: 19px;
    color: #3D3D3D;
  }
  .dp-title .icon {
    font-size: 0.6rem;
    color: #333333;
  }
  .dp-title .dp-title-tag {font-size: 0.4rem;line-height:1;margin-top:12px;padding:5px;border: solid 1px #e8e8e8;border-radius: 50%;}
  .dp-table {width:100%;height:240px;text-align: center;}
  .dp-grey {color: #a8a8a8;}
  .dp-selected {
    background: #55A8FD;
    color:white;}
  .dp-sel-type {position: relative;border-bottom: solid 1px #e4e4e4;overflow: hidden;
    height: 40px;line-height: 40px;margin: -20px -20px 0;}
  .dp-btn {
    float: left;
    width: 32%;
    text-align: center;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #666666;
    line-height: 40px;}
  .dp-v-line {
    float: left;
    width: 2%;
    color: #979797;
    text-align: center;
    /*font-size: 2.8rem;}*/
  }
  .week{
    font-family: PingFangSC-Regular;
    font-size: 11px;
    color: #666666;
  }
  .dp-day {
    margin:0 auto;
    width:30px;
    height:30px;
    line-height:30px;
    text-align: center;
    border-radius: 50%;
    font-family: PingFangSC-Medium;
    font-size: 17px;
    /*color: #666666;*/
  }
  .week-six{
    font-family: PingFangSC-Regular;
    font-size: 11px;
    color: #FF7A7A;
  }
  .week-ri{
    font-family: PingFangSC-Regular;
    font-size: 11px;
    color: #FF7A7A;
  }
</style>
<script>
  import dateUtil from 'ut/dateUtil'
  export default{
    data () {
      return {
        compId: 'SYSTEM_SELECT_DATE',
        weeks: ['日', '一', '二', '三', '四', '五', '六'],
        months: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
        currentDate: new Date(),  //  表示当前显示的月份，决定了当前显示哪个月份的日历
        days: [],
        type: '',  //  single单日期, range起止日期, discrete, 离散间隔日期
        selectNumDate: null,  //  表示当前选中的日期
        success: function () {},
        cancel: function () {}
      }
    },
    computed: {
      selectDateText () {
        return dateUtil.formatDateDisplay(this.type, this.selectNumDate)
      }
    },
    methods: {
      selfClose () {
        window.onpopstate = null
        this.cancel()
        this.$emit('self-close')
      },
      tapEmpty (e) {
        this.selectNumDate = []
        this.clearSelected()
        e.preventDefault()
      },
      tapBackToday (e) {
        var nowDate = dateUtil.clearTime(new Date())
        this.currentDate = nowDate
        this.selectNumDate = [nowDate.getTime()]
        this.resetMonth()
        e.preventDefault()
      },
      tapConfirm (e) {
        var isNotNull = this.selectNumDate && this.selectNumDate.length > 0

        this.success({
          type: isNotNull ? this.type : null,
          selectNumDate: isNotNull ? this.selectNumDate.sort(function (a, b) { return a > b ? 1 : -1 }) : null
        })
        this.selfClose()

//                this.saveTempDatePicker({
//                    currentDate: isNotNull ? this.currentDate : null,
//
//                })
        e.preventDefault()
      },
      tapChangeType (e, type) {
        this.resetType(type)
        e.preventDefault()
      },
      tapChangeMonth (e, offset) {
        this.resetMonth(offset)
        e.preventDefault()
      },
      tapDay (e, day) {
        this.toggleSelect(day)
        e.preventDefault()
      },
      tapCloseModal (e) {
        this.selfClose()
        e.preventDefault()
      },
      resetType (type, params) {
        params = params || {}
        this.type = type || 'single'
        this.selectNumDate = params.selectNumDate || []
        this.resetMonth()
      },
      resetMonth (offset) {
        if (offset) {
          this.currentDate = dateUtil.firstDayOfMonth(this.currentDate, offset)
        }
        this.days = dateUtil.getMonthDays(this.currentDate)
        this.selectDays()
      },
      toggleSelect (day) {
        switch (this.type) {
          case 'single':
            this.selectSingle(day)
            break
          case 'range':
            this.selectRange(day)
            break
          case 'discrete':
            this.selectDiscrete(day)
            break
          default:
            break
        }
      },
      selectSingle (obj) {
        this.clearSelected()
        obj.isSelected = !obj.isSelected
        if (obj.isSelected) {
          this.selectNumDate = [obj.date.getTime()]
        } else {
          this.selectNumDate.pop()
        }
      },
      selectRange (obj) {
        var val = obj.date.getTime()
        //  如果之前选择过range，则重置选择
        if (this.selectNumDate.length >= 2) {
          this.selectNumDate = []
          this.clearSelected()
        }
        if (this.selectNumDate.length === 0) {
          this.selectNumDate = [val]
          obj.isSelected = true
        } else {
          //  length 为1
          var fun = val > this.selectNumDate[0] ? 'push' : 'unshift'
          this.selectNumDate[fun](val)
          this.selectDays()
        }
      },
      selectDiscrete (obj) {
        obj.isSelected = !obj.isSelected
        if (obj.isSelected) {
          this.selectNumDate.push(obj.date.getTime())
        } else {
          var index = this.selectNumDate.indexOf(obj.date.getTime())
          if (index > -1) {
            this.selectNumDate.splice(index, 1)
          }
        }
      },
      clearSelected () {
        this.days.forEach(function (array) {
          array.forEach(function (obj) {
            obj.isSelected = false
          })
        })
      },
      selectDays () {
        if (this.selectNumDate.length === 0) {
          return
        }
        var self = this
        this.days.forEach(function (array) {
          array.forEach(function (obj) {
            obj.isSelected = self.isInSelect(self.type, obj.date, self.selectNumDate)
          })
        })
      },
      isInSelect (type, date, selectNumDate) {
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
    mounted () {
      var that = this
      that.resetType(that.type, {
        selectNumDate: that.selectNumDate || []
      })
      //  如果通过任意方式跳出页面了，那么关闭当前选择框
      window.onpopstate = function () {
        that.selfClose()
      }
    }
  }
</script>
