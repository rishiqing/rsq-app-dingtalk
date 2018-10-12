<template>
  <div class="edit-date">
    <div class="date-picker">
      <div class="dp-sel-type">
        <v-touch
          :class="{'is-active': dateType ==='single'}"
          class="dp-btn"
          @tap="tapChangeType($event, 'single')">
          单日
        </v-touch>
        <v-touch
          :class="{'is-active': dateType ==='discrete'}"
          class="dp-btn"
          @tap="tapChangeType($event, 'discrete')">
          多日
        </v-touch>
        <v-touch
          :class="{'is-active': dateType ==='range'}"
          class="dp-btn"
          @tap="tapChangeType($event, 'range')">
          起止
        </v-touch>
      </div>
      <div class="dp-title">
        <!--<v-touch class="dp-title-tag u-pull-left" @tap="tapEmpty($event)">空</v-touch>-->
        <!--<v-touch class="dp-title-tag u-pull-right" @tap="tapBackToday($event)">今</v-touch>-->
        <v-touch
          class="icon icon-keyboard_arrow_left u-pull-left"
          tag="i"
          @tap="tapChangeMonth($event, -1)"/>
        <div class="dp-title-text">
          {{ focusDate.getFullYear() }}年{{ focusDate.getMonth() + 1 }}月
        </div>
        <v-touch
          tag="i"
          class="icon icon-keyboard_arrow_right u-pull-right"
          @tap="tapChangeMonth($event, 1)"/>
          <!--<v-touch @tap="backToToday">-->
          <!--<span class="backToday">今</span>-->
          <!--</v-touch>-->
      </div>
      <div class="dp-content">
        <table class="dp-table">
          <thead>
            <tr>
              <td class="week">周日</td>
              <td class="week">周一</td>
              <td class="week">周二</td>
              <td class="week">周三</td>
              <td class="week">周四</td>
              <td class="week">周五</td>
              <td class="week">周六</td>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(weekArray, index) in days"
              :key="index">
              <v-touch
                v-for="day in weekArray"
                :key="day.date.getTime()"
                tag="td"
                @tap="tapDay($event, day)">
                <div
                  :class="{'dp-grey': !day.isInMonth, 'dp-selected': day.isSelected,'is-today': isToday(day),'has-go': hasGo(day)}"
                  class="dp-day">
                  {{ day.date.getTime() === numToday ? '今' : day.date.getDate() }}
                </div>
              </v-touch>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <v-touch
      class="date-repeat"
      @tap="gotoRepeat">
      <span class="list-key u-pull-left">重复</span>
      <i class="icon2-arrow-right arrow u-pull-right light-color icon2-arrow-right-small arrow"/>
      <span v-if="!isBackNewVersion" class="list-value u-pull-right light-color">
        {{ repeatText }}
      </span>
      <span v-else class="list-value u-pull-right light-color">
        {{ res }}
      </span>
    </v-touch>
    <div class="btn-group">
      <div class="btn-wrap">
        <v-touch
          tag="a"
          class="weui-btn weui-btn_primary"
          href="javascript:;"
          @tap="accept">
          完成
        </v-touch>
        <v-touch
          class="weui-btn clear"
          tag="a"
          @tap="tapEmpty">
          清除日期
        </v-touch>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
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
        selectNumDate: null,  //  表示重复当前选中的日期
        res: '不重复'
      }
    },
    computed: {
      isBackNewVersion () {
        return this.$store.state.loginUser.rsqUser.isBackNewVersion
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
      isNewRepeat () {
        return this.currentTodo.rrule !== ''
      },
      rruleText () {
        return this.currentTodo.rrule
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
      },
      // repeatTypeNew: {
      //   res: '',
      //   get () {
      //     if (this.rruleText) {
      //       var rruleObj = this.$rrule.fromString(this.rruleText).origOptions
      //       this.res = dateUtil.rruleToText(rruleObj, this.currentTodo.startDate)
      //       return this.res
      //     } else {
      //       this.res = '不重复'
      //       return this.res
      //     }
      //   },
      //   set (newValue) {

      //     return this.res = newValue
      //   }
      // }
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
    methods: {
      accept () {
        this.$router.go(-1)
      },
      backToToday () {
        this.focusDate = new Date()
        this.dateType = 'single'
        this.selectNumDate = [dateUtil.getZeroTime(new Date()).getTime()]
        this.resetType()
      },
      isToday (day) {
        return day.date.getTime() === this.numToday
      },
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
        this.$store.commit('SAVE_CURRENT_RRULE',{rrule: ''})
        this.res = '不重复'
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
        this.$store.commit('SAVE_CURRENT_RRULE',{rrule: ''})
        this.res = '不重复'
        this.tapEmpty()
        this.dateType = type
        this.resetType()
        if (e) e.preventDefault()
      },
      tapChangeMonth (e, offset) {
        this.resetMonth(offset)
        e.preventDefault()
      },
      tapDay (e, day) {
        // 过去的时间不允许点击,计算的时候，增加了1分钟的毫秒数作为误差
        var timeHaveGo = new Date().getHours() * 3600000 + (new Date().getMinutes() + 1) * 60000 + new Date().getSeconds() * 1000
        if (new Date(day.date).getTime() < new Date().getTime() - timeHaveGo) {
          return
        }
        this.$store.commit('SAVE_CURRENT_RRULE',{rrule: ''})
        this.res = '不重复'
        //  如果是在repeat状态下点击日期，那么清除重复，进入single状态
        if (this.dateType === 'repeat' || this.dateType === 'none') {
          this.dateType = 'single'
          this.tapDay(e, day)
        }
        this.toggleSelect(day)
        e.preventDefault()
      },
      hasGo (day) {
        var timeHaveGo = new Date().getHours() * 3600000 + (new Date().getMinutes() + 1) * 60000 + new Date().getSeconds() * 1000
        return new Date(day.date).getTime() < new Date().getTime() - timeHaveGo
      },
      resetType () {
        this.resetMonth() // 这是干吗用的
      },
      resetMonth (offset) {
        if (offset) {
          this.focusDate = dateUtil.firstDayOfMonth(this.focusDate, offset)
        }
        this.days = dateUtil.getMonthDays(this.focusDate) //  this.days数据结构很有意思
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
        return newObj.startDate !== oldObj.startDate ||
          newObj.endDate !== oldObj.endDate ||
          newObj.dates !== oldObj.dates ||
          newObj.repeatType !== oldObj.repeatType ||
          newObj.repeatBaseTime !== oldObj.repeatBaseTime ||
          newObj.isLastDate !== oldObj.isLastDate
      },
      gotoRepeat () {
        if (this.isBackNewVersion) {
          this.$router.push('/todoEdit/repeatNew')
        } else {
          this.$router.push('/todoEdit/repeat')
        }
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
          resObj['_uRepeatOverDate'] = null
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
        if (this.isBackNewVersion) {
          o.isCloseRepeat = false
          o.rrule = this.currentTodo.rrule
          o.startDate = moment().format('YYYY/MM/DD')
          o.endDate = moment().format('YYYY/MM/DD')
        } else if (c.repeatType) {
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
      submitTodo (next, to) {
        // var that = this
        if (this.isModified()) {
          if (this.isEdit) {
            // window.rsqadmg.exec('showLoader', {text: '保存中...'})
          }
          var editItem = this.getSubmitResult()
          //  如果日期均为空，则容器为收纳箱
          if (!editItem.startDate && !editItem.endDate && !editItem.dates) {
            editItem['pContainer'] = 'inbox'
          } else {
            editItem['pContainer'] = 'IE'
          }
          //  repeatOverDate传给后台的值和后台发送过来的值格式不一样……好坑
          const overDate = editItem.repeatOverDate
          if (overDate) {
            editItem.repeatOverDate = dateUtil.dateNum2Text(dateUtil.dateText2Num(overDate))
          }
          return this.$store.dispatch('updateTodoDate', {editItem: editItem})
            .then(() => {
              // console.log(2)
              this.$store.commit('PUB_TODO_DATE_DELETE')
              // if (to.name !== 'todoNew') {
                // if (this.isEdit) {
                  // window.rsqadmg.exec('hideLoader')
                  // window.rsqadmg.execute('toast', {message: '保存成功'})
                // }
                // var url = window.location.href.split('#')
                // var name = that.$store.getters.loginUser.authUser.name
                // var des = ''
                // if (editItem.repeatType !== undefined) {
                //   des = name + ' 更改了任务日期'
                // } else if (editItem.dates === null && editItem.endDate === null && editItem.startDate === null) {
                //   des = name + ' 清空了任务日期'
                // } else if (editItem.dates === null && editItem.endDate === editItem.startDate) {
                //   var singleDate = editItem.endDate.split('/')
                //   des = name + ' 更改了任务日期为 ' + singleDate[0] + '年' + singleDate[1] + '月' + singleDate[2] + '日'
                // } else if (editItem.dates === null && editItem.endDate !== editItem.startDate) {
                //   var startDate = editItem.startDate.split('/')
                //   var endDate = editItem.endDate.split('/')
                //   des = name + ' 更改了任务日期为 ' + startDate[0] + '年' + startDate[1] + '月' + startDate[2] + '日 ' + '-' + endDate[0] + '年' + endDate[1] + '月' + endDate[2] + '日'
                // } else if (editItem.dates) {
                //   var result = dateUtil.repeatDate2Text(editItem)
                //   des = name + ' 更改了任务日期为 ' + result
                // }
                // var datas = {
                //   corpId: that.$store.getters.loginUser.authUser.corpId,
                //   agentid: that.$store.getters.loginUser.authUser.corpId,
                //   title: des,
                //   url: url[0] + '#' + '/sche/todo/' + that.$store.state.todo.currentTodo.id,
                //   description: that.$store.state.todo.currentTodo.pTitle,
                //   receiverIds: that.$store.state.todo.currentTodo.receiverIds
                // }
                // if (datas.description) {
                  // this.$store.dispatch('qywxSendMessage', datas)
                // }
              // }
              next()
            })
        }
        next()
      }
    },
    mounted () {
      if (this.rruleText) {
        var rruleObj = this.$rrule.fromString(this.rruleText).origOptions
        this.res = dateUtil.rruleToText(rruleObj, this.currentTodo.startDate)
      } else {
        this.res = '不重复'
      }
    },
    beforeRouteLeave (to, from, next) {
      //  如果是从日期页面跳回到编辑页面的，那么即使不在收纳箱中了，那么也暂时不显示checkbox
      if (this.currentTodo['pContainer'] === 'inbox') {
        this.$store.commit('DELAY_SHOW_CHECKBOX')
      }
      //  做pub区缓存
      this.saveTodoDateState()

      if (to.name !== 'todoNew' && to.name !== 'todoEdit' && to.name !== 'demo') {
        return next()
      }
//      next()
      this.submitTodo(next, to)
    }
  }
</script>
<style lang="scss" scoped>
  .backToday{
    border: 0.5px solid #D4D4D4;
    border-radius: 50%;
    color:#4A90E2;
    width: 25px;
    height: 25px;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .edit-date {
    .light-color {color: #999999;}
    .date-picker {
      box-sizing: border-box;background: #fff;
    }
    .dp-title {
      height: 63px;line-height: 63px;
      font-family: PingFangSC-Regular;
      font-size: 19px;
      color: #000000;
      // padding: 0 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .dp-title-text {
      text-align: center;
      font-family: PingFangSC-Medium;
      font-size: 17px;
      color: #3D3D3D;
    }
    .dp-title .icon {
      font-size: 20px;
      color: #BFC1C2;
      margin-left: 30px;
      margin-right: 30px;
    }
    .dp-title .dp-title-tag {font-size: 0.4rem;line-height:1;margin-top:12px;padding:5px;border: solid 0.5px #D4D4D4;border-radius: 50%;}
    .dp-table {width:100%;height:8rem;text-align: center;}
    .dp-grey {color:  rgba(25,31,37,0.40) !important;}
    .dp-table .dp-selected {
      background: #55A8FD;
      color:white;}
    .dp-sel-type {position: relative;
      // border-bottom: solid 0.5px #D4D4D4;
      overflow: hidden;
      background-color: #f5f5f5;
      height: 40px;line-height: 40px;}
    .dp-sel-type:after{
      content: " ";
      position: absolute;
      left: 0;
      bottom: -1px;
      right: 0;
      height: 1px;
      border-top: 1px solid #d4d4d4;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
    .dp-btn {
      float: left;
      width: 33.3333%;
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
      font-size: 13px;
      color: #999998;
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
    .arrow{
      font-size:17px;
      color: #999999;
    }
    .date-repeat{
      position: relative;
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      margin-top: 20px;
      padding: 0 0.4rem;
      background-color: white;
      align-items: center;
      // border-top: 0.5px solid #D4D4D4;
      // border-bottom:0.5px solid #D4D4D4;
      font-family: PingFangSC-Regular;
      font-size: 17px;
    }
    .date-repeat:before{
      content: " ";
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 1px;
      border-top: 1px solid #d4d4d4;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
    .date-repeat:after{
      content: " ";
      position: absolute;
      left: 0;
      bottom: -1px;
      right: 0;
      height: 1px;
      border-top: 1px solid #d4d4d4;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
    span.list-value {margin-right:0.2rem;
      max-width:7rem;overflow:hidden;text-overflow: ellipsis;white-space: nowrap;
    }
    .date-repeat > * {
      line-height: 1.2rem;
    }
    .date-clear {
      text-align: center;
      line-height: 1.2rem;
      font-size: 0.4rem;
      background-color: #FFF;
      position: absolute;
      width: 100%;
      // bottom: 0;
      border-top: 0.5px solid #d4d4d4;
    }
    .has-go{
      color: rgba(25,31,37,0.4)
    }
  }
  tr{
    border-bottom: 0.5px solid #d4d4d4;
  }
  td{
    border-right: 0.5px solid #d4d4d4;
  }
  thead td{
    border-right: 0;
  }
  .is-active{
    box-shadow:0px -2px 0px 0px #0082EF inset;
    position: relative;
    z-index: 999999;
  }
  .clear{
    color: #000 !important;
    background-color: #fff;
    border: 0.5px solid #d4d4d4
  }

</style>
