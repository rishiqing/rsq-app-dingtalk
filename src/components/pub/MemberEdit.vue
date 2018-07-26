<template>
  <ul>
    <li v-for="item in departList">
      <v-touch @tap="gotoMember(item)">
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
      departList () {
        return this.$store.state.userList
      }
    },
    methods: {
      gotoMember (item) {
        this.$store.commit('SAVE_MEMBER', item.userList)
        this.$router.push('/pub/MemberList')
      }
    }
  }
</script>
<style>

</style>
