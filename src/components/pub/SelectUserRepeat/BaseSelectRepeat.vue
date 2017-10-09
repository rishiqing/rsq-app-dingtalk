<template>
  <div class="modal-wrap z-index-5xl select-repeat">
    <v-touch class="modal-shade" @tap="selfClose($event)"></v-touch>
    <div class="popup popup-bottom">
      <div class="header">
        <v-touch tag="span" class="popup-button u-pull-left" @tap="tapCancel($event)">取消</v-touch>
        <v-touch tag="span" class="popup-button u-pull-right" @tap="tapConfirm($event)">确定</v-touch>
        <p class="popup-title">重复频率</p>
      </div>
      <div class="tab-panel">
        <v-touch class="tab-bg" @tap="setTab('everyDay')">
          <span class="tab-text" :class="{'is-tab-active': localType === 'everyDay'}">每天</span>
        </v-touch>
        <v-touch class="tab-bg" @tap="setTab('everyWeek')">
          <span class="tab-text" :class="{'is-tab-active': localType === 'everyWeek'}">每周</span>
        </v-touch>
        <v-touch class="tab-bg" @tap="setTab('everyMonth')">
          <span class="tab-text" :class="{'is-tab-active': localType === 'everyMonth'}">每月</span>
        </v-touch>
        <v-touch class="tab-bg" @tap="setTab('everyYear')">
          <span class="tab-text" :class="{'is-tab-active': localType === 'everyYear'}">每年</span>
        </v-touch>
      </div>
      <div class="body">
        <div class="body-img" v-show="localType === 'everyDay'">
          <img src="../../../assets/img/repeat-day.png">
        </div>
        <div class="body-list" v-show="localType === 'everyWeek'">
          <ul>
            <v-touch tag="li" v-for="d in days" :key="d.val" @tap="tapSelect(d)">
              <span>{{d.text}}</span>
              <i class="icon2-selected is-finish" v-show="d.selected"></i>
            </v-touch>
          </ul>
        </div>
        <div class="body-table" v-show="localType === 'everyMonth'">
          <table class="dp-table">
            <tbody>
            <tr v-for="(weekArray, index) in calDate" :key="index">
              <v-touch tag="td" v-for="day in weekArray" :key="day.val"
                       @tap="tapSelect(day)">
                <div class="dp-day"
                     :class="{'dp-selected': day.selected, 'dp-is-last': day.isLast}">
                  {{day.text}}
                </div>
              </v-touch>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="body-img" v-show="localType === 'everyYear'">
          <img src="../../../assets/img/repeat-year.png">
        </div>
      </div>
      <div class="footer">
        <p>{{selectedText}}</p>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  @import "../../../assets/css/variables.scss";
  .select-repeat {
    .popup {
      box-sizing: border-box;position: fixed;background:#fff;backface-visibility: hidden;transition: .2s ease-out;
    }
    .popup-bottom {
      top: auto;right: 0;bottom: 0;left: 0;
      /*-webkit-transform: translate3d(-50%,0,0);*/
      /*transform: translate3d(-50%,0,0);*/
    }
    .header {
      font-size: 0.453rem; height: 1.07rem; line-height: 1.07rem; padding: 0 0.293rem;
      border-bottom: 1px solid #E0E0E0; overflow: hidden;
    }
    .popup-title {text-align: center; color: #3D3D3D;}
    .popup-button {color: #007AFF;}
    .tab-panel {
      font-size: 0.4rem; color: #8C8C8C; height: 1.17rem; line-height: 1.17rem;
      border-bottom: 1px solid #E0E0E0; overflow: hidden; padding: 0 1.2rem;
    }
    .tab-bg {
      float: left; width: 25%; overflow: hidden;text-align: center;
    }
    .is-tab-active {color: #55A8FD;}
    .body {height: 5.85rem;overflow: auto;}
    .body-list {font-size: 0.453rem; color: #333333;}
    .body-list li:first-child {border-top: 1px solid #E0E0E0;}
    .body-list li {
      position: relative;
      box-sizing: border-box;
      padding: 0 0.293rem; height: 1.17rem; line-height: 1.17rem;
      border-bottom: 1px solid #E0E0E0; overflow: hidden;
    }
    .body-table {
      box-sizing: border-box; width: 100%; height: 100%; padding: 0.2rem 0.4rem;
      font-size: 0.32rem; color: #666666;
    }
    .body-table table {width:100%; height: 100%;}
    .body-table table td {position: relative;}
    .dp-day {margin:0 auto;width:30px;height:30px;line-height:30px;text-align: center;border-radius: 50%;}
    div.dp-selected {background: #55A8FD; color:#fff;}
    .dp-is-last {
      position: absolute; top: 50%; left: 50%; width: 50px;
      height: 30px; line-height: 30px;
      margin-left: -10px; margin-top: -15px;}
    .footer {
      background: #FDFDFF; color: #3D3D3D; font-size: 0.347rem;padding: 0 0.293rem;
      height: 45px; line-height: 45px; border-top: 1px solid #E0E0E0;
    }
    .footer p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .is-finish{
      position:absolute;
      right:0.63rem;
      top:0.33rem;
      color: #55A8FD;
      font-weight: bold;
    }
    .body-img {
      position:relative; height:100%; text-align: center;
    }
    .body-img > img {
      position: absolute;margin: auto;
      top: 0;right: 0;left: 0;bottom: 0;
    }
  }
</style>
<script>
  import dateUtil from 'ut/dateUtil'

  export default{
    data () {
      return {
        baseNumTime: new Date().getTime(),
        repeatType: '',
        repeatStrTimeArray: [],
        isLastDate: false,

        localType: 'everyDay',  //  week or month
        dayName: ['日', '一', '二', '三', '四', '五', '六'],
        days: [
          {val: 1, text: '周一', selected: false},
          {val: 2, text: '周二', selected: false},
          {val: 3, text: '周三', selected: false},
          {val: 4, text: '周四', selected: false},
          {val: 5, text: '周五', selected: false},
          {val: 6, text: '周六', selected: false},
          {val: 0, text: '周日', selected: false}
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
          {val: 32, text: '最后一天', selected: false, isLast: true}
        ],
        localStrTimeArray: [],
        localIsLastDate: false
      }
    },
    computed: {
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
      selectedText () {
        var sel = this.getSelected()
        var valStr
        switch (this.localType) {
          case 'everyDay':
            valStr = '每天重复'
            break
          case 'everyWeek':
            valStr = sel.length === 0 ? '' : '每周' + sel.map(d => { return this.dayName[d.val] }).join('，') + '重复'
            break
          case 'everyMonth':
            valStr = sel.length === 0 ? '' : '每月' + sel
              .filter(function (d) { return !d.isLast })
              .map(function (d) { return d.text }).join('，') + '号'
            //  如果最后一天被选中，则特殊处理
            if (this.dates[31].selected) {
              valStr += ', 最后一天'
            }
            valStr += '重复'
            break
          case 'everyYear':
            valStr = '每年' + '' + '重复'
            break
          default:
            break
        }
        return valStr
      }
    },
    methods: {
      initData () {
        this.setTab(this.repeatType || 'everyDay')
      },
      resetData () {
        this.localType = ''
        this.localStrTimeArray = []
        this.localIsLastDate = false
      },
      getSelected () {
        var list = this.localType === 'everyWeek' ? this.days : this.dates
        return list.filter(d => {
          return d.selected
        })
      },
      selfClose () {
        this.$emit('self-close')
      },
      tapCancel (e) {
        this.$emit('select-user-repeat-cancel')
        this.selfClose()
        e.preventDefault()
      },
      tapConfirm (e) {
        var res = this.getResult()
        this.$emit('select-user-repeat-confirm', res)
        this.selfClose()
        e.preventDefault()
      },
      setTab (tb) {
        //  设置localType
        this.resetData()
        this.localType = tb
        switch (tb) {
          case 'everyDay':
          case 'everyYear':
            this.selectSingleDay()
            break
          case 'everyWeek':
            this.selectDefaultDay()
            break
          case 'everyMonth':
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
        var arr = this.repeatStrTimeArray.map(t => {
          return new Date(dateUtil.dateText2Num(t)).getDay()
        })
        this.days.forEach(d => {
          d.selected = (arr.indexOf(d.val) !== -1)
        })
      },
      selectDefaultDate () {
        var arr = this.repeatStrTimeArray.map(t => {
          return new Date(dateUtil.dateText2Num(t)).getDate()
        })
        this.dates.forEach(d => {
          d.selected = (arr.indexOf(d.val) !== -1)
        })
        this.dates[this.dates.length - 1].selected = this.isLastDate
      },
      getSelectedDayValue () {
        const dayMills = 24 * 3600 * 1000
        var selected = this.getSelected()
        var base = new Date(this.baseNumTime)
        var baseDay = base.getDay() === 0 ? 7 : base.getDay()  //  周日的getDay()为0，转换为7
        return selected.map(s => {
          const sDay = s.val === 0 ? 7 : s.val
          const offset = sDay >= baseDay ? 0 : 7
          return dateUtil.dateNum2Text(this.baseNumTime + (sDay + offset - baseDay) * dayMills)
        })
      },
      getSelectedDateValue () {
        var selected = this.getSelected()
        var base = dateUtil.dateNum2Text(this.baseNumTime).substr(0, 6)
        var result = []
        for (var i = 0; i < selected.length; i++) {
          const s = selected[i]
          if (s.val === 32) continue
          result.push(base + (s.val < 10 ? '0' : '') + s.val)
        }
        return result
      },
      tapSelect (d) {
        if (d.selected) {
          var list = this.localType === 'everyWeek' ? this.days : this.dates
          //  如果是唯一的一天，则不允许取消
          var sel = list.filter(function (l) {
            return l.selected
          })
          if (sel.length <= 1) return
        }
        d.selected = !d.selected
      },
      getNumTimeArray () {
        switch (this.localType) {
          case 'everyDay':
          case 'everyYear':
            return [dateUtil.dateNum2Text(this.baseNumTime)]
          case 'everyWeek':
            return this.getSelectedDayValue()
          case 'everyMonth':
            return this.getSelectedDateValue()
          default:
            break
        }
      },
      checkUseLast () {
        return this.localType === 'everyMonth' && this.dates[this.dates.length - 1].selected
      },
      getResult () {
        return {
          baseNumTime: this.baseNumTime,
          repeatType: this.localType,
          repeatStrTimeArray: this.getNumTimeArray(),
          isLastDate: this.checkUseLast()
        }
      }
    },
    created () {},
    mounted () {
      this.initData()
    }
  }
</script>
