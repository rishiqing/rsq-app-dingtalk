<template>
  <div class="subtodo">
    <v-touch class="" @tap="showSubTodo">
      <span class="date">子任务</span>
      <span class="now" :class="{'edit-padding-left':editTime}">{{subtodoString}}</span>
      <i class="icon2-arrow-right-small arrow"></i>
    </v-touch>
  </div>
</template>
<style lang="" scoped>
  .subtodo{
    background-color: white;
    position: relative;
    /*height:1.3rem;*/
    line-height: 1.3rem;
    padding-left:3% ;
    border-bottom:1px solid #E3E3E3;
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
    top:0.01rem;
    right: 0.88rem;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #999999;
    letter-spacing: 0;
  }
  .edit-padding-left{
    left:1.9rem
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
      item: Object,
      editTime: Boolean,
      disabled: Boolean
    },
    computed: {
      subtodoString () {
        var finishcount = 0
        var unfinishcount = 0
        var result = null
        var subtodo = this.item.subTodos
        // console.log('---' + subtodo + '----') // 这一行输出两次
        if (subtodo === undefined) {
          // console.log('果然相等')
          return ''
        } else {
          for (var i = 0; i < subtodo.length; i++) {
            if (subtodo[i].isDone) {
              finishcount++
            } else {
              unfinishcount++
            }
          }
          if (finishcount === 0 && unfinishcount === 0) {
            return ''
          } else {
            result = finishcount + '条已完成, ' + unfinishcount + '条未完成'
            return result
          }
        }
      }
    },
    methods: {
      showSubTodo () {
        if (this.disabled) return
        this.$router.push('/todo/' + this.item.id + '/subTodo')
      }
    }
  }
</script>
