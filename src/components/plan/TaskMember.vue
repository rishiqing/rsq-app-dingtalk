<template>
  <div class="task-member">
    <avatar
      v-for="item in local"
      :key="item.rsqUserId"
      :src="item.avatar"
      :username="item.name"
      :background-color="'rgb(74, 144, 226)'"
      class="avatar"/>
    <div class="fix" />
  </div>
</template>
<script>
  import util from 'ut/jsUtil'
  import Avatar from 'com/pub/TextAvatar'

  export default {
    name: 'TaskMember',
    components: {
      'avatar': Avatar
    },
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        local: []
      }
    },
    computed: {
      loginUser () {
        return this.$store.getters.loginUser || {}
      },
      userId () {
        return this.loginUser.authUser.userId
      }
    },
    mounted () {
      var corpId = this.loginUser.authUser.corpId
      this.$store.dispatch('fetchUseridFromRsqid', {corpId: corpId, idArray: this.item.joinUserIds.split(',')})
        .then(idMap => {
          this.local = util.getMapValuePropArray(idMap)
        })
    }
  }

</script>
<style lang="scss" scoped>
  .task-member{
    margin-top: 0.2rem;
    max-height: 24px;
    overflow: hidden;
  }
  .task-member> *{
    border-radius: 0;
  }
  .avatar{
    float: left;
    margin-right: 3px;
  }
  .fix{
    clear: both
  }
</style>
