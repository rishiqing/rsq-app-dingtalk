<template>
	<li class="c-todo-item u-cf">
		<v-touch class="itm-outer" @tap="clickItem($event)">
			<!--<div class="contain-tag" :class="{'bg-con-ie':isIE,'bg-con-iu':isIU,'bg-con-ue':isUE,'bg-con-uu':isUU}"></div>-->
			<div class="itm-inner">
				<div class="itm-title" v-model="tian" :class="{'u-padding-left-40': isCheckable, 'text-grey': item.pIsDone, 'text-mid-line': item.pIsDone}">{{ item.pTitle }} 延期{{tian}}天</div>
				<v-touch class="itm-icons u-abs-left jsItemCheckbox" v-if="isCheckable" @tap="clickCheckOut">
					<i class="jsItemCheckbox icon"
					   :class="{'icon-check_box_outline_blank': !item.pIsDone, 'icon-check': item.pIsDone}"></i>
				</v-touch>

        <div class="itm-icons itm-icons--white-bg u-abs-right">
          <i class="icon icon-access_alarm" v-if="item.clockAlert"></i>
          <i class="icon icon-move_to_inbox" v-if="item.senderTodo"></i>
        </div>
			</div>
		</v-touch>
	</li>
</template>
<style lang="scss" scope>
	.contain-tag {position:absolute;left:0;height:20px;width:2px;top:50%;margin-top:-10px;}
</style>
<script>
	export default{
		name: 'TodoItem',
		data(){
			return{};
		},
		props: {
			//item: Object,
      item:{
        pIsDone:false,
      },
			isCheckable: Boolean
		},
		computed: {
			isIE(){return this.item.pContainer == 'IE';},
			isIU(){return this.item.pContainer == 'IU';},
			isUE(){return this.item.pContainer == 'UE';},
			isUU(){return this.item.pContainer == 'UU';},
      tian(){
			  var nowday=new Date().getDate()
      }
		},
		methods: {
			clickItem: function(e){//这个是点击跳到编辑界面
				if(e.target.className.indexOf('jsItemCheckbox') == -1){
					this.$emit('todo-item-click', this.item);
					e.preventDefault();
				}
			},
			clickCheckOut: function(e){
				this.$emit('todo-item-check', this.item, !this.item.pIsDone);
				e.preventDefault();
			}
		}
	};
</script>
