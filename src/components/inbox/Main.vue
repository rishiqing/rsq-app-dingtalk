<template>
  <div class="">
    <div class="topest"></div>
    <div class="wrap">
      <input class="write" type="text" placeholder="在这里写下想法" v-model="inputTitle">
      <v-touch @tap="saveTodo" v-show="inputTitle !== ''" class="btn-create">
        <input value="创建" class="create"/>
      </v-touch>
    </div>
    <div class="margin-block"></div>
    <div class="InboxItem">
      <r-todo-item-list
        :items="items"
        :is-checkable="false"
        v-if="items != null && items.length > 0"
      ></r-todo-item-list>
    </div>
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
      this.$store.dispatch('setNav', {isShow: false})
    }
  }
</script>
<style scoped>
  .wrap{
    position: fixed;
    height: 1.45rem;
    width: 100%;
    top: 10px;
    left: 0;
    right: 0;
    z-index: 2;
  }
  /*input::-webkit-input-placeholder { !* WebKit browsers *!*/
    /*font-family: PingFangSC-Regular;*/
    /*font-size: 0.453rem;*/
    /*color: #999999;*/
    /*line-height:normal;*/
    /*height: 1.612rem;*/
  /*}*/
  .topest{
    background-color: #F8F8F8;
    height: 10px;
    z-index: 2;
    position: fixed;
    width: 100%;
  }
  .create{
    -webkit-appearance: none;
    display: block;
    text-align: center;
    border: 1px solid #55A8FD;
    border-radius: 2px;
    /*height: 0.666rem;*/
    line-height: 0.66rem;
    display: flex;
    align-items: center;
    width:1.413rem;
    font-size: 15px;
    color:#55A8FD;
    position: absolute;
    margin-top:-0.4rem;
    top: 50%;
    right:0.35rem;
    /*margin-top: -1.34rem;*/
    /*margin-right:0.4rem;*/
    /*float: right;*/
    z-index: 3;
  }
  .write{
    line-height: 0.612rem;
    padding-bottom: 0.4rem;
    padding-top: 0.4rem;
    border-bottom:1px solid #E3E3E3;
    border-top:1px solid #E3E3E3;
    /*position: fixed;*/
    /*top:10px;*/
    background: #FFFFFF;
    padding-left:0.3rem;
    padding-right: 2.432rem;
    margin-bottom: 0.224rem;
    z-index: 2;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    border-radius: 0;
  }
  .write::-webkit-input-placeholder { /* WebKit browsers */
    font-family: PingFangSC-Regular;
    font-size: 0.453rem;
    color: #999999;
    /*line-height:normal;*/
    height: 1.4rem;
  }
  .margin-block {
    height: 1.9rem;
    z-index: 1;
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
</style>
