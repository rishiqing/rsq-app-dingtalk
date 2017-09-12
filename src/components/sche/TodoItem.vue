<template>
	<li class="">
		<v-touch class="" @tap="clickItem($event)">
			<!--<div class="contain-tag" :class="{'bg-con-ie':isIE,'bg-con-iu':isIU,'bg-con-ue':isUE,'bg-con-uu':isUU}"></div>-->
			<!--<div class="itm-inner">-->
				<!--<div class="itm-title" :class="{'u-padding-left-40': isCheckable, 'text-grey': item.pIsDone, 'text-mid-line': item.pIsDone}">-->
          <span class="todo-content">{{ item.pTitle }}</span>
          <!--<span class="delayer" :class="{'is-alert': isDelay}" v-show="isDelay">延期{{delayDays}}天</span>-->
        <!--</div>-->
				<v-touch class="" v-if="isCheckable" @tap="clickCheckOut">
					<i class="icon2-check-box select"
					   :class="{'icon-check_box_outline_blank': !item.pIsDone, 'icon-check': item.pIsDone}"></i>
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
  @import "icomoon2.css";
	.contain-tag {position:absolute;left:0;height:20px;width:2px;top:50%;margin-top:-10px;}
  .todo-content{
    margin-left: 0.8rem;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
    display: block;

  }
  .delayer{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #FF7A7A;
    letter-spacing: 0;
  }
  li{
    padding:0;
    line-height:1.612rem ;
    height: 1.612rem;
    position: relative;
    border-bottom:1px solid #DADADA ;
  }
  .item-title{

  }
  .select{
    font-size: 17px;
    position: absolute;
    top:0.55rem;
    background: #FFFFFF;
    border: 1px solid #69ACEF;
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
