<template>
  <li class="">
    <v-touch class="" @tap="clickItem($event)">
      <!--<div class="contain-tag" :class="{'bg-con-ie':isIE,'bg-con-iu':isIU,'bg-con-ue':isUE,'bg-con-uu':isUU}"></div>-->
      <!--<div class="itm-inner">-->
        <div class="title-todo" >
          <span class="todo-content" :class="{ 'text-grey': item.pIsDone, 'text-mid-line': item.pIsDone,'margin-left':isCheckable}">
            {{ item.pTitle }}
          </span>
          <span class="delayer" :class="{'is-alert': isDelay}" v-show="isDelay">延期{{delayDays}}天</span>
        </div>
        <v-touch class="" v-if="isCheckable" @tap="clickCheckOut">
          <i class="icon2-check-box select"
             :class="{'icon-check_box_outline_blank': !item.pIsDone, 'icon-check': item.pIsDone}"></i>
          <div class="hide" :class="{'for-hide':item.pIsDone}"></div>
          <i class="icon2-selected hide" :class="{'isdisplay':item.pIsDone}"></i>
        </v-touch>

       <!--<div class="itm-icons itm-icons&#45;&#45;white-bg u-abs-right">-->
          <!--&lt;!&ndash;<i class="icon icon-access_alarm" v-if="item.clockAlert"></i>&ndash;&gt;-->
          <!--&lt;!&ndash;<i class="icon icon-move_to_inbox" v-if="item.senderTodo"></i>&ndash;&gt;-->
        <!--</div>-->
      <!--</div>-->
    </v-touch>
  </li>
</template>
<style lang="scss" scope>
  .contain-tag {position:absolute;left:0;height:20px;width:2px;top:50%;margin-top:-10px;}
  .title-todo{
    display: flex;
    align-items: center;
  }
  .margin-left{
    margin-left: 0.8rem;
  }
  .todo-content{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
  }
  .hide{
    display: none;
  }
  .isdisplay{
    display: block;
    position:absolute;
    top:0.45rem;
    left: 0.13rem;
    font-size: 15px;
    color:#55A8FD;
  }
  .for-hide{
    position: absolute;
    top:0.52rem;
    left: 0.39rem;
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
    margin-left: 13px;
  }
  li{
    padding:0;
    line-height:1.612rem ;
    height: 1.612rem;
    position: relative;
    border-bottom:1px solid #DADADA ;
  }
  .item-title{}
  .select{
    color:#69ACEF;
    font-size: 17px;
    position: absolute;
    top:0.55rem;
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
      isDelay () { return this.delayDays > 0 }
    },
    methods: {
      clickItem (e) {
        //  这个是点击跳到编辑界面
        if (e.target.className.indexOf('jsItemCheckbox') === -1) {
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
