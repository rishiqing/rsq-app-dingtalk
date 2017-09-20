<template>
  <v-touch class="outertime" @tap="gotoTodoTime">
    <div class="">
      <span class="date">时间</span>
      <span class="now">{{timeValue}}</span>
      <i class="icon2-arrow-right-small arrow"></i>
    </div>
  </v-touch>
</template>
<style lang="" scoped>
  .outertime{
    position: relative;
    height:1.3rem;
    line-height: 1.3rem;
    padding-left:3% ;
    border-bottom:1px solid #E3E3E3;
    width: 100%;
  }
  .arrow{
    color: #999999;
    font-size: 21px;
    position: absolute;
    top:0.35rem;
    right: 0.1rem;
  }
  .now {
    position: absolute;
    top:0.04rem;
    right: 0.88rem;
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
  import converter from 'ut/converter'

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
        var stateTodoTime = converter.todoTimeBack2Front({ clock: this.itemClock })
        alert('====this.itemClock====' + JSON.stringify(this.itemClock))
        alert('====stateTodoTime====' + JSON.stringify(stateTodoTime))
        this.$store.commit('PUB_TODO_TIME_SET', {data: stateTodoTime})
        this.$router.push('/todoEdit/time')
      }
    },
    created () {}
  }
</script>
