<template>
  <div class="outertime">
    <v-touch class="" @tap="showSubTodo">
      <span class="date">子任务</span>
      <span class="now">{{subtodoString}}</span>
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
        if (!subtodo) {
          return ''
        } else {
          for (var i = 0; i < subtodo.length; i++) {
            if (subtodo[i].isDone) {
              finishcount++
            } else {
              unfinishcount++
            }
          }
          result = finishcount + '条已完成' + unfinishcount + '条未完成'
          return result
        }
      }
    },
    methods: {
      showSubTodo () {
        // console.log('进来了没有啊' + this.item.id)
        this.$router.push('/todo/' + this.item.id + '/subTodo')
      }
    }
  }
</script>
