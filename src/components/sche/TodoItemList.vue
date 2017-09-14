<template>
  <!--<ul class="itm-lst itm-lst&#45;&#45;border itm-lst&#45;&#45;margin">-->
  <ul>
    <r-todo-item
        v-for="item in items"
        :item="item"
        :is-checkable="isCheckable"
        @todo-item-click="showEdit"
        @todo-item-check="checkTodo"
        :key="item.id"
    ></r-todo-item>
  </ul>
</template>
<style lang="scss" scoped="">
  @import "icomoon2.css";
  ul{
    background-color: white;
    border-bottom:1px solid #DADADA ;
    border-top:1px solid #DADADA ;
    padding-left: 3%;
  }
  li:last-child{
    border-bottom: none;
  }
</style>
<script>
  import TodoItem from 'com/sche/TodoItem'

  export default {
    data () {
      return {}
    },
    name: 'TodoItemList',
    props: {
      items: Array,
      isCheckable: Boolean    //  是否显示完成复选框
    },
    components: {
      'r-todo-item': TodoItem
    },
    methods: {
      showEdit (item) {
        this.$store.dispatch('setCurrentTodo', item)
        this.$router.push('/todo/' + item.id)
      },
      checkTodo (item, status) {
        this.$store.dispatch('submitTodoFinish', {item: item, status: status})
            .then(function () {
//              rsqadmg.execute('toast', {message: str})
            })
      }
    }
  }
</script>
