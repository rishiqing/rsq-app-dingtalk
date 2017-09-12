<template>
	<div class="">
      <input class="write" type="text" placeholder="在这里写下想法" v-model="inputTitle">
      <v-touch @tap="saveTodo" v-show="inputTitle !== ''" class="btn-create">
        <input value="创建" class="create"/>

      </v-touch>
    <div class="margin-block"></div>
    <r-todo-item-list
      :items="items"
      :is-checkable="false"
      v-if="items != null && items.length > 0"
    ></r-todo-item-list>
	</div>
</template>
<script>
  import TodoItemList from 'com/sche/TodoItemList'

  export default {
    data () {
      return {
        titleName: '收纳箱',
        inputTitle: ''
      }
    },
    computed: {
      items () {
        return this.$store.state.inbox.items
      }
    },
    components: {
      'r-todo-item-list': TodoItemList
    },
    methods: {
      fetchItems () {
        this.$store.dispatch('fetchInboxItems')
      },
      saveTodo () {
        window.rsqadmg.execute('showLoader', {text: '创建中...'})
        this.$store.dispatch('submitCreateTodoItem', {newItem: {pTitle: this.inputTitle}, todoType: 'inbox'})
          .then(() => {
            this.inputTitle = ''
            window.rsqadmg.exec('hideLoader')
            window.rsqadmg.execute('toast', {message: '创建成功'})
          })
      }
    },
    mounted () {
      this.fetchItems()
      window.rsqadmg.exec('setTitle', {title: this.titleName})
      window.rsqadmg.exec('setOptionButtons', {hide: true})
      this.$store.dispatch('setNav', {isShow: true})
    }
  }
</script>
<style scoped>
  input::-webkit-input-placeholder { /* WebKit browsers */
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #999999;
    line-height: 22px;
  }
  .create{
    display: block;
    text-align: center;
    border: 1px solid #55A8FD;
    border-radius: 2px;
    height: 0.666rem;
    line-height: 0.76rem;
    width:1.413rem;
    font-size: 15px;
    color:#55A8FD;
    position: absolute;
    top:0.8rem;
    right:0.35rem;

  }
  .write{
    height:1.226rem;
    background: #FFFFFF;
    border-bottom:1px solid #E3E3E3;
    border-top:1px solid #E3E3E3;
    margin-top: 0.574rem;
    padding-left:0.3rem;
  }
  .margin-block {
    height: 50px;
  }
  .input-panel {
    position: fixed;
    top:0;height: 50px;width:100%;z-index:99999;
  }
  .input-title {
    box-sizing: border-box;
    width: 80%;height:100%;
    padding: 10px;
  }
  .btn-create {
    position: fixed;
    width: 20%;
    right:0;top:0;height:50px;
  }
  /*.btn-create input {*/
    /*width: 80%;*/
    /*text-align: center;*/
    /*height: 100%;*/
    /*box-sizing: border-box;*/
    /*border: none;*/
    /*color: #00f;*/
  /*}*/
</style>
