<template>
  <div class="subtodo">
    <v-touch class="" @tap="showSubTodo">
      <span class="date">子任务</span>
      <span class="now">{{subtodoString}}</span>
      <i class="icon2-arrow-right-small arrow"></i>
    </v-touch>
  </div>
</template>
<style lang="" scoped>
  .subtodo{
    background-color: white;
    position: relative;
    height:1.3rem;
    line-height: 1.3rem;
    padding-left:3% ;
    border-bottom:1px solid #E3E3E3;
  }
  .arrow{
    color: #999999;
    font-size: 21px;
    position: absolute;
    top:0.38rem;
    right: 0.3rem;
  }
  .now {
    position: absolute;
    top:0.01rem;
    right: 0.88rem;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #999999;
    letter-spacing: 0;
  }
  span{
    display: block;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
  }
</style>
<script>
  export default {
    data () {
      return {}
    },
    props: {
      item: Object
    },
    computed: {
      subtodoString () {
        var finishcount = 0
        var unfinishcount = 0
        var result = null
        var subtodo = this.item.subTodos
        if (subtodo.length === 0) {
          return ''
        } else {
          for (var i = 0; i < subtodo.length; i++) {
            if (subtodo[i].isDone) {
              finishcount++
            } else {
              unfinishcount++
            }
          }
          result = finishcount + '条已完成, ' + unfinishcount + '条未完成'
          return result
        }
      }
    },
    methods: {
      showSubTodo () {
        this.$router.push('/todo/' + this.item.id + '/subTodo')
      }
    }
  }
</script>
