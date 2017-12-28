<template>
  <div id="app" class="rsq-webview">
    <router-view></router-view>
    <r-nav v-if="isAddNav" v-show="isShowNav"></r-nav>
    <r-guide v-if="isShowGuide"></r-guide>
    <transition name="fade">
      <div class="wrap-start-img" v-if="engine">
        <div class="wrap-inside">
          <img ref="imgStart" src="../src/assets/img/start.png" alt="" class="start-img">
          <p class="start-text">欢迎使用日事清,即刻开始享受工作...</p>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  import Nav from 'com/Nav'
  import Guide from 'com/pub/RemindWindow'

  export default {
    name: 'app',
    data () {
      return {
        engine: true,
        count: 0
      }
    },
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
    watch: {
      count () {
        console.log('改变了')
        this.engine = true
      }
    },
    components: {
      'r-nav': Nav,
      'r-guide': Guide
    },
    mounted () {
//      var that = this
//      this.$refs.imgStart.onload = () => {
//        console.log('进来了')
//        that.count ++
//      }
      window.setTimeout(
        () => {
          console.log(this)
          this.engine = false
        }, 2000
      )
    }
  }
</script>
<style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
    opacity: 0
  }
  .wrap-inside{
    text-align: center;
  }
  .wrap-start-img{
    background: #3296FA;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1006;
    width: 100%;
    height: 100%;
  }
  .start-img{
    /*width: 181px;*/
    /*height: 281px;*/
    width: 4.826rem;
    height: 7.493rem;
  }
  .start-text{
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    color: #FFFFFF;
    margin-top: 54px;
  }
  .rsq-webview{
    background-color: #F8F8F8;
    height:100%;
    -webkit-overflow-scrolling: touch;
  }
</style>
