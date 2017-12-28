<template>
  <ul :class="{'itemList':itemcount}" class="sche-list">
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
<style lang="scss" scoped>
  .sche-list{
    background-color: white;
    /*border-bottom:1px solid #E0E0E0 ;*/
    border-top:1px solid #DADADA ;
    padding-left: 3%;
    max-height: 13rem;
    overflow: auto;
    /*margin-top: 45px;*/
  }
  .itemList{
    padding-bottom:1.306rem;
  }
  /*li:last-child{*/
    /*border-bottom: none;*/
  /*}*/
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
    computed: {
      itemcount () {
        return this.items.length >= 8 && this.isCheckable
      }
    },
    components: {
      'r-todo-item': TodoItem
    },
    methods: {
      showEdit (item) {
        this.$store.dispatch('setCurrentTodo', item)// 设置当前todo不管是inbox的todo还是ssche的todo
        this.$router.push('/todo/' + item.id)
      },
      checkTodo (item, status) {
        this.$store.dispatch('submitTodoFinish', {item: item, status: status})
            .then(function () {
              this.$store.dispatch('saveTodoAction', {editItem: {status: status}})
                .then(() => {
                })
            })
      }
    }
  }
</script>
