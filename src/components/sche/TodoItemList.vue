<template>
	<ul class="itm-lst itm-lst--border itm-lst--margin">
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
<style lang="scss">
</style>
<script>
  import TodoItem from 'com/sche/TodoItem'

  export default {
    name: 'TodoItemList',

    props: {
      items: Array,
      isCheckable: Boolean    //  是否显示完成复选框
    },
    data () {
      return {}
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
