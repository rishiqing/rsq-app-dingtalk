<template>
  <div class="subtodo" :class="{hasBorder: hasSubtodo}">
    <v-touch class="subtodo-wrap" @tap="showSubTodo">
      <img src="../../assets/img/subtodo.png" alt="" class="subtodo-icon">
      <span class="date addSub">添加子任务</span>
      <!--<span class="now" :class="{'edit-padding-left':editTime}">{{subtodoString}}</span>-->
      <!--<i class="icon2-arrow-right-small arrow"></i>-->
    </v-touch>
  </div>
</template>
<style lang="" scoped>
  .hasBorder{
    border-bottom:1px solid #E3E3E3;
  }
  .addSub{
    margin-left: 0.3rem;
  }
  .subtodo-icon{
    width: 16px;
    height: 16px;
  }
  .subtodo{
    background-color: white;
    position: relative;
    /*height:1.3rem;*/
    line-height: 1.3rem;
      /*padding-left:3% ;*/
    border-bottom:1px solid #E0E0E0;
  }
  .subtodo-wrap{
    display: flex;
    align-items: center;
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
    left:1.7rem
  }
  span{
    display: block;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
  }
</style>
<script>
  import def from 'ut/defaultUtil'
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
        if (subtodo === undefined) {
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
//      hasSubtodo () {
//        return this.$store.state.todo.currentTodo.subTodos.length > 0
//      }
    },
    methods: {
      showSubTodo () {
        if (this.disabled) {
          window.rsqadmg.execute('toast', {message: '过去的任务不能编辑'})
          return
        }
        this.$store.dispatch('setCurrentTodo', def.allDefaultTodo())
        this.$store.commit('SAVE_ID', {'id': this.item.id})
        this.$router.push('/todo/' + this.item.id + '/subTodo')
      }
    }
  }
</script>
