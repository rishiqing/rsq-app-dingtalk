<template>
  <div class="">
    <div class="topSubtodo" v-if="seen">
      <v-touch @tap="change"><i class="icon2-add-circle add"></i></v-touch>
      <span>新建子任务</span>
    </div>
    <div v-else class="anotherTop">
      <input class="write" type="text" placeholder="在这里写下想法" v-model="inputTitle">
      <v-touch @tap="saveTodo" v-show="inputTitle !== ''" class="btn-create">
        <input value="创建" class="create"/>
      </v-touch>
    </div>
    <div class="margin-block"></div>
    <ul class="list" v-if="">
    <li v-for="item in items" v-if="items">
      <v-touch class="" @tap="clickItem($event)">
        <!--<div class="contain-tag" :class="{'bg-con-ie':isIE,'bg-con-iu':isIU,'bg-con-ue':isUE,'bg-con-uu':isUU}"></div>-->
        <!--<div class="itm-inner">-->
        <!--<div class="title-todo" >-->
         <input   class="list-below" @blur="inputBlur($event.target.value, item)"  @input="inputChange($event.target.value)"
                  ref="titleInput" :value=item.name   :class="{ 'text-grey': item.isDone, 'text-mid-line': item.isDone,'margin-left':isCheckable}">
        <!--</div>-->
        <v-touch class="" v-if="" @tap="clickCheckOut(item)">
          <i class="icon2-check-box select-sub"></i>
          <div class="hide" :class="{'for-hide-sub':item.isDone}"></div>
          <i class="icon2-selected hide" :class="{'isdisplay-sub':item.isDone}"></i>
        </v-touch>

        <!--<div class="itm-icons itm-icons&#45;&#45;white-bg u-abs-right">-->
        <!--&lt;!&ndash;<i class="icon icon-access_alarm" v-if="item.clockAlert"></i>&ndash;&gt;-->
        <!--&lt;!&ndash;<i class="icon icon-move_to_inbox" v-if="item.senderTodo"></i>&ndash;&gt;-->
        <!--</div>-->
        <!--</div>-->
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
        return this.$store.state.todo.currentTodo.subTodos
      },
      todoid () {
        return this.$store.state.todo.currentTodo.id
      }
    },
    components: {
      'r-todo-item-list': TodoItemList
    },
    methods: {
      change () {
        this.seen = false
      },
      judgeable () {
        if (this.items) {
          this.judge = true
        }
      },
      inputBlur (value, item) {
        this.$refs.titleInput.value = value
        if (!value) {
          var that = this
          // this.deleteCurrentSubTodo(item)
          // return window.rsqadmg.execute('alert', {message: '任务标题不能为空'})
          window.rsqadmg.exec('confirm', {
            message: '确定要删除此任务？',
            success () {
              window.rsqadmg.execute('showLoader', {text: '删除中...'})
              that.$store.dispatch('deleteSubTodo', {item: item})
                .then(() => {
                  console.log('进入到最后了')
                  window.rsqadmg.exec('hideLoader')
                  window.rsqadmg.execute('toast', {message: '删除成功'})
                  this.$router.replace(window.history.back())
                })
            }
          })
        } else {
          // console.log('新的value是' + value)
          if (value !== this.items[0].name) {
            window.rsqadmg.exec('showLoader', {text: '保存中...'})
            this.$store.dispatch('updateSubTodo', {item: item, name: value})
              .then(() => {
                // this.items.name = value
                window.rsqadmg.exec('hideLoader')
                window.rsqadmg.execute('toast', {message: '保存成功'})
              })
          }
        }
      },
      deleteCurrentSubTodo (item) {
        // var that = this
        window.rsqadmg.exec('confirm', {
          message: '确定要删除此任务？',
          success () {
            window.rsqadmg.execute('showLoader', {text: '删除中...'})
            this.$store.dispatch('deleteSubTodo', {item: item})
              .then(() => {
                console.log('进入到最后了')
                window.rsqadmg.exec('hideLoader')
                window.rsqadmg.execute('toast', {message: '删除成功'})
                this.$router.replace(window.history.back())
              })
          }
        })
      },
      inputChange (value) {
        this.$refs.titleInput.value = value
      },
      fetchItems () {
        this.$store.dispatch('fetchInboxItems')
      },
      saveTodo () {
        window.rsqadmg.execute('showLoader', {text: '创建中...'})
        this.$store.dispatch('createSubTodo', {newItem: {pTitle: this.inputTitle}, todoId: this.todoid})
          .then(() => {
            this.inputTitle = ''
            window.rsqadmg.exec('hideLoader')
            window.rsqadmg.execute('toast', {message: '创建成功'})
          })
      },
      clickItem () {
//        this.$store.dispatch('setCurrentTodo', this.items)
//        this.$router.push('/todo/SubTodoEdit')
      },
      clickCheckOut (item) {
        console.log('进来了clickCheckOut')
        this.$store.dispatch('submitSubTodoFinish', {item: item, status: !item.isDone})
            .then(function () {
//              rsqadmg.execute('toast', {message: str})
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
  input::-webkit-input-placeholder { /* WebKit browsers */
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #999999;
    line-height: 22px;
  }
  .select-sub{
    position: absolute;
    top: 0.4rem;
  }
  .list{
    background-color: white;
  }
  .list-below{
    border:none;
    line-height: 1.126rem;
    margin-left: 0.8rem;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    /*color: #222222;*/
  }
  .topSubtodo{
    position:fixed;
    background-color: white;
    position: relative;
    line-height: 1.226rem;;
    top:0.266rem;
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
    margin-top:0.966rem;
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
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #222222;
  }
  li:last-child{
    border: none;
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
    top:0.5rem;
    right:0.35rem;
    z-index:2
  }
  .write{
    height:1.226rem;
    background: #FFFFFF;
    border-bottom:1px solid #E3E3E3;
    border-top:1px solid #E3E3E3;
    top: 0.266rem;
    padding-left:0.3rem;
    position: fixed;
    /*z-index: 1;*/
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
