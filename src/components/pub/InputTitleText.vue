<template>
	<div class="itm-outer">
		<div class="itm-inner">
			<div class="itm-title" :style="[paddingObject]">
				<input type="text" placeholder="请输入标题"
				       ref="input"
               :value="value"
				       @input="inputChange($event.target.value)"
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
			value: String,
			itemChecked: Boolean
		},
		methods: {
			inputBlur(){
				this.$emit('text-blur', this.value);
			},
			inputChange(value){
        this.$refs.input.value = value;
				this.$emit('input', value);
			},
			clickCheckOut(){
				this.itemChecked = !this.itemChecked;
				this.$emit('click-checkout', !this.itemChecked);
			}
		}
	};
</script>
