<template>
  <li class="todoItem">
    <v-touch class="" @tap="clickItem($event)" style="margin-left: 1rem">
      <div class="title-todo" :class="{'margin-left':!isCheckable}">
        <span class="todo-content-sche" :class="{ 'text-grey': item.pIsDone, 'text-mid-line': item.pIsDone,'real-width-sche':isMaxlength(item)}">{{ item.pTitle }}</span>
        <span class="delayer" :class="{'is-alert': isDelay}" v-show="isDelay">延期{{delayDays}}天</span>
        <span v-if="!isCheckable" v-show="!isFrom" class="receive">我收到的</span>
      </div>
    </v-touch>
    <v-touch class="todo-checkbox" v-if="isCheckable" @tap="clickCheckOut">
      <i class="icon2-check-box select"
         :class="{'icon-check_box_outline_blank': !item.pIsDone, 'icon-check': item.pIsDone}"></i>
      <div class="hide" :class="{'for-hide':item.pIsDone}"></div>
      <i class="icon2-selected hide" :class="{'isdisplay':item.pIsDone}"></i>
    </v-touch>
  </li>
</template>
<style lang="scss" scope>
  .isfrom{
    display: none;
  }
  .receive{
    border: 1px solid #55A8FD;
    border-radius: 2px;
    width: 1.513rem;
    height: 0.594rem;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #55A8FD;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
  }
  .contain-tag {position:absolute;left:0;height:20px;width:2px;top:50%;margin-top:-10px;}
  .title-todo{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .margin-left{
    margin-left:-1rem
  }
  .real-width-sche{}
  .todo-content-sche{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 66%;
    height: 1.6rem;
    white-space:nowrap
  }
  .hide{
    display: none;
  }
  .isdisplay{
    display: block;
    position:absolute;
    top:0.45rem;
    left: 0.33rem;
    font-size: 15px;
    color:#55A8FD;
  }
  .for-hide{
    position: absolute;
    top:0.52rem;
    left: 0.59rem;
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
    position: relative;
    border-bottom:1px solid #E0E0E0 ;
  }
  .todoItem{}
  .item-title{}
  .select{
    color:#b9b9bc;
    font-size: 17px;
    position: absolute;
    top:0.58rem;
    left:0.2rem;
    background: #FFFFFF;
    border-radius: 1px;
  }
</style>
<script>
  export default {
    name: 'TodoItem',
    data () {
      return {}
    },
    props: {
      item: Object,
      isCheckable: Boolean
    },
    computed: {
      isIE () { return this.item.pContainer === 'IE' },
      isIU () { return this.item.pContainer === 'IU' },
      isUE () { return this.item.pContainer === 'UE' },
      isUU () { return this.item.pContainer === 'UU' },
      delayDays () { return this.item.delayDays },
      isDelay () { return this.delayDays > 0 && !this.item.pIsDone },
      isFrom () {
        return this.item.from === null
      }
    },
    methods: {
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
        this.$emit('todo-item-check', this.item, !this.item.pIsDone)
        e.preventDefault()
      }
    },
    mounted () {
    }
  }
</script>
