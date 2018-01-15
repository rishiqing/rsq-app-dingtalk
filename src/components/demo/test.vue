<template>
  <v-touch class="wrap-icon">
    <i class="icon2-schedule sche-test"></i>
    <div class="test-img">
      <img src="http://cdn2.jianshu.io/assets/default_avatar/15-a7ac401939dd4df837e3bbf82abaa2a8.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/120/h/120" alt="">
      <img src="http://cdn2.jianshu.io/assets/default_avatar/15-a7ac401939dd4df837e3bbf82abaa2a8.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/120/h/120" alt="">
      <!--<img src="http://cdn2.jianshu.io/assets/default_avatar/15-a7ac401939dd4df837e3bbf82abaa2a8.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/120/h/120" alt="">-->
    </div>
    <!--<i class="icon2-check-box icon-box"></i>-->
    <!--<v-touch>-->
      <!--<span class="content">我是第一个</span>-->
    <!--</v-touch>-->
    <div class="member">2个</div>
    <i class="icon2-arrow-right icon-arrow"></i>
  </v-touch>
</template>
<style scoped>
  .sche-test{
    margin-left: 10px;
  }
  .icon-arrow .icon-box{
    font-size: 18px;
    display: inline-block;
    float: right;
    margin-left: 20px;
  }
  .wrap-icon{
    border: 1px solid red;
    height: 2rem;
    display: flex;
    align-items: center;
  }
  .content{
    font-size: 22px;
  }
  .member{
    font-size: 22px;
    float: right;
  }
  .test-img>img{
    width: 25px;
    height: 25px;
    float: right;
    margin-right: 5px;
  }
  .test-img{
    margin-left: 3.5rem;
    width: 3rem;
  }
</style>
<script>
  export default {
    data () {
      return {}
    },
    methods: {
      SwitchToexplain () {
        this.$store.commit('SYS_GUIDE_SHOW', {isShow: false})
        window.rsqadmg.exec('setItem', this.$store.state.env.version)
        this.$router.push('/pub/explain')
      },
      SwitchTosche () {
        this.$store.commit('SYS_GUIDE_SHOW', {isShow: false})
        window.rsqadmg.exec('setItem', this.$store.state.env.version)
      }
    }
  }
</script>
