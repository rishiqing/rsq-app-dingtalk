<template>
  <div class="inbox-main">
    <div class="inbox-item">
      <div class="topest"/>
      <div class="wrap">
        <input
          v-model="inputTitle"
          class="write"
          type="text"
          placeholder="输入内容快速添加任务">
        <v-touch
          v-show="inputTitle !== ''"
          class="btn-create"
          @tap="saveTodo">
          <span class="create">创建</span>
        </v-touch>
      </div>
      <div class="margin-block"/>
      <div class="fff">
        <r-todo-item-list
          v-if="items !== null && items.length > 0"
          :items="items"
          :is-checkable="false"/>
      </div>
    </div>
    <r-nav/>
    <!-- <div class="tips">收纳箱中的任务没有具体的日期，它可能是灵光乍现的想法，可能是同事拜托你的一件小事…</div> -->
  </div>

</template>
<script>
  import TodoItemList from 'com/sche/TodoItemList'
  import nav from 'com/Nav'

  export default {
    name: 'InboxMain',
    components: {
      'r-todo-item-list': TodoItemList,
      'r-nav': nav
    },
    data () {
      return {
        titleName: '记事',
        inputTitle: ''
      }
    },
    computed: {
      items () {
        return this.$store.state.inbox.items
      }
    },
    mounted () {
      this.fetchItems()
      window.rsqadmg.exec('setTitle', {title: this.titleName})
      window.rsqadmg.exec('setOptionButtons', {hide: true})
      this.$store.dispatch('setNav', {isShow: false})
    },
    methods: {
      fetchItems () {
        this.$store.dispatch('fetchInboxItems')
      },
      toCreate () {
        this.$router.push('/inbox/new')
      },
      saveTodo () {
        if (!this.inputTitle || /^\s+$/.test(this.inputTitle)) {
          window.rsqadmg.execute('alert', {message: '任务标题不能为空'})
          return
        }
        window.rsqadmg.execute('showLoader', {text: '创建中...'})
        this.$store.dispatch('submitCreateTodoItem', {newItem: {pTitle: this.inputTitle}, todoType: 'inbox'})
          .then(() => {
            this.inputTitle = ''
            window.rsqadmg.exec('hideLoader')
            window.rsqadmg.execute('toast', {message: '创建成功'})
          })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .inbox-main{
    // min-height: 100%;
  }
  .tips{
    position: fixed;
    bottom: 3.8%;
    z-index: 0;
    color: #9B9B9B;
    font-size: 14px;
    line-height: 18px;
    width: 93.2%;
    text-align: center;
    margin: 0 auto;
    left: 0;
    right: 0;
    height: 4.9%;
  }
  .inbox-item{
    // background-color: white;
    // margin-top: 20px;
    margin-bottom: 50px;
    // border-bottom:0.5px solid #D4D4D4 ;
    // position: relative;
    // z-index: 2;
  }
  .wrap{
    position: fixed;
    height: 56px;
    width: 100%;
    top: 20px;
    left: 0;
    right: 0;
    z-index: 2;
  }
  .wrap:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .wrap:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: -1px;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .topest{
    background-color: #F5F5F5;
    height: 20px;
    z-index: 2;
    position: fixed;
    width: 100%;
  }
  .create{
    // box-sizing: border-box;
    // display: block;
    text-align: center;
    width:45px;
    height: 26px;
    border-radius: 2px;
    font-size: 13px;
    color:#fff;
    position: absolute;
    margin-top: -0.33rem;
    top: 50%;
    right:0.35rem;
    z-index: 3;
    padding-top: 2px;
    background-color: #2F7DCD;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .write{
    line-height: 0.612rem;
    height: 56px;
    // border-bottom:0.5px solid #D4D4D4;
    // border-top:0.5px solid #D4D4D4;
    background: #FFFFFF;
    padding-left:15px;
    padding-right: 2.432rem;
    // margin-bottom: 0.224rem;
    z-index: 2;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    border-radius: 0;
  }
  .write::-webkit-input-placeholder { /* WebKit browsers */
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #999999;
    height: 100%;
    line-height: 17px
  }
  .margin-block {
  height: 96px;
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
  .fff{
    background-color: #fff;
    position: relative;
  }
  .fff:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .fff:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: -1px;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .fff:empty:after,.fff:empty:before {
    border-top: 0;
  }
</style>
