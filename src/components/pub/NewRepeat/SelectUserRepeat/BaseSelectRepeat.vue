<!-- eslint-disable -->
<template>
  <div class="modal-wrap z-index-5xl select-repeat">
    <v-touch
      class="modal-shade"
      @tap="selfClose($event)"/>
    <div class="popup popup-bottom">
      <div class="header">
        <v-touch
          v-show="!isRootPage"
          tag="span"
          class="popup-button u-pull-left"
          @tap="tapBack($event)">
          <i class="icon2-arrow-left arrow u-pull-left" />
        </v-touch>
        <v-touch
          v-show="isRootPage"
          tag="span"
          class="popup-button u-pull-left"
          @tap="tapCancel($event)">
          取消
        </v-touch>
        <v-touch
          v-show="isRootPage"
          tag="span"
          class="popup-button u-pull-right"
          @tap="tapConfirm($event)">
          确定
        </v-touch>
        <p class="popup-title">{{ currentPage.title }}</p>
      </div>
      <div class="body">
        <div v-show="isRootPage">
          <ul class="repeat-list">
            <li>
              <v-touch
                class="list-item-info"
                @tap="showSubPage('subType')">
                <p class="list-item-key">重复方式</p>
                <p class="list-item-value">{{ repeatTypeText }}</p>
              </v-touch>
            </li>
            <li>
              <v-touch
                v-show="repeatPatternText !== '每天' && repeatPatternText !== '每年'"
                class="list-item-info"
                @tap="showSubPage('subPattern')">
                <p class="list-item-key">重复形式</p>
                <p class="list-item-value">{{ repeatPatternText }}</p>
              </v-touch>
            </li>
            <li>
<!--               <v-touch
                class="list-item-info"
                @tap="showSubPage('subDeadline')">
                <p class="list-item-key">截止日期</p>
                <p class="list-item-value">{{ deadlineText }}</p>
              </v-touch> -->
            </li>
          </ul>
        </div>
        <div v-show="currentPage === pages.subType">
          <ul class="repeat-list">
            <li>
              <v-touch
                class="list-item-info single-line"
                @tap="tapRepeatType('everyDay')">
                <span>每天</span>
                <i
                  v-show="localType === 'everyDay'"
                  class="icon2-selected finish" />
              </v-touch>
            </li>
            <li>
              <v-touch
                class="list-item-info single-line"
                @tap="tapRepeatType('everyWeek')">
                <span>每周</span>
                <i
                  v-show="localType === 'everyWeek'"
                  class="icon2-selected finish" />
              </v-touch>
            </li>
            <li>
              <v-touch
                class="list-item-info single-line"
                @tap="tapRepeatType('everyMonth')">
                <span>每月</span>
                <i
                  v-show="localType === 'everyMonth'"
                  class="icon2-selected finish" />
              </v-touch>
            </li>
            <li>
              <v-touch
                class="list-item-info single-line"
                @tap="tapRepeatType('everyYear')">
                <span>每年</span>
                <i
                  v-show="localType === 'everyYear'"
                  class="icon2-selected finish" />
              </v-touch>
            </li>
          </ul>
        </div>
        <div v-show="currentPage === pages.subPattern && localType === 'everyWeek'">
          <div class="week-panel">
            <div class="week-day-line">
              <v-touch
                v-for="d in calDay[0]"
                :key="d.val"
                :class="{'selected': d.selected}"
                class="week-day"
                @tap="tapWeekDay(d)">
                周{{ d.text }}
              </v-touch>
            </div>
            <div class="week-day-line">
              <v-touch
                v-for="d in calDay[1]"
                :key="d.val"
                :class="{'selected': d.selected}"
                class="week-day"
                @tap="tapWeekDay(d)">
                周{{ d.text }}
              </v-touch>
            </div>
          </div>
        </div>
        <div v-show="currentPage === pages.subPattern && localType === 'everyMonth'">
          <div class="body-table">
            <table class="dp-table">
              <tr
                v-for="(weekArray, index) in calDate"
                :key="index">
                <v-touch
                  v-for="day in weekArray"
                  :key="day.val"
                  tag="td"
                  @tap="tapSelect(day)"
                  v-if="!day.isLast">
                  <div
                    :class="{'dp-selected': day.selected, 'dp-is-last': day.isLast}"
                    class="dp-day">
                    {{ day.text }}
                  </div>
                </v-touch>
                <v-touch
                  v-for="day in weekArray"
                  :key="day.val"
                  tag="td"
                  @tap="tapSelect(day)"
                  v-if="day.isLast"
                  colspan="2">
                  <div
                    :class="{'dp-selected': day.selected, 'dp-is-last': day.isLast}"
                    class="dp-day">
                    {{ day.text }}
                  </div>
                </v-touch>
              </tr>
            </table>
          </div>
        </div>
        <div v-show="currentPage === pages.subDeadline">
          <r-plain-date-picker
            ref="datePicker"
            :focus-date-number="localDeadline"
            :selected-date-number="selectedDateNumber"
            @date-select-changed="tapChangeDeadline"/>
          <div class="no-limit">
            <span>永不结束</span>
            <div class="checkbox-wrap">
              <input
                ref="noLimitCheckbox"
                v-model="isNoLimit"
                class="mui-switch-deadline"
                type="checkbox">
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <p>{{ selectedText }}</p>
      </div>
    </div>
  </div>
</template>
<script>
  // eslint-disable
  import moment from 'moment'
  import dateUtil from '../../../../utils/dateUtil'
  import jsUtils from '../../../../utils/jsutils'
  import PlainDatePicker from '../PlainDatePicker.vue'
  const pages = {
    //  显示的弹框的类型，不同的弹框对应不同的样式。
    index: {title: '自定义重复'},
    subType: {title: '重复方式'},
    subPattern: {title: '重复形式'},
    subDeadline: {title: '截止日期'}
  }
  const EVERY_DAY = 'everyDay'
  const EVERY_WEEK = 'everyWeek'
  const EVERY_MONTH = 'everyMonth'
  const EVERY_YEAR = 'everyYear'
  export default{
    components: {
      'r-plain-date-picker': PlainDatePicker
    },
    data () {
      return {
        //  --------------------------------------
        //  传递过来的参数，不要改变
        baseNumTime: new Date().getTime(),
        repeatType: '',
        repeatStrTimeArray: [],
        repeatWeekArray: [],
        repeatOverDate: null,

        //  --------------------------------------
        //  参数本地要用的一些参数,
        pages: pages,
        currentPage: pages.index,
        dayName: ['日', '一', '二', '三', '四', '五', '六'],
        days: [
          {val: 1, valRrule: 'RRule.MO', objRrule: this.$rrule.MO, text: '一', selected: false},
          {val: 2, valRrule: 'RRule.TU', objRrule: this.$rrule.TU, text: '二', selected: false},
          {val: 3, valRrule: 'RRule.WE', objRrule: this.$rrule.WE, text: '三', selected: false},
          {val: 4, valRrule: 'RRule.TH', objRrule: this.$rrule.TH, text: '四', selected: false},
          {val: 5, valRrule: 'RRule.FR', objRrule: this.$rrule.FR, text: '五', selected: false},
          {val: 6, valRrule: 'RRule.SA', objRrule: this.$rrule.SA, text: '六', selected: false},
          {val: 0, valRrule: 'RRule.SU', objRrule: this.$rrule.SU, text: '日', selected: false}
        ],
        dates: [
          {val: 1, text: '1', selected: false},
          {val: 2, text: '2', selected: false},
          {val: 3, text: '3', selected: false},
          {val: 4, text: '4', selected: false},
          {val: 5, text: '5', selected: false},
          {val: 6, text: '6', selected: false},
          {val: 7, text: '7', selected: false},
          {val: 8, text: '8', selected: false},
          {val: 9, text: '9', selected: false},
          {val: 10, text: '10', selected: false},
          {val: 11, text: '11', selected: false},
          {val: 12, text: '12', selected: false},
          {val: 13, text: '13', selected: false},
          {val: 14, text: '14', selected: false},
          {val: 15, text: '15', selected: false},
          {val: 16, text: '16', selected: false},
          {val: 17, text: '17', selected: false},
          {val: 18, text: '18', selected: false},
          {val: 19, text: '19', selected: false},
          {val: 20, text: '20', selected: false},
          {val: 21, text: '21', selected: false},
          {val: 22, text: '22', selected: false},
          {val: 23, text: '23', selected: false},
          {val: 24, text: '24', selected: false},
          {val: 25, text: '25', selected: false},
          {val: 26, text: '26', selected: false},
          {val: 27, text: '27', selected: false},
          {val: 28, text: '28', selected: false},
          {val: 29, text: '29', selected: false},
          {val: 30, text: '30', selected: false},
          {val: 31, text: '31', selected: false},
          {val: -1, text: '最后一天', selected: false, isLast: true}
        ],
        localType: EVERY_DAY,  //  week or month
        localStrTimeArray: [],
        localIsLastDate: false,
        localDeadline: null  //  对应后台model的repeatOverDate字段
      }
    },
    computed: {
      isRootPage () {
        return this.currentPage === pages.index
      },
      calDay () {
        const d = this.days
        return [
          [d[0], d[1], d[2], d[3]],
          [d[4], d[5], d[6]]
        ]
      },
      calDate () {
        const d = this.dates
        return [
          [d[0], d[1], d[2], d[3], d[4], d[5], d[6]],
          [d[7], d[8], d[9], d[10], d[11], d[12], d[13]],
          [d[14], d[15], d[16], d[17], d[18], d[19], d[20]],
          [d[21], d[22], d[23], d[24], d[25], d[26], d[27]],
          [d[28], d[29], d[30], d[31]]
        ]
      },
      selectedDateNumber () {
        return this.localDeadline ? [this.localDeadline] : []
      },
      isNoLimit: {
        get () {
          return !this.localDeadline
        },
        set (val) {
          if (val) {
            this.localDeadline = null
            //  重置时间选择控件
            this.$refs.datePicker.clearSelected()
          } else {
            //  强制设置回true，不通过切换改变
            this.$refs.noLimitCheckbox.checked = true
          }
        }
      },
      selectedStruct () {
        const list = this.localType === EVERY_WEEK ? this.days : this.dates
        return list.filter(d => {
          return d.selected
        })
      },
      repeatTypeText () {
        let str = ''
        switch (this.localType) {
          case EVERY_DAY:
            str = '每天'
            break
          case EVERY_WEEK:
            str = '每周'
            break
          case EVERY_MONTH:
            str = '每月'
            break
          case EVERY_YEAR:
            str = '每年'
            break
          default:
            break
        }
        return str
      },
      repeatPatternText () {
        let str = ''
        switch (this.localType) {
          case EVERY_DAY:
            str = '每天'
            break
          case EVERY_WEEK:
            str = this.selectWeekText
            break
          case EVERY_MONTH:
            str = this.selectMonthText
            break
          case EVERY_YEAR:
            str = '每年'
            break
          default:
            break
        }
        return str
      },
      deadlineText () {
        //  'YYYY-MM-DD HH:mm:ss'
        return this.localDeadline ? moment(this.localDeadline).format('直到YYYY年MM月DD日') : '永不结束'
      },
      selectedText () {
        const sel = this.selectedStruct
        let valStr
        switch (this.localType) {
          case EVERY_DAY:
            valStr = '每天重复'
            break
          case EVERY_WEEK:
            valStr = sel.length === 0 ? '' : '每' + this.selectWeekText + '重复'
            // valStr = sel.length === 0 ? '' : '按周重复'
            break
          case EVERY_MONTH:
            valStr = sel.length === 0 ? '' : '每月' + this.selectMonthText
            valStr += '重复'
            // valStr = sel.length === 0 ? '' : '按月重复'
            break
          case EVERY_YEAR:
            valStr = '每年' + '' + '重复'
            break
          default:
            break
        }
        return valStr
      },
      selectWeekText () {
        return this.selectedStruct.map(d => { return '周' + this.dayName[d.val] }).join('，')
      },
      selectMonthText () {
        let valStr = this.selectedStruct
          .filter(function (d) { return !d.isLast })
          .map(function (d) { return d.text + '日' }).join('，')
        //  如果最后一天被选中，则特殊处理
        if (this.dates[31].selected) {
          if (valStr) {
            valStr += '，'
          }
          valStr += '最后一天'
        }
        return valStr
      }
    },
    mounted () {
      this.initData()
    },
    methods: {
      /**
       * 初始化分为两步：
       * 1  重置所有的本地model
       * 2  设置本地model的值，如果为空，那么就设置默认值
       */
      initData () {
        this.resetData()
        this.renderData(this.repeatType || EVERY_DAY)
      },
      resetData () {
        this.localType = ''
        this.localStrTimeArray = []
        this.localIsLastDate = false
        if (this.repeatOverDate) {
          this.localDeadline = moment(this.repeatOverDate, 'YYYY-MM-DD HH:mm:ss').valueOf()
        } else {
          this.localDeadline = null
          //  重置时间选择控件
          this.$refs.datePicker.clearSelected()
        }
      },
      renderData (tb) {
        //  设置localType
        this.localType = tb
        switch (tb) {
          case EVERY_DAY:
          case EVERY_YEAR:
            this.selectSingleDay()
            break
          case EVERY_WEEK:
            this.selectDefaultDay()
            break
          case EVERY_MONTH:
            this.selectDefaultDate()
            break
          default:
            break
        }
      },
      selectSingleDay () {
        this.localStrTimeArray = [dateUtil.dateNum2Text(this.baseNumTime)]
      },
      selectDefaultDay () {
        const arr = jsUtils.toArray(this.repeatWeekArray)
        this.days.forEach(d => {
          d.selected = (arr.indexOf(d.valRrule) !== -1)
        })
      },
      selectDefaultDate () {
        const arr = jsUtils.toArray(this.repeatStrTimeArray)
        this.dates.forEach(d => {
          d.selected = (arr.indexOf(d.val) !== -1)
        })
        // this.dates[this.dates.length - 1].selected = this.isLastDate
      },
      showSubPage (type) {
        if (type === 'subPattern' && this.localType !== EVERY_WEEK && this.localType !== EVERY_MONTH) {
          return
        }
        this.currentPage = pages[type]
      },
      tapWeekDay (d) {
        if (d.selected) {
          //  如果是唯一的一天，则不允许取消
          if (this.selectedStruct.length <= 1) {
            return
          }
        }
        d.selected = !d.selected
      },
      tapRepeatType (type) {
        this.resetData()
        this.renderData(type)
      },
      tapChangeDeadline (arr) {
        this.localDeadline = arr.length === 0 ? null : arr[0]
      },
      tapCancel (e) {
        this.$emit('select-user-repeat-cancel')
        this.selfClose()
        e.preventDefault()
      },
      tapConfirm (e) {
        const res = this.getResult()
        this.$emit('select-user-repeat-confirm', res)
        this.selfClose()
        e.preventDefault()
      },
      tapBack (e) {
        this.currentPage = pages.index
        e.preventDefault()
      },
      tapSelect (d) {
        if (d.selected) {
          const list = this.localType === EVERY_WEEK ? this.days : this.dates
          //  如果是唯一的一天，则不允许取消
          const sel = list.filter(function (l) {
            return l.selected
          })
          if (sel.length <= 1) return
        }
        d.selected = !d.selected
      },
      selfClose () {
        // this.localDeadline = null
        this.currentPage = pages.index
        this.$emit('self-close')
      },
      getSelectedDayValue () {
        const dayMills = 24 * 3600 * 1000
        const selected = this.selectedStruct
        const base = new Date(this.baseNumTime)
        const baseDay = base.getDay() === 0 ? 7 : base.getDay()  //  周日的getDay()为0，转换为7
        return selected.map(s => {
          const sDay = s.val === 0 ? 7 : s.val
          const offset = sDay >= baseDay ? 0 : 7
          return dateUtil.dateNum2Text(this.baseNumTime + (sDay + offset - baseDay) * dayMills)
        })
      },
      getSelectedDateValue () {
        const selected = this.selectedStruct
        const base = dateUtil.dateNum2Text(this.baseNumTime).substr(0, 6)
        const result = []
        for (var i = 0; i < selected.length; i++) {
          const s = selected[i]
          if (s.val === 32) continue
          result.push(base + (s.val < 10 ? '0' : '') + s.val)
        }
        return result
      },
      getNumTimeArray () {
        switch (this.localType) {
          case EVERY_DAY:
          case EVERY_YEAR:
            return [dateUtil.dateNum2Text(this.baseNumTime)]
          case EVERY_WEEK:
            return this.getSelectedDayValue()
          case EVERY_MONTH:
            return this.getSelectedDateValue()
          default:
            break
        }
      },
      checkUseLast () {
        return this.localType === EVERY_MONTH && this.dates[this.dates.length - 1].selected
      },
      getResult () {
        var that = this
        const date = this.localDeadline ? new Date(moment(this.localDeadline).format('YYYY,MM,DD')) : null
        if (this.localType === 'everyDay') {
          let res = new this.$rrule({
            freq: that.$rrule.DAILY,
            until: date
          })
          return res.toString()
        } else if(this.localType === 'everyWeek'){
          let arr = []
          this.selectedStruct.map(function (o) {
            arr.push(o.objRrule)
          })
          let res = new this.$rrule({
            freq: that.$rrule.WEEKLY,
            byweekday: arr,
            until: date
          })
          return res.toString()
        } else if(this.localType === 'everyMonth'){
          let arr = []
          this.selectedStruct.map(function (o) {
            arr.push(o.val)
          })
          let res = new this.$rrule({
            freq: that.$rrule.MONTHLY,
            bymonthday: arr,
            until: date
          })
          return res.toString()
        } else if (this.localType === 'everyYear'){
          let res = new this.$rrule({  
            freq: that.$rrule.YEARLY,
            interval: 1,
            until: date
          })
          return res.toString()
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .select-repeat {
    .popup {
      font-size: 14px;
      box-sizing: border-box;position: fixed;background:#fff;backface-visibility: hidden;transition: .2s ease-out;
    }
    .popup-bottom {
      top: auto;right: 0;bottom: 0;left: 0;
    }
    .header {
      font-size: 17px; height: 46px; padding: 0 15px;
      border-bottom: 0.5px solid #d4d4d4; overflow: hidden;
      background: #FDFDFF;
      border-top: 0.5px solid #d4d4d4;
    }
    .popup-title {
      text-align: center;
      height:100%;
      font-size:17px;
      font-family:PingFangSC-Medium;
      font-weight:500;
      color:rgba(61,61,61,1);
      line-height:46px;    
    }
    .u-pull-left{
      float: left;
    }
    .u-pull-right{
      float: right;
    }
    .u-pull-left,.u-pull-right{
      height:100%;
      font-size:17px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(0,122,255,1);
      line-height:46px;
    }
    .popup-button {color: #007AFF;}
    .body {}
    .repeat-list {}
    .repeat-list li {
      padding-left: 15px;
    }
    .list-item-info {
      border-bottom: 0.5px solid #d4d4d4;
    }
    .repeat-list li:last-child .list-item-info {
      border-bottom: none;
    }
    .list-item-info p.list-item-key {
      font-size: 14px; color: #9B9B9B;line-height:22px;padding-bottom: 15px;
    }
    .list-item-info p.list-item-value {
      font-size: 17px; color: #000000;line-height:24px;padding-bottom: 15px;
    }
    .repeat-list li .single-line {
      position: relative;height: 56px;line-height: 56px;color: #000000;
    }
    .single-line i.el-icon-check {
      position: absolute; font-size: 20px;top: 18px; right: 15px;color: #55A8FD;
    }
    .week-panel {
      padding: 48px 0 16px;
    }
    .week-day-line {
      padding-bottom: 32px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
    }
    .week-day {
      box-sizing: border-box;
      margin: 0 15px;
      width: 48px;height: 48px;
      border-radius: 50%;
      background: #FFFFFF;color: #48A1FA;
      border: solid 0.5px rgba(72,161,250,1);
      text-align: center;line-height: 48px;
    }
    .week-day.selected {
      background: #48A1FA;color: #FFFFFF;
    }
    table {
      border-collapse: collapse;
    }
    table td, table th {
      border: 0.5px solid #d4d4d4;
    }
    table tr:first-child th,table tr:first-child td {
      border-top: 0;
    }
    table tr:last-child td {
      border-bottom: 0;
    }
    table tr td:first-child,
    table tr th:first-child {
      border-left: 0;
    }
    table tr td:last-child,
    table tr th:last-child {
      border-right: 0;
    }
    table tr:last-child td:last-child{
      border-right: 0.5px solid #d4d4d4;
    }
    .body-table {font-size: 14px; color: #3D3D3D;width: 100%;}
    .dp-table {width:100%;}
    .dp-table td {position: relative;}
    .dp-day {margin:0 auto;width: 100%;height:44px;line-height:44px;text-align: center;}
    div.dp-selected {background: #55A8FD; color:#FFFFFF;}
    .dp-is-last {
      position: absolute;
      top: 0;
      left: 0; 
      width: 100%;
      height: 44px;
      line-height: 44px;
    }
    .no-limit {
      position: relative;
      height: 48px;line-height: 48px;padding: 0 15px;font-size: 17px;color: #000000;
      border-top: solid 0.5px #d4d4d4;
    }
    .checkbox-wrap {
      position: absolute;top: 8px;right: 15px;
    }
    .footer {
      background: #FDFDFF; color: #9B9B9B; font-size: 15px;padding: 0 15px;
      height: 45px; line-height: 45px; border-top: 0.5px solid #d4d4d4;
    }
    .footer p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    input.mui-switch-deadline {
      display: block;
      width: 50px;
      height: 31px;
      border: 0.5px solid #d4d4d4;
      background-color: #fdfdfd;
      box-shadow: #dfdfdf 0 0 0 0 inset;
      border-radius: 20px;
      background-clip: content-box;
      -webkit-appearance: none;
      user-select: none;
      outline: none; }
    input.mui-switch-deadline:before {
      content: '';
      width: 29px;
      height: 30px;
      position: absolute;
      top: 0px;
      left: 0;
      border-radius: 20px;
      background-color: #fff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4); }
    input.mui-switch-deadline:checked {
      border-color: #55A8FD;
      box-shadow: #55A8FD 0 0 0 16px inset;
      background-color: #55A8FD; }
    input.mui-switch-deadline:checked:before {
      left: 21px; }
  }
  .modal-shade{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background:rgba(0,0,0,0.2);
  }
</style>
