<template>
  <div class="">
    <textarea name="" id="" cols="30" rows="10" placeholder="请输入子任务标题" class="subtodoInput" :value="title"
              @blur="saveTitle($event.target.value)"
              @input="inputChange($event.target.value)"
    ></textarea>
    <div class="subtodo-padding">
      <r-input-date
        :sub-new-item="true"
        :item="currentTodo"
      ></r-input-date>
    </div>
    <!--<v-touch @tap="saveTodo">-->
      <!--<button>提交</button>-->
    <!--</v-touch>-->
    <!--<div class="subtodo-padding-second">-->
      <!--<r-input-member-->
        <!--:sub-new-item="true"-->
        <!--:is-native="true"-->
        <!--:index-title="'参与人'"-->
        <!--:selected-rsq-ids="joinUserRsqIds"-->
        <!--:disabled-rsq-ids="[]"-->
        <!--@member-changed="saveMember"-->
        <!--&gt;</r-input-member>-->
    <!--</div>-->
    <!--<ul class="sublist" :class="{hasborder:!haschild}">-->
      <!--<li v-for="item in items" v-if="items" class="sublistItem">-->
        <!--<v-touch class="wrap-sub-icon" v-if="" @tap="clickCheckOut(item)">-->
          <!--<i class="icon2-check-box select-sub"></i>-->
          <!--<div class="hide" :class="{'for-hide-sub':item.isDone}"></div>-->
          <!--<i class="icon2-selected hide" :class="{'isdisplay-sub':item.isDone}"></i>-->
        <!--</v-touch>-->
        <!--<v-touch class="wrap-input">-->
           <!--<input   class="list-below" @focus="IsDisabled($event,item.isDone)" @blur="inputBlur($event.target.value, item)"  @input="inputChange($event.target.value)"-->
                    <!--ref="titleInput" :value=item.name   :class="{ 'text-grey': item.isDone, 'text-mid-line': item.isDone,'margin-left':isCheckable,'is-editable':item.isDone}">-->
        <!--</v-touch>-->
      <!--</li>-->
    <!--</ul>-->
    <!--<div class="remind-subtodo" :class="{IsDisplayRemind:haschild}">*清空标题可删除任务</div>-->
  </div>
</template>
<script>
  import TodoItemList from 'com/sche/TodoItemList'
  import InputDate from 'com/pub/InputDate'
  import InputMember from 'com/pub/InputMember'
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
      },
      currentTodo () {
        return this.$store.state.todo.currentTodo
      },
      title () {
        return this.$store.state.title
      },
      mainID () {
        return this.$store.state.id
      }
    },
    components: {
      'r-todo-item-list': TodoItemList,
      'r-input-date': InputDate,
      'r-input-member': InputMember
    },
    methods: {
      inputChange (value) {
        this.$store.commit('SAVE_TITLE', {'title': value})
      },
      saveTitle (value) {
        this.$store.commit('SAVE_TITLE', {'title': value})
      },
      IsDisabled (e, pIsDone) {
        if (pIsDone) {
          e.target.blur()
        }
      },
      change () {
        this.seen = false
      },
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
                  //  触发标记重复修改
                  that.$store.commit('TD_CURRENT_TODO_REPEAT_EDITED')
//                  this.$store.dispatch('saveTodoAction', {editItem: {idOrContent: value, type: 10}})
//                    .then(() => {
//                    })
                  window.rsqadmg.exec('hideLoader')
                  window.rsqadmg.execute('toast', {message: '删除成功'})
                  that.$router.replace(window.history.back())
                })
            }
          })
        } else {
          if (value !== item.name) {
//            window.rsqadmg.exec('showLoader', {text: '保存中...'})
            this.$store.dispatch('updateSubTodo', {item: item, name: value})
              .then(() => {
//                console.log('updateSubTodo执行完成')
                //  触发标记重复修改
                this.$store.commit('TD_CURRENT_TODO_REPEAT_EDITED')
              })
          }
        }
      },
//      inputChange (value) {
//        this.$refs.titleInput.value = value
//      },
      saveTodo () {
//        console.log(this.currentTodo.id)
        if (this.currentTodo.id) {
          window.rsqadmg.execute('showLoader', {text: '更新中...'})
          this.$store.dispatch('updateSubTodo', {item: this.currentTodo, name: this.title})
            .then(() => {
//              console.log('updateSubTodo执行完成')
              //  触发标记重复修改
              window.rsqadmg.exec('hideLoader')
              window.rsqadmg.execute('toast', {message: '更新成功'})
              this.$router.push(window.history.back())
              this.$store.commit('TD_CURRENT_TODO_REPEAT_EDITED')
            })
        } else {
          window.rsqadmg.execute('showLoader', {text: '创建中...'})
          this.$store.dispatch('createSubTodo', {newItem: {pTitle: this.title}, todoId: this.mainID, startDate: this.currentTodo.startDate, endDate: this.currentTodo.endDate})
            .then(() => {
              console.log('创建成功')
              window.rsqadmg.exec('hideLoader')
              window.rsqadmg.execute('toast', {message: '创建成功'})
              this.$router.push(window.history.back())
              this.$store.commit('TD_CURRENT_TODO_REPEAT_EDITED')
              this.$store.commit('SAVE_TITLE', { 'title': '哈哈哈' })
            })
        }
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
    created () {
      var btnParams
      var that = this
      btnParams = {
        btns: [{key: 'subtodo', name: '保存'}],
        success: function (res) {
          if (res.key === 'subtodo') {
            that.saveTodo()
          }
        }
      }
      window.rsqadmg.execute('setOptionButtons', btnParams)
    },
    mounted () {
      window.rsqadmg.exec('setTitle', {title: this.titleName})
//      window.rsqadmg.exec('setOptionButtons', {hide: true})
      this.$store.dispatch('setNav', {isShow: false})
    }
//    beforeRouteLeave (to, from, next) {
//      this.inputBlur()
//    }
  }
</script>
<style scoped>
  .subtodo-padding{
    padding-left: 0.3rem;
    background-color: white;
    margin-top: 0.2rem;
    border-top: 1px solid #E0E0E0;
    border-bottom: 1px solid #E0E0E0;
  }
  .subtodo-padding-second{
    padding-left: 0.3rem;
    background-color: white;
    border-bottom: 1px solid #E0E0E0;
  }
  .subtodoInput{
    resize: none;
    height: 2.666rem;
    margin-top: 0.3rem;
    border-bottom: 1px solid #E0E0E0;
    border-top: 1px solid #E0E0E0;
    padding-left: 0.2rem;
  }
  .is-editable{
    disabled:true
  }
  .IsDisplayRemind{
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
    height: 0.266rem;
    z-index:1;
    width: 100%;
    background-color: #F8F8F8;
    position: fixed;
    /*top:0;*/
    /*left:0;*/
    /*right: 0;*/
    /*bottom: 0;*/
  }
  input::-webkit-input-placeholder { /* WebKit browsers */
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #999999;
  }
  .select-sub{
    /*position: absolute;*/
    /*top: 0.4rem;*/
    /*color:#b9b9bc;*/
    /*left:0.02rem*/
    color: #B1B1B1;
  }
  .sublist{
    background-color: white;
    padding-left: 0.6rem;
    z-index: 0;
  }
  .hasborder{
    border-top:1px solid #E0E0E0;
    border-bottom:1px solid #E0E0E0;
  }
  .list-below{
    border:none;
    margin-left: 0.35rem;
    font-family: PingFangSC-Regular;
    /*line-height: 0.2rem;*/
    font-size: 17px;
    width: 98%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space:nowrap;
    padding-top: 0.08rem;
  }
  .sublistItem:last-child{
    border-bottom: none;
  }
  .sublistItem{
    position: relative;
    /*padding-top: 0.1rem;*/
    border-bottom:1px solid #DADADA ;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    /*color: #222222;*/
    /*padding: 0.33rem 0 0.15rem 0*/
    height: 1.22rem;
    display: flex;
    align-items: center;
  }
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
    font-size: 0.4rem;
    background-color: #55A8FD;
    color:white;
    border: 1px solid #55A8FD;
    border-radius: 50%;
    left:0.55rem;
    -webkit-appearance: none;
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
    margin-top:0.666rem;
    padding-left: 5%;
  }
  li{

  }
  li:first-child{
  }
  i.isdisplay-sub{
    display: block;
    position:absolute;
    top:0.27rem;
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
    -webkit-appearance: none;
    /*display: block;*/
    /*text-align: center;*/
    display: flex;
    /*align-items: center;*/
    justify-content: center;
    border: 1px solid #55A8FD;
    border-radius: 2px;
    height: 0.666rem;
    /*line-height: 0.76rem;*/
    /*width:1.4rem;*/
    font-size: 0.4rem;
    color:#55A8FD;
    position: fixed;
    top:0.57rem;
    right:0.35rem;
    z-index:2;
    background-color: white;
    /*padding-left: 0.26rem;*/
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
    padding-top: 0.313rem;
    padding-bottom: 0.313rem;
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
