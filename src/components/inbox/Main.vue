<template>
  <div class="">
    <div class="inbox-top">
      <v-touch @tap="setIndex(1)">
        <div :class="{'inbox-active': currentIndex === 1}" class="top-select">全部任务</div>
      </v-touch>
      <v-touch @tap="setIndex(2)">
        <div :class="{'inbox-active': currentIndex === 2}"  class="top-select">我创建的</div>
      </v-touch>
      <v-touch @tap="setIndex(3)">
        <div :class="{'inbox-active': currentIndex === 3}"  class="top-select">我收到的</div>
      </v-touch>
    </div>
    <!--<div class="topest"></div>-->
    <div class="wrap" v-show="this.showInput">
      <input class="write" type="text" placeholder="输入任务标题" v-model="inputTitle">
      <v-touch @tap="saveTodo" class="btn-create">
        创建
      </v-touch>
    </div>
    <!--<div class="margin-block"></div>-->
    <div class="InboxItem">
      <div v-if="currentIndex === 1">
        <r-todo-item-list
          :items="items"
          :is-checkable="false"
          v-if="items != null && items.length > 0"
        ></r-todo-item-list>
      </div>
      <div v-if="currentIndex === 2">
        <r-todo-item-list
          :items="createItems"
          :is-checkable="false"
          v-if="createItems != null && createItems.length > 0"
        ></r-todo-item-list>
      </div>
      <div v-if="currentIndex === 3">
        <r-todo-item-list
          :items="receiveItems"
          :is-checkable="false"
          v-if="receiveItems != null && receiveItems.length > 0"
        ></r-todo-item-list>
      </div>
    </div>
  </div>
</template>
<script>
  import TodoItemList from 'com/sche/TodoItemList'

  export default {
    data () {
      return {
        titleName: '收纳箱',
        inputTitle: '',
        currentIndex: 1,
        showInput: false
      }
    },
    computed: {
      items () {
        return this.$store.state.inbox.items
      },
      receiveItems () {
        return this.$store.state.inbox.items.filter((item) => {
          return item.from !== null
        })
      },
      createItems () {
        return this.$store.state.inbox.items.filter((item) => {
          return item.from === null
        })
      }
    },
    components: {
      'r-todo-item-list': TodoItemList
    },
    methods: {
      setIndex (index) {
        this.currentIndex = index
      },
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
//      window.rsqadmg.exec('setOptionButtons', {hide: true})
      this.$store.dispatch('setNav', {isShow: false})
      var btnParams
      var that = this
      btnParams = {
        btns: [{key: 'submitTodo', name: '创建'}],
        success: function (res) {
          if (res.key === 'submitTodo') {
//            that.showInput = true
            that.$router.push('/newInbox')
          }
        }
      }
      window.rsqadmg.execute('setOptionButtons', btnParams)
    }
  }
</script>
<style scoped>
  .InboxItem{
    margin-top: 0.5rem;
  }
  .inbox-top{
    display: flex;
    align-items: center;
    padding: 10px 0;
    background-color: white;
  }
  .top-select{
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #3D3D3D;
    letter-spacing: 0.87px;
    width: 3.35rem;
    height: 1.066rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #979797;
  }
  div.inbox-active:after{
    content: " ";
    position: absolute;
    /*height: 3px;*/
    right: 0;
    bottom: -10px;
    left:0;
    background-color: #55A8FD;
    border-bottom: 3px solid #55A8FD;
    width: 40%;
    margin: 0 auto;
  }
  div.inbox-active{
    color: #3296FA;
    position: relative;
  }
  .wrap{
    padding: 0.3rem;
    padding-bottom: 0;
    display: flex;
    align-items: center;
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
    background: blue;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #FFFFFF;
    /*margin-top: -1.34rem;*/
    /*margin-right:0.4rem;*/
    /*float: right;*/
    z-index: 3;
  }
  .btn-create{
    width: 19%;
    height: 1.466rem;
    ont-family: PingFangSC-Regular;
    font-size: 16px;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    background: blue;
  }
  .write{
    line-height: 0.612rem;
    padding-bottom: 0.4rem;
    padding-top: 0.4rem;
    /*border-bottom:1px solid #E3E3E3;*/
    /*border-top:1px solid #E3E3E3;*/
    /*position: fixed;*/
    /*top:10px;*/
    background: #FFFFFF;
    padding-left:0.3rem;
    /*padding-right: 2.432rem;*/
    /*margin-bottom: 0.224rem;*/
    z-index: 2;
    width: 80%;
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
