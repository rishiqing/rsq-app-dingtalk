<template>
	<div class="sche-view">
    hello sche index.vue
	</div>
</template>
<script>
export default {
  data () {
    return {}
  },
  methods: {},
  mounted () {
    this.$store.dispatch('setNav', true)
  }
}
</script>
