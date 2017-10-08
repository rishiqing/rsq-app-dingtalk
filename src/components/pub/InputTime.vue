<template>
  <v-touch class="outertime" @tap="gotoTodoTime">
    <span class="date">时间</span>
    <span class="now">{{timeValue}}</span>
    <i class="icon2-arrow-right-small arrow"></i>
  </v-touch>
</template>
<style lang="" scoped>
  .outertime{
    position: relative;
    /*height:1.3rem;*/
    line-height: 1.3rem;
    padding-left:3% ;
    border-bottom:1px solid #E3E3E3;
    background-color: white;
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
    margin-top: -0.63rem;
    right: 0.94rem;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #999999;
    letter-spacing: 0;
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
      isAllDay () {
        return !this.itemClock || !this.itemClock.startTime
      },
      timeValue () {
        return this.isAllDay ? '全天' : this.itemClock.startTime + '-' + this.itemClock.endTime
      }
    },
    props: {
      itemClock: Object
    },
    methods: {
      gotoTodoTime () {
        this.$emit('time-tap')
        //  将需要用到的属性设置到currentTodoTime中
        var obj = JSON.parse(JSON.stringify(this.itemClock))
        this.$store.commit('PUB_TODO_TIME_UPDATE', {data: obj})
        this.$router.push('/todoEdit/time')
      }
    },
    created () {}
  }
</script>
