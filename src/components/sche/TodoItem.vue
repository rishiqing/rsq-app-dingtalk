<template>
  <r-slider-delete
    :item="item"
    @deleteItem="deleteItem">
    <li class="todoItem">
      <v-touch
        style="margin-left: 35px"
        @tap="clickItem($event)">
        <div
          :class="{'margin-left':!isCheckable}"
          class="title-todo">
          <span
            :class="{'delay-width':isDelay,'common-width':!isDelay, 'text-grey': item.pIsDone, 'text-mid-line': item.pIsDone,'real-width-sche':isMaxlength(item)}"
            class="todo-content-sche" >
            {{ item.pTitle }}
          </span>
          <span
            v-show="isDelay"
            :class="{'is-alert': isDelay}"
            class="delayer">
            延期{{ delayDays }}天
          </span>
          <span
            v-if="!isCheckable"
            v-show="isFromSche"
            class="receive">
            来自同事
          </span>
          <span
            v-if="!isCheckable"
            v-show="isFromKanban"
            class="receive">
            来自计划
          </span>
        </div>
      </v-touch>
      <v-touch
        v-if="isCheckable"
        class="todo-checkbox"
        @tap="clickCheckOut">
        <i
          :class="{'icon-check_box_outline_blank': !item.pIsDone, 'icon-check': item.pIsDone}"
          class="icon2-check-box select"/>
        <i
          :class="{'isdisplay':item.pIsDone}"
          class="icon2-selected hide"/>
      </v-touch>
    </li>
  </r-slider-delete>
</template>
<script>
  import dateUtil from 'ut/dateUtil'
  import SliderDelete from 'com/pub/SliderDelete'
  // import moment from 'moment'
  import bus from 'com/bus'

  export default {
    name: 'TodoItem',
    components: {
      'r-slider-delete': SliderDelete
    },
    props: {
      item: {
        type: Object,
        required: true
      },
      isCheckable: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {}
    },
    computed: {
      currentTodo () {
        return this.$store.state.todo.currentTodo || {}
      },
      currentDate () { return this.$store.getters.defaultTaskDate },
      isIE () { return this.item.pContainer === 'IE' },
      isIU () { return this.item.pContainer === 'IU' },
      isUE () { return this.item.pContainer === 'UE' },
      isUU () { return this.item.pContainer === 'UU' },
      delayDays () {
        return dateUtil.getDelayDays(this.item, this.currentDate, false)
      },
      isDelay () {
        return this.delayDays
      },
      isFromSche () {
        return this.item.isFrom === 'receive'
      },
      isFromKanban () {
        return this.item.isFrom === 'kanban'
      }
    },
    methods: {
      deleteCurrentTodo (p) {
        this.$emit('clear-date')
        return this.$store.dispatch('deleteTodo', p)
      },
      prepareDelete () {
        var that = this
        if (that.currentTodo.isCloseRepeat) {
          window.rsqadmg.exec('confirm', {
            message: '确定要删除此任务？',
            success () {
//              window.rsqadmg.execute('showLoader', {text: '删除中...'})
              that.deleteCurrentTodo({todo: that.currentTodo})
                .then(() => {
                  bus.$emit('deleteItemList')
                  // that.sendMessage()
                  //                  window.rsqadmg.exec('hideLoader')
                  window.rsqadmg.execute('toast', {message: '删除成功'})
                })
            }
          })
        } else {
          window.rsqadmg.exec('actionsheet', {
            buttonArray: ['仅删除此任务', '删除此任务及以后的任务', '删除所有的重复任务'],
            success: function (res) {
              var promise
              switch (res.buttonIndex) {
                case 0:
                  promise = that.deleteCurrentTodo({todo: that.currentTodo, isRepeat: true, type: 'today'})
                  break
                case 1:
                  promise = that.deleteCurrentTodo({todo: that.currentTodo, isRepeat: true, type: 'after'})
                  break
                case 2:
                  promise = that.deleteCurrentTodo({todo: that.currentTodo, isRepeat: true, type: 'all'})
                  break
                default:
                  break
              }
              promise.then(() => {
                window.rsqadmg.exec('hideLoader')
                bus.$emit('deleteItemList')
                // that.sendMessage()
                window.rsqadmg.execute('toast', {message: '删除成功'})
              })
            }
          })
        }
      },
      // sendMessage () {
      //   var that = this
      //   var url = window.location.href.split('#')
      //   var name = that.$store.getters.loginUser.authUser.name
      //   var datas = {
      //     corpId: that.$store.getters.loginUser.authUser.corpId,
      //     agentid: that.$store.getters.loginUser.authUser.corpId,
      //     title: name + ' 删除了任务',
      //     url: url[0] + '#' + '/sche',
      //     description: that.currentTodo.pTitle,
      //     receiverIds: that.currentTodo.receiverIds
      //   }
      //   // console.log(datas)
      //   // that.$store.dispatch('qywxSendMessage', datas)
      // },
      deleteItem () {
//        bus.$emit('deleteItemList')
//        e.stopPropagation()
        var that = this
        this.$store.dispatch('setCurrentTodo', this.item).then(
          () => {
            window.setTimeout(() => {
              that.prepareDelete()
            }, 50)
          }
        )
      },
      isMaxlength (item) {
        return item.pTitle.length > 10
      },
      clickItem (e) {
        //  这个是点击跳到编辑界面
        if (!e.target.classList.contains('icon2-check-box')) {
          this.$emit('todo-item-click', this.item)
          e.preventDefault()
        }
      },
      clickCheckOut (e) {
        // var that = this
        // var name = that.$store.getters.loginUser.authUser.name
        // var url = window.location.href.split('#')
        var end = this.$store.getters.defaultNumTaskDate + 24 * 3600 * 1000 > new Date().getTime()
        if (!end) {
          window.rsqadmg.execute('toast', {message: '过去的任务不能编辑'})
          return
        }
        this.$emit('todo-item-check', this.item, !this.item.pIsDone)
        // var todoStatus = !this.item.pIsDone ? ' 完成了任务' : ' 重启了任务'
        // var datas = {
        //   corpId: that.$store.getters.loginUser.authUser.corpId,
        //   agentid: that.$store.getters.loginUser.authUser.corpId,
        //   title: name + todoStatus,
        //   url: url[0] + '#' + '/sche/todo/',
        //   description: that.item.pTitle,
        //   receiverIds: that.item.receiverIds
        // }
        // console.log(datas)
        // that.$store.dispatch('qywxSendMessage', datas)
        e.preventDefault()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .isfrom{
    display: none;
  }
  .todo-checkbox{
  }
  .receive{
    border: 1px solid #55A8FD;
    border-radius: 2px;
    width: 56px;
    height: 22px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #55A8FD;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: -0.405rem;
    line-height: 22px
  }
  .contain-tag {position:absolute;left:0;height:20px;width:2px;top:50%;margin-top:-10px;}
  .title-todo{
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  .margin-left{
    margin-left:-35px
  }
  .real-width-sche{}
  .todo-content-sche{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 56px;
    line-height: 56px;
    // height: 1.6rem;
    white-space:nowrap
  }
  .delay-width{
    width: 70%;
  }
  .common-width{
    width: 85%;
  }
  .hide{
    display: none;
  }
  .isdisplay{
    display: block;
    // position:absolute;
    // top:0.49rem;
    // right: 0.22rem;
    transform: translateY(-36px) translateX(3px);
    font-size: 15px;
    color:#999;
  }
  .for-hide{
    position: absolute;
    top:0.52rem;
    left: 0.65rem;
    display: block;
    width: 2px;
    height: 2px;
    background-color: white;
    border: 1px solid white;
  }
  .delayer{
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #FF7A7A;
    letter-spacing: 0;
    margin-right: 0.5rem;
  }
  li{
    padding:0;
    // position: relative;
    // border-bottom:0.5px solid #D4D4D4 ;
  }
  li:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: -1px;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #D4D4D4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  li:last-child,li:last-child:after{
    border-bottom: none;
  }
  .delete:last-child .slider .content li:after {
    border-bottom: none;
  }
  .todoItem{
    width: 70%;
    /*display: inline-block;*/
  }
  .todoItem:last-child{
    border-bottom: none;
  }
  .item-title{}
  .select{
     color: #b9b9bc;
    font-size: 20px;
    display: block;
    // margin: 20px auto;
    line-height: 56px;
    border-radius: 1px;
    width: 20px;
  }
  .todo-checkbox {
    position: absolute;
    top: 0;
    // left: -0.1rem;
    // width: 1rem;
    height: 56px;
    line-height: 56px;
  }
</style>
