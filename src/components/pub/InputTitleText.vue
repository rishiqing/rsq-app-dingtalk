<template>
	<div class="itm-outer">
		<div class="itm-inner">
			<div class="itm-title" :style="[paddingObject]">
				<input type="text" placeholder="输入任务标题"
               ref="titleInput"
               :value="itemTitle"
				       @input="inputChange($event.target.value)"
				       @blur="inputBlur($event.target.value)">
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
        this.itemChecked = !this.itemChecked
        this.$emit('click-checkout', !this.itemChecked)
      }
    }
  }
</script>
