<template>
  <div id="app" class="rsq-webview">
    <router-view></router-view>
    <r-nav v-if="isAddNav" v-show="isShowNav"></r-nav>
  </div>
</template>
<script>
  import Nav from 'com/Nav'

  export default {
    name: 'app',
    computed: {
      isAddNav () {
        return this.$store.state.env.isAddNav
      },
      isShowNav () {
        return this.$store.state.env.isShowNav
      }
    },
    components: {
      'r-nav': Nav
    }
  }
</script>
<style>
  .rsq-webview{
    background-color: #F8F8F8;
    height:100%;
  }




</style>
