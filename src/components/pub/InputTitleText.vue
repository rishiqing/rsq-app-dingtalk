<template>
	<div class="">
		<div class="">
			<div class="" :style="[paddingObject]">
				<input type="text" placeholder="输入任务标题"
               ref="titleInput"
               :value="itemTitle"
				       @input="inputChange($event.target.value)"
				       @blur="inputBlur($event.target.value)">
			</div>
			<v-touch class=""
			     v-if="isCheckable"
			     @tap="clickCheckOut">
				<i class="icon"
				   :class="{'icon-check_box_outline_blank': !itemChecked, 'icon-check': itemChecked}"></i>
			</v-touch>
		</div>
	</div>
</template>
<style scoped>
@import "icomoon2.css";
input::-webkit-input-placeholder { /* WebKit browsers */
  font-family: PingFangSC-Regular;
  font-size: 19px;
  color: #8C8C8C;
  letter-spacing: 0;
  padding-left: 0.3rem;
}
input[type='text']{
  height:1.458rem;
  background: #FFFFFF;
  border-bottom:0.5px solid #DADADA ;
  border-top:0.5px solid #DADADA ;
  line-height:1.478rem ;
  background: #FFFFFF;
}
</style>
<script>
  export default {
    data () {
      return {}
    },
    computed: {
      paddingObject () {
        if (!this.isCheckable) {
          return {'padding-left': '0'}
        } else {
          return {}
        }
      }
    },
    props: {
      isCheckable: Boolean,
      itemTitle: String,
      itemChecked: Boolean
    },
    methods: {
      inputBlur (value) {
        this.$refs.titleInput.value = value
        this.$emit('text-blur', value)
      },
      inputChange (value) {
        this.$refs.titleInput.value = value
        this.$emit('text-change', value)
      },
      clickCheckOut () {
        this.$emit('click-checkout', !this.itemChecked)
      }
    }
  }
</script>
