<template>
  <div class="">
    <ul
      :class="{'has-border':!hasChild}"
      class="sublist">
      <template v-if="finalItems">
        <li
          v-for="item in finalItems"
          :key="item.id"
          class="sublist-item">
          <v-touch
            class="wrap-sub-icon"
            @tap="clickCheckOut(item)">
            <i class="icon2-check-box select-sub"/>
            <i
              :class="{'is-display-sub':item.isDone}"
              class="icon2-selected hide"/>
          </v-touch>
          <v-touch
            class="wrap-input"
            @tap="showEditSubtodo(item)">
            <span
              ref="titleInput"
              :class="{ 'text-grey': item.isDone, 'text-mid-line': item.isDone}"
              class="list-below">
              {{ item.name }}
            </span>
          </v-touch>
        </li>
      </template>
      <div class="wrap">
        <img
          src="../../assets/img/addsubtodo.svg"
          class="add">
        <v-touch
          class="write"
          @tap="saveTodo">
          添加子任务
        </v-touch>
      </div>
    </ul>
  </div>
</template>
<script>
  import TodoItemList from 'com/sche/TodoItemList'
  export default {
    components: {
      'r-todo-item-list': TodoItemList
    },
    props: {
      isDisabled: {
        type: Boolean,
        default: false
      },
      //  被禁用编辑的提示，默认为''，不提示；如果要显示提示文字，需要传入提示的文字
      disabledText: {
        type: String,
        default: ''
      }
    },
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
        return this.$store.state.todo.currentTodo.subTodos
      },
      finalItems () {
        var arr = this.items ? this.items : []
        if (arr.length > 0) {
          arr.sort(function (o1, o2) {
            return o1.isDone > o2.isDone
          })
        }
        return arr
      },
      todoId () {
        return this.$store.state.todo.currentTodo.id
      },
      currentTodo () {
        return this.$store.state.todo.currentTodo
      },
      hasChild () {
        if (this.$store.state.todo.currentTodo.subTodos) {
          return this.$store.state.todo.currentTodo.subTodos.length === 0
        }
      }
    },
    mounted () {
      // window.rsqadmg.exec('setTitle', {title: this.titleName})
      window.rsqadmg.exec('setOptionButtons', {hide: true})
      this.$store.dispatch('setNav', {isShow: false})
    },
    methods: {
      showEditSubtodo (item) {
        if (this.isDisabled) {
          window.rsqadmg.execute('toast', {message: this.disabledText})
          return
        }
        this.$store.dispatch('setCurrentSubtodo', item)
        this.$router.push('/sche/todo/' + this.currentTodo.id + '/subtodo/' + item.id)
      },
      saveTodo () {
        if (this.isDisabled) {
          window.rsqadmg.execute('toast', {message: this.disabledText})
          return
        }
        var backDate = {
          dates: null,
          endDate: '',
          isCloseRepeat: true,
          isLastDate: true,
          repeatBaseTime: null,
          repeatType: null,
          startDate: ''
        }
        this.$store.dispatch('setCurrentSubtodo', backDate)
        this.$router.push('/sche/todo/' + this.currentTodo.id + '/subtodo/create')
      },
      clickCheckOut (item) {
        if (this.isDisabled) {
          window.rsqadmg.execute('toast', {message: this.disabledText})
          return
        }
        this.$store.dispatch('submitSubtodoFinish', {item: item, status: !item.isDone})
            .then(function () {
              this.$store.dispatch('saveTodoAction', {editItem: {status: !item.isDone, type: 17}})
                .then(() => {
                })
            })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .is-editable{
    disabled:true
  }
  .is-display-remind{
    display: none;
  }
  .remind-subtodo{
    font-family: PingFangSC-Regular;
    color:#A3A3A3;
    font-size: 0.32rem;
    margin-top:0.16rem ;
    padding-left: 0.6rem;
  }
  .wrap-sub-icon{
    height: 1.22rem;
    display: flex;
    align-items: center;
    position: relative;
  }
  .wrap-input{
    display: flex;
    align-items: center;
    width: 90%;
  }
  .for-cover{
    height: 20px;
    z-index:1;
    width: 100%;
    background-color: #F5F5F5;
    position: fixed;
  }
  .wrap {
    position: relative;
    width: 100%;
    z-index: 2;
  }
  input::-webkit-input-placeholder { /* WebKit browsers */
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #999999;
  }
  .select-sub{
    color: #B1B1B1;
  }
  .sublist{
    background-color: white;
    padding-left: 15px;
    z-index: 0;
    // border-top: 0.5px solid #d4d4d4;
    // border-bottom: 0.5px solid #d4d4d4;
  }
  .sublist:before{
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
  .sublist:after{
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
  .has-border{
    // border-top:0.5px solid #D4D4D4;
    // border-bottom:0.5px solid #D4D4D4;
  }
  .list-below{
    border:none;
    margin-left: 15px;
    font-family: PingFangSC-Regular;
    /*line-height: 0.2rem;*/
    font-size: 17px;
    width: 98%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space:nowrap;
  }
  .sublist-item:last-child:after{
    border-bottom: none;
  }
  .sublist-item{
    position: relative;
    // border-bottom:0.5px solid #D4D4D4;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    height: 1.22rem;
    display: flex;
    align-items: center;
  }
  .sublist-item:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .top-subtodo{
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
      top: 30%;
      // left:0.55rem;
      -webkit-appearance: none;
      width: 0.5333rem;
      height: 0.5333rem;
      vertical-align: text-align;
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
  .new-create{
    display: block;
    margin-left: 0.8rem;
    font-family:PingFangSC-Regular;
    font-size: 17px;
    color: #55A8FD;
  }
  .hide{
    display: none;
  }
  .todo-content{
    margin-left: 0.6rem;
  }
  ul{
    position: relative;
    margin-top:20px;
    padding-left: 5%;
  }
  .is-display-sub{
    display: block;
    position:absolute;
    top:0.44rem;
    left: 0.03rem;
    font-size: 15px;
    color:#999999;
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
    box-sizing: border-box;
    text-align: center;
    border: 1px solid #55A8FD;
    border-radius: 2px;
    width:1.413rem;
    height: 0.66rem;
    line-height: 0.66rem;
    font-size: 0.35rem;
    color:#55A8FD;
    position: absolute;
    top:50%;
    right:0.35rem;
    margin-top: -0.33rem;
    z-index:2;
    background-color: white;
  }
  .write{
    // background: #FFFFFF;
    top: 20px;
    padding-left:30px;
    z-index: 1;
    line-height: 0.6rem;
    padding-right: 2.432rem;
    padding-top: 0.313rem;
    padding-bottom: 0.313rem;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #000000;
    line-height: 24px;
    color: #55A8FD;
  }
  .margin-block {
    height: 50px;
    z-index: 3;
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
