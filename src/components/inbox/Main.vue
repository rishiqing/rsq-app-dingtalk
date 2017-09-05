<template>
	<div class="">
    <input type="text">
    <ul>
    <li v-for="shouna in shounas">
      {{shouna.text}}
    </li>
    </ul>
	</div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  methods: {

  },
  mounted () {
    this.$store.dispatch('setNav', true)
  }
}
</script>
