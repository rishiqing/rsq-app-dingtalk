<template>
  <div id="app" class="rsq-webview">
    <router-view></router-view>
    <r-nav v-if="isAddNav" v-show="isShowNav"></r-nav>
    <r-guide v-if="isShowGuide"></r-guide>
  </div>
</template>
<script>
  import Nav from 'com/Nav'
  import Guide from 'com/pub/RemindWindow'

  export default {
    name: 'app',
    computed: {
      isAddNav () {
        return this.$store.state.env.isAddNav
      },
      isShowNav () {
        return this.$store.state.env.isShowNav
      },
      isShowGuide () {
        return this.$store.state.env.isShowGuide
      }
    },
    components: {
      'r-nav': Nav,
      'r-guide': Guide
    }
  }
</script>
<style>
  .rsq-webview{
    background-color: #F8F8F8;
    height:100%;
    -webkit-overflow-scrolling: touch;
  }
</style>
