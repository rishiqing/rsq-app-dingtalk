<template>
  <div>
  {{items}}
  </div>



</template>
<style scoped>
  .select{
    font-size: 17px;
    position: absolute;
    top:0.38rem;
  }
  .top{
    background-color: white;
    position: relative;
    line-height: 1.226rem;;
    margin-top:0.266rem;
    padding-left:5%
  }
  .add{
    position: absolute;
    top:0.4rem;
    font-size: 15px;
    background-color: #55A8FD;
    color:white;
    border: 1px solid #55A8FD;
    border-radius: 50%;
  }
  .top{
    border-bottom:1px solid #DADADA ;
    border-top:1px solid #DADADA ;
  }
  .top>span{
    display: block;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #55A8FD;

  }
  .finish{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #999999;
    line-height: 22px;
  }
  .top ul{
    background-color: white;
  }
  span{
    display: block;
    margin-left: 0.8rem;
    font-family:PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
  }
  .date{
    position:absolute ;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #FF7A7A;
    letter-spacing: 0;
    right:2.7%;
    top:0.351rem;
  }
  ul{
    position: relative;
    margin-top:0.266rem;
    border-bottom:1px solid #DADADA ;
    border-top:1px solid #DADADA ;
    padding-left: 5%;
  }
  li{
    padding-left:5%;
    height: 1.226rem;
    line-height: 1.226rem;
    padding:0;
    position: relative;
    border-bottom:1px solid #DADADA ;
  }
  li:last-child{
    border: none;
  }

</style>

<script>
  import TodoItemList from 'com/sche/TodoItemList'
  export default {
    data () {
      return {}
    },
    computed: {
      items () {
        return this.$store.state.todo.currentTodo.subTodos.name
      }
    },
    methods: {},
    components: {
      'r-todo-item-list': TodoItemList
    },
    mounted () {
      window.rsqadmg.execute('setTitle', {title: '子任务'})
      window.rsqadmg.exec('setOptionButtons', {hide: true})
    }
  }
</script>
