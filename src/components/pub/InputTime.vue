<template>
  <div class="outertime">
    <v-touch class="" @tap="showTimePicker">
      <span class="date">时间</span>
      <!--<span class="now">{{ dateString }}</span>-->
      <span class="now">{{timeValue}}</span>
      <i class="icon2-arrow-right-small arrow"></i>
    </v-touch>
  </div>
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
      timeValue () {
        return this.todoTime.isAllDay ? '全天' : this.todoTime.startTime + '-' + this.todoTime.endTime
      },
      todoTime () {
        return converter.todo2TodoTime(this.item)
      }
    },
    props: {
      item: Object
    },
    methods: {
      showTimePicker () {
        this.$store.commit('PUB_SET_TODO_TIME', this.todoTime)
        this.$router.push('/todoEdit/time')
      }
    },
    mounted () {}
  }
</script>
