<template>
  <div class="edit-repeat">
    <ul class="top-ul no-repeat">
      <v-touch
        tag="li"
        @tap="setSelected(noRepeat)">
        <span class="first-span">{{ toCycle(noRepeat) }}</span>
        <i
          v-show="selected === noRepeat"
          class="icon2-selected finish"/>
      </v-touch>
    </ul>
    <ul v-if="showShortcut">
      <v-touch
        v-for="repeat in repeatList"
        :key="repeat.cid"
        tag="li"
        @tap="setSelected(repeat)">
        <span v-if="repeat.type === 'everyDay'||repeat.type === 'weekday'">
          {{ toCycle(repeat) }}{{ toText(repeat) }}
        </span>
        <span v-else>
          {{ toCycle(repeat) }}({{ toText(repeat) }})
        </span>
        <i
          v-show="selected === repeat"
          class="icon2-selected finish"/>
      </v-touch>
    </ul>
    <v-touch
      class="user-repeat"
      @tap="showUserRepeat">
      <span class="list-key u-pull-left first-span user-define">
        {{ toCycle(userRepeat) }}
      </span>
      <i class="icon2-arrow-right arrow u-pull-right icon2-arrow-right-small arrow"/>
      <span class="list-value u-pull-right ">
        {{ repeatText }}
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
      </div>
    </div>
  </div>
</template>
<script>
  import dateUtil from 'ut/dateUtil'
  import jsUtil from 'ut/jsUtil'
  import moment from 'moment'
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
    name: 'TodoEditRepeat',
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
        uRepeatStrTimeArray: [],
        uIsLastDate: false,
        uRepeatOverDate: null
      }
    },
    computed: {
      currentTodo () {
        return this.$store.state.todo.currentTodo
      },
      //  根据currentTodo来判断是否显示重复,目前看来每次都返回为真??
      showShortcut () {
        return !this.currentTodo.id || !this.currentTodo.repeatType
      },
      todoDate () {
        return this.$store.state.pub.currentTodoDate
      },
      baseNumTime () {
        return dateUtil.dateText2Num(this.$store.state.schedule.strCurrentDate)
      },
      repeatText () {
        var text = dateUtil.repeatDayText(this.uRepeatType, this.uRepeatStrTimeArray)
        if (this.uIsLastDate) {
          text += '、最后一天'
        }
        return text ? text + '重复' : ''
      },
      comRepeat () {
        let type = null
        let baseArray = []
        let isLastDate = false
        let repeatOverDate = null
        if (this.selected) {
          type = this.selected.repeatType
          baseArray = this.selected.strTime
        } else {
          type = this.uRepeatType
          baseArray = this.uRepeatStrTimeArray
          isLastDate = this.uIsLastDate
          repeatOverDate = this.uRepeatOverDate
        }
        return {
          selected: this.selected,
          type,
          baseArray,
          isLastDate,
          repeatOverDate
        }
      }
    },
    created () {
      this.initData()
      window.rsqadmg.execute('setTitle', {title: '设置重复'})
      window.rsqadmg.exec('setOptionButtons', {hide: true})
    },
    methods: {
      accept () {
        this.$router.go(-1)
      },
      initData () {
        //  有修改缓存读修改缓存，否则从原数据读
        var t = this.todoDate
        if (t._selected || t._uRepeatType) {
          this.uRepeatType = t._uRepeatType
          this.uRepeatStrTimeArray = t._uRepeatStrTimeArray
          this.uIsLastDate = t._uIsLastDate
          this.uRepeatOverDate = t._uRepeatOverDate
          if (t._selected) {
            this.selected = this.findSelect(t._selected.cid)
          }
        } else {
          this.uRepeatType = t.repeatType
          var base = t.repeatBaseTime
          this.uRepeatStrTimeArray = (base === null || base === '' ? [] : base.split(','))
          this.uIsLastDate = !!t.isLastDate
          this.uRepeatOverDate = t.repeatOverDate
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
        var strTimeArray = this.uRepeatStrTimeArray
        if (strTimeArray.length === 0) {
          strTimeArray = [moment(this.baseNumTime).format('YYYYMMDD')]
        }
        var that = this
        selectRepeat.show({
          baseNumTime: that.baseNumTime,
          repeatType: that.uRepeatType || 'everyDay',
          repeatStrTimeArray: strTimeArray,
          isLastDate: that.uIsLastDate,
          repeatOverDate: that.uRepeatOverDate,
          success: function (result) {
            if (result.repeatType) {
              that.selected = null
            }
            that.uRepeatType = result.repeatType
            that.uRepeatStrTimeArray = result.repeatStrTimeArray
            that.uIsLastDate = result.isLastDate
            that.uRepeatOverDate = result.repeatOverDate
          }
        })
      },
      getResult () {
        var params = {
          _selected: this.selected,
          _uRepeatType: this.uRepeatType,
          _uRepeatStrTimeArray: this.uRepeatStrTimeArray,
          _uIsLastDate: this.uIsLastDate,
          _uRepeatOverDate: this.repeatOverDate
        }
        //  表示选择的是“不重复”
        if (this.comRepeat.type === 'none') {
          params['isCloseRepeat'] = true
          params['repeatType'] = null
          params['repeatBaseTime'] = null
          params['repeatOverDate'] = null
        } else {
          params['isCloseRepeat'] = false
          params['repeatType'] = this.comRepeat.type
          params['isLastDate'] = this.comRepeat.isLastDate
          params['repeatOverDate'] = this.comRepeat.repeatOverDate
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
    beforeRouteLeave (to, from, next) {
      selectRepeat.close()
      this.saveTodoRepeatState()
      next()
    }
  }
</script>
<style lang="scss" scoped>
  .edit-repeat {
    margin-top: 20px;
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
      top:0.4rem;
      color: #55A8FD;
      font-weight: bold;
    }
    ul{
      position: relative;
      background: #FFFFFF;
      // border-bottom: 0.5px solid #d4d4d4;
    }
    ul:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: -1px;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    }
    .sec{
      margin-top: 0.373rem;
    }
    span{
      display:block;
      margin-left: 15px;
      color: #3D3D3D;
      font-family: PingFangSC-Regular;
      font-size: 17px;
      // border-bottom: 0.5px solid #D4D4D4;
    }
    span:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    margin-left: 15px;
    }
    .user-define {
      color:#3D3D3D;
      border-bottom: 0;
    }
    .repeat{
      margin-left: 0.2rem;
    }
    li{
      position: relative;
      padding:2px;
      padding-left: 0;
      height: 1.112rem;
      line-height:  1.112rem;;
      font-family: PingFangSC-Regular;
      font-size: 17px;
      color: #3D3D3D;
    }
    li:last-child span{
      border:none;
    }
    .user-repeat {
      position: relative;
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      margin-top: 20px;
      padding: 0 0.45rem 0 0;
      background-color: white;
      align-items: center;
      // border-top: 0.5px solid #D4D4D4;
      // border-bottom:0.5px solid #D4D4D4;
      font-family: PingFangSC-Regular;
      font-size: 17px;
    }
    .user-repeat:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    }
    .user-repeat:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: -1px;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    }
    span.list-value {margin-right:0.2rem;
      max-width:5rem;overflow:hidden;text-overflow: ellipsis;white-space: nowrap;
    }
    .user-repeat > * {
      line-height: 1.2rem;
    }
    .top-ul{
      // border-top: 0.5px solid #d4d4d4;
      // border-bottom: 0.5px solid #d4d4d4;
      li:last-child span{
        // border-bottom: 0.5px solid #d4d4d4;
      }
    }
    .top-ul:before{
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
    .no-repeat:after{
      border-bottom: 0;
      span{
        // border-bottom: 0.5px solid #d4d4d4 !important;
      }
    }
    span.first-span:before{
      border-bottom: 0;
    }
    .u-pull-right:before{
      border-bottom: 0
    }
  }
</style>
