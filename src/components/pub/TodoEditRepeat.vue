<template>
  <div class="edit-repeat">
    <ul class="top-ul">
      <v-touch tag="li" @tap="setSelected(noRepeat)">
        <span>{{toCycle(noRepeat)}}</span>
        <i class="icon2-selected finish" v-show="selected === noRepeat"></i>
      </v-touch>
    </ul>
    <ul v-if="showShortcut">
      <v-touch tag="li" v-for="repeat in repeatList"
               :key="repeat.cid" @tap="setSelected(repeat)">
        <span>{{toCycle(repeat)}}{{toText(repeat)}}</span>
        <i class="icon2-selected finish" v-show="selected === repeat"></i>
      </v-touch>
    </ul>
    <v-touch class="user-repeat" @tap="showUserRepeat">
      <span class="list-key u-pull-left">{{toCycle(userRepeat)}}</span>
      <i class="icon2-arrow-right arrow u-pull-right"></i>
      <span class="list-value u-pull-right">{{repeatText}}</span>
    </v-touch>
  </div>
</template>
<style scoped>
  .edit-repeat {
    .arrow{
      font-size: 17px;
      color: #999999;
    }
    .time{
      position: absolute;
      left:2.5rem;top:0.07rem;
      font-family: PingFangSC-Regular;
      font-size: 17px;
      color: #999999;
    }
    .finish{
      position:absolute;
      right:0.63rem;
      top:0.3rem;
      color: #55A8FD;
      font-weight: bold;
    }
    ul{
      position: relative;
      border-bottom: 0.5px solid #E3E3E3;
      border-top: 0.5px solid #E3E3E3;
      background: #FFFFFF;
    }
    .sec{
      margin-top: 0.373rem;
    }
    span{
      display:block;
      margin-left: 0.45rem;
      color: #3D3D3D;
      font-family: PingFangSC-Regular;
      font-size: 17px;
    }
    .repeat{
      margin-left: 0.2rem;
    }
    li{
      position: relative;
      padding:2px;
      height: 1.112rem;
      line-height:  1.112rem;;
      border-bottom: 0.5px solid #E3E3E3;
      font-family: PingFangSC-Regular;
      font-size: 17px;
      color: #3D3D3D;
    }
    li:last-child{
      border:none;
    }
    .user-repeat {
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
      max-width:5rem;overflow:hidden;text-overflow: ellipsis;white-space: nowrap;
    }
    .user-repeat > * {
      line-height: 1.2rem;
    }
  }
</style>
<script>
  import dateUtil from 'ut/dateUtil'
  import jsUtil from 'ut/jsUtil'
  import selectRepeat from 'com/pub/SelectUserRepeat'
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
      var now = this.$store.state.schedule.strCurrentDate.replace(/[-/]/g, '')
      return {
        selected: null,
        //  不重复
        noRepeat: {cid: -1, type: 'noRepeat', repeatType: 'none', strTime: []},
        //  系统重复列表
        repeatList: [
          {cid: 1, type: 'everyDay', repeatType: 'everyDay', strTime: [now], showText: false},
          {cid: 2, type: 'everyWeek', repeatType: 'everyWeek', strTime: [now], showText: true},
          {cid: 3, type: 'everyMonth', repeatType: 'everyMonth', strTime: [now], showText: true},
          {cid: 4, type: 'everyYear', repeatType: 'everyYear', strTime: [now], showText: true},
          {cid: 5, type: 'weekday', repeatType: 'everyWeek', strTime: this.getWeekdayNum(now), showText: false}
        ],
        //  用户自定义的重复列表
        userRepeat: {cid: 99, type: 'userRepeat'},
        //  初始化时是否有repeat
        uRepeatType: null,
        uRepeatStrTimeArray: []
      }
    },
    computed: {
      currentTodo () {
        return this.$store.state.todo.currentTodo
      },
      //  根据currentTodo来判断是否显示重复
      showShortcut () {
        return !this.currentTodo.repeatType
      },
      todoDate () {
        return this.$store.state.pub.currentTodoDate
      },
      baseNumTime () {
        return dateUtil.dateText2Num(this.$store.state.schedule.strCurrentDate)
      },
      repeatText () {
        var text = dateUtil.repeatDayText(this.uRepeatType, this.uRepeatStrTimeArray)
        return text ? text + '重复' : ''
      },
      comRepeat () {
        var type = null
        var baseArray = []
        if (this.selected) {
          type = this.selected.repeatType
          baseArray = this.selected.strTime
        } else {
          type = this.uRepeatType
          baseArray = this.uRepeatStrTimeArray
        }
        return {
          selected: this.selected,
          type,
          baseArray
        }
      }
    },
    methods: {
      initData () {
        //  有修改缓存读修改缓存，否则从原数据读
        var t = this.todoDate
        if (t._selected || t._uRepeatType) {
          this.uRepeatType = t._uRepeatType
          this.uRepeatStrTimeArray = t._uRepeatStrTimeArray
          if (t._selected) {
            this.selected = this.findSelect(t._selected.cid)
          }
        } else {
          this.uRepeatType = t.repeatType
          var base = t.repeatBaseTime
          this.uRepeatStrTimeArray = (base === null || base === '' ? [] : base.split(','))
          //  无缓存的情况下，如果存在repeatType则设置selected为null，如果不存在repeatType，则默认选中noRepeat
          this.selected = t.repeatType ? null : this.noRepeat
        }
      },
      toText (obj) {
        return obj.showText ? dateUtil.repeatDayText(obj.type, obj.strTime) : ''
      },
      toCycle (obj) {
        return dateUtil.repeatCycleName(obj.type)
      },
      findSelect (cid) {
        if (cid === this.noRepeat.cid) return this.noRepeat
        return jsUtil.findByProperty(this.repeatList, 'cid', cid)
      },
      setSelected (obj) {
        this.selected = obj
        this.uRepeatType = null
        this.uRepeatStrTimeArray = []
      },
      //  根据baseVal获取工作日的time value，如果baseVal是周一到周五，那么获取当周的，如果baseVal是周六或者周日，那么获取下一周的
      getWeekdayNum (strVal) {
        var baseVal = dateUtil.dateText2Num(strVal)
        var date = new Date(baseVal)
        var dayMills = 24 * 3600 * 1000
        var day = date.getDay()
        if (day === 0 || day === 6) {
          date = new Date(baseVal + 3 * dayMills)
        }
        var b = dateUtil.firstDayOfWeek(date, 0).getTime() + 1 * dayMills
        return [0, 1, 2, 3, 4].map(val => {
          return dateUtil.dateNum2Text(b + val * dayMills)
        })
      },
      showUserRepeat () {
        this.selected = null
        selectRepeat.show({
          baseNumTime: this.baseNumTime,
          repeatType: this.uRepeatType,
          repeatStrTimeArray: this.uRepeatStrTimeArray,
          success: result => {
            if (result.repeatType) {
              this.selected = null
            }
            this.uRepeatType = result.repeatType
            this.uRepeatStrTimeArray = result.repeatStrTimeArray
          }
        })
      },
      getResult () {
        var params = {
          _selected: this.selected,
          _uRepeatType: this.uRepeatType,
          _uRepeatStrTimeArray: this.uRepeatStrTimeArray
        }
        //  表示选择的是“不重复”
        if (this.comRepeat.type === 'none') {
          params['repeatType'] = null
          params['repeatBaseTime'] = null
        } else {
          params['repeatType'] = this.comRepeat.type
          params['repeatBaseTime'] = this.comRepeat.baseArray.join(',')
          var strDate = dateUtil.dateNum2Text(this.baseNumTime, '/')
          params['startDate'] = strDate
          params['endDate'] = strDate
        }
        return params
      },
      saveTodoRepeatState () {
        var res = this.getResult()
        this.$store.commit('PUB_TODO_DATE_UPDATE', {data: res})
      }
    },
    created () {
      this.initData()
      window.rsqadmg.execute('setTitle', {title: '设置重复'})
      window.rsqadmg.exec('setOptionButtons', {hide: true})
    },
    beforeRouteLeave (to, from, next) {
      this.saveTodoRepeatState()
      next()
    }
  }
</script>
