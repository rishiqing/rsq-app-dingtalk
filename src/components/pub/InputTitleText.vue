<template>
	<div class="itm-outer">
		<div class="itm-inner">
			<div class="itm-title" :style="[paddingObject]">
				<input type="text" placeholder="请输入标题"
				       v-model="itemTitle"
				       @input="inputChange"
				       @blur="inputBlur">
			</div>
			<v-touch class="itm-icons itm-front-icons u-abs-left"
			     v-if="isCheckable"
			     @tap="clickCheckOut">
				<i class="icon"
				   :class="{'icon-check_box_outline_blank': !itemChecked, 'icon-check': itemChecked}"></i>
			</v-touch>
		</div>
	</div>
</template>
<style lang="scss">

</style>
<script>
	export default{
		data(){
			return{};
		},
		computed: {
			paddingObject(){
				if(!this.isCheckable){
					return {'padding-left': '0'};
				}else{
					return {};
				}
			}
		},
		props: {
			isCheckable: Boolean,
			itemTitle: String,
			itemChecked: Boolean
		},
		methods: {
			inputBlur(){
				this.$dispatch('text-blur', this.itemTitle);
			},
			inputChange(){
				this.$dispatch('text-change', this.itemTitle);
			},
			clickCheckOut(){
				this.itemChecked = !this.itemChecked;
				this.$dispatch('click-checkout', !this.itemChecked);
			}
		}
	};
</script>
