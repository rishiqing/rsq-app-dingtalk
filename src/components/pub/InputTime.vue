<template>
  <v-touch class="outertime" @tap="gotoTodoTime" :class="{'hasPadding':newItem}">
    <i class="icon2-alarm alarm"></i>
    <span class="time">时间</span>
    <span class="now" :class="{'edit-padding-left':editTime,'new-padding-right':newItem}">{{timeValue}}</span>
    <i class="icon2-arrow-right-small arrow"></i>
  </v-touch>
</template>
<style lang="" scoped>
  .time{
    margin-left: 2.5%;
  }
  .alarm{
    color: #55A8FD;
    font-size: 18px;
  }
  .outertime{
    position: relative;
    /*height:1.3rem;*/
    line-height: 1.3rem;
    background-color: white;
    display: flex;
    align-items: center;
  }
  .hasPadding{
    padding-left:3% ;
  }
  .arrow{
    color: #999999;
    font-size: 21px;
    position: absolute;
    top:0.38rem;
    right: 0.2rem;
  }
  .now {
    position: absolute;
    /*top:0.04rem;*/
    top:50%;
    margin-top: -0.65rem;
    /*right: 0.94rem;*/
    /*left:0.4rem;*/
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #999999;
    letter-spacing: 0;
  }
  .new-padding-right{
    right: 0.94rem;
  }
  .edit-padding-left{
    left:1.3rem
  }
  span{
    display: block;
    /*margin-bottom: 5px;*/
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
    /*line-height: 1.458rem;*/
  }
</style>
<script>
  export default {
    data () {
      return {}
    },
    computed: {
      itemClock () {
        return this.item.clock || {}
      },
      isAllDay () {
        return !this.itemClock.startTime
      },
      timeValue () {
        return this.isAllDay ? '全天' : this.itemClock.startTime + '-' + this.itemClock.endTime
      }
    },
    props: {
      item: Object,
      editTime: Boolean,
      disabled: Boolean,
      newItem: Boolean
    },
    methods: {
      gotoTodoTime () {
//        console.log('进来了')
        if (this.disabled) {
          window.rsqadmg.execute('toast', {message: '过去的任务不能编辑'})
          return
        }
        this.$emit('time-tap') // 谁来接收它呢
        //  将需要用到的属性设置到currentTodoTime中
        var timeObj = {
          clock: JSON.parse(JSON.stringify(this.itemClock))
        }
//        console.log(JSON.stringify(timeObj))
        this.$store.commit('PUB_TODO_TIME_UPDATE', {data: timeObj})
        this.$router.push('/todoEdit/time')
      }
    },
    created () {}
  }
</script>
