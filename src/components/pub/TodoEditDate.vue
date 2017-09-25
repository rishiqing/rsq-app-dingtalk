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
    .dp-selected {
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
   *   dates: null,
   *   startDate: null,
   *   endDate: null,
   *   repeatType: null,
   *   repeatBaseTime: null,
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
        currentDate: new Date(),  //  表示当前显示的月份，决定了当前显示哪个月份的日历
        days: [],
        dateType: '',  //  single单日期, range起止日期, discrete, 离散间隔日期，repeat:使用重复
        selectNumDate: null  //  表示当前选中的日期
      }
    },
    computed: {
      currentTodo () {
        return this.$store.state.todo.currentTodo
      },
      isEdit () {
        return !!this.currentTodo.id
      },
      currentTodoDate () {
        return this.$store.state.pub.currentTodoDate
      },
      comRepeat () {
        var type = null
        var baseArray = []
        var c = this.currentTodoDate
        if (c._selected) {
          type = c._selected.repeatType
          baseArray = c._selected.strTime
        } else {
          type = c._uRepeatType
          baseArray = c._uRepeatStrTimeArray
        }
        return {
          selected: c._selected,
          type,
          baseArray
        }
      },
      repeatText () {
        var text
        console.log('=@_@===this.comRepeat===#_#=' + JSON.stringify(this.comRepeat))
        if (this.comRepeat.selected) {
          if (this.comRepeat.type) {
            text = dateUtil.repeatDayText(this.comRepeat.type, this.comRepeat.baseArray)
          }
        } else {
          var c = this.currentTodoDate
          if (c.repeatType) {
            var arr = this.currentTodoDate.repeatBaseTime.split(',')
            text = dateUtil.repeatDayText(c.repeatType, arr)
          }
        }
        return (text || '不') + '重复'
      }
    },
    methods: {
      initData () {
        var c = this.currentTodo

        var obj
        //  如果currentTodoDate不存在，那么从currentTodo获取currentTodoDate的信息
        if (this.currentTodoDate === null) {
          obj = {
            startDate: c.startDate || null,
            endDate: c.endDate || null,
            dates: c.dates || null,
            repeatType: c.repeatType || null,
            repeatBaseTime: c.repeatBaseTime || null
          }
          this.$store.commit('PUB_TODO_DATE_UPDATE', {data: obj})
        }
        //  如果comRepeat.type存在，说明是新增的repeat
        if (this.comRepeat.type) {
          this.dateType = 'repeat'
          this.selectNumDate = []
        } else {
          var dateStruct = dateUtil.backend2frontend(this.currentTodoDate)
          this.dateType = dateStruct.dateType || 'single'
          this.selectNumDate = dateStruct.dateResult || []
        }
        this.resetType()
      },
      clearRepeat () {

      },
      tapEmpty (e) {
        this.selectNumDate = []
        this.clearSelected()
        if (e) e.preventDefault()
      },
      tapBackToday (e) {
        var nowDate = dateUtil.clearTime(new Date())
        this.currentDate = nowDate
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
          this.clearRepeat()
          this.dateType = 'single'
          this.resetType()
        }
        this.toggleSelect(day)
        e.preventDefault()
      },
      resetType () {
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
      selectDays () {
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
      },
      isModified () {
        //  TODO  判断是否更新过
        var oldObj = this.currentTodo
        var newObj = this.currentTodoDate
        console.log('=@_@===oldObj===#_#=' + JSON.stringify(oldObj))
        console.log('=@_@===newObj===#_#=' + JSON.stringify(newObj))
        return newObj.startDate !== oldObj.startDate ||
          newObj.endDate !== oldObj.endDate ||
          newObj.dates !== oldObj.dates ||
          newObj.repeatType !== oldObj.repeatType ||
          newObj.repeatBaseTime !== oldObj.repeatBaseTime
      },
      gotoRepeat () {
        this.$router.push('/todoEdit/repeat')
      },
      saveTodoDateState () {
        var sorted = this.selectNumDate.sort((a, b) => { return a > b ? 1 : -1 })
        var resObj = dateUtil.frontend2backend({dateType: this.dateType, dateResult: sorted, sep: '/'})

        resObj.repeatType = this.comRepeat.type
        resObj.repeatBaseTime = this.comRepeat.baseArray.join(',')
        this.$store.commit('PUB_TODO_DATE_UPDATE', {data: resObj})
      },
      getSubmitResult () {
        var c = this.currentTodoDate
        var o = {
          startDate: c.startDate,
          endDate: c.endDate,
          dates: c.dates,
          repeatType: c.repeatType,
          repeatBaseTime: c.repeatBaseTime
        }
        return o
      },
      submitTodo (next) {
        console.log('=@_@===this.isModified()===#_#=' + JSON.stringify(this.isModified()))
        if (this.isModified()) {
          if (this.isEdit) {
            window.rsqadmg.exec('showLoader', {text: '保存中...'})
          }
          return this.$store.dispatch('updateTodoDate', {editItem: this.getSubmitResult()})
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
      this.submitTodo(next)
    }
  }
</script>
