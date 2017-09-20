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
        <v-touch class="tab-bg" @tap="setTab('day')">
          <span class="tab-text" :class="{'is-tab-active': tab === 'day'}">每天</span>
        </v-touch>
        <v-touch class="tab-bg" @tap="setTab('week')">
          <span class="tab-text" :class="{'is-tab-active': tab === 'week'}">每周</span>
        </v-touch>
        <v-touch class="tab-bg" @tap="setTab('month')">
          <span class="tab-text" :class="{'is-tab-active': tab === 'month'}">每月</span>
        </v-touch>
        <v-touch class="tab-bg" @tap="setTab('year')">
          <span class="tab-text" :class="{'is-tab-active': tab === 'year'}">每年</span>
        </v-touch>
      </div>
      <div class="body">
        <div class="body-img" v-show="tab === 'day'">
          <img src="../../../assets/img/repeat-day.png">
        </div>
        <div class="body-list" v-show="tab === 'week'">
          <ul>
            <v-touch tag="li" v-for="d in days" :key="d.val" @tap="tapSelect(d)">
              <span>{{d.text}}</span>
              <i class="icon2-selected is-finish" v-show="d.isSelected"></i>
            </v-touch>
          </ul>
        </div>
        <div class="body-table" v-show="tab === 'month'">
          <table class="dp-table">
            <tbody>
            <tr v-for="(weekArray, index) in calDate" :key="index">
              <v-touch tag="td" v-for="day in weekArray" :key="day.val"
                       @tap="tapSelect(day)">
                <div class="dp-day"
                     :class="{'dp-selected': day.isSelected, 'dp-is-last': day.isLast}">
                  {{day.text}}
                </div>
              </v-touch>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="body-img" v-show="tab === 'year'">
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
  export default{
    data () {
      return {
        tab: 'week',  //  week or month
        'default': null,
        dayName: ['日', '一', '二', '三', '四', '五', '六'],
        days: [
          {val: 1, text: '周一', isSelected: false},
          {val: 2, text: '周二', isSelected: false},
          {val: 3, text: '周三', isSelected: false},
          {val: 4, text: '周四', isSelected: false},
          {val: 5, text: '周五', isSelected: false},
          {val: 6, text: '周六', isSelected: false},
          {val: 0, text: '周日', isSelected: false}
        ],
        dates: [
          {val: 1, text: '1', isSelected: false},
          {val: 2, text: '2', isSelected: false},
          {val: 3, text: '3', isSelected: false},
          {val: 4, text: '4', isSelected: false},
          {val: 5, text: '5', isSelected: false},
          {val: 6, text: '6', isSelected: false},
          {val: 7, text: '7', isSelected: false},
          {val: 8, text: '8', isSelected: false},
          {val: 9, text: '9', isSelected: false},
          {val: 10, text: '10', isSelected: false},
          {val: 11, text: '11', isSelected: false},
          {val: 12, text: '12', isSelected: false},
          {val: 13, text: '13', isSelected: false},
          {val: 14, text: '14', isSelected: false},
          {val: 15, text: '15', isSelected: false},
          {val: 16, text: '16', isSelected: false},
          {val: 17, text: '17', isSelected: false},
          {val: 18, text: '18', isSelected: false},
          {val: 19, text: '19', isSelected: false},
          {val: 20, text: '20', isSelected: false},
          {val: 21, text: '21', isSelected: false},
          {val: 22, text: '22', isSelected: false},
          {val: 23, text: '23', isSelected: false},
          {val: 24, text: '24', isSelected: false},
          {val: 25, text: '25', isSelected: false},
          {val: 26, text: '26', isSelected: false},
          {val: 27, text: '27', isSelected: false},
          {val: 28, text: '28', isSelected: false},
          {val: 29, text: '29', isSelected: false},
          {val: 30, text: '30', isSelected: false},
          {val: 31, text: '31', isSelected: false},
          {val: 32, text: '最后一天', isSelected: false, isLast: true}
        ],
        success () {},
        cancel () {}
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
        switch (this.tab) {
          case 'day':
            valStr = '每天重复'
            break
          case 'week':
            valStr = sel.length === 0 ? '' : '每周' + sel.map(d => { return this.dayName[d.val] }).join('，') + '重复'
            break
          case 'month':
            valStr = sel.length === 0 ? '' : '每月' + sel.map(d => { return d.text }).join('，') + '号重复'
            break
          case 'year':
            valStr = '每年' + '' + '重复'
            break
          default:
            break
        }
        return valStr
      }
    },
    methods: {
      getSelected () {
        var list = this.tab === 'week' ? this.days : this.dates
        return list.filter(d => {
          return d.isSelected
        })
      },
      selfClose () {
        window.onpopstate = null
        this.cancel()
        this.$emit('self-close')
      },
      tapCancel (e) {
        this.selfClose()
        e.preventDefault()
      },
      tapConfirm (e) {
        this.success({
        })
        this.selfClose()
        e.preventDefault()
      },
      setTab (tb) {
        this.tab = tb
      },
      tapSelect (d) {
        d.isSelected = !d.isSelected
      }
    },
    mounted () {
      //  如果通过任意方式跳出页面了，那么关闭当前选择框
      window.onpopstate = () => {
        this.selfClose()
      }
    }
  }
</script>
