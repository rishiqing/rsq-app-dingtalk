<template>
  <div class="edit-repeat">
    <ul class="top-ul">
      <v-touch tag="li" @tap="setSelected(noRepeat)">
        <span>{{toCycle(noRepeat)}}</span>
        <i class="icon2-selected finish" v-show="selected == noRepeat"></i>
      </v-touch>
    </ul>
    <ul>
      <v-touch tag="li" v-for="repeat in repeatList"
               :key="repeat.cid" @tap="setSelected(repeat)">
        <span>{{toCycle(repeat)}}{{toText(repeat)}}</span>
        <i class="icon2-selected finish" v-show="selected === repeat"></i>
      </v-touch>
    </ul>
    <ul class="sec">
      <v-touch tag="li" @tap="showUserRepeat">
        <span class="repeat">{{toCycle(userRepeat)}}</span>
        <span v-if="selected === userRepeat" class="time">每周的周一，周二，周三...</span>
        <i class="icon2-arrow-right arrow"></i>
      </v-touch>
    </ul>
  </div>
</template>
<style scoped>
  .edit-repeat {
    .arrow{
      position: absolute;
      top:0.35rem;
      right:0.5rem;
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
    .top-ul {
      margin-top:1.938rem;
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
  }
</style>
<script>
  import eventBus from 'ut/eventBus'
  import dateUtil from 'ut/dateUtil'
  import selectRepeat from 'com/pub/SelectUserRepeat'

  export default {
    data () {
      return {
        selected: null,
        localNumTime: null,
        //  不重复
        noRepeat: {cid: 0, type: 'noRepeat'},
        //  系统重复列表
        repeatList: [
          {cid: 0, type: 'everyDay', showText: false},
          {cid: 1, type: 'everyWeek', showText: true},
          {cid: 2, type: 'everyMonth', showText: true},
          {cid: 3, type: 'everyYear', showText: true},
          {cid: 4, type: 'weekday', showText: false}
        ],
        //  用户自定义的重复列表
        userRepeat: {cid: 99, type: 'userRepeat'}
      }
    },
    computed: {
      //  读取全局的strCurrentDate作为默认的baseTime
      todoRepeat () {
        return this.$store.state.pub.currentTodoRepeat
      }
    },
    methods: {
      initData () {
        //  编辑日程
        if (this.todoRepeat.todo) {
          //  TODO 编辑日程时，根据todo，选中默认的选项
        } else {
          //  新建日程时
          this.selected = this.noRepeat
          this.localNumTime = this.todoRepeat.numBaseDate || new Date().getTime()
        }
      },
      checkWeekday (obj) {
        return dateUtil.repeatWeekdayText(obj)
      },
      toText (obj) {
        return obj.showText ? dateUtil.repeatDayText(obj.type, [this.localNumTime]) : ''
      },
      toCycle (obj) {
        return dateUtil.repeatCycleName(obj.type)
      },
      setSelected (obj) {
        this.selected = obj
      },
      showUserRepeat () {
        selectRepeat.show({
          default: {},
          success: function (result) {
            alert('success from user repeat')
          }
        })
      },
      //  将传入的todo对象解析成重复需要的格式
      parseTodo () {},
      //  将重复的格式解析成传入todo需要的对象
      parseRepeat () {},
      getResult () {
        //  TODO 按照需要做parse
        this.parseRepeat()
      }
    },
    mounted () {
      this.initData()
      window.rsqadmg.execute('setTitle', {title: '设置重复'})
      window.rsqadmg.exec('setOptionButtons', {hide: true})
    },
    beforeRouteLeave (to, from, next) {
      if (to.name === 'login') {
        eventBus.$emit('todo-edit-repeat-ready', this.getResult())
      }
      next()
    }
  }
</script>
