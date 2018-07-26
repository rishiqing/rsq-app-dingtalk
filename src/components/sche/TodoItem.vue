<template>
  <!--<leftSlider @getMsgFromChild="getMsgFromChild()">-->
  <li class="todoItem" :class="{'inboxDistance': !isCheckable, 'list-margin':listMargin, 'IEBorder': IEcolor(item), 'IUBorder': IUcolor(item), 'UEBorder': UEcolor(item), 'UUBorder': UUcolor(item)}" @touchstart="showColor" @touchend="hideColor" ref="scheListItem" >
    <v-touch class="" @tap="clickItem($event)" style="margin-left: 1rem">
      <div class="title-todo" :class="{'marginLeft':!isCheckable}">
        <!--<span class="time" v-if="item.clock !== null">{{item.clock.startTime}}</span>-->
        <div v-if="!isCheckable">
          <span class="todo-content-sche" :class="{'delay-width':isDelay,'common-width':!isDelay, 'text-grey': item.pIsDone, 'text-mid-line': item.pIsDone,'real-width-sche':isMaxlength(item)}">{{ item.pTitle }}</span>
        </div>
        <div v-else>
          <span v-if="item.clock !== null"class="todo-content-sche" :class="{'delay-width':isDelay,'common-width':!isDelay, 'text-grey': item.pIsDone, 'text-mid-line': item.pIsDone,'real-width-sche':isMaxlength(item)}">{{item.clock.startTime}}  {{ item.pTitle }}</span>
          <span v-if="item.clock === null"class="todo-content-sche" :class="{'delay-width':isDelay,'common-width':!isDelay, 'text-grey': item.pIsDone, 'text-mid-line': item.pIsDone,'real-width-sche':isMaxlength(item)}">{{ item.pTitle }}</span>
        </div>
        <span class="delayer" :class="{'is-alert': isDelay}" v-show="isDelay">延期{{delayDays}}天</span>
        <span v-if="!isCheckable && item.from !== null" v-show="isFromSche" class="receive">
           <avatar :src="item.authorAvatar"
                   :username="item.from.levelOneName"
                   :size="30">
        </avatar>
        </span>
        <span v-if="!isCheckable" v-show="isFromKanban" class="receive">来自计划</span>
      </div>
    </v-touch>
    <v-touch class="todo-checkbox" v-if="isCheckable" @tap="clickCheckOut">
      <i class="icon2-check-box select"
         :class="{'icon-check_box_outline_blank': !item.pIsDone, 'icon-check': item.pIsDone}"></i>
      <div class="hide" :class="{'for-hide':item.pIsDone}"></div>
      <i class="icon2-selected hide" :class="{'isdisplay':item.pIsDone}"></i>
    </v-touch>
  </li>
  <!--</leftSlider>-->
</template>
<style lang="scss" scoped>
  .time{
    margin-right: 0.2rem;
  }
  li.inboxDistance{
    border-bottom: none ;
  }
  .IEBorder{
    border-left: 4px solid  #F25643;
  }
  .IUBorder{
    border-left: 4px solid  #F0C02B;
  }
  .UEBorder{
    border-left: 4px solid  #7FBDF2;
  }
  .UUBorder{
    border-left: 4px solid  #ABF27F;
  }
  .list-margin{
    margin-left: -1rem;
  }
  .delete{
    font-size: 17px;
  }
  .isfrom{
    display: none;
  }
  .todo-checkbox{

  }
  .receive{
    /*border: 1px solid #55A8FD;*/
    border-radius: 2px;
    width: 1.513rem;
    height: 0.594rem;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #55A8FD;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.405rem;
  }
  .contain-tag {position:absolute;left:0;height:20px;width:2px;top:50%;margin-top:-10px;}
  .title-todo{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 1.612rem;
  }
  .marginLeft{
    margin-left:-0.5rem;
    border-bottom: 1px solid rgba(25,31,37,0.08);
  }
  .real-width-sche{}
  .todo-content-sche{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 1.6rem;
    white-space:nowrap;
    display: block;
  }
  .delay-width{
    /*width: 70%;*/
    width: 6rem;
  }
  .common-width{
    width: 8rem;
  }
  .hide{
    display: none;
  }
  .isdisplay{
    display: block;
    position:absolute;
    top:0.45rem;
    left: 0.37rem;
    font-size: 15px;
    color:#55A8FD;
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
    font-size: 15px;
    color: #FF7A7A;
    letter-spacing: 0;
    margin-right: 0.5rem;
  }
  li{
    padding:0;
    line-height:1.612rem ;
    height:1.612rem ;
    position: relative;
    /*border-bottom:1px solid #E0E0E0 ;*/
  }
  .todoItem{
    /*width: 72%;*/
    padding-left: 1.7%;
    border-bottom:1px solid #E0E0E0 ;
  }
  .item-title{}
  .select{
    color:#b9b9bc;
    font-size: 17px;
    display: block;
    margin: 0.58rem 0 0 0.3rem;
    /*position: absolute;*/
    /*top:0.58rem;*/
    /*<!--top:50%;-->*/
    /*<!--margin-top: -0.22rem;-->*/
    /*left:0.2rem;*/
    /*background: #FFFFFF;*/
    border-radius: 1px;
  }
  .todo-checkbox {
    position: absolute;
    top: 0;
    left: 0.1rem;
    width: 1rem;
    height: 1.6rem;
  }
</style>
<script>
  import dateUtil from 'ut/dateUtil'
  import leftSlider from 'com/slider_delete'
  import Avatar from 'com/pub/TextAvatar'
  export default {
    name: 'TodoItem',
    data () {
      return {
        listMargin: false
      }
    },
    components: {
      'leftSlider': leftSlider,
      'avatar': Avatar
    },
    props: {
      item: Object,
      isCheckable: Boolean
    },
    computed: {
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
      },
      currentNumDate () {
        return this.$store.getters.defaultNumTaskDate
      },
      IsDisabled () {
        var enabled = this.currentNumDate + 24 * 3600 * 1000 < new Date().getTime()
        return enabled
      }
    },
    methods: {
      getMsgFromChild () {
        this.$store.dispatch('setCurrentTodo', this.item)
        this.$emit('delete')
//        console.log('getMsgFromChild发出去了')
      },
      IEcolor (item) {
        return item.pContainer === 'IE' && !item.pIsDone
      },
      IUcolor (item) {
        return item.pContainer === 'IU' && !item.pIsDone
      },
      UEcolor (item) {
        return item.pContainer === 'UE' && !item.pIsDone
      },
      UUcolor (item) {
        return item.pContainer === 'UU' && !item.pIsDone
      },
      showColor () {
        this.$refs.scheListItem.style.backgroundColor = '#48A1FA'
//        console.log('触摸进来了')
      },
      hideColor () {
        this.$refs.scheListItem.style.backgroundColor = '#FFFFFF'
      },
      onSwipeRight () {
        this.listMargin = false
      },
      onSwipeLeft () {
//        console.log('滑动了')
        this.listMargin = true
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
//        console.log('this.currentNumDate' + new Date(this.currentNumDate))
        if (this.IsDisabled) {
//          window.rsqadmg.execute('toast', {message: '过去的任务不能编辑'})
          return
        }
        this.$emit('todo-item-check', this.item, !this.item.pIsDone)
        e.preventDefault()
      }
    },
    mounted () {
    }
  }
</script>
