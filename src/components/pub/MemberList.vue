<template>
  <ul>
    <li v-for="item in memeberList">
      <v-touch>
        <span>{{item.name}}</span>
      </v-touch>
    </li>
  </ul>

</template>
<script>
  export default {
    data () {
      return {
      }
    },
    computed: {
      memeberList () {
        return this.$store.state.memeberList
      }
    },
    methods: {
    }
  }
</script>
<style>

</style>
