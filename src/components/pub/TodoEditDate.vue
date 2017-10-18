<template>
  <div class="edit-date">
    <div class="date-picker">
      <div class="dp-sel-type">
        <v-touch class="dp-btn"
                 @tap="tapChangeType($event, 'single')"
                 :class="{'is-active': dateType=='single'}">单日</v-touch>
        <div class="dp-v-line"><div class="dp-v-sep v-h-center"></div></div>
        <v-touch class="dp-btn"
                 @tap="tapChangeType($event, 'discrete')"
                 :class="{'is-active': dateType=='discrete'}">多日</v-touch>
        <div class="dp-v-line"><div class="dp-v-sep v-h-center"></div></div>
        <v-touch class="dp-btn"
                 @tap="tapChangeType($event, 'range')"
                 :class="{'is-active': dateType=='range'}">起止</v-touch>
      </div>
      <div class="dp-title">
        <!--<v-touch class="dp-title-tag u-pull-left" @tap="tapEmpty($event)">空</v-touch>-->
        <!--<v-touch class="dp-title-tag u-pull-right" @tap="tapBackToday($event)">今</v-touch>-->
        <v-touch tag="i" class="icon icon-keyboard_arrow_left u-pull-left"
                 @tap="tapChangeMonth($event, -1)"></v-touch>
        <v-touch tag="i" class="icon icon-keyboard_arrow_right u-pull-right"
                 @tap="tapChangeMonth($event, 1)"></v-touch>
        <div class="dp-title-text">
          {{focusDate.getFullYear()}}年{{focusDate.getMonth() + 1}}月
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
                {{day.date.getTime() === numToday ? '今' : day.date.getDate()}}
              </div>
            </v-touch>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <v-touch class="date-repeat" @tap="gotoRepeat">
      <span class="list-key u-pull-left">重复</span>
      <i class="icon2-arrow-right arrow u-pull-right light-color"></i>
      <span class="list-value u-pull-right light-color">{{repeatText}}</span>
    </v-touch>
    <v-touch tag="p" class="date-clear" @tap="tapEmpty">清除日期放入收纳箱</v-touch>
  </div>
</template>
<style lang="scss">
  .edit-date {
    .light-color {color: #999999;}
    .date-picker {
      box-sizing: border-box;margin-top: 0.25rem;background: #fff;
      border-top: 1px solid #E0E0E0;
      border-bottom:1px solid #E0E0E0 ;
      padding-bottom: 0.4rem;
    }
    .dp-title {
      height: 72px;line-height: 72px;
      font-family: PingFangSC-Regular;
      font-size: 19px;
      color: #000000;
      letter-spacing: -0.46px;
      padding: 0 0.4rem;
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
    .dp-table {width:100%;height:8rem;text-align: center;}
    .dp-grey {color: #a8a8a8;}
    .dp-table .dp-selected {
      background: #55A8FD;
      color:white;}
    .dp-sel-type {position: relative;border-bottom: solid 1px #e4e4e4;overflow: hidden;
      height: 40px;line-height: 40px;}
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
      position: relative;
      width: 2%;
      color: #979797;
      text-align: center;
      height: 100%;
      /*font-size: 2.8rem;}*/
    }
    .dp-v-sep {
      width: 1px; height: 0.64rem;background: #979797;
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
      color: #666666;
    }
    .edit-date div{

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
  }
</style>
<script>
  import dateUtil from 'ut/dateUtil'

  /**
   * 主model：state.pub.currentTodoDate，带下划线的是用于不同页面数据共享的属性，不会存储在后台
   * {
   * //  一级（date）页面的数据
   *   dates: null,
   *   startDate: null,
   *   endDate: null,
   *   repeatType: null,
   *   repeatBaseTime: null,
   *   //  二级（repeat）页面需要使用的数据以"_"作为前缀，二级页面
   *   _selected: null,  //  TodoEditRepeat页面中用户的选择
   *   _uRepeatType: null,  //  TodoEditRepeat页面中用户自定义的重复规则
   *   _uRepeatStrTimeArray: null  //TodoEditRepeat页面中用户自定义的重复规则的baseTime数组
   * }
   */
  export default {
    data () {
      return {
        compId: 'SYSTEM_SELECT_DATE',
        weeks: ['日', '一', '二', '三', '四', '五', '六'],
        months: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
        focusDate: new Date(),  //  表示当前显示的月份，决定了当前显示哪个月份的日历
        days: [],
        //  重复功能相关
        dateType: '',  //  single单日期, range起止日期, discrete, 离散间隔日期，repeat:使用重复，none表示dateType被清空
        selectNumDate: null  //  表示重复当前选中的日期
      }
    },
    computed: {
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
      initData () {
        var dateStruct = dateUtil.backend2frontend(this.currentTodoDate)
        this.dateType = dateStruct.dateType || 'single'
        this.selectNumDate = dateStruct.dateResult || []
        this.focusDate = dateStruct.dateResult ? new Date(dateStruct.dateResult[0]) : new Date()
        this.resetType()
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
      tapChangeType (e, type) {
        this.dateType = type
        this.resetType()
        if (e) e.preventDefault()
      },
      tapChangeMonth (e, offset) {
        this.resetMonth(offset)
        e.preventDefault()
      },
      tapDay (e, day) {
        //  如果是在repeat状态下点击日期，那么清除重复，进入single状态
        if (this.dateType === 'repeat') {
          this.dateType = 'single'
          this.tapDay(e, day)
        }
        this.toggleSelect(day)
        e.preventDefault()
      },
      resetType () {
        this.resetMonth() // 这是干吗用的
      },
      resetMonth (offset) {
        if (offset) {
          this.focusDate = dateUtil.firstDayOfMonth(this.focusDate, offset)
        }
        this.days = dateUtil.getMonthDays(this.focusDate)
        this.selectDays()
      },
      toggleSelect (day) {
        switch (this.dateType) {
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
      selectDays () { // 略复杂
        if (this.selectNumDate.length === 0) {
          return
        }
        var self = this
        this.days.forEach(function (array) {
          array.forEach(function (obj) {
            obj.isSelected = self.isInSelect(self.dateType, obj.date, self.selectNumDate)
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
      },
      isModified () {
        //  TODO  判断是否更新过
        var oldObj = this.currentTodo
        var newObj = this.currentTodoDate
        return newObj.startDate !== oldObj.startDate ||
          newObj.endDate !== oldObj.endDate ||
          newObj.dates !== oldObj.dates ||
          newObj.repeatType !== oldObj.repeatType ||
          newObj.repeatBaseTime !== oldObj.repeatBaseTime ||
          newObj.isLastDate !== oldObj.isLastDate
      },
      gotoRepeat () {
        this.$router.push('/todoEdit/repeat')
      },
      saveTodoDateState () {
        var sorted = this.selectNumDate.sort((a, b) => { return a > b ? 1 : -1 })
        var resObj = dateUtil.frontend2backend({dateType: this.dateType, dateResult: sorted, sep: '/'})
        //  如果不是repeat类型，那么清除
        if (this.dateType !== 'repeat') {
          resObj['repeatType'] = null
          resObj['repeatBaseTime'] = null
          resObj['_selected'] = null
          resObj['_uRepeatType'] = null
          resObj['_uIsLastDate'] = false
          resObj['_uRepeatStrTimeArray'] = null
        }

        this.$store.commit('PUB_TODO_DATE_UPDATE', {data: resObj})
      },
      getSubmitResult () {
        var c = this.currentTodoDate
        var o = {
          startDate: c.startDate,
          endDate: c.endDate,
          dates: c.dates
        }
        //  如果重复相关属性存在，那么处理重复相关的其他属性
        if (c.repeatType) {
          o.repeatType = c.repeatType
          o.repeatBaseTime = c.repeatBaseTime
          o.alwaysRepeat = c.alwaysRepeat
          o.isCloseRepeat = false
          o.isLastDate = c.isLastDate
          o.repeatOverDate = c.repeatOverDate
        } else {
          o.isCloseRepeat = true
        }
        var actParamse = JSON.parse(JSON.stringify(o))
        o.createActive = {
          name: 'saveDate',
          params: actParamse
        }
        return o
      },
      submitTodo (next) {
        if (this.isModified()) {
          if (this.isEdit) {
            window.rsqadmg.exec('showLoader', {text: '保存中...'})
          }
          var editItem = this.getSubmitResult()
          //  如果日期均为空，则容器为收纳箱
          if (!editItem.startDate && !editItem.endDate && !editItem.dates) {
            editItem['pContainer'] = 'inbox'
          } else {
            editItem['pContainer'] = 'IE'
          }
          return this.$store.dispatch('updateTodoDate', {editItem: editItem})
            .then(() => {
              this.$store.commit('PUB_TODO_DATE_DELETE')
              if (this.isEdit) {
                window.rsqadmg.exec('hideLoader')
                window.rsqadmg.execute('toast', {message: '保存成功'})
              }
              next()
            })
        } else {
          next()
        }
      }
    },
    created () {
      this.initData()
      var that = this
      window.rsqadmg.exec('setTitle', {title: '日期选择'})
      window.rsqadmg.exec('setOptionButtons', {
        btns: [{key: 'backToday', name: '今天'}],
        success (res) {
          if (res.key === 'backToday') {
            that.tapBackToday()
          }
        }
      })
      this.$store.dispatch('setNav', {isShow: false})
    },
    beforeRouteLeave (to, from, next) {
      //  做pub区缓存
      this.saveTodoDateState()
      if (to.name !== 'todoNew' && to.name !== 'todoEdit' && to.name !== 'demo') {
        return next()
      }
//      next()
      this.submitTodo(next)
    }
  }
</script>
