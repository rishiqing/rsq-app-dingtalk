<template>
  <div class="">

    <div class="topSubtodo" v-if="seen" >
      <v-touch @tap="change">
        <v-touch ><i class="icon2-add-circle add"></i></v-touch>
        <span>新建子任务</span>
      </v-touch>
    </div>

    <div v-else class="anotherTop">
      <input class="write" type="text" placeholder="输入子任务标题" v-model="inputTitle">
      <v-touch @tap="saveTodo" v-show="inputTitle !== ''" class="btn-create">
        <input value="创建" class="create"/>
      </v-touch>
    </div>
    <div class="margin-block"></div>
    <ul class="sublist" :class="{hasborder:!haschild}">
      <li v-for="item in items" v-if="items" class="sublistItem">
        <v-touch class="">
           <input   class="list-below" @blur="inputBlur($event.target.value, item)"  @input="inputChange($event.target.value)"
                    ref="titleInput" :value=item.name   :class="{ 'text-grey': item.isDone, 'text-mid-line': item.isDone,'margin-left':isCheckable}">
          <v-touch class="" v-if="" @tap="clickCheckOut(item)">
            <i class="icon2-check-box select-sub"></i>
            <div class="hide" :class="{'for-hide-sub':item.isDone}"></div>
            <i class="icon2-selected hide" :class="{'isdisplay-sub':item.isDone}"></i>
          </v-touch>
        </v-touch>
      </li>
    </ul>
  </div>
</template>
<script>
  import TodoItemList from 'com/sche/TodoItemList'
  export default {
    data () {
      return {
        titleName: '子任务',
        inputTitle: '',
        seen: true,
        judge: false
      }
    },
    computed: {
      items () {
        return this.$store.state.todo.currentTodo.subTodos// 其实有没有必要写这个呢，因为currenttodo是动态变化的，只要重新和后台打交道setcurrent以后自然可以变化
      },
      todoid () {
        return this.$store.state.todo.currentTodo.id
      },
      haschild () {
        return this.$store.state.todo.currentTodo.subTodos.length === 0
      }
    },
    components: {
      'r-todo-item-list': TodoItemList
    },
    methods: {
      change () {
        this.seen = false
      },
      // 留待以后使用
//      judgeable () {
//        if (this.items) {
//          this.judge = true
//        }
//      },
      inputBlur (value, item) {
        this.$refs.titleInput.value = value
        if (!value) {
          var that = this
          window.rsqadmg.exec('confirm', {
            message: '确定要删除此任务？',
            success () {
              window.rsqadmg.execute('showLoader', {text: '删除中...'})
              that.$store.dispatch('deleteSubTodo', {item: item})
                .then(() => {
                  this.$store.dispatch('saveTodoAction', {editItem: {idOrContent: value, type: 10}})
                    .then(() => {
                    })
                  window.rsqadmg.exec('hideLoader')
                  window.rsqadmg.execute('toast', {message: '删除成功'})
                  this.$router.replace(window.history.back())
                })
            }
          })
        } else {
          if (value !== item.name) {
            window.rsqadmg.exec('showLoader', {text: '保存中...'})
            this.$store.dispatch('updateSubTodo', {item: item, name: value})
              .then(() => {
                this.$store.dispatch('saveTodoAction', {editItem: {idOrContent: value, type: 10}})
                  .then(() => {
                  })
                window.rsqadmg.exec('hideLoader')
                window.rsqadmg.execute('toast', {message: '保存成功'})
              })
          }
        }
      },
      inputChange (value) {
        this.$refs.titleInput.value = value
      },
      saveTodo () {
        window.rsqadmg.execute('showLoader', {text: '创建中...'})
        this.$store.dispatch('createSubTodo', {newItem: {pTitle: this.inputTitle}, todoId: this.todoid})
          .then(() => {
            this.$store.dispatch('saveTodoAction', {editItem: {idOrContent: this.inputTitle, type: 7}})
              .then(() => {
              })
            this.inputTitle = ''
            window.rsqadmg.exec('hideLoader')
            window.rsqadmg.execute('toast', {message: '创建成功'})
          })
      },
      clickCheckOut (item) {
        this.$store.dispatch('submitSubTodoFinish', {item: item, status: !item.isDone})
            .then(function () {
              this.$store.dispatch('saveTodoAction', {editItem: {status: !item.isDone, type: 17}})
                .then(() => {
                })
            })
      }
    },
    mounted () {
      window.rsqadmg.exec('setTitle', {title: this.titleName})
      window.rsqadmg.exec('setOptionButtons', {hide: true})
      this.$store.dispatch('setNav', {isShow: false})
    }
  }
</script>
<style scoped>
  input::-webkit-input-placeholder { /* WebKit browsers */
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #999999;
  }
  .select-sub{
    position: absolute;
    top: 0.41rem;
    color:#b9b9bc;
    left:0.02rem
  }
  .sublist{
    background-color: white;
    padding-left: 0.6rem;
  }
  .hasborder{
    border-top:1px solid #E0E0E0;
    border-bottom:1px solid #E0E0E0;
  }
  .list-below{
    border:none;
    margin-left: 0.9rem;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    width: 85%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space:nowrap
  }
  .sublistItem:last-child{
    border-bottom: none;
  }
  .sublistItem{}
  .topSubtodo{
    position:fixed;
    background-color: white;
    line-height: 1.226rem;;
    top:0.266rem;
    padding-left:5%;
    width:100%;
    z-index: 1;
  }
  .add{
    position: absolute;
    top:0.4rem;
    font-size: 15px;
    background-color: #55A8FD;
    color:white;
    border: 1px solid #55A8FD;
    border-radius: 50%;
    left:0.55rem;
  }
  .title-todo input{
    border: none;
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
  span{
    display: block;
    margin-left: 0.8rem;
    font-family:PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
  }
  .hide{
    display: none;
  }
  .todo-content{
    margin-left: 0.6rem;
  }
  ul{
    position: relative;
    margin-top:0.666rem;
    padding-left: 5%;
  }
  li{
    line-height: 1.226rem;
    position: relative;
    border-bottom:1px solid #DADADA ;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #222222;
  }
  li:first-child{
  }
  .isdisplay-sub{
    display: block;
    position:absolute;
    top:0.25rem;
    left: 0.13rem;
    font-size: 15px;
    color:#55A8FD;
  }
  .for-hide-sub{
    position: absolute;
    top:0.36rem;
    left: 0.39rem;
    display: block;
    width: 2px;
    height: 2px;
    background-color: white;
    border: 1px solid white;
  }
  .create{
    /*display: block;*/
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #55A8FD;
    border-radius: 2px;
    height: 0.666rem;
    /*line-height: 0.76rem;*/
    width:1.413rem;
    font-size: 15px;
    color:#55A8FD;
    position: fixed;
    top:0.55rem;
    right:0.35rem;
    z-index:2;
  }
  .write{
    background: #FFFFFF;
    border-bottom:1px solid #E3E3E3;
    border-top:1px solid #E3E3E3;
    top: 0.266rem;
    padding-left:0.6rem;
    position: fixed;
    z-index: 1;
    line-height: 0.6rem;
    padding-right: 2.432rem;
    padding-top: 0.405rem;
    padding-bottom: 0.405rem;
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
</style>
